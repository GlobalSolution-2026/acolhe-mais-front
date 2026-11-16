import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-primaria py-16 px-6 border-t border-white/5">
      <div className="max-w-7xl mx-auto flex flex-col items-center">
        

        <Link to="/" className="text-3xl font-serif font-bold text-white tracking-wide mb-8 hover:opacity-90 transition-opacity">
          Acolhe<span className="text-menta">+</span>
        </Link>


        <nav className="flex flex-wrap justify-center gap-x-8 gap-y-4 text-sm font-medium text-mentaSuave/70 mb-12">
          <Link to="/sobre" className="hover:text-menta transition-colors">Sobre</Link>
          <Link to="/solucao" className="hover:text-menta transition-colors">Solução</Link>
          <Link to="/simulador" className="hover:text-menta transition-colors">Simulador</Link>
          <Link to="/faq" className="hover:text-menta transition-colors">FAQ</Link>
          <Link to="/contato" className="hover:text-menta transition-colors">Contato</Link>
          <Link to="/integrantes" className="hover:text-menta transition-colors">Integrantes</Link>
        </nav>


        <div className="w-full max-w-4xl border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-mentaSuave/50 font-light">
          <p>© {new Date().getFullYear()} Acolhe+ CitizenTech. Todos os direitos reservados.</p>
          <p>Global Solution 2026/2 — FIAP</p>
        </div>
        
      </div>
    </footer>
  );
}