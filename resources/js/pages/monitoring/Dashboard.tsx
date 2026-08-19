import React from 'react';

import Sidebar from '@/components/Sidebar';

const stats = [
    {
        label: 'Total Pengunjung',
        value: '240',
        change: '+12.4%',
        tone: 'emerald',
    },
    { label: 'Active Sessions', value: '8,492', change: '+8.1%', tone: 'sky' },
    // { label: "Avg. Response", value: "1.8s", change: "-0.4s", tone: "violet" },
    // { label: "Conversion Rate", value: "6.9%", change: "+1.3%", tone: "amber" },
];

const activity = [
    { name: 'Mon', value: 45 },
    { name: 'Tue', value: 62 },
    { name: 'Wed', value: 54 },
    { name: 'Thu', value: 76 },
    { name: 'Fri', value: 68 },
];

// const recentOrders = [
//     { id: "#1024", client: "Ava Thompson", amount: "$420.00", status: "Paid" },
//     { id: "#1025", client: "Liam Chen", amount: "$310.50", status: "Pending" },
//     { id: "#1026", client: "Emma Flores", amount: "$680.75", status: "Processing" },
//     { id: "#1027", client: "Noah Patel", amount: "$250.00", status: "Paid" },
// ];

const toneClasses: Record<string, string> = {
    emerald: 'bg-emerald-500/10 text-emerald-600',
    sky: 'bg-sky-500/10 text-sky-600',
    violet: 'bg-violet-500/10 text-violet-600',
    amber: 'bg-amber-500/10 text-amber-600',
};

const sessionLabels = ['S1', 'S2', 'S3', 'S4', 'S5'];

const monitoringMatrix = [
    {
        day: 'Mon',
        sessions: [
            { active: true, photo: true },
            { active: true, photo: true },
            { active: false, photo: false },
            { active: false, photo: true },
            { active: true, photo: false },
        ],
    },
    {
        day: 'Tue',
        sessions: [
            { active: true, photo: false },
            { active: false, photo: false },
            { active: true, photo: true },
            { active: true, photo: true },
            { active: false, photo: true },
        ],
    },
    {
        day: 'Wed',
        sessions: [
            { active: false, photo: true },
            { active: true, photo: true },
            { active: true, photo: false },
            { active: false, photo: false },
            { active: true, photo: true },
        ],
    },
    {
        day: 'Thu',
        sessions: [
            { active: true, photo: true },
            { active: false, photo: true },
            { active: false, photo: false },
            { active: true, photo: true },
            { active: true, photo: true },
        ],
    },
    {
        day: 'Fri',
        sessions: [
            { active: false, photo: false },
            { active: true, photo: false },
            { active: true, photo: true },
            { active: false, photo: true },
            { active: true, photo: true },
        ],
    },
];

const getSessionStatus = (active: boolean, photo: boolean) => {
    if (active && photo) {
        return {
            label: 'Active + photo',
            tone: 'bg-emerald-500/15 text-emerald-700 border-emerald-200',
            dot: 'bg-emerald-500',
        };
    }

    if (active) {
        return {
            label: 'Active',
            tone: 'bg-amber-500/15 text-amber-700 border-amber-200',
            dot: 'bg-amber-500',
        };
    }

    if (photo) {
        return {
            label: 'Photo uploaded',
            tone: 'bg-sky-500/15 text-sky-700 border-sky-200',
            dot: 'bg-sky-500',
        };
    }

    return {
        label: 'No activity',
        tone: 'bg-slate-100 text-slate-500 border-slate-200',
        dot: 'bg-slate-400',
    };
};

const sessionSummary = sessionLabels.map((session, index) => {
    const sessionEntries = monitoringMatrix
        .flatMap((day) =>
            day.sessions.map((entry, sessionIndex) => ({
                active: entry.active,
                photo: entry.photo,
                sessionIndex,
            })),
        )
        .filter((entry) => entry.sessionIndex === index);

    const activeCount = sessionEntries.filter((entry) => entry.active).length;
    const photoCount = sessionEntries.filter((entry) => entry.photo).length;
    const hasActivity = activeCount > 0 || photoCount > 0;

    return {
        session,
        activeCount,
        photoCount,
        hasActivity,
        tone: hasActivity
            ? photoCount > 0
                ? 'border-emerald-200 bg-emerald-50'
                : 'border-amber-200 bg-amber-50'
            : 'border-slate-200 bg-slate-50',
        statusText: hasActivity
            ? photoCount > 0
                ? 'Photo uploaded'
                : 'Active'
            : 'No visitor',
    };
});

