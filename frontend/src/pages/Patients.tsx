import { useEffect, useState, useCallback, FormEvent, ChangeEvent } from 'react';
import { patientService } from '../domains/patients/patientService';
import { maskNumber, cleanNumber } from '../utils/MaskNumber';

export function Patients() {
    const [patients, setPatients] = useState<any[]>([]);
    const [newPatient, setNewPatient] = useState({ name: '', phone: '' });
    const [savingPatient, setSavingPatient] = useState(false);
    const [savingEditId, setSavingEditId] = useState<string | null>(null);
    const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    // edicao 
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editData, setEditData] = useState({ name: '', phone: '' });

    // Padronizado com useCallback e try/catch
    const fetchData = useCallback(async () => {
        try {
            const data = await patientService.listar();
            setPatients(data);
        } catch (err) {
            console.error("Erro ao carregar clientes", err);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // criar paciente
    const handleCreate = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const newPhone = cleanNumber(newPatient.phone);
        const newName = newPatient.name.trim();

        if (!newName) {
            setStatusMessage({ type: 'error', text: 'Por favor, preencha o nome.' });
            return;
        }

        if (!newPhone) {
            setStatusMessage({ type: 'error', text: 'Por favor, preencha o telefone.' });
            return;
        }

        setSavingPatient(true);
        setStatusMessage(null);

        try {
            await patientService.criar({
                name: newName,
                phone: newPhone,
            });
            setNewPatient({ name: '', phone: '' });
            setStatusMessage({ type: 'success', text: 'Cliente cadastrado com sucesso.' });
            fetchData();
        } catch (err) {
            setStatusMessage({ type: 'error', text: 'Erro ao cadastrar cliente. Tente novamente.' });
        } finally {
            setSavingPatient(false);
        }
    };

    // editar paciente
    const handleUpdate = async (id: string) => {
        const rawPhone = cleanNumber(editData.phone);
        const name = editData.name.trim();

        if (!name) {
            setStatusMessage({ type: 'error', text: 'Nome não pode ficar em branco.' });
            return;
        }

        if (!rawPhone) {
            setStatusMessage({ type: 'error', text: 'Telefone não pode ficar em branco.' });
            return;
        }

        setSavingEditId(id);
        setStatusMessage(null);

        try {
            await patientService.alterar(id, { name, phone: rawPhone });
            setEditingId(null);
            setStatusMessage({ type: 'success', text: 'Cliente atualizado com sucesso.' });
            fetchData();
        } catch (err) {
            setStatusMessage({ type: 'error', text: 'Erro ao atualizar cliente. Tente novamente.' });
        } finally {
            setSavingEditId(null);
        }
    };
    // ativa o modo de edicao dos campos
    const startEdit = (p: any) => {
        setEditingId(p.id);
        setEditData({ name: p.name, phone: maskNumber(p.phone) });
    };

    // efeito mascara de telefone
    const EffectMaskPhone = (e: ChangeEvent<HTMLInputElement>) => {
        const masked = maskNumber(e.target.value); 
        setNewPatient({ ...newPatient, phone: masked });
    };  

    const handleRemove = async (id: string) => {
        if (!window.confirm("Remover este cliente?")) return;
        setStatusMessage(null);

        try {
            await patientService.deletar(id);
            setStatusMessage({ type: 'success', text: 'Cliente removido com sucesso.' });
            fetchData();
        } catch (err) {
            setStatusMessage({ type: 'error', text: 'Erro ao remover cliente. Tente novamente.' });
        }
    };

    return (
        <div className="patients-page">
            {statusMessage && (
                <div className={`message ${statusMessage.type}`}>
                    <span>{statusMessage.text}</span>
                    <button type="button" className="message-close" onClick={() => setStatusMessage(null)}>×</button>
                </div>
            )}

            <form className="patient-form-header" onSubmit={handleCreate}>
                <h3 className="section-subtitle">Novo Clientes</h3>
                <input 
                    placeholder="Nome do Cliente" 
                    value={newPatient.name}
                    onChange={e => setNewPatient({...newPatient, name: e.target.value})}
                    disabled={savingPatient}
                />
                <input 
                    placeholder="Telefone (Whatsapp)" 
                    value={newPatient.phone}
                    onChange={EffectMaskPhone}
                    disabled={savingPatient}
                />
                <button type="submit" className="btn-menu btn-add-patient" disabled={savingPatient}>
                    {savingPatient ? 'Cadastrando...' : 'Cadastrar'}
                </button>
            </form>

            <div className="patients-list-container">
                <h3 className="section-subtitle">Clientes Cadastrados</h3>
                {patients.map(p => (
                    <div key={p.id} className="patient-row">
                        {editingId === p.id ? (
                            <div className="edit-mode-container">
                                <input value={editData.name} onChange={e => setEditData({...editData, name: e.target.value})}/>
                                <input value={editData.phone} onChange={e => setEditData({...editData, phone: maskNumber(e.target.value)})}/>
                                <div className="edit-actions">
                                    <button className="btns-actions btn-save" onClick={() => handleUpdate(p.id)} disabled={savingEditId === p.id}>
                                        {savingEditId === p.id ? 'Salvando...' : 'Salvar'}
                                    </button>
                                    <button className="btns-actions btn-cancel" onClick={() => setEditingId(null)}>Cancelar</button>
                                </div>
                            </div>
                        ) : (
                            <div className='container-itens'>
                                <div className="patient-data">
                                    <strong>{p.name}</strong>
                                    <span>{maskNumber(p.phone)}</span>
                                </div>
                                <div className="patient-actions">
                                    <button className="btns-actions btn-edit-text" onClick={() => startEdit(p)}>Editar</button>
                                    <button className="btn-delete" onClick={() => handleRemove(p.id)}>&times;</button>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}