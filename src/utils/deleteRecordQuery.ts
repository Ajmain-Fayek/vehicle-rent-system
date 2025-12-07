/**
 * Create a delete record query dynamically
 * @param tableName - database table name
 * @param condition - WHERE clause tuple [ field, value ]
 * @returns object { query: string; values: string[] } - which can be used in pool.query()
 */

import { TdeleteColumn, Ttables } from "../types";

export const deleteRecordQuery = async (
  tableName: Ttables,
  condition: [field: string, value: string]
): Promise<{ query: string; values: string[] }> => {
  const values = [];
  let index = 1;

  const whereClaus = `${condition[0]} = $${index}`;

  values.push(condition[1]);

  const queryString = `DELETE FROM ${tableName.toLocaleLowerCase()} WHERE ${whereClaus}`;

  return {
    query: String(queryString),
    values: values,
  };
};
