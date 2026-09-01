import React from 'react';
import Progress from 'components/progress';
import Card from 'components/card';

import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';
type RowObj = {
  name: string[];
  artworks: number;
  rating: number;
};
import Image from 'next/image';

function CheckTable(props: { tableData: any }) {
  const { tableData } = props;
  const [sorting, setSorting] = React.useState<SortingState>([]);
  let defaultData = tableData;
  const columns = [
    columnHelper.accessor('name', {
      id: 'name',
      header: () => (
        <p className="text-sm font-bold text-text-secondary">NAME</p>
      ),
      cell: (info: any) => (
        <div className="flex items-center gap-2">
          <div className="h-[30px] w-[30px] rounded-full">
            <Image
              width="2"
              height="20"
              src={info.getValue()[1]}
              className="h-full w-full rounded-full"
              alt=""
            />
          </div>
          <p className="text-sm font-medium text-text-primary">
            {info.getValue()[0]}
          </p>
        </div>
      ),
    }),
    columnHelper.accessor('artworks', {
      id: 'artworks',
      header: () => (
        <p className="text-sm font-bold text-text-secondary">
          ARTWORKS
        </p>
      ),
      cell: (info) => (
        <p className="text-md font-medium text-text-secondary">
          {info.getValue()}
        </p>
      ),
    }),
    columnHelper.accessor('rating', {
      id: 'rating',
      header: () => (
        <p className="text-sm font-bold text-text-secondary">
          RATING
        </p>
      ),
      cell: (info) => (
        <div className="mx-2 flex font-bold">
          <Progress width="w-16" value={info.getValue()} />
        </div>
      ),
    }),
  ]; // eslint-disable-next-line
  const [data, setData] = React.useState(() => [...defaultData]);
  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    debugTable: true,
  });
  return (
    <Card extra={'w-full sm:overflow-auto px-6'}>
      <header className="relative flex items-center justify-between pt-4">
        <div className="text-xl font-bold text-text-primary">
          Check Table
        </div>

        <button className="dark:active-bg-surface-20 linear rounded-[20px] bg-background px-4 py-2 text-base font-medium text-accent transition duration-200 hover:bg-gray-100 active:bg-border dark:bg-surface/5 dark:hover:bg-surface/10">
          See all
        </button>
      </header>

      <div className="mt-8 overflow-x-scroll xl:overflow-x-hidden">
        <table className="w-full">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="!border-px !border-gray-400">
                {headerGroup.headers.map((header) => {
                  return (
                    <th
                      key={header.id}
                      colSpan={header.colSpan}
                      onClick={header.column.getToggleSortingHandler()}
                      className="cursor-pointer border-b border-border pb-2 pr-4 pt-4 text-start"
                    >
                      <div className="items-center justify-between text-xs text-gray-200">
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                        {{
                          asc: '',
                          desc: '',
                        }[header.column.getIsSorted() as string] ?? null}
                      </div>
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody>
            {table
              .getRowModel()
              .rows.slice(0, 5)
              .map((row) => {
                return (
                  <tr key={row.id}>
                    {row.getVisibleCells().map((cell) => {
                      return (
                        <td
                          key={cell.id}
                          className="min-w-[150px] border-white/0 py-3 pr-4"
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

export default CheckTable;
const columnHelper = createColumnHelper<RowObj>();
