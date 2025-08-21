// app/(interno)/dashboard/menu/minha-conta/page.tsx
"use client";

import React, { useState, useEffect, FormEvent } from 'react';
import styles from './MeuPerfilPage.module.css';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

// 1. Definindo as interfaces para tipagem dos dados
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

interface UserProfileState {
    personalInfo: UserData;
    address: AddressData;
}

const MeuPerfilPage: React.FC = () => {
    const supabase = createClientComponentClient();
    const [profile, setProfile] = useState<UserProfileState>({
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
    const [errorMessage, setErrorMessage] = useState<string | null>(null); // Adicionado o estado 'errorMessage'

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) {
                    setError("Usuário não autenticado.");
                    setLoading(false);
                    return;
                }
                const { data: userData, error: dbError } = await supabase
                    .from('usuarios')
                    .select('*')
                    .eq('id', user.id)
                    .single();

                if (dbError && dbError.code !== 'PGRST116') { // PGRST116 = No rows found
                    console.error("Erro ao carregar perfil (detalhes):", dbError);
                    setError("Não foi possível carregar as informações do perfil.");
                } else if (userData) {
                    setProfile({
                        personalInfo: {
                            nomeCompleto: userData.nome_completo || '',
                            email: userData.email || '',
                            telefone: userData.telefone || '',
                            cpfCnpj: userData.cpf_cnpj || '',
                            dataNascimento: userData.data_nascimento || '',
                            genero: userData.genero || '',
                        },
                        address: {
                            cep: userData.cep || '',
                            logradouro: userData.logradouro || '',
                            numero: userData.numero || '',
                            complemento: userData.complemento || '',
                            bairro: userData.bairro || '',
                            cidade: userData.cidade || '',
                            estado: userData.estado || '',
                            pais: userData.pais || '',
                        },
                    });
                } else {
                    // Se não encontrou dados (PGRST116), inicializa com dados do usuário auth e vazio para outros
                    setProfile({
                        personalInfo: {
                            nomeCompleto: user.user_metadata?.full_name || '',
                            email: user.email || '', // Preenche o email com o do usuário autenticado
                            telefone: '',
                            cpfCnpj: '',
                            dataNascimento: '',
                            genero: '',
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
                }
                setLoading(false);
            } catch (err) {
                console.error("Erro inesperado ao carregar perfil:", err);
                setError("Erro inesperado ao carregar as informações do perfil.");
                setLoading(false);
            }
        };

        fetchUserProfile();
    }, [supabase]);


    const handlePersonalInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setProfile(prevProfile => ({
            ...prevProfile!,
            personalInfo: {
                ...prevProfile!.personalInfo,
                [name]: value,
            },
        }));
    };

    const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setProfile(prevProfile => ({
            ...prevProfile!,
            address: {
                ...prevProfile!.address,
                [name]: value,
            },
        }));
    };
    
    const handleCepBlur = async () => {
        const cep = profile.address.cep.replace(/\D/g, '');
        if (cep.length === 8) {
            try {
                const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
                const data = await response.json();
                if (!data.erro) {
                    setProfile(prevProfile => ({
                        ...prevProfile!,
                        address: {
                            ...prevProfile!.address,
                            logradouro: data.logradouro,
                            bairro: data.bairro,
                            cidade: data.localidade,
                            estado: data.uf,
                        },
                    }));
                } else {
                    setErrorMessage("CEP não encontrado."); // Usando setErrorMessage
                }
            } catch (err) {
                console.error("Erro ao buscar CEP:", err);
                setErrorMessage("Erro ao buscar CEP."); // Usando setErrorMessage
            }
        }
    };

    const formatCpfCnpj = (value: string) => {
        const cleaned = value.replace(/\D/g, '');
        if (cleaned.length <= 11) {
            return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
        } else {
            return cleaned.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
        }
    };

    const handleCpfCnpjChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const formattedValue = formatCpfCnpj(e.target.value);
      handlePersonalInfoChange({ ...e, target: { ...e.target, name: 'cpfCnpj', value: formattedValue } });
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSuccessMessage(null);
        setError(null);

        if (!profile.personalInfo.cpfCnpj) {
            setError("O campo CPF/CNPJ é obrigatório.");
            return;
        }

        setLoading(true);

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                setError("Usuário não autenticado. Faça login novamente.");
                setLoading(false);
                return;
            }

            const { error: dbError } = await supabase
                .from('usuarios')
                .update({
                    nome_completo: profile.personalInfo.nomeCompleto,
                    telefone: profile.personalInfo.telefone,
                    cpf_cnpj: profile.personalInfo.cpfCnpj,
                    data_nascimento: profile.personalInfo.dataNascimento,
                    genero: profile.personalInfo.genero,
                    cep: profile.address.cep,
                    logradouro: profile.address.logradouro,
                    numero: profile.address.numero,
                    complemento: profile.address.complemento,
                    bairro: profile.address.bairro,
                    cidade: profile.address.cidade,
                    estado: profile.address.estado,
                    pais: profile.address.pais,
                })
                .eq('id', user.id);

            if (dbError) {
                console.error("Erro ao salvar perfil:", dbError);
                setError("Erro ao salvar as informações. Tente novamente.");
            } else {
                setSuccessMessage("Suas informações foram salvas com sucesso!");
            }
        } catch (err) {
            console.error("Erro inesperado ao salvar perfil:", err);
            setError("Erro inesperado ao salvar as informações. Tente novamente.");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className={styles.loadingState}>Carregando perfil...</div>;
    }

    return (
        <div className={styles.meuPerfilContainer}>
            <h1 className={styles.mainTitle}>Minha Conta</h1>

            {successMessage && <div className={styles.successMessage}>{successMessage}</div>}
            {error && <div className={styles.errorMessage}>{error}</div>} {/* Exibe o erro se houver */}
            {errorMessage && <div className={styles.errorMessage}>{errorMessage}</div>} {/* Exibe o errorMessage se houver */}


            <form onSubmit={handleSubmit}>
                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>Informações Pessoais</h2>
                    <div className={styles.formGrid}>
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
                                value={profile.personalInfo.cpfCnpj || ""}
                                onChange={handleCpfCnpjChange} // Usa o manipulador de mudança formatado
                                required
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
                        <div className={styles.formGroup}>
                            <label htmlFor="genero">Gênero:</label>
                            <select
                                id="genero"
                                name="genero"
                                value={profile.personalInfo.genero || ''}
                                onChange={handlePersonalInfoChange}
                                className={styles.inputField}
                            >
                                <option value="">Selecione</option>
                                <option value="masculino">Masculino</option>
                                <option value="feminino">Feminino</option>
                                <option value="prefiro-nao-dizer">Prefiro não dizer</option>
                            </select>
                        </div>
                    </div>
                </section>

                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>Endereço</h2>
                    <div className={styles.formGrid}>
                        <div className={styles.formGroup}>
                            <label htmlFor="cep">CEP:</label>
                            <input
                                type="text"
                                id="cep"
                                name="cep"
                                value={profile.address.cep}
                                onChange={handleAddressChange}
                                onBlur={handleCepBlur}
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
                                onChange={handleAddressChange}
                                className={styles.inputField}
                            />
                        </div>
                    </div>
                </section>

                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>Configurações de Login</h2>
                    <h3 className={styles.subSectionTitle}>Alterar Senha</h3>
                    <div className={styles.formGrid}>
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
