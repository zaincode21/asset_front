const Asset = require('../models/assets');

// List all assets (optionally filter by organization)
exports.getAllAssets = async (req, res) => {
  try {
    const { organization_id } = req.query;
    const assets = await Asset.getAllAssets({ organization_id });
    res.json(assets);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch assets', details: err.message });
  }
};

// Get asset by ID
exports.getAssetById = async (req, res) => {
  try {
    const asset = await Asset.getAssetById(req.params.id);
    if (!asset) return res.status(404).json({ error: 'Asset not found' });
    res.json(asset);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch asset', details: err.message });
  }
};

// Create asset
exports.createAsset = async (req, res) => {
  try {
    const data = req.body;
    if (!data.organization_id || !data.asset_tag || !data.name || !data.category_id || !data.location_id) {
      return res.status(400).json({ error: 'organization_id, asset_tag, name, category_id, and location_id are required' });
    }
    const asset = await Asset.createAsset(data);
    res.status(201).json(asset);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create asset', details: err.message });
  }
};

// Update asset
exports.updateAsset = async (req, res) => {
  try {
    const asset = await Asset.updateAsset(req.params.id, req.body);
    res.json(asset);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update asset', details: err.message });
  }
};

// Delete asset (soft delete)
exports.deleteAsset = async (req, res) => {
  try {
    await Asset.deleteAsset(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete asset', details: err.message });
  }
};

// Checkout asset
exports.checkoutAsset = async (req, res) => {
  try {
    const { assigned_to } = req.body;
    if (!assigned_to) return res.status(400).json({ error: 'assigned_to is required for checkout' });
    const asset = await Asset.checkoutAsset(req.params.id, { assigned_to, status: 'checked_out' });
    res.json(asset);
  } catch (err) {
    res.status(500).json({ error: 'Failed to checkout asset', details: err.message });
  }
};

// Checkin asset
exports.checkinAsset = async (req, res) => {
  try {
    const asset = await Asset.checkinAsset(req.params.id, { status: 'available' });
    res.json(asset);
  } catch (err) {
    res.status(500).json({ error: 'Failed to checkin asset', details: err.message });
  }
}; 