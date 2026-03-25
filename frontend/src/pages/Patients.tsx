import { useEffect, useState, useCallback } from 'react';
import { patientService } from '../domains/patients/patientService';
import { maskNumber, cleanNumber } from '../utils/MaskNumber';

export function Patients() {
    const [patients, setPatients] = useState<any[]>([]);
    const [newPatient, setNewPatient] = useState({ name: '', phone: '' });
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
    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();

        const newPhone = cleanNumber(newPatient.phone);
        setNewPatient({ ...newPatient, phone: newPhone });

        if (!newPatient.name.trim()) {
            alert("Por favor, preencha o nome");
            return;
        }

        if (!newPhone.trim()) {
            alert("Por favor, preencha o telefone");
            return;
        }

        try {
            await patientService.criar({
                ...newPatient, 
                phone: newPhone
            });
            setNewPatient({ name: '', phone: '' });
            fetchData();
        } catch (err) {
            alert("Erro ao cadastrar cliente.");
        }
    };

    // editar paciente
    const handleUpdate = async (id: string) => {
        try {
            const rawPhone = cleanNumber(editData.phone);
            await patientService.alterar(id, { ...editData, phone: rawPhone });
            setEditingId(null);
            fetchData();
        } catch (err) {
            alert("Erro ao atualizar cliente.");
        }
    };
    // ativa o modo de edicao dos campos
    const startEdit = (p: any) => {
        setEditingId(p.id);
        setEditData({ name: p.name, phone: maskNumber(p.phone) });
    };

    // efeito mascara de telefone
    const EffectMaskPhone = (e: React.ChangeEvent<HTMLInputElement>) => {
        const masked = maskNumber(e.target.value); 
        setNewPatient({ ...newPatient, phone: masked });
    };  

    const handleRemove = async (id: string) => {
        if (!window.confirm("Remover este cliente?")) return;
        try {
            await patientService.deletar(id);
            fetchData();
        } catch (err) {
            alert("Erro ao remover cliente.");
        }
    };

    return (
        <div className="patients-page">
            <form className="patient-form-header" onSubmit={handleCreate}>
                <h3 className="section-subtitle">Novo Clientes</h3>
                <input 
                    placeholder="Nome do Cliente" 
                    value={newPatient.name}
                    onChange={e => setNewPatient({...newPatient, name: e.target.value})}
                />
                <input 
                    placeholder="Telefone (Whatsapp)" 
                    value={newPatient.phone}
                    onChange={EffectMaskPhone}
                />
                <button type="submit" className="btn-menu btn-add-patient">Cadastrar</button>
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
                                    <button className="btns-actions btn-save" onClick={() => handleUpdate(p.id)}>Salvar</button>
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