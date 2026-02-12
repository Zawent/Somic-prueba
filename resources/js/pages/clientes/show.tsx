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
    cliente: Cliente
}

export default function Show({ cliente }: Props) {
    return (
        <AppLayout>
            <Head title="Detalle Cliente" />

            <div className="p-6 max-w-xl mx-auto">
                <h1 className="text-2xl font-bold mb-6">
                    {cliente.nombre}
                </h1>

                <div className="space-y-3 bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-zinc-800">
                    
                    <p>
                        <strong>Documento:</strong>{' '}
                        {cliente.tipo_documento.nombre} - {cliente.documento}
                    </p>

                    <p>
                        <strong>Cupo:</strong>{' '}
                        ${Number(cliente.cupo).toLocaleString('es-CO')}
                    </p>

                    <p>
                        <strong>Plazo:</strong>{' '}
                        {cliente.plazo_dias} días
                    </p>

                    <Link
                        href={`/clientes/${cliente.id}/edit`}
                        className="inline-block mt-4 text-blue-600 dark:text-blue-400 hover:underline font-medium"
                    >
                        Editar
                    </Link>
                </div>
            </div>
        </AppLayout>
    )
}
