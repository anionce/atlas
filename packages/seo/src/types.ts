export interface SeoConfig {
  title: string;
  description: string;
  /** Ruta absoluta desde la raíz, ej. "/comprar-vivienda". */
  path: string;
  locale?: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface BreadcrumbItem {
  name: string;
  path: string;
}

export interface ToolSchemaConfig {
  name: string;
  description: string;
  path: string;
  applicationCategory?: string;
}
