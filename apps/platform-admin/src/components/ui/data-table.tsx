"use client";

import React, { useState } from "react";
import { SearchInput } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChevronRight, ChevronLeft } from "lucide-react";

export interface Column<T> {
  header: string;
  accessor: keyof T | ((row: T) => React.ReactNode);
  className?: string;
}

export interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  searchPlaceholder?: string;
  onSearchChange?: (val: string) => void;
}

export function DataTable<T extends Record<string, any>>({
  columns,
  data,
  searchPlaceholder = "بحث بالجدول...",
}: DataTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  const filteredData = data.filter((row) => {
    if (!searchTerm) return true;
    return Object.values(row).some(
      (val) => val && val.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const totalPages = Math.ceil(filteredData.length / pageSize) || 1;
  const paginatedData = filteredData.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="space-y-4 text-right">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <SearchInput
          placeholder={searchPlaceholder}
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          className="max-w-md"
        />
        <div className="text-xs text-[#66758A]">
          إجمالي النتائج: <span className="font-bold text-[#13233A] font-mono">{filteredData.length}</span>
        </div>
      </div>

      <div className="w-full overflow-x-auto rounded-2xl border border-[#E3EAF3] bg-white shadow-sm">
        <table className="w-full text-right border-collapse text-sm">
          <thead>
            <tr className="bg-[#F5F8FC] border-b border-[#E3EAF3] text-[#66758A] font-semibold text-xs">
              {columns.map((col, idx) => (
                <th key={idx} className={`p-4 ${col.className || ""}`}>
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E3EAF3] text-[#13233A]">
            {paginatedData.length > 0 ? (
              paginatedData.map((row, rowIdx) => (
                <tr key={rowIdx} className="hover:bg-[#F5F8FC]/50 transition-colors">
                  {columns.map((col, colIdx) => (
                    <td key={colIdx} className={`p-4 ${col.className || ""}`}>
                      {typeof col.accessor === "function" ? col.accessor(row) : row[col.accessor]}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="p-8 text-center text-[#66758A] text-xs">
                  لا توجد نتائج تطابق خيارات البحث
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between text-xs text-[#66758A]">
          <span>
            الصفحة <span className="font-bold text-[#13233A]">{currentPage}</span> من{" "}
            <span className="font-bold text-[#13233A]">{totalPages}</span>
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              icon={<ChevronRight className="w-4 h-4" />}
            >
              السابقة
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              icon={<ChevronLeft className="w-4 h-4" />}
            >
              التالية
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
