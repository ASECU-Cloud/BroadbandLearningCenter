import { useMemo, useState } from 'react';

import Sidebar from '@/components/Sidebar';

interface TrainingActivity {
    id: number;
    trainee: string;
    initials: string;
    course: string;
    action: 'Started' | 'Completed' | 'Attempted' | 'Enrolled';
    date: string;
    duration: string;
    score: number | null;
}

const activities: TrainingActivity[] = [
    {
        id: 1,
        trainee: 'Emma Johnson',
        initials: 'EJ',
        course: 'Network Fundamentals',
        action: 'Completed',
        date: 'Oct 24, 2024 · 10:32 AM',
        duration: '1h 24m',
        score: 92,
    },
    {
        id: 2,
        trainee: 'Michael Chen',
        initials: 'MC',
        course: 'Fiber Optic Installation',
        action: 'Started',
        date: 'Oct 24, 2024 · 9:15 AM',
        duration: '48m',
        score: null,
    },
    {
        id: 3,
        trainee: 'Sophia Williams',
        initials: 'SW',
        course: 'Customer Service Basics',
        action: 'Completed',
        date: 'Oct 23, 2024 · 4:48 PM',
        duration: '2h 05m',
        score: 88,
    },
    {
        id: 4,
        trainee: 'James Brown',
        initials: 'JB',
        course: 'Safety & Compliance',
        action: 'Attempted',
        date: 'Oct 23, 2024 · 2:20 PM',
        duration: '35m',
        score: 74,
    },
    {
        id: 5,
        trainee: 'Olivia Davis',
        initials: 'OD',
        course: 'Advanced Troubleshooting',
        action: 'Enrolled',
        date: 'Oct 23, 2024 · 11:05 AM',
        duration: '—',
        score: null,
    },
    {
        id: 6,
        trainee: 'William Garcia',
        initials: 'WG',
        course: 'Network Fundamentals',
        action: 'Completed',
        date: 'Oct 22, 2024 · 3:42 PM',
        duration: '1h 11m',
        score: 95,
    },
];

const actionStyles: Record<TrainingActivity['action'], string> = {
    Started: 'bg-blue-50 text-blue-700 ring-blue-600/10',
    Completed: 'bg-emerald-50 text-emerald-700 ring-emerald-600/10',
    Attempted: 'bg-amber-50 text-amber-700 ring-amber-600/10',
    Enrolled: 'bg-violet-50 text-violet-700 ring-violet-600/10',
};

function SearchIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="h-4 w-4"
        >
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-4-4" />
        </svg>
    );
}

function FilterIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="h-4 w-4"
        >
            <path d="M4 5h16M7 12h10M10 19h4" />
        </svg>
    );
}

