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

interface Cliente {
    id: number
    nombre: string
    tipo_documento_id: number
    documento: string
    cupo: number
    plazo_dias: number
}

interface Props {
    cliente: Cliente
    tiposDocumento: TipoDocumento[]
}

export default function Edit({ cliente, tiposDocumento }: Props) {
    return (
        <AppLayout>
            <Head title="Editar Cliente" />

            <div className="p-6 max-w-xl mx-auto">
                <h1 className="text-2xl font-bold mb-6">
                    Editar Cliente
                </h1>

                <Form
                    action={`/clientes/${cliente.id}`}
                    method="put"
                    className="space-y-5"
                >
                    {({ errors }) => (
                        <>
                            <div>
                                <Label>Nombre</Label>
                                <Input
                                    name="nombre"
                                    defaultValue={cliente.nombre}
                                    required
                                />
                                <InputError message={errors.nombre} />
                            </div>

                            <div>
                                <Label>Tipo Documento</Label>
                                <select
                                    name="tipo_documento_id"
                                    defaultValue={cliente.tipo_documento_id}
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
                                <Input
                                    name="documento"
                                    defaultValue={cliente.documento}
                                    required
                                />
                                <InputError message={errors.documento} />
                            </div>

                            <div>
                                <Label>Cupo (COP)</Label>
                                <Input
                                    name="cupo"
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    defaultValue={cliente.cupo}
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
                                    defaultValue={cliente.plazo_dias}
                                    required
                                />
                                <InputError message={errors.plazo_dias} />
                            </div>

                            <Button type="submit" className="w-full">
                                Actualizar Cliente
                            </Button>
                        </>
                    )}
                </Form>
            </div>
        </AppLayout>
    )
}
