"use client";

import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { deleteContact, updateContact } from "../../../server/contact.action";

import DataTableDeleteButton from "@/components/data-table/DataTableDeleteButton";
import DataTableSearch from "@/components/data-table/DataTableSearch";
import { DataTableViewOptions } from "@/components/data-table/DataTableViewOptions";
import { Lead } from "@/db/schema";
import NewContactForm from "./NewContactForm";
import { useState } from "react";

interface ContactsTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  tableData: TData[];
  leads: Lead[];
}

export function ContactsTable<TData, TValue>({
  columns,
  tableData,
  leads,
}: ContactsTableProps<TData, TValue>) {
  const [data, setData] = useState<TData[]>(tableData);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>([
    { id: "contactName", desc: false },
  ]);
  const [rowSelectionState, setRowSelectionState] = useState({});

  const addContact = (newContact: any) => {
    setData((prevContacts) => [...prevContacts, newContact]);
  };
  const primaryFields = ["contactName", "leadId", "jobTitle"];

  const updateData = async ({
    rowIndex,
    columnId,
    newValue,
    itemId,
  }: {
    rowIndex: number;
    columnId: string;
    newValue: string;
    itemId: string;
  }) => {
    try {
      setData((prev) =>
        prev.map((row, index) =>
          index === rowIndex
            ? {
                ...prev[rowIndex],
                [columnId]: newValue,
              }
            : row
        )
      );
      const response = await updateContact({
        columnId,
        newValue,
        itemId,
      });
      if (!response.success) {
        return {
          success: false,
          message: "Coudln't successfully execute updateData function",
        };
      }
      return {
        success: true,
        message: "UpdateData function successfully executed",
      };
    } catch (error) {
      console.log("error", error);
    }
  };

  const deleteData = async (itemIds: string[]) => {
    try {
      const response = await deleteContact(itemIds);
      if (!response.success) {
        return {
          success: false,
          message: response.message,
        };
      }
      setData((prev) => prev.filter((row: any) => !itemIds.includes(row.id)));
      table.resetRowSelection();
      return {
        success: true,
        message: response.message,
      };
    } catch (error) {
      console.log("error", error);
      return {
        success: false,
        message: "Internal Error",
      };
    }
  };

  const table = useReactTable<TData>({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelectionState,
    state: {
      columnFilters,
      sorting,
      rowSelection: rowSelectionState,
    },
    meta: {
      updateData,
      deleteData,
    },
  });

  return (
    <>
      <section className="px-6 py-5 flex flex-col justify-between h-screen gap-6">
        <div className="flex flex-row items-center justify-between">
          <h1 className="text-xl font-semibold">Contacts</h1>
          <div className="flex flex-row gap-2">
            <div>
              <DataTableDeleteButton
                table={table}
                description="This action can't be undone. Are you sure you want to delete these contacts?"
              />
            </div>
            <div>
              <DataTableViewOptions
                table={table}
                primaryFields={primaryFields}
              />
            </div>
            <DataTableSearch
              table={table}
              primaryField="contactName"
              primaryFieldPrettyName="Contact"
            />
            <NewContactForm addContact={addContact} leadList={leads} />
          </div>
        </div>
        <div className="overflow-y-auto custom-scrollbar min-h-[89vh]">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody className="cursor-pointer">
              {table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </section>
    </>
  );
}