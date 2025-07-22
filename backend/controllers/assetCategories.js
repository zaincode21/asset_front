const model = require('../models/assetCategories');

exports.getAllCategories = async (req, res) => {
  try {
    const { organization_id } = req.query;
    if (!organization_id) return res.status(400).json({ error: 'organization_id is required' });
    const cats = await model.getAll(organization_id);
    res.json(cats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getCategoryById = async (req, res) => {
  try {
    const cat = await model.getById(req.params.id);
    if (!cat) return res.status(404).json({ error: 'Not found' });
    res.json(cat);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createCategory = async (req, res) => {
  try {
    const cat = await model.create(req.body);
    res.status(201).json(cat);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const cat = await model.update(req.params.id, req.body);
    res.json(cat);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}; 