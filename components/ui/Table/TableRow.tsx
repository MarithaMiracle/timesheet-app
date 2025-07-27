import * as React from 'react';
import { cn } from '../../../lib/utils';

type TableRowProps = React.HTMLAttributes<HTMLTableRowElement>;

const TableRow = React.forwardRef<HTMLTableRowElement, TableRowProps>(({ className, ...props }, ref) => (
  <tr
    ref={ref}
    className={cn(
      "border-b border-gray-200 transition-colors",
      className
    )}
    {...props}
  />
));
TableRow.displayName = "TableRow";

export default TableRow;