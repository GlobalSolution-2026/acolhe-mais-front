import type { MetodoHttp } from '../types';

/** Uma cor da paleta do simulador para cada método HTTP (sem usar as cores de gravidade). */
const ESTILO: Record<MetodoHttp, string> = {
  GET: 'bg-mentaSuave text-primaria',
  POST: 'bg-primaria text-branco',
  PUT: 'bg-menta text-primariaEscura',
  DELETE: 'bg-borda text-texto',
};

/** Etiqueta do método HTTP (GET, POST, PUT, DELETE) usada nos painéis de explicação e de requisições. */
export default function BadgeMetodo({ metodo }: { metodo: MetodoHttp }) {
  return (
    <span className={`inline-block min-w-14 rounded-md px-2 py-0.5 text-center font-mono text-xs font-bold ${ESTILO[metodo]}`}>
      {metodo}
    </span>
  );
}
