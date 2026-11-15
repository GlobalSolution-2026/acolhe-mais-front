/**
 * Rotas do site Acolhe+ (createBrowserRouter, padrão visto em aula).
 *
 * Organização:
 * - Uma rota "pai" sem path desenha o <Layout /> (Header + <Outlet /> + Footer).
 *   Todas as páginas são rotas filhas dela, então aparecem dentro do <Outlet />.
 * - Páginas institucionais: /, /sobre, /faq, /contato, /integrantes e /integrantes/:rm
 *   (o :rm é o parâmetro lido com useParams na página do integrante).
 * - /solucao e /simulador: as abas do simulador entram como rotas filhas de /simulador
 *   nos próximos blocos.
 * - path "*": qualquer URL que não existe mostra a página NaoEncontrada, mantendo Header e Footer.
 * - errorElement: se uma rota quebrar ao carregar, mostra a NaoEncontrada no lugar da tela de erro padrão.
 */
import { createBrowserRouter } from 'react-router-dom';

import Layout from '../components/Layout';

import Home from '../pages/Home';
import Sobre from '../pages/Sobre';
import Faq from '../pages/Faq';
import Contato from '../pages/Contato';
import Integrantes from '../pages/Integrantes';
import IntegranteDetalhe from '../pages/IntegranteDetalhe';
import Solucao from '../pages/Solucao';
import Simulador from '../pages/Simulador';
import NaoEncontrada from '../pages/NaoEncontrada';

export const router = createBrowserRouter([
  {
    element: <Layout />,
    errorElement: <NaoEncontrada />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/sobre', element: <Sobre /> },
      { path: '/faq', element: <Faq /> },
      { path: '/contato', element: <Contato /> },
      { path: '/integrantes', element: <Integrantes /> },
      { path: '/integrantes/:rm', element: <IntegranteDetalhe /> },
      { path: '/solucao', element: <Solucao /> },
      { path: '/simulador', element: <Simulador /> },
      { path: '*', element: <NaoEncontrada /> },
    ],
  },
]);
