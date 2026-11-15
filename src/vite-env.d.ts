/// <reference types="vite/client" />

/** Variáveis de ambiente do Acolhe+ (veja o .env.example). Vazias = modo demonstração. */
interface ImportMetaEnv {
  /** URL da API Java no Render. */
  readonly VITE_API_URL?: string;
  /** URL da API Flask de IA. */
  readonly VITE_FLASK_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
