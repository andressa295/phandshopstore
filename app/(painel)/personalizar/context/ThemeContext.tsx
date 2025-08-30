// app/(painel)/personalizar/context/ThemeContext.tsx
'use client';

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useCallback,
  useRef
} from 'react';

import defaultThemeConfig from './defaultThemeConfig';
import {
  ThemeConfig,
  ThemeUpdateFn,
  LojaData,
  ProdutoData,
  BannerData,
  CategoryData,
  InfoBarItem,
  HighlightsModuleData,
  SingleHighlightItem
} from '../types';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

interface ThemeContextType {
  config: ThemeConfig;
  updateConfig: ThemeUpdateFn;
  previewMode: 'desktop' | 'mobile';
  setPreviewMode: (mode: 'desktop' | 'mobile') => void;
  saveThemeConfig: () => Promise<void>;
  selectedTheme: string;
  setSelectedTheme: (themeName: string) => void;
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
  iframeRef: React.RefObject<HTMLIFrameElement | null>;
  lojaSlug: string;
  lojaData: LojaData | null;
  produtos: ProdutoData[];
  banners: BannerData[];
  categorias: CategoryData[];
  infoBarItems: InfoBarItem[];
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);
const supabase = createClientComponentClient();
const SUPABASE_THEME_TABLE = 'lojas';

