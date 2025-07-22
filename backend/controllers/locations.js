const locationModel = require('../models/locations');

exports.getAllLocations = async (req, res) => {
  try {
    const { organization_id } = req.query;
    const locations = await locationModel.getAll(organization_id);
    res.json(locations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getLocationById = async (req, res) => {
  try {
    const location = await locationModel.getById(req.params.id);
    if (!location) return res.status(404).json({ error: 'Not found' });
    res.json(location);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createLocation = async (req, res) => {
  try {
    const location = await locationModel.create(req.body);
    res.status(201).json(location);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.updateLocation = async (req, res) => {
  try {
    const location = await locationModel.update(req.params.id, req.body);
    res.json(location);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteLocation = async (req, res) => {
  try {
    await locationModel.remove(req.params.id);
    res.status(204).send();
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}; 