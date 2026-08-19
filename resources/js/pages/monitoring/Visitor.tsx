import { Head } from '@inertiajs/react';
import { useMemo, useState } from 'react';

import Sidebar from '@/components/Sidebar';

type VisitorStatus = 'Active' | 'Photo uploaded' | 'No activity';

type VisitorEntry = {
    id: number;
    date: string;
    fullName: string;
    phone: string;
    company: string;
    session: string;
    checkIn: string;
    photo: string;
    note: string;
    status: VisitorStatus;
};

const sessionOptions = [
    'Session 1',
    'Session 2',
    'Session 3',
    'Session 4',
    'Session 5',
];

const initialVisitors: VisitorEntry[] = [
    {
        id: 1,
        date: '2026-08-18',
        fullName: 'Ayu Pratiwi',
        phone: '+62 812-3456-001',
        company: 'BLC Community',
        session: 'Session 1',
        checkIn: '08:30',
        photo: 'photo-001.jpg',
        note: 'Completed training module 1',
        status: 'Active',
    },
    {
        id: 2,
        date: '2026-08-18',
        fullName: 'Budi Santoso',
        phone: '+62 812-3456-002',
        company: 'SMK Mandiri',
        session: 'Session 3',
        checkIn: '10:15',
        photo: '',
        note: 'Waiting for photo upload',
        status: 'No activity',
    },
    {
        id: 3,
        date: '2026-08-19',
        fullName: 'Citra Dewi',
        phone: '+62 812-3456-003',
        company: 'Konsultasi Digital',
        session: 'Session 2',
        checkIn: '09:20',
        photo: 'photo-003.jpg',
        note: 'Uploaded evidence',
        status: 'Photo uploaded',
    },
    {
        id: 4,
        date: '2026-08-19',
        fullName: 'Dimas Wijaya',
        phone: '+62 812-3456-004',
        company: 'BLC Community',
        session: 'Session 5',
        checkIn: '15:10',
        photo: 'photo-004.jpg',
        note: 'Follow-up session complete',
        status: 'Active',
    },
];

const emptyForm = {
    date: '2026-08-18',
    fullName: '',
    phone: '',
    company: '',
    session: 'Session 1',
    checkIn: '',
    photo: '',
    note: '',
    status: 'Active' as VisitorStatus,
};

