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
 * - /simulador/cidadao: a aba mostra o celular; as telas do celular são rotas filhas dela
 *   (inicio, orientacao, resultado, emergencia, ubs, ubs/:idUnidade, entrar, criar-conta, agendar,
 *   sucesso, lista-do-dia, consultas, avisos, perfil, perfil/editar e perfil/ficha).
 *   ubs/:idUnidade é a rota com parâmetro (lido com useParams). Telas ainda não feitas mostram "Em construção".
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
import Inicio from '../pages/simulador/cidadao/Inicio';
import Emergencia from '../pages/simulador/cidadao/Emergencia';
import TelaEmConstrucao from '../components/celular/TelaEmConstrucao';
import { BASE_CELULAR } from '../services/navegacao';
import AbaRecepcao from '../pages/simulador/recepcao/AbaRecepcao';
import AbaStatus from '../pages/simulador/status/AbaStatus';
import AbaIaRiscoFalta from '../pages/simulador/ia/AbaIaRiscoFalta';
import AbaIaUrgencia from '../pages/simulador/ia/AbaIaUrgencia';

/** Atalho para as telas do celular que ainda não foram feitas. */
const emConstrucao = (titulo: string, bloco: string) => <TelaEmConstrucao titulo={titulo} previsao={bloco} />;

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
          {
            path: 'cidadao',
            element: <AbaCidadao />,
            children: [
              { index: true, element: <Navigate to="inicio" replace /> },
              { path: 'inicio', element: <Inicio /> },
              { path: 'emergencia', element: <Emergencia /> },
              { path: 'orientacao', element: emConstrucao('Orientação', 'bloco 3') },
              { path: 'resultado', element: emConstrucao('Resultado', 'bloco 3') },
              { path: 'ubs', element: emConstrucao('UBS próximas', 'bloco 4') },
              { path: 'ubs/:idUnidade', element: emConstrucao('Horários da UBS', 'bloco 4') },
              { path: 'entrar', element: emConstrucao('Entrar', 'bloco 4') },
              { path: 'criar-conta', element: emConstrucao('Criar conta', 'bloco 4') },
              { path: 'agendar', element: emConstrucao('Agendar', 'bloco 4') },
              { path: 'sucesso', element: emConstrucao('Consulta agendada', 'bloco 4') },
              { path: 'lista-do-dia', element: emConstrucao('Lista do dia', 'bloco 4') },
              { path: 'consultas', element: emConstrucao('Minhas consultas', 'bloco 4') },
              { path: 'avisos', element: emConstrucao('Avisos', 'bloco 4') },
              { path: 'perfil', element: emConstrucao('Perfil', 'bloco 4') },
              { path: 'perfil/editar', element: emConstrucao('Editar perfil', 'bloco 4') },
              { path: 'perfil/ficha', element: emConstrucao('Ficha de saúde', 'bloco 4') },
              // Tela que não existe no celular: volta para o Início (caminho absoluto; o relativo
              // seria resolvido a partir da URL errada e entraria em loop)
              { path: '*', element: <Navigate to={`${BASE_CELULAR}/inicio`} replace /> },
            ],
          },
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
