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
var dotenv = require("dotenv");
var config_1 = require("../app/(sitetemas)/sitetemas/[lojaSlug]/themes/padrao/config");
dotenv.config({ path: ".env.local" });
var supabase = (0, supabase_js_1.createClient)(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY // 🔑 precisa ser service role
);
function populateThemeConfigs() {
    return __awaiter(this, void 0, void 0, function () {
        var insertError, _a, lojas, lojasError, _i, _b, loja, updateError;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    console.log("🚀 Populando tabela 'theme_configs'...");
                    return [4 /*yield*/, supabase
                            .from("theme_configs")
                            .upsert({
                            nome_tema: config_1.padraoConfig.themeName,
                            config_json: config_1.padraoConfig,
                            is_default: true,
                        }, { onConflict: "nome_tema" })];
                case 1:
                    insertError = (_c.sent()).error;
                    if (insertError) {
                        console.error("❌ Erro ao inserir Tema Padrão:", insertError.message);
                        process.exit(1);
                    }
                    console.log("✅ Tema Padrão configurado como default em 'theme_configs'.");
                    return [4 /*yield*/, supabase
                            .from("lojas")
                            .select("id, theme_config")];
                case 2:
                    _a = _c.sent(), lojas = _a.data, lojasError = _a.error;
                    if (lojasError) {
                        console.error("❌ Erro ao buscar lojas:", lojasError.message);
                        return [2 /*return*/];
                    }
                    _i = 0, _b = lojas !== null && lojas !== void 0 ? lojas : [];
                    _c.label = 3;
                case 3:
                    if (!(_i < _b.length)) return [3 /*break*/, 6];
                    loja = _b[_i];
                    if (!!loja.theme_config) return [3 /*break*/, 5];
                    return [4 /*yield*/, supabase
                            .from("lojas")
                            .update({ theme_config: config_1.padraoConfig }) // 🔥 injeta JSON direto
                            .eq("id", loja.id)];
                case 4:
                    updateError = (_c.sent()).error;
                    if (updateError) {
                        console.error("\u274C Erro ao atualizar loja ".concat(loja.id, ":"), updateError.message);
                    }
                    else {
                        console.log("\u2705 Loja ".concat(loja.id, " atualizada com Tema Padr\u00E3o."));
                    }
                    _c.label = 5;
                case 5:
                    _i++;
                    return [3 /*break*/, 3];
                case 6:
                    console.log("🎉 População concluída.");
                    return [2 /*return*/];
            }
        });
    });
}
populateThemeConfigs();
