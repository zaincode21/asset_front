const pool = require('../db');

exports.getAll = async () => {
  const { rows } = await pool.query('SELECT * FROM organizations ORDER BY created_at DESC');
  return rows;
};

exports.getById = async (id) => {
  const { rows } = await pool.query('SELECT * FROM organizations WHERE id = $1', [id]);
  return rows[0];
};

exports.create = async (data) => {
  const query = `
    INSERT INTO organizations
      (code, name, legal_name, tax_id, parent_company_id, base_currency_code, country_code, accounting_standards, fiscal_year_end, time_zone, settings, status, plan_type, max_assets, max_users, slug)
    VALUES
      ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
    RETURNING *
  `;
  const values = [
    data.code,
    data.name,
    data.legal_name,
    data.tax_id,
    data.parent_company_id || null,
    data.base_currency_code,
    data.country_code,
    data.accounting_standards,
    data.fiscal_year_end,
    data.time_zone,
    data.settings || {},
    data.status,
    data.plan_type,
    data.max_assets,
    data.max_users,
    data.slug
  ];
  const { rows } = await pool.query(query, values);
  return rows[0];
};

exports.update = async (id, data) => {
  const query = `
    UPDATE organizations SET
      code = $1,
      name = $2,
      legal_name = $3,
      tax_id = $4,
      parent_company_id = $5,
      base_currency_code = $6,
      country_code = $7,
      accounting_standards = $8,
      fiscal_year_end = $9,
      time_zone = $10,
      settings = $11,
      status = $12,
      plan_type = $13,
      max_assets = $14,
      max_users = $15,
      slug = $16,
      updated_at = NOW()
    WHERE id = $17
    RETURNING *
  `;
  const values = [
    data.code,
    data.name,
    data.legal_name,
    data.tax_id,
    data.parent_company_id || null,
    data.base_currency_code,
    data.country_code,
    data.accounting_standards,
    data.fiscal_year_end,
    data.time_zone,
    data.settings || {},
    data.status,
    data.plan_type,
    data.max_assets,
    data.max_users,
    data.slug,
    id
  ];
  const { rows } = await pool.query(query, values);
  return rows[0];
};

exports.remove = async (id) => {
  await pool.query('DELETE FROM organizations WHERE id = $1', [id]);
}; 