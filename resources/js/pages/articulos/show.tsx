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
    articulo: Articulo
}

export default function Show({ articulo }: Props) {
    return (
        <AppLayout>
            <Head title="Detalle Artículo" />

            <div className="p-6 max-w-xl mx-auto">
                <h1 className="text-2xl font-bold mb-6">
                    {articulo.nombre}
                </h1>

                <div className="space-y-3 bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-sm border">
                    <p><strong>Código:</strong> {articulo.codigo}</p>
                    <p><strong>Laboratorio:</strong> {articulo.laboratorio}</p>
                    <p><strong>Saldo:</strong> {articulo.saldo}</p>
                    <p><strong>Costo:</strong> ${Number(articulo.costo).toLocaleString('es-CO')}</p>
                    <p><strong>Precio Venta:</strong> ${Number(articulo.precio_venta).toLocaleString('es-CO')}</p>

                    <Link
                        href={`/articulos/${articulo.id}/edit`}
                        className="inline-block mt-4 text-blue-600 hover:underline"
                    >
                        Editar
                    </Link>
                </div>
            </div>
        </AppLayout>
    )
}
