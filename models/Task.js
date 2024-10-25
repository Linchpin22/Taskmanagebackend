const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true, // Mark title as required
  },
  description: {
    type: String,
    required: true, // Mark description as required
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true, // Mark assignedTo as required
  },

}, { timestamps: true }); // Automatically manages createdAt and updatedAt timestamps

module.exports = mongoose.model('Task', taskSchema);
