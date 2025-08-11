const Post = require('../models/Post');

exports.getAll = async (req, res) => {
  const posts = await Post.find().sort({ date: -1 }).populate('destination');
  res.json(posts);
};

exports.getById = async (req, res) => {
  const post = await Post.findById(req.params.id).populate('destination');
  res.json(post);
};

exports.create = async (req, res) => {
  const { title, content, destination, images } = req.body;
  const post = new Post({ title, content, destination, images });
  await post.save();
  res.json(post);
};

exports.update = async (req, res) => {
  const post = await Post.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(post);
};

exports.remove = async (req, res) => {
  await Post.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
};