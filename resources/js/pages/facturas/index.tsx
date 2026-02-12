import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { useState } from 'react';

declare function route(name: string, params?: any): string;

interface Factura {
    id: number;
    numero_factura: string;
    fecha_emision: string;
    fecha_vencimiento: string;
    total: number;
    estado: 'borrador' | 'emitida' | 'pagada' | 'anulada';
    cliente: {
        id: number;
        nombre: string;
        documento: string;
    };
}

interface Props {
    facturas: {
        data: Factura[];
        links: any[];
    };
}

const estadoColors = {
    borrador: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400',
    emitida: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    pagada: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    anulada: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};

const estadoTexto = {
    borrador: 'Borrador',
    emitida: 'Emitida',
    pagada: 'Pagada',
    anulada: 'Anulada',
};

export default function Index({ facturas }: Props) {
    const [processing, setProcessing] = useState<number | null>(null);

    const cambiarEstado = (facturaId: number, accion: 'emitir' | 'pagar' | 'anular') => {
        setProcessing(facturaId);

        let url = '';
        if (accion === 'emitir') url = `/facturas/${facturaId}/emitir`;
        if (accion === 'pagar') url = `/facturas/${facturaId}/pagar`;
        if (accion === 'anular') url = `/facturas/${facturaId}/anular`;

        router.post(url, {}, {
            onError: (errors) => {
                console.error(errors);
                alert(errors.error || 'Error al cambiar el estado');
                setProcessing(null);
            },
            onSuccess: () => {
                router.reload(); // Recarga la página para ver el cambio de estado
                setProcessing(null);
            },
        });
    };

    return (
        <AppLayout>
            <Head title="Facturas">
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link
                    href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
                    rel="stylesheet"
                />
                <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
            </Head>

            <div className="flex-1 p-8 overflow-hidden flex flex-col space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="bg-[#2563eb] p-2 rounded-lg">
                            <span className="material-icons text-white">receipt_long</span>
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Facturas</h1>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Gestión de facturación y ventas corporativas
                            </p>
                        </div>
                    </div>

                    <Link
                        href='/facturas/create'
                        className="bg-[#2563eb] text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
                    >
                        <span className="material-icons text-sm">add</span>
                        Nueva Factura
                    </Link>
                </div>

                {/* Table */}
                <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-gray-100 dark:border-zinc-800 overflow-hidden flex-1">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 dark:bg-zinc-800/50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                        Número
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                        Cliente
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                        Fecha Emisión
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                        Vencimiento
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                        Total
                                    </th>
                                    <th className="px-6 py-3 text-center text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                        Estado
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                        Acciones
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-zinc-800">
                                {facturas.data.map((factura) => (
                                    <tr
                                        key={factura.id}
                                        className="hover:bg-gray-50 dark:hover:bg-zinc-800/30 transition-colors"
                                    >
                                        <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                                            {factura.numero_factura}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                                            <div>
                                                <div className="font-medium text-gray-900 dark:text-white">
                                                    {factura.cliente.nombre}
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    {factura.cliente.documento}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                                            {new Date(factura.fecha_emision).toLocaleDateString('es-CO')}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                                            {new Date(factura.fecha_vencimiento).toLocaleDateString('es-CO')}
                                        </td>
                                        <td className="px-6 py-4 text-right text-sm font-semibold text-gray-900 dark:text-white">
                                            ${Number(factura.total).toLocaleString('es-CO', {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2,
                                            })}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span
                                                className={`px-3 py-1 text-[10px] font-bold uppercase rounded-full ${
                                                    estadoColors[factura.estado]
                                                }`}
                                            >
                                                {estadoTexto[factura.estado]}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-3">
                                                {/* Siempre visible: Ver Detalles */}
                                                <Link
                                                    href={`/facturas/${factura.id}`}
                                                    className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
                                                >
                                                    Ver
                                                </Link>

                                                {/* Acciones según estado */}
                                                {factura.estado === 'borrador' && (
                                                    <button
                                                        onClick={() => cambiarEstado(factura.id, 'emitir')}
                                                        disabled={processing === factura.id}
                                                        className="text-amber-600 dark:text-amber-400 hover:underline font-medium disabled:opacity-50"
                                                    >
                                                        Emitir
                                                    </button>
                                                )}

                                                {factura.estado === 'emitida' && (
                                                    <>
                                                        <button
                                                            onClick={() => cambiarEstado(factura.id, 'pagar')}
                                                            disabled={processing === factura.id}
                                                            className="text-green-600 dark:text-green-400 hover:underline font-medium disabled:opacity-50"
                                                        >
                                                            Pagar
                                                        </button>
                                                        <button
                                                            onClick={() => cambiarEstado(factura.id, 'anular')}
                                                            disabled={processing === factura.id}
                                                            className="text-red-600 dark:text-red-400 hover:underline font-medium disabled:opacity-50"
                                                        >
                                                            Anular
                                                        </button>
                                                    </>
                                                )}

                                                {/* Para estados pagada o anulada solo se muestra "Ver" */}
                                            </div>
                                        </td>
                                    </tr>
                                ))}

                                {facturas.data.length === 0 && (
                                    <tr>
                                        <td colSpan={7} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                                            <div className="flex flex-col items-center gap-2">
                                                <span className="material-icons text-4xl">receipt_long</span>
                                                <p>No hay facturas registradas</p>
                                                <Link
                                                    href='/facturas/create'
                                                    className="text-blue-600 hover:underline mt-2"
                                                >
                                                    Crear primera factura
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}