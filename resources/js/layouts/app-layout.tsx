import { Head, Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { dashboard } from '@/routes';
import type { BreadcrumbItem, SharedData } from '@/types';

type Props = {
    children: React.ReactNode;
    breadcrumbs?: BreadcrumbItem[];
};

export default function AppLayout({ children }: Props) {
    const page = usePage<SharedData>();
    const { auth } = page.props;
    const currentUrl = page.url;

    const [isDark, setIsDark] = useState(false);

    const toggleTheme = () => {
        setIsDark(!isDark);
        document.documentElement.classList.toggle('dark');
    };

    const navLinkClass = (path: string) =>
        `flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors group ${
            currentUrl.startsWith(path)
                ? 'bg-black text-white'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-zinc-800'
        }`;

    return (
        <>
            <Head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link
                    href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
                    rel="stylesheet"
                />
                <link href="https://fonts.googleapis.com/icon?family=Material+Icons+Outlined" rel="stylesheet" />
            </Head>

            <div className="font-['Inter'] bg-[#f3f4f6] dark:bg-[#0a0a0a] text-slate-900 dark:text-slate-100 antialiased h-screen flex">
                
                <aside className="w-64 bg-white dark:bg-zinc-900 border-r border-slate-200 dark:border-zinc-800 flex flex-col">
                    
                    <div className="p-6">
                        <img src="/logoSomic.png" alt="Logo" className="w-60 invert dark:invert-0"/>
                    </div>

                    <nav className="flex-1 px-4 space-y-1 mt-4">
                        
                        <Link
                            href={dashboard().url}
                            className={navLinkClass('/dashboard')}
                        >
                            <span className="material-icons-outlined mr-3 text-lg">
                                dashboard
                            </span>
                            Dashboard
                        </Link>

                        <Link
                            href="/clientes"
                            className={navLinkClass('/clientes')}
                        >
                            <span className="material-icons-outlined mr-3 text-lg">
                                people
                            </span>
                            Clientes
                        </Link>

                        <Link
                            href="/articulos"
                            className={navLinkClass('/articulos')}
                        >
                            <span className="material-icons-outlined mr-3 text-lg">
                                inventory_2
                            </span>
                            Artículos
                        </Link>

                        <Link
                            href="#"
                            className={navLinkClass('/facturas')}
                        >
                            <span className="material-icons-outlined mr-3 text-lg">
                                receipt_long
                            </span>
                            Facturas
                        </Link>
                    </nav>

                    <div className="p-4 border-t border-slate-200 dark:border-zinc-800">
                        <button
                            onClick={toggleTheme}
                            className="flex items-center w-full px-4 py-2 text-sm text-slate-500 hover:text-black dark:text-slate-400 dark:hover:text-white transition-colors"
                        >
                            <span className="material-icons-outlined mr-3 text-lg">
                                dark_mode
                            </span>
                            Cambiar Tema
                        </button>
                    </div>
                </aside>

                <main className="flex-1 flex flex-col h-screen">
                    
                    <header className="h-16 flex items-center justify-between px-8 bg-white dark:bg-zinc-900 border-b border-slate-200 dark:border-zinc-800">
                        <h1 className="text-xl font-semibold tracking-tight text-slate-800 dark:text-white">
                            Resumen Empresarial
                        </h1>

                        <div className="flex items-center space-x-4">
                            <button className="p-2 text-slate-500 hover:text-black dark:text-slate-400 dark:hover:text-white transition-colors relative">
                                <span className="material-icons-outlined">
                                    notifications
                                </span>
                                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
                            </button>

                            <div className="h-8 w-8 rounded-full bg-slate-200 dark:bg-zinc-700 flex items-center justify-center">
                                <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
                                    {auth.user?.name?.charAt(0).toUpperCase() || 'U'}
                                </span>
                            </div>
                        </div>
                    </header>

                    <div className="flex-1 overflow-auto">
                        {children}
                    </div>

                    <footer className="px-8 py-3 bg-white dark:bg-zinc-900 border-t border-slate-200 dark:border-zinc-800 flex items-center justify-between text-[11px] font-medium text-slate-400 uppercase tracking-widest">
                        <div>
                            © 2026 Prueba de ingreso para Somic Soluciones.
                        </div>

                        <div className="flex items-center space-x-6">
                            <span className="flex items-center">
                                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                                API V1.0 Estable
                            </span>
                        </div>
                    </footer>

                </main>
            </div>
        </>
    );
}
