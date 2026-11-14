import { useParams, Link } from 'react-router-dom';
import Botao from '../components/Botao';

const equipe = [
  {
    rm: '570281',
    nome: 'Ana Carolina Orcelli',
    funcao: 'Desenvolvedora (Simulador)',
    turma: '1TDSPI',
    foto: 'https://github.com/github.png',
    github: 'https://github.com',
    linkedin: 'https://linkedin.com',
    contribuicao: ['Criação do Simulador', 'Estruturação de Abas', 'Integração de Telas'],
  },
  {
    rm: '570412',
    nome: 'Eduardo Lima de Souza',
    funcao: 'Front-End Developer',
    turma: '1TDSPI',
    foto: 'https://github.com/duduutech.png',
    github: 'https://github.com/duduutech',
    linkedin: 'https://linkedin.com',
    contribuicao: ['Arquitetura React e Rotas', 'Validações (Cartão SUS e Celular)', 'Padronização visual e Git Flow'],
  },
  {
    rm: '573178',
    nome: 'Nicolas Rodrigues',
    funcao: 'Back-End (Java)',
    turma: '1TDSPW',
    foto: 'https://github.com/github.png',
    github: 'https://github.com',
    linkedin: 'https://linkedin.com',
    contribuicao: ['Desenvolvimento da API em Java', 'Criação de DTOs e Repositórios', 'Regras de negócio de agendamento'],
  },
  {
    rm: '571016',
    nome: 'Lucas Costa Serrano',
    funcao: 'Back-End (Python)',
    turma: '1TDSPI',
    foto: 'https://github.com/github.png',
    github: 'https://github.com',
    linkedin: 'https://linkedin.com',
    contribuicao: ['Algoritmos de Computational Thinking', 'Processamento de dados da UBS', 'Testes de rotinas backend'],
  },
  {
    rm: '572860',
    nome: 'Lucas Fortunato',
    funcao: 'Inteligência Artificial',
    turma: '1TDSPI',
    foto: 'https://github.com/github.png',
    github: 'https://github.com',
    linkedin: 'https://linkedin.com',
    contribuicao: ['Modelagem preditiva de triagem', 'Documentação e fluxos de IA', 'Apoio na entrega Global Solution'],
  },
];

export default function IntegranteDetalhe() {
  const { rm } = useParams<{ rm: string }>();
  const integrante = equipe.find((m) => m.rm === rm);

  if (!integrante) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 pt-24">
        <h2 className="text-2xl font-bold text-stone-800 mb-2">Integrante não encontrado</h2>
        <p className="text-stone-600 mb-6">O RM {rm} não pertence a nenhum membro cadastrado.</p>
        <Link to="/integrantes">
          <Botao variante="primario">Voltar para a Equipe</Botao>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-28 pb-12 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto">
      <div className="bg-white rounded-3xl shadow-sm border border-stone-200 p-8 flex flex-col md:flex-row gap-8 items-center md:items-start">
        
        <img 
          src={integrante.foto} 
          alt={integrante.nome} 
          className="w-40 h-40 rounded-2xl object-cover shadow-md border-2 border-[#148565]"
        />

        <div className="flex-1 text-center md:text-left">
          <h1 className="text-3xl font-bold text-[#004d3a] mb-1">{integrante.nome}</h1>
          <p className="text-sm font-semibold text-[#148565] mb-2">RM: {integrante.rm} • Turma: {integrante.turma}</p>
          <p className="text-stone-600 font-medium mb-6">{integrante.funcao}</p>
          
          <div className="mb-6 text-left">
            <h3 className="font-bold text-stone-800 text-sm uppercase tracking-wider mb-2">Contribuições no Projeto:</h3>
            <ul className="space-y-2">
              {integrante.contribuicao.map((item, index) => (
                <li key={index} className="text-sm text-stone-600 bg-stone-50 p-2.5 rounded-xl border border-stone-100 flex items-center gap-2">
                  <span className="text-[#148565] font-bold">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-wrap gap-3 justify-center md:justify-start">
            <a 
              href={integrante.github} 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-stone-900 text-white px-4 py-2 rounded-xl font-bold text-xs hover:bg-stone-800 transition-colors"
            >
              GitHub
            </a>
            <a 
              href={integrante.linkedin} 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-[#0077b5] text-white px-4 py-2 rounded-xl font-bold text-xs hover:bg-[#006095] transition-colors"
            >
              LinkedIn
            </a>
          </div>

          <div className="mt-8 pt-6 border-t border-stone-100">
            <Link to="/integrantes">
              <Botao variante="secundario" className="border-2 border-[#148565] text-[#148565] hover:bg-[#148565] hover:text-white">
                ← Voltar para a listagem
              </Botao>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}