export const ThemeProvider: React.FC<{
  children: ReactNode;
  lojaSlug: string;
  initialThemeConfig?: ThemeConfig;
  lojaData?: LojaData;
  produtos?: ProdutoData[];
  banners?: BannerData[];
  categorias?: CategoryData[];
  infoBarItems?: InfoBarItem[];
  isIframeHost?: boolean;
}> = ({ children, lojaSlug, initialThemeConfig, lojaData, produtos, banners, categorias, infoBarItems, isIframeHost = false }) => {
  console.log("ThemeProvider: Componente renderizado.", { lojaSlug, isIframeHost });

  const [config, setConfig] = useState<ThemeConfig>(initialThemeConfig || defaultThemeConfig);
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [selectedTheme, setSelectedTheme] = useState<string>('tema-base-1');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  const [internalLojaData, setInternalLojaData] = useState<LojaData | null>(lojaData || null);
  const [internalProdutos, setInternalProdutos] = useState<ProdutoData[]>(produtos || []);
  const [internalBanners, setInternalBanners] = useState<BannerData[]>(banners || []);
  const [internalCategorias, setInternalCategorias] = useState<CategoryData[]>(categorias || []);
  const [internalInfoBarItems, setInternalInfoBarItems] = useState<InfoBarItem[]>(infoBarItems || []);

  const hasJustSaved = useRef(false);
  const lastSentConfigJson = useRef<string | null>(null);

  const isValidThemePayload = (maybe: any): maybe is ThemeConfig => {
    if (!maybe || typeof maybe !== 'object') return false;
    if (!('homepage' in maybe) || !Array.isArray(maybe.homepage?.modules)) return false;
    if ('version' in maybe && typeof maybe.version !== 'number') return false;
    return true;
  };

  const updateConfig: ThemeUpdateFn = useCallback((newConfig) => {
    setConfig(prevConfig => {
      const mergedConfig = { ...prevConfig };
      for (const key in newConfig) {
        if (newConfig.hasOwnProperty(key)) {
          const newValue = (newConfig as any)[key];
          const prevValue = (prevConfig as any)[key];
          if (typeof newValue === 'object' && newValue !== null && !Array.isArray(newValue) &&
            typeof prevValue === 'object' && prevValue !== null && !Array.isArray(prevValue)) {
            (mergedConfig as any)[key] = { ...prevValue, ...newValue };
          } else {
            (mergedConfig as any)[key] = newValue;
          }
        }
      }
      return mergedConfig;
    });
  }, []);

  const saveThemeConfig = useCallback(async () => {
    setIsSaving(true);
    setError(null);
    try {
      const configToSave: ThemeConfig = JSON.parse(JSON.stringify(config));
      if (configToSave.advanced) {
        configToSave.advanced.lastUpdatedEditor = new Date().toISOString();
      } else {
        configToSave.advanced = { lastUpdatedEditor: new Date().toISOString() };
      }
      const { data, error: updateError } = await supabase
        .from('lojas')
        .update({ configuracoes_tema_json: configToSave })
        .eq('slug', lojaSlug)
        .select();
      if (updateError) {
        console.error("Erro ao salvar configurações do tema:", updateError);
        setError(`Falha ao salvar: ${updateError.message}`);
        alert(`Erro ao salvar configurações: ${updateError.message}`);
      } else if (data && data.length > 0) {
        console.log("Configurações do tema salvas com sucesso:", data[0].configuracoes_tema_json);
        alert('Configurações salvas com sucesso!');
        hasJustSaved.current = true;
        setConfig(data[0].configuracoes_tema_json as ThemeConfig);
      } else {
        setError("Nenhuma linha afetada ao salvar. Verifique se a loja existe.");
        alert("Nenhuma alteração foi salva. Verifique se a loja existe.");
      }
    } catch (err: any) {
      console.error("Erro inesperado ao salvar configurações:", err);
      setError(`Erro inesperado: ${err.message}`);
      alert(`Erro inesperado ao salvar: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  }, [config, lojaSlug]);

  useEffect(() => {
    const fetchData = async () => {
      if (initialThemeConfig && lojaData) {
        setConfig(initialThemeConfig);
        setInternalLojaData(lojaData || null);
        setInternalProdutos(produtos || []);
        setInternalBanners(banners || []);
        setInternalCategorias(categorias || []);
        setInternalInfoBarItems(infoBarItems || []);
        setIsLoading(false);
        console.log("ThemeContext: Usando initialThemeConfig e dados passados via props.");
        return;
      }
      if (lojaSlug) {
        setIsLoading(true);
        setError(null);
        console.log("ThemeContext: Iniciando fetch de dados do Supabase para lojaSlug:", lojaSlug);
        try {
          const { data: loja, error: lojaError } = await supabase
            .from('lojas')
            .select(`*`)
            .eq('slug', lojaSlug)
            .single();
          if (lojaError || !loja) {
            throw new Error(lojaError?.message || "Loja não encontrada.");
          }
          setInternalLojaData(loja as LojaData);
          const loadedThemeConfig: ThemeConfig = (loja.configuracoes_tema_json as ThemeConfig) || defaultThemeConfig;
          setConfig(loadedThemeConfig);
          const [produtosResult, bannersResult, categoriasResult] = await Promise.all([
            supabase.from('produtos').select(`id, nome, descricao, preco, estoque, imagem_url, categoria_id`),
            supabase.from('banners').select(`id, imagem_url, link_url, titulo, subtitulo, ordem`),
            supabase.from('categorias').select(`id, nome, slug, imagem_url`),
          ]);
          setInternalProdutos(produtosResult.data || []);
          setInternalBanners(bannersResult.data || []);
          setInternalCategorias(categoriasResult.data || []);
          const highlightsModule = loadedThemeConfig.homepage?.modules.find(
            (m): m is { id: string; type: 'highlights'; data: HighlightsModuleData } => m.type === 'highlights'
          );
          const mappedInfoBarItems: InfoBarItem[] = highlightsModule?.data.highlightItems?.map((item: SingleHighlightItem) => ({
            id: item.id,
            icone: item.icon,
            titulo: item.title,
            descricao: item.subtitle,
          })) || [];
          setInternalInfoBarItems(mappedInfoBarItems);
          
          console.log("ThemeContext: Dados do Supabase carregados com sucesso.");

        } catch (err: any) {
          console.error("ThemeContext: ERRO ao carregar dados:", err.message);
          setError(`Erro ao carregar dados: ${err.message}. Verifique o slug e as permissões.`);
          setInternalLojaData(null);
          setInternalProdutos([]);
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [lojaSlug, initialThemeConfig, lojaData, produtos, banners, categorias, infoBarItems]);

  useEffect(() => {
    if (isIframeHost) {
      try {
        const json = JSON.stringify({ config, previewMode });
        if (!iframeRef.current || !iframeRef.current.contentWindow) {
          lastSentConfigJson.current = null;
          return;
        }
        if (lastSentConfigJson.current === json) return;
        const targetOriginString: string = '*';
        iframeRef.current.contentWindow.postMessage(
          { type: 'UPDATE_THEME_CONFIG', payload: { config, previewMode } },
          { targetOrigin: targetOriginString }
        );
        lastSentConfigJson.current = json;
      } catch (err) {
        console.error("ThemeContext (Host): Erro ao enviar para iframe:", err);
      }
    }
  }, [config, previewMode, isIframeHost]);

  useEffect(() => {
    if (!config) return;

    try {
      const targetDocument = isIframeHost && iframeRef.current?.contentDocument 
                           ? iframeRef.current.contentDocument 
                           : document;

      const root = targetDocument.documentElement;

      // ---- CORREÇÃO: Injetando todas as variáveis de CSS de forma robusta ----
      root.style.setProperty('--primary-color', config.primaryColor ?? '#5b21b6');
      root.style.setProperty('--secondary-color', config.secondaryColor ?? '#6c757d');
      root.style.setProperty('--text-color', config.textColor ?? '#343a40');

      root.style.setProperty('--header-background-color', config.headerSettings?.headerBackgroundColor ?? '#ffffff');
      root.style.setProperty('--header-text-color', config.headerSettings?.headerTextColor ?? '#343a40');

      root.style.setProperty('--footer-background-color', config.footer?.footerBackgroundColor ?? '#343a40');
      root.style.setProperty('--footer-text-color', config.footer?.footerTextColor ?? '#ffffff');
      
      root.style.setProperty('--primary-font', `'${config.primaryFont ?? 'sans-serif'}', sans-serif`);
      root.style.setProperty('--secondary-font', `'${config.secondaryFont ?? 'sans-serif'}', sans-serif`);

      // ... (restante da lógica de injeção de variáveis)
      // ---- FIM DA CORREÇÃO ----

    } catch (err) {
      console.error("ThemeContext (StyleApply): Erro ao injetar vars:", err);
    }
  }, [config, isIframeHost]);

  useEffect(() => {
    if (!isIframeHost && typeof window !== 'undefined' && window.parent !== window) {
        const handleMessage = (event: MessageEvent) => {
            try {
                const { data } = event;
                if (!data || typeof data !== 'object') return;

                if (data.type === 'UPDATE_THEME_CONFIG') {
                    const payload = data.payload;
                    if (!payload) return;
                    const incomingConfig = payload.config ?? payload;

                    if (!isValidThemePayload(incomingConfig)) {
                        console.warn("ThemeContext (Client): Payload inválido recebido, ignorando.", data);
                        return;
                    }

                    const incomingJson = JSON.stringify({ cfg: incomingConfig, previewMode: payload.previewMode ?? 'desktop' });
                    const currentJson = JSON.stringify({ cfg: config, previewMode });

                    if (incomingJson === currentJson) {
                        const targetOriginString: string = event.origin as string || '*';
                        event.source?.postMessage?.({ type: 'APPLIED_THEME', status: 'already' }, { targetOrigin: targetOriginString });
                        return;
                    }

                    console.log("ThemeContext (Client): Aplicando novo tema recebido do painel.");
                    setConfig(incomingConfig);
                    setPreviewMode((payload.previewMode as 'desktop' | 'mobile') ?? 'desktop');

                    const targetOriginString: string = event.origin as string || '*';
                    event.source?.postMessage?.({ type: 'APPLIED_THEME', status: 'ok' }, { targetOrigin: targetOriginString });

                } else if (data.type === 'REQUEST_CURRENT_THEME') {
                    const targetOriginString: string = event.origin as string || '*';
                    event.source?.postMessage?.(
                        { type: 'UPDATE_THEME_CONFIG', payload: { config, previewMode } },
                        { targetOrigin: targetOriginString }
                    );
                }
            } catch (err) {
                console.error("ThemeContext (Client): Erro ao processar message event:", err);
            }
        };

        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }
  }, [config, previewMode, isIframeHost]);

  if (isLoading) {
    return <div>Carregando tema e dados da loja...</div>;
  }

  if (error) {
    return <div>Ocorreu um erro: {error}</div>;
  }

  return (
    <ThemeContext.Provider value={{
      config,
      updateConfig,
      setPreviewMode,
      saveThemeConfig,
      selectedTheme,
      setSelectedTheme,
      isLoading,
      isSaving,
      error,
      iframeRef,
      lojaSlug,
      lojaData: internalLojaData,
      produtos: internalProdutos,
      banners: internalBanners,
      categorias: internalCategorias,
      infoBarItems: internalInfoBarItems,
      previewMode,
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};