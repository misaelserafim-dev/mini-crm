import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { patientService } from '../domains/patients/patientService';
import { appointmentService } from '../domains/appointments/appointmentService';
import { maskNumber } from '../utils/MaskNumber';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export function ModalAppointment({ isOpen, onClose, onSuccess }: Props) {
    const navigate = useNavigate();
    const [patients, setPatients] = useState<any[]>([]);
    const [newApp, setNewApp] = useState({ description: '', patientId: '' });

    useEffect(() => {
        if (isOpen) {
            patientService.listar().then(setPatients).catch(console.error);
        }
    }, [isOpen]);

    const handleSave = async () => {
        if (!newApp.description || !newApp.patientId) return alert("Preencha tudo!");
        try 
        {
            await appointmentService.criar(newApp);
            setNewApp({ description: '', patientId: '' });
            navigate('/');
            onSuccess();
            onClose();

        } catch (err) {
            alert("Erro ao criar agendamento");
        }
    };

    if (!isOpen) return null;

    return (
    <div className="modal-overlay">
        <div className="modal-content">
            <h3 className="section-subtitle">Novo Agendamento</h3>
            <label className="label-modal">Cliente</label>
            <select 
                className="select-modal"
                value={newApp.patientId}
                onChange={(e) => setNewApp({...newApp, patientId: e.target.value})}
            >
                <option value="">Escolha um cliente...</option>
                {patients.map(p => (
                <option key={p.id} value={p.id}>{p.name} - {maskNumber(p.phone)}</option>
                ))}
            </select>
            <label className="label-modal">Descrição</label>
            <textarea 
                placeholder="descrição do atendimento..."
                rows={4}
                value={newApp.description}
                onChange={(e) => setNewApp({...newApp, description: e.target.value})}
            />
            
            <div className="modal-actions">
                <button className="btns-actions btn-cancel" onClick={onClose}>Cancelar</button>
                <button className="btn-menu btn-add-patient btn-save" onClick={handleSave}>Salvar</button>
            </div>
        </div>
    </div>
    );
}