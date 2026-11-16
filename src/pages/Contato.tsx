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
  
  const { 
    register, 
    handleSubmit, 
    formState: { errors } 
  } = useForm<ContatoFormData>({
    mode: 'onChange' 
  });

  const onSubmit = (data: ContatoFormData) => {
    console.log("Formulário submetido com os dados:", data);
    
    setStatus('loading');
    
    setTimeout(() => {
      setStatus('success');
      setTimeout(() => setStatus('idle'), 5000);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-fundo font-sans text-texto animate-fade-in pb-24">
      
      <section className="pt-40 pb-16 px-6 lg:px-16 xl:px-24">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-end border-b border-borda pb-12">
          <div className="max-w-2xl space-y-4">
            <span className="text-sm font-bold text-primaria tracking-widest uppercase bg-mentaSuave px-4 py-1.5 rounded-full inline-block">
              Fale Conosco
            </span>
            <h1 className="text-5xl lg:text-7xl font-serif text-primaria leading-tight font-medium">
              Estamos aqui para<br /> ouvir e ajudar.
            </h1>
          </div>
          <div className="max-w-md mt-6 md:mt-0 text-textoSuave text-lg leading-relaxed">
            Seja para tirar dúvidas sobre a triagem, reportar um problema no agendamento ou falar com a secretaria, a nossa equipa está disponível.
          </div>
        </div>
      </section>

      <section className="py-12 px-6 lg:px-16 xl:px-24 max-w-7xl mx-auto flex flex-col lg:flex-row gap-16">
        
        <div className="lg:w-5/12 space-y-12">
          <div>
            <h2 className="text-3xl font-serif text-primaria mb-8">Informações de Contacto</h2>
            <div className="space-y-6">
              
              <div className="bg-white border border-borda rounded-xl p-6 flex items-start gap-4 shadow-[0_2px_10px_-2px_rgba(30,58,95,0.12)]">
                <div className="w-12 h-12 bg-mentaSuave text-primaria rounded-full flex items-center justify-center shrink-0">
                  <FiMapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-lg text-texto">Sede do Projeto (FIAP)</h4>
                  <p className="text-textoSuave mt-1 text-sm">Av. Paulista, 1106 - Bela Vista<br />São Paulo - SP, 01311-000</p>
                </div>
              </div>

              <div className="bg-white border border-borda rounded-xl p-6 flex items-start gap-4 shadow-[0_2px_10px_-2px_rgba(30,58,95,0.12)]">
                <div className="w-12 h-12 bg-mentaSuave text-primaria rounded-full flex items-center justify-center shrink-0">
                  <FiMail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-lg text-texto">E-mail</h4>
                  <p className="text-textoSuave mt-1 text-sm">contato@acolheplus.com.br</p>
                  <p className="text-textoSuave/70 text-xs mt-1">Resposta habitual em 24h úteis</p>
                </div>
              </div>

              <div className="bg-white border border-borda rounded-xl p-6 flex items-start gap-4 shadow-[0_2px_10px_-2px_rgba(30,58,95,0.12)]">
                <div className="w-12 h-12 bg-mentaSuave text-primaria rounded-full flex items-center justify-center shrink-0">
                  <FiPhone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-lg text-texto">Telefone e Suporte</h4>
                  <p className="text-textoSuave mt-1 text-sm">(11) 4000-0000</p>
                  <p className="text-textoSuave/70 text-xs mt-1">Segunda a Sexta, das 8h às 18h</p>
                </div>
              </div>

            </div>
          </div>
        </div>

        <div className="lg:w-7/12">
          <div className="bg-white border border-borda rounded-xl p-8 sm:p-12 shadow-[0_2px_10px_-2px_rgba(30,58,95,0.12)]">
            
            {status === 'success' ? (
              <div className="flex flex-col items-center justify-center py-16 text-center animate-fade-in">
                <FiCheckCircle className="w-20 h-20 text-gravidade-verde mb-6" />
                <h3 className="text-3xl font-serif text-primaria mb-3">Mensagem enviada!</h3>
                <p className="text-textoSuave text-lg max-w-sm">
                  Recebemos o seu contacto com sucesso. A nossa equipa irá responder-lhe em breve para o e-mail indicado.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                
                <p className="text-center text-textoSuave mb-8">Envie a sua mensagem para a nossa equipe.</p>

                <div className="space-y-1">
                  <label htmlFor="nome" className="block text-base font-bold text-texto">Nome Completo:</label>
                  <input 
                    type="text" 
                    id="nome" 
                    {...register("nome", { 
                      required: "O nome é obrigatório.",
                      minLength: { value: 3, message: "O nome deve conter pelo menos 3 caracteres." } 
                    })}
                    className={`w-full bg-white border rounded-xl px-4 py-3 text-texto focus:outline-none transition-all
                      ${errors.nome ? 'border-gravidade-vermelho focus:ring-1 focus:ring-[#d32f2f]' : 'border-borda focus:ring-1 focus:ring-[#1e3a5f] focus:border-primaria'}
                    `}
                  />
                  {errors.nome && (
                    <p className="text-gravidade-vermelho text-sm mt-1">{errors.nome.message}</p>
                  )}
                </div>

                <div className="space-y-1">
                  <label htmlFor="email" className="block text-base font-bold text-texto">E-mail:</label>
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
                    className={`w-full bg-white border rounded-xl px-4 py-3 text-texto focus:outline-none transition-all
                      ${errors.email ? 'border-gravidade-vermelho focus:ring-1 focus:ring-[#d32f2f]' : 'border-borda focus:ring-1 focus:ring-[#1e3a5f] focus:border-primaria'}
                    `}
                  />
                  {errors.email && (
                    <p className="text-gravidade-vermelho text-sm mt-1">{errors.email.message}</p>
                  )}
                </div>

                <div className="space-y-1">
                  <label htmlFor="mensagem" className="block text-base font-bold text-texto">Mensagem:</label>
                  <textarea 
                    id="mensagem" 
                    rows={4}
                    placeholder="Como podemos ajudar?"
                    {...register("mensagem", { 
                      required: "A mensagem é obrigatória.",
                      minLength: { value: 10, message: "A mensagem deve conter pelo menos 10 caracteres." }
                    })}
                    className={`w-full bg-white border rounded-xl px-4 py-3 text-texto focus:outline-none transition-all resize-none
                      ${errors.mensagem ? 'border-gravidade-vermelho focus:ring-1 focus:ring-[#d32f2f]' : 'border-borda focus:ring-1 focus:ring-[#1e3a5f] focus:border-primaria'}
                    `}
                  ></textarea>
                  {errors.mensagem && (
                    <p className="text-gravidade-vermelho text-sm mt-1">{errors.mensagem.message}</p>
                  )}
                </div>

                <div className="pt-2">
                  <button 
                    type="submit" 
                    disabled={status === 'loading'}
                    className={`w-full inline-flex items-center justify-center px-8 py-3.5 rounded-xl font-bold transition-all shadow-[0_2px_10px_-2px_rgba(30,58,95,0.12)]
                      ${status === 'loading' 
                        ? 'bg-textoSuave text-white cursor-not-allowed' 
                        : 'bg-primaria text-branco hover:bg-primariaEscura'
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