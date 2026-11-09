import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Importação dos componentes genéricos que mantiveste
import Header from './components/Header';
import Footer from './components/Footer';


import Home from './pages/Home';
import Sobre from './pages/Sobre';
import Faq from './pages/Faq';
import Contato from './pages/Contato';
import Integrantes from './pages/Integrantes';
import Simulador from './pages/Simulador';
import Solucao from './pages/Solucao';

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <main className="min-h-screen">
        <Routes>
          {/* Páginas Institucionais Obrigatórias */}
          <Route path="/" element={<Home />} />
          <Route path="/sobre" element={<Sobre />} />
          <Route path="/faq" element={<Faq />} />
          <Route path="/contato" element={<Contato />} />
          <Route path="/integrantes" element={<Integrantes />} />

          {/* Páginas Adicionais da Solução CitizenTech */}
          <Route path="/simulador" element={<Simulador />} />
          
          {/* Rota com parâmetro (dinâmica) exigida pelo edital */}
          <Route path="/solucao/:id" element={<Solucao />} />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  );
}