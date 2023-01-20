import { useLoaderData } from "@remix-run/react";
import React, { useState } from "react";
import type { ColumnDef, FilterFn, RowData } from "@tanstack/react-table";
import { getFilteredRowModel } from "@tanstack/react-table";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { json } from "@remix-run/server-runtime";
import type { Player } from "~/models/player.server";
import { playerAll } from "~/models/player.server";
import { rankItem } from "@tanstack/match-sorter-utils";

declare module "@tanstack/react-table" {
  interface TableMeta<TData extends RowData> {
    updateData: (rowIndex: number, columnId: string, value: unknown) => void;
  }
}

const columnHelper = createColumnHelper<Pick<Player, "name" | "level">>();

const columns = [
  columnHelper.accessor("name", {
    header: () => "Nombre",
    cell: (info) => info.getValue(),
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor("level", {
    header: () => "Level",
    cell: (info) => info.renderValue(),
    footer: (info) => info.column.id,
  }),
];

const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  // Rank the item
  const itemRank = rankItem(row.getValue(columnId), value);

  // Store the itemRank info
  addMeta({
    itemRank,
  });

  // Return if the item should be filtered in/out
  return itemRank.passed;
};

function PlayerTable() {
  const { players } = useLoaderData<typeof loader>();
  const [data, setData] = React.useState(() => [...players]);
  const [globalFilter, setGlobalFilter] = React.useState("");

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: fuzzyFilter,
    state: {
      globalFilter,
    },
    meta: {
      updateData: (rowIndex, columnId, value) => {
        // Skip age index reset until after next rerender
        // skipAutoResetPageIndex();
        setData((old) =>
          old.map((row, index) => {
            if (index === rowIndex) {
              return {
                ...old[rowIndex]!,
                [columnId]: value,
              };
            }
            return row;
          })
        );
      },
    },
    debugTable: true,
  });

  return (
    <div>
      <input
        className="mb-4 w-full max-w-3xl rounded border border-gray-300  p-2"
        type="text"
        value={globalFilter}
        onChange={(event) => setGlobalFilter(event.target.value)}
        placeholder="Buscar..."
      />
      <div className="max-h-[400px] max-w-3xl overflow-auto p-2">
        <table className="m-auto w-full  table-auto border-collapse text-sm">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="border-b p-4 pl-8 pt-0 pb-3 text-left font-medium text-slate-400 dark:border-slate-600 dark:text-slate-200"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className="border-b border-slate-100 p-4 pl-8 text-slate-500 dark:border-slate-700 dark:text-slate-400"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <div className="h-4" />
      </div>
    </div>
  );
}

export async function loader() {
  const players = await playerAll();
  return json({ players });
}

export default function PlayerIndexPage() {
  return (
    <div>
      <PlayerTable />
    </div>
  );
}
