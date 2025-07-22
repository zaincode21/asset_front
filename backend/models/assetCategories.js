const pool = require('../db');

exports.getAll = async (organization_id) => {
  const { rows } = await pool.query(
    'SELECT * FROM asset_categories WHERE organization_id = $1 AND is_active = true ORDER BY created_at DESC',
    [organization_id]
  );
  return rows;
};

exports.getById = async (id) => {
  const { rows } = await pool.query('SELECT * FROM asset_categories WHERE id = $1', [id]);
  return rows[0];
};

exports.create = async (data) => {
  const query = `
    INSERT INTO asset_categories
      (organization_id, name, description, icon, color, custom_fields, is_active)
    VALUES
      ($1, $2, $3, $4, $5, $6, $7)
    RETURNING *
  `;
  const values = [
    data.organization_id,
    data.name,
    data.description,
    data.icon,
    data.color,
    data.custom_fields || {},
    data.is_active !== undefined ? data.is_active : true
  ];
  const { rows } = await pool.query(query, values);
  return rows[0];
};

exports.update = async (id, data) => {
  const query = `
    UPDATE asset_categories SET
      name = $1,
      description = $2,
      icon = $3,
      color = $4,
      custom_fields = $5,
      is_active = $6,
      updated_at = NOW()
    WHERE id = $7
    RETURNING *
  `;
  const values = [
    data.name,
    data.description,
    data.icon,
    data.color,
    data.custom_fields || {},
    data.is_active !== undefined ? data.is_active : true,
    id
  ];
  const { rows } = await pool.query(query, values);
  return rows[0];
}; 