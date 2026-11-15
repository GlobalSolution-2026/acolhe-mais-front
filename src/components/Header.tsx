import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiMenu, FiX } from 'react-icons/fi';

export default function Header() {
  const [menuAberto, setMenuAberto] = useState(false);

  const fecharMenu = () => setMenuAberto(false);

  return (
    <header className="absolute top-0 left-0 right-0 z-50 bg-transparent py-4 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex justify-between items-center bg-white/90 backdrop-blur-md border border-stone-200 px-4 sm:px-6 py-3 rounded-full shadow-sm gap-2">
        
        {/* Logotipo */}
        <Link to="/" onClick={fecharMenu} className="text-xl sm:text-2xl font-serif font-bold text-[#004d3a] tracking-wide shrink-0">
          Acolhe<span className="text-[#148565]">+</span>
        </Link>

        {/* Navegação Desktop */}
        <nav className="hidden lg:flex items-center gap-6 xl:gap-8 text-sm text-stone-600 font-medium">
          <Link to="/" className="hover:text-[#148565] transition-colors">Home</Link>
          <Link to="/sobre" className="hover:text-[#148565] transition-colors">Sobre</Link>
          <Link to="/solucao" className="hover:text-[#148565] transition-colors">Solução</Link>
          <Link to="/simulador" className="hover:text-[#148565] transition-colors">Simulador</Link>
          <Link to="/faq" className="hover:text-[#148565] transition-colors">FAQ</Link>
          <Link to="/contato" className="hover:text-[#148565] transition-colors">Contato</Link>
          <Link to="/integrantes" className="hover:text-[#148565] transition-colors">Integrantes</Link>
        </nav>

        {/* Botão do Menu Mobile */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Botão Hamburguer para Mobile / Tablet */}
          <button 
            onClick={() => setMenuAberto(!menuAberto)}
            aria-label="Abrir menu de navegação"
            className="lg:hidden p-2 text-[#004d3a] hover:bg-stone-100 rounded-full transition-colors focus:outline-none"
          >
            {menuAberto ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
          </button>
        </div>

      </div>

      {/* Menu Dropdown Mobile / Tablet */}
      {menuAberto && (
        <div className="lg:hidden absolute top-20 left-4 right-4 bg-white/95 backdrop-blur-lg border border-stone-200 rounded-3xl p-6 shadow-xl flex flex-col gap-4 text-center animate-fade-in z-50">
          <Link to="/" onClick={fecharMenu} className="text-stone-800 font-medium py-2 hover:text-[#148565] transition-colors border-b border-stone-100">Home</Link>
          <Link to="/sobre" onClick={fecharMenu} className="text-stone-800 font-medium py-2 hover:text-[#148565] transition-colors border-b border-stone-100">Sobre</Link>
          <Link to="/solucao" onClick={fecharMenu} className="text-stone-800 font-medium py-2 hover:text-[#148565] transition-colors border-b border-stone-100">Solução</Link>
          <Link to="/simulador" onClick={fecharMenu} className="text-stone-800 font-medium py-2 hover:text-[#148565] transition-colors border-b border-stone-100">Simulador</Link>
          <Link to="/faq" onClick={fecharMenu} className="text-stone-800 font-medium py-2 hover:text-[#148565] transition-colors border-b border-stone-100">FAQ</Link>
          <Link to="/contato" onClick={fecharMenu} className="text-stone-800 font-medium py-2 hover:text-[#148565] transition-colors border-b border-stone-100">Contato</Link>
          <Link to="/integrantes" onClick={fecharMenu} className="text-stone-800 font-medium py-2 hover:text-[#148565] transition-colors">Integrantes</Link>
        </div>
      )}
    </header>
  );
}