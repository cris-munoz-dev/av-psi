import { useState } from 'react';
import { DayPicker } from 'react-day-picker';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import 'react-day-picker/dist/style.css';
import { Calendar as CalendarIcon, Clock, Video, User, ArrowLeft, Loader2, AlertCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { appointmentsApi } from '../api/appointments';
import { patientsApi } from '../api/patients';
import { AxiosError } from 'axios';

const Booking = () => {
  const navigate = useNavigate();
  
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [modality, setModality] = useState<'ONLINE' | 'IN_PERSON'>('ONLINE');
  
  // Step state
  const [step, setStep] = useState<1 | 2 | 3>(1); // 1: Date/Time/Modality, 2: RUT Check, 3: Confirm/Form
  const [rut, setRut] = useState('');
  const [rutExists, setRutExists] = useState<boolean | null>(null);
  const [reason, setReason] = useState('');
  
  // Profile form state (only if RUT doesn't exist)
  const [profileData, setProfileData] = useState({ firstName: '', lastName: '', email: '', phone: '', dob: '' });

  // Fetch available slots
  const { data: availableSlots, isLoading: slotsLoading } = useQuery({
    queryKey: ['availableSlots', selectedDate ? format(selectedDate, 'yyyy-MM-dd') : null],
    queryFn: () => appointmentsApi.getAvailableSlots(format(selectedDate!, 'yyyy-MM-dd')),
    enabled: !!selectedDate,
  });

  // Check RUT mutation
  const checkRut = useMutation({
    mutationFn: patientsApi.checkRut,
    onSuccess: (data) => {
      setRutExists(data.exists);
      setStep(3);
    },
    onError: (err: AxiosError<{message: string}>) => {
      alert(`Error al verificar RUT: ${err.response?.data?.message || err.message}`);
    }
  });

  // Book appointment mutation
  const bookAppointment = useMutation({
    mutationFn: appointmentsApi.publicBook,
    onSuccess: () => {
      alert('¡Cita agendada con éxito! Revisa tu correo electrónico para la confirmación.');
      navigate('/');
    },
    onError: (err: AxiosError<{message: string}>) => {
      alert(`Error al agendar: ${err.response?.data?.message || err.message}`);
    }
  });

  const handleBook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate || !selectedSlot) return;

    const [hours, minutes] = selectedSlot.split(':').map(Number);
    const appointmentDate = new Date(selectedDate);
    appointmentDate.setHours(hours, minutes, 0, 0);

    const payload = {
      rut,
      date: appointmentDate.toISOString(),
      modality,
      reason: reason || undefined,
      newPatient: rutExists ? undefined : {
        ...profileData
      }
    };

    bookAppointment.mutate(payload);
  };

  const handleContinueToRut = () => {
    if (selectedDate && selectedSlot) {
      setStep(2);
    }
  };

  const handleCheckRut = (e: React.FormEvent) => {
    e.preventDefault();
    if (rut.trim()) {
      checkRut.mutate(rut);
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-12 px-4 w-full relative">
      <Link to="/" className="inline-flex items-center gap-2 text-on-surface-variant hover:text-on-surface transition-colors mb-6 font-label-md">
        <ArrowLeft className="w-5 h-5" />
        Volver al inicio
      </Link>
      
      <div className="mb-10 text-center">
        <h1 className="font-display-md text-on-surface mb-2">Agendar una Cita</h1>
        <p className="font-body-lg text-on-surface-variant">
          {step === 1 ? 'Selecciona el día y la hora que mejor te acomode.' : 
           step === 2 ? 'Ingresa tu RUT para continuar.' : 
           'Confirma tus datos para finalizar.'}
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        {/* Left Side: Calendar (Always visible but disabled in later steps, or just visual reference) */}
        <div className="bg-surface-container-lowest p-8 rounded-[24px] shadow-sm flex flex-col items-center opacity-100 transition-opacity">
          <h2 className="font-title-md text-on-surface mb-6 flex items-center gap-2 w-full justify-start">
            <CalendarIcon className="w-6 h-6 text-primary" />
            1. Elige una fecha
          </h2>
          <DayPicker
            mode="single"
            selected={selectedDate}
            onSelect={(date) => { if (step === 1) { setSelectedDate(date); setSelectedSlot(null); } }}
            locale={es}
            disabled={step !== 1 ? true : [{ before: new Date(new Date().getTime() + 24 * 60 * 60 * 1000) }]}
            className={`border-none font-body-md ${step !== 1 ? 'opacity-50 pointer-events-none' : ''}`}
            modifiersClassNames={{
              selected: 'bg-primary text-on-primary hover:bg-primary/90 rounded-full',
              today: 'text-primary font-bold'
            }}
          />
          <p className="text-sm text-on-surface-variant mt-4 flex items-center gap-1">
            <AlertCircle className="w-4 h-4" />
            Las citas deben agendarse con 24h de anticipación.
          </p>
        </div>

        {/* Right Side: Options based on step */}
        <div className="space-y-6">
          {step === 1 && (
            <div className="bg-surface-container-lowest p-8 rounded-[24px] shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-300">
              <h2 className="font-title-md text-on-surface mb-6 flex items-center gap-2 w-full justify-start">
                <Clock className="w-6 h-6 text-primary" />
                2. Elige un horario
              </h2>
              {selectedDate ? (
                slotsLoading ? (
                  <div className="flex justify-center py-8"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
                ) : availableSlots && availableSlots.length > 0 ? (
                  <div className="grid grid-cols-3 gap-3 mb-8">
                    {availableSlots.map((slot) => (
                      <button
                        key={slot}
                        onClick={() => setSelectedSlot(slot)}
                        className={`py-3 px-3 rounded-full border text-label-md font-medium transition-colors ${
                          selectedSlot === slot 
                            ? 'bg-primary text-on-primary border-primary' 
                            : 'bg-surface text-on-surface border-outline hover:border-primary hover:bg-primary-container hover:text-on-primary-container'
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="text-on-surface-variant font-body-md text-center py-8">
                    No hay horarios disponibles para esta fecha.
                  </p>
                )
              ) : (
                <p className="text-on-surface-variant font-body-md text-center py-8">
                  Selecciona una fecha en el calendario.
                </p>
              )}

              {selectedSlot && (
                <>
                  <h2 className="font-title-md text-on-surface mb-6 flex items-center gap-2 w-full justify-start border-t border-outline pt-6">
                    <Video className="w-6 h-6 text-primary" />
                    3. Modalidad
                  </h2>
                  <div className="flex gap-4 mb-8">
                    <label className={`flex-1 flex flex-col items-center p-6 rounded-2xl border cursor-pointer transition-colors ${modality === 'ONLINE' ? 'border-primary bg-primary-container' : 'border-outline hover:bg-surface-container'}`}>
                      <input type="radio" name="modality" value="ONLINE" checked={modality === 'ONLINE'} onChange={() => setModality('ONLINE')} className="sr-only" />
                      <Video className={`w-8 h-8 mb-3 ${modality === 'ONLINE' ? 'text-on-primary-container' : 'text-on-surface-variant'}`} />
                      <span className={`font-label-md ${modality === 'ONLINE' ? 'text-on-primary-container' : 'text-on-surface-variant'}`}>Online</span>
                    </label>
                    <label className={`flex-1 flex flex-col items-center p-6 rounded-2xl border cursor-pointer transition-colors ${modality === 'IN_PERSON' ? 'border-primary bg-primary-container' : 'border-outline hover:bg-surface-container'}`}>
                      <input type="radio" name="modality" value="IN_PERSON" checked={modality === 'IN_PERSON'} onChange={() => setModality('IN_PERSON')} className="sr-only" />
                      <User className={`w-8 h-8 mb-3 ${modality === 'IN_PERSON' ? 'text-on-primary-container' : 'text-on-surface-variant'}`} />
                      <span className={`font-label-md ${modality === 'IN_PERSON' ? 'text-on-primary-container' : 'text-on-surface-variant'}`}>Presencial</span>
                    </label>
                  </div>
                  <button 
                    onClick={handleContinueToRut}
                    className="w-full bg-primary text-on-primary font-label-lg py-4 rounded-full shadow-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                  >
                    Continuar
                  </button>
                </>
              )}
            </div>
          )}

          {step === 2 && (
            <div className="bg-surface-container-lowest p-8 rounded-[24px] shadow-sm animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-title-md text-on-surface flex items-center gap-2">
                  <User className="w-6 h-6 text-primary" />
                  Identificación
                </h2>
                <button onClick={() => setStep(1)} className="text-primary text-sm font-medium">Editar Fecha</button>
              </div>
              <form onSubmit={handleCheckRut}>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-on-surface-variant mb-2">Ingresa tu RUT</label>
                  <input 
                    required 
                    type="text" 
                    placeholder="12345678-9" 
                    value={rut} 
                    onChange={e => setRut(e.target.value)} 
                    className="w-full px-4 py-3 rounded-xl border border-outline bg-surface focus:outline-none focus:border-primary text-lg" 
                  />
                  <p className="text-sm text-on-surface-variant mt-2">Usaremos tu RUT para verificar si ya eres paciente.</p>
                </div>
                <button 
                  type="submit"
                  disabled={checkRut.isPending || !rut}
                  className="w-full bg-primary text-on-primary font-label-lg py-4 rounded-full flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {checkRut.isPending && <Loader2 className="w-5 h-5 animate-spin" />}
                  Verificar RUT
                </button>
              </form>
            </div>
          )}

          {step === 3 && (
            <div className="bg-surface-container-lowest p-8 rounded-[24px] shadow-sm animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-title-md text-on-surface flex items-center gap-2">
                  <User className="w-6 h-6 text-primary" />
                  Datos de la Cita
                </h2>
                <button onClick={() => setStep(2)} className="text-primary text-sm font-medium">Cambiar RUT</button>
              </div>
              
              <div className="bg-primary-container/30 rounded-xl p-4 mb-6">
                <p className="text-on-surface font-medium">Resumen:</p>
                <p className="text-on-surface-variant text-sm mt-1">
                  {selectedDate && format(selectedDate, 'dd/MM/yyyy')} a las {selectedSlot} ({modality === 'ONLINE' ? 'Online' : 'Presencial'})
                </p>
                <p className="text-on-surface-variant text-sm mt-1">RUT: {rut}</p>
                {rutExists && <p className="text-primary text-sm font-medium mt-2">¡RUT encontrado! Ya eres paciente.</p>}
              </div>

              <form onSubmit={handleBook} className="space-y-4">
                {!rutExists && (
                  <>
                    <p className="text-on-surface font-medium text-sm mb-2 border-b border-outline pb-2">Eres un paciente nuevo. Por favor, completa tus datos:</p>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-on-surface-variant mb-1">Nombre</label>
                        <input required type="text" value={profileData.firstName} onChange={e => setProfileData({...profileData, firstName: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-outline bg-surface focus:outline-none focus:border-primary" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-on-surface-variant mb-1">Apellido</label>
                        <input required type="text" value={profileData.lastName} onChange={e => setProfileData({...profileData, lastName: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-outline bg-surface focus:outline-none focus:border-primary" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-on-surface-variant mb-1">Correo Electrónico</label>
                      <input required type="email" value={profileData.email} onChange={e => setProfileData({...profileData, email: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-outline bg-surface focus:outline-none focus:border-primary" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-on-surface-variant mb-1">Teléfono</label>
                      <input required type="tel" value={profileData.phone} onChange={e => setProfileData({...profileData, phone: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-outline bg-surface focus:outline-none focus:border-primary" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-on-surface-variant mb-1">Fecha de Nacimiento</label>
                      <input required type="date" value={profileData.dob} onChange={e => setProfileData({...profileData, dob: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-outline bg-surface focus:outline-none focus:border-primary" />
                    </div>
                  </>
                )}
                
                <div className="pt-2">
                  <label className="block text-sm font-medium text-on-surface-variant mb-1">Motivo de consulta (Opcional)</label>
                  <textarea 
                    value={reason} 
                    onChange={e => setReason(e.target.value)} 
                    placeholder="Breve descripción de por qué consultas..."
                    className="w-full px-4 py-3 rounded-xl border border-outline bg-surface focus:outline-none focus:border-primary min-h-[100px] resize-none" 
                  />
                </div>

                <button 
                  type="submit"
                  disabled={bookAppointment.isPending}
                  className="w-full bg-primary text-on-primary font-label-lg py-4 rounded-full mt-4 flex items-center justify-center gap-2"
                >
                  {bookAppointment.isPending && <Loader2 className="w-5 h-5 animate-spin" />}
                  Confirmar Reserva
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Booking;
