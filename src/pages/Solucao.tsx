import { Link } from 'react-router-dom';
import fotoFamilia from '../assets/foto-familia.jpg';



export default function Solucao() {
  return (
    <div className="min-h-screen bg-[#f7f6f2] font-sans text-stone-800 animate-fade-in">
      
      {/* 1. HERO SECTION (Clara e Limpa - Diferenciando da Home) */}
      <section className="relative pt-40 pb-20 lg:pt-48 lg:pb-32 bg-[#f7f6f2] overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-16 w-full flex flex-col items-center text-center relative z-10">
          <span className="text-sm font-bold text-[#148565] tracking-widest uppercase mb-6 block bg-[#e6f2ed] px-4 py-1.5 rounded-full">
            A Nossa Arquitetura
          </span>
          
          <h1 className="text-5xl md:text-6xl lg:text-7xl text-[#024131] font-serif max-w-4xl leading-[1.1] mb-6">
            O ecossistema de saúde pública <span className="italic font-light text-[#148565]">integrado</span>
          </h1>
          
          <p className="text-lg text-stone-600 max-w-2xl mb-10 leading-relaxed font-light">
            Atendimento direcionado e gestão inteligente de vagas ociosas para todos os cidadãos, reduzindo as filas e a incerteza no SUS.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/simulador" className="bg-[#024131] text-white px-8 py-3.5 rounded-full font-bold hover:bg-[#00d186] hover:text-[#024131] transition-colors shadow-lg">
              Explorar a triagem
            </Link>
            <Link to="/sobre" className="border border-stone-300 text-stone-600 px-8 py-3.5 rounded-full font-medium hover:bg-white hover:border-stone-400 transition-colors">
              Conhecer o contexto
            </Link>
          </div>
        </div>
      </section>

      {/* 2. ABORDAGEM COMPROVADA (Sem as bolinhas redondas) */}
      <section className="bg-[#024131] pt-24 pb-24 px-6 lg:px-16 border-t border-[#00d186]/20">
        <div className="text-center max-w-4xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-serif text-white leading-tight">
            Uma abordagem tecnológica<br />
            <span className="italic font-light text-emerald-100">e comprovada</span>
          </h2>
          <p className="text-emerald-50/70 mt-4 text-lg">Com a confiança de diretrizes clínicas para otimizar os resultados.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {/* Card 1 */}
          <div className="bg-[#013527] border border-[#00d186]/20 p-8 rounded-3xl flex flex-col justify-between shadow-lg hover:border-[#00d186]/50 transition-all">
            <div>
              <h3 className="text-xl font-bold text-white mb-3 leading-tight">Triagem<br/>Baseada em Dados</h3>
              <p className="text-stone-300 text-sm leading-relaxed">Direciona urgências e emergências instantaneamente.</p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-[#013527] border border-[#00d186]/20 p-8 rounded-3xl flex flex-col justify-between shadow-lg hover:border-[#00d186]/50 transition-all">
            <div>
              <h3 className="text-xl font-bold text-white mb-3 leading-tight">Agendamento<br/>Inteligente (UBS)</h3>
              <p className="text-stone-300 text-sm leading-relaxed">Integração com vagas que seriam perdidas.</p>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-[#013527] border border-[#00d186]/20 p-8 rounded-3xl flex flex-col justify-between shadow-lg hover:border-[#00d186]/50 transition-all">
            <div>
              <h3 className="text-xl font-bold text-white mb-3 leading-tight">Previsão de<br/>Faltas com IA</h3>
              <p className="text-stone-300 text-sm leading-relaxed">Modelos de machine learning estimam o risco de ausência.</p>
            </div>
          </div>

          {/* Card 4 */}
          <div className="bg-[#013527] border border-[#00d186]/20 p-8 rounded-3xl flex flex-col justify-between shadow-lg hover:border-[#00d186]/50 transition-all">
            <div>
              <h3 className="text-xl font-bold text-white mb-3 leading-tight">Fila de Espera<br/>Dinâmica</h3>
              <p className="text-stone-300 text-sm leading-relaxed">Oferta imediata de vagas libertadas à lista do dia.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. BENTO GRID (Fundo Claro) */}
      <section className="bg-[#f7f6f2] py-24 px-6 lg:px-16">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-12 items-end mb-16">
          <h2 className="text-4xl md:text-5xl font-serif text-[#024131] md:w-3/5 leading-tight">
            Atendimento no nível certo da rede de saúde <span className="italic font-light text-[#148565]">tudo num só fluxo.</span>
          </h2>
          <p className="text-stone-600 md:w-2/5 leading-relaxed">
            Conheça a plataforma que combina precisão na triagem, facilidade administrativa para a UBS e tecnologia inovadora.
          </p>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1 md:row-span-2 relative rounded-3xl overflow-hidden aspect-square md:aspect-auto">
            <img src={fotoFamilia} className="absolute inset-0 w-full h-full object-cover" alt="Família" />
            
            <div className="absolute inset-0 bg-black/40"></div>
            <div className="absolute top-8 left-8 right-8">
              <h3 className="text-white text-xl md:text-2xl font-serif leading-snug">
                Foco no cidadão sem cobertura da Estratégia Saúde da Família.
              </h3>
            </div>
          </div>

          {/* Bloco Verde Menta */}
          <div className="bg-[#00d186] rounded-3xl p-8 flex flex-col justify-between text-[#024131] aspect-square md:aspect-auto h-64 md:h-auto">
            <h3 className="text-2xl font-serif">Alinhamento Global</h3>
            <div className="space-y-2 mt-4">
              <div className="bg-white/40 backdrop-blur-sm px-4 py-3 rounded-xl font-medium text-sm flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-[#024131]"></span> CitizenTech
              </div>
              <div className="bg-white/40 backdrop-blur-sm px-4 py-3 rounded-xl font-medium text-sm flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-[#024131]"></span> ODS 3: Saúde e Bem-Estar
              </div>
              <div className="bg-white/40 backdrop-blur-sm px-4 py-3 rounded-xl font-medium text-sm flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-[#024131]"></span> ODS 10: Redução de Desigualdades
              </div>
            </div>
          </div>

          {/* Bloco Azul/Verde Claro */}
          <div className="bg-[#b4ded4] rounded-3xl p-8 flex flex-col justify-between text-[#024131] aspect-square md:aspect-auto h-64 md:h-auto">
            <h3 className="text-2xl font-serif">Assistência nos níveis<br/>de complexidade</h3>
            <p className="mt-4 text-sm font-medium">SAMU 192, Pronto-Socorro, UPA e UBS.</p>
          </div>

          {/* Bloco Verde Escuro Inferior */}
          <div className="md:col-span-2 bg-[#024131] rounded-3xl p-8 md:p-12 text-white flex flex-col md:flex-row justify-between items-center overflow-hidden relative">
             <div className="relative z-10 md:w-2/3">
               <h3 className="text-2xl md:text-3xl font-serif mb-4 leading-snug">O seu parceiro de confiança para triagem de sintomas de baixa gravidade, 24 horas por dia.</h3>
             </div>
             <div className="absolute right-0 bottom-0 translate-x-1/4 translate-y-1/4 w-64 h-64 border-15 border-[#00d186]/20 rounded-full"></div>
          </div>
        </div>
      </section>

      {/* 4. SEPARADOR DE IMAGEM */}
      <div className="w-full h-100">
        <img src="https://images.unsplash.com/photo-1529390079861-591de354faf5?q=80&w=2000&auto=format&fit=crop" className="w-full h-full object-cover" alt="Saúde em comunidade" />
      </div>

      
      {/* 5. LISTA DE ATORES (Versão Estática Limpa) */}
      <section className="bg-[#024131] py-24 px-6 lg:px-16">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-16 items-center">
          
          <div className="lg:w-1/2 text-white">
            <h2 className="text-4xl md:text-5xl font-serif mb-6 leading-tight">
              Fazendo com que o sistema de saúde funcione <span className="italic font-light text-emerald-200">para todos nós.</span>
            </h2>
            <p className="text-emerald-50/70 mb-10 text-lg font-light leading-relaxed">
              Juntos, estamos a reformular a experiência no acesso à saúde pública, atendendo aos casos onde o cuidado realmente acontece.
            </p>
            
            <div className="space-y-4">
              <div className="border-b border-white/20 py-4">
                <span className="text-2xl font-serif text-[#00d186]">O Cidadão</span>
                <p className="text-sm text-emerald-50/70 mt-1">Orientação por sintomas e agendamento rápido de vagas.</p>
              </div>
              <div className="border-b border-white/20 py-4">
                <span className="text-2xl font-serif text-[#00d186]">A Receção da UBS</span>
                <p className="text-sm text-emerald-50/70 mt-1">Painel centralizado de confirmações e gestão da lista do dia.</p>
              </div>
              <div className="border-b border-white/20 py-4">
                <span className="text-2xl font-serif text-[#00d186]">A Secretaria de Saúde</span>
                <p className="text-sm text-emerald-50/70 mt-1">Redução da superlotação nas UPAs e melhor aproveitamento da APS.</p>
              </div>
            </div>

            <Link to="/simulador" className="inline-block mt-10 bg-[#00d186] text-[#024131] px-8 py-3.5 rounded-full font-bold text-sm hover:bg-white transition-colors shadow-lg">
              Experimentar Simulador
            </Link>
          </div>

          <div className="lg:w-1/2 w-full">
            <img src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=1000&auto=format&fit=crop" className="rounded-[40px] w-full object-cover aspect-4/5 shadow-2xl" alt="Profissional de saúde" />
          </div>

        </div>
      </section>

    </div>
  );
}