import { Head, Link } from '@inertiajs/react'
import AppLayout from '@/layouts/app-layout'

interface Cliente {
    id: number
    nombre: string
    documento: string
    cupo: number
    plazo_dias: number
    tipo_documento: {
        nombre: string
    }
}

interface Props {
    clientes: {
        data: Cliente[]
        links: any[]
    }
}

export default function Index({ clientes }: Props) {
    return (
        <AppLayout>
            <Head title="Clientes" />

            <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">Clientes</h1>

                    <Link
                        href="/clientes/create"
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Nuevo Cliente
                    </Link>
                </div>

                <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-slate-200 dark:border-zinc-800 p-6">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-slate-200 dark:border-zinc-800">
                                <th className="text-left py-3 font-semibold text-slate-700 dark:text-slate-300">Nombre</th>
                                <th className="text-left py-3 font-semibold text-slate-700 dark:text-slate-300">Documento</th>
                                <th className="text-left py-3 font-semibold text-slate-700 dark:text-slate-300">Cupo</th>
                                <th className="text-left py-3 font-semibold text-slate-700 dark:text-slate-300">Plazo</th>
                                <th className="text-right py-3 font-semibold text-slate-700 dark:text-slate-300">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {clientes.data.map(cliente => (
                                <tr 
                                    key={cliente.id} 
                                    className="border-b border-slate-100 dark:border-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-800/30 transition-colors"
                                >
                                    <td className="py-3">
                                        <Link
                                            href={`/clientes/${cliente.id}`}
                                            className="text-slate-900 dark:text-white font-medium hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                                        >
                                            {cliente.nombre}
                                        </Link>
                                    </td>
                                    <td className="py-3 text-slate-600 dark:text-slate-400">
                                        {cliente.tipo_documento.nombre} - {cliente.documento}
                                    </td>
                                    <td className="py-3 text-slate-900 dark:text-white font-semibold">
                                        ${Number(cliente.cupo).toLocaleString('es-CO')}
                                    </td>
                                    <td className="py-3 text-slate-600 dark:text-slate-400">
                                        {cliente.plazo_dias} días
                                    </td>
                                    <td className="text-right py-3">
                                        <Link
                                            href={`/clientes/${cliente.id}/edit`}
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