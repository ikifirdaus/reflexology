interface Column<T> {
  header: string;
  accessor: keyof T | string;
  cell?: (row: T) => React.ReactNode;
}

interface TableProps<T> {
  data: T[];
  columns: Column<T>[];
  currentPage: number;
  perPage: number;
}

export default function Table<T>({
  data,
  columns,
  currentPage,
  perPage,
}: TableProps<T>) {
  return (
    <div className="overflow-x-auto mt-3 border rounded-md border-spacing-0 border-gray-300">
      <table className="min-w-full">
        <thead>
          <tr className="bg-gray-100">
            {columns.map((column) => (
              <th
                key={String(column.accessor)}
                className="px-4 py-2 text-left border-b"
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex} className="hover:bg-gray-50">
              {columns.map((column, columnIndex) => (
                <td
                  key={String(column.accessor)}
                  className="px-4 py-1 border-b text-gray-700"
                >
                  {column.accessor === "no"
                    ? // Hitung nomor global
                      (currentPage - 1) * perPage + rowIndex + 1
                    : column.cell
                    ? column.cell(row)
                    : String(row[column.accessor as keyof T])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
