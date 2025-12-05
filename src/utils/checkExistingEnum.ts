import pool from "../config/pgDb.config";

export const checkExistingEnum = async (typeName: string): Promise<boolean> => {
  const result = await pool.query(`SELECT to_regtype('${typeName}') AS exists;`);

  return result.rows[0].exists !== null ? true : false;
};
