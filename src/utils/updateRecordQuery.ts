/**
 * Create an update record query dynamically
 * @param tableName - database table name
 * @param data - Data object
 * @param condition - WHERE clause tuple [ field, value ]
 * @returns object { query: string; values: string[] } - which can be used in pool.query()
 */

export const updateRecordQuery = async (
  tableName: string,
  data: Record<string, string>,
  condition: [field: string, value: string]
): Promise<{ query: string; values: string[] }> => {
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

  const queryString = `UPDATE ${tableName.toLocaleLowerCase()} SET ${setString} WHERE ${whereClaus} RETURNING *`;

  return {
    query: String(queryString),
    values: values,
  };
};