// const teamMembers = [
//     { name: "Ava Thompson", role: "Product lead", stat: "94%" },
//     { name: "Liam Chen", role: "Support", stat: "87%" },
//     { name: "Emma Flores", role: "Sales", stat: "91%" },
// ];

export default function DashboardPage() {
    return (
        <div className="min-h-screen bg-slate-100 text-slate-800">
            <div className="mx-auto">
                <div className="grid gap-6 xl:grid-cols-[260px_minmax(0,1fr)]">
                    <Sidebar />

                    <main>
                        <header className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                            <div>
                                <p className="text-sm font-medium tracking-[0.2em] text-slate-500 uppercase">
                                    Overview
                                </p>
                                <h1 className="mt-2 text-3xl font-bold tracking-tight">
                                    Dashboard
                                </h1>
                            </div>

                            <button className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800">
                                Export Report
                            </button>
                        </header>

                        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                            {stats.map((stat) => (
                                <div
                                    key={stat.label}
                                    className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                                >
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <p className="text-sm text-slate-500">
                                                {stat.label}
                                            </p>
                                            <p className="mt-3 text-3xl font-bold">
                                                {stat.value}
                                            </p>
                                        </div>
                                        <span
                                            className={`rounded-full px-2.5 py-1 text-xs font-semibold ${toneClasses[stat.tone]}`}
                                        >
                                            {stat.change}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </section>

                        <section className="mt-8 grid gap-6 xl:grid-cols-[1fr_2fr]">
                            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                                <div className="mb-5 flex items-center justify-between">
                                    <div>
                                        <h2 className="text-lg font-semibold">
                                            Weekly Overview
                                        </h2>
                                        <p className="text-sm text-slate-500">
                                            Pengunjung Mingguan
                                        </p>
                                    </div>
                                    {/* <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-600">
                                        +18.2%
                                    </span> */}
                                </div>

                                <div className="flex h-52 items-end gap-3 rounded-xl bg-slate-50 p-3">
                                    {activity.map((bar) => (
                                        <div
                                            key={bar.name}
                                            className="flex flex-1 flex-col items-center justify-end gap-2"
                                        >
                                            <div
                                                className="min-h-6 w-full rounded-t-xl bg-linear-to-t from-sky-600 to-violet-500 shadow-sm"
                                                style={{
                                                    height: `${Math.max(bar.value * 2.2, 32)}px`,
                                                    maxHeight: '100%',
                                                }}
                                                title={`${bar.name}: ${bar.value}`}
                                            />
                                            <span className="text-xs text-slate-500">
                                                {bar.name}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
                                <div className="overflow-x-auto rounded-xl border border-slate-100 bg-slate-50/60">
                                    <table className="min-w-full border-separate border-spacing-y-1 text-left text-xs">
                                        <thead>
                                            <tr>
                                                <th className="px-1.5 py-1 text-[10px] font-semibold tracking-[0.2em] text-slate-400 uppercase">
                                                    Day
                                                </th>
                                                {sessionLabels.map(
                                                    (session) => (
                                                        <th
                                                            key={session}
                                                            className="px-1.5 py-1 text-center text-[10px] font-semibold tracking-[0.2em] text-slate-400 uppercase"
                                                        >
                                                            {session}
                                                        </th>
                                                    ),
                                                )}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {monitoringMatrix.map((day) => (
                                                <tr key={day.day}>
                                                    <td className="rounded-l-lg bg-slate-50 px-2 py-1.5 font-medium text-slate-700">
                                                        {day.day}
                                                    </td>
                                                    {day.sessions.map(
                                                        (
                                                            session,
                                                            sessionIndex,
                                                        ) => {
                                                            const status =
                                                                getSessionStatus(
                                                                    session.active,
                                                                    session.photo,
                                                                );

                                                            return (
                                                                <td
                                                                    key={`${day.day}-${sessionIndex}`}
                                                                    className="px-1 py-1"
                                                                >
                                                                    <div
                                                                        className={`flex items-center justify-center gap-1 rounded-md border px-1.5 py-1.5 text-[10px] font-medium ${status.tone}`}
                                                                        title={`${day.day} ${sessionLabels[sessionIndex]}: ${status.label}`}
                                                                    >
                                                                        <span
                                                                            className={`h-2 w-2 rounded-full ${status.dot}`}
                                                                        />
                                                                        <span className="hidden sm:inline">
                                                                            {session.active
                                                                                ? 'A'
                                                                                : '-'}
                                                                        </span>
                                                                        <span className="hidden md:inline">
                                                                            /
                                                                        </span>
                                                                        <span className="hidden md:inline">
                                                                            {session.photo
                                                                                ? 'P'
                                                                                : '-'}
                                                                        </span>
                                                                    </div>
                                                                </td>
                                                            );
                                                        },
                                                    )}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </section>

                        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                            <div className="mb-3 flex items-center justify-between gap-2">
                                <div>
                                    <h2 className="text-base font-semibold">
                                        Monitoring Status
                                    </h2>
                                    <p className="text-[11px] text-slate-500">
                                        Session activity and photo upload
                                    </p>
                                </div>
                                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600">
                                    5 sessions
                                </span>
                            </div>

                            <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-5">
                                {sessionSummary.map(
                                    ({
                                        session,
                                        activeCount,
                                        photoCount,
                                        hasActivity,
                                        tone,
                                        statusText,
                                    }) => (
                                        <div
                                            key={session}
                                            className={`flex min-h-18.5 flex-col justify-between rounded-xl border p-2 ${tone}`}
                                        >
                                            <div className="flex items-center justify-between gap-2">
                                                <p className="text-[10px] font-semibold tracking-[0.2em] text-slate-500 uppercase">
                                                    {session}
                                                </p>
                                                <span
                                                    className={`h-2 w-2 rounded-full ${hasActivity ? (photoCount > 0 ? 'bg-emerald-500' : 'bg-amber-500') : 'bg-slate-400'}`}
                                                />
                                            </div>
                                            <p className="text-sm font-semibold text-slate-800">
                                                {hasActivity
                                                    ? `${activeCount + photoCount} updates`
                                                    : 'No visitor'}
                                            </p>
                                            <p
                                                className={`text-[10px] ${hasActivity ? 'text-emerald-700' : 'text-slate-500'}`}
                                            >
                                                {hasActivity
                                                    ? `${statusText} • ${activeCount} active • ${photoCount} photo`
                                                    : statusText}
                                            </p>
                                        </div>
                                    ),
                                )}
                            </div>
                        </section>

                        {/* <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                            <div className="mb-4 flex items-center justify-between">
                                <h2 className="text-lg font-semibold">Recent Orders</h2>
                                <button className="text-sm font-medium text-slate-600 hover:text-slate-900">View all</button>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="min-w-full text-left">
                                    <thead>
                                        <tr className="border-b border-slate-200 text-sm text-slate-500">
                                            <th className="pb-3 font-medium">Order</th>
                                            <th className="pb-3 font-medium">Customer</th>
                                            <th className="pb-3 font-medium">Amount</th>
                                            <th className="pb-3 font-medium">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {recentOrders.map((order) => (
                                            <tr key={order.id} className="border-b border-slate-100 text-sm last:border-0">
                                                <td className="py-3 font-medium text-slate-800">{order.id}</td>
                                                <td className="py-3 text-slate-600">{order.client}</td>
                                                <td className="py-3 text-slate-800">{order.amount}</td>
                                                <td className="py-3">
                                                    <span
                                                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${order.status === "Paid"
                                                            ? "bg-emerald-500/10 text-emerald-600"
                                                            : order.status === "Pending"
                                                                ? "bg-amber-500/10 text-amber-600"
                                                                : "bg-sky-500/10 text-sky-600"
                                                            }`}
                                                    >
                                                        {order.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </section> */}
                    </main>
                </div>
            </div>
        </div>
    );
}
