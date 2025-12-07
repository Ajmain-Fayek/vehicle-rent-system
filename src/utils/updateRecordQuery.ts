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
  data: Record<TableColumns[T], string>,
  condition: [field: TableColumns[T], value: string],
  returning: "*" | TableColumns[T][]
): Promise<{ query: string; values: any[] }> => {
  const setClause = [];
  const values = [];
  let index = 1;

  for (const [key, value] of Object.entries(data)) {
    setClause.push(`${key} = $${index}`);
    values.push(value);

    index++;
  }

  const setString = setClause.join(", ");

  const whereClaus = `${condition[0]} = $${index}`;

  values.push(condition[1]);

  const returningClause =
    returning === "*"
      ? "RETURNING *"
      : returning && returning.length === 1
      ? `RETURNING ${returning[0]}`
      : returning && returning.length > 1
      ? `RETURNING ${returning.join(", ")}`
      : "";

  const queryString = `UPDATE ${tableName.toLocaleLowerCase()} SET ${setString} WHERE ${whereClaus} ${returningClause}`;

  return {
    query: String(queryString),
    values: values,
  };
};
