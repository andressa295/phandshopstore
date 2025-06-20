import React, { Fragment } from 'react';
import CheckboxField from '../ui/CheckboxField';
import TextField from '../ui/TextField';
import TextareaField from '../ui/TextareaField'; 
import SelectField from '../ui/SelectField'; 
import { Tema } from '../EditorContext';
import { infoIconMap } from '../utils/iconMap';

interface ProductDetailScreenProps {
    tema: Tema;
    handleTemaChange: (key: keyof Tema, value: any) => void;
    goBackToMainMenu: () => void;
    handleNestedTemaChange: (parentKey: keyof Tema, subKey: string, value: any) => void; // Certifique-se de passar esta prop
}

const ProductDetailScreen: React.FC<ProductDetailScreenProps> = ({ tema, handleTemaChange, goBackToMainMenu, handleNestedTemaChange }) => {
    const iconOptions = Object.keys(infoIconMap).map(key => ({
        value: key,
        label: key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()) // Formata para leitura
    }));

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', padding: '0 15px', flexGrow: 1, overflowY: 'auto' }}>
            <button onClick={goBackToMainMenu} style={{ background: 'none', border: 'none', color: '#333', cursor: 'pointer', textAlign: 'left', marginBottom: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'bold', fontFamily: 'Poppins, sans-serif' }}>
            </button>

            <div style={{ border: '1px solid #eee', padding: '15px', borderRadius: '8px', marginBottom: '0.8rem' }}>
                <h4 style={{ margin: '0 0 10px 0', fontSize: '1rem', color: '#333', fontFamily: 'Poppins, sans-serif' }}>Forma de entrega</h4>
                <CheckboxField
                    label="Mostrar a calculadora de frete"
                    checked={tema.detalhesProduto_mostrarCalculadoraFrete ?? false} // Use ?? false
                    onChange={(val) => handleTemaChange('detalhesProduto_mostrarCalculadoraFrete', val)}
                />
                <CheckboxField
                    label="Mostrar lojas físicas na página de produto"
                    checked={tema.detalhesProduto_mostrarLojasFisicas ?? false} // Use ?? false
                    onChange={(val) => handleTemaChange('detalhesProduto_mostrarLojasFisicas', val)}
                />
            </div>

            <div style={{ border: '1px solid #eee', padding: '15px', borderRadius: '8px', marginBottom: '0.8rem' }}>
                <h4 style={{ margin: '0 0 10px 0', fontSize: '1rem', color: '#333', fontFamily: 'Poppins, sans-serif' }}>Informações das parcelas</h4>
                <CheckboxField
                    label="Mostrar parcelas na página de produtos"
                    checked={tema.detalhesProduto_mostrarParcelas ?? false} // Use ?? false
                    onChange={(val) => handleTemaChange('detalhesProduto_mostrarParcelas', val)}
                />
            </div>

            <div style={{ border: '1px solid #eee', padding: '15px', borderRadius: '8px', marginBottom: '0.8rem' }}>
                <h4 style={{ margin: '0 0 10px 0', fontSize: '1rem', color: '#333', fontFamily: 'Poppins, sans-serif' }}>Preço promocional</h4>
                <CheckboxField
                    label="Mostrar o valor que se economiza no produto com preço promocional."
                    checked={tema.detalhesProduto_mostrarEconomiaPromocional ?? false} // Use ?? false
                    onChange={(val) => handleTemaChange('detalhesProduto_mostrarEconomiaPromocional', val)}
                />
                <p style={{ fontSize: '0.8rem', color: '#666', marginTop: '10px', fontFamily: 'Poppins, sans-serif' }}>
                    Não se aplica se o preço com desconto por meio de pagamento estiver visível.
                </p>
            </div>

            <div style={{ border: '1px solid #eee', padding: '15px', borderRadius: '8px', marginBottom: '0.8rem' }}>
                <h4 style={{ margin: '0 0 10px 0', fontSize: '1rem', color: '#333', fontFamily: 'Poppins, sans-serif' }}>Desconto por meio de pagamento</h4>
                <CheckboxField
                    label="Mostrar o preço com maior desconto na lista, no detalhe do produto e carrinho de compra."
                    checked={tema.detalhesProduto_descontoPagamentoVisivel ?? false} // Use ?? false
                    onChange={(val) => handleTemaChange('detalhesProduto_descontoPagamentoVisivel', val)}
                />
            </div>

            <div style={{ border: '1px solid #eee', padding: '15px', borderRadius: '8px', marginBottom: '0.8rem' }}>
                <h4 style={{ margin: '0 0 10px 0', fontSize: '1rem', color: '#333', fontFamily: 'Poppins, sans-serif' }}>Variações do produto</h4>
                <CheckboxField
                    label="Mostrar como botões variações de cor para selecionar."
                    checked={tema.detalhesProduto_variacoesBotao ?? false} // Use ?? false
                    onChange={(val) => handleTemaChange('detalhesProduto_variacoesBotao', val)}
                />
                <CheckboxField
                    label="Mostrar a foto da variação de cor como botão."
                    checked={tema.detalhesProduto_variacaoCorFotoBotao ?? false} // Use ?? false
                    onChange={(val) => handleTemaChange('detalhesProduto_variacaoCorFotoBotao', val)}
                />
            </div>

            <div style={{ border: '1px solid #eee', padding: '15px', borderRadius: '8px', marginBottom: '0.8rem' }}>
                <h4 style={{ margin: '0 0 10px 0', fontSize: '1rem', color: '#333', fontFamily: 'Poppins, sans-serif' }}>Guia de medida</h4>
                <p style={{ fontSize: '0.75rem', color: '#666', marginBottom: '10px', fontFamily: 'Poppins, sans-serif' }}>
                    Quando houver um produto com variações de tamanho, você pode incluir um guia de medidas na sua loja. Basta criar uma página e inserir o link aqui.
                </p>
                <TextField
                    label="Link da página:"
                    type="url"
                    value={tema.detalhesProduto_linkGuiaMedida ?? ''} // Use ?? ''
                    onChange={(val) => handleTemaChange('detalhesProduto_linkGuiaMedida', val)}
                    placeholder="https://sua-loja.com/guia-de-medidas"
                />
            </div>

            <div style={{ border: '1px solid #eee', padding: '15px', borderRadius: '8px', marginBottom: '0.8rem' }}>
                <h4 style={{ margin: '0 0 10px 0', fontSize: '1rem', color: '#333', fontFamily: 'Poppins, sans-serif' }}>Estoque</h4>
                <CheckboxField
                    label="Mostrar estoque disponível"
                    checked={tema.detalhesProduto_mostrarEstoque ?? false} // Use ?? false
                    onChange={(val) => handleTemaChange('detalhesProduto_mostrarEstoque', val)}
                />
            </div>

            <div style={{ border: '1px solid #eee', padding: '15px', borderRadius: '8px', marginBottom: '0.8rem' }}>
                <h4 style={{ margin: '0 0 10px 0', fontSize: '1rem', color: '#333', fontFamily: 'Poppins, sans-serif' }}>Últimas unidades no estoque</h4>
                <CheckboxField
                    label="Mostrar uma mensagem para incentivar a compra quando restarem poucas unidades."
                    checked={tema.detalhesProduto_mostrarUltimasUnidades ?? false} // Use ?? false
                    onChange={(val) => handleTemaChange('detalhesProduto_mostrarUltimasUnidades', val)}
                />
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', marginBottom: '1rem' }}>
                    <span style={{ fontSize: '0.85rem', color: '#555', fontFamily: 'Poppins, sans-serif' }}>Mostrar quando estiver com menos de</span>
                    <TextField
                        type="number"
                        label=""
                        value={tema.detalhesProduto_limiteUltimasUnidades ?? 0} // Use ?? 0
                        onChange={(val) => handleTemaChange('detalhesProduto_limiteUltimasUnidades', parseInt(val || '0'))} // Converte para int
                        style={{ width: '100%', maxWidth: '100px', padding: '5px', borderRadius: '4px', border: '1px solid #ccc', textAlign: 'center', fontFamily: 'Poppins, sans-serif', fontSize: '0.85rem', height: '32px', boxSizing: 'border-box' }}
                        description="Insira apenas números"
                    />
                </div>
                <TextField
                    label="Mensagem quando está uma unidade em estoque:"
                    value={tema.detalhesProduto_mensagemUltimaUnidade ?? ''} // Use ?? ''
                    onChange={(val) => handleTemaChange('detalhesProduto_mensagemUltimaUnidade', val)}
                    placeholder="Atenção: Última peça!"
                />
            </div>

            <div style={{ border: '1px solid #eee', padding: '15px', borderRadius: '8px', marginBottom: '0.8rem' }}>
                <h4 style={{ margin: '0 0 10px 0', fontSize: '1rem', color: '#333', fontFamily: 'Poppins, sans-serif' }}>Produtos relacionados</h4>
                <TextField
                    label="Título para produtos alternativos:"
                    value={tema.detalhesProduto_tituloProdutosRelacionados ?? ''} // Use ?? ''
                    onChange={(val) => handleTemaChange('detalhesProduto_tituloProdutosRelacionados', val)}
                    placeholder="Produtos Similares"
                />
            </div>

            <div style={{ border: '1px solid #eee', padding: '15px', borderRadius: '8px', marginBottom: '1.5rem' }}>
                <h4 style={{ margin: '0 0 10px 0', fontSize: '1rem', color: '#333', fontFamily: 'Poppins, sans-serif' }}>Produtos complementares</h4>
                <TextField
                    label="Título para produtos complementares:"
                    value={tema.detalhesProduto_tituloProdutosComplementares ?? ''} // Use ?? ''
                    onChange={(val) => handleTemaChange('detalhesProduto_tituloProdutosComplementares', val)}
                    placeholder="Compre com este produto"
                />
            </div>

            <h4 style={{ margin: '0 0 5px 0', fontSize: '1rem', color: '#333', paddingLeft: '5px', fontFamily: 'Poppins, sans-serif' }}>Informações sobre a compra</h4>
            <p style={{ fontSize: '0.75rem', color: '#666', marginBottom: '1rem', paddingLeft: '5px', marginTop: '0', fontFamily: 'Poppins, sans-serif' }}>
                Informações abaixo do formulário de produto onde se concretiza uma compra. Por exemplo: alterações e devoluções, políticas de cancelamento ou informações sobre entrega.
            </p>

            {[1, 2, 3].map((num) => {
                const mostrarKey = `detalhesProduto_infoCompra_mostrar${num}` as keyof Tema;
                const tipoIconeKey = `detalhesProduto_infoCompra_tipoIcone${num}` as keyof Tema;
                const uploadIconeKey = `detalhesProduto_infoCompra_uploadIcone${num}` as keyof Tema;
                const tituloKey = `detalhesProduto_infoCompra_titulo${num}` as keyof Tema;
                const descricaoKey = `detalhesProduto_infoCompra_descricao${num}` as keyof Tema;

                const currentTipoIcone = (tema[tipoIconeKey] as string) ?? ''; // Use ?? ''
                const currentUploadIcone = (tema[uploadIconeKey] as string) ?? ''; // Use ?? ''

                return (
                    <div key={num} style={{ border: '1px solid #eee', padding: '15px', borderRadius: '8px', marginBottom: '0.8rem' }}>
                        <h4 style={{ margin: '0 0 8px 0', fontSize: '1rem', color: '#333', fontFamily: 'Poppins, sans-serif' }}>Informação {num} sobre a compra</h4>

                        <CheckboxField
                            label="Mostrar informação"
                            checked={(tema[mostrarKey] as boolean) ?? false} // Use ?? false
                            onChange={(val) => handleTemaChange(mostrarKey, val)}
                        />

                        {(tema[mostrarKey] ?? false) && ( // Verifique se é true ou false
                            <Fragment>
                                <TextField
                                    label="Título:"
                                    value={tema[tituloKey] as string ?? ''} // Use ?? ''
                                    onChange={(val) => handleTemaChange(tituloKey, val)}
                                    placeholder="Ex: Pagamento Seguro"
                                />

                                <TextareaField
                                    label="Descrição:"
                                    value={tema[descricaoKey] as string ?? ''} // Use ?? ''
                                    onChange={(val) => handleTemaChange(descricaoKey, val)}
                                    placeholder="Ex: Aceitamos todos os cartões de crédito."
                                    minHeight="38px"
                                    maxHeight="80px"
                                />

                                <SelectField
                                    label="Ícone:"
                                    value={currentTipoIcone}
                                    onChange={(val) => handleTemaChange(tipoIconeKey, val)}
                                    options={iconOptions}
                                />

                                {currentTipoIcone === 'imagemPropria' ? (
                                    <Fragment>
                                        <label style={{ fontSize: '0.75rem', color: '#666', marginBottom: '5px', display: 'block', fontFamily: 'Poppins, sans-serif' }}>Upload da imagem própria (50px por 50px):</label>
                                        <input
                                            type="file"
                                            onChange={(e) => {
                                                if (e.target.files && e.target.files[0]) {
                                                    const reader = new FileReader();
                                                    reader.onload = (uploadEvent) => {
                                                        handleTemaChange(uploadIconeKey, uploadEvent.target?.result as string);
                                                    };
                                                    reader.readAsDataURL(e.target.files[0]);
                                                }
                                            }}
                                            style={{
                                                padding: '8px',
                                                borderRadius: '4px',
                                                border: '1px solid #ccc',
                                                width: '100%',
                                                marginBottom: '10px',
                                                fontFamily: 'Poppins, sans-serif',
                                                fontSize: '0.85rem',
                                                height: '38px',
                                                boxSizing: 'border-box'
                                            }}
                                        />
                                        {currentUploadIcone && (
                                            <img
                                                src={currentUploadIcone}
                                                alt="Pré-visualização do ícone"
                                                style={{ width: '50px', height: '50px', objectFit: 'contain', border: '1px dashed #eee' }}
                                                onError={(e) => (e.currentTarget.src = 'https://placehold.co/50x50/ccc/fff?text=Erro')}
                                            />
                                        )}
                                    </Fragment>
                                ) : (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '10px' }}>
                                        <span style={{ fontSize: '0.85rem', color: '#666', fontFamily: 'Poppins, sans-serif' }}>Ícone selecionado:</span>
                                        {infoIconMap[currentTipoIcone]}
                                    </div>
                                )}
                            </Fragment>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default ProductDetailScreen;