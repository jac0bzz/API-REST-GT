import { useState, useEffect } from 'react';
import { ClipboardList, MousePointerClick, ShieldCheck, User } from 'lucide-react';
import { jwtDecode } from 'jwt-decode'; 
import TicketForm from './TicketForm';
import TicketDetail from './TicketDetail';
import { customFetch } from '../utils/api';

function TicketList() {
    const [tickets, setTickets] = useState([]);
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [error, setError] = useState('');
    const [userRole, setUserRole] = useState({ username: '', isStaff: false });

    // Leer el rol del usuario desde el Token guardado
    useEffect(() => {
        const token = localStorage.getItem('access_token');
        if (token) {
            try {
                const decoded = jwtDecode(token);
                console.log("Datos del Token decodificado:", decoded);
                
                setUserRole({
                    username: decoded.username || 'Usuario',
                    isStaff: decoded.is_staff === true || decoded.is_staff === 'true'
                });
            } catch (err) {
                console.error("Error al decodificar el token", err);
            }
        }
    }, []);

    const fetchTickets = async () => {
        try {
            const response = await customFetch('http://127.0.0.1:8000/api/tickets/', {
                method: 'GET'
            });

            if (response.ok) {
                const data = await response.json();
                setTickets(data);
                if (selectedTicket) {
                    const updated = data.find(t => t.id === selectedTicket.id);
                    if (updated) setSelectedTicket(updated);
                }
            } else {
                setError('No tienes permiso para ver los tickets o tu sesión expiró');
            }
        } catch (err) {
            setError('Error al conectar con el servidor');
        }
    };

    useEffect(() => { fetchTickets(); }, []);

    const getPriorityColor = (priority) => {
        const colors = {
            low: 'bg-emerald-100 text-emerald-700 border-emerald-200',
            medium: 'bg-amber-100 text-amber-700 border-amber-200',
            high: 'bg-orange-100 text-orange-700 border-orange-200',
            critical: 'bg-rose-100 text-rose-700 border-rose-200'
        };
        return colors[priority] || 'bg-slate-100 text-slate-700 border-slate-200';
    };

    // 📊 CÁLCULOS DEL DASHBOARD EN TIEMPO REAL
    const totalTickets = tickets.length;
    const openTickets = tickets.filter(t => t.status === 'open' || t.status === 'Abierto').length;
    const inProgressTickets = tickets.filter(t => t.status === 'in_progress' || t.status === 'En Proceso').length;
    const resolvedTickets = tickets.filter(t => t.status === 'resolved' || t.status === 'Resuelto').length;

    // Conteo para las barras de prioridad
    const altaPriority = tickets.filter(t => t.priority === 'alta' || t.priority === 'Alta' || t.priority === 'high' || t.priority === 'critical').length;
    const mediaPriority = tickets.filter(t => t.priority === 'media' || t.priority === 'Media' || t.priority === 'medium').length;
    const bajaPriority = tickets.filter(t => t.priority === 'baja' || t.priority === 'Baja' || t.priority === 'low').length;

    // Calcular porcentajes para las barras visuales
    const pctAlta = totalTickets > 0 ? (altaPriority / totalTickets) * 100 : 0;
    const pctMedia = totalTickets > 0 ? (mediaPriority / totalTickets) * 100 : 0;
    const pctBaja = totalTickets > 0 ? (bajaPriority / totalTickets) * 100 : 0;

    return (
        <div className="space-y-6">
            
            {/* 👑 SECCIÓN DEL DASHBOARD: Solo se muestra si el usuario es Soporte Técnico (isStaff) */}
            {userRole.isStaff && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-2">
                    {/* Tarjetas de Métricas Numéricas */}
                    <div className="md:col-span-2 grid grid-cols-2 gap-4">
                        <div className="bg-white border border-slate-200/60 p-5 rounded-2xl shadow-sm flex flex-col justify-between">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Incidentes</span>
                            <span className="text-4xl font-black text-slate-800 mt-2">{totalTickets}</span>
                        </div>
                        <div className="bg-white border border-slate-200/60 p-5 rounded-2xl shadow-sm flex flex-col justify-between border-l-4 border-l-blue-500">
                            <span className="text-xs font-bold text-blue-500 uppercase tracking-wider">Abiertos</span>
                            <span className="text-4xl font-black text-slate-800 mt-2">{openTickets}</span>
                        </div>
                        <div className="bg-white border border-slate-200/60 p-5 rounded-2xl shadow-sm flex flex-col justify-between border-l-4 border-l-amber-500">
                            <span className="text-xs font-bold text-amber-500 uppercase tracking-wider">En Proceso</span>
                            <span className="text-4xl font-black text-slate-800 mt-2">{inProgressTickets}</span>
                        </div>
                        <div className="bg-white border border-slate-200/60 p-5 rounded-2xl shadow-sm flex flex-col justify-between border-l-4 border-l-emerald-500">
                            <span className="text-xs font-bold text-emerald-500 uppercase tracking-wider">Resueltos</span>
                            <span className="text-4xl font-black text-slate-800 mt-2">{resolvedTickets}</span>
                        </div>
                    </div>

                    {/* Gráfica Analítica de Prioridades */}
                    <div className="bg-white border border-slate-200/60 p-5 rounded-2xl shadow-sm flex flex-col justify-center">
                        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Criticidad de Incidentes</h3>
                        <div className="space-y-3.5">
                            <div>
                                <div className="flex justify-between text-xs font-bold text-slate-600 mb-1">
                                    <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-rose-500"></span>Alta / Crítica</span>
                                    <span>{altaPriority} ({Math.round(pctAlta)}%)</span>
                                </div>
                                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                                    <div className="bg-rose-500 h-full rounded-full transition-all duration-500" style={{ width: `${pctAlta}%` }}></div>
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between text-xs font-bold text-slate-600 mb-1">
                                    <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-500"></span>Media</span>
                                    <span>{mediaPriority} ({Math.round(pctMedia)}%)</span>
                                </div>
                                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                                    <div className="bg-amber-500 h-full rounded-full transition-all duration-500" style={{ width: `${pctMedia}%` }}></div>
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between text-xs font-bold text-slate-600 mb-1">
                                    <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500"></span>Baja</span>
                                    <span>{bajaPriority} ({Math.round(pctBaja)}%)</span>
                                </div>
                                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                                    <div className="bg-emerald-500 h-full rounded-full transition-all duration-500" style={{ width: `${pctBaja}%` }}></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Distribución de Paneles de la Interfaz */}
            <div className="flex flex-col lg:flex-row gap-6">
                
                {/* Columna Izquierda */}
                <div className="flex-1 w-full lg:w-1/2 space-y-6">
                    
                    {/* Barra de Perfil Informativa */}
                    <div className="bg-slate-800 text-white p-4 rounded-2xl shadow-sm flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            {userRole.isStaff ? <ShieldCheck className="w-5 h-5 text-amber-400" /> : <User className="w-5 h-5 text-blue-400" />}
                            <span className="font-semibold text-sm">Sesión: {userRole.username}</span>
                        </div>
                        <span className={`text-xs px-2.5 py-1 rounded-lg font-bold uppercase tracking-wider ${userRole.isStaff ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'}`}>
                            {userRole.isStaff ? 'Soporte Técnico' : 'Cliente'}
                        </span>
                    </div>

                    {/* ¡ROLES EN ACCIÓN!: Solo el Cliente puede reportar tickets nuevos */}
                    {!userRole.isStaff && <TicketForm onTicketCreated={fetchTickets} />}
                    
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                        <div className="flex items-center gap-2 mb-5 pb-3 border-b border-slate-100">
                            <ClipboardList className="w-6 h-6 text-slate-600" />
                            <h2 className="text-xl font-bold text-slate-800">
                                {userRole.isStaff ? 'Todos los Tickets del Sistema' : 'Mis Tickets Reportados'}
                            </h2>
                        </div>
                        
                        {error && <p className="text-red-500 text-sm font-medium mb-4">{error}</p>}
                        
                        <div className="flex flex-col gap-3">
                            {tickets.map((ticket) => (
                                <div 
                                    key={ticket.id} 
                                    onClick={() => setSelectedTicket(ticket)}
                                    className={`p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer ${selectedTicket?.id === ticket.id ? 'border-blue-500 bg-blue-50 shadow-md shadow-blue-100/50' : 'border-slate-100 bg-white hover:border-blue-200 hover:shadow-sm'}`}
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="text-base font-semibold text-slate-800">{ticket.title}</h3>
                                        <span className={`text-xs px-2 py-0.5 rounded font-medium ${ticket.status === 'resolved' || ticket.status === 'Resuelto' ? 'bg-green-100 text-green-800' : ticket.status === 'in_progress' || ticket.status === 'En Proceso' ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 text-slate-800'}`}>
                                            {ticket.status}
                                        </span>
                                    </div>
                                    <div className="flex gap-2">
                                        <span className={`px-2.5 py-0.5 border text-xs font-bold rounded-md uppercase tracking-wider ${getPriorityColor(ticket.priority)}`}>
                                            {ticket.priority}
                                        </span>
                                        <span className="px-2.5 py-0.5 border border-indigo-200 text-xs font-bold bg-indigo-50 text-indigo-700 rounded-md uppercase tracking-wider">
                                            {ticket.category}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Columna/Sección Derecha */}
                <div className="flex-1 w-full lg:w-1/2">
                    {selectedTicket ? (
                        <TicketDetail ticket={selectedTicket} onCommentAdded={fetchTickets} isStaff={userRole.isStaff} />
                    ) : (
                        <div className="border-2 border-dashed border-slate-200 rounded-3xl h-[600px] flex flex-col items-center justify-center text-slate-400 bg-slate-50/50 sticky top-6">
                            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
                                <MousePointerClick className="w-8 h-8 text-slate-300" />
                            </div>
                            <p className="font-semibold text-lg text-slate-500">Selecciona un ticket</p>
                            <p className="text-sm mt-1">Para ver sus detalles y el chat interno</p>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}

export default TicketList;