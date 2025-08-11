const Destination = require('../models/Destination');
const Post = require('../models/Post');

exports.getAll = async (req, res) => {
  const d = await Destination.find();
  res.json(d);
};

exports.getById = async (req, res) => {
  const dest = await Destination.findById(req.params.id);
  const posts = await Post.find({ destination: dest._id }).sort({ date: -1 });
  res.json({ destination: dest, posts });
};

exports.create = async (req, res) => {
  const { name, description, coverImage } = req.body;
  const dest = new Destination({ name, description, coverImage });
  await dest.save();
  res.json(dest);
};

exports.update = async (req, res) => {
  const dest = await Destination.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(dest);
};

exports.remove = async (req, res) => {
  await Destination.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
};