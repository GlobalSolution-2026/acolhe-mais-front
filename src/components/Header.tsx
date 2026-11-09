import { Link } from 'react-router-dom';
import Botao from './Botao';

export default function Header() {
  return (
    <header className="absolute top-0 left-0 right-0 z-50 bg-transparent py-5 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex justify-between items-center bg-white/90 backdrop-blur-md border border-stone-200 px-6 py-3 rounded-full shadow-sm">
        
        {/* Logotipo */}
        <Link to="/" className="text-2xl font-serif font-bold text-[#004d3a] tracking-wide">
          Acolhe<span className="text-[#148565]">+</span>
        </Link>

        {/* Navegação Centralizada */}
        <nav className="hidden md:flex items-center gap-8 text-sm text-stone-600 font-medium">
          <Link to="/" className="hover:text-[#148565] transition-colors">Home</Link>
          <Link to="/sobre" className="hover:text-[#148565] transition-colors">Sobre</Link>
          <Link to="/solucao/1" className="hover:text-[#148565] transition-colors">Solução</Link>
          <Link to="/simulador" className="hover:text-[#148565] transition-colors">Simulador</Link>
          <Link to="/faq" className="hover:text-[#148565] transition-colors">FAQ</Link>
          <Link to="/contato" className="hover:text-[#148565] transition-colors">Contato</Link>
          <Link to="/integrantes" className="hover:text-[#148565] transition-colors">Integrantes</Link>
        </nav>

        {/* Botão à Direita */}
        <div className="flex items-center gap-3">
          <Link to="/simulador">
            <Botao variante="primario" className="bg-[#004d3a] text-white hover:bg-[#003829] font-semibold px-5 py-2.5 rounded-full text-sm shadow-sm transition-all border-none">
              Aceder Plataforma
            </Botao>
          </Link>
        </div>

      </div>
    </header>
  );
}