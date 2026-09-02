import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { apiClient } from '../../api/axios';
import { Clock, Video, User, MoreVertical, XCircle, CheckCircle } from 'lucide-react';

const fetchAppointments = async () => {
  const { data } = await apiClient.get('/appointments');
  return data;
};

const updateAppointment = async ({ id, status }: { id: string, status: string }) => {
  const { data } = await apiClient.put(`/appointments/${id}/admin`, { status });
  return data;
};

const Appointments = () => {
  const queryClient = useQueryClient();
  const { data: appointments, isLoading, isError } = useQuery({
    queryKey: ['appointments'],
    queryFn: fetchAppointments
  });

  const updateMutation = useMutation({
    mutationFn: updateAppointment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
    },
    onError: (err: Error) => {
      const message = ('response' in err) ? (err as { response?: { data?: { message?: string } } }).response?.data?.message || err.message : err.message;
      alert(`Error al actualizar cita: ${message}`);
    }
  });

  if (isLoading) return <div className="p-8 text-center text-slate-500">Cargando citas...</div>;
  if (isError) return <div className="p-8 text-center text-red-500">Error al cargar citas.</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-900">Citas</h1>
      </div>
      
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              <th className="py-4 px-6 text-sm font-medium text-slate-500">Fecha y Hora</th>
              <th className="py-4 px-6 text-sm font-medium text-slate-500">Paciente</th>
              <th className="py-4 px-6 text-sm font-medium text-slate-500">Modalidad</th>
              <th className="py-4 px-6 text-sm font-medium text-slate-500">Estado</th>
              <th className="py-4 px-6 text-sm font-medium text-slate-500 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {appointments?.map((appt: { id: string, date: string, durationMins: number, patient: { firstName: string, lastName: string }, modality: string, status: string }) => (
              <tr key={appt.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                <td className="py-4 px-6">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-slate-900 capitalize">
                      {format(new Date(appt.date), "EEEE d 'de' MMMM", { locale: es })}
                    </span>
                    <span className="text-sm text-slate-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {format(new Date(appt.date), 'HH:mm')} ({appt.durationMins} min)
                    </span>
                  </div>
                </td>
                <td className="py-4 px-6 text-sm font-medium text-slate-900">
                  {appt.patient.firstName} {appt.patient.lastName}
                </td>
                <td className="py-4 px-6">
                  <span className="inline-flex items-center gap-1 text-sm text-slate-600 bg-slate-100 px-2 py-1 rounded-lg">
                    {appt.modality === 'ONLINE' ? <Video className="w-4 h-4 text-blue-600" /> : <User className="w-4 h-4 text-emerald-600" />}
                    {appt.modality === 'ONLINE' ? 'Online' : 'Presencial'}
                  </span>
                </td>
                <td className="py-4 px-6">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    appt.status === 'BOOKED' ? 'bg-blue-100 text-blue-800' : 
                    appt.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-800' :
                    appt.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                    'bg-slate-100 text-slate-800'
                  }`}>
                    {appt.status === 'BOOKED' ? 'Agendada' : 
                     appt.status === 'COMPLETED' ? 'Completada' : 
                     appt.status === 'CANCELLED' ? 'Cancelada' : 
                     'Reprogramada'}
                  </span>
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center justify-end gap-2">
                    {appt.status === 'BOOKED' && (
                      <>
                        <button 
                          onClick={() => updateMutation.mutate({ id: appt.id, status: 'COMPLETED' })}
                          className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors" 
                          title="Marcar Completada"
                        >
                          <CheckCircle className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={() => updateMutation.mutate({ id: appt.id, status: 'CANCELLED' })}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors" 
                          title="Cancelar"
                        >
                          <XCircle className="w-5 h-5" />
                        </button>
                      </>
                    )}
                    <button className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {appointments?.length === 0 && (
          <div className="p-12 text-center text-slate-500">No hay citas agendadas.</div>
        )}
      </div>
    </div>
  );
};

export default Appointments;
