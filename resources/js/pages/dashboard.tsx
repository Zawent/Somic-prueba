import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';

interface DashboardProps {
    stats: {
        ventas_totales: number;
        facturas_pendientes: number;
        clientes_activos: number;
        estado_sistema: string;
    };
    facturasRecientes: Array<{
        id: number;
        numero: string;
        cliente: string;
        monto: number;
        estado: string;
        fecha: string;
    }>;
    productosDestacados: Array<{
        id: number;
        nombre: string;
        codigo: string;
        unidades_vendidas: number;
        ingresos: number;
        variacion: string;
    }>;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

export default function Dashboard({ stats, facturasRecientes, productosDestacados }: DashboardProps) {
    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(value);
    };

    const estadoBadge = (estado: string) => {
        const estados: Record<string, { bg: string; text: string; label: string }> = {
            pagada: { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-700 dark:text-green-400', label: 'Pagada' },
            emitida: { bg: 'bg-amber-100 dark:bg-amber-900/30', text: 'text-amber-700 dark:text-amber-400', label: 'Pendiente' },
            anulada: { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-700 dark:text-red-400', label: 'Anulada' },
            borrador: { bg: 'bg-slate-100 dark:bg-zinc-800', text: 'text-slate-700 dark:text-slate-400', label: 'Borrador' },
        };
        const style = estados[estado] ?? estados.borrador;
        return (
            <span className={`px-2 py-1 text-[10px] font-bold uppercase rounded-full ${style.bg} ${style.text}`}>
                {style.label}
            </span>
        );
    };

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
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 shrink-0">
                    <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-slate-200 dark:border-zinc-800 shadow-sm flex flex-col">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Ventas Totales</span>
                        <div className="flex items-end justify-between">
                            <span className="text-2xl font-bold">{formatCurrency(stats.ventas_totales)}</span>
                            <span className="text-green-500 text-xs font-medium flex items-center">
                                <span className="material-icons-outlined text-sm">trending_up</span> 12%
                            </span>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-slate-200 dark:border-zinc-800 shadow-sm flex flex-col">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Facturas Pendientes</span>
                        <div className="flex items-end justify-between">
                            <span className="text-2xl font-bold">{stats.facturas_pendientes}</span>
                            <span className="text-amber-500 text-xs font-medium">Acción Requerida</span>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-slate-200 dark:border-zinc-800 shadow-sm flex flex-col">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Clientes Activos</span>
                        <div className="flex items-end justify-between">
                            <span className="text-2xl font-bold">{stats.clientes_activos}</span>
                            <span className="text-slate-400 text-xs">Actualizado hace 2m</span>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-slate-200 dark:border-zinc-800 shadow-sm flex flex-col">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Estado del Sistema</span>
                        <div className="flex items-end justify-between">
                            <span className="text-2xl font-bold">{stats.estado_sistema}</span>
                            <span className="text-green-500 w-3 h-3 bg-green-500 rounded-full animate-pulse mb-2"></span>
                        </div>
                    </div>
                </div>

                <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 overflow-hidden">
                    <div className="lg:col-span-2 bg-white dark:bg-zinc-900 rounded-xl border border-slate-200 dark:border-zinc-800 shadow-sm flex flex-col overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-200 dark:border-zinc-800 flex items-center justify-between shrink-0">
                            <h2 className="font-semibold text-slate-800 dark:text-white">Facturas Recientes</h2>
                            <a
                                href='/facturas'
                                className="text-sm font-medium text-slate-500 hover:text-black dark:text-slate-400 dark:hover:text-white"
                            >
                                Ver Todas
                            </a>
                        </div>
                        <div className="flex-1 overflow-auto custom-scrollbar">
                            <table className="w-full text-left border-collapse">
                                <thead className="sticky top-0 bg-slate-50 dark:bg-zinc-800/50 z-10">
                                    <tr>
                                        <th className="px-6 py-3 text-xs font-bold uppercase tracking-wider text-slate-500">N° Factura</th>
                                        <th className="px-6 py-3 text-xs font-bold uppercase tracking-wider text-slate-500">Cliente</th>
                                        <th className="px-6 py-3 text-xs font-bold uppercase tracking-wider text-slate-500">Monto</th>
                                        <th className="px-6 py-3 text-xs font-bold uppercase tracking-wider text-slate-500">Estado</th>
                                        <th className="px-6 py-3 text-xs font-bold uppercase tracking-wider text-slate-500">Fecha</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-zinc-800">
                                    {facturasRecientes.map((factura) => (
                                        <tr key={factura.id} className="hover:bg-slate-50 dark:hover:bg-zinc-800/30 transition-colors">
                                            <td className="px-6 py-4 text-sm font-medium">{factura.numero}</td>
                                            <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">{factura.cliente}</td>
                                            <td className="px-6 py-4 text-sm font-semibold">{formatCurrency(factura.monto)}</td>
                                            <td className="px-6 py-4">{estadoBadge(factura.estado)}</td>
                                            <td className="px-6 py-4 text-sm text-slate-500">{factura.fecha}</td>
                                        </tr>
                                    ))}
                                    {facturasRecientes.length === 0 && (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-8 text-center text-sm text-slate-500">
                                                No hay facturas recientes
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-zinc-900 rounded-xl border border-slate-200 dark:border-zinc-800 shadow-sm flex flex-col overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-200 dark:border-zinc-800 flex items-center justify-between shrink-0">
                            <h2 className="font-semibold text-slate-800 dark:text-white">Productos más vendidos</h2>
                            <span className="text-xs text-slate-400">Mensual</span>
                        </div>
                        <div className="flex-1 overflow-auto p-6 custom-scrollbar">
                            <ul className="space-y-6">
                                {productosDestacados.map((producto) => (
                                    <li key={producto.id} className="flex items-center">
                                        <div className="w-10 h-10 bg-slate-100 dark:bg-zinc-800 rounded-lg flex items-center justify-center mr-4">
                                            <span className="material-icons-outlined text-slate-500">
                                                {producto.codigo.startsWith('SW') ? 'router' : 
                                                 producto.codigo.startsWith('LK') ? 'laptop' : 
                                                 producto.codigo.startsWith('CS') ? 'cloud' : 
                                                 producto.codigo.startsWith('ST') ? 'storage' : 'inventory'}
                                            </span>
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-semibold">{producto.nombre}</p>
                                            <p className="text-xs text-slate-500">{producto.unidades_vendidas} unidades vendidas</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-bold">{formatCurrency(producto.ingresos)}</p>
                                            <p className={`text-[10px] ${
                                                producto.variacion.startsWith('-') ? 'text-red-500' : 'text-green-500'
                                            }`}>
                                                {producto.variacion}
                                            </p>
                                        </div>
                                    </li>
                                ))}
                                {productosDestacados.length === 0 && (
                                    <li className="text-sm text-slate-500 text-center py-4">
                                        No hay productos vendidos aún
                                    </li>
                                )}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}