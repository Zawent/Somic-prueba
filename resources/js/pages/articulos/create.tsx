import { Form, Head } from '@inertiajs/react'
import AppLayout from '@/layouts/app-layout'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import InputError from '@/components/input-error'

export default function Create() {
    return (
        <AppLayout>
            <Head title="Crear Artículo" />

            <div className="p-6 max-w-xl mx-auto">
                <h1 className="text-2xl font-bold mb-6">
                    Crear Artículo
                </h1>

                <Form
                    action="/articulos"
                    method="post"
                    className="space-y-5"
                >
                    {({ errors }) => (
                        <>
                            <div>
                                <Label>Código</Label>
                                <Input name="codigo" required />
                                <InputError message={errors.codigo} />
                            </div>

                            <div>
                                <Label>Nombre</Label>
                                <Input name="nombre" required />
                                <InputError message={errors.nombre} />
                            </div>

                            <div>
                                <Label>Laboratorio</Label>
                                <Input name="laboratorio" required />
                                <InputError message={errors.laboratorio} />
                            </div>

                            <div>
                                <Label>Saldo</Label>
                                <Input
                                    name="saldo"
                                    type="number"
                                    min="0"
                                    required
                                />
                                <InputError message={errors.saldo} />
                            </div>

                            <div>
                                <Label>Costo</Label>
                                <Input
                                    name="costo"
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    required
                                />
                                <InputError message={errors.costo} />
                            </div>

                            <div>
                                <Label>Precio Venta</Label>
                                <Input
                                    name="precio_venta"
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    required
                                />
                                <InputError message={errors.precio_venta} />
                            </div>

                            <Button type="submit" className="w-full">
                                Guardar Artículo
                            </Button>
                        </>
                    )}
                </Form>
            </div>
        </AppLayout>
    )
}
