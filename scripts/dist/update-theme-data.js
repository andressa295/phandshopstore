"use strict";
// scripts/update-theme-data.ts
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var supabase_js_1 = require("@supabase/supabase-js");
var uuid_1 = require("uuid"); // Para gerar UUIDs se necessário
var supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
var supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Erro: Variáveis de ambiente NEXT_PUBLIC_SUPABASE_URL ou NEXT_PUBLIC_SUPABASE_ANON_KEY não estão definidas.');
    process.exit(1);
}
var supabase = (0, supabase_js_1.createClient)(supabaseUrl, supabaseAnonKey);
// ====================================================================
// ATENÇÃO: SUBSTITUA ESTE VALOR PELO SLUG DA SUA LOJA DE TESTE!
// Pelo seu print, a loja com ID 'b0d2defc-bb26-4490-b455-3fa5a93bf61a' tem o SLUG 'andressa-aliancas-1'.
// Se quiser usar a primeira loja do print, o SLUG é 'andressa-aliancas'.
var lojaIdentifier = 'andressa-aliancas-1'; // Usamos o slug para encontrar a loja inicialmente
var lojaIdentifierType = 'slug'; // Indica que estamos usando o slug para a busca
// ====================================================================
// O objeto JSON que será salvo na coluna 'configuracoes_tema_json'
// Inclui dados de exemplo para todas as seções da página inicial.
var novasConfiguracoesDoTema = {
    info_bar_items: [
        {
            id: "1",
            icone: "CreditCard",
            titulo: "Parcele em até 12x",
            descricao: "No cartão de crédito"
        },
        {
            id: "2",
            icone: "Truck",
            titulo: "Envio Full em até 24h",
            descricao: "Para capitais selecionadas"
        },
        {
            id: "3",
            icone: "Gift",
            titulo: "Frete Grátis",
            descricao: "Estado de SP (consulte condições)"
        }
    ],
    testimonials_data: [
        {
            id: "test1",
            nomeCliente: "Ana Silva",
            depoimento: "Adorei a loja! Produtos de alta qualidade e entrega super rápida. Recomendo!",
            avaliacaoEstrelas: 5,
            imagemClienteUrl: "https://placehold.co/80x80/FFC0CB/000000?text=AS"
        },
        {
            id: "test2",
            nomeCliente: "Carlos Mendes",
            depoimento: "Excelente atendimento ao cliente. Tive uma dúvida e fui prontamente atendido. Comprarei novamente!",
            avaliacaoEstrelas: 4,
            imagemClienteUrl: "https://placehold.co/80x80/ADD8E6/000000?text=CM"
        }
    ],
    mini_banners_data: [
        {
            id: "mb1",
            imagem_url: "https://placehold.co/300x150/FFD700/000000?text=Mini+Banner+Ofertas",
            link_url: "/promocoes",
            titulo: "Ofertas Imperdíveis",
            subtitulo: "Aproveite nossos descontos!"
        },
        {
            id: "mb2",
            imagem_url: "https://placehold.co/300x150/90EE90/000000?text=Mini+Banner+Novidades",
            link_url: "/novidades",
            titulo: "Coleção Nova",
            subtitulo: "Confira os últimos lançamentos"
        }
    ],
    newsletter_data: {
        title: "Assine nossa Newsletter!",
        subtitle: "Receba ofertas exclusivas e novidades direto na sua caixa de entrada."
    },
    text_with_image_data: {
        title: "Nossa História e Compromisso",
        subtitle: "Conheça mais sobre a sua loja",
        contentHtml: "<p>Somos apaixonados por oferecer produtos de alta qualidade e uma experiência de compra incrível. Nossa missão é trazer o melhor para você, com carinho e dedicação.</p><p>Desde 2023, trabalhamos incansavelmente para superar suas expectativas e construir uma comunidade de clientes satisfeitos.</p>",
        images: [
            { id: "twi1", url: "https://placehold.co/400x300/E0E7FF/4338CA?text=Nossa+Historia", alt: "Nossa equipe trabalhando" }
        ],
        imagePosition: "right",
        callToActionText: "Saiba Mais",
        callToActionLink: "/quem-somos"
    },
    home_categories_section: {
        title: "Explore Nossas Categorias",
        categoriesToShow: [
            // Exemplo: IDs de categorias que você quer destacar na home
            // Estes IDs devem corresponder aos IDs reais na sua tabela 'public.categorias'
            { id: (0, uuid_1.v4)(), nome: "Moda Feminina", slug: "moda-feminina", imagem_url: "https://placehold.co/150x150/FFC0CB/000000?text=Moda" },
            { id: (0, uuid_1.v4)(), nome: "Acessórios", slug: "acessorios", imagem_url: "https://placehold.co/150x150/D3D3D3/000000?text=Acessorios" }
        ]
    },
    home_static_content: {
        title: "Bem-vindo à Sua Loja Online!",
        contentHtml: "<p>Descubra uma vasta seleção de produtos exclusivos e promoções imperdíveis. Sua satisfação é a nossa prioridade!</p><p>Navegue pelas categorias e encontre exatamente o que você procura.</p>"
    },
    outras_configuracoes_do_tema: {
        cor_primaria: "#7C3AED",
        fonte_titulos: "Inter, sans-serif",
        ultima_atualizacao_script: new Date().toISOString() // Adiciona um timestamp para garantir que o JSON seja sempre diferente
    }
};
function updateLojaThemeConfig() {
    return __awaiter(this, void 0, void 0, function () {
        var _a, existingLoja, fetchError, lojaIdParaAtualizar, _b, data, error, updatedData, _c, reReadLoja, reReadError, err_1;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    console.log("Tentando encontrar a loja com identificador: ".concat(lojaIdentifier, " (Tipo: ").concat(lojaIdentifierType, ")"));
                    console.log('Novas configurações a serem salvas (incluindo timestamp):', JSON.stringify(novasConfiguracoesDoTema, null, 2));
                    _d.label = 1;
                case 1:
                    _d.trys.push([1, 7, , 8]);
                    return [4 /*yield*/, supabase
                            .from('lojas')
                            .select('id, slug, configuracoes_tema_json') // Seleciona o ID para usarmos no update
                            .eq(lojaIdentifierType, lojaIdentifier)];
                case 2:
                    _a = _d.sent(), existingLoja = _a.data, fetchError = _a.error;
                    if (fetchError) {
                        console.error('Erro ao verificar a loja existente:', fetchError.message);
                        return [2 /*return*/, { success: false, error: fetchError.message }];
                    }
                    if (!existingLoja || existingLoja.length === 0) {
                        console.warn("Aten\u00E7\u00E3o: Nenhuma loja encontrada com ".concat(lojaIdentifierType, " '").concat(lojaIdentifier, "'."));
                        console.warn('Por favor, verifique se o slug está correto no banco de dados e no script.');
                        return [2 /*return*/, { success: false, error: 'Loja não encontrada.' }];
                    }
                    lojaIdParaAtualizar = existingLoja[0].id;
                    console.log("Loja encontrada com ID: ".concat(lojaIdParaAtualizar, " e Slug: ").concat(existingLoja[0].slug));
                    console.log('Conteúdo atual de configuracoes_tema_json na loja (antes do update):', JSON.stringify(existingLoja[0].configuracoes_tema_json, null, 2));
                    // Se a loja foi encontrada, procedemos com a atualização USANDO O ID
                    console.log("Tentando atualizar a loja com ID: ".concat(lojaIdParaAtualizar));
                    return [4 /*yield*/, supabase
                            .from('lojas') // Nome da sua tabela de lojas
                            .update({ configuracoes_tema_json: novasConfiguracoesDoTema })
                            .eq('id', lojaIdParaAtualizar)
                            .select()];
                case 3:
                    _b = _d.sent(), data = _b.data, error = _b.error;
                    // Logs detalhados para depuração do resultado do update
                    console.log('--- RESULTADO SUPABASE UPDATE ---');
                    console.log('Data:', data);
                    console.log('Error:', error);
                    console.log('---------------------------------');
                    if (error) {
                        console.error('Erro ao atualizar configurações do tema:', error.message);
                        return [2 /*return*/, { success: false, error: error.message }];
                    }
                    if (!(data && Array.isArray(data) && data.length > 0)) return [3 /*break*/, 4];
                    updatedData = data;
                    console.log('Configurações do tema atualizadas com sucesso para a loja:', updatedData);
                    console.log('O ID da loja é:', updatedData[0].id); // Supondo que 'id' é um campo na tabela 'lojas'
                    console.log('O novo conteúdo JSON é:', JSON.stringify(updatedData[0].configuracoes_tema_json, null, 2));
                    return [2 /*return*/, { success: true, data: updatedData }];
                case 4:
                    console.warn('Atenção: A operação de atualização foi concluída, mas nenhuma linha foi afetada ou os dados não foram retornados. Isso é inesperado, pois o RLS está desativado e o ID está correto. Além disso, o UPDATE de JSONB via SQL Editor funcionou.');
                    console.warn('Isso sugere um problema na comunicação ou interpretação da resposta pelo cliente supabase-js para a coluna JSONB.');
                    console.warn('\nRealizando uma re-leitura do configuracoes_tema_json para verificar o estado atual do banco...');
                    return [4 /*yield*/, supabase
                            .from('lojas')
                            .select('configuracoes_tema_json')
                            .eq('id', lojaIdParaAtualizar)];
                case 5:
                    _c = _d.sent(), reReadLoja = _c.data, reReadError = _c.error;
                    if (reReadError) {
                        console.error('Erro ao re-ler a loja após a tentativa de update:', reReadError.message);
                    }
                    else if (reReadLoja && reReadLoja.length > 0) {
                        console.log('Conteúdo de configuracoes_tema_json na loja (APÓS A TENTATIVA DE UPDATE VIA SCRIPT):', JSON.stringify(reReadLoja[0].configuracoes_tema_json, null, 2));
                    }
                    else {
                        console.warn('Não foi possível re-ler o configuracoes_tema_json após a tentativa de update.');
                    }
                    console.warn('Por favor, compartilhe este log COMPLETO. Se este problema persistir, será necessário investigar a fundo a comunicação entre o supabase-js e sua instância Supabase, possivelmente com o suporte do Supabase.');
                    return [2 /*return*/, { success: false, error: 'Nenhuma alteração aplicada ou linha afetada. Problema na comunicação do cliente/banco.' }];
                case 6: return [3 /*break*/, 8];
                case 7:
                    err_1 = _d.sent();
                    console.error('Erro inesperado ao atualizar configurações:', err_1.message);
                    return [2 /*return*/, { success: false, error: 'Erro inesperado ao atualizar configurações.' }];
                case 8: return [2 /*return*/];
            }
        });
    });
}
// Para executar a função, chame-a.
// Se este for um script temporário, você pode chamá-la diretamente:
updateLojaThemeConfig();
