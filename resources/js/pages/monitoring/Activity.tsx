import { useMemo, useState } from 'react';

import Sidebar from '@/components/Sidebar';

type Activity = {
    id: number;
    action: string;
    user: string;
    category: string;
    date: string;
    status: 'Completed' | 'Pending' | 'Failed';
};

const activities: Activity[] = [
    {
        id: 1,
        action: 'Updated subscriber account',
        user: 'Maria Santos',
        category: 'Account',
        date: 'Jun 18, 2025 · 10:42 AM',
        status: 'Completed',
    },
    {
        id: 2,
        action: 'Created a service request',
        user: 'James Wilson',
        category: 'Service request',
        date: 'Jun 18, 2025 · 10:16 AM',
        status: 'Pending',
    },
    {
        id: 3,
        action: 'Changed billing plan',
        user: 'Ava Johnson',
        category: 'Billing',
        date: 'Jun 18, 2025 · 9:58 AM',
        status: 'Completed',
    },
    {
        id: 4,
        action: 'Processed payment',
        user: 'Noah Garcia',
        category: 'Payment',
        date: 'Jun 17, 2025 · 4:31 PM',
        status: 'Failed',
    },
    {
        id: 5,
        action: 'Added a new subscriber',
        user: 'Olivia Brown',
        category: 'Account',
        date: 'Jun 17, 2025 · 2:05 PM',
        status: 'Completed',
    },
    {
        id: 6,
        action: 'Updated installation schedule',
        user: 'Ethan Davis',
        category: 'Installation',
        date: 'Jun 17, 2025 · 11:24 AM',
        status: 'Pending',
    },
];

const statusStyles: Record<Activity['status'], string> = {
    Completed: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
    Pending: 'bg-amber-50 text-amber-700 ring-amber-600/20',
    Failed: 'bg-rose-50 text-rose-700 ring-rose-600/20',
};

export default function Activity() {
    const [query, setQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('All activity');

    const filteredActivities = useMemo(() => {
        const search = query.trim().toLowerCase();

        return activities.filter((activity) => {
            const matchesSearch =
                !search ||
                `${activity.action} ${activity.user} ${activity.category}`
                    .toLowerCase()
                    .includes(search);
            const matchesStatus =
                statusFilter === 'All activity' ||
                activity.status === statusFilter;

            return matchesSearch && matchesStatus;
        });
    }, [query, statusFilter]);

    return (
        <div className="min-h-screen bg-slate-100 text-slate-800">
            <div className="mx-auto">
                <div className="grid gap-6 xl:grid-cols-[260px_minmax(0,1fr)]">
                    <Sidebar />

                    <main className="min-h-screen min-w-0  py-6 pr-6  ">
                        <div className="mx-auto max-w-7xl">
                            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                                <div>
                                    <p className="text-sm font-medium tracking-[0.2em] text-slate-500 uppercase">
                                        Monitoring
                                    </p>
                                    <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">
                                        Activity log
                                    </h1>
                                    <p className="mt-2 text-sm text-slate-500">
                                        Review recent actions and updates across
                                        your accounts.
                                    </p>
                                </div>
                                <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 shadow-sm">
                                    <span
                                        className="h-2 w-2 rounded-full bg-emerald-500"
                                        aria-hidden="true"
                                    />
                                    Live activity
                                </div>
                            </div>

                            <section
                                className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
                                aria-label="Activity records"
                            >
                                <div className="flex flex-col gap-3 border-b border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between">
                                    <div>
                                        <h2 className="font-semibold text-slate-900">
                                            Recent activity
                                        </h2>
                                        <p className="mt-1 text-sm text-slate-500">
                                            A record of actions performed in the
                                            system.
                                        </p>
                                    </div>
                                    <div className="flex flex-col gap-3 sm:flex-row">
                                        <label
                                            className="sr-only"
                                            htmlFor="activity-search"
                                        >
                                            Search activity
                                        </label>
                                        <input
                                            id="activity-search"
                                            type="search"
                                            value={query}
                                            onChange={(event) =>
                                                setQuery(event.target.value)
                                            }
                                            placeholder="Search activity..."
                                            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 sm:w-56"
                                        />
                                        <label
                                            className="sr-only"
                                            htmlFor="activity-filter"
                                        >
                                            Filter by status
                                        </label>
                                        <select
                                            id="activity-filter"
                                            value={statusFilter}
                                            onChange={(event) =>
                                                setStatusFilter(
                                                    event.target.value,
                                                )
                                            }
                                            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                                        >
                                            <option>All activity</option>
                                            <option>Completed</option>
                                            <option>Pending</option>
                                            <option>Failed</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="overflow-x-auto">
                                    <table className="w-full min-w-175 divide-y divide-slate-200 text-left">
                                        <thead className="bg-slate-50">
                                            <tr>
                                                <th
                                                    scope="col"
                                                    className="px-6 py-3 text-xs font-semibold tracking-wide text-slate-500 uppercase"
                                                >
                                                    Activity
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="px-6 py-3 text-xs font-semibold tracking-wide text-slate-500 uppercase"
                                                >
                                                    User
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="px-6 py-3 text-xs font-semibold tracking-wide text-slate-500 uppercase"
                                                >
                                                    Category
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="px-6 py-3 text-xs font-semibold tracking-wide text-slate-500 uppercase"
                                                >
                                                    Date &amp; time
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="px-6 py-3 text-xs font-semibold tracking-wide text-slate-500 uppercase"
                                                >
                                                    Status
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {filteredActivities.map(
                                                (activity) => (
                                                    <tr
                                                        key={activity.id}
                                                        className="hover:bg-slate-50/70"
                                                    >
                                                        <td className="px-6 py-4 text-sm font-medium whitespace-nowrap text-slate-900">
                                                            {activity.action}
                                                        </td>
                                                        <td className="px-6 py-4 text-sm whitespace-nowrap text-slate-600">
                                                            {activity.user}
                                                        </td>
                                                        <td className="px-6 py-4 text-sm whitespace-nowrap text-slate-600">
                                                            {activity.category}
                                                        </td>
                                                        <td className="px-6 py-4 text-sm whitespace-nowrap text-slate-500">
                                                            {activity.date}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <span
                                                                className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${statusStyles[activity.status]}`}
                                                            >
                                                                {
                                                                    activity.status
                                                                }
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ),
                                            )}
                                            {filteredActivities.length ===
                                                0 && (
                                                    <tr>
                                                        <td
                                                            colSpan={5}
                                                            className="px-6 py-12 text-center text-sm text-slate-500"
                                                        >
                                                            No activity records
                                                            match your search.
                                                        </td>
                                                    </tr>
                                                )}
                                        </tbody>
                                    </table>
                                </div>

                                <div className="border-t border-slate-200 px-6 py-3 text-sm text-slate-500">
                                    Showing {filteredActivities.length} of{' '}
                                    {activities.length} records
                                </div>
                            </section>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}
