const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ProjectSchema = new Schema({
  name: {type:String, required:true},
  description: {type:String},
  members: [{type:Schema.Types.ObjectId, ref:'User'}],
  admins: [{type:Schema.Types.ObjectId, ref:'User'}],
  createdBy: {type:Schema.Types.ObjectId, ref:'User'},
  createdAt: {type:Date, default: Date.now}
});
module.exports = mongoose.model('Project', ProjectSchema);
