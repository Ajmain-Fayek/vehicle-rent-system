import { TableColumns } from "../types";

/**
 * Create an update record query dynamically
 *
 * @param tableName - database table name
 * @param data - Data object
 * @param condition - WHERE clause tuple [ field, value ]
 * @param returning - "*" to get all | Array of fields
 * @returns object { query: string; values: string[] } - which can be used in pool.query()
 */

export const updateRecordQuery = async <T extends keyof TableColumns>(
  tableName: T,
  data: Partial<TableColumns[T]>,
  condition: [keyof TableColumns[T], TableColumns[T][keyof TableColumns[T]]],
  returning: "*" | (keyof TableColumns[T])[]
): Promise<{ query: string; values: any[] }> => {
  const setClause = [];
  const values = [];
  let index = 1;

  for (const [key, value] of Object.entries(data)) {
    if (value !== undefined) {
      setClause.push(`${key} = $${index}`);
      values.push(value);
      index++;
    }
  }

  if (setClause.length === 0) {
    throw new Error("No fields provided to update");
  }

  const setString = setClause.join(", ");
  const whereClause = `${String(condition[0])} = $${index}`;
  values.push(condition[1]);

  const returningClause =
    returning === "*" ? "RETURNING *" : returning && returning.length > 0 ? `RETURNING ${returning.join(", ")}` : "";

  const queryString = `UPDATE ${tableName.toLowerCase()} SET ${setString} WHERE ${whereClause} ${returningClause}`;

  return {
    query: String(queryString),
    values: values,
  };
};
