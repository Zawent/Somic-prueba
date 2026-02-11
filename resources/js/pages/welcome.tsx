import { Head, Link, usePage } from '@inertiajs/react';
import { dashboard, login, register } from '@/routes';
import type { SharedData } from '@/types';

export default function Welcome({
    canRegister = true,
}: {
    canRegister?: boolean;
}) {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="Inicio">
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link
                    href="https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700;800&display=swap"
                    rel="stylesheet"
                />
                <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
            </Head>
            
            <div className="font-['Manrope'] bg-[#f6f7f8] dark:bg-[#101922] text-slate-900 dark:text-white overflow-hidden h-screen">
                {/* Header */}
                <header className="absolute top-0 right-0 z-50 p-6 lg:p-8">
                    <nav className="flex items-center justify-end gap-4">
                        {auth.user ? (
                            <Link
                                href={dashboard()}
                                className="inline-block rounded-sm border border-slate-200 px-5 py-1.5 text-sm leading-normal text-slate-900 hover:border-slate-300 dark:border-slate-700 dark:text-slate-100 dark:hover:border-slate-600 transition-all"
                            >
                                Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href={login()}
                                    className="inline-block rounded-sm border border-transparent px-5 py-1.5 text-sm leading-normal text-slate-900 hover:border-slate-200 dark:text-slate-100 dark:hover:border-slate-700 transition-all"
                                >
                                    Log in
                                </Link>
                                {canRegister && (
                                    <Link
                                        href={register()}
                                        className="inline-block rounded-sm border border-slate-200 px-5 py-1.5 text-sm leading-normal text-slate-900 hover:border-slate-300 dark:border-slate-700 dark:text-slate-100 dark:hover:border-slate-600 transition-all"
                                    >
                                        Register
                                    </Link>
                                )}
                            </>
                        )}
                    </nav>
                </header>

                <main className="flex h-screen w-full flex-col md:flex-row">
                    <section className="relative flex w-full flex-col bg-white dark:bg-slate-900 md:w-1/2 p-8 lg:p-16 xl:p-24">
                        <div className="mb-40">
                            <div className="flex items-center gap-2">
                                <img src="/logoSomic.png" alt="" className='w-60'/>
                            </div>
                        </div>

                        <div className="max-w-md">
                            <h1 className="text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white mb-6 leading-tight">
                                Bienvenido a <br/>
                                <span className="text-[#137fec]">Somic ERP</span>
                            </h1>
                            <p className="text-slate-500 dark:text-slate-400 text-lg mb-10 font-medium">
                                Gestione su negocio de manera integral con nuestra plataforma centralizada y eficiente.
                            </p>

                            <div className="space-y-6">
                                <div className="flex items-center gap-4 group">
                                    <div className="w-12 h-12 rounded-xl bg-[#137fec]/10 flex items-center justify-center text-[#137fec]">
                                        <span className="material-icons">receipt_long</span>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-800 dark:text-slate-200">Facturación</h3>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">Emisión legal y control de cobros automatizado.</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 group">
                                    <div className="w-12 h-12 rounded-xl bg-[#137fec]/10 flex items-center justify-center text-[#137fec]">
                                        <span className="material-icons">inventory_2</span>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-800 dark:text-slate-200">Productos</h3>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">Inventario en tiempo real y gestión de stock.</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 group">
                                    <div className="w-12 h-12 rounded-xl bg-[#137fec]/10 flex items-center justify-center text-[#137fec]">
                                        <span className="material-icons">groups</span>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-800 dark:text-slate-200">Clientes</h3>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">Base de datos CRM y seguimiento comercial.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="relative flex w-full items-center justify-center bg-[#f6f7f8] dark:bg-[#101922] md:w-1/2 p-12 overflow-hidden">
                        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-[#137fec]/5 rounded-full blur-3xl"></div>
                        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-96 h-96 bg-[#137fec]/5 rounded-full blur-3xl"></div>

                        <div className="relative z-10 w-full max-w-sm text-center">
                            <div className="mb-10 inline-flex items-center justify-center w-24 h-24 rounded-full bg-white dark:bg-slate-800 shadow-xl shadow-[#137fec]/10">
                                <span className="material-icons text-[#137fec] text-5xl">login</span>
                            </div>

                            <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">Acceso Seguro</h2>
                            <p className="text-slate-500 dark:text-slate-400 mb-8 px-4">
                                Haga clic a continuación para autenticarse y acceder a su panel de control personalizado.
                            </p>


                            <Link 
                                href={login()}
                                className="block w-full bg-[#137fec] hover:bg-[#137fec]/90 text-white font-bold py-5 px-8 rounded-xl shadow-lg shadow-[#137fec]/30 transition-all active:scale-[0.98] flex items-center justify-center gap-3"
                            >
                                <span className="text-lg">Entrar al Sistema</span>
                                <span className="material-icons">arrow_forward</span>
                            </Link>
                        </div>
                    </section>
                </main>
            </div>
        </>
    );
}