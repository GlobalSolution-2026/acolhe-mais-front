/**
 * Rotas do site Acolhe+ (createBrowserRouter, padrão visto em aula).
 *
 * Organização:
 * - Uma rota "pai" sem path desenha o <Layout /> (Header + <Outlet /> + Footer).
 *   Todas as páginas são rotas filhas dela, então aparecem dentro do <Outlet />.
 * - Páginas institucionais: /, /sobre, /faq, /contato, /integrantes e /integrantes/:rm
 *   (o :rm é o parâmetro lido com useParams na página do integrante).
 * - /solucao: página da solução.
 * - /simulador: o <Simulador /> é o layout (topo + abas com NavLink + <Outlet />) e cada aba é uma rota filha:
 *   cidadao, recepcao, status, ia-risco-falta e ia-urgencia. A rota index (/simulador sozinho)
 *   redireciona para /simulador/cidadao com <Navigate />.
 * - path "*": qualquer URL que não existe mostra a página NaoEncontrada, mantendo Header e Footer.
 * - errorElement: se uma rota quebrar ao carregar, mostra a NaoEncontrada no lugar da tela de erro padrão.
 */
import { createBrowserRouter, Navigate } from 'react-router-dom';

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

import AbaCidadao from '../pages/simulador/cidadao/AbaCidadao';
import AbaRecepcao from '../pages/simulador/recepcao/AbaRecepcao';
import AbaStatus from '../pages/simulador/status/AbaStatus';
import AbaIaRiscoFalta from '../pages/simulador/ia/AbaIaRiscoFalta';
import AbaIaUrgencia from '../pages/simulador/ia/AbaIaUrgencia';

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
      {
        path: '/simulador',
        element: <Simulador />,
        children: [
          // /simulador sozinho abre a aba Cidadão (replace: o "voltar" do navegador não cai no redirecionamento)
          { index: true, element: <Navigate to="cidadao" replace /> },
          { path: 'cidadao', element: <AbaCidadao /> },
          { path: 'recepcao', element: <AbaRecepcao /> },
          { path: 'status', element: <AbaStatus /> },
          { path: 'ia-risco-falta', element: <AbaIaRiscoFalta /> },
          { path: 'ia-urgencia', element: <AbaIaUrgencia /> },
        ],
      },
      { path: '*', element: <NaoEncontrada /> },
    ],
  },
]);
