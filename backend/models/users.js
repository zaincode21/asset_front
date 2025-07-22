const pool = require('../db');

exports.getAll = async (organization_id) => {
  const { rows } = await pool.query(
    'SELECT * FROM users WHERE organization_id = $1 AND is_active = true ORDER BY created_at DESC',
    [organization_id]
  );
  return rows;
};

exports.getById = async (id) => {
  const { rows } = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
  return rows[0];
};

exports.create = async (data) => {
  const query = `
    INSERT INTO users
      (organization_id, email, password_hash, first_name, last_name, role, permissions, is_active, last_login, password_reset_token, password_reset_expires, email_verified, email_verification_token)
    VALUES
      ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
    RETURNING *
  `;
  const values = [
    data.organization_id,
    data.email,
    data.password_hash,
    data.first_name,
    data.last_name,
    data.role || 'user',
    data.permissions || {},
    data.is_active !== undefined ? data.is_active : true,
    data.last_login || null,
    data.password_reset_token || null,
    data.password_reset_expires || null,
    data.email_verified !== undefined ? data.email_verified : false,
    data.email_verification_token || null
  ];
  const { rows } = await pool.query(query, values);
  return rows[0];
};

exports.update = async (id, data) => {
  const query = `
    UPDATE users SET
      email = $1,
      first_name = $2,
      last_name = $3,
      role = $4,
      permissions = $5,
      is_active = $6,
      last_login = $7,
      email_verified = $8,
      updated_at = NOW()
    WHERE id = $9
    RETURNING *
  `;
  const values = [
    data.email,
    data.first_name,
    data.last_name,
    data.role,
    data.permissions || {},
    data.is_active !== undefined ? data.is_active : true,
    data.last_login || null,
    data.email_verified !== undefined ? data.email_verified : false,
    id
  ];
  const { rows } = await pool.query(query, values);
  return rows[0];
};

exports.softDelete = async (id) => {
  await pool.query('UPDATE users SET is_active = false, updated_at = NOW() WHERE id = $1', [id]);
};

exports.getByEmail = async (email) => {
  const { rows } = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  return rows[0];
};

exports.setEmailVerificationToken = async (id, token) => {
  await pool.query('UPDATE users SET email_verification_token = $1, updated_at = NOW() WHERE id = $2', [token, id]);
};

exports.verifyEmail = async (id) => {
  await pool.query('UPDATE users SET email_verified = true, email_verification_token = NULL, updated_at = NOW() WHERE id = $1', [id]);
}; 