import { useState } from 'react';
import { MessageSquare, SendHorizontal, Clock } from 'lucide-react';
import { customFetch } from '../utils/api'; 

function TicketDetail({ ticket, onCommentAdded, isStaff }) {
    const [newMessage, setNewMessage] = useState('');

    // 1. Enviar comentario con customFetch
    const handleSendComment = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        try {
        const response = await customFetch('http://127.0.0.1:8000/api/comments/', {
            method: 'POST',
            body: JSON.stringify({ ticket: ticket.id, message: newMessage }),
        });

        if (response.ok) {
            setNewMessage('');
            onCommentAdded();
        }
        } catch (error) {
        console.error('Error al enviar comentario', error);
        }
    };

    // 2. Cambiar estado con customFetch (¡UNA SOLA VEZ DECLARADA!)
    const handleStatusChange = async (newStatus) => {
        try {
        const response = await customFetch(`http://127.0.0.1:8000/api/tickets/${ticket.id}/`, {
            method: 'PATCH',
            body: JSON.stringify({ status: newStatus }),
        });

        if (response.ok) {
            onCommentAdded(); // Recarga los datos para ver reflejado el cambio
        }
        } catch (error) {
        console.error('Error al cambiar estado', error);
        }
    };

    return (
        <div className="bg-white border border-slate-200 rounded-3xl shadow-lg sticky top-6 overflow-hidden flex flex-col h-[600px]">
        
        {/* Cabecera del Detalle */}
        <div className="bg-slate-50 p-6 border-b border-slate-200">
            <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-widest bg-blue-100 px-3 py-1 rounded-full">
                Ticket #{ticket.id}
            </span>
            
            {/* Si es técnico, ve el selector de estados. Si es cliente, ve texto plano */}
            {isStaff ? (
                <div className="flex items-center gap-1.5">
                <label className="text-xs font-bold text-slate-500">Estado:</label>
                <select 
                    value={ticket.status} 
                    onChange={(e) => handleStatusChange(e.target.value)}
                    className="text-xs font-semibold bg-white border border-slate-300 rounded-md p-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                    <option value="open">Abierto (Open)</option>
                    <option value="in_progress">En Proceso</option>
                    <option value="resolved">Resuelto</option>
                </select>
                </div>
            ) : (
                <span className="text-xs font-bold bg-slate-200 text-slate-700 px-2.5 py-1 rounded-md capitalize">
                Estado: {ticket.status}
                </span>
            )}
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2 leading-tight">{ticket.title}</h3>
            <p className="text-sm text-slate-600 mb-1">{ticket.description}</p>
        </div>
        
        {/* Área de Chat */}
        <div className="flex-1 p-6 overflow-y-auto bg-white flex flex-col">
            <div className="flex items-center gap-2 mb-6">
            <MessageSquare className="w-5 h-5 text-blue-500" />
            <h4 className="font-bold text-slate-700">Conversación Interna</h4>
            </div>
            
            <div className="space-y-5 flex-1">
            {ticket.comments && ticket.comments.length > 0 ? (
                ticket.comments.map((c) => (
                <div key={c.id} className="flex flex-col">
                    <div className="flex items-baseline gap-2 mb-1">
                    <span className="font-bold text-sm text-slate-800">{c.author_detail?.username || 'Usuario'}</span>
                    <span className="flex items-center gap-1 text-[11px] text-slate-400 font-medium">
                        <Clock className="w-3 h-3" />
                        {new Date(c.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </span>
                    </div>
                    <div className="bg-slate-50 border border-slate-100 p-3.5 rounded-2xl rounded-tl-none text-sm text-slate-700 shadow-sm w-[85%]">
                    {c.message}
                    </div>
                </div>
                ))
            ) : (
                <div className="flex flex-col items-center justify-center h-full text-slate-400 space-y-2">
                <MessageSquare className="w-8 h-8 opacity-50" />
                <p className="text-sm">Inicia la conversación aquí.</p>
                </div>
            )}
            </div>
        </div>

        {/* Input de Mensaje */}
        <div className="p-4 bg-white border-t border-slate-100">
            <form onSubmit={handleSendComment} className="flex gap-2">
            <input 
                type="text" 
                placeholder="Escribe tu mensaje..." 
                value={newMessage} 
                onChange={(e) => setNewMessage(e.target.value)} 
                className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white focus:outline-none text-sm transition"
            />
            <button type="submit" disabled={!newMessage.trim()} className="px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-xl shadow-md transition flex items-center justify-center">
                <SendHorizontal className="w-5 h-5" />
            </button>
            </form>
        </div>

        </div>
    );
    }

export default TicketDetail;