import { Form, Head } from '@inertiajs/react';
import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { login } from '@/routes';
import { store } from '@/routes/register';

export default function Register() {
    return (
        <>
            <Head title="Crear Cuenta">
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link
                    href="https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700;800&display=swap"
                    rel="stylesheet"
                />
                <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
                <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
            </Head>

            <div className="font-['Manrope'] bg-[#f6f7f8] dark:bg-[#101922] text-slate-900 dark:text-white overflow-hidden min-h-screen">
                <main className="relative flex min-h-screen w-full items-center justify-center p-6 overflow-hidden">

                    {/* Background Grid */}
                    <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none">
                        <svg height="100%" width="100%">
                            <defs>
                                <pattern height="40" id="grid" patternUnits="userSpaceOnUse" width="40">
                                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1"></path>
                                </pattern>
                            </defs>
                            <rect fill="url(#grid)" height="100%" width="100%"></rect>
                        </svg>
                    </div>

                    <div className="relative z-10 w-full max-w-md">

                        {/* Logo */}
                        <div className="flex items-center justify-center gap-2 mb-8">
                            <div className="w-10 h-10 bg-[#137fec] rounded-lg flex items-center justify-center">
                                <span className="text-white font-extrabold text-xl">S</span>
                            </div>
                            <span className="text-2xl font-extrabold tracking-tight text-slate-800 dark:text-white">
                                SOMIC <span className="text-[#137fec]">ERP</span>
                            </span>
                        </div>

                        <div className="bg-white dark:bg-slate-900 p-10 rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800">

                            <div className="mb-8">
                                <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                                    Crear Cuenta
                                </h2>
                                <p className="text-slate-500 dark:text-slate-400 text-sm">
                                    Regístrate para comenzar a gestionar tu negocio.
                                </p>
                            </div>

                            <Form
                                {...store.form()}
                                resetOnSuccess={['password', 'password_confirmation']}
                                className="space-y-6"
                            >
                                {({ processing, errors }) => (
                                    <>
                                        {/* Nombre */}
                                        <div>
                                            <Label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                                Nombre completo
                                            </Label>
                                            <div className="relative">
                                                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl pointer-events-none">
                                                    person
                                                </span>
                                                <Input
                                                    name="name"
                                                    required
                                                    autoFocus
                                                    placeholder="Juan Pérez"
                                                    className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-xl focus:ring-[#137fec] focus:border-[#137fec] text-slate-900 dark:text-white transition-all"
                                                />
                                            </div>
                                            <InputError message={errors.name} className="mt-2" />
                                        </div>

                                        {/* Email */}
                                        <div>
                                            <Label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                                Correo electrónico
                                            </Label>
                                            <div className="relative">
                                                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl pointer-events-none">
                                                    mail
                                                </span>
                                                <Input
                                                    type="email"
                                                    name="email"
                                                    required
                                                    placeholder="nombre@empresa.com"
                                                    className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-xl focus:ring-[#137fec] focus:border-[#137fec] text-slate-900 dark:text-white transition-all"
                                                />
                                            </div>
                                            <InputError message={errors.email} className="mt-2" />
                                        </div>

                                        {/* Password */}
                                        <div>
                                            <Label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                                Contraseña
                                            </Label>
                                            <div className="relative">
                                                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl pointer-events-none">
                                                    lock
                                                </span>
                                                <Input
                                                    type="password"
                                                    name="password"
                                                    required
                                                    placeholder="••••••••"
                                                    className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-xl focus:ring-[#137fec] focus:border-[#137fec] text-slate-900 dark:text-white transition-all"
                                                />
                                            </div>
                                            <InputError message={errors.password} className="mt-2" />
                                        </div>

                                        {/* Confirmación */}
                                        <div>
                                            <Label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                                Confirmar contraseña
                                            </Label>
                                            <div className="relative">
                                                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl pointer-events-none">
                                                    lock_reset
                                                </span>
                                                <Input
                                                    type="password"
                                                    name="password_confirmation"
                                                    required
                                                    placeholder="••••••••"
                                                    className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-xl focus:ring-[#137fec] focus:border-[#137fec] text-slate-900 dark:text-white transition-all"
                                                />
                                            </div>
                                            <InputError message={errors.password_confirmation} className="mt-2" />
                                        </div>

                                        {/* Botón */}
                                        <Button
                                            type="submit"
                                            disabled={processing}
                                            className="w-full bg-[#137fec] mt-6 hover:bg-[#137fec]/90 text-white font-bold py-4 px-8 rounded-xl shadow-lg shadow-[#137fec]/30 transition-all active:scale-[0.98] flex items-center justify-center gap-3"
                                        >
                                            {processing && <Spinner />}
                                            <span className="text-lg">Crear Cuenta</span>
                                        </Button>

                                        {/* Login */}
                                        <div className="text-center pt-4">
                                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                                ¿Ya tienes cuenta?{' '}
                                                <TextLink
                                                    href={login()}
                                                    className="text-[#137fec] font-bold hover:underline"
                                                >
                                                    Inicia sesión
                                                </TextLink>
                                            </p>
                                        </div>
                                    </>
                                )}
                            </Form>
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
}
