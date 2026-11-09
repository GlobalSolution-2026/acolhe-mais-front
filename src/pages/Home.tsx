import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiMapPin, FiHeart, FiClock, FiArrowRight, FiInfo, FiTarget, FiStar } from 'react-icons/fi';

const queixasAtendidas = [
  "síndrome gripal",
  "dor de garganta",
  "diarreia e vômito",
  "dor de cabeça",
  "ardência ao urinar"
];

export default function Home() {
  const [indexQueixa, setIndexQueixa] = useState(0);

  // Efeito para rodar o texto da roleta a cada 2.5 segundos
  useEffect(() => {
    const intervalo = setInterval(() => {
      setIndexQueixa((atual) => (atual + 1) % queixasAtendidas.length);
    }, 2500);
    return () => clearInterval(intervalo);
  }, []);

  return (
    <div className="min-h-screen bg-[#f7f6f2] font-sans text-stone-800 animate-fade-in">
      
      {/* 1. HERO SECTION - Chamativo em Verde Escuro com Roleta */}
      <section className="relative min-h-[90vh] flex flex-col justify-center bg-[#024131] overflow-hidden pt-24 pb-16">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=2000&auto=format&fit=crop" 
            alt="Fundo" 
            className="w-full h-full object-cover opacity-20 mix-blend-luminosity"
          />
          <div className="absolute inset-0 bg-linear-to-r from-[#024131] via-[#024131]/90 to-[#024131]/40"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-16 w-full">
          <div className="max-w-3xl space-y-8">
            
            <h1 className="text-5xl lg:text-6xl xl:text-7xl text-white font-serif leading-[1.1]">
              Procure atendimento <span className="italic font-light text-emerald-100">hoje mesmo</span> para
              <div className="relative inline-block h-[1.2em] w-full overflow-hidden align-bottom text-[#00d186] mt-2">
                {queixasAtendidas.map((queixa, i) => {
                  let positionClass = "opacity-0 translate-y-full";
                  if (i === indexQueixa) positionClass = "opacity-100 translate-y-0";
                  else if (i === (indexQueixa - 1 + queixasAtendidas.length) % queixasAtendidas.length) positionClass = "opacity-0 -translate-y-full";
                  return (
                    <span key={i} className={`absolute left-0 right-0 w-full transition-all duration-700 ease-in-out ${positionClass}`}>
                      {queixa}.
                    </span>
                  );
                })}
              </div>
            </h1>

            <p className="text-lg text-emerald-50/80 max-w-xl leading-relaxed font-light">
              Agende a sua consulta diretamente na Unidade Básica de Saúde nas vagas que seriam perdidas por faltas na rede municipal.
            </p>
            
            <div className="flex flex-wrap gap-4 pt-4">
              <Link to="/simulador" className="bg-[#00d186] text-[#024131] px-8 py-4 rounded-full font-bold hover:bg-white transition-colors shadow-lg flex items-center gap-2">
                Fazer triagem online <FiArrowRight />
              </Link>
              <Link to="/solucao/1" className="border border-white/30 text-white px-8 py-4 rounded-full font-medium hover:bg-white/10 hover:border-white transition-colors">
                Conheça a nossa solução
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. RESUMO DO PROJETO (Descrição, Objetivo, Diferencial) */}
      <section className="py-20 px-6 lg:px-16 bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
           {/* Card Descrição */}
           <div className="group">
              <div className="w-14 h-14 bg-[#e6f2ed] text-[#148565] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                 <FiInfo className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-serif text-[#024131] mb-4">O que é a plataforma?</h3>
              <p className="text-stone-600 leading-relaxed text-sm">
                 Uma solução <em>CitizenTech</em> que orienta o cidadão sobre onde buscar atendimento e reaproveita vagas da UBS libertadas por cancelamentos.
              </p>
           </div>
           
           {/* Card Objetivo */}
           <div className="group">
              <div className="w-14 h-14 bg-[#e6f2ed] text-[#148565] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                 <FiTarget className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-serif text-[#024131] mb-4">O nosso objetivo</h3>
              <p className="text-stone-600 leading-relaxed text-sm">
                 Reduzir a incerteza do paciente, diminuir a sobrecarga de casos pouco urgentes nas UPAs e combater o absenteísmo na Atenção Primária.
              </p>
           </div>
           
           {/* Card Diferencial */}
           <div className="group">
              <div className="w-14 h-14 bg-[#e6f2ed] text-[#148565] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                 <FiStar className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-serif text-[#024131] mb-4">O grande diferencial</h3>
              <p className="text-stone-600 leading-relaxed text-sm">
                 Ao contrário de outras aplicações, unimos a triagem clínica à disponibilidade real de vagas na rede, prevendo também o risco de faltas.
              </p>
           </div>
        </div>
      </section>

      {/* 3. COMO FUNCIONA (Apenas 3 Passos Rápidos) */}
      <section className="py-24 px-6 lg:px-16 bg-[#f7f6f2]">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl lg:text-5xl font-serif text-[#024131] mb-4">Como o Acolhe+ funciona</h2>
          <p className="text-lg text-stone-600">Três passos simples para encontrar o cuidado certo sem complicações.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center max-w-5xl mx-auto">
           <div className="flex flex-col items-center group">
             <div className="w-24 h-24 mb-6 flex items-center justify-center bg-white shadow-sm rounded-full text-[#024131] group-hover:bg-[#00d186] transition-colors duration-300">
                <FiMapPin className="w-8 h-8" />
             </div>
             <h3 className="text-2xl font-serif text-[#024131] mb-3">1. Informe o CEP</h3>
             <p className="text-stone-600 leading-relaxed text-sm">Localize a sua região e indique a queixa principal.</p>
           </div>
           
           <div className="flex flex-col items-center group">
             <div className="w-24 h-24 mb-6 flex items-center justify-center bg-white shadow-sm rounded-full text-[#024131] group-hover:bg-[#00d186] transition-colors duration-300">
                <FiHeart className="w-8 h-8" />
             </div>
             <h3 className="text-2xl font-serif text-[#024131] mb-3">2. Triagem rápida</h3>
             <p className="text-stone-600 leading-relaxed text-sm">Responda a perguntas curtas que avaliam sinais de alerta com segurança.</p>
           </div>

           <div className="flex flex-col items-center group">
             <div className="w-24 h-24 mb-6 flex items-center justify-center bg-white shadow-sm rounded-full text-[#024131] group-hover:bg-[#00d186] transition-colors duration-300">
                <FiClock className="w-8 h-8" />
             </div>
             <h3 className="text-2xl font-serif text-[#024131] mb-3">3. Receba a vaga</h3>
             <p className="text-stone-600 leading-relaxed text-sm">Saiba se deve procurar a urgência ou agende direto nas vagas ociosas da UBS.</p>
           </div>
        </div>
      </section>

    </div>
  );
}