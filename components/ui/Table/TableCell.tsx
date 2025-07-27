// components/ui/Table/TableCell.tsx
import * as React from 'react';
import { cn } from '../../../lib/utils';

type TableCellProps = React.TdHTMLAttributes<HTMLTableDataCellElement>;

const TableCell = React.forwardRef<HTMLTableDataCellElement, TableCellProps>(({ className, ...props }, ref) => (
  <td
    ref={ref}
    className={cn("py-4 px-4 align-middle", className)}
    {...props}
  />
));
TableCell.displayName = "TableCell";

export default TableCell;