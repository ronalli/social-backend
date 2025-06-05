export const createOrderByClause = (sortBy: string, sortDirection: string) => {
  return sortBy === 'createdAt'
    ? `"${sortBy}" ${sortDirection}`
    : `"${sortBy}" COLLATE "C" ${sortDirection}`;
};


export const createOrderByClauseTest = (sortBy: string, sortDirection: string) => {
  return sortBy === 'createdAt'
    ? ["${sortBy}", `${sortDirection}`]
    : ["${sortBy}", `COLLATE "C" ${sortDirection}`];
};