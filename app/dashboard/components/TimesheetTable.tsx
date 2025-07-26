// app/dashboard/components/TimesheetTable.tsx
'use client';

// Import TimesheetWeek and the new TimesheetStatus
import { TimesheetWeek, TimesheetStatus } from '../../../lib/types';
import { cn, formatDateRange, getTimesheetStatus } from '../../../lib/utils'; // Import getTimesheetStatus
import { useRouter } from 'next/navigation';

// Import our generic table UI components
import Table from '../../../components/ui/Table/Table';
import TableBody from '../../../components/ui/Table/TableBody';
import TableCell from '../../../components/ui/Table/TableCell';
import TableHead from '../../../components/ui/Table/TableHead';
import TableRow from '../../../components/ui/Table/TableRow';

interface TimesheetTableProps {
  timesheetWeeks: TimesheetWeek[];
}

// Helper component for the colored status badge (now for completed/incomplete/missing)
const StatusBadge: React.FC<{ status: TimesheetStatus }> = ({ status }) => {
  let bgColorClass = '';
  let textColorClass = '';

  switch (status) {
    case 'completed':
      bgColorClass = 'bg-green-100'; // Green for completed
      textColorClass = 'text-green-800';
      break;
    case 'incomplete':
      bgColorClass = 'bg-yellow-100'; // Yellow for incomplete
      textColorClass = 'text-yellow-800';
      break;
    case 'missing':
      bgColorClass = 'bg-red-100'; // Red for missing
      textColorClass = 'text-red-800';
      break;
    default:
      bgColorClass = 'bg-gray-100';
      textColorClass = 'text-gray-800';
  }

  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold uppercase',
        bgColorClass,
        textColorClass
      )}
    >
      {status}
    </span>
  );
};

export default function TimesheetTable({ timesheetWeeks }: TimesheetTableProps) {
  const router = useRouter();

  const handleActionClick = (action: 'view' | 'update' | 'create', weekId: string) => {
    console.log(`Action: ${action} for Week ID: ${weekId}`);
    if (action === 'view') {
      router.push(`/dashboard/timesheets/week/${weekId}/view`);
    } else if (action === 'update') {
      router.push(`/dashboard/timesheets/week/${weekId}/edit`);
    } else if (action === 'create') {
      router.push(`/dashboard/timesheets/week/new`);
    }
  };

  return (
    <div className="overflow-x-auto rounded-lg shadow-md">
      <Table>
        <TableHead>
          <TableRow>
            <TableCell className="font-semibold text-gray-700 bg-gray-50">WEEK #</TableCell>
            <TableCell className="font-semibold text-gray-700">DATE</TableCell>
            <TableCell className="font-semibold text-gray-700">STATUS</TableCell>
            <TableCell className="font-semibold text-gray-700 text-right">ACTIONS</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {timesheetWeeks.map((week) => (
            <TableRow key={week.id} className="bg-white">
              <TableCell className="text-gray-600 bg-gray-50">{week.weekNumber}</TableCell>
              <TableCell className="text-gray-600">{formatDateRange(week.startDate, week.endDate)}</TableCell>
              <TableCell>
                {/* Now deriving and displaying status based on totalHours */}
                <StatusBadge status={getTimesheetStatus(week.totalHours)} />
              </TableCell>
              <TableCell className="text-right">
                {/* Action buttons based on the new status logic */}
                {(() => {
                  const currentStatus = getTimesheetStatus(week.totalHours);

                  if (currentStatus === 'completed') {
                    // For completed, typically you'd view or maybe submit if it's not already
                    return (
                      <button
                        onClick={() => handleActionClick('view', week.id)}
                        className="text-blue-600 hover:text-blue-800 font-medium focus:outline-none focus:underline"
                      >
                        View
                      </button>
                    );
                  } else if (currentStatus === 'incomplete') {
                    // For incomplete, user needs to update
                    return (
                      <button
                        onClick={() => handleActionClick('update', week.id)}
                        className="text-blue-600 hover:text-blue-800 font-medium focus:outline-none focus:underline"
                      >
                        Update
                      </button>
                    );
                  } else if (currentStatus === 'missing') {
                    // For missing, user needs to create/enter hours
                    return (
                      <button
                        onClick={() => handleActionClick('create', week.id)} // Could be 'create' or 'update' for missing
                        className="text-blue-600 hover:text-blue-800 font-medium focus:outline-none focus:underline"
                      >
                        Create
                      </button>
                    );
                  }
                  return null; // No action for other unhandled cases (shouldn't be any with these 3 statuses)
                })()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}