import * as React from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import { cn } from './utils';
import { VFLoadingTable } from './VFLoading';
import { VFEmptyState } from './VFEmptyState';
import { VFButton } from './VFButton';

// Base semantic table wrappers
export interface VFTableProps extends React.HTMLAttributes<HTMLTableElement> {
  containerClassName?: string;
  maxHeight?: string | number;
}

export function VFTable({ className, containerClassName, maxHeight, style, ...props }: VFTableProps) {
  return (
    <div
      className={cn(
        "w-full min-w-full overflow-auto no-scrollbar [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden border border-border rounded-[4px] bg-card",
        containerClassName
      )}
      style={maxHeight ? { maxHeight, ...style } : style}
    >
      <table className={cn("w-full min-w-full border-collapse text-left text-xs sm:text-sm table-auto", className)} {...props} />
    </div>
  );
}

export function VFTableHead({ className, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) {
  return <thead className={cn("bg-card/95 border-b border-border sticky top-0 z-10 backdrop-blur-md shadow-2xs", className)} {...props} />;
}

export function VFTableBody({ className, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) {
  return <tbody className={cn("divide-y divide-border/80", className)} {...props} />;
}

export function VFTableRow({ className, ...props }: React.HTMLAttributes<HTMLTableRowElement>) {
  return (
    <tr
      className={cn(
        "hover:bg-muted/30 transition-colors focus-within:bg-muted/30 outline-none",
        className
      )}
      {...props}
    />
  );
}

export interface VFTableHeaderCellProps extends React.ThHTMLAttributes<HTMLTableCellElement> {
  sticky?: boolean;
  maxWidth?: string | number;
  minWidth?: string | number;
  width?: string | number;
}

export function VFTableHeaderCell({
  className,
  sticky = true,
  maxWidth,
  minWidth,
  width,
  style,
  ...props
}: VFTableHeaderCellProps) {
  const mergedStyle: React.CSSProperties = {
    ...(maxWidth ? { maxWidth: typeof maxWidth === 'number' ? `${maxWidth}px` : maxWidth } : {}),
    ...(minWidth ? { minWidth: typeof minWidth === 'number' ? `${minWidth}px` : minWidth } : {}),
    ...(width ? { width: typeof width === 'number' ? `${width}px` : width } : {}),
    ...style,
  };

  return (
    <th
      style={mergedStyle}
      className={cn(
        "px-2.5 sm:px-3 py-2 sm:py-2.5 font-bold text-[11px] sm:text-xs text-muted-foreground uppercase tracking-wider select-none whitespace-nowrap bg-card/95 backdrop-blur-md",
        sticky && "sticky top-0 z-10 border-b border-border shadow-2xs",
        className
      )}
      {...props}
    />
  );
}

export interface VFTableCellProps extends React.TdHTMLAttributes<HTMLTableCellElement> {
  maxWidth?: string | number;
  minWidth?: string | number;
  width?: string | number;
  truncate?: boolean;
}

export function VFTableCell({
  className,
  maxWidth,
  minWidth,
  width,
  truncate = false,
  title,
  style,
  children,
  ...props
}: VFTableCellProps) {
  const mergedStyle: React.CSSProperties = {
    ...(maxWidth ? { maxWidth: typeof maxWidth === 'number' ? `${maxWidth}px` : maxWidth } : {}),
    ...(minWidth ? { minWidth: typeof minWidth === 'number' ? `${minWidth}px` : minWidth } : {}),
    ...(width ? { width: typeof width === 'number' ? `${width}px` : width } : {}),
    ...style,
  };

  const computedTitle = title ?? (truncate && (typeof children === 'string' || typeof children === 'number') ? String(children) : undefined);

  return (
    <td
      style={mergedStyle}
      title={computedTitle}
      className={cn(
        "px-2.5 sm:px-3 py-2 sm:py-2.5 align-middle text-foreground whitespace-nowrap text-xs sm:text-[13px] font-semibold",
        truncate && "truncate max-w-[220px]",
        className
      )}
      {...props}
    >
      {truncate ? (
        <div
          className="truncate"
          style={maxWidth ? { maxWidth: typeof maxWidth === 'number' ? `${maxWidth}px` : maxWidth } : undefined}
          title={computedTitle}
        >
          {children}
        </div>
      ) : (
        children
      )}
    </td>
  );
}

// VFDataTable: High-level, fail-safe data table component
export interface ColumnDef<T> {
  header: string;
  accessorKey: keyof T | string;
  cell?: (row: T) => React.ReactNode;
  sortable?: boolean;
  className?: string;
  headerClassName?: string;
  maxWidth?: string | number;
  minWidth?: string | number;
  width?: string | number;
  truncate?: boolean;
}

export interface VFDataTableProps<T> {
  columns: ColumnDef<T>[];
  data: T[];
  isLoading?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  pagination?: {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    totalItems: number;
    pageSize: number;
  };
  onSort?: (key: string, direction: 'asc' | 'desc') => void;
  showSearch?: boolean;
  filterPlaceholder?: string;
  onFilterChange?: (value: string) => void;
  leftActions?: React.ReactNode;
  rightActions?: React.ReactNode;
  className?: string;
  tableClassName?: string;
  showColumnToggle?: boolean;
}

export function VFDataTable<T extends Record<string, any>>({
  columns,
  data = [],
  isLoading = false,
  emptyTitle = "No records found",
  emptyDescription = "There are no records matching your query.",
  pagination,
  onSort,
  showSearch = true,
  filterPlaceholder,
  onFilterChange,
  leftActions,
  rightActions,
  className,
  tableClassName,
  showColumnToggle = true,
}: VFDataTableProps<T>) {
  const [sorting, setSorting] = React.useState<Array<{ id: string; desc: boolean }>>([]);
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [visibleColumns, setVisibleColumns] = React.useState<string[]>(
    columns.map((c) => String(c.accessorKey))
  );
  const [showColumnDropdown, setShowColumnDropdown] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowColumnDropdown(false);
      }
    };
    if (showColumnDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showColumnDropdown]);

  // Client-side Filtered & Sorted Data Fallback Array
  const processedData = React.useMemo(() => {
    let result = [...(data || [])];
    
    // Global filter search
    if (globalFilter.trim()) {
      const q = globalFilter.toLowerCase();
      result = result.filter((row: any) =>
        Object.values(row).some(
          (val) => val !== null && val !== undefined && String(val).toLowerCase().includes(q)
        )
      );
    }

    // Client-side sorting fallback
    if (sorting.length > 0) {
      const { id, desc } = sorting[0];
      result.sort((a: any, b: any) => {
        const valA = a[id];
        const valB = b[id];
        if (valA < valB) return desc ? 1 : -1;
        if (valA > valB) return desc ? -1 : 1;
        return 0;
      });
    }

    return result;
  }, [data, globalFilter, sorting]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setGlobalFilter(val);
    if (onFilterChange) onFilterChange(val);
  };

  const toggleColumn = (key: string) => {
    if (visibleColumns.includes(key)) {
      if (visibleColumns.length > 1) {
        setVisibleColumns(visibleColumns.filter((c) => c !== key));
      }
    } else {
      setVisibleColumns([...visibleColumns, key]);
    }
  };

  const activeColumns = columns.filter((col) => visibleColumns.includes(String(col.accessorKey)));

  const hasToolbar = showSearch || showColumnToggle || Boolean(rightActions) || Boolean(leftActions);

  return (
    <div className={cn("w-full min-w-full flex-1 flex flex-col min-h-0 bg-card border border-border/90 rounded-[4px] shadow-xs overflow-hidden", className)}>
      {/* Unified Table Header Command Toolbar */}
      {hasToolbar && (
        <div className="p-2.5 sm:p-3 border-b border-border bg-card flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-2.5 shrink-0">
          {showSearch ? (
            <div className="relative max-w-md flex-1">
              <Search className="h-3.5 w-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
              <input
                type="text"
                value={globalFilter}
                onChange={handleFilterChange}
                placeholder={filterPlaceholder || "Search records..."}
                className="w-full pl-9 pr-3.5 h-8 border border-border rounded-[4px] bg-muted/40 hover:bg-muted/70 focus:bg-background text-xs focus:border-primary/50 focus:ring-1 focus:ring-primary/20 focus:outline-none transition-all text-foreground placeholder:text-muted-foreground font-medium"
              />
            </div>
          ) : (
            <div className="flex items-center gap-2">
              {leftActions}
            </div>
          )}

          {/* Right Controls: Column Visibility Selector + Action Buttons */}
          {(showColumnToggle || rightActions) && (
            <div className="flex items-center gap-2 shrink-0 ml-auto self-end sm:self-auto">
              {/* Column Visibility Selector Dropdown */}
              {showColumnToggle && (
                <div className="relative" ref={dropdownRef}>
                  <VFButton
                    variant="outline"
                    size="sm"
                    onClick={() => setShowColumnDropdown(!showColumnDropdown)}
                    leftIcon={<SlidersHorizontal className="h-3.5 w-3.5 text-muted-foreground" />}
                  >
                    Columns ({activeColumns.length}/{columns.length})
                  </VFButton>
                  {showColumnDropdown && (
                    <div className="absolute right-0 mt-2 w-56 bg-card border border-border rounded-[4px] shadow-2xl z-30 p-1.5 space-y-1 animate-scale-in">
                      <span className="block text-xs font-black text-muted-foreground uppercase tracking-wider px-2.5 py-1 select-none">
                        Visible Columns
                      </span>
                      {columns.map((c) => {
                        const key = String(c.accessorKey);
                        const isChecked = visibleColumns.includes(key);
                        return (
                          <label
                            key={key}
                            className="flex items-center gap-2 px-2 py-1.5 hover:bg-muted rounded-[3px] text-sm text-foreground cursor-pointer select-none font-semibold transition-colors"
                          >
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => toggleColumn(key)}
                              className="rounded-xs border-input text-primary focus:ring-primary h-3.5 w-3.5"
                            />
                            <span className="truncate">{c.header}</span>
                          </label>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {rightActions}
            </div>
          )}
        </div>
      )}

      {/* Main Scrollable Table Area */}
      <div className="flex-1 overflow-auto no-scrollbar [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden w-full min-w-full relative min-h-0 bg-card">
        {isLoading ? (
          <div className="p-6">
            <VFLoadingTable rows={6} cols={activeColumns.length} />
          </div>
        ) : processedData.length === 0 ? (
          <div className="h-full min-h-[300px] flex items-center justify-center p-8">
            <VFEmptyState
              title={emptyTitle}
              description={emptyDescription}
            />
          </div>
        ) : (
          <table className={cn("w-full min-w-full border-collapse text-left text-xs sm:text-sm table-auto", tableClassName)}>
            <thead className="bg-card sticky top-0 z-10 border-b border-border shadow-2xs">
              <tr>
                {activeColumns.map((col) => {
                  const key = String(col.accessorKey);
                  const sortStatus = sorting.find((s) => s.id === key);
                  const isSortable = col.sortable ?? true;
                  const colStyle: React.CSSProperties = {
                    ...(col.maxWidth ? { maxWidth: typeof col.maxWidth === 'number' ? `${col.maxWidth}px` : col.maxWidth } : {}),
                    ...(col.minWidth ? { minWidth: typeof col.minWidth === 'number' ? `${col.minWidth}px` : col.minWidth } : {}),
                    ...(col.width ? { width: typeof col.width === 'number' ? `${col.width}px` : col.width } : {}),
                  };

                  return (
                    <th
                      key={key}
                      style={colStyle}
                      className={cn(
                        "px-2.5 sm:px-3 py-2 sm:py-2.5 font-bold text-[11px] sm:text-xs text-muted-foreground uppercase tracking-wider select-none whitespace-nowrap bg-card/95 backdrop-blur-md border-b border-border",
                        isSortable && "cursor-pointer hover:bg-muted/60 transition-colors",
                        col.headerClassName
                      )}
                      onClick={() => {
                        if (!isSortable) return;
                        const isAsc = sortStatus?.id === key && !sortStatus.desc;
                        const nextSort = [{ id: key, desc: isAsc }];
                        setSorting(nextSort);
                        if (onSort) onSort(key, isAsc ? 'asc' : 'desc');
                      }}
                    >
                      <div className={cn("flex items-center gap-1.5", col.headerClassName?.includes('text-right') && "justify-end", col.headerClassName?.includes('text-center') && "justify-center")}>
                        <span>{col.header}</span>
                        {isSortable && (
                          <span className="text-muted-foreground/80 font-mono text-[10px]">
                            {sortStatus?.id === key ? (sortStatus.desc ? '↓' : '↑') : '↕'}
                          </span>
                        )}
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody className="divide-y divide-border/80">
              {processedData.map((row: any, rowIndex: number) => (
                <tr
                  key={row.id || rowIndex}
                  className="hover:bg-muted/30 transition-colors focus-within:bg-muted/30 outline-none"
                >
                  {activeColumns.map((col) => {
                    const key = String(col.accessorKey);
                    const rawVal = row[key];
                    const rawString = rawVal !== undefined && rawVal !== null ? String(rawVal) : '';
                    const colStyle: React.CSSProperties = {
                      ...(col.maxWidth ? { maxWidth: typeof col.maxWidth === 'number' ? `${col.maxWidth}px` : col.maxWidth } : {}),
                      ...(col.minWidth ? { minWidth: typeof col.minWidth === 'number' ? `${col.minWidth}px` : col.minWidth } : {}),
                      ...(col.width ? { width: typeof col.width === 'number' ? `${col.width}px` : col.width } : {}),
                    };
                    const isTruncated = col.truncate ?? (!col.cell && rawVal !== undefined);

                    return (
                      <td
                        key={key}
                        style={colStyle}
                        className={cn(
                          "px-2.5 sm:px-3 py-2 sm:py-2.5 align-middle text-foreground whitespace-nowrap text-xs sm:text-[13px] font-semibold",
                          (col.maxWidth || col.truncate) && "truncate",
                          col.className
                        )}
                        title={typeof rawVal === 'string' || typeof rawVal === 'number' ? rawString : undefined}
                      >
                        {col.cell ? (
                          col.maxWidth || col.truncate ? (
                            <div
                              className="truncate"
                              style={col.maxWidth ? { maxWidth: typeof col.maxWidth === 'number' ? `${col.maxWidth}px` : col.maxWidth } : undefined}
                              title={typeof rawVal === 'string' || typeof rawVal === 'number' ? rawString : undefined}
                            >
                              {col.cell(row)}
                            </div>
                          ) : (
                            col.cell(row)
                          )
                        ) : (
                          <span
                            className={cn(isTruncated && "truncate block max-w-[240px]")}
                            style={col.maxWidth ? { maxWidth: typeof col.maxWidth === 'number' ? `${col.maxWidth}px` : col.maxWidth } : undefined}
                            title={rawString}
                          >
                            {rawVal !== undefined && rawVal !== null ? rawString : '—'}
                          </span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination Footer Controls */}
      {pagination && !isLoading && processedData.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between border-t border-border bg-card px-3.5 py-2.5 sm:px-4 sm:py-2.5 gap-2 shrink-0">
          <p className="text-xs text-muted-foreground">
            Showing page <span className="font-bold text-foreground">{pagination.currentPage}</span> of{' '}
            <span className="font-bold text-foreground">{pagination.totalPages}</span> (
            <span className="font-bold text-foreground">{pagination.totalItems || processedData.length}</span> total records)
          </p>
          <div className="flex items-center gap-1.5">
            <VFButton
              variant="outline"
              size="sm"
              disabled={pagination.currentPage <= 1}
              onClick={() => pagination.onPageChange(pagination.currentPage - 1)}
            >
              Previous
            </VFButton>
            <VFButton
              variant="outline"
              size="sm"
              disabled={pagination.currentPage >= pagination.totalPages}
              onClick={() => pagination.onPageChange(pagination.currentPage + 1)}
            >
              Next
            </VFButton>
          </div>
        </div>
      )}
    </div>
  );
}
