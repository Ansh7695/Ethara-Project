require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

const Contact = require('./models/Contact');
const User = require('./models/User');
const Project = require('./models/Project');
const Task = require('./models/Task');
const Note = require('./models/Note');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const mongo = process.env.MONGODB_URI || 'mongodb://localhost:27017/nebula_bento';
mongoose.connect(mongo, {useNewUrlParser:true, useUnifiedTopology:true}).then(()=>{
  console.log('Connected to MongoDB');
}).catch(err=>{
  console.error('Mongo connection error', err.message);
});

app.post('/api/contact', async (req,res)=>{
  try{
    const {name,email,message} = req.body;
    if(!name||!email) return res.status(400).json({error:'Name and email required'});
    const doc = new Contact({name,email,message});
    await doc.save();
    res.json({ok:true});
  }catch(e){
    console.error(e);
    res.status(500).json({error:'Internal error'});
  }
});

// Auth: demo signup / login
app.post('/api/auth/signup', async (req,res)=>{
  try{
    const {name,email,password} = req.body;
    if(!name||!email||!password) return res.status(400).json({error:'Missing fields'});
    const existing = await User.findOne({email});
    if(existing) return res.status(400).json({error:'Email exists'});
    const hash = await bcrypt.hash(password, 10);
    const u = new User({name,email,passwordHash:hash});
    await u.save();
    res.json({ok:true});
  }catch(e){console.error(e);res.status(500).json({error:'err'});}
});

app.post('/api/auth/login', async (req,res)=>{
  try{
    const {email,password} = req.body;
    const u = await User.findOne({email});
    if(!u) return res.status(400).json({error:'Invalid credentials'});
    const match = await bcrypt.compare(password, u.passwordHash || '');
    if(!match) return res.status(400).json({error:'Invalid credentials'});
    const token = jwt.sign({id:u._id,role:u.role,name:u.name,email:u.email}, process.env.JWT_SECRET || 'devsecret', {expiresIn:'7d'});
    res.json({token});
  }catch(e){console.error(e);res.status(500).json({error:'err'});}
});

// Demo login (returns admin demo token)
app.get('/api/auth/demo', async (req,res)=>{
  try{
    let admin = await User.findOne({email:'admin@demo.local'});
    if(!admin){
      admin = new User({name:'Demo Admin', email:'admin@demo.local', role:'admin', passwordHash: await bcrypt.hash('password',10)});
      await admin.save();
    }
    const token = jwt.sign({id:admin._id,role:admin.role,name:admin.name,email:admin.email}, process.env.JWT_SECRET || 'devsecret', {expiresIn:'7d'});
    res.json({token});
  }catch(e){console.error(e);res.status(500).json({error:'err'});}
});

// Simple auth middleware
function auth(req,res,next){
  const h = req.headers.authorization;
  if(!h) return res.status(401).json({error:'Unauth'});
  const parts = h.split(' ');
  if(parts.length!==2) return res.status(401).json({error:'Unauth'});
  const token = parts[1];
  try{
    const data = jwt.verify(token, process.env.JWT_SECRET || 'devsecret');
    req.user = data; next();
  }catch(e){return res.status(401).json({error:'Unauth'});
  }
}

// Projects endpoints
app.get('/api/projects', auth, async (req,res)=>{
  const projects = await Project.find({}).populate('members','name email').populate('createdBy','name');
  res.json(projects);
});

app.post('/api/projects', auth, async (req,res)=>{
  try{
    const {name,description} = req.body;
    const p = new Project({name,description, createdBy:req.user.id, members:[req.user.id], admins:[req.user.id]});
    await p.save();
    res.json(p);
  }catch(e){console.error(e);res.status(500).json({error:'err'});}
});

// Get single project
app.get('/api/projects/:id', auth, async (req,res)=>{
  try{
    const p = await Project.findById(req.params.id).populate('members','name email').populate('createdBy','name email');
    if(!p) return res.status(404).json({error:'Project not found'});
    res.json(p);
  }catch(e){console.error(e);res.status(500).json({error:'err'});}
});

// Add member to project (admin or project owner)
app.post('/api/projects/:id/members', auth, async (req,res)=>{
  try{
    const {memberId} = req.body;
    const p = await Project.findById(req.params.id);
    if(!p) return res.status(404).json({error:'Project not found'});
    // only global admin, project admin, or project creator can add members
    const isProjectAdmin = p.admins && p.admins.map(a => String(a)).includes(String(req.user.id));
    if(req.user.role !== 'admin' && !isProjectAdmin && String(p.createdBy) !== String(req.user.id)) return res.status(403).json({error:'Forbidden'});
    if(!memberId) return res.status(400).json({error:'memberId required'});
    if(p.members.map(m => String(m)).includes(String(memberId))) return res.status(400).json({error:'Member already present'});
    p.members.push(memberId);
    await p.save();
    const populated = await Project.findById(p._id).populate('members','name email');
    res.json(populated);
  }catch(e){console.error(e);res.status(500).json({error:'err'});}
});

