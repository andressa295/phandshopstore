// app/(interno)/dashboard/menu/dados-meu-negocio/page.tsx
"use client"; // Esta página precisará de hooks.

import React, { useState, useEffect, FormEvent } from 'react';
import styles from './DadosMeuNegocioPage.module.css'; // Vamos criar este CSS Module

// 1. Interfaces para os dados do negócio
interface BusinessInfo {
    fantasyName: string;
    companyName: string; // Razão Social
    cnpj: string;
    stateRegistration?: string; // Inscrição Estadual
    municipalRegistration?: string; // Inscrição Municipal
    phone: string;
    email: string;
    website?: string;
    activitySector: string; // Ramo de Atividade/CNAE
}

interface BusinessAddress {
    cep: string;
    street: string; // Logradouro
    number: string;
    complement?: string;
    neighborhood: string; // Bairro
    city: string;
    state: string;
    country: string;
}

interface BankAccount {
    bankName: string;
    agency: string; // Agência
    accountNumber: string;
    accountType: 'checking' | 'savings'; // Corrente ou Poupança
    accountHolderName: string; // Nome do Titular da Conta
    accountHolderCpfCnpj: string; // CPF/CNPJ do Titular
}

interface BusinessData {
    info: BusinessInfo;
    address: BusinessAddress;
    bankAccount: BankAccount;
    // taxInfo: any; // Opcional, se for implementar dados fiscais
}

