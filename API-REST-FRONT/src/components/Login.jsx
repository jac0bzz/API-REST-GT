import { useState } from 'react';
import { LogIn, AlertCircle, CheckCircle2 } from 'lucide-react';

// Recibimos onSwitchToRegister desde el App.jsx
function Login({ onLoginSuccess, onSwitchToRegister }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [mensaje, setMensaje] = useState({ text: '', type: '' });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://127.0.0.1:8000/api/token/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });
            const data = await response.json();

            if (response.ok) {
                // Guardamos ambas llaves en el navegador
                localStorage.setItem('access_token', data.access);
                localStorage.setItem('refresh_token', data.refresh); // ¡Importante para el auto-refresh!
                onLoginSuccess();
            } else {
                setMensaje({ text: 'Usuario o contraseña incorrectos', type: 'error' });
            }
        } catch (error) {
            setMensaje({ text: 'Error al conectar con el servidor', type: 'error' });
        }
    };

    return (
        <div className="max-w-md mx-auto mt-20 bg-white p-8 border border-slate-100 rounded-3xl shadow-xl shadow-slate-200/50">
            <div className="flex flex-col items-center mb-8">
                <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-4">
                    <LogIn className="w-8 h-8 ml-1" />
                </div>
                <h2 className="text-2xl font-bold text-slate-800">Iniciar Sesión</h2>
                <p className="text-sm text-slate-500 mt-1">Ingresa tus credenciales para continuar</p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Usuario</label>
                    <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white focus:outline-none transition" />
                </div>

                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Contraseña</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white focus:outline-none transition" />
                </div>

                <button type="submit" className="w-full flex items-center justify-center gap-2 py-3 mt-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-md shadow-blue-200 transition duration-300">
                    <LogIn className="w-5 h-5" />
                    Ingresar al Sistema
                </button>
            </form>

            {mensaje.text && (
                <div className={`mt-5 p-3 rounded-xl flex items-center gap-2 text-sm font-medium ${mensaje.type === 'error' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                    {mensaje.type === 'error' ? <AlertCircle className="w-5 h-5" /> : <CheckCircle2 className="w-5 h-5" />}
                    {mensaje.text}
                </div>
            )}

            {/* ENLACE NUEVO: Switcher para ir a la pantalla de Registro */}
            <div className="text-center mt-6 pt-5 border-t border-slate-100">
                <p className="text-sm text-slate-500">
                    ¿No tienes una cuenta?{' '}
                    <button
                        type="button"
                        onClick={onSwitchToRegister}
                        className="text-blue-600 hover:underline font-semibold transition"
                    >
                        Regístrate aquí
                    </button>
                </p>
            </div>
        </div>
    );
}

export default Login;