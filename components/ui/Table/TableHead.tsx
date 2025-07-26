// components/ui/Table/TableHead.tsx
import * as React from 'react';
import { cn } from '../../../lib/utils';

interface TableHeadProps extends React.HTMLAttributes<HTMLTableSectionElement> {}

const TableHead = React.forwardRef<HTMLTableSectionElement, TableHeadProps>(({ className, ...props }, ref) => (
  <thead
    ref={ref}
    className={cn(
      "text-left text-xs text-gray-500 uppercase tracking-wider border-b border-gray-200 bg-gray-50",
      className
    )}
    {...props}
  />
));
TableHead.displayName = "TableHead";

export default TableHead;