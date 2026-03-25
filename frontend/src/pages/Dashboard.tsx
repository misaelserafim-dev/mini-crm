import { useEffect, useState, useCallback } from 'react';
import { appointmentService } from '../domains/appointments/appointmentService';

export function Dashboard() {
    const [appointments, setAppointments] = useState<any[]>([]);
    const statusOptions = ['AGUARDANDO', 'EM_ATENDIMENTO', 'FINALIZADO'];

    // busca os agendamentos
    const fetchData = useCallback(async () => {
        try {
            const data = await appointmentService.listar();
            setAppointments(data);
        } catch (err) {
            console.error("Erro ao carregar", err);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // altera o status
    const handleStatusChange = async (id: string, newStatus: any) => {
        try {
            await appointmentService.alterarStatus(id, newStatus);
            fetchData(); 
        } catch (err) {
            alert("Não pode voltar um status");
        }
    };

    // deletar atendimento
    const handleRemoveAppointment = async (id: string) => {
        if (!window.confirm("Tem certeza que deseja remover?")) return;

        try {
            await appointmentService.deletar(id);
            fetchData();
        } catch (err) {
            alert("Erro ao remover o atendimento.");
        }
    };

    const RenderComponentCard = (status: string) => {
        // filtra o status do atendimento com status do parametro
        const filtered = appointments.filter(app => app.status === status);

        return (
            <div className="status-section">
                <h2 className="status-title">{status.replace('_', ' ')}</h2>
                <div className="grid-list-cards">
                    {filtered.map(app => (
                        <div key={app.id} className={`card ${status.toLowerCase()}`}>
                            <div className="patient-info">
                                <button className='btn-close-items' onClick={() => handleRemoveAppointment(app.id)}>&times;</button>
                                <span className="patient-name">{app.patient?.name}</span>
                                <p className="appointment-desc">{app.description}</p>
                            </div>
                            
                            <select value={app.status} 
                                onChange={(e) => handleStatusChange(app.id, e.target.value)}
                            >
                                {statusOptions.map(opt => (
                                    <option key={opt} value={opt}>{opt.replace('_', ' ')}</option>
                                ))}
                            </select>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <div className="appointments-container">
            {RenderComponentCard('AGUARDANDO')}
            {RenderComponentCard('EM_ATENDIMENTO')}
            {RenderComponentCard('FINALIZADO')}
        </div>
    );
    
}
