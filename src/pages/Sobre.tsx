import { FiBookOpen, FiTarget, FiActivity, FiMapPin, FiLayers } from 'react-icons/fi';

export default function Sobre() {
  return (

    <div className="min-h-screen bg-fundo font-sans text-texto animate-fade-in pb-24">
      

      <section className="bg-primaria pt-40 pb-24 px-6 lg:px-16 xl:px-24">
        <div className="max-w-4xl mx-auto text-center space-y-6">

          <span className="text-sm font-bold text-menta tracking-widest uppercase">
            Sobre o Projeto
          </span>
          <h1 className="text-5xl lg:text-7xl font-serif text-white leading-tight font-medium">
            Entendendo o sistema. <br className="hidden md:block"/>
            <span className="text-menta italic">Transformando o acesso.</span>
          </h1>
        </div>
      </section>


      <section className="py-24 px-6 lg:px-16 xl:px-24 max-w-7xl mx-auto">
        <div className="mb-16 max-w-3xl">
  
          <h2 className="text-4xl lg:text-5xl font-serif text-primariaEscura mb-6">A rede de saúde e o seu papel.</h2>
          <p className="text-lg text-textoSuave leading-relaxed">
            O Sistema Único de Saúde (SUS) está organizado numa rede hierarquizada. O cidadão é encaminhado ao local certo conforme a complexidade do seu caso, garantindo um atendimento universal e integral.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="bg-white border border-borda p-8 rounded-2xl">
            <FiActivity className="w-8 h-8 text-primaria mb-6" />
            <h3 className="text-xl font-bold text-texto mb-3">O SUS</h3>
            <p className="text-textoSuave leading-relaxed text-sm">
              Criado para garantir a saúde como direito de todos, organiza-se por níveis de assistência (do posto de saúde ao hospital de alta complexidade).
            </p>
          </div>
          <div className="bg-white border border-borda p-8 rounded-2xl">
            <FiMapPin className="w-8 h-8 text-primaria mb-6" />
            <h3 className="text-xl font-bold text-texto mb-3">APS e UBS</h3>
            <p className="text-textoSuave leading-relaxed text-sm">
              A Atenção Primária à Saúde (APS) nas Unidades Básicas de Saúde (UBS) é a porta de entrada, resolvendo a maioria dos problemas de saúde perto de casa.
            </p>
          </div>
          <div className="bg-white border border-borda p-8 rounded-2xl">
            <FiTarget className="w-8 h-8 text-primaria mb-6" />
            <h3 className="text-xl font-bold text-texto mb-3">A ESF</h3>
            <p className="text-textoSuave leading-relaxed text-sm">
              A Estratégia Saúde da Família (ESF) acompanha um território específico. Porém, milhões de pessoas nos grandes centros ainda não têm uma equipa de referência.
            </p>
          </div>
          <div className="bg-white border border-borda p-8 rounded-2xl">
            <FiLayers className="w-8 h-8 text-primaria mb-6" />
            <h3 className="text-xl font-bold text-texto mb-3">A UPA</h3>
            <p className="text-textoSuave leading-relaxed text-sm">
              Unidades de Pronto Atendimento focam-se em estabilizar casos de urgência intermediária. Sofrem de superlotação devido à procura indevida de casos pouco urgentes.
            </p>
          </div>
        </div>
      </section>

  
      <section className="bg-mentaSuave py-24 px-6 lg:px-16 xl:px-24">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
          <div className="lg:w-1/2">
            <h2 className="text-4xl lg:text-5xl font-serif text-primariaEscura mb-6 leading-tight">
              O cenário real na cidade de São Paulo.
            </h2>
            <p className="text-lg text-texto leading-relaxed">
              O município enfrenta o desafio de expandir a cobertura e otimizar os recursos disponíveis para acolher uma das maiores populações do país.
            </p>
          </div>
          <div className="lg:w-1/2 w-full grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-borda">
              <span className="text-4xl font-serif font-bold text-primaria block mb-2">47,9%</span>
              <span className="text-textoSuave text-sm">Cobertura da Estratégia Saúde da Família (ESF) na capital em 2023.</span>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-borda">
              <span className="text-4xl font-serif font-bold text-primaria block mb-2">483</span>
              <span className="text-textoSuave text-sm">Unidades Básicas de Saúde (UBS) ativas reportadas em Julho de 2026.</span>
            </div>
            <div className="bg-primaria p-8 rounded-2xl shadow-sm sm:col-span-2">
              <span className="text-3xl font-serif font-bold text-white block mb-2">Meta de 2/3</span>
              <span className="text-mentaSuave text-sm">Objetivo de cobertura populacional da ESF estipulado pela prefeitura até 2028.</span>
            </div>
          </div>
        </div>
      </section>


      <section className="py-24 px-6 lg:px-16 xl:px-24 max-w-7xl mx-auto bg-white rounded-3xl my-12">
        <div className="mb-16">
          <h2 className="text-4xl lg:text-5xl font-serif text-primariaEscura mb-6">Mercado e Alternativas</h2>
          <p className="text-lg text-textoSuave max-w-3xl">
            Analisámos os sistemas existentes. Nenhuma das soluções atuais liga, num único fluxo, a orientação clínica à disponibilidade real de vagas na rede municipal.
          </p>
        </div>


        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          
          <div className="bg-white border border-borda p-8 rounded-3xl flex flex-col justify-between shadow-sm">
            <div>
              <span className="text-xs font-bold text-textoSuave uppercase tracking-wider block mb-3">Sistemas Públicos (Ex: Agenda Fácil, Meu SUS Digital)</span>
              <h3 className="text-xl font-serif text-texto mb-3">Focam-se apenas no agendamento</h3>
              <p className="text-textoSuave text-sm leading-relaxed">
                Permitem marcar consultas, mas não realizam triagem de sintomas nem orientam o cidadão sobre qual serviço procurar, gerando idas desnecessárias à UPA.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-borda text-xs font-semibold text-gravidade-vermelho">
              ✕ Falta orientação clínica
            </div>
          </div>

          <div className="bg-white border border-borda p-8 rounded-3xl flex flex-col justify-between shadow-sm">
            <div>
              <span className="text-xs font-bold text-textoSuave uppercase tracking-wider block mb-3">Apps de Saúde (Ex: Ada Health)</span>
              <h3 className="text-xl font-serif text-texto mb-3">Focam-se apenas na triagem</h3>
              <p className="text-textoSuave text-sm leading-relaxed">
                Oferecem avaliações de sintomas baseadas em inteligência artificial, mas funcionam de forma isolada e não têm qualquer ligação com a agenda de vagas do SUS.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-borda text-xs font-semibold text-gravidade-vermelho">
              ✕ Sem integração com o SUS
            </div>
          </div>

          
          <div className="bg-primaria text-white p-8 rounded-3xl flex flex-col justify-between shadow-xl relative overflow-hidden">
            <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-menta/10 rounded-full blur-2xl"></div>
            <div>
              <span className="text-xs font-bold text-menta uppercase tracking-wider block mb-3">A Nossa Solução</span>
              <h3 className="text-2xl font-serif text-white mb-3">Acolhe+ </h3>
              <p className="text-mentaSuave text-sm leading-relaxed font-light">
                Une a triagem inteligente de sintomas diretamente às vagas ociosas da APS, prevendo faltas com IA e reduzindo o absenteísmo e a superlotação.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-white/10 text-xs font-semibold text-menta">
              ✓ Triagem + Agendamento + IA
            </div>
          </div>

        </div>
        
        <div className="bg-fundo p-6 rounded-2xl border border-borda text-sm text-textoSuave leading-relaxed">
          <strong className="text-texto block mb-2">Conclusão de mercado:</strong>
          Enquanto as alternativas dividem os processos em etapas separadas ou focam-se exclusivamente no setor privado (como a <em>Doctoralia</em>), o <strong>Acolhe+</strong> integra toda a jornada do cidadão com a realidade da rede pública municipal.
        </div>
      </section>

   
      <section className="py-24 px-6 lg:px-16 xl:px-24 bg-primaria text-white">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-16">
          <div className="lg:w-1/2 space-y-6">
            <h2 className="text-3xl lg:text-4xl font-serif text-menta">Inovação Incremental</h2>
            <p className="text-lg text-mentaSuave/90 leading-relaxed font-light">
              O Acolhe+ classifica-se como uma <strong>inovação incremental</strong>. Não viemos substituir a UBS, a UPA ou os robustos sistemas da prefeitura (como o Agenda Fácil).
            </p>
            <p className="text-lg text-mentaSuave/90 leading-relaxed font-light">
              A nossa plataforma atua otimizando processos que a rede já executa, ligando a orientação do cidadão diretamente à vaga ociosa, oferecendo menor risco de investimento público e fácil adoção.
            </p>
          </div>
          
          <div className="lg:w-1/2 border-t lg:border-t-0 lg:border-l border-white/20 pt-10 lg:pt-0 lg:pl-16">
            <div className="flex items-center gap-3 mb-6">
              <FiBookOpen className="w-6 h-6 text-menta" />
              <h3 className="text-2xl font-serif text-white">Referências Base</h3>
            </div>
            <ul className="space-y-4 text-sm text-mentaSuave/70 font-light leading-relaxed">
              <li>ANZILIERO, F. et al. <em>Sistema Manchester em emergência...</em> (2016).</li>
              <li>BRASIL. Ministério da Saúde. <em>PNAB e ESF</em> (2017).</li>
              <li>MORAIS, R. M. et al. <em>Gestão do absenteísmo na APS...</em> (2023).</li>
              <li>SÃO PAULO. <em>Programa de Metas 2025-2028 e Censo UBS</em>.</li>
            </ul>
        
          </div>
        </div>
      </section>

    </div>
  );
}