export default function Training() {
    const [query, setQuery] = useState('');
    const [action, setAction] = useState('All activity');

    const filteredActivities = useMemo(() => {
        const needle = query.trim().toLowerCase();

        return activities.filter((item) => {
            const matchesQuery =
                !needle ||
                [item.trainee, item.course].some((value) =>
                    value.toLowerCase().includes(needle),
                );
            const matchesAction =
                action === 'All activity' || item.action === action;

            return matchesQuery && matchesAction;
        });
    }, [query, action]);

    return (
        <div className="min-h-screen bg-slate-100 text-slate-800">
            <div className="mx-auto">
                <div className="grid gap-6 xl:grid-cols-[260px_minmax(0,1fr)]">
                    <Sidebar />

                    <main className="min-h-screen min-w-0 bg-slate-50 p-4 text-slate-900 sm:p-6 lg:p-8">
                        <div className="mx-auto max-w-7xl">
                            <header className="mb-6">
                                <p className="mb-1 text-sm font-medium text-slate-500">
                                    Monitoring
                                </p>
                                <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                                    Training Activity
                                </h1>
                            </header>

                            <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                                <div className="flex flex-col gap-3 border-b border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between">
                                    <div>
                                        <h2 className="text-base font-semibold">
                                            Activity log
                                        </h2>
                                        <p className="mt-0.5 text-sm text-slate-500">
                                            Recent training actions across all
                                            courses
                                        </p>
                                    </div>

                                    <div className="flex flex-col gap-2 sm:flex-row">
                                        <label className="relative block">
                                            <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-slate-400">
                                                <SearchIcon />
                                            </span>
                                            <input
                                                value={query}
                                                onChange={(event) =>
                                                    setQuery(event.target.value)
                                                }
                                                placeholder="Search trainee or course"
                                                className="h-10 w-full rounded-lg border border-slate-200 bg-white pr-3 pl-9 text-sm transition outline-none placeholder:text-slate-400 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 sm:w-64"
                                            />
                                        </label>

                                        <label className="relative">
                                            <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-slate-500">
                                                <FilterIcon />
                                            </span>
                                            <select
                                                value={action}
                                                onChange={(event) =>
                                                    setAction(
                                                        event.target.value,
                                                    )
                                                }
                                                className="h-10 w-full appearance-none rounded-lg border border-slate-200 bg-white pr-8 pl-9 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100 sm:w-40"
                                            >
                                                <option>All activity</option>
                                                <option>Started</option>
                                                <option>Completed</option>
                                                <option>Attempted</option>
                                                <option>Enrolled</option>
                                            </select>
                                        </label>
                                    </div>
                                </div>

                                <div className="overflow-x-auto">
                                    <table className="w-full min-w-190 text-left">
                                        <thead>
                                            <tr className="border-b border-slate-200 bg-slate-50/70 text-xs font-semibold tracking-wide text-slate-500 uppercase">
                                                <th className="px-5 py-3">
                                                    Trainee
                                                </th>
                                                <th className="px-5 py-3">
                                                    Course
                                                </th>
                                                <th className="px-5 py-3">
                                                    Activity
                                                </th>
                                                <th className="px-5 py-3">
                                                    Date &amp; time
                                                </th>
                                                <th className="px-5 py-3">
                                                    Duration
                                                </th>
                                                <th className="px-5 py-3 text-right">
                                                    Score
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {filteredActivities.map((item) => (
                                                <tr
                                                    key={item.id}
                                                    className="transition hover:bg-slate-50/70"
                                                >
                                                    <td className="px-5 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-sky-100 text-xs font-bold text-sky-700">
                                                                {item.initials}
                                                            </div>
                                                            <span className="text-sm font-semibold text-slate-800">
                                                                {item.trainee}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="px-5 py-4 text-sm text-slate-600">
                                                        {item.course}
                                                    </td>
                                                    <td className="px-5 py-4">
                                                        <span
                                                            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${actionStyles[item.action]}`}
                                                        >
                                                            {item.action}
                                                        </span>
                                                    </td>
                                                    <td className="px-5 py-4 text-sm whitespace-nowrap text-slate-600">
                                                        {item.date}
                                                    </td>
                                                    <td className="px-5 py-4 text-sm text-slate-600">
                                                        {item.duration}
                                                    </td>
                                                    <td className="px-5 py-4 text-right">
                                                        {item.score === null ? (
                                                            <span className="text-sm text-slate-400">
                                                                —
                                                            </span>
                                                        ) : (
                                                            <span className="text-sm font-semibold text-slate-800">
                                                                {item.score}%
                                                            </span>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>

                                    {filteredActivities.length === 0 && (
                                        <div className="px-5 py-12 text-center text-sm text-slate-500">
                                            No training activity found.
                                        </div>
                                    )}
                                </div>

                                <footer className="flex items-center justify-between border-t border-slate-200 px-5 py-3 text-sm text-slate-500">
                                    <span>
                                        Showing {filteredActivities.length} of{' '}
                                        {activities.length} activities
                                    </span>
                                    <span className="hidden sm:inline">
                                        Updated just now
                                    </span>
                                </footer>
                            </section>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}
