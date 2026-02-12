import { Form, Head } from '@inertiajs/react'
import AppLayout from '@/layouts/app-layout'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import InputError from '@/components/input-error'

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

export default function Edit({ articulo }: Props) {
    return (
        <AppLayout>
            <Head title="Editar Artículo" />

            <div className="p-6 max-w-xl mx-auto">
                <h1 className="text-2xl font-bold mb-6">
                    Editar Artículo
                </h1>

                <Form
                    action={`/articulos/${articulo.id}`}
                    method="put"
                    className="space-y-5"
                >
                    {({ errors }) => (
                        <>
                            <Input name="codigo" defaultValue={articulo.codigo} required />
                            <Input name="nombre" defaultValue={articulo.nombre} required />
                            <Input name="laboratorio" defaultValue={articulo.laboratorio} required />
                            <Input name="saldo" type="number" defaultValue={articulo.saldo} required />
                            <Input name="costo" type="number" step="0.01" defaultValue={articulo.costo} required />
                            <Input name="precio_venta" type="number" step="0.01" defaultValue={articulo.precio_venta} required />

                            <Button type="submit" className="w-full">
                                Actualizar Artículo
                            </Button>
                        </>
                    )}
                </Form>
            </div>
        </AppLayout>
    )
}
