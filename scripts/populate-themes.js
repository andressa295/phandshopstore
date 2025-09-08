"use strict";
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
var Padrao_1 = require("../app/(painel)/personalizar/themes/Padrao"); // Importa o tema padrão
var dotenv = require("dotenv"); // Importa a biblioteca dotenv de forma correta
// Carrega as variáveis de ambiente do arquivo .env.local
dotenv.config({ path: '.env.local' });
var supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
var supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Erro: Variáveis de ambiente NEXT_PUBLIC_SUPABASE_URL ou NEXT_PUBLIC_SUPABASE_ANON_KEY não estão definidas.');
    process.exit(1);
}
var supabase = (0, supabase_js_1.createClient)(supabaseUrl, supabaseAnonKey);
// Dados dos temas fornecidos por você
var themesData = [
    { "id": "Prado", "nome": "Prado", "categoria": "Moda feminina elegante", "descricao": "Estilo sofisticado, paleta refinada, visual “chique de boutique”", "imagemUrl": "https://placehold.co/600x400/E0E7FF/4338CA?text=Prado+Preview" },
    { "id": "Neon", "nome": "Neon", "categoria": "Moda jovem / Streetwear", "descricao": "Cores vibrantes, visual urbano, fontes ousadas", "imagemUrl": "https://placehold.co/600x400/FF00FF/000000?text=Neon+Preview" },
    { "id": "Zeta", "nome": "Zeta", "categoria": "Eletrônicos / Tech store", "descricao": "Estilo clean, tech vibes, bem minimalista e direto", "imagemUrl": "https://placehold.co/600x400/000000/00FFFF?text=Zeta+Preview" },
    { "id": "Luna", "nome": "Luna", "categoria": "Joias / Acessórios", "descricao": "Visual delicado, lunar, tons suaves, brilho discreto", "imagemUrl": "https://placehold.co/600x400/F0F0F0/666666?text=Luna+Preview" },
    { "id": "Império", "nome": "Império", "categoria": "Moda masculina premium / Alta costura", "descricao": "Estilo imponente, visual com seriedade e luxo", "imagemUrl": "https://placehold.co/600x400/333333/FFD700?text=Imperio+Preview" },
    { "id": "Giardini", "nome": "Giardini", "categoria": "Decoração / Casa & Jardim", "descricao": "Estilo natural, floral, cores verdes e aconchego", "imagemUrl": "https://placehold.co/600x400/D4EDDA/155724?text=Giardini+Preview" },
    { "id": "Miloch", "nome": "Miloch", "categoria": "Moda casual / Lifestyle", "descricao": "Visual versátil, moderno e sem exageros – bem \"toda loja combina\"", "imagemUrl": "https://placehold.co/600x400/A0A0A0/FFFFFF?text=Miloch+Preview" },
    { "id": "Flex", "nome": "Flex", "categoria": "Pet shop / Produtos variados", "descricao": "Adaptável, divertido, layout leve com muitas imagens", "imagemUrl": "https://placehold.co/600x400/ADD8E6/0000FF?text=Flex+Preview" },
    { "id": "Doçura", "nome": "Doçura", "categoria": "Confeitaria / Food / Loja de doces", "descricao": "Visual fofo, paleta pastel, bem “comestível”", "imagemUrl": "https://placehold.co/600x400/FFD1DC/FF69B4?text=Docura+Preview" },
    { "id": "Aurora", "nome": "Aurora", "categoria": "Cosméticos / Skincare", "descricao": "Delicadeza, tons rosados, brilho suave, vibe \"autoamor\"", "imagemUrl": "https://placehold.co/600x400/FFC0CB/FF69B4?text=Aurora+Preview" },
    { "id": "Pixel", "nome": "Pixel", "categoria": "Games / Geek", "descricao": "Visual gamer, blocado, fontes tech, elementos em 8-bit", "imagemUrl": "https://placehold.co/600x400/404040/00FF00?text=Pixel+Preview" },
    { "id": "Maré", "nome": "Maré", "categoria": "Moda praia / Verão", "descricao": "Azul, areia, elementos tropicais, leveza e frescor", "imagemUrl": "https://placehold.co/600x400/87CEEB/F0E68C?text=Mare+Preview" },
    { "id": "Onda", "nome": "Onda", "categoria": "Esportes Aquáticos / Surf", "descricao": "Design fluido, cores do oceano, energia e movimento.", "imagemUrl": "https://placehold.co/600x400/007FFF/FFFFFF?text=Onda+Preview" },
    { "id": "Essência", "nome": "Essência", "categoria": "Perfumaria / Aromas", "descricao": "Elegância, minimalismo, tons neutros e foco no produto.", "imagemUrl": "https://placehold.co/600x400/F5F5DC/696969?text=Essencia+Preview" },
    { "id": "Harmonia", "nome": "Harmonia", "categoria": "Bem-estar / Yoga / Meditação", "descricao": "Cores suaves, elementos orgânicos, tranquilidade e equilíbrio.", "imagemUrl": "https://placehold.co/600x400/E6E6FA/8A2BE2?text=Harmonia+Preview" },
    { "id": "Inspire", "nome": "Inspire", "categoria": "Arte / Papelaria Criativa", "descricao": "Design artístico, cores vibrantes, fontes caligráficas, inspiração.", "imagemUrl": "https://placehold.co/600x400/FFD700/FF4500?text=Inspire+Preview" },
    { "id": "Zenith", "nome": "Zenith", "categoria": "Tecnologia / Inovação", "descricao": "Visual futurista, linhas limpas, cores escuras e detalhes luminosos.", "imagemUrl": "https://placehold.co/600x400/1A1A1A/00FF00?text=Zenith+Preview" },
    { "id": "Alvorada", "nome": "Alvorada", "categoria": "Cafés Especiais / Padarias", "descricao": "Tons quentes, rústico, aconchegante, aroma visual de café.", "imagemUrl": "https://placehold.co/600x400/D2B48C/8B4513?text=Alvorada+Preview" },
    { "id": "Conceito", "nome": "Conceito", "categoria": "Design / Arquitetura / Móveis", "descricao": "Minimalista, sofisticado, foco na forma e função, tipografia elegante.", "imagemUrl": "https://placehold.co/600x400/B0C4DE/4682B4?text=Conceito+Preview" },
    { "id": "Simples", "nome": "Simples", "categoria": "Produtos Básicos / Essenciais", "descricao": "Clean, direto ao ponto, sem distrações, funcionalidade acima de tudo.", "imagemUrl": "https://placehold.co/600x400/F5F5F5/333333?text=Simples+Preview" }
];
function populateThemesTable() {
    return __awaiter(this, void 0, void 0, function () {
        var _i, themesData_1, theme, _a, existingTheme, fetchError, insertError;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    console.log("Iniciando população da tabela 'public.temas'...");
                    _i = 0, themesData_1 = themesData;
                    _b.label = 1;
                case 1:
                    if (!(_i < themesData_1.length)) return [3 /*break*/, 6];
                    theme = themesData_1[_i];
                    return [4 /*yield*/, supabase
                            .from('temas')
                            .select('id')
                            .eq('caminho_componente', theme.id)
                            .single()];
                case 2:
                    _a = _b.sent(), existingTheme = _a.data, fetchError = _a.error;
                    if (fetchError && fetchError.code !== 'PGRST116') {
                        console.error("Erro ao verificar tema '".concat(theme.nome, "':"), fetchError.message);
                        return [3 /*break*/, 5];
                    }
                    if (!existingTheme) return [3 /*break*/, 3];
                    console.log("Tema '".concat(theme.nome, "' j\u00E1 existe (ID: ").concat(existingTheme.id, "). Pulando inser\u00E7\u00E3o."));
                    return [3 /*break*/, 5];
                case 3: return [4 /*yield*/, supabase
                        .from('temas')
                        .insert({
                        nome_tema: theme.nome,
                        descricao: theme.descricao,
                        preview_url: theme.imagemUrl,
                        is_free: true,
                        caminho_componente: theme.id,
                        configuracoes_json: Padrao_1.Padrao
                    })];
                case 4:
                    insertError = (_b.sent()).error;
                    if (insertError) {
                        console.error("Erro ao inserir tema '".concat(theme.nome, "':"), insertError.message);
                    }
                    else {
                        console.log("Tema '".concat(theme.nome, "' inserido com sucesso."));
                    }
                    _b.label = 5;
                case 5:
                    _i++;
                    return [3 /*break*/, 1];
                case 6:
                    console.log("População da tabela 'public.temas' concluída.");
                    return [2 /*return*/];
            }
        });
    });
}
populateThemesTable();
