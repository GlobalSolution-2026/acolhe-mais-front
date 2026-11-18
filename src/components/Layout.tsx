import { Outlet } from 'react-router-dom';

import FaixaEmergencia from './FaixaEmergencia';
import Header from './Header';
import Footer from './Footer';

/**
 * Layout base do site: faixa de emergência e Header no topo, conteúdo da rota no meio e Footer embaixo.
 * O <Outlet /> é onde o React Router desenha a página da rota atual,
 * assim o Header e o Footer não precisam ser repetidos em cada página.
 */
export default function Layout() {
  return (
    <>
      <FaixaEmergencia />
      <Header />
      <main className="min-h-screen">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
