'use client';

import { TimesheetWeek, TimesheetStatus } from '../../../lib/types';
import { cn, formatDateRange, getTimesheetStatus } from '../../../lib/utils';
import { useRouter } from 'next/navigation';

interface TimesheetTableProps {
  timesheetWeeks: TimesheetWeek[];
}

const StatusBadge: React.FC<{ status: TimesheetStatus }> = ({ status }) => {
  let bgColorClass = '';
  let textColorClass = '';

  switch (status) {
    case 'completed':
      bgColorClass = 'bg-green-100';
      textColorClass = 'text-green-800';
      break;
    case 'incomplete':
      bgColorClass = 'bg-yellow-100';
      textColorClass = 'text-yellow-800';
      break;
    case 'missing':
      bgColorClass = 'bg-red-100';
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
    <>
      {/* Mobile Card View */}
      <div className="block sm:hidden space-y-4">
        {timesheetWeeks.map((week) => {
          const currentStatus = getTimesheetStatus(week.totalHours);
          return (
            <div key={week.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-semibold text-gray-900">Week #{week.weekNumber}</h3>
                  <p className="text-sm text-gray-600 mt-1">{formatDateRange(week.startDate, week.endDate)}</p>
                </div>
                <StatusBadge status={currentStatus} />
              </div>
              
              <div className="flex justify-end">
                {(() => {
                  if (currentStatus === 'completed') {
                    return (
                      <button
                        onClick={() => handleActionClick('view', week.id)}
                        className="text-blue-600 hover:text-blue-800 font-medium text-sm focus:outline-none focus:underline"
                      >
                        View
                      </button>
                    );
                  } else if (currentStatus === 'incomplete') {
                    return (
                      <button
                        onClick={() => handleActionClick('update', week.id)}
                        className="text-blue-600 hover:text-blue-800 font-medium text-sm focus:outline-none focus:underline"
                      >
                        Update
                      </button>
                    );
                  } else if (currentStatus === 'missing') {
                    return (
                      <button
                        onClick={() => handleActionClick('create', week.id)}
                        className="text-blue-600 hover:text-blue-800 font-medium text-sm focus:outline-none focus:underline"
                      >
                        Create
                      </button>
                    );
                  }
                  return null;
                })()}
              </div>
            </div>
          );
        })}
      </div>

      {/* Desktop Table View */}
      <div className="hidden sm:block overflow-x-auto rounded-lg shadow-md">
        <table className="w-full">
          <thead className="text-left text-xs text-gray-500 uppercase tracking-wider border-b border-gray-200 bg-gray-50">
            <tr>
              <th className="py-4 px-4 font-semibold text-gray-700">WEEK #</th>
              <th className="py-4 px-4 font-semibold text-gray-700">DATE</th>
              <th className="py-4 px-4 font-semibold text-gray-700">STATUS</th>
              <th className="py-4 px-4 font-semibold text-gray-700 text-right">ACTIONS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {timesheetWeeks.map((week) => (
              <tr key={week.id} className="bg-white border-b border-gray-200">
                <td className="py-4 px-4 text-gray-600 bg-gray-50">{week.weekNumber}</td>
                <td className="py-4 px-4 text-gray-600">{formatDateRange(week.startDate, week.endDate)}</td>
                <td className="py-4 px-4">
                  <StatusBadge status={getTimesheetStatus(week.totalHours)} />
                </td>
                <td className="py-4 px-4 text-right">
                  {(() => {
                    const currentStatus = getTimesheetStatus(week.totalHours);
                    if (currentStatus === 'completed') {
                      return (
                        <button
                          onClick={() => handleActionClick('view', week.id)}
                          className="text-blue-600 hover:text-blue-800 font-medium focus:outline-none focus:underline"
                        >
                          View
                        </button>
                      );
                    } else if (currentStatus === 'incomplete') {
                      return (
                        <button
                          onClick={() => handleActionClick('update', week.id)}
                          className="text-blue-600 hover:text-blue-800 font-medium focus:outline-none focus:underline"
                        >
                          Update
                        </button>
                      );
                    } else if (currentStatus === 'missing') {
                      return (
                        <button
                          onClick={() => handleActionClick('create', week.id)}
                          className="text-blue-600 hover:text-blue-800 font-medium focus:outline-none focus:underline"
                        >
                          Create
                        </button>
                      );
                    }
                    return null;
                  })()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}