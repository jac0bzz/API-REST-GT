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
            console.log("Datos del Token decodificado:", decoded); // <--- ESTO NOS MOSTRARÁ EN CONSOLA QUÉ VIENE
            
            setUserRole({
            username: decoded.username || 'Usuario',
            // Validamos si es verdaderamente true (ya sea como booleano o string)
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

    return (
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
                    <span className={`text-xs px-2 py-0.5 rounded font-medium ${ticket.status === 'resolved' ? 'bg-green-100 text-green-800' : ticket.status === 'in_progress' ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 text-slate-800'}`}>
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

        {/* Columna Derecha */}
        <div className="flex-1 w-full lg:w-1/2">
            {selectedTicket ? (
            // Le pasamos si el usuario es staff al detalle para habilitar controles de técnico
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
    );
}

export default TicketList;