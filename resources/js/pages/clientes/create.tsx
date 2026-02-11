import { Form, Head } from '@inertiajs/react'
import AppLayout from '@/layouts/app-layout'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import InputError from '@/components/input-error'

interface TipoDocumento {
    id: number
    nombre: string
}

interface Props {
    tiposDocumento: TipoDocumento[]
}

export default function Create({ tiposDocumento }: Props) {
    return (
        <AppLayout>
            <Head title="Crear Cliente" />

            <div className="p-6 max-w-xl mx-auto">
                <h1 className="text-2xl font-bold mb-6">
                    Crear Cliente
                </h1>

                <Form
                    action="/clientes"
                    method="post"
                    className="space-y-5"
                >
                    {({ errors }) => (
                        <>
                            <div>
                                <Label>Nombre</Label>
                                <Input name="nombre" required />
                                <InputError message={errors.nombre} />
                            </div>

                            <div>
                                <Label>Tipo Documento</Label>
                                <select
                                    name="tipo_documento_id"
                                    className="w-full border rounded-lg h-10 px-3"
                                    required
                                >
                                    <option value="">
                                        Seleccione...
                                    </option>
                                    {tiposDocumento.map(tipo => (
                                        <option
                                            key={tipo.id}
                                            value={tipo.id}
                                        >
                                            {tipo.nombre}
                                        </option>
                                    ))}
                                </select>
                                <InputError message={errors.tipo_documento_id} />
                            </div>

                            <div>
                                <Label>Documento</Label>
                                <Input name="documento" required />
                                <InputError message={errors.documento} />
                            </div>

                            <div>
                                <Label>Cupo (COP)</Label>
                                <Input
                                    name="cupo"
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    required
                                />
                                <InputError message={errors.cupo} />
                            </div>

                            <div>
                                <Label>Plazo (días)</Label>
                                <Input
                                    name="plazo_dias"
                                    type="number"
                                    min="0"
                                    required
                                />
                                <InputError message={errors.plazo_dias} />
                            </div>

                            <Button type="submit" className="w-full">
                                Guardar Cliente
                            </Button>
                        </>
                    )}
                </Form>
            </div>
        </AppLayout>
    )
}
