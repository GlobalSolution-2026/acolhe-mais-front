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
 * Usa os tokens do tema (azul-marinho + menta), como o resto do site.
 */
export default function NaoEncontrada() {
  return (
    <section className="min-h-[60vh] flex flex-col items-center justify-center px-6 py-16 text-center">
      <p className="text-6xl font-extrabold text-primaria">404</p>
      <h1 className="mt-3 text-2xl font-bold text-texto">Página não encontrada</h1>
      <p className="mt-2 text-textoSuave max-w-md">
        O endereço que você abriu não existe ou foi mudado.
      </p>
      <Link
        to="/"
        className="mt-8 inline-flex min-h-12 items-center justify-center rounded-xl bg-primaria px-6 font-bold text-branco shadow-leve transition-colors hover:bg-primariaEscura"
      >
        Voltar para o início
      </Link>
    </section>
  );
}
