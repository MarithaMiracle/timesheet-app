// components/ui/Table/Table.tsx
import * as React from 'react';
import { cn } from '../../../lib/utils'; // Adjust path to utils if different

interface TableProps extends React.TableHTMLAttributes<HTMLTableElement> {}

const Table = React.forwardRef<HTMLTableElement, TableProps>(({ className, ...props }, ref) => (
  <div className="relative w-full overflow-auto">
    <table
      ref={ref}
      className={cn("w-full caption-bottom text-sm", className)}
      {...props}
    />
  </div>
));
Table.displayName = "Table";

export default Table;