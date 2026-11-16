import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiPlus, FiMinus, FiMessageCircle } from 'react-icons/fi';


const faqData = [
  {
    pergunta: "O que é o Acolhe+?",
    resposta: "O Acolhe+ é uma plataforma digital da categoria CitizenTech que orienta o cidadão sobre onde buscar atendimento na rede pública de saúde. Nos casos de baixa gravidade, a plataforma permite agendar uma consulta na UBS utilizando vagas que seriam perdidas por falta de outros pacientes."
  },
  {
    pergunta: "A plataforma faz diagnósticos médicos?",
    resposta: "Não. A plataforma não faz diagnósticos nem substitui a classificação de risco realizada por profissionais de saúde nas UPAs. O seu papel é apenas orientar o cidadão para o serviço correto (SAMU, UPA ou UBS) com base num questionário lógico inspirado no Sistema Manchester."
  },
  {
    pergunta: "O que acontece em casos de emergência grave?",
    resposta: "Sinais que indicam risco imediato (como dificuldade em respirar ou alteração de consciência) interrompem o questionário instantaneamente. A plataforma apresenta um roteiro direto para ligar ao SAMU 192 ou procurar o pronto-socorro, garantindo atendimento imediato."
  },
  {
    pergunta: "Como funciona o reaproveitamento de vagas?",
    resposta: "A plataforma estima o risco de falta de cada paciente agendado e pede a confirmação antecipada da consulta. Se a consulta não for confirmada no prazo estipulado, o horário é libertado e oferecido às pessoas de baixa gravidade que estão na 'lista do dia' aguardando atendimento."
  },
  {
    pergunta: "E se eu não tiver acesso à internet ou telemóvel?",
    resposta: "O sistema foi pensado para todos. Quem não possui acesso digital pode ser orientado, agendado e avisado das vagas diretamente pela receção da UBS. Além disso, as consultas de pacientes sem canal de contacto não são canceladas automaticamente para proteger quem tem menor acesso."
  },
  {
    pergunta: "Os meus dados clínicos estão seguros?",
    resposta: "Sim. Em total respeito pela Lei Geral de Proteção de Dados (LGPD), o Acolhe+ apenas utiliza os dados de contacto, de agenda e as respostas da triagem. A plataforma não tem, nem necessita de ter, acesso ao prontuário clínico (histórico médico detalhado) do paciente."
  }
];

export default function Faq() {

  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (

    <div className="min-h-screen bg-fundo font-sans text-texto animate-fade-in pb-24">
      

      <section className="bg-white pt-40 pb-20 px-6 lg:px-16 xl:px-24 border-b border-borda">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <span className="text-sm font-bold text-primaria tracking-widest uppercase">
            Suporte e Dúvidas
          </span>
          <h1 className="text-5xl lg:text-7xl font-serif text-primariaEscura leading-tight font-medium">
            Perguntas Frequentes.
          </h1>
          <p className="text-lg text-textoSuave max-w-2xl mx-auto leading-relaxed">
            Tudo o que precisa de saber sobre a triagem inteligente, a segurança dos seus dados e o funcionamento do agendamento nas UBS.
          </p>
        </div>
      </section>


      <section className="py-20 px-6 lg:px-16 xl:px-24 max-w-4xl mx-auto">
        <div className="space-y-4">
          {faqData.map((faq, index) => {
            const isOpen = openIndex === index;
            
            return (
              <div 
                key={index} 
                className="border-b border-borda overflow-hidden transition-all duration-300"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full flex items-center justify-between py-6 text-left focus:outline-none group"
                >
                  <h3 className={`text-2xl font-serif pr-8 transition-colors ${isOpen ? 'text-primaria' : 'text-primariaEscura group-hover:text-primaria'}`}>
                    {faq.pergunta}
                  </h3>
                  <span className="text-primaria shrink-0 ml-4">
                    {isOpen ? (
                      <FiMinus className="w-6 h-6" />
                    ) : (
                      <FiPlus className="w-6 h-6" />
                    )}
                  </span>
                </button>
                
    
                <div 
                  className={`grid transition-all duration-300 ease-in-out ${
                    isOpen ? 'grid-rows-[1fr] opacity-100 pb-8' : 'grid-rows-[0fr] opacity-0'
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="text-lg text-textoSuave leading-relaxed pr-12">
                      {faq.resposta}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

  
      <section className="px-6 pb-12 pt-8">
        <div className="max-w-4xl mx-auto bg-mentaSuave rounded-3xl p-10 sm:p-16 text-center space-y-6">
          <div className="w-16 h-16 bg-white text-primaria rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
            <FiMessageCircle className="w-8 h-8" />
          </div>
          <h2 className="text-3xl font-serif text-primariaEscura">Ainda tem alguma dúvida?</h2>
          <p className="text-textoSuave text-lg max-w-xl mx-auto">
            A nossa equipe está disponível para ajudar a entender melhor o funcionamento do CitizenTech e a integração com o SUS.
          </p>
          <div className="pt-6">
            <Link 
              to="/contato" 
              className="inline-block bg-primaria text-white px-10 py-4 rounded-full font-medium hover:bg-primariaEscura transition-colors shadow-lg"
            >
              Falar com a equipe
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}