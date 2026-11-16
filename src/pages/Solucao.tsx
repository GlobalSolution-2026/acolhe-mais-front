import { Link } from 'react-router-dom';
import { FiUser, FiHome, FiArrowRight } from 'react-icons/fi';

export default function Solucao() {
  return (
    <div className="min-h-screen bg-fundo font-sans text-texto animate-fade-in">
      
  
      <section className="relative pt-40 pb-20 lg:pt-48 lg:pb-32 bg-fundo overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-16 w-full flex flex-col items-center text-center relative z-10">
          <span className="text-sm font-bold text-primaria tracking-widest uppercase mb-6 block bg-mentaSuave px-4 py-1.5 rounded-full">
            A Nossa Arquitetura
          </span>
          
         <h1 className="text-5xl md:text-6xl lg:text-7xl text-primaria max-w-4xl leading-[1.1] mb-6 font-serif">
            O ecossistema de saúde <br className="hidden sm:block" />
            pública <span className="italic font-light text-menta">integrado</span>
          </h1>
          
          <p className="text-lg text-textoSuave max-w-2xl mb-10 leading-relaxed font-light">
            Atendimento direcionado e gestão inteligente de vagas ociosas para todos os cidadãos, reduzindo as filas e a incerteza no SUS.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4">
            <Link 
              to="/simulador" 
              className="bg-primaria text-branco px-8 py-3.5 rounded-xl font-bold hover:bg-primariaEscura transition-colors shadow-[0_2px_10px_-2px_rgba(30,58,95,0.12)]"
            >
              Explorar a triagem
            </Link>
            <Link 
              to="/sobre" 
              className="border border-borda text-textoSuave px-8 py-3.5 rounded-xl font-medium hover:bg-branco hover:border-primaria transition-colors"
            >
              Conhecer o contexto
            </Link>
          </div>
        </div>
      </section>

    
      <section className="bg-primaria pt-24 pb-24 px-6 lg:px-16 border-t border-menta/20">
        <div className="text-center max-w-4xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl text-branco leading-tight font-serif">
            Uma abordagem tecnológica<br />
            <span className="italic font-light text-menta">e comprovada</span>
          </h2>
          <p className="text-mentaSuave/80 mt-4 text-lg">Com a confiança de diretrizes clínicas para otimizar os resultados.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          <div className="b>g-[#152a45] border border-menta/20 p-8 rounded-3xl flex flex-col justify-between shadow-[0_2px_10px_-2px_rgba(30,58,95,0.12)] hover:border-menta/50 transition-all">
            <div>
              <h3 className="text-xl font-serif text-branco mb-3 leading-tight">Triagem<br/>Baseada em Dados</h3>
              <p className="text-fundo/80 text-sm leading-relaxed">Direciona urgências e emergências instantaneamente.</p>
            </div>
          </div>

          <div className="bg-primariaEscura border border-menta/20 p-8 rounded-3xl flex flex-col justify-between shadow-[0_2px_10px_-2px_rgba(30,58,95,0.12)] hover:border-menta/50 transition-all">
            <div>
              <h3 className="text-xl font-serif text-branco mb-3 leading-tight">Agendamento<br/>Inteligente (UBS)</h3>
              <p className="text-fundo/80 text-sm leading-relaxed">Integração com vagas que seriam perdidas.</p>
            </div>
          </div>

          <div className="bg-primariaEscura border border-menta/20 p-8 rounded-3xl flex flex-col justify-between shadow-[0_2px_10px_-2px_rgba(30,58,95,0.12)] hover:border-menta/50 transition-all">
            <div>
              <h3 className="text-xl font-serif text-branco mb-3 leading-tight">Previsão de<br/>Faltas com IA</h3>
              <p className="text-fundo/80 text-sm leading-relaxed">Modelos de machine learning estimam o risco de ausência.</p>
            </div>
          </div>

          <div className="bg-primariaEscura border border-menta/20 p-8 rounded-3xl flex flex-col justify-between shadow-[0_2px_10px_-2px_rgba(30,58,95,0.12)] hover:border-menta/50 transition-all">
            <div>
              <h3 className="text-xl font-serif text-branco mb-3 leading-tight">Fila de Espera<br/>Dinâmica</h3>
              <p className="text-fundo/80 text-sm leading-relaxed">Oferta imediata de vagas libertadas à lista do dia.</p>
            </div>
          </div>
        </div>
      </section>

      

      <section className="bg-fundo pt-24 pb-12 px-6 lg:px-16">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Bloco do Cidadão */}
          <div className="bg-branco p-10 rounded-3xl border border-borda shadow-[0_2px_10px_-2px_rgba(30,58,95,0.12)] flex flex-col justify-between">
            <div>
              <div className="w-14 h-14 bg-mentaSuave text-primaria rounded-2xl flex items-center justify-center mb-6 text-2xl shadow-sm">
                <FiUser size={26} />
              </div>
              <h2 className="text-2xl font-serif text-primaria mb-2">Para o Cidadão</h2>
              <h3 className="text-sm font-bold text-textoSuave uppercase tracking-wider mb-6">Triagem e Acesso</h3>
              
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <p className="text-textoSuave text-sm"><strong className="text-texto">O Problema:</strong> Mais de 65% dos pacientes nas UPAs são casos de baixa gravidade (Azul/Verde) que deveriam estar na UBS.</p>
                </li>
                <li className="flex items-start gap-3">
                  <p className="text-textoSuave text-sm"><strong className="text-texto">A Solução:</strong> Orientação baseada em sintomas e agendamento direto nos horários disponíveis da Atenção Básica.</p>
                </li>
              </ul>
            </div>
          </div>

         
          <div className="bg-primaria p-10 rounded-3xl shadow-[0_30px_60px_-20px_rgba(21,42,69,0.45)] flex flex-col justify-between text-branco">
            <div>
              <div className="w-14 h-14 bg-primariaEscura text-menta rounded-2xl flex items-center justify-center mb-6 text-2xl shadow-sm border border-menta/20">
                <FiHome size={26} />
              </div>
              <h2 className="text-2xl font-serif text-branco mb-2">Para a UBS</h2>
              <h3 className="text-sm font-bold text-menta/80 uppercase tracking-wider mb-6">Gestão de Faltas</h3>
              
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <p className="text-fundo/90 text-sm"><strong className="text-branco">O Problema:</strong> Taxas de absenteísmo (faltas sem aviso) chegam a 30%, deixando médicos ociosos enquanto as filas crescem.</p>
                </li>
                <li className="flex items-start gap-3">
                  <p className="text-fundo/90 text-sm"><strong className="text-branco">A Solução:</strong> IA que calcula o risco de falta e um painel que redistribui vagas canceladas em tempo real para a "fila do dia".</p>
                </li>
              </ul>
            </div>
          </div>

        </div>
      </section>

     
      <section className="bg-fundo pb-24 px-6 lg:px-16">
        <div className="max-w-7xl mx-auto">
          <div className="bg-mentaSuave rounded-3xl p-10 md:p-14 flex flex-col md:flex-row items-center gap-12 border border-menta/40">
            
            <div className="md:w-1/2">
              <span className="text-primaria font-bold tracking-wider uppercase text-sm mb-2 block">
                Viabilidade Financeira
              </span>
              <h2 className="text-3xl font-serif text-primaria mb-4">
                O Retorno sobre o Investimento (ROI)
              </h2>
              <p className="text-textoSuave leading-relaxed">
                Otimizar a agenda não é apenas organização, é eficiência pública. A redução de faltas se traduz diretamente em milhares de novos atendimentos mensais sem aumentar o custo da máquina pública.
              </p>
            </div>

            <div className="md:w-1/2 w-full">
              <div className="bg-branco rounded-3xl p-8 shadow-[0_2px_10px_-2px_rgba(30,58,95,0.12)] border border-borda relative overflow-hidden">
                <div className="absolute top-0 right-0 w-2 h-full bg-menta"></div>
                
                <p className="text-textoSuave text-xs font-bold uppercase tracking-wider mb-1">Impacto Projetado (24 Meses)</p>
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-4xl md:text-5xl font-serif font-bold text-primaria">R$ 1.000.000</span>
                </div>
                
                <p className="text-textoSuave text-sm leading-relaxed mb-6">
                  Economia gerada pela redução de <strong className="text-texto">apenas 2% ao mês</strong> no absenteísmo da Atenção Primária.
                </p>
                
                <div className="pt-4 border-t border-borda flex justify-end">
                  <Link 
                    to="/simulador" 
                    className="bg-primaria text-branco px-6 py-2 rounded-xl text-sm font-bold hover:bg-primariaEscura transition-colors flex items-center gap-2"
                  >
                    Ir para o Simulador <FiArrowRight size={16} />
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}