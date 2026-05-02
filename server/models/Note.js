const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const NoteSchema = new Schema({
  title: {type:String, required:true},
  content: {type:String},
  dueAt: {type:Date},
  createdBy: {type:Schema.Types.ObjectId, ref:'User'},
  createdAt: {type:Date, default: Date.now}
});

module.exports = mongoose.model('Note', NoteSchema);
