import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { X, Loader2 } from 'lucide-react';
import { apiClient } from '../../api/axios';

interface CreatePatientModalProps {
  onClose: () => void;
}

export const CreatePatientModal = ({ onClose }: CreatePatientModalProps) => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    rut: '',
    phone: '',
    dob: '',
    privateNotes: ''
  });

  const createPatient = useMutation({
    mutationFn: async (data: typeof formData) => {
      const res = await apiClient.post('/patients', data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patients'] });
      onClose();
    },
    onError: (err: Error) => {
      const message = ('response' in err) ? (err as { response?: { data?: { message?: string } } }).response?.data?.message || err.message : err.message;
      alert(`Error al crear paciente: ${message}`);
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createPatient.mutate(formData);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        <div className="px-6 py-4 flex items-center justify-between border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-900">Nuevo Paciente</h2>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Nombre</label>
              <input required type="text" value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-primary focus:bg-white transition-colors" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Apellido</label>
              <input required type="text" value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-primary focus:bg-white transition-colors" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
            <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-primary focus:bg-white transition-colors" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">RUT</label>
              <input required type="text" placeholder="12345678-9" value={formData.rut} onChange={e => setFormData({...formData, rut: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-primary focus:bg-white transition-colors" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Fecha de Nacimiento</label>
              <input required type="date" value={formData.dob} onChange={e => setFormData({...formData, dob: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-primary focus:bg-white transition-colors" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Teléfono</label>
            <input required type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-primary focus:bg-white transition-colors" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Notas Privadas (Encriptadas)</label>
            <textarea rows={3} value={formData.privateNotes} onChange={e => setFormData({...formData, privateNotes: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-primary focus:bg-white transition-colors resize-none" placeholder="Observaciones preliminares..." />
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-full text-slate-600 font-medium hover:bg-slate-100 transition-colors">
              Cancelar
            </button>
            <button type="submit" disabled={createPatient.isPending} className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-2.5 rounded-full font-medium transition-colors flex items-center justify-center gap-2">
              {createPatient.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
              Crear Paciente
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
