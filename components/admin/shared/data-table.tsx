"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { SearchInput } from "./search-input";

export interface DataTableColumn<T> {
  header: string;
  accessor: keyof T | ((row: T) => React.ReactNode);
  cell?: (value: any, row: T) => React.ReactNode;
}

export interface DataTableAction<T> {
  label: string;
  onClick: (row: T) => void;
  icon?: React.ReactNode;
  variant?: "default" | "destructive";
}

interface DataTableProps<T> {
  title: string;
  data: T[];
  columns: DataTableColumn<T>[];
  actions?: DataTableAction<T>[];
  searchKeys?: (keyof T)[];
  emptyMessage?: string;
  headerAction?: React.ReactNode;
}

/**
 * Generic data table component for admin pages
 * Supports search, custom columns, and row actions
 */
export function DataTable<T extends Record<string, any>>({
  title,
  data,
  columns,
  actions = [],
  searchKeys = [],
  emptyMessage = "No data found",
  headerAction,
}: DataTableProps<T>) {
  const [search, setSearch] = useState("");

  // Filter data based on search
  const filteredData = data.filter((row) => {
    if (!search) return true;

    const searchLower = search.toLowerCase();
    return searchKeys.some((key) => {
      const value = row[key];
      if (value === null || value === undefined) return false;
      return String(value).toLowerCase().includes(searchLower);
    });
  });

  // Get cell value
  const getCellValue = (row: T, column: DataTableColumn<T>) => {
    if (typeof column.accessor === "function") {
      return column.accessor(row);
    }
    return row[column.accessor];
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-4">
          <CardTitle>{title}</CardTitle>
          {headerAction}
        </div>
        {searchKeys.length > 0 && (
          <div className="flex items-center gap-4 mt-4">
            <SearchInput value={search} onChange={setSearch} placeholder={`Search ${title.toLowerCase()}...`} />
          </div>
        )}
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column, index) => (
                <TableHead key={index}>{column.header}</TableHead>
              ))}
              {actions.length > 0 && <TableHead className="w-[50px]" />}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length + (actions.length > 0 ? 1 : 0)}
                  className="text-center text-muted-foreground"
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            ) : (
              filteredData.map((row, rowIndex) => (
                <TableRow key={rowIndex}>
                  {columns.map((column, colIndex) => {
                    const value = getCellValue(row, column);
                    return (
                      <TableCell key={colIndex}>
                        {column.cell ? column.cell(value, row) : value}
                      </TableCell>
                    );
                  })}
                  {actions.length > 0 && (
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          {actions.map((action, actionIndex) => (
                            <DropdownMenuItem
                              key={actionIndex}
                              onClick={() => action.onClick(row)}
                              className={
                                action.variant === "destructive"
                                  ? "text-destructive"
                                  : ""
                              }
                            >
                              {action.icon}
                              {action.label}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