export default function VisitorPage() {
    const [visitors, setVisitors] = useState<VisitorEntry[]>(initialVisitors);
    const [dateFrom, setDateFrom] = useState('2026-08-18');
    const [dateTo, setDateTo] = useState('2026-08-20');
    const [sessionFilter, setSessionFilter] = useState('All sessions');
    const [statusFilter, setStatusFilter] = useState('All status');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [form, setForm] = useState(emptyForm);

    const filteredVisitors = useMemo(() => {
        return [...visitors]
            .filter((visitor) => {
                const matchesDateFrom = !dateFrom || visitor.date >= dateFrom;
                const matchesDateTo = !dateTo || visitor.date <= dateTo;
                const matchesSession =
                    sessionFilter === 'All sessions' ||
                    visitor.session === sessionFilter;
                const matchesStatus =
                    statusFilter === 'All status' ||
                    visitor.status === statusFilter;

                return (
                    matchesDateFrom &&
                    matchesDateTo &&
                    matchesSession &&
                    matchesStatus
                );
            })
            .sort((a, b) => {
                const dateCompare = b.date.localeCompare(a.date);

                if (dateCompare !== 0) {
                    return dateCompare;
                }

                return a.session.localeCompare(b.session);
            });
    }, [dateFrom, dateTo, sessionFilter, statusFilter, visitors]);

    const handleChange = (
        event: React.ChangeEvent<
            HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
        >,
    ) => {
        const { name, value } = event.target;
        setForm((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    const handleAddVisitor = (event: React.FormEvent) => {
        event.preventDefault();

        if (!form.fullName.trim()) {
            return;
        }

        const newEntry: VisitorEntry = {
            id: Date.now(),
            date: form.date,
            fullName: form.fullName,
            phone: form.phone,
            company: form.company,
            session: form.session,
            checkIn: form.checkIn || '00:00',
            photo: form.photo,
            note: form.note,
            status: form.photo ? 'Photo uploaded' : form.status,
        };

        setVisitors((previous) => [newEntry, ...previous]);
        setForm({
            ...emptyForm,
            date: form.date,
        });
    };

    const handleGenerateReport = () => {
        const rows = filteredVisitors.map(
            (visitor) =>
                `${visitor.date},${visitor.session},${visitor.fullName},${visitor.company},${visitor.phone},${visitor.checkIn},${visitor.photo || 'No photo'},${visitor.status}`,
        );

        const content = `Date,Session,Visitor,Company,Phone,Check-in,Photo,Status\n${rows.join('\n')}`;
        const blob = new Blob([content], { type: 'text/csv;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `visitor-report-${dateFrom || 'all'}-${dateTo || 'all'}.csv`;
        link.click();
        URL.revokeObjectURL(url);
    };

    return (
        <>
            <Head title="Visitor Monitoring" />

            <div className="min-h-screen bg-slate-100 text-slate-800">
                <div className="mx-auto">
                    <div className="grid gap-6 xl:grid-cols-[260px_minmax(0,1fr)]">
                        <Sidebar />

                        {isDialogOpen ? (
                            <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-3 backdrop-blur-sm sm:p-4">
                                <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl sm:p-5">
                                    <div className="mb-4 flex items-center justify-between gap-3">
                                        <div>
                                            <h2 className="text-lg font-semibold">
                                                Manual Visitor Entry
                                            </h2>
                                            <p className="text-xs text-slate-500">
                                                Add a visitor for a specific
                                                date and session
                                            </p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setIsDialogOpen(false)
                                            }
                                            className="rounded-full bg-slate-100 p-2 text-slate-500 transition hover:bg-slate-200 hover:text-slate-700"
                                            aria-label="Close dialog"
                                        >
                                            ✕
                                        </button>
                                    </div>

                                    <form
                                        onSubmit={(event) => {
                                            handleAddVisitor(event);
                                            setIsDialogOpen(false);
                                        }}
                                        className="space-y-3"
                                    >
                                        <div className="grid gap-3 sm:grid-cols-2">
                                            <label className="text-sm text-slate-600">
                                                <span className="mb-1 block font-medium">
                                                    Date
                                                </span>
                                                <input
                                                    type="date"
                                                    name="date"
                                                    value={form.date}
                                                    onChange={handleChange}
                                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm transition outline-none focus:border-sky-500 focus:bg-white"
                                                />
                                            </label>

                                            <label className="text-sm text-slate-600">
                                                <span className="mb-1 block font-medium">
                                                    Session
                                                </span>
                                                <select
                                                    name="session"
                                                    value={form.session}
                                                    onChange={handleChange}
                                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm transition outline-none focus:border-sky-500 focus:bg-white"
                                                >
                                                    {sessionOptions.map(
                                                        (session) => (
                                                            <option
                                                                key={session}
                                                                value={session}
                                                            >
                                                                {session}
                                                            </option>
                                                        ),
                                                    )}
                                                </select>
                                            </label>
                                        </div>

                                        <label className="block text-sm text-slate-600">
                                            <span className="mb-1 block font-medium">
                                                Visitor Name
                                            </span>
                                            <input
                                                name="fullName"
                                                value={form.fullName}
                                                onChange={handleChange}
                                                placeholder="Enter visitor name"
                                                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm transition outline-none focus:border-sky-500 focus:bg-white"
                                            />
                                        </label>

                                        <div className="grid gap-3 sm:grid-cols-2">
                                            <label className="text-sm text-slate-600">
                                                <span className="mb-1 block font-medium">
                                                    Phone
                                                </span>
                                                <input
                                                    name="phone"
                                                    value={form.phone}
                                                    onChange={handleChange}
                                                    placeholder="Phone number"
                                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm transition outline-none focus:border-sky-500 focus:bg-white"
                                                />
                                            </label>

                                            <label className="text-sm text-slate-600">
                                                <span className="mb-1 block font-medium">
                                                    Company
                                                </span>
                                                <input
                                                    name="company"
                                                    value={form.company}
                                                    onChange={handleChange}
                                                    placeholder="Company"
                                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm transition outline-none focus:border-sky-500 focus:bg-white"
                                                />
                                            </label>
                                        </div>

                                        <div className="grid gap-3 sm:grid-cols-2">
                                            <label className="text-sm text-slate-600">
                                                <span className="mb-1 block font-medium">
                                                    Check-in Time
                                                </span>
                                                <input
                                                    type="time"
                                                    name="checkIn"
                                                    value={form.checkIn}
                                                    onChange={handleChange}
                                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm transition outline-none focus:border-sky-500 focus:bg-white"
                                                />
                                            </label>

                                            <label className="text-sm text-slate-600">
                                                <span className="mb-1 block font-medium">
                                                    Status
                                                </span>
                                                <select
                                                    name="status"
                                                    value={form.status}
                                                    onChange={handleChange}
                                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm transition outline-none focus:border-sky-500 focus:bg-white"
                                                >
                                                    <option value="Active">
                                                        Active
                                                    </option>
                                                    <option value="Photo uploaded">
                                                        Photo uploaded
                                                    </option>
                                                    <option value="No activity">
                                                        No activity
                                                    </option>
                                                </select>
                                            </label>
                                        </div>

                                        <label className="block text-sm text-slate-600">
                                            <span className="mb-1 block font-medium">
                                                Photo Reference
                                            </span>
                                            <input
                                                name="photo"
                                                value={form.photo}
                                                onChange={handleChange}
                                                placeholder="photo-001.jpg"
                                                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm transition outline-none focus:border-sky-500 focus:bg-white"
                                            />
                                        </label>

                                        <label className="block text-sm text-slate-600">
                                            <span className="mb-1 block font-medium">
                                                Notes
                                            </span>
                                            <textarea
                                                name="note"
                                                value={form.note}
                                                onChange={handleChange}
                                                rows={3}
                                                placeholder="Add note or attendance details"
                                                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm transition outline-none focus:border-sky-500 focus:bg-white"
                                            />
                                        </label>

                                        <div className="flex justify-end gap-3 pt-1">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setIsDialogOpen(false)
                                                }
                                                className="rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="submit"
                                                className="rounded-xl bg-emerald-600 px-3.5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-500"
                                            >
                                                Add Visitor
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        ) : null}

                        <main className="py-6 pr-6">
                            <header className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                                <div>
                                    <p className="text-sm font-medium tracking-[0.2em] text-slate-500 uppercase">
                                        Monitoring
                                    </p>
                                    <h1 className="mt-2 text-3xl font-bold tracking-tight">
                                        Visitor Management
                                    </h1>
                                </div>

                                <div className="flex items-center gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setIsDialogOpen(true)}
                                        className="inline-flex items-center justify-center rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-500"
                                    >
                                        Add Visitor
                                    </button>

                                    <button
                                        type="button"
                                        onClick={handleGenerateReport}
                                        className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
                                    >
                                        Export Report
                                    </button>
                                </div>
                            </header>
                            <div className="mb-1 text-lg font-semibold text-slate-700">
                                {new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                            </div>
                            <div className="mb-4 grid gap-3 md:grid-cols-5">

                                {sessionOptions.map((session) => {
                                    const sessionVisitors =
                                        filteredVisitors.filter(
                                            (visitor) =>
                                                visitor.session === session,
                                        );
                                    const hasVisitors =
                                        sessionVisitors.length > 0;
                                    const hasPhoto = sessionVisitors.some(
                                        (visitor) => visitor.photo,
                                    );

                                    return (
                                        <div
                                            key={session}
                                            className={`rounded-2xl border p-3 ${hasVisitors
                                                ? hasPhoto
                                                    ? 'border-emerald-200 bg-emerald-50'
                                                    : 'border-amber-200 bg-amber-50'
                                                : 'border-slate-200 bg-slate-50'
                                                }`}
                                        >
                                            <p className="text-[11px] font-semibold tracking-[0.2em] text-slate-500 uppercase">
                                                {session}
                                            </p>
                                            <p className="mt-2 text-sm font-semibold text-slate-800">
                                                {hasVisitors
                                                    ? `${sessionVisitors.length} visitor${sessionVisitors.length > 1 ? 's' : ''}`
                                                    : 'No visitor'}
                                            </p>
                                            <p
                                                className={`mt-1 text-xs ${hasPhoto ? 'text-emerald-700' : 'text-slate-500'}`}
                                            >
                                                {hasPhoto
                                                    ? 'Photo uploaded'
                                                    : 'No photo'}
                                            </p>
                                        </div>
                                    );
                                })}
                            </div>

                            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                                <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                                    <div>
                                        <h2 className="text-lg font-semibold">
                                            Visitor List
                                        </h2>
                                        <p className="text-sm text-slate-500">
                                            Filter by date, session, or
                                            attendance status
                                        </p>
                                    </div>
                                    <span className="rounded-full bg-sky-500/10 px-2.5 py-1 text-xs font-semibold text-sky-700">
                                        {filteredVisitors.length} records
                                    </span>
                                </div>

                                <div className="mb-4 grid gap-3 md:grid-cols-4">
                                    <label className="text-sm text-slate-600">
                                        <span className="mb-1 block font-medium">
                                            From
                                        </span>
                                        <input
                                            type="date"
                                            value={dateFrom}
                                            onChange={(event) =>
                                                setDateFrom(event.target.value)
                                            }
                                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm transition outline-none focus:border-sky-500 focus:bg-white"
                                        />
                                    </label>

                                    <label className="text-sm text-slate-600">
                                        <span className="mb-1 block font-medium">
                                            To
                                        </span>
                                        <input
                                            type="date"
                                            value={dateTo}
                                            onChange={(event) =>
                                                setDateTo(event.target.value)
                                            }
                                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm transition outline-none focus:border-sky-500 focus:bg-white"
                                        />
                                    </label>

                                    <label className="text-sm text-slate-600">
                                        <span className="mb-1 block font-medium">
                                            Session
                                        </span>
                                        <select
                                            value={sessionFilter}
                                            onChange={(event) =>
                                                setSessionFilter(
                                                    event.target.value,
                                                )
                                            }
                                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm transition outline-none focus:border-sky-500 focus:bg-white"
                                        >
                                            <option value="All sessions">
                                                All sessions
                                            </option>
                                            {sessionOptions.map((session) => (
                                                <option
                                                    key={session}
                                                    value={session}
                                                >
                                                    {session}
                                                </option>
                                            ))}
                                        </select>
                                    </label>

                                    <label className="text-sm text-slate-600">
                                        <span className="mb-1 block font-medium">
                                            Status
                                        </span>
                                        <select
                                            value={statusFilter}
                                            onChange={(event) =>
                                                setStatusFilter(
                                                    event.target.value,
                                                )
                                            }
                                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm transition outline-none focus:border-sky-500 focus:bg-white"
                                        >
                                            <option value="All status">
                                                All status
                                            </option>
                                            <option value="Active">
                                                Active
                                            </option>
                                            <option value="Photo uploaded">
                                                Photo uploaded
                                            </option>
                                            <option value="No activity">
                                                No activity
                                            </option>
                                        </select>
                                    </label>
                                </div>

                                <div className="overflow-x-auto">
                                    <table className="min-w-full text-left text-sm">
                                        <thead>
                                            <tr className="border-b border-slate-200 text-slate-500">
                                                <th className="pr-4 pb-3 font-medium">
                                                    Date
                                                </th>
                                                <th className="pr-4 pb-3 font-medium">
                                                    Session
                                                </th>
                                                <th className="pr-4 pb-3 font-medium">
                                                    Visitor
                                                </th>
                                                <th className="pr-4 pb-3 font-medium">
                                                    Company
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredVisitors.length > 0 ? (
                                                filteredVisitors.map(
                                                    (visitor) => (
                                                        <tr
                                                            key={visitor.id}
                                                            className="border-b border-slate-100 last:border-0"
                                                        >
                                                            <td className="py-3 pr-4 font-medium text-slate-700">
                                                                {visitor.date}
                                                            </td>
                                                            <td className="py-3 pr-4 text-slate-600">
                                                                {
                                                                    visitor.session
                                                                }
                                                            </td>
                                                            <td className="py-3 pr-4">
                                                                <div>
                                                                    <p className="font-medium text-slate-800">
                                                                        {
                                                                            visitor.fullName
                                                                        }
                                                                    </p>
                                                                    <p className="text-xs text-slate-500">
                                                                        {
                                                                            visitor.checkIn
                                                                        }
                                                                    </p>
                                                                </div>
                                                            </td>
                                                            <td className="py-3 pr-4 text-slate-600">
                                                                {visitor.company ||
                                                                    '—'}
                                                            </td>
                                                        </tr>
                                                    ),
                                                )
                                            ) : (
                                                <tr>
                                                    <td
                                                        colSpan={4}
                                                        className="py-8 text-center text-sm text-slate-500"
                                                    >
                                                        No matching visitors for
                                                        the selected date and
                                                        session filters.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </section>
                        </main>
                    </div>
                </div>
            </div>
        </>
    );
}
