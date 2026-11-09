import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FiMail, FiMapPin, FiPhone, FiCheckCircle } from 'react-icons/fi';

type ContatoFormData = {
  nome: string;
  email: string;
  mensagem: string;
};

export default function Contato() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');
  
  // Utilização do react-hook-form com validação "onChange" para comportamento dinâmico
  const { 
    register, 
    handleSubmit, 
    formState: { errors } 
  } = useForm<ContatoFormData>({
    mode: 'onChange' 
  });

  const onSubmit = (data: ContatoFormData) => {
    // Adiciona o console.log para usar a variável 'data' e ver o que está a ser enviado
    console.log("Formulário submetido com os dados:", data);
    
    setStatus('loading');
    
    setTimeout(() => {
      setStatus('success');
      setTimeout(() => setStatus('idle'), 5000);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#f7f6f2] font-sans text-stone-800 animate-fade-in pb-24">
      
      {/* 1. HERO SECTION */}
      <section className="pt-40 pb-16 px-6 lg:px-16 xl:px-24">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-end border-b border-stone-200 pb-12">
          <div className="max-w-2xl space-y-4">
            <span className="text-sm font-bold text-[#00d186] tracking-widest uppercase">
              Fale Connosco
            </span>
            <h1 className="text-5xl lg:text-7xl font-serif text-[#024131] leading-tight font-medium">
              Estamos aqui para<br /> ouvir e ajudar.
            </h1>
          </div>
          <div className="max-w-md mt-6 md:mt-0 text-stone-600 text-lg leading-relaxed">
            Seja para tirar dúvidas sobre a triagem, reportar um problema no agendamento ou falar com a secretaria, a nossa equipa está disponível.
          </div>
        </div>
      </section>

      {/* 2. CONTEÚDO (Informações + Formulário) */}
      <section className="py-12 px-6 lg:px-16 xl:px-24 max-w-7xl mx-auto flex flex-col lg:flex-row gap-16">
        
        {/* Informações de Contacto */}
        <div className="lg:w-5/12 space-y-12">
          <div>
            <h2 className="text-3xl font-serif text-[#024131] mb-8">Informações de Contacto</h2>
            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-white shadow-sm border border-stone-100 text-[#00d186] rounded-xl flex items-center justify-center shrink-0">
                  <FiMapPin className="w-5 h-5 text-[#024131]" />
                </div>
                <div>
                  <h4 className="font-bold text-lg text-[#024131]">Sede do Projeto (FIAP)</h4>
                  <p className="text-stone-600 mt-1">Av. Paulista, 1106 - Bela Vista<br />São Paulo - SP, 01311-000</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-white shadow-sm border border-stone-100 text-[#00d186] rounded-xl flex items-center justify-center shrink-0">
                  <FiMail className="w-5 h-5 text-[#024131]" />
                </div>
                <div>
                  <h4 className="font-bold text-lg text-[#024131]">E-mail</h4>
                  <p className="text-stone-600 mt-1">contato@acolheplus.com.br</p>
                  <p className="text-stone-500 text-sm mt-1">Resposta habitual em 24h úteis</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-white shadow-sm border border-stone-100 text-[#00d186] rounded-xl flex items-center justify-center shrink-0">
                  <FiPhone className="w-5 h-5 text-[#024131]" />
                </div>
                <div>
                  <h4 className="font-bold text-lg text-[#024131]">Telefone e Suporte</h4>
                  <p className="text-stone-600 mt-1">(11) 4000-0000</p>
                  <p className="text-stone-500 text-sm mt-1">Segunda a Sexta, das 8h às 18h</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Formulário de Contacto */}
        <div className="lg:w-7/12">
          <div className="bg-white border border-stone-200 rounded-2xl p-8 sm:p-12 shadow-sm">
            
            {status === 'success' ? (
              <div className="flex flex-col items-center justify-center py-16 text-center animate-fade-in">
                <FiCheckCircle className="w-20 h-20 text-[#00d186] mb-6" />
                <h3 className="text-3xl font-serif text-[#024131] mb-3">Mensagem enviada!</h3>
                <p className="text-stone-600 text-lg max-w-sm">
                  Recebemos o seu contacto com sucesso. A nossa equipa irá responder-lhe em breve para o e-mail indicado.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                
                <p className="text-center text-stone-700 mb-8">Envie a sua mensagem para a nossa equipe.</p>

                {/* Nome Completo */}
                <div className="space-y-1">
                  <label htmlFor="nome" className="block text-base font-bold text-stone-900">Nome Completo:</label>
                  <input 
                    type="text" 
                    id="nome" 
                    {...register("nome", { 
                      required: "O nome é obrigatório.",
                      minLength: { value: 3, message: "O nome deve conter pelo menos 3 caracteres." } 
                    })}
                    className={`w-full bg-white border rounded-xl px-4 py-3 text-stone-800 focus:outline-none transition-all
                      ${errors.nome ? 'border-red-500 focus:ring-1 focus:ring-red-500' : 'border-stone-300 focus:ring-1 focus:ring-[#024131] focus:border-[#024131]'}
                    `}
                  />
                  {errors.nome && (
                    <p className="text-red-500 text-sm mt-1">{errors.nome.message}</p>
                  )}
                </div>

                {/* E-mail */}
                <div className="space-y-1">
                  <label htmlFor="email" className="block text-base font-bold text-stone-900">E-mail:</label>
                  <input 
                    type="email" 
                    id="email"
                    {...register("email", { 
                      required: "O e-mail é obrigatório.",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Por favor, insira um endereço de e-mail válido."
                      }
                    })}
                    className={`w-full bg-white border rounded-xl px-4 py-3 text-stone-800 focus:outline-none transition-all
                      ${errors.email ? 'border-red-500 focus:ring-1 focus:ring-red-500' : 'border-stone-300 focus:ring-1 focus:ring-[#024131] focus:border-[#024131]'}
                    `}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                  )}
                </div>

                {/* Mensagem */}
                <div className="space-y-1">
                  <label htmlFor="mensagem" className="block text-base font-bold text-stone-900">Mensagem:</label>
                  <textarea 
                    id="mensagem" 
                    rows={4}
                    placeholder="Como podemos ajudar?"
                    {...register("mensagem", { 
                      required: "A mensagem é obrigatória.",
                      minLength: { value: 10, message: "A mensagem deve conter pelo menos 10 caracteres." }
                    })}
                    className={`w-full bg-white border rounded-xl px-4 py-3 text-stone-800 focus:outline-none transition-all resize-none
                      ${errors.mensagem ? 'border-red-500 focus:ring-1 focus:ring-red-500' : 'border-stone-300 focus:ring-1 focus:ring-[#024131] focus:border-[#024131]'}
                    `}
                  ></textarea>
                  {errors.mensagem && (
                    <p className="text-red-500 text-sm mt-1">{errors.mensagem.message}</p>
                  )}
                </div>

                {/* Botão alinhado à esquerda */}
                <div className="pt-2">
                  <button 
                    type="submit" 
                    disabled={status === 'loading'}
                    className={`inline-flex items-center justify-center px-8 py-3 rounded-lg font-bold text-white transition-all shadow-sm
                      ${status === 'loading' 
                        ? 'bg-stone-400 cursor-not-allowed' 
                        : 'bg-[#d95d14] hover:bg-[#bf5212]'
                      }
                    `}
                  >
                    {status === 'loading' ? 'A enviar...' : 'Enviar mensagem'}
                  </button>
                </div>

              </form>
            )}
          </div>
        </div>

      </section>
    </div>
  );
}