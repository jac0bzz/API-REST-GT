import { useState } from 'react';
import { UserPlus, User, Lock, AlertCircle, CheckCircle2 } from 'lucide-react';

function Register({ onSwitchToLogin }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess(false);

        // Validación básica en el cliente
        if (password !== confirmPassword) {
        setError('Las contraseñas no coinciden');
        return;
        }

        try {
        const response = await fetch('http://127.0.0.1:8000/api/register/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        });

        if (response.ok) {
            setSuccess(true);
            setUsername('');
            setPassword('');
            setConfirmPassword('');
            // Redirigir al login automáticamente después de 2 segundos
            setTimeout(() => {
            onSwitchToLogin();
            }, 2000);
        } else {
            const data = await response.json();
            setError(data.username ? 'Este nombre de usuario ya está registrado.' : 'Error al registrar el usuario.');
        }
        } catch (err) {
        setError('Error de conexión con el servidor.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
        <div className="max-w-md w-full bg-white border border-slate-200 p-8 rounded-3xl shadow-xl">
            
            {/* Cabecera */}
            <div className="text-center mb-8">
            <div className="bg-blue-100 text-blue-600 p-3 rounded-2xl inline-block mb-3">
                <UserPlus className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800">Crear Cuenta</h2>
            <p className="text-sm text-slate-500 mt-1">Regístrate para empezar a reportar tus tickets</p>
            </div>

            {/* Alertas */}
            {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-600 text-sm p-3.5 rounded-xl flex items-center gap-2 font-medium">
                <AlertCircle className="w-5 h-5 shrink-0" />
                {error}
            </div>
            )}

            {success && (
            <div className="mb-4 bg-emerald-50 border border-emerald-200 text-emerald-600 text-sm p-3.5 rounded-xl flex items-center gap-2 font-medium">
                <CheckCircle2 className="w-5 h-5 shrink-0" />
                ¡Cuenta creada con éxito! Redirigiendo al Login...
            </div>
            )}

            {/* Formulario */}
            <form onSubmit={handleRegister} className="space-y-4">
            <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Usuario</label>
                <div className="relative">
                <User className="absolute left-3.5 top-3.5 w-5 h-5 text-slate-400" />
                <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white focus:outline-none text-sm transition"
                    placeholder="Ingresa tu nombre de usuario"
                />
                </div>
            </div>

            <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Contraseña</label>
                <div className="relative">
                <Lock className="absolute left-3.5 top-3.5 w-5 h-5 text-slate-400" />
                <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white focus:outline-none text-sm transition"
                    placeholder="Mínimo 6 caracteres"
                />
                </div>
            </div>

            <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Confirmar Contraseña</label>
                <div className="relative">
                <Lock className="absolute left-3.5 top-3.5 w-5 h-5 text-slate-400" />
                <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white focus:outline-none text-sm transition"
                    placeholder="Repite tu contraseña"
                />
                </div>
            </div>

            <button
                type="submit"
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-md shadow-blue-100 transition"
            >
                Registrarse
            </button>
            </form>

            {/* Switcher hacia Login */}
            <div className="text-center mt-6 pt-5 border-t border-slate-100">
            <p className="text-sm text-slate-500">
                ¿Ya tienes una cuenta?{' '}
                <button
                onClick={onSwitchToLogin}
                className="text-blue-600 hover:underline font-semibold"
                >
                Inicia sesión aquí
                </button>
            </p>
            </div>

        </div>
        </div>
    );
    }

export default Register;