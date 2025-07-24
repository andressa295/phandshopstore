// app/(interno)/dashboard/menu/minha-conta/page.tsx
"use client"; // <--- Mantenha esta diretiva aqui!

import React, { useState, useEffect, FormEvent } from 'react';
import styles from './MeuPerfilPage.module.css'; // <--- Importando o CSS Module

// 1. Definindo as interfaces para tipagem dos dados (mantidas as mesmas)
interface UserData {
    nomeCompleto: string;
    email: string;
    telefone: string;
    cpfCnpj: string;
    dataNascimento: string;
    genero?: string; // Opcional
}

interface AddressData {
    cep: string;
    logradouro: string;
    numero: string;
    complemento?: string; // Opcional
    bairro: string;
    cidade: string;
    estado: string;
    pais: string;
}

interface UserProfile {
    personalInfo: UserData;
    address: AddressData;
}

const MeuPerfilPage: React.FC = () => {
    const [profile, setProfile] = useState<UserProfile>({
        personalInfo: {
            nomeCompleto: '',
            email: '',
            telefone: '',
            cpfCnpj: '',
            dataNascimento: '',
        },
        address: {
            cep: '',
            logradouro: '',
            numero: '',
            bairro: '',
            cidade: '',
            estado: '',
            pais: '',
        },
    });

    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);


    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                // Simula uma chamada de API com um atraso
                await new Promise(resolve => setTimeout(resolve, 1000));

                // Dados mockados (substitua por sua chamada real à API)
                const mockData: UserProfile = {
                    personalInfo: {
                        nomeCompleto: "MK Alianças & Joias",
                        email: "mk_aliancas@email.com",
                        telefone: "5511998765432",
                        cpfCnpj: "123.456.789-00",
                        dataNascimento: "1990-01-01",
                    },
                    address: {
                        cep: "01000-000",
                        logradouro: "Rua Exemplo",
                        numero: "123",
                        complemento: "Apto 45",
                        bairro: "Centro",
                        cidade: "São Paulo",
                        estado: "SP",
                        pais: "Brasil",
                    },
                };
                setProfile(mockData);
                setLoading(false);
            } catch (err) {
                console.error("Erro ao carregar perfil:", err);
                setError("Não foi possível carregar as informações do perfil.");
                setLoading(false);
            }
        };

        fetchUserProfile();
    }, []);


    const handlePersonalInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setProfile(prevProfile => ({
            ...prevProfile,
            personalInfo: {
                ...prevProfile.personalInfo,
                [name]: value,
            },
        }));
    };

    const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setProfile(prevProfile => ({
            ...prevProfile,
            address: {
                ...prevProfile.address,
                [name]: value,
            },
        }));
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSuccessMessage(null);
        setError(null);

        try {
            console.log("Enviando dados do perfil:", profile);
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            setSuccessMessage("Suas informações foram salvas com sucesso!");

        } catch (err) {
            console.error("Erro ao salvar perfil:", err);
            setError("Erro ao salvar as informações. Tente novamente.");
        }
    };

    if (loading) {
        return <div className={styles.loadingState}>Carregando perfil...</div>;
    }

    if (error) {
        return <div className={styles.errorState}>Erro: {error}</div>;
    }

    return (
        <div className={styles.meuPerfilContainer}>
            <h1 className={styles.mainTitle}>Minha Conta</h1>

            {successMessage && <div className={styles.successMessage}>{successMessage}</div>}
            {error && <div className={styles.errorMessage}>{error}</div>}

            <form onSubmit={handleSubmit}>
                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>Informações Pessoais</h2>
                    <div className={styles.formGrid}> {/* Usar grid para alinhar */}
                        <div className={styles.formGroup}>
                            <label htmlFor="nomeCompleto">Nome Completo:</label>
                            <input
                                type="text"
                                id="nomeCompleto"
                                name="nomeCompleto"
                                value={profile.personalInfo.nomeCompleto}
                                onChange={handlePersonalInfoChange}
                                required
                                className={styles.inputField}
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="email">E-mail:</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={profile.personalInfo.email}
                                readOnly
                                className={styles.inputField}
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="telefone">Telefone:</label>
                            <input
                                type="tel"
                                id="telefone"
                                name="telefone"
                                value={profile.personalInfo.telefone}
                                onChange={handlePersonalInfoChange}
                                className={styles.inputField}
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="cpfCnpj">CPF/CNPJ:</label>
                            <input
                                type="text"
                                id="cpfCnpj"
                                name="cpfCnpj"
                                value={profile.personalInfo.cpfCnpj}
                                readOnly
                                className={styles.inputField}
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="dataNascimento">Data de Nascimento:</label>
                            <input
                                type="date"
                                id="dataNascimento"
                                name="dataNascimento"
                                value={profile.personalInfo.dataNascimento}
                                onChange={handlePersonalInfoChange}
                                className={styles.inputField}
                            />
                        </div>
                    </div>
                </section>

                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>Endereço</h2>
                    <div className={styles.formGrid}> {/* Usar grid para alinhar */}
                        <div className={styles.formGroup}>
                            <label htmlFor="cep">CEP:</label>
                            <input
                                type="text"
                                id="cep"
                                name="cep"
                                value={profile.address.cep}
                                onChange={handleAddressChange}
                                className={styles.inputField}
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="logradouro">Logradouro:</label>
                            <input
                                type="text"
                                id="logradouro"
                                name="logradouro"
                                value={profile.address.logradouro}
                                onChange={handleAddressChange}
                                className={styles.inputField}
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="numero">Número:</label>
                            <input
                                type="text"
                                id="numero"
                                name="numero"
                                value={profile.address.numero}
                                onChange={handleAddressChange}
                                className={styles.inputField}
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="complemento">Complemento:</label>
                            <input
                                type="text"
                                id="complemento"
                                name="complemento"
                                value={profile.address.complemento || ''}
                                onChange={handleAddressChange}
                                className={styles.inputField}
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="bairro">Bairro:</label>
                            <input
                                type="text"
                                id="bairro"
                                name="bairro"
                                value={profile.address.bairro}
                                onChange={handleAddressChange}
                                className={styles.inputField}
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="cidade">Cidade:</label>
                            <input
                                type="text"
                                id="cidade"
                                name="cidade"
                                value={profile.address.cidade}
                                onChange={handleAddressChange}
                                className={styles.inputField}
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="estado">Estado:</label>
                            <input
                                type="text"
                                id="estado"
                                name="estado"
                                value={profile.address.estado}
                                onChange={handleAddressChange}
                                className={styles.inputField}
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="pais">País:</label>
                            <input
                                type="text"
                                id="pais"
                                name="pais"
                                value={profile.address.pais}
                                readOnly
                                className={styles.inputField}
                            />
                        </div>
                    </div>
                </section>

                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>Configurações de Login</h2>
                    <h3 className={styles.subSectionTitle}>Alterar Senha</h3>
                    <div className={styles.formGrid}> {/* Usar grid para alinhar */}
                        <div className={styles.formGroup}>
                            <label htmlFor="senhaAtual">Senha Atual:</label>
                            <input type="password" id="senhaAtual" name="senhaAtual" className={styles.inputField} />
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="novaSenha">Nova Senha:</label>
                            <input type="password" id="novaSenha" name="novaSenha" className={styles.inputField} />
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="confirmarNovaSenha">Confirmar Nova Senha:</label>
                            <input type="password" id="confirmarNovaSenha" name="confirmarNovaSenha" className={styles.inputField} />
                        </div>
                        <div className={styles.buttonGroup}>
                            <button type="button" onClick={() => alert('Funcionalidade de alterar senha em desenvolvimento.')} className={styles.secondaryButton}>
                                Alterar Senha
                            </button>
                        </div>
                    </div>
                </section>

                <button type="submit" className={styles.primaryButton}>Salvar Alterações</button>
            </form>
        </div>
    );
};

export default MeuPerfilPage;