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
    const [saving, setSaving] = useState(false);
    const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    useEffect(() => {
        if (isOpen) {
            patientService.listar().then(setPatients).catch(console.error);
            setStatusMessage(null);
        }
    }, [isOpen]);

    const handleSave = async () => {
        if (!newApp.description.trim() || !newApp.patientId) {
            setStatusMessage({ type: 'error', text: 'Preencha a descrição e escolha um cliente.' });
            return;
        }

        setSaving(true);
        setStatusMessage(null);

        try {
            await appointmentService.criar(newApp);
            setNewApp({ description: '', patientId: '' });
            setStatusMessage({ type: 'success', text: 'Agendamento criado com sucesso.' });
            onSuccess();
            onClose();
            navigate('/');
        } catch (err) {
            setStatusMessage({ type: 'error', text: 'Erro ao criar agendamento. Tente novamente.' });
        } finally {
            setSaving(false);
        }
    };

    if (!isOpen) return null;

    return (
    <div className="modal-overlay">
        <div className="modal-content">
            <h3 className="section-subtitle">Novo Agendamento</h3>
            {statusMessage && (
                <div className={`message ${statusMessage.type}`}>
                    <span>{statusMessage.text}</span>
                    <button type="button" className="message-close" onClick={() => setStatusMessage(null)}>×</button>
                </div>
            )}
            <label className="label-modal">Cliente</label>
            <select 
                className="select-modal"
                value={newApp.patientId}
                onChange={(e) => setNewApp({...newApp, patientId: e.target.value})}
                disabled={saving}
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
                disabled={saving}
            />
            
            <div className="modal-actions">
                <button className="btns-actions btn-cancel" onClick={onClose} disabled={saving}>Cancelar</button>
                <button className="btn-menu btn-add-patient btn-save" onClick={handleSave} disabled={saving}>
                    {saving ? 'Salvando...' : 'Salvar'}
                </button>
            </div>
        </div>
    </div>
    );
}