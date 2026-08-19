import { Link, usePage } from '@inertiajs/react';

type SidebarItem = {
    label: string;
    href: string;
};

const sidebarItems: SidebarItem[] = [
    { label: "Dashboard", href: "/monitoring/dashboard" },
    { label: "Pelatihan", href: "/monitoring/pelatihan" },
    { label: "Pengunjung", href: "/monitoring/visitor" },
    { label: "Aktivitas", href: "/monitoring/aktivitas" },
];

export default function Sidebar() {
    const { url } = usePage<{ url?: string }>().props;
    const currentUrl = url ?? '';

    return (
        <aside className=" border border-slate-200 bg-slate-900 p-5 text-slate-100 shadow-lg shadow-slate-200/60">
            <div className="flex items-center gap-3 border-b border-slate-700 pb-5">
                <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl font-bold text-white">
                    <img src="/img/BLC.png" alt="Broadband Learning Center logo" className=" object-cover" />
                </div>
                <div>
                    <h2 className="text-lg font-semibold">Broadband Learning Center</h2>
                </div>
            </div>

            <nav className="mt-6 space-y-2">
                {sidebarItems.map((item) => {
                    const isActive = currentUrl === item.href || (!!currentUrl && item.href !== '/' && currentUrl.startsWith(item.href));

                    return (
                        <Link
                            key={item.label}
                            href={item.href}
                            className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm font-medium transition ${isActive
                                ? "bg-slate-800 text-white shadow-sm"
                                : "text-slate-300 hover:bg-slate-800/80 hover:text-white"
                                }`}
                        >
                            <span>{item.label}</span>
                            {isActive ? <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" /> : null}
                        </Link>
                    );
                })}
            </nav>
        </aside>
    );
}
