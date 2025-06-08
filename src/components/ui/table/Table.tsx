// src/components/ui/table/Table.tsx
import React from 'react';
import { ArrowUpDown, MoreHorizontal } from 'lucide-react';
import { Button } from '../basic';


export interface Column {
  key: string;
  label: string;
  width?: string;
  sortable?: boolean;
}

export interface RowData {
  id: string | number;
  [key: string]: any;
}

export interface TableProps {
  columns: Column[];
  data: RowData[];
  onSort: (key: string) => void;
  sortColumn?: string;
  sortDirection?: 'asc' | 'desc';
  selected?: Array<string | number>;
  onSelect?: (ids: Array<string | number>) => void;
  loading?: boolean;
}

const Table: React.FC<TableProps> = ({
  columns,
  data,
  onSort,
  sortColumn,
  sortDirection,
  selected = [],
  onSelect,
  loading = false,
}) => {
  if (loading) {
    return (
      <div className="border border-slate-200 rounded-lg overflow-hidden">
        <div className="bg-slate-50 px-6 py-3 border-b border-slate-200">
          <div className="flex items-center space-x-4">
            {columns.map((_, i) => (
              <div
                key={i}
                className="h-4 bg-slate-200 rounded animate-pulse flex-1"
              />
            ))}
          </div>
        </div>
        {[...Array(5)].map((_, i) => (
          <div key={i} className="px-6 py-4 border-b border-slate-200 last:border-b-0">
            <div className="flex items-center space-x-4">
              {columns.map((_, j) => (
                <div
                  key={j}
                  className="h-4 bg-slate-100 rounded animate-pulse flex-1"
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="border border-slate-200 rounded-lg overflow-hidden">
      <table className="w-full">
        <thead className="bg-slate-50">
          <tr>
            {onSelect && (
              <th className="w-12 px-6 py-3 text-left">
                <input
                  type="checkbox"
                  checked={selected.length === data.length && data.length > 0}
                  onChange={(e) =>
                    onSelect(
                      e.target.checked ? data.map((item) => item.id) : []
                    )
                  }
                  className="rounded border-slate-300 text-slate-900 focus:ring-slate-500"
                />
              </th>
            )}
            {columns.map((column) => (
              <th
                key={column.key}
                className={`px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider ${column.width || ''}`}
              >
                {column.sortable ? (
                  <button
                    onClick={() => onSort(column.key)}
                    className="flex items-center gap-1 hover:text-slate-700"
                  >
                    {column.label}
                    <ArrowUpDown className="w-3 h-3" />
                  </button>
                ) : (
                  column.label
                )}
              </th>
            ))}
            <th className="w-16 px-6 py-3"></th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-slate-200">
          {data.map((row) => (
            <tr key={row.id} className="hover:bg-slate-50">
              {onSelect && (
                <td className="px-6 py-4">
                  <input
                    type="checkbox"
                    checked={selected.includes(row.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        onSelect([...selected, row.id]);
                      } else {
                        onSelect(selected.filter((id) => id !== row.id));
                      }
                    }}
                    className="rounded border-slate-300 text-slate-900 focus:ring-slate-500"
                  />
                </td>
              )}
              {columns.map((column) => (
                <td key={column.key} className="px-6 py-4 text-sm">
                  {column.key === 'status' ? (
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        row[column.key] === 'active'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {row[column.key]}
                    </span>
                  ) : column.key === 'name' ? (
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-slate-900 text-white rounded-full flex items-center justify-center text-xs font-semibold">
                        {String(row.name).charAt(0)}
                      </div>
                      <span className="font-medium text-slate-900">{row[column.key]}</span>
                    </div>
                  ) : (
                    <span className="text-slate-900">{row[column.key]}</span>
                  )}
                </td>
              ))}
              <td className="px-6 py-4 text-right">
                <Button variant="outline" size="sm">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;