const DadosMeuNegocioPage: React.FC = () => {
    // 2. Estados para os dados do negócio
    const [businessData, setBusinessData] = useState<BusinessData>({
        info: {
            fantasyName: '',
            companyName: '',
            cnpj: '',
            phone: '',
            email: '',
            activitySector: '',
        },
        address: {
            cep: '',
            street: '',
            number: '',
            neighborhood: '',
            city: '',
            state: '',
            country: '',
        },
        bankAccount: {
            bankName: '',
            agency: '',
            accountNumber: '',
            accountType: 'checking',
            accountHolderName: '',
            accountHolderCpfCnpj: '',
        },
    });

    const [loading, setLoading] = useState<boolean>(true);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    // 3. Efeito para carregar os dados do negócio
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                await new Promise(resolve => setTimeout(resolve, 1000)); // Simula API call

                const mockBusinessData: BusinessData = {
                    info: {
                        fantasyName: "MK Alianças & Joias",
                        companyName: "MK COMERCIO DE JOIAS LTDA",
                        cnpj: "12.345.678/0001-90",
                        stateRegistration: "123.456.789.000",
                        phone: "(11) 98765-4321",
                        email: "contato@mkjoias.com.br",
                        website: "www.mkjoias.com.br",
                        activitySector: "Comércio Varejista de Joias",
                    },
                    address: {
                        cep: "01001-000",
                        street: "Rua do Comércio",
                        number: "1234",
                        complement: "Sala 501",
                        neighborhood: "Centro",
                        city: "São Paulo",
                        state: "SP",
                        country: "Brasil",
                    },
                    bankAccount: {
                        bankName: "Banco Bradesco",
                        agency: "1234",
                        accountNumber: "56789-0",
                        accountType: "checking",
                        accountHolderName: "MK COMERCIO DE JOIAS LTDA",
                        accountHolderCpfCnpj: "12.345.678/0001-90",
                    },
                };
                setBusinessData(mockBusinessData);
                setLoading(false);

            } catch (err) {
                console.error("Erro ao carregar dados do negócio:", err);
                setErrorMessage("Não foi possível carregar as informações do seu negócio.");
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Funções de Manipulação
    const handleInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setBusinessData(prev => ({
            ...prev,
            info: { ...prev.info, [name]: value },
        }));
    };

    const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setBusinessData(prev => ({
            ...prev,
            address: { ...prev.address, [name]: value },
        }));
    };

    const handleBankAccountChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setBusinessData(prev => ({
            ...prev,
            bankAccount: { ...prev.bankAccount, [name]: value },
        }));
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setSuccessMessage(null);
        setErrorMessage(null);
        setLoading(true);

        try {
            await new Promise(resolve => setTimeout(resolve, 1500)); // Simula API call para salvar
            setSuccessMessage('Dados do negócio atualizados com sucesso!');
        } catch (err) {
            setErrorMessage('Erro ao salvar os dados do negócio. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className={styles.loadingState}>Carregando dados do negócio...</div>;
    }

    return (
        <div className={styles.container}>
            <h1 className={styles.mainTitle}>Dados do Meu Negócio</h1>

            {successMessage && <div className={styles.successMessage}>{successMessage}</div>}
            {errorMessage && <div className={styles.errorMessage}>{errorMessage}</div>}

            <form onSubmit={handleSubmit}>
                {/* Seção Informações Gerais */}
                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>Informações Gerais</h2>
                    <div className={styles.formGrid}>
                        <div className={styles.formGroup}>
                            <label htmlFor="fantasyName">Nome Fantasia:</label>
                            <input
                                type="text"
                                id="fantasyName"
                                name="fantasyName"
                                value={businessData.info.fantasyName}
                                onChange={handleInfoChange}
                                className={styles.inputField}
                                required
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="companyName">Razão Social:</label>
                            <input
                                type="text"
                                id="companyName"
                                name="companyName"
                                value={businessData.info.companyName}
                                readOnly /* Geralmente readOnly após registro */
                                className={styles.inputField}
                                required
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="cnpj">CNPJ:</label>
                            <input
                                type="text"
                                id="cnpj"
                                name="cnpj"
                                value={businessData.info.cnpj}
                                readOnly /* Geralmente readOnly após registro */
                                className={styles.inputField}
                                required
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="stateRegistration">Inscrição Estadual:</label>
                            <input
                                type="text"
                                id="stateRegistration"
                                name="stateRegistration"
                                value={businessData.info.stateRegistration || ''}
                                onChange={handleInfoChange}
                                className={styles.inputField}
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="municipalRegistration">Inscrição Municipal:</label>
                            <input
                                type="text"
                                id="municipalRegistration"
                                name="municipalRegistration"
                                value={businessData.info.municipalRegistration || ''}
                                onChange={handleInfoChange}
                                className={styles.inputField}
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="phone">Telefone Comercial:</label>
                            <input
                                type="tel"
                                id="phone"
                                name="phone"
                                value={businessData.info.phone}
                                onChange={handleInfoChange}
                                className={styles.inputField}
                                required
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="email">E-mail Comercial:</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={businessData.info.email}
                                onChange={handleInfoChange}
                                className={styles.inputField}
                                required
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="website">Site do Negócio (URL):</label>
                            <input
                                type="url"
                                id="website"
                                name="website"
                                value={businessData.info.website || ''}
                                onChange={handleInfoChange}
                                className={styles.inputField}
                                placeholder="https://www.seunegocio.com.br"
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="activitySector">Ramo de Atividade:</label>
                            <input
                                type="text"
                                id="activitySector"
                                name="activitySector"
                                value={businessData.info.activitySector}
                                onChange={handleInfoChange}
                                className={styles.inputField}
                                required
                            />
                        </div>
                    </div>
                </section>

                {/* Seção Endereço Comercial */}
                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>Endereço Comercial</h2>
                    <div className={styles.formGrid}>
                        <div className={styles.formGroup}>
                            <label htmlFor="cep">CEP:</label>
                            <input
                                type="text"
                                id="cep"
                                name="cep"
                                value={businessData.address.cep}
                                onChange={handleAddressChange}
                                className={styles.inputField}
                                required
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="street">Logradouro:</label>
                            <input
                                type="text"
                                id="street"
                                name="street"
                                value={businessData.address.street}
                                onChange={handleAddressChange}
                                className={styles.inputField}
                                required
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="number">Número:</label>
                            <input
                                type="text"
                                id="number"
                                name="number"
                                value={businessData.address.number}
                                onChange={handleAddressChange}
                                className={styles.inputField}
                                required
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="complement">Complemento:</label>
                            <input
                                type="text"
                                id="complement"
                                name="complement"
                                value={businessData.address.complement || ''}
                                onChange={handleAddressChange}
                                className={styles.inputField}
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="neighborhood">Bairro:</label>
                            <input
                                type="text"
                                id="neighborhood"
                                name="neighborhood"
                                value={businessData.address.neighborhood}
                                onChange={handleAddressChange}
                                className={styles.inputField}
                                required
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="city">Cidade:</label>
                            <input
                                type="text"
                                id="city"
                                name="city"
                                value={businessData.address.city}
                                onChange={handleAddressChange}
                                className={styles.inputField}
                                required
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="state">Estado (UF):</label>
                            <input
                                type="text"
                                id="state"
                                name="state"
                                value={businessData.address.state}
                                onChange={handleAddressChange}
                                className={styles.inputField}
                                maxLength={2}
                                required
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="country">País:</label>
                            <input
                                type="text"
                                id="country"
                                name="country"
                                value={businessData.address.country}
                                onChange={handleAddressChange}
                                className={styles.inputField}
                                required
                            />
                        </div>
                    </div>
                </section>

                {/* Seção Dados Bancários */}
                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>Dados Bancários para Recebimento</h2>
                    <div className={styles.formGrid}>
                        <div className={styles.formGroup}>
                            <label htmlFor="bankName">Nome do Banco:</label>
                            <input
                                type="text"
                                id="bankName"
                                name="bankName"
                                value={businessData.bankAccount.bankName}
                                onChange={handleBankAccountChange}
                                className={styles.inputField}
                                required
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="agency">Agência:</label>
                            <input
                                type="text"
                                id="agency"
                                name="agency"
                                value={businessData.bankAccount.agency}
                                onChange={handleBankAccountChange}
                                className={styles.inputField}
                                required
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="accountNumber">Número da Conta:</label>
                            <input
                                type="text"
                                id="accountNumber"
                                name="accountNumber"
                                value={businessData.bankAccount.accountNumber}
                                onChange={handleBankAccountChange}
                                className={styles.inputField}
                                required
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="accountType">Tipo de Conta:</label>
                            <select
                                id="accountType"
                                name="accountType"
                                value={businessData.bankAccount.accountType}
                                onChange={handleBankAccountChange}
                                className={styles.selectField}
                                required
                            >
                                <option value="checking">Conta Corrente</option>
                                <option value="savings">Conta Poupança</option>
                            </select>
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="accountHolderName">Nome do Titular da Conta:</label>
                            <input
                                type="text"
                                id="accountHolderName"
                                name="accountHolderName"
                                value={businessData.bankAccount.accountHolderName}
                                onChange={handleBankAccountChange}
                                className={styles.inputField}
                                required
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="accountHolderCpfCnpj">CPF/CNPJ do Titular:</label>
                            <input
                                type="text"
                                id="accountHolderCpfCnpj"
                                name="accountHolderCpfCnpj"
                                value={businessData.bankAccount.accountHolderCpfCnpj}
                                onChange={handleBankAccountChange}
                                className={styles.inputField}
                                required
                            />
                        </div>
                    </div>
                </section>

                <div className={styles.buttonGroup}>
                    <button type="submit" className={styles.primaryButton} disabled={loading}>
                        {loading ? 'Salvando...' : 'Salvar Dados'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default DadosMeuNegocioPage;