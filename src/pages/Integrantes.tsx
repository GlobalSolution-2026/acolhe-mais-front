import { useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import Reveal from '../components/Reveal'; 
import { FiCompass, FiTarget, FiHeart, FiX, FiGithub, FiLinkedin, FiExternalLink } from 'react-icons/fi';

interface Integrante {
  rm: string;
  nome: string;
  funcao: string;
  turma: string;
  foto: string;
  github: string;
  linkedin: string;
  contribuicao: string[];
}

const listaIntegrantes: Integrante[] = [
  {
    rm: '570281',
    nome: 'Ana Carolina Orcelli',
    funcao: 'Líder do Projeto',
    turma: '1TDSPI',
    foto: 'https://github.com/github.png',
    github: 'https://github.com',
    linkedin: 'https://linkedin.com',
    contribuicao: [
      'Gestão: Coordenação geral do projeto, controle de prazos e alinhamento entre as disciplinas da Global Solution.',
      'Engenharia de Software: Estruturação do modelo de negócios, BMC e documentação de arquitetura.',
    ],
  },
  {
    rm: '570412',
    nome: 'Cauã Mathias Bertini',
    funcao: 'Back-end (Python)',
    turma: '1TDSPI',
    foto: 'https://github.com/github.png',
    github: 'https://github.com',
    linkedin: 'https://linkedin.com',
    contribuicao: [
      'Computational Thinking: Desenvolvimento de rotinas em Python, estruturas de repetição, funções e persistência de dados.',
    ],
  },
  {
    rm: '573178',
    nome: 'Eduardo Lima de Souza',
    funcao: 'Front-End',
    turma: '1TDSPI',
    foto: 'https://github.com/github.png',
    github: 'https://github.com/duduutech',
    linkedin: 'https://linkedin.com',
    contribuicao: [
      'Front-End Design Engineering: Construção da SPA em React, Vite e TypeScript, estilização com Tailwind CSS e rotas dinâmicas.',
    ],
  },
  {
    rm: '571016',
    nome: 'Nicolas Frazão Viera Molina',
    funcao: 'Inteligencia Artificial',
    turma: '1TDSPI',
    foto: 'https://github.com/github.png',
    github: 'https://github.com',
    linkedin: 'https://linkedin.com',
    contribuicao: [
      'Artificial Intelligence: Tratamento de dados, construção de modelos preditivos e integração com o sistema.',
    ],
  },
  {
    rm: '572860',
    nome: 'Nicolas Rodrigues Martins',
    funcao: 'Back-end (Java)',
    turma: '1TDSPW',
    foto: 'https://github.com/github.png',
    github: 'https://github.com',
    linkedin: 'https://linkedin.com',
    contribuicao: [
      'Inteligência Artificial e Dados: Análise exploratória, treinamento de algoritmos e estruturação do pipeline de IA.',
    ],
  },
];

const valores = [
  {
    icone: FiCompass,
    titulo: 'Propósito',
    texto: 'Unir a tecnologia digital à urgência de democratizar e simplificar o acesso aos serviços de saúde.',
  },
  {
    icone: FiTarget,
    titulo: 'Objetivo',
    texto: 'Transformar a gestão de vagas ociosas e a triagem em uma ferramenta eficaz para reduzir filas nas UPAs.',
  },
  {
    icone: FiHeart,
    titulo: 'No que acreditamos',
    texto: 'O desenvolvimento de sistemas deve servir ao bem-estar social, provando que a inovação pode salvar vidas e gerar eficiência.',
  },
];

export default function Integrantes() {
  const { rm } = useParams<{ rm?: string }>();
  const navigate = useNavigate();

  const selecionado = listaIntegrantes.find((item) => item.rm === rm);

  useEffect(() => {
    document.title = selecionado
      ? `${selecionado.nome} | Acolhe+`
      : 'Integrantes | Acolhe+';
  }, [selecionado]);

  const painelAberto = Boolean(selecionado);

  function fecharPainel() {
    navigate('/integrantes');
  }

 
  useEffect(() => {
    if (!painelAberto) return;

    const fecharComEsc = (evento: KeyboardEvent) => {
      if (evento.key === 'Escape') navigate('/integrantes');
    };

    window.addEventListener('keydown', fecharComEsc);
    return () => window.removeEventListener('keydown', fecharComEsc);
  }, [painelAberto, navigate]);

  return (
    <main className="w-full max-w-7xl mx-auto px-6 lg:px-16 pt-28 pb-20 font-sans text-texto bg-fundo">
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20 items-center">
        
       
        <div className="flex flex-col justify-center space-y-4 text-left">
          <span className="text-xs font-bold text-primaria tracking-widest uppercase bg-mentaSuave px-4 py-1.5 rounded-full w-max border border-menta">
            Quem Somos
          </span>
          <h1 className="text-4xl md:text-5xl font-serif text-primariaEscura font-bold leading-tight">
            Nossa Equipe
          </h1>
          <p className="text-lg text-[#>64748b] leading-relaxed">
            Linhas de código como ferramentas para <span className="text-[#1>e3a5f] font-semibold">fortalecer a saúde pública</span> e otimizar o acesso ao SUS.
          </p>
        </div>

  
        <div className="flex flex-col gap-4">
          {valores.map(({ icone: Icone, titulo, texto }) => (
            <div key={titulo} className="bg-white border border-borda rounded-2xl p-6 flex gap-4 items-start shadow-sm hover:shadow-md transition-shadow text-left">
              <div className="w-12 h-12 bg-mentaSuave text-primaria rounded-xl flex items-center justify-center shrink-0">
                <Icone className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-primariaEscura mb-1">{titulo}</h3>
                <p className="text-textoSuave text-sm leading-relaxed">
                  {texto}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>


      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        {listaIntegrantes.map((membro, index) => (
          <Reveal key={membro.rm} delay={100 * index} className="w-full">
            <div className="bg-white border border-borda rounded-2xl p-6 shadow-sm flex flex-col items-center text-center hover:shadow-md transition-all group h-full">
              <img 
                src={membro.foto} 
                alt={membro.nome} 
                className="w-24 h-24 rounded-full object-cover mb-4 border-2 border-borda group-hover:border-primaria transition-colors"
              />
              <h2 className="text-[15px] font-bold text-texto leading-tight mb-1 min-h-10 flex items-center justify-center">
                {membro.nome}
              </h2>
              
              <p className="text-textoSuave text-xs font-medium mb-1">
                RM {membro.rm} &middot; {membro.turma}
              </p>
              
              <p className="text-primaria text-xs font-bold mb-6">
                {membro.funcao}
              </p>
              
              <div className="w-full mt-auto flex flex-col gap-3">
                <div className="flex gap-2 w-full">
                  <a 
                    href={membro.github} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="bg-texto text-white py-2 rounded-xl text-xs font-bold flex-1 flex justify-center items-center gap-1 hover:bg-primariaEscura transition-colors"
                  >
                    <FiGithub size={14} /> GitHub
                  </a>
                  <a 
                    href={membro.linkedin} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="bg-[#0077b5] text-white py-2 rounded-xl text-xs font-bold flex-1 flex justify-center items-center gap-1 hover:bg-[#006095] transition-colors"
                  >
                    <FiLinkedin size={14} /> LinkedIn
                  </a>
                </div>

                <Link 
                  to={`/integrantes/${membro.rm}`}
                  className="w-full bg-mentaSuave text-primaria border border-menta py-2 rounded-xl text-xs font-bold hover:bg-primaria] hover:text-white transition-colors flex items-center justify-center gap-1"
                >
                  Ver Detalhes <FiExternalLink size={12} />
                </Link>
              </div>
            </div>
          </Reveal>
        ))}
      </div>

     
      {selecionado && (
        <div className="fixed inset-0 z-50 overflow-hidden">
 
          <div
            onClick={fecharPainel}
            className="absolute inset-0 bg-primariaEscura/40 backdrop-blur-xs transition-opacity"
            aria-hidden="true"
          />


          <aside
            role="dialog"
            aria-modal="true"
            aria-label={`Informações de ${selecionado.nome}`}
            className="absolute top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl p-6 sm:p-8 overflow-y-auto text-left flex flex-col"
          >
            <button
              type="button"
              onClick={fecharPainel}
              aria-label="Fechar"
              className="absolute top-4 right-4 w-9 h-9 rounded-full grid place-items-center text-textoSuave hover:bg-fundo transition-colors"
            >
              <FiX size={20} aria-hidden="true" />
            </button>

            <span className="text-xs font-bold text-primaria uppercase tracking-widest">
              Integrante
            </span>

            <div className="flex items-center gap-4 mt-5">
              <img
                src={selecionado.foto}
                alt={`Foto de ${selecionado.nome}`}
                className="w-20 h-20 rounded-2xl object-cover border-2 border-primaria shrink-0 shadow-sm"
              />
              <div>
                <h2 className="text-xl font-bold text-texto leading-snug">{selecionado.nome}</h2>
                <span className="inline-block text-xs font-bold bg-mentaSuave text-primaria border border-menta px-3 py-1 rounded-full mt-1">
                  {selecionado.funcao}
                </span>
                <p className="text-xs text-textoSuave mt-2">
                  RM {selecionado.rm} &middot; {selecionado.turma}
                </p>
              </div>
            </div>

            {selecionado.contribuicao && (
              <div className="mt-6 flex-1">
                <h3 className="text-xs font-bold tracking-widest text-primariaEscura uppercase mb-3">
                  Contribuição no projeto
                </h3>
                <ul className="space-y-3">
                  {selecionado.contribuicao.map((item, idx) => {
                    const partes = item.split(': ');
                    const titulo = partes[0];
                    const resto = partes.slice(1).join(': ');
                    return (
                      <li key={idx} className="flex gap-3 items-start text-sm">
                        <span className="mt-1.5 w-2 h-2 rounded-full bg-primaria shrink-0" aria-hidden="true" />
                        <p className="text-textoSuave">
                          <strong className="text-texto">{titulo}:</strong> {resto}
                        </p>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3 mt-8 pt-4 border-t border-borda">
              <a
                href={selecionado.github}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2.5 rounded-xl bg-texto text-white text-xs font-bold text-center transition-colors flex items-center justify-center gap-1.5"
              >
                <FiGithub size={14} /> GitHub
              </a>
              <a
                href={selecionado.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2.5 rounded-xl bg-[#0077b5] hover:bg-[#006095] text-white text-xs font-bold text-center transition-colors flex items-center justify-center gap-1.5"
              >
                <FiLinkedin size={14} /> LinkedIn
              </a>
            </div>

            <div className="mt-6">
              <p className="text-xs font-bold text-textoSuave uppercase tracking-wider mb-2">Outros integrantes:</p>
              <div className="flex flex-wrap gap-2">
                {listaIntegrantes.map((integrante) => {
                  const ativo = integrante.rm === selecionado.rm;
                  return (
                    <Link
                      key={integrante.rm}
                      to={`/integrantes/${integrante.rm}`}
                      replace
                      title={integrante.nome}
                      className={`rounded-full transition-all ${
                        ativo ? 'ring-2 ring-[#1e3a5f] scale-110' : 'opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={integrante.foto}
                        alt={integrante.nome}
                        className="w-10 h-10 rounded-full object-cover border border-borda"
                      />
                    </Link>
                  );
                })}
              </div>
            </div>
          </aside>
        </div>
      )}
    </main>
  );
}