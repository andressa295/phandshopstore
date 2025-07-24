// models/ThemeConfig.ts
import mongoose, { Document, Schema } from 'mongoose';
// Certifique-se de que o caminho abaixo está correto para o seu tipo ThemeConfig
import { ThemeConfig } from '@/app/(painel)/personalizar/types'; 

// Interface que define a estrutura do documento no MongoDB
export interface IThemeConfigDocument extends Document {
    themeName: string; // Ex: 'tema-base-1' ou 'minha-loja-xpto'
    config: ThemeConfig; // O objeto completo da configuração do tema
    lastUpdated: Date;
}

// Definição do esquema Mongoose
const ThemeConfigSchema: Schema = new Schema({
    themeName: { type: String, required: true, unique: true }, 
    config: { type: Object, required: true }, 
    lastUpdated: { type: Date, default: Date.now } 
}, {
    timestamps: true 
});


const ThemeConfigModel = mongoose.models.ThemeConfig || mongoose.model<IThemeConfigDocument>('ThemeConfig', ThemeConfigSchema);

export default ThemeConfigModel;