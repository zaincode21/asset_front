const orgModel = require('../models/organizations');

exports.getAllOrganizations = async (req, res) => {
  try {
    const orgs = await orgModel.getAll();
    res.json(orgs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getOrganizationById = async (req, res) => {
  try {
    const org = await orgModel.getById(req.params.id);
    if (!org) return res.status(404).json({ error: 'Not found' });
    res.json(org);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createOrganization = async (req, res) => {
  try {
    const org = await orgModel.create(req.body);
    res.status(201).json(org);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.updateOrganization = async (req, res) => {
  try {
    const org = await orgModel.update(req.params.id, req.body);
    res.json(org);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteOrganization = async (req, res) => {
  try {
    await orgModel.remove(req.params.id);
    res.status(204).send();
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}; 