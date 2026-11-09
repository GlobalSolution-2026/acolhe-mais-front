import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-[#024131] py-16 px-6 border-t border-white/5">
      <div className="max-w-7xl mx-auto flex flex-col items-center">
        
        {/* Logo */}
        <Link to="/" className="text-3xl font-serif font-bold text-white tracking-wide mb-8 hover:opacity-90 transition-opacity">
          Acolhe<span className="text-[#00d186]">+</span>
        </Link>

        {/* Navegação */}
        <nav className="flex flex-wrap justify-center gap-x-8 gap-y-4 text-sm font-medium text-emerald-50/70 mb-12">
          <Link to="/sobre" className="hover:text-[#00d186] transition-colors">Sobre</Link>
          <Link to="/solucao" className="hover:text-[#00d186] transition-colors">Solução</Link>
          <Link to="/simulador" className="hover:text-[#00d186] transition-colors">Simulador</Link>
          <Link to="/faq" className="hover:text-[#00d186] transition-colors">FAQ</Link>
          <Link to="/contato" className="hover:text-[#00d186] transition-colors">Contato</Link>
          <Link to="/integrantes" className="hover:text-[#00d186] transition-colors">Integrantes</Link>
        </nav>

        {/* Linha separadora suave e Copyright */}
        <div className="w-full max-w-4xl border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-emerald-50/40 font-light">
          <p>© {new Date().getFullYear()} Acolhe+ CitizenTech. Todos os direitos reservados.</p>
          <p>Global Solution 2026/2 — FIAP</p>
        </div>
        
      </div>
    </footer>
  );
}