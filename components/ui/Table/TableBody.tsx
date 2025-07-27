import * as React from 'react';
import { cn } from '../../../lib/utils';

type TableBodyProps = React.HTMLAttributes<HTMLTableSectionElement>;

const TableBody = React.forwardRef<HTMLTableSectionElement, TableBodyProps>(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={cn("divide-y divide-gray-200 [&_tr:last-child]:border-0", className)}
    {...props}
  />
));
TableBody.displayName = "TableBody";

export default TableBody;