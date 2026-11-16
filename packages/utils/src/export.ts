/**
 * @vidyafloww/utils — Export & Download Utilities
 */

/**
 * Trigger client-side CSV download from tabular object array
 */
export function downloadCSV<T extends Record<string, any>>(
  filename: string,
  data: T[],
  headers?: { key: keyof T; label: string }[]
): void {
  if (!data || data.length === 0) return;

  const actualHeaders =
    headers ||
    Object.keys(data[0]).map((key) => ({
      key: key as keyof T,
      label: key,
    }));

  const csvRows: string[] = [];

  // Header row
  csvRows.push(actualHeaders.map((h) => `"${String(h.label).replace(/"/g, '""')}"`).join(','));

  // Data rows
  for (const row of data) {
    const values = actualHeaders.map((h) => {
      const val = row[h.key];
      const str = val === null || val === undefined ? '' : String(val);
      return `"${str.replace(/"/g, '""')}"`;
    });
    csvRows.push(values.join(','));
  }

  const csvContent = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvRows.join('\n'));
  const link = document.createElement('a');
  link.setAttribute('href', csvContent);
  link.setAttribute('download', filename.endsWith('.csv') ? filename : `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