// Remove member from project (admin or project owner)
app.delete('/api/projects/:id/members/:memberId', auth, async (req,res)=>{
  try{
    const {id, memberId} = req.params;
    const p = await Project.findById(id);
    if(!p) return res.status(404).json({error:'Project not found'});
    const isProjectAdmin = p.admins && p.admins.map(a => String(a)).includes(String(req.user.id));
    if(req.user.role !== 'admin' && !isProjectAdmin && String(p.createdBy) !== String(req.user.id)) return res.status(403).json({error:'Forbidden'});
    p.members = p.members.filter(m => String(m) !== String(memberId));
    await p.save();
    const populated = await Project.findById(p._id).populate('members','name email');
    res.json(populated);
  }catch(e){console.error(e);res.status(500).json({error:'err'});}
});

// Add project admin (only global admin or existing project admin/owner)
app.post('/api/projects/:id/admins', auth, async (req,res)=>{
  try{
    const {memberId} = req.body;
    const p = await Project.findById(req.params.id);
    if(!p) return res.status(404).json({error:'Project not found'});
    const isProjectAdmin = p.admins && p.admins.map(a => String(a)).includes(String(req.user.id));
    if(req.user.role !== 'admin' && !isProjectAdmin && String(p.createdBy) !== String(req.user.id)) return res.status(403).json({error:'Forbidden'});
    if(!memberId) return res.status(400).json({error:'memberId required'});
    if(p.admins.map(m => String(m)).includes(String(memberId))) return res.status(400).json({error:'Already an admin'});
    p.admins.push(memberId);
    if(!p.members.map(m => String(m)).includes(String(memberId))){ p.members.push(memberId); }
    await p.save();
    const populated = await Project.findById(p._id).populate('members','name email').populate('admins','name email');
    res.json(populated);
  }catch(e){console.error(e);res.status(500).json({error:'err'});}
});

// Remove project admin
app.delete('/api/projects/:id/admins/:memberId', auth, async (req,res)=>{
  try{
    const {id, memberId} = req.params;
    const p = await Project.findById(id);
    if(!p) return res.status(404).json({error:'Project not found'});
    const isProjectAdmin = p.admins && p.admins.map(a => String(a)).includes(String(req.user.id));
    if(req.user.role !== 'admin' && !isProjectAdmin && String(p.createdBy) !== String(req.user.id)) return res.status(403).json({error:'Forbidden'});
    p.admins = p.admins.filter(m => String(m) !== String(memberId));
    await p.save();
    const populated = await Project.findById(p._id).populate('members','name email').populate('admins','name email');
    res.json(populated);
  }catch(e){console.error(e);res.status(500).json({error:'err'});}
});

// Simple user lookup by email (used for inviting existing users)
app.get('/api/users', auth, async (req,res)=>{
  try{
    const email = req.query.email;
    if(!email) return res.status(400).json({error:'email query required'});
    const u = await User.findOne({email}).select('name email _id');
    if(!u) return res.status(404).json({error:'User not found'});
    res.json(u);
  }catch(e){console.error(e);res.status(500).json({error:'err'});}
});

// Tasks
app.get('/api/tasks', auth, async (req,res)=>{
  const tasks = await Task.find({}).populate('assignee','name email').populate('project','name');
  res.json(tasks);
});

app.post('/api/tasks', auth, async (req,res)=>{
  try{
    const {title,description,dueDate,priority,projectId,assigneeId} = req.body;
    if(!title) return res.status(400).json({error:'Title required'});
    const project = projectId ? await Project.findById(projectId) : null;
    if(projectId && !project) return res.status(400).json({error:'Project not found'});
    // if project specified, ensure assignee is a member or requester is admin
    if(project && assigneeId && req.user.role !== 'admin'){
      if(!project.members.map(m => String(m)).includes(String(assigneeId))) return res.status(403).json({error:'Assignee must be project member'});
    }
    const t = new Task({title,description,dueDate,priority,project:projectId,assignee:assigneeId});
    await t.save();
    res.json(t);
  }catch(e){console.error(e);res.status(500).json({error:'err'});}
});

app.put('/api/tasks/:id', auth, async (req,res)=>{
  try{
    const updates = req.body;
    const task = await Task.findById(req.params.id);
    if(!task) return res.status(404).json({error:'Task not found'});
    // only admin or assignee can update status/fields; changing assignee requires admin
    if(updates.assignee && String(updates.assignee) !== String(task.assignee) && req.user.role !== 'admin'){
      return res.status(403).json({error:'Only admin can reassign tasks'});
    }
    if(req.user.role !== 'admin' && String(task.assignee) !== String(req.user.id)){
      // allow non-admin only to update limited fields (status, description) for assigned tasks
      const allowed = ['status','description'];
      const diffKeys = Object.keys(updates).filter(k => !allowed.includes(k));
      if(diffKeys.length>0) return res.status(403).json({error:'Forbidden to update these fields'});
    }
    Object.assign(task, updates);
    await task.save();
    const populated = await Task.findById(task._id).populate('assignee','name email');
    res.json(populated);
  }catch(e){console.error(e);res.status(500).json({error:'err'});}
});

