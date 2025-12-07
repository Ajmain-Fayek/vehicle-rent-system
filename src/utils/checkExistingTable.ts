import pool from "../config/pgDb.config";

/**
 * To check whether a specific table exists in the DB.
 * @param tableName Database table name
 * @returns true | false
 */

export const checkExistingTable = async (tableName: string): Promise<boolean> => {
  const result = await pool.query(`SELECT to_regclass('public.${tableName.toLocaleLowerCase()}') As exists;`);

  return result.rows[0].exists !== null ? true : false;
};
