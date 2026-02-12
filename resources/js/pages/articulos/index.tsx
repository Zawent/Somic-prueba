import { Head, Link } from '@inertiajs/react'
import AppLayout from '@/layouts/app-layout'

interface Articulo {
    id: number
    codigo: string
    nombre: string
    laboratorio: string
    saldo: number
    costo: number
    precio_venta: number
}

interface Props {
    articulos: {
        data: Articulo[]
        links: any[]
    }
}

export default function Index({ articulos }: Props) {
    return (
        <AppLayout>
            <Head title="Artículos" />

            <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">Artículos</h1>

                    <Link
                        href="/articulos/create"
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Nuevo Artículo
                    </Link>
                </div>

                <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-slate-200 dark:border-zinc-800 p-6">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-slate-200 dark:border-zinc-800">
                                <th className="text-left py-3 font-semibold">Código</th>
                                <th className="text-left py-3 font-semibold">Nombre</th>
                                <th className="text-left py-3 font-semibold">Laboratorio</th>
                                <th className="text-left py-3 font-semibold">Saldo</th>
                                <th className="text-left py-3 font-semibold">Precio Venta</th>
                                <th className="text-right py-3 font-semibold">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {articulos.data.map(articulo => (
                                <tr
                                    key={articulo.id}
                                    className="border-b border-slate-100 dark:border-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-800/30 transition-colors"
                                >
                                    <td className="py-3">{articulo.codigo}</td>

                                    <td className="py-3">
                                        <Link
                                            href={`/articulos/${articulo.id}`}
                                            className="font-medium hover:text-blue-600 dark:hover:text-blue-400"
                                        >
                                            {articulo.nombre}
                                        </Link>
                                    </td>

                                    <td className="py-3">{articulo.laboratorio}</td>

                                    <td className="py-3 font-semibold">
                                        {articulo.saldo}
                                    </td>

                                    <td className="py-3 font-semibold">
                                        ${Number(articulo.precio_venta).toLocaleString('es-CO')}
                                    </td>

                                    <td className="text-right py-3">
                                        <Link
                                            href={`/articulos/${articulo.id}/edit`}
                                            className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
                                        >
                                            Editar
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AppLayout>
    )
}
