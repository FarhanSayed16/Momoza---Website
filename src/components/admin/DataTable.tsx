import React from 'react'

interface DataTableProps {
  columns: string[]
  children: React.ReactNode
}

export const DataTable = ({ columns, children }: DataTableProps) => {
  return (
    <div className="w-full overflow-x-auto rounded-2xl border border-zinc-800 bg-zinc-900 shadow-sm">
      <table className="w-full text-left text-sm text-zinc-400">
        <thead className="bg-zinc-800/50 text-xs uppercase text-zinc-500 border-b border-zinc-800">
          <tr>
            {columns.map((col, idx) => (
              <th key={idx} scope="col" className="px-6 py-4 font-medium">
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-800">
          {children}
        </tbody>
      </table>
    </div>
  )
}
