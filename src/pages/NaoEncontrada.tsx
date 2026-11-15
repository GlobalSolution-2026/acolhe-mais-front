/**
 * Página: Não encontrada (404)
 * Aparece quando a URL não corresponde a nenhuma rota do site
 * ou quando acontece um erro ao abrir uma rota (errorElement do router).
 * Endpoints: nenhum.
 * Estados: só a mensagem e o link para voltar à Home.
 */
import { Link } from 'react-router-dom';

/**
 * Mostra o aviso de página não encontrada com um link para a Home.
 * Usa o mesmo verde das páginas institucionais para não destoar do site.
 */
export default function NaoEncontrada() {
  return (
    <section className="min-h-[60vh] flex flex-col items-center justify-center px-6 py-16 text-center">
      <p className="text-6xl font-extrabold text-[#004d3a]">404</p>
      <h1 className="mt-3 text-2xl font-bold text-stone-800">Página não encontrada</h1>
      <p className="mt-2 text-stone-600 max-w-md">
        O endereço que você abriu não existe ou foi mudado.
      </p>
      <Link
        to="/"
        className="mt-8 px-6 py-2.5 rounded-lg font-bold text-sm bg-[#004d3a] hover:bg-[#003829] text-white shadow-sm transition-colors"
      >
        Voltar para a Home
      </Link>
    </section>
  );
}
