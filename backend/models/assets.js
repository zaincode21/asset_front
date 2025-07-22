const db = require('../db');

// Get all assets (with joins for category, location, assigned user)
async function getAllAssets({ organization_id }) {
  let query = `SELECT a.*, c.name AS category_name, l.name AS location_name, u.name AS assigned_to_name
    FROM assets a
    LEFT JOIN asset_categories c ON a.category_id = c.id
    LEFT JOIN locations l ON a.location_id = l.id
    LEFT JOIN users u ON a.assigned_to = u.id
    WHERE a.is_active = true`;
  const params = [];
  if (organization_id) {
    query += ' AND a.organization_id = $1';
    params.push(organization_id);
  }
  query += ' ORDER BY a.created_at DESC';
  const { rows } = await db.query(query, params);
  return rows;
}

// Get asset by ID
async function getAssetById(id) {
  const { rows } = await db.query(
    `SELECT a.*, c.name AS category_name, l.name AS location_name, u.name AS assigned_to_name
     FROM assets a
     LEFT JOIN asset_categories c ON a.category_id = c.id
     LEFT JOIN locations l ON a.location_id = l.id
     LEFT JOIN users u ON a.assigned_to = u.id
     WHERE a.id = $1`,
    [id]
  );
  return rows[0];
}

// Create asset
async function createAsset(data) {
  const {
    organization_id, asset_tag, name, description, category_id, serial_number, model, manufacturer,
    purchase_date, purchase_price, current_value, depreciation_method, useful_life, condition, status,
    location_id, assigned_to, warranty_expiry, next_maintenance, custom_fields, images, documents, qr_code
  } = data;
  const { rows } = await db.query(
    `INSERT INTO assets (
      organization_id, asset_tag, name, description, category_id, serial_number, model, manufacturer,
      purchase_date, purchase_price, current_value, depreciation_method, useful_life, condition, status,
      location_id, assigned_to, warranty_expiry, next_maintenance, custom_fields, images, documents, qr_code
    ) VALUES (
      $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23
    ) RETURNING *`,
    [organization_id, asset_tag, name, description, category_id, serial_number, model, manufacturer,
      purchase_date, purchase_price, current_value, depreciation_method, useful_life, condition, status,
      location_id, assigned_to, warranty_expiry, next_maintenance, custom_fields || {}, images || [], documents || [], qr_code]
  );
  return rows[0];
}

// Update asset
async function updateAsset(id, data) {
  // Only update fields present in data
  const fields = [];
  const values = [];
  let idx = 1;
  for (const key in data) {
    fields.push(`${key} = $${idx}`);
    values.push(data[key]);
    idx++;
  }
  values.push(id);
  const { rows } = await db.query(
    `UPDATE assets SET ${fields.join(', ')}, updated_at = NOW() WHERE id = $${idx} RETURNING *`,
    values
  );
  return rows[0];
}

// Delete asset (soft delete)
async function deleteAsset(id) {
  await db.query('UPDATE assets SET is_active = false, updated_at = NOW() WHERE id = $1', [id]);
  return true;
}

// Checkout asset
async function checkoutAsset(id, { assigned_to, status }) {
  const { rows } = await db.query(
    `UPDATE assets SET status = $1, assigned_to = $2, updated_at = NOW() WHERE id = $3 RETURNING *`,
    [status || 'checked_out', assigned_to, id]
  );
  return rows[0];
}

// Checkin asset
async function checkinAsset(id, { status }) {
  const { rows } = await db.query(
    `UPDATE assets SET status = $1, assigned_to = NULL, updated_at = NOW() WHERE id = $2 RETURNING *`,
    [status || 'available', id]
  );
  return rows[0];
}

module.exports = {
  getAllAssets,
  getAssetById,
  createAsset,
  updateAsset,
  deleteAsset,
  checkoutAsset,
  checkinAsset
}; 