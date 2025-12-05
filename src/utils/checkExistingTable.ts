import pool from "../config/pgDb.config";

export const checkExistingTable = async (tableName: string): Promise<boolean> => {
  const result = await pool.query(`SELECT to_regclass('public.${tableName}') As exists;`);

  return result.rows[0].exists !== null ? true : false;
};
