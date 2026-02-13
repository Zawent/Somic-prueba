import { Head, useForm, router } from '@inertiajs/react';
import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import axios from 'axios';

declare function route(name: string, params?: any): string;

interface Props {
    numero_factura: string;
    fecha_actual: string;
}

interface Cliente {
    id: number;
    nombre: string;
    documento: string;
    tipo_documento: string;
    cupo: number;
    plazo_dias: number;
    cartera: number;
    cupo_disponible: number;
    porcentaje_cupo: number;
}

interface Articulo {
    id: number;
    codigo: string;
    nombre: string;
    laboratorio: string;
    saldo: number;
    costo: number;
    precio_venta: number;
}

interface Item {
    articulo_id: number;
    codigo: string;
    nombre: string;
    laboratorio: string;
    cantidad: number;
    costo_unitario: number;
    precio_venta_unitario: number;
    es_venta: boolean;
    subtotal: number;
    total_costo: number;
}

export default function Create({ numero_factura, fecha_actual }: Props) {
    const [cliente, setCliente] = useState<Cliente | null>(null);
    const [documentoCliente, setDocumentoCliente] = useState('');
    const [buscandoCliente, setBuscandoCliente] = useState(false);
    const [sugerenciasArticulos, setSugerenciasArticulos] = useState<Articulo[]>([]);
    const [mostrarSugerenciasArticulo, setMostrarSugerenciasArticulo] = useState(false);
    const [sugerenciasClientes, setSugerenciasClientes] = useState<Cliente[]>([]);
    const [mostrarSugerenciasCliente, setMostrarSugerenciasCliente] = useState(false);
    const [errorStock, setErrorStock] = useState('');
    const [errorPrecio, setErrorPrecio] = useState('');
    const [serverErrors, setServerErrors] = useState<Record<string, string>>({});

    const calcularCupoDisponibleDinamico = () => {
        if (!cliente) return 0;
        const totalFactura = calcularTotalVenta();
        return Math.max(cliente.cupo_disponible - totalFactura, 0);
    };

    const calcularPorcentajeCupoUtilizado = () => {
        if (!cliente || cliente.cupo <= 0) return 0;
        const cupoDisponibleDinamico = calcularCupoDisponibleDinamico();
        const utilizado = cliente.cupo - cupoDisponibleDinamico;
        return Math.min((utilizado / cliente.cupo) * 100, 100);
    };

    const [articuloTemp, setArticuloTemp] = useState({
        codigo: '',
        nombre: '',
        laboratorio: '',
        saldo: 0,
        costo: 0,
        precio_venta: 0,
        cantidad: 1,
        es_venta: true,
    });
    const [articulo, setArticulo] = useState<Articulo | null>(null);
    const [items, setItems] = useState<Item[]>([]);

    const { data, setData, post, processing, errors } = useForm({
        cliente_id: 0,
        fecha_emision: fecha_actual,
        fecha_vencimiento: '',
        notas: '',
        items: [] as any[],
    });

    const buscarClientesAutocomplete = async (value: string) => {
        setDocumentoCliente(value);

        if (value.length < 2) {
            setSugerenciasClientes([]);
            setMostrarSugerenciasCliente(false);
            return;
        }

        try {
            const response = await axios.get('/api/clientes', {
                params: { search: value }
            });

            setSugerenciasClientes(response.data);
            setMostrarSugerenciasCliente(true);
        } catch (error) {
            console.error(error);
        }
    };


    const buscarArticulosAutocomplete = async (value: string) => {
        setArticuloTemp(prev => ({ ...prev, codigo: value }));

        if (value.length < 2) {
            setSugerenciasArticulos([]);
            setMostrarSugerenciasArticulo(false);
            return;
        }

        try {
            const response = await axios.get('/api/articulos', {
                params: { search: value }
            });

            setSugerenciasArticulos(response.data);
            setMostrarSugerenciasArticulo(true);
        } catch (error) {
            console.error(error);
        }
    };

    const agregarItem = () => {
        if (!articulo) {
            alert('Debe buscar un artículo primero');
            return;
        }

        if (articuloTemp.cantidad <= 0) {
            alert('La cantidad debe ser mayor a 0');
            return;
        }

        // Validación de stock solo para ventas
        if (articuloTemp.es_venta && articuloTemp.cantidad > articuloTemp.saldo) {
            setErrorStock(`Stock insuficiente. Saldo disponible: ${articuloTemp.saldo} unidades.`);
            return;
        }

        // Validación de precio de venta no menor al costo
        if (articuloTemp.es_venta && articuloTemp.precio_venta < articuloTemp.costo) {
            setErrorPrecio('El precio de venta no puede ser menor al costo');
            return;
        }

        // Limpiar errores
        setErrorStock('');
        setErrorPrecio('');

        // Calcular subtotal y total_costo según la naturaleza
        let subtotal, total_costo, precio_venta_unitario;

        if (articuloTemp.es_venta) {
            precio_venta_unitario = articuloTemp.precio_venta;
            subtotal = articuloTemp.cantidad * precio_venta_unitario;
            total_costo = articuloTemp.cantidad * articuloTemp.costo;
        } else {
            precio_venta_unitario = 0;
            subtotal = -(articuloTemp.cantidad * articuloTemp.costo); // negativo
            total_costo = articuloTemp.cantidad * articuloTemp.costo;
        }

        const nuevoItem: Item = {
            articulo_id: articulo.id,
            codigo: articulo.codigo,
            nombre: articulo.nombre,
            laboratorio: articulo.laboratorio,
            cantidad: articuloTemp.cantidad,
            costo_unitario: articuloTemp.costo,
            precio_venta_unitario: precio_venta_unitario,
            es_venta: articuloTemp.es_venta,
            subtotal: subtotal,
            total_costo: total_costo,
        };

        setItems([...items, nuevoItem]);

        // Limpiar formulario de artículo
        setArticuloTemp({
            codigo: '',
            nombre: '',
            laboratorio: '',
            saldo: 0,
            costo: 0,
            precio_venta: 0,
            cantidad: 1,
            es_venta: true,
        });
        setArticulo(null);
    };

    const eliminarItem = (index: number) => {
        const nuevosItems = items.filter((_, i) => i !== index);
        setItems(nuevosItems);
    };

    const calcularTotalCosto = () => {
        return items.reduce((sum, item) => sum + item.total_costo, 0);
    };

    const calcularTotalVenta = () => {
        return items.reduce((sum, item) => sum + item.subtotal, 0);
    };

    const guardarFactura = () => {
        if (!cliente) {
            alert('Debe seleccionar un cliente');
            return;
        }

        if (items.length === 0) {
            alert('Debe agregar al menos un artículo');
            return;
        }

        const itemsParaEnviar = items.map(item => ({
            articulo_id: item.articulo_id,
            cantidad: item.cantidad,
            precio_venta_unitario: item.precio_venta_unitario,
            es_venta: item.es_venta,
            descuento: 0,
        }));

        setServerErrors({});

        router.post('/facturas', {
            cliente_id: cliente.id,
            fecha_emision: data.fecha_emision,
            notas: data.notas || '',
            items: itemsParaEnviar,
        }, {
            onError: (errors) => {
                console.error('Errores del servidor:', errors);
                setServerErrors(errors);
                if (errors.error) {
                    alert(errors.error);
                }
            },
            onSuccess: () => {
                // Redirige al índice de facturas
                router.get('/facturas');
            },
        });
    };

    return (
        <AppLayout>
            <Head title="Nueva Factura">
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
                                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Nueva Factura</h1>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Gestión de facturación y ventas corporativas
                                </p>
                            </div>
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
                                    <input
                                        type="text"
                                        value={numero_factura}
                                        disabled
                                        className="block w-full rounded-md border-gray-300 shadow-sm bg-gray-50 dark:bg-slate-800 dark:border-slate-700 dark:text-white sm:text-sm"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Fecha
                                        </label>
                                        <input
                                            type="date"
                                            value={data.fecha_emision}
                                            onChange={(e) => setData('fecha_emision', e.target.value)}
                                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#2563eb] focus:ring-[#2563eb] dark:bg-slate-800 dark:border-slate-700 dark:text-white sm:text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Vencimiento
                                        </label>
                                        <input
                                            type="date"
                                            value={data.fecha_vencimiento}
                                            disabled
                                            className="block w-full rounded-md border-gray-300 shadow-sm bg-gray-50 dark:bg-slate-800 dark:border-slate-700 dark:text-white sm:text-sm"
                                        />
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
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={documentoCliente}
                                            onChange={(e) => buscarClientesAutocomplete(e.target.value)}
                                            placeholder="Ingrese documento o nombre"
                                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#2563eb] focus:ring-[#2563eb] dark:bg-slate-800 dark:border-slate-700 dark:text-white sm:text-sm"
                                        />

                                        {mostrarSugerenciasCliente && sugerenciasClientes.length > 0 && (
                                            <div className="absolute z-50 bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-md mt-1 w-full shadow-lg max-h-60 overflow-y-auto">
                                                {sugerenciasClientes.map((c) => (
                                                    <div
                                                        key={c.id}
                                                        onClick={() => {
                                                            setCliente(c);
                                                            setDocumentoCliente(c.documento);
                                                            setData('cliente_id', c.id);

                                                            // calcular vencimiento automático
                                                            const fechaEmision = new Date(data.fecha_emision);
                                                            const fechaVencimiento = new Date(fechaEmision);
                                                            fechaVencimiento.setDate(
                                                                fechaVencimiento.getDate() + c.plazo_dias
                                                            );

                                                            setData(
                                                                'fecha_vencimiento',
                                                                fechaVencimiento.toISOString().split('T')[0]
                                                            );

                                                            setMostrarSugerenciasCliente(false);
                                                        }}
                                                        className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-slate-700 cursor-pointer text-sm"
                                                    >
                                                        {c.documento} - {c.nombre}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    {cliente && (
                                        <p className="mt-2 text-sm font-semibold text-[#2563eb]">
                                            Nombre:{' '}
                                            <span className="text-gray-900 dark:text-white font-normal">
                                                {cliente.nombre}
                                            </span>
                                        </p>
                                    )}
                                </div>

                                {cliente && (
                                    <>
                                        <div className="space-y-4">
                                            <div>
                                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider dark:text-gray-400">
                                                    Plazo
                                                </p>
                                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                    {cliente.plazo_dias} Días
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider dark:text-gray-400">
                                                    Cupo
                                                </p>
                                                <p className="text-sm font-medium text-green-600">
                                                    ${Number(cliente.cupo).toLocaleString('es-CO', {
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
                                                    ${Number(cliente.cartera).toLocaleString('es-CO', {
                                                        minimumFractionDigits: 2,
                                                    })}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider dark:text-gray-400">
                                                    Disponible
                                                </p>
                                                <p className="text-sm text-blue-600 font-bold">
                                                    ${Number(cliente.cupo_disponible).toLocaleString('es-CO', {
                                                        minimumFractionDigits: 2,
                                                    })}
                                                </p>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Entrada de Artículos */}
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-slate-800">
                        <h2 className="text-sm font-bold text-gray-400 uppercase mb-4 flex items-center gap-2">
                            <span className="material-icons text-xs">add_shopping_cart</span> Entrada de Artículos
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-5 lg:grid-cols-9 gap-4 items-end">
                            {/* Código */}
                            <div className="lg:col-span-1">
                                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Código
                                </label>
                                <input
                                type="text"
                                value={articuloTemp.codigo}
                                onChange={(e) => buscarArticulosAutocomplete(e.target.value)}
                                placeholder="SKU o nombre"
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#2563eb] focus:ring-[#2563eb] dark:bg-slate-800 dark:border-slate-700 dark:text-white sm:text-sm"
                                />
                                {mostrarSugerenciasArticulo && sugerenciasArticulos.length > 0 && (
                                <div className="absolute z-50 bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-md mt-1 w-full shadow-lg max-h-60 overflow-y-auto">
                                    {sugerenciasArticulos.map((a) => (
                                    <div
                                        key={a.id}
                                        onClick={() => {
                                        setArticulo(a);
                                        setArticuloTemp({
                                            codigo: a.codigo,
                                            nombre: a.nombre,
                                            laboratorio: a.laboratorio,
                                            saldo: a.saldo,
                                            costo: a.costo,
                                            precio_venta: a.precio_venta,
                                            cantidad: 1,
                                            es_venta: true, // por defecto venta
                                        });
                                        setErrorStock('');
                                        setMostrarSugerenciasArticulo(false);
                                        }}
                                        className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-slate-700 cursor-pointer text-sm"
                                    >
                                        {a.codigo} - {a.nombre}
                                    </div>
                                    ))}
                                </div>
                                )}
                            </div>

                            {/* Nombre Artículo */}
                            <div className="lg:col-span-2">
                                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Nombre Artículo
                                </label>
                                <input
                                type="text"
                                value={articuloTemp.nombre}
                                disabled
                                placeholder="Descripción"
                                className="block w-full rounded-md border-gray-300 shadow-sm bg-gray-50 dark:bg-slate-800 dark:border-slate-700 dark:text-white sm:text-sm"
                                />
                            </div>

                            {/* Laboratorio */}
                            <div>
                                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Lab.
                                </label>
                                <input
                                type="text"
                                value={articuloTemp.laboratorio}
                                disabled
                                className="block w-full rounded-md border-gray-300 shadow-sm bg-gray-50 dark:bg-slate-800 dark:border-slate-700 dark:text-white sm:text-sm"
                                />
                            </div>

                            {/* Naturaleza */}
                            <div>
                                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Nat.
                                </label>
                                <select
                                value={articuloTemp.es_venta ? 'venta' : 'devolucion'}
                                onChange={(e) => {
                                    const esVenta = e.target.value === 'venta';
                                    setArticuloTemp({
                                    ...articuloTemp,
                                    es_venta: esVenta,
                                    // Si es devolución, limpiamos precio_venta y dejamos costo editable
                                    ...(esVenta
                                        ? {}
                                        : { precio_venta: 0 }), // opcional, para no arrastrar valor
                                    });
                                    setErrorStock('');
                                }}
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#2563eb] focus:ring-[#2563eb] dark:bg-slate-800 dark:border-slate-700 dark:text-white sm:text-sm text-center"
                                >
                                <option value="venta">-</option>
                                <option value="devolucion">+</option>
                                </select>
                            </div>

                            {/* Cantidad */}
                            <div>
                                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Cant.
                                </label>
                                <input
                                type="number"
                                value={articuloTemp.cantidad}
                                onChange={(e) => {
                                    const nuevaCantidad = parseInt(e.target.value) || 1;
                                    setArticuloTemp({ ...articuloTemp, cantidad: nuevaCantidad });
                                    setErrorStock('');
                                }}
                                min="1"
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#2563eb] focus:ring-[#2563eb] dark:bg-slate-800 dark:border-slate-700 dark:text-white sm:text-sm"
                                />
                            </div>

                            {/* Costo Unitario - editable solo si es devolución */}
                            <div>
                                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Costo Unit.
                                </label>
                                <input
                                type="number"
                                value={articuloTemp.costo}
                                onChange={(e) =>
                                    setArticuloTemp({
                                    ...articuloTemp,
                                    costo: parseFloat(e.target.value) || 0,
                                    })
                                }
                                disabled={articuloTemp.es_venta} // solo editable en devolución
                                step="0.01"
                                min="0"
                                className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-[#2563eb] focus:ring-[#2563eb] dark:bg-slate-800 dark:border-slate-700 dark:text-white sm:text-sm ${
                                    articuloTemp.es_venta ? 'bg-gray-50 dark:bg-slate-800/50' : ''
                                }`}
                                />
                            </div>

                            {/* Precio Venta - solo se muestra si es venta */}
                            {articuloTemp.es_venta && (
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Precio Vta.
                                    </label>
                                    <input
                                        type="number"
                                        value={articuloTemp.precio_venta}
                                        onChange={(e) => {
                                            const nuevoPrecio = parseFloat(e.target.value) || 0;
                                            setArticuloTemp({ ...articuloTemp, precio_venta: nuevoPrecio });
                                            if (nuevoPrecio < articuloTemp.costo) {
                                                setErrorPrecio('El precio de venta no puede ser menor al costo');
                                            } else {
                                                setErrorPrecio('');
                                            }
                                        }}
                                        placeholder="0.00"
                                        step="0.01"
                                        min="0"
                                        className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-[#2563eb] focus:ring-[#2563eb] dark:bg-slate-800 dark:border-slate-700 dark:text-white sm:text-sm ${
                                            errorPrecio ? 'border-red-500 dark:border-red-500' : ''
                                        }`}
                                    />
                                    {errorPrecio && (
                                        <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                                            {errorPrecio}
                                        </p>
                                    )}
                                </div>
                            )}

                            <div>
                                <button
                                onClick={agregarItem}
                                type="button"
                                className="w-full bg-[#2563eb] text-white px-4 py-2 rounded-md font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                                >
                                <span className="material-icons text-sm">add</span> Agregar
                                </button>
                            </div>
                            </div>

                            {/* Mensaje de error de stock */}
                            {errorStock && (
                            <div className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                                <span className="material-icons text-base">error_outline</span>
                                {errorStock}
                            </div>
                            )}
                        {articulo && (
                            <div className="grid grid-cols-3 gap-8 mt-4 pt-4 border-t border-gray-50 dark:border-slate-800">
                                <div className="flex justify-between items-center">
                                    <span className="text-xs text-gray-400 font-medium">SALDO ACTUAL:</span>
                                    <span className="text-sm font-semibold dark:text-white">
                                        {articuloTemp.saldo} Unid.
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-xs text-gray-400 font-medium">COSTO UNIT:</span>
                                    <span className="text-sm font-semibold dark:text-white">
                                        ${Number(articuloTemp.costo).toLocaleString('es-CO', { minimumFractionDigits: 2 })}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-xs text-gray-400 font-medium">TOTAL LÍNEA:</span>
                                    <span className="text-sm font-bold text-[#2563eb]">
                                        {articuloTemp.es_venta ? '' : '-'}$
                                        {(
                                            articuloTemp.es_venta
                                                ? articuloTemp.cantidad * articuloTemp.precio_venta
                                                : articuloTemp.cantidad * articuloTemp.costo
                                        ).toLocaleString('es-CO', { minimumFractionDigits: 2 })}
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Tabla de Items */}
                    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-gray-100 dark:border-slate-800 overflow-hidden">
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
                                        <th className="px-6 py-3 text-center text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            Acciones
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
                                    {items.map((item, index) => (
                                        <tr
                                            key={index}
                                            className="hover:bg-gray-50 dark:hover:bg-slate-800/30 transition-colors"
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                                                {item.codigo}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                                                {item.nombre} - {item.laboratorio}
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
                                                {item.es_venta ? (
                                                    `$${Number(item.precio_venta_unitario).toLocaleString('es-CO', {
                                                    minimumFractionDigits: 2,
                                                    })}`
                                                ) : (
                                                    <span className="text-gray-400">-</span>
                                                )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-semibold text-gray-900 dark:text-white">
                                                {item.subtotal < 0 ? '-' : ''}$
                                                {Math.abs(item.subtotal).toLocaleString('es-CO', {
                                                    minimumFractionDigits: 2,
                                                })}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center text-sm">
                                                <button
                                                    onClick={() => eliminarItem(index)}
                                                    className="text-red-500 hover:text-red-700 transition-colors"
                                                >
                                                    <span className="material-icons text-lg">delete_outline</span>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}

                                    {items.length === 0 && (
                                        <>
                                            <tr className="h-10">
                                                <td colSpan={7}></td>
                                            </tr>
                                            <tr className="h-10">
                                                <td colSpan={7}></td>
                                            </tr>
                                        </>
                                    )}
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
                                    <textarea
                                        value={data.notas}
                                        onChange={(e) => setData('notas', e.target.value)}
                                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#2563eb] focus:ring-[#2563eb] dark:bg-slate-800 dark:border-slate-700 dark:text-white sm:text-sm h-20"
                                        placeholder="Información adicional..."
                                    ></textarea>
                                </div>
                                <div className="w-full md:w-72 space-y-3">
                                    <div className="flex justify-between items-center text-gray-600 dark:text-gray-400">
                                        <span className="text-sm">Total Costo:</span>
                                        <span className="text-lg font-medium">
                                            ${calcularTotalCosto().toLocaleString('es-CO', { minimumFractionDigits: 2 })}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center border-t border-gray-200 dark:border-slate-700 pt-3 text-gray-900 dark:text-white">
                                        <span className="text-base font-bold">Total Venta:</span>
                                        <span className="text-2xl font-bold text-[#2563eb]">
                                            ${calcularTotalVenta().toLocaleString('es-CO', { minimumFractionDigits: 2 })}
                                        </span>
                                    </div>
                                    <div className="pt-4">
                                        <button
                                            onClick={guardarFactura}
                                            disabled={processing || items.length === 0 || !cliente}
                                            className="w-full bg-[#2563eb] text-white py-3 rounded-xl font-bold text-lg hover:shadow-lg hover:shadow-blue-500/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <span className="material-icons">save</span>
                                            GUARDAR FACTURA
                                        </button>
                                        {serverErrors.error && (
                                            <div className="mt-2 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-2 rounded">
                                                {serverErrors.error}
                                            </div>
                                        )}
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