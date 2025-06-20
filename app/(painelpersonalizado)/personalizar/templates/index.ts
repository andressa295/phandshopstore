import { Tema } from '../components/EditorContext';
import { Velvete } from './Velvete'; // ou o caminho certo onde está seu tema Velvete

export const TEMPLATES: Record<string, Tema> = {
  Velvete, // <- isso é o que o EditorContext espera
};
