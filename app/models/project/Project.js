const mongoose = require('../../../database');

const ProjectSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'user', require: true },
    tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'task', require: true }],
    createdAt: { type: Date, default: Date.now }
});

const project = mongoose.model('project', ProjectSchema);

module.exports = project;