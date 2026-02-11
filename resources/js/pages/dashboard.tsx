import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

export default function Dashboard() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard">
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link
                    href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
                    rel="stylesheet"
                />
                <link href="https://fonts.googleapis.com/icon?family=Material+Icons+Outlined" rel="stylesheet" />
                <style>{`
                    .custom-scrollbar::-webkit-scrollbar {
                        width: 4px;
                    }
                    .custom-scrollbar::-webkit-scrollbar-track {
                        background: transparent;
                    }
                    .custom-scrollbar::-webkit-scrollbar-thumb {
                        background: #d1d5db;
                        border-radius: 10px;
                    }
                    .dark .custom-scrollbar::-webkit-scrollbar-thumb {
                        background: #374151;
                    }
                `}</style>
            </Head>

            <div className="flex-1 p-8 overflow-hidden flex flex-col space-y-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 shrink-0">
                    <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-slate-200 dark:border-zinc-800 shadow-sm flex flex-col">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Ventas Totales</span>
                        <div className="flex items-end justify-between">
                            <span className="text-2xl font-bold">$124,592.00</span>
                            <span className="text-green-500 text-xs font-medium flex items-center">
                                <span className="material-icons-outlined text-sm">trending_up</span> 12%
                            </span>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-slate-200 dark:border-zinc-800 shadow-sm flex flex-col">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Facturas Pendientes</span>
                        <div className="flex items-end justify-between">
                            <span className="text-2xl font-bold">14</span>
                            <span className="text-amber-500 text-xs font-medium">Acción Requerida</span>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-slate-200 dark:border-zinc-800 shadow-sm flex flex-col">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Proyectos Activos</span>
                        <div className="flex items-end justify-between">
                            <span className="text-2xl font-bold">28</span>
                            <span className="text-slate-400 text-xs">Actualizado hace 2m</span>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-slate-200 dark:border-zinc-800 shadow-sm flex flex-col">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Estado del Sistema</span>
                        <div className="flex items-end justify-between">
                            <span className="text-2xl font-bold">Óptimo</span>
                            <span className="text-green-500 w-3 h-3 bg-green-500 rounded-full animate-pulse mb-2"></span>
                        </div>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 overflow-hidden">
                    {/* Recent Invoices Table */}
                    <div className="lg:col-span-2 bg-white dark:bg-zinc-900 rounded-xl border border-slate-200 dark:border-zinc-800 shadow-sm flex flex-col overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-200 dark:border-zinc-800 flex items-center justify-between shrink-0">
                            <h2 className="font-semibold text-slate-800 dark:text-white">Facturas Recientes</h2>
                            <button className="text-sm font-medium text-slate-500 hover:text-black dark:text-slate-400 dark:hover:text-white">
                                Ver Todas
                            </button>
                        </div>
                        <div className="flex-1 overflow-auto custom-scrollbar">
                            <table className="w-full text-left border-collapse">
                                <thead className="sticky top-0 bg-slate-50 dark:bg-zinc-800/50 z-10">
                                    <tr>
                                        <th className="px-6 py-3 text-xs font-bold uppercase tracking-wider text-slate-500">ID</th>
                                        <th className="px-6 py-3 text-xs font-bold uppercase tracking-wider text-slate-500">Cliente</th>
                                        <th className="px-6 py-3 text-xs font-bold uppercase tracking-wider text-slate-500">Monto</th>
                                        <th className="px-6 py-3 text-xs font-bold uppercase tracking-wider text-slate-500">Estado</th>
                                        <th className="px-6 py-3 text-xs font-bold uppercase tracking-wider text-slate-500">Fecha</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-zinc-800">
                                    <tr className="hover:bg-slate-50 dark:hover:bg-zinc-800/30 transition-colors">
                                        <td className="px-6 py-4 text-sm font-medium">#FAC-9281</td>
                                        <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">Global Logistics Corp</td>
                                        <td className="px-6 py-4 text-sm font-semibold">$3,420.00</td>
                                        <td className="px-6 py-4">
                                            <span className="px-2 py-1 text-[10px] font-bold uppercase rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                                                Pagada
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-500">24 Oct, 2023</td>
                                    </tr>
                                    <tr className="hover:bg-slate-50 dark:hover:bg-zinc-800/30 transition-colors">
                                        <td className="px-6 py-4 text-sm font-medium">#FAC-9282</td>
                                        <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">Modern Tech S.A.</td>
                                        <td className="px-6 py-4 text-sm font-semibold">$1,200.50</td>
                                        <td className="px-6 py-4">
                                            <span className="px-2 py-1 text-[10px] font-bold uppercase rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                                                Pendiente
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-500">25 Oct, 2023</td>
                                    </tr>
                                    <tr className="hover:bg-slate-50 dark:hover:bg-zinc-800/30 transition-colors">
                                        <td className="px-6 py-4 text-sm font-medium">#FAC-9283</td>
                                        <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">Blue Horizon Ltd</td>
                                        <td className="px-6 py-4 text-sm font-semibold">$8,900.00</td>
                                        <td className="px-6 py-4">
                                            <span className="px-2 py-1 text-[10px] font-bold uppercase rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                                                Pagada
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-500">26 Oct, 2023</td>
                                    </tr>
                                    <tr className="hover:bg-slate-50 dark:hover:bg-zinc-800/30 transition-colors">
                                        <td className="px-6 py-4 text-sm font-medium">#FAC-9284</td>
                                        <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">Nova Solutions</td>
                                        <td className="px-6 py-4 text-sm font-semibold">$2,105.00</td>
                                        <td className="px-6 py-4">
                                            <span className="px-2 py-1 text-[10px] font-bold uppercase rounded-full bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
                                                Vencida
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-500">21 Oct, 2023</td>
                                    </tr>
                                    <tr className="hover:bg-slate-50 dark:hover:bg-zinc-800/30 transition-colors">
                                        <td className="px-6 py-4 text-sm font-medium">#FAC-9285</td>
                                        <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">Peak Performance</td>
                                        <td className="px-6 py-4 text-sm font-semibold">$640.25</td>
                                        <td className="px-6 py-4">
                                            <span className="px-2 py-1 text-[10px] font-bold uppercase rounded-full bg-slate-100 text-slate-700 dark:bg-zinc-800 dark:text-slate-400">
                                                Borrador
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-500">28 Oct, 2023</td>
                                    </tr>
                                    <tr className="hover:bg-slate-50 dark:hover:bg-zinc-800/30 transition-colors">
                                        <td className="px-6 py-4 text-sm font-medium">#FAC-9286</td>
                                        <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">Summit Retail Group</td>
                                        <td className="px-6 py-4 text-sm font-semibold">$12,400.00</td>
                                        <td className="px-6 py-4">
                                            <span className="px-2 py-1 text-[10px] font-bold uppercase rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                                                Pagada
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-500">29 Oct, 2023</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Top Products */}
                    <div className="bg-white dark:bg-zinc-900 rounded-xl border border-slate-200 dark:border-zinc-800 shadow-sm flex flex-col overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-200 dark:border-zinc-800 flex items-center justify-between shrink-0">
                            <h2 className="font-semibold text-slate-800 dark:text-white">Productos Destacados</h2>
                            <span className="text-xs text-slate-400">Mensual</span>
                        </div>
                        <div className="flex-1 overflow-auto p-6 custom-scrollbar">
                            <ul className="space-y-6">
                                <li className="flex items-center">
                                    <div className="w-10 h-10 bg-slate-100 dark:bg-zinc-800 rounded-lg flex items-center justify-center mr-4">
                                        <span className="material-icons-outlined text-slate-500">laptop</span>
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-semibold">Estación de Trabajo Pro X1</p>
                                        <p className="text-xs text-slate-500">42 unidades vendidas</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-bold">$62,160</p>
                                        <p className="text-[10px] text-green-500">+14%</p>
                                    </div>
                                </li>
                                <li className="flex items-center">
                                    <div className="w-10 h-10 bg-slate-100 dark:bg-zinc-800 rounded-lg flex items-center justify-center mr-4">
                                        <span className="material-icons-outlined text-slate-500">cloud</span>
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-semibold">Cloud Sync Premium</p>
                                        <p className="text-xs text-slate-500">128 licencias</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-bold">$12,800</p>
                                        <p className="text-[10px] text-green-500">+8%</p>
                                    </div>
                                </li>
                                <li className="flex items-center">
                                    <div className="w-10 h-10 bg-slate-100 dark:bg-zinc-800 rounded-lg flex items-center justify-center mr-4">
                                        <span className="material-icons-outlined text-slate-500">router</span>
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-semibold">Switch NetCore 24p</p>
                                        <p className="text-xs text-slate-500">18 unidades vendidas</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-bold">$9,360</p>
                                        <p className="text-[10px] text-red-500">-2%</p>
                                    </div>
                                </li>
                                <li className="flex items-center">
                                    <div className="w-10 h-10 bg-slate-100 dark:bg-zinc-800 rounded-lg flex items-center justify-center mr-4">
                                        <span className="material-icons-outlined text-slate-500">storage</span>
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-semibold">Bloque de Almacenamiento 2TB</p>
                                        <p className="text-xs text-slate-500">54 unidades vendidas</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-bold">$7,020</p>
                                        <p className="text-[10px] text-green-500">+22%</p>
                                    </div>
                                </li>
                                <li className="flex items-center opacity-60">
                                    <div className="w-10 h-10 bg-slate-100 dark:bg-zinc-800 rounded-lg flex items-center justify-center mr-4">
                                        <span className="material-icons-outlined text-slate-500">support_agent</span>
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-semibold">Soporte Prioritario</p>
                                        <p className="text-xs text-slate-500">12 meses</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-bold">$2,400</p>
                                        <p className="text-[10px] text-slate-400">Estable</p>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}