import pool from "../config/pgDb.config";

/**
 * To check whether an ENUM exists on the DB
 * @param typeName - ENUM
 * @returns true | false
 */

export const checkExistingEnum = async (typeName: string): Promise<boolean> => {
  const result = await pool.query(`SELECT to_regtype('${typeName.toLocaleLowerCase()}') AS exists;`);

  return result.rows[0].exists !== null ? true : false;
};
