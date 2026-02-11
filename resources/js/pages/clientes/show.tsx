import { Head } from '@inertiajs/react'
import AppLayout from '@/layouts/app-layout'

export default function Show({ cliente }: any) {
    return (
        <AppLayout>
            <Head title="Detalle Cliente" />

            <div className="p-6 max-w-xl mx-auto bg-white dark:bg-slate-900 rounded-xl shadow">
                <h1 className="text-2xl font-bold mb-4">
                    {cliente.nombre}
                </h1>

                <p>
                    Documento: {cliente.tipo_documento.nombre} - {cliente.documento}
                </p>
                <p>
                    Cupo: ${Number(cliente.cupo).toLocaleString('es-CO')}
                </p>
                <p>
                    Plazo: {cliente.plazo_dias} días
                </p>
            </div>
        </AppLayout>
    )
}
