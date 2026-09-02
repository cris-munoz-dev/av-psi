import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../api/axios';
import { Save, Loader2 } from 'lucide-react';

interface AvailabilityConfig {
  days: number[]; // 1=Mon, 7=Sun
  hours: number[]; // [9,10,11,12,15,16,17,18]
}

const fetchAvailability = async () => {
  const { data } = await apiClient.get('/settings/availability');
  return data;
};

const updateAvailability = async (config: AvailabilityConfig) => {
  const { data } = await apiClient.put('/settings/availability', { value: config });
  return data;
};

const DAYS = [
  { id: 1, label: 'Lunes' },
  { id: 2, label: 'Martes' },
  { id: 3, label: 'Miércoles' },
  { id: 4, label: 'Jueves' },
  { id: 5, label: 'Viernes' },
  { id: 6, label: 'Sábado' },
  { id: 7, label: 'Domingo' }
];

const HOURS = Array.from({ length: 14 }, (_, i) => i + 8); // 8:00 to 21:00

const Settings = () => {
  const queryClient = useQueryClient();
  const { data: availability, isLoading } = useQuery({
    queryKey: ['settings', 'availability'],
    queryFn: fetchAvailability,
    retry: false
  });

  const [config, setConfig] = useState<AvailabilityConfig>({
    days: [1, 2, 3, 4, 5],
    hours: [9, 10, 11, 12, 15, 16, 17, 18]
  });

  useEffect(() => {
    if (availability && availability.value) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setConfig(availability.value);
    }
  }, [availability]);

  const mutation = useMutation({
    mutationFn: updateAvailability,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings', 'availability'] });
      alert('Configuración guardada correctamente.');
    },
    onError: (err: Error) => {
      const message = ('response' in err) ? (err as { response?: { data?: { message?: string } } }).response?.data?.message || err.message : err.message;
      alert(`Error: ${message}`);
    }
  });

  const toggleDay = (dayId: number) => {
    setConfig(prev => ({
      ...prev,
      days: prev.days.includes(dayId) 
        ? prev.days.filter(d => d !== dayId)
        : [...prev.days, dayId].sort((a, b) => a - b)
    }));
  };

  const toggleHour = (hour: number) => {
    setConfig(prev => ({
      ...prev,
      hours: prev.hours.includes(hour)
        ? prev.hours.filter(h => h !== hour)
        : [...prev.hours, hour].sort((a, b) => a - b)
    }));
  };

  if (isLoading) return <div className="p-8 text-center text-slate-500">Cargando configuración...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Configuración de Disponibilidad</h1>
      
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
        <h2 className="text-lg font-semibold text-slate-900 mb-6">Días de Atención</h2>
        <div className="flex flex-wrap gap-3 mb-10">
          {DAYS.map(day => (
            <button
              key={day.id}
              onClick={() => toggleDay(day.id)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                config.days.includes(day.id) 
                  ? 'bg-slate-900 text-white' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {day.label}
            </button>
          ))}
        </div>

        <h2 className="text-lg font-semibold text-slate-900 mb-6">Bloques Horarios Disponibles</h2>
        <div className="flex flex-wrap gap-3 mb-10">
          {HOURS.map(hour => (
            <button
              key={hour}
              onClick={() => toggleHour(hour)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                config.hours.includes(hour) 
                  ? 'bg-slate-900 text-white' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {hour.toString().padStart(2, '0')}:00
            </button>
          ))}
        </div>

        <div className="pt-6 border-t border-slate-100 flex justify-end">
          <button 
            onClick={() => mutation.mutate(config)}
            disabled={mutation.isPending}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-full font-medium transition-colors flex items-center justify-center gap-2"
          >
            {mutation.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            Guardar Cambios
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
