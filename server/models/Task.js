const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const TaskSchema = new Schema({
  title: {type:String, required:true},
  description: {type:String},
  dueDate: {type:Date},
  priority: {type:String, enum:['low','medium','high'], default:'medium'},
  status: {type:String, enum:['todo','inprogress','done'], default:'todo'},
  project: {type:Schema.Types.ObjectId, ref:'Project'},
  assignee: {type:Schema.Types.ObjectId, ref:'User'},
  createdAt: {type:Date, default: Date.now}
});
module.exports = mongoose.model('Task', TaskSchema);
