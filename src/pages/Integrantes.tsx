import { Link } from 'react-router-dom';
import Botao from '../components/Botao';

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

const equipe: Integrante[] = [
  {
    rm: '570281',
    nome: 'Ana Carolina Orcelli',
    funcao: 'Líder do Projeto',
    turma: '1TDSPI',
    foto: 'https://github.com/github.png',
    github: 'https://github.com',
    linkedin: 'https://linkedin.com',
    contribuicao: ['Colocar Contribuição'], // Colocar a contribuição 
    },
  {
    rm: '570412',
    nome: 'Cauã Mathias Bertini',
    funcao: 'Back-end (Python)',
    turma: '1TDSPI',
    foto: 'https://github.com/github.png',
    github: 'https://github.com/duduutech',
    linkedin: 'https://linkedin.com',
    contribuicao: ['Colocar Contribuição'], 
  },
  {
    rm: '573178',
    nome: 'Eduardo Lima de Souza',
    funcao: 'Front-End',
    turma: '1TDSPW',
    foto: 'https://github.com/github.png',
    github: 'https://github.com',
    linkedin: 'https://linkedin.com',
    contribuicao: ['Colocar Contribuição'], // Colocar a contribuição 
  },
  {
    rm: '571016',
    nome: 'Nicolas Frazão Viera Molina',
    funcao: 'Inteligencia Artificial',
    turma: '1TDSPI',
    foto: 'https://github.com/github.png',
    github: 'https://github.com',
    linkedin: 'https://linkedin.com',
    contribuicao: ['Colocar Contribuição'],
  },
  {
    rm: '572860',
    nome: 'Nicolas Rodrigues Martins',
    funcao: 'Inteligência Artificial',
    turma: '1TDSPI',
    foto: 'https://github.com/github.png',
    github: 'https://github.com',
    linkedin: 'https://linkedin.com',
    contribuicao: ['Colocar Contribuição'],
  },
];

export default function Integrantes() {
  return (
    <div className="min-h-screen pt-28 pb-12 px-4 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-[#004d3a] text-center mb-2">Nossa Equipe</h1>
      <p className="text-stone-600 text-center mb-10">Conheça os desenvolvedores por trás do Acolhe+</p>
      

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        {equipe.map((membro) => (
          <div 
            key={membro.rm} 
            className="bg-white border border-stone-200 rounded-2xl p-6 shadow-sm flex flex-col items-center text-center hover:shadow-md transition-all group"
          >
            <img 
              src={membro.foto} 
              alt={membro.nome} 
              className="w-20 h-20 rounded-full object-cover mb-4 border-2 border-[#148565]/20 group-hover:border-[#148565] transition-colors"
            />
            <h2 className="text-xl font-bold text-stone-800">{membro.nome}</h2>
            <p className="text-[#148565] font-medium text-sm mb-1">RM: {membro.rm}</p>
            <p className="text-xs text-stone-500 mb-6">{membro.funcao}</p>
            
            <div className="mt-auto w-full">
              <Link to={`/integrantes/${membro.rm}`}>
                <Botao 
                  variante="secundario" 
                  className="w-full border-2 border-[#148565] text-[#148565] hover:bg-[#148565] hover:text-white transition-colors text-xs py-2"
                >
                  Ver Detalhes
                </Botao>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}