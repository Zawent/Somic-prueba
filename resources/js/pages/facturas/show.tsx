import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';

declare function route(name: string, params?: any): string;

interface Factura {
    id: number;
    numero_factura: string;
    fecha_emision: string;
    fecha_vencimiento: string;
    subtotal: number;
    total: number;
    total_costo: number;
    estado: string;
    notas: string | null;
    cliente: {
        id: number;
        nombre: string;
        documento: string;
        cupo: number;
        plazo_dias: number;
        tipo_documento: {
            nombre: string;
        };
    };
    items: Array<{
        id: number;
        cantidad: number;
        costo_unitario: number;
        precio_venta_unitario: number;
        subtotal: number;
        total_costo: number;
        es_venta: boolean;
        articulo: {
            id: number;
            codigo: string;
            nombre: string;
            laboratorio: string;
        };
    }>;
}

interface Props {
    factura: Factura;
}

export default function Show({ factura }: Props) {
    const calcularCupoDisponible = () => {
        // Esto debería venir del backend, pero lo calculamos aquí para el ejemplo
        return factura.cliente.cupo * 0.8; // Ejemplo: 80% disponible
    };

    const calcularPorcentajeCupo = () => {
        return 80; // Ejemplo
    };

    return (
        <AppLayout>
            <Head title={`Factura ${factura.numero_factura}`}>
                <link
                    href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
                    rel="stylesheet"
                />
                <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
            </Head>

            <div className="bg-[#f8fafc] dark:bg-[#0f172a] min-h-screen p-4 md:p-8">
                <div className="max-w-7xl mx-auto space-y-6">
                    {/* Header */}
                    <header className="flex justify-between items-center mb-8">
                        <div className="flex items-center gap-3">
                            <div className="bg-[#2563eb] p-2 rounded-lg">
                                <span className="material-icons text-white">receipt_long</span>
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                                    Factura {factura.numero_factura}
                                </h1>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Vista de factura - Estado:{' '}
                                    <span className="font-semibold capitalize">{factura.estado}</span>
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <Link
                                href='/facturas'
                                className="bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors dark:text-white"
                            >
                                Volver al Listado
                            </Link>
                        </div>
                    </header>

                    {/* Datos de Factura y Cliente */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Datos de Factura */}
                        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-slate-800 lg:col-span-1">
                            <h2 className="text-sm font-bold text-gray-400 uppercase mb-4 flex items-center gap-2">
                                <span className="material-icons text-xs">info</span> Datos de Factura
                            </h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Número de Factura
                                    </label>
                                    <div className="block w-full rounded-md border border-gray-300 shadow-sm bg-gray-50 dark:bg-slate-800 dark:border-slate-700 dark:text-white sm:text-sm px-3 py-2">
                                        {factura.numero_factura}
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Fecha
                                        </label>
                                        <div className="block w-full rounded-md border border-gray-300 shadow-sm bg-gray-50 dark:bg-slate-800 dark:border-slate-700 dark:text-white sm:text-sm px-3 py-2">
                                            {new Date(factura.fecha_emision).toLocaleDateString('es-CO')}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Vencimiento
                                        </label>
                                        <div className="block w-full rounded-md border border-gray-300 shadow-sm bg-gray-50 dark:bg-slate-800 dark:border-slate-700 dark:text-white sm:text-sm px-3 py-2">
                                            {new Date(factura.fecha_vencimiento).toLocaleDateString('es-CO')}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Información del Cliente */}
                        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-slate-800 lg:col-span-2">
                            <h2 className="text-sm font-bold text-gray-400 uppercase mb-4 flex items-center gap-2">
                                <span className="material-icons text-xs">person</span> Información del Cliente
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                                <div className="col-span-1 md:col-span-2">
                                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Documento del Cliente
                                    </label>
                                    <div className="block w-full rounded-md border border-gray-300 shadow-sm bg-gray-50 dark:bg-slate-800 dark:border-slate-700 dark:text-white sm:text-sm px-3 py-2">
                                        {factura.cliente.tipo_documento.nombre} - {factura.cliente.documento}
                                    </div>
                                    <p className="mt-2 text-sm font-semibold text-[#2563eb]">
                                        Nombre:{' '}
                                        <span className="text-gray-900 dark:text-white font-normal">
                                            {factura.cliente.nombre}
                                        </span>
                                    </p>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider dark:text-gray-400">
                                            Plazo
                                        </p>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                                            {factura.cliente.plazo_dias} Días
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider dark:text-gray-400">
                                            Cupo
                                        </p>
                                        <p className="text-sm font-medium text-green-600">
                                            ${Number(factura.cliente.cupo).toLocaleString('es-CO', {
                                                minimumFractionDigits: 2,
                                            })}
                                        </p>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider dark:text-gray-400">
                                            Cartera
                                        </p>
                                        <p className="text-sm font-medium text-red-500">
                                            ${(factura.cliente.cupo * 0.2).toLocaleString('es-CO', {
                                                minimumFractionDigits: 2,
                                            })}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider dark:text-gray-400">
                                            Disponible
                                        </p>
                                        <p className="text-sm font-medium text-blue-600 font-bold">
                                            ${calcularCupoDisponible().toLocaleString('es-CO', {
                                                minimumFractionDigits: 2,
                                            })}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="w-full bg-gray-100 dark:bg-slate-800 rounded-full h-2">
                                <div
                                    className="bg-[#2563eb] h-2 rounded-full"
                                    style={{ width: `${calcularPorcentajeCupo()}%` }}
                                ></div>
                            </div>
                            <p className="text-[10px] text-gray-400 mt-1 text-right">
                                {calcularPorcentajeCupo()}% cupo disponible
                            </p>
                        </div>
                    </div>

                    {/* Tabla de Items */}
                    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-gray-100 dark:border-slate-800 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 dark:border-slate-800">
                            <h2 className="text-sm font-bold text-gray-400 uppercase flex items-center gap-2">
                                <span className="material-icons text-xs">shopping_cart</span> Artículos de la Factura
                            </h2>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-800">
                                <thead className="bg-gray-50 dark:bg-slate-800/50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            Código
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            Descripción
                                        </th>
                                        <th className="px-6 py-3 text-center text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            Cant.
                                        </th>
                                        <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            Costo
                                        </th>
                                        <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            Precio Vta.
                                        </th>
                                        <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            Total
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
                                    {factura.items.map((item) => (
                                        <tr
                                            key={item.id}
                                            className="hover:bg-gray-50 dark:hover:bg-slate-800/30 transition-colors"
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                                                {item.articulo.codigo}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                                                {item.articulo.nombre} - {item.articulo.laboratorio}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-600 dark:text-gray-300">
                                                {item.cantidad}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-600 dark:text-gray-300">
                                                ${Number(item.costo_unitario).toLocaleString('es-CO', {
                                                    minimumFractionDigits: 2,
                                                })}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-600 dark:text-gray-300">
                                                ${Number(item.precio_venta_unitario).toLocaleString('es-CO', {
                                                    minimumFractionDigits: 2,
                                                })}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-semibold text-gray-900 dark:text-white">
                                                ${Number(item.subtotal).toLocaleString('es-CO', {
                                                    minimumFractionDigits: 2,
                                                })}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Footer con Totales */}
                        <div className="bg-gray-50 dark:bg-slate-800/20 px-6 py-8 border-t border-gray-100 dark:border-slate-800">
                            <div className="flex flex-col md:flex-row justify-between items-end gap-6">
                                <div className="flex-1 w-full md:w-auto">
                                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
                                        Notas / Comentarios de Factura
                                    </label>
                                    <div className="block w-full rounded-md border border-gray-300 shadow-sm bg-gray-50 dark:bg-slate-800 dark:border-slate-700 dark:text-white sm:text-sm px-3 py-2 min-h-[80px]">
                                        {factura.notas || 'Sin notas'}
                                    </div>
                                </div>
                                <div className="w-full md:w-72 space-y-3">
                                    <div className="flex justify-between items-center text-gray-600 dark:text-gray-400">
                                        <span className="text-sm">Total Costo:</span>
                                        <span className="text-lg font-medium">
                                            ${Number(factura.total_costo).toLocaleString('es-CO', {
                                                minimumFractionDigits: 2,
                                            })}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center border-t border-gray-200 dark:border-slate-700 pt-3 text-gray-900 dark:text-white">
                                        <span className="text-base font-bold">Total Venta:</span>
                                        <span className="text-2xl font-bold text-[#2563eb]">
                                            ${Number(factura.total).toLocaleString('es-CO', {
                                                minimumFractionDigits: 2,
                                            })}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center text-green-600 dark:text-green-400">
                                        <span className="text-sm">Utilidad:</span>
                                        <span className="text-lg font-bold">
                                            ${(factura.total - factura.total_costo).toLocaleString('es-CO', {
                                                minimumFractionDigits: 2,
                                            })}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}