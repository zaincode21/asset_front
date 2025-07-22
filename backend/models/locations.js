const pool = require('../db');

exports.getAll = async (organization_id) => {
  let query = 'SELECT * FROM locations';
  const params = [];
  if (organization_id) {
    query += ' WHERE organization_id = $1';
    params.push(organization_id);
  }
  query += ' ORDER BY created_at DESC';
  const { rows } = await pool.query(query, params);
  return rows;
};

exports.getById = async (id) => {
  const { rows } = await pool.query('SELECT * FROM locations WHERE id = $1', [id]);
  return rows[0];
};

exports.create = async (data) => {
  const query = `
    INSERT INTO locations
      (organization_id, name, description, parent_id, address, latitude, longitude, is_active)
    VALUES
      ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING *
  `;
  const values = [
    data.organization_id,
    data.name,
    data.description || null,
    data.parent_id || null,
    data.address || null,
    data.latitude || null,
    data.longitude || null,
    data.is_active !== undefined ? data.is_active : true
  ];
  const { rows } = await pool.query(query, values);
  return rows[0];
};

exports.update = async (id, data) => {
  const query = `
    UPDATE locations SET
      organization_id = $1,
      name = $2,
      description = $3,
      parent_id = $4,
      address = $5,
      latitude = $6,
      longitude = $7,
      is_active = $8,
      updated_at = NOW()
    WHERE id = $9
    RETURNING *
  `;
  const values = [
    data.organization_id,
    data.name,
    data.description || null,
    data.parent_id || null,
    data.address || null,
    data.latitude || null,
    data.longitude || null,
    data.is_active !== undefined ? data.is_active : true,
    id
  ];
  const { rows } = await pool.query(query, values);
  return rows[0];
};

exports.remove = async (id) => {
  await pool.query('DELETE FROM locations WHERE id = $1', [id]);
}; 