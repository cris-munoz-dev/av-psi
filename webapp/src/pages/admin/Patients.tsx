import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../api/axios';
import { FileText, MoreVertical } from 'lucide-react';
import { CreatePatientModal } from './CreatePatientModal';

const fetchPatients = async () => {
  const { data } = await apiClient.get('/patients');
  return data;
};

const Patients = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: patients, isLoading, isError } = useQuery({
    queryKey: ['patients'],
    queryFn: fetchPatients
  });

  if (isLoading) return <div className="p-8 text-center text-slate-500">Cargando pacientes...</div>;
  if (isError) return <div className="p-8 text-center text-red-500">Error al cargar pacientes.</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-900">Fichas Clínicas</h1>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors"
        >
          Nuevo Paciente
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              <th className="py-4 px-6 text-sm font-medium text-slate-500">Nombre</th>
              <th className="py-4 px-6 text-sm font-medium text-slate-500">RUT (Desencriptado)</th>
              <th className="py-4 px-6 text-sm font-medium text-slate-500">Teléfono (Desencriptado)</th>
              <th className="py-4 px-6 text-sm font-medium text-slate-500">Estado</th>
              <th className="py-4 px-6 text-sm font-medium text-slate-500">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {patients?.map((patient: {id: string, firstName: string, lastName: string, rut: string, phone: string, status: string}) => (
              <tr key={patient.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                <td className="py-4 px-6 text-sm font-medium text-slate-900">
                  {patient.firstName} {patient.lastName}
                </td>
                <td className="py-4 px-6 text-sm text-slate-600 font-mono">{patient.rut}</td>
                <td className="py-4 px-6 text-sm text-slate-600 font-mono">{patient.phone}</td>
                <td className="py-4 px-6">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    patient.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-800'
                  }`}>
                    {patient.status === 'ACTIVE' ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center gap-2">
                    <button className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Ver Ficha">
                      <FileText className="w-4 h-4" />
                    </button>
                    <button className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {patients?.length === 0 && (
          <div className="p-12 text-center text-slate-500">No hay pacientes registrados.</div>
        )}
      </div>

      {isModalOpen && <CreatePatientModal onClose={() => setIsModalOpen(false)} />}
    </div>
  );
};

export default Patients;
