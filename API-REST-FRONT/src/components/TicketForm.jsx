import { useState } from 'react';
import { Wrench, Send, CheckCircle2, AlertCircle } from 'lucide-react';

function TicketForm({ onTicketCreated }) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [priority, setPriority] = useState('medium');
    const [category, setCategory] = useState('other');
    const [mensaje, setMensaje] = useState({ text: '', type: '' });

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('access_token');

        try {
        const response = await fetch('http://127.0.0.1:8000/api/tickets/', {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, description, priority, category }),
        });

        if (response.ok) {
            setMensaje({ text: 'Ticket creado con éxito', type: 'success' });
            setTitle(''); setDescription('');
            onTicketCreated(); 
            setTimeout(() => setMensaje({ text: '', type: '' }), 3000);
        } else {
            setMensaje({ text: 'Error al crear el ticket', type: 'error' });
        }
        } catch (error) {
        setMensaje({ text: 'Error de conexión', type: 'error' });
        }
    };

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div className="flex items-center gap-2 mb-5">
            <div className="p-1.5 bg-slate-100 rounded-lg">
            <Wrench className="w-5 h-5 text-slate-600" />
            </div>
            <h3 className="text-lg font-bold text-slate-800">Reportar Incidente</h3>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Título del problema</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="Ej: No me enciende la pantalla" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white focus:outline-none transition text-sm" />
            </div>
            
            <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Descripción detallada</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} required className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white focus:outline-none transition text-sm resize-none" rows="3" />
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Prioridad</label>
                <select value={priority} onChange={(e) => setPriority(e.target.value)} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white focus:outline-none transition text-sm">
                <option value="low">Baja</option>
                <option value="medium">Media</option>
                <option value="high">Alta</option>
                <option value="critical">Crítica</option>
                </select>
            </div>
            <div className="flex-1">
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Categoría</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white focus:outline-none transition text-sm">
                <option value="hardware">Hardware</option>
                <option value="software">Software</option>
                <option value="network">Redes</option>
                <option value="other">Otro</option>
                </select>
            </div>
            </div>
            
            <button type="submit" className="w-full flex items-center justify-center gap-2 px-6 py-2.5 mt-2 bg-slate-800 hover:bg-slate-900 text-white font-semibold rounded-xl shadow-md transition duration-200">
            <Send className="w-4 h-4" />
            Enviar Ticket
            </button>
        </form>
        
        {mensaje.text && (
            <div className={`mt-4 p-3 rounded-xl flex items-center gap-2 text-sm font-medium ${mensaje.type === 'error' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
            {mensaje.type === 'error' ? <AlertCircle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
            {mensaje.text}
            </div>
        )}
        </div>
    );
    }

export default TicketForm;