// Dashboard helper
app.get('/api/dashboard', auth, async (req,res)=>{
  try{
    const total = await Task.countDocuments();
    const todo = await Task.countDocuments({status:'todo'});
    const inprogress = await Task.countDocuments({status:'inprogress'});
    const done = await Task.countDocuments({status:'done'});
    const overdue = await Task.countDocuments({dueDate:{$lt: new Date()}, status:{$ne:'done'}});
    const perUserAgg = await Task.aggregate([{ $group: { _id: '$assignee', count: {$sum:1}}}]);
    res.json({total,todo,inprogress,done,overdue,perUser:perUserAgg});
  }catch(e){console.error(e);res.status(500).json({error:'err'});}
});

// Notes: per-user simple notes/todos
app.get('/api/notes', auth, async (req,res)=>{
  try{
    const notes = await Note.find({createdBy: req.user.id}).sort({dueAt:1, createdAt:-1});
    res.json(notes);
  }catch(e){console.error(e);res.status(500).json({error:'err'});}
});

app.post('/api/notes', auth, async (req,res)=>{
  try{
    const {title, content, dueAt} = req.body;
    if(!title) return res.status(400).json({error:'Title required'});
    const n = new Note({title, content, dueAt: dueAt ? new Date(dueAt) : null, createdBy: req.user.id});
    await n.save();
    res.json(n);
  }catch(e){console.error(e);res.status(500).json({error:'err'});}
});

app.put('/api/notes/:id', auth, async (req,res)=>{
  try{
    const updates = req.body;
    const note = await Note.findById(req.params.id);
    if(!note) return res.status(404).json({error:'Note not found'});
    if(String(note.createdBy) !== String(req.user.id) && req.user.role !== 'admin') return res.status(403).json({error:'Forbidden'});
    if(updates.dueAt) updates.dueAt = new Date(updates.dueAt);
    Object.assign(note, updates);
    await note.save();
    res.json(note);
  }catch(e){console.error(e);res.status(500).json({error:'err'});}
});

app.delete('/api/notes/:id', auth, async (req,res)=>{
  try{
    const note = await Note.findById(req.params.id);
    if(!note) return res.status(404).json({error:'Note not found'});
    if(String(note.createdBy) !== String(req.user.id) && req.user.role !== 'admin') return res.status(403).json({error:'Forbidden'});
    await note.remove();
    res.json({ok:true});
  }catch(e){console.error(e);res.status(500).json({error:'err'});}
});

// Seed demo data (idempotent)
app.post('/api/seed', async (req,res)=>{
  try{
    // create demo users
    let admin = await User.findOne({email:'admin@demo.local'});
    if(!admin){
      admin = new User({name:'Demo Admin', email:'admin@demo.local', role:'admin', passwordHash: await bcrypt.hash('password',10)});
      await admin.save();
    }
    let member = await User.findOne({email:'member@demo.local'});
    if(!member){
      member = new User({name:'Demo Member', email:'member@demo.local', role:'member', passwordHash: await bcrypt.hash('password',10)});
      await member.save();
    }
    // projects
    let p = await Project.findOne({name:'Website Redesign'});
    if(!p){
      p = new Project({name:'Website Redesign', description:'Revamp marketing site', members:[admin._id, member._id], createdBy:admin._id});
      await p.save();
    }
    // tasks
    const tcount = await Task.countDocuments({project:p._id});
    if(tcount === 0){
      const tasks = [
        {title:'Design hero', description:'Create hero comps', dueDate:new Date(Date.now()+86400000*5), priority:'high', status:'todo', project:p._id, assignee:admin._id},
        {title:'Implement responsive layout', description:'Make bento grid responsive', dueDate:new Date(Date.now()+86400000*7), priority:'medium', status:'inprogress', project:p._id, assignee:member._id},
        {title:'Setup analytics', description:'Add basic tracking', dueDate:new Date(Date.now()+86400000*3), priority:'low', status:'todo', project:p._id, assignee:member._id}
      ];
      await Task.insertMany(tasks);
    }
    res.json({ok:true});
  }catch(e){console.error(e);res.status(500).json({error:'err'});}
});

app.get('/api/health', (req,res)=>res.json({ok:true}));

const clientBuildPath = path.join(__dirname, '..', 'client', 'dist');
const clientIndexPath = path.join(clientBuildPath, 'index.html');

if (fs.existsSync(clientIndexPath)) {
  app.use(express.static(clientBuildPath));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api/')) return next();
    return res.sendFile(clientIndexPath);
  });
}

const port = process.env.PORT || 5000;
app.listen(port, ()=>console.log('Server listening on', port));
