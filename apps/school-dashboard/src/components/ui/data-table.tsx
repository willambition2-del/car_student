import React, { useState } from "react";
import { SearchInput } from "./input";
import { Button } from "./button";
import { ChevronRight, ChevronLeft, Download, Filter } from "lucide-react";

export interface Column<T> {
  header: string;
  accessor: keyof T | ((row: T) => React.ReactNode);
  className?: string;
}

export interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  searchPlaceholder?: string;
  onSearchChange?: (term: string) => void;
  actions?: React.ReactNode;
  emptyTitle?: string;
}

export function DataTable<T extends { id: string | number }>({
  columns,
  data,
  searchPlaceholder = "ابحث بالجدول...",
  actions,
  emptyTitle = "لا توجد بيانات مطابقة للفلترة حالياً",
}: DataTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  const filteredData = data.filter((row) => {
    if (!searchTerm) return true;
    return Object.values(row).some(
      (val) => val && String(val).toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const totalPages = Math.ceil(filteredData.length / pageSize) || 1;
  const paginatedData = filteredData.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="w-full bg-white border border-[#E3EAF3] rounded-2xl shadow-xs overflow-hidden flex flex-col">
      {/* Table Toolbar */}
      <div className="p-4 border-b border-[#E3EAF3] flex flex-wrap items-center justify-between gap-3 bg-[#F5F8FC]/50">
        <div className="w-full sm:w-72">
          <SearchInput
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" icon={<Filter className="w-4 h-4" />}>
            تصفية
          </Button>
          <Button variant="outline" size="sm" icon={<Download className="w-4 h-4" />}>
            تصدير
          </Button>
          {actions}
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-right text-xs text-[#13233A]">
          <thead className="bg-[#F5F8FC] border-b border-[#E3EAF3] text-[#66758A] font-bold text-xs uppercase">
            <tr>
              {columns.map((col, idx) => (
                <th key={idx} className={`p-4 ${col.className || ""}`}>
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E3EAF3]">
            {paginatedData.length > 0 ? (
              paginatedData.map((row) => (
                <tr key={row.id} className="hover:bg-[#F5F8FC]/60 transition-colors">
                  {columns.map((col, idx) => (
                    <td key={idx} className={`p-4 align-middle ${col.className || ""}`}>
                      {typeof col.accessor === "function" ? col.accessor(row) : (row[col.accessor] as React.ReactNode)}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="p-8 text-center text-[#66758A]">
                  {emptyTitle}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="p-4 border-t border-[#E3EAF3] flex items-center justify-between text-xs text-[#66758A] bg-[#F5F8FC]/30">
        <span>
          عرض {paginatedData.length} من إجمالي {filteredData.length} سجل
        </span>
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          >
            <ChevronRight className="w-4 h-4" /> السابقة
          </Button>
          <span className="font-bold text-[#13233A]">
            صفحة {currentPage} من {totalPages}
          </span>
          <Button
            variant="secondary"
            size="sm"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
          >
            التالية <ChevronLeft className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
