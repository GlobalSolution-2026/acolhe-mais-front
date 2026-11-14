import { Link } from 'react-router-dom';

interface CardProps {
  nome: string;
  rm: string;
  turma: string;
  foto: string;
  github: string;
  linkedin: string;
}

export default function CardIntegrante({ nome, rm, turma, foto, github, linkedin }: CardProps) {
  const primeiroNome = nome.split(' ')[0];
  const apelido = nome.split(' ').slice(1).join(' ');

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-stone-200 flex flex-col items-center text-center h-full hover:shadow-md transition-shadow relative overflow-hidden group">
      
      {/* Detalhe visual de topo */}
      <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-[#e6f2ed] to-transparent z-0"></div>

      <div className="relative z-10 w-20 h-20 rounded-full bg-[#fbfdfc] border-[3px] border-white shadow-md overflow-hidden mb-4 group-hover:scale-105 transition-transform duration-300">
        <img 
          src={foto} 
          alt={nome} 
          className="w-full h-full object-cover" 
        />
      </div>

      <div className="relative z-10 flex-grow w-full flex flex-col justify-between">
        <div>
          <h3 className="text-lg font-serif text-[#024131] leading-tight mb-1">
            <span className="font-bold block">{primeiroNome}</span>
            <span className="text-sm font-sans text-stone-600 line-clamp-1">{apelido}</span>
          </h3>
          
          <div className="bg-stone-50 border border-stone-100 rounded-lg py-1.5 px-2 mt-3 space-y-0.5">
            <p className="text-[11px] text-stone-500 font-medium tracking-wide uppercase">
              RM: <span className="text-stone-800">{rm}</span>
            </p>
            <p className="text-[11px] text-stone-500 font-medium tracking-wide uppercase">
              Turma: <span className="text-stone-800">{turma}</span>
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-2 w-full mt-5">
          <Link 
            to={`/integrantes/${rm}`}
            className="w-full bg-[#004d3a] text-white py-2 rounded-full text-xs font-bold hover:bg-[#003829] transition-colors shadow-sm"
          >
            Ver Contribuição
          </Link>
          <div className="flex gap-2">
            <a 
              href={github} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex-1 border border-stone-200 text-stone-600 py-1.5 rounded-full text-[10px] font-bold hover:bg-stone-100 transition-colors"
            >
              GitHub
            </a>
            <a 
              href={linkedin} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex-1 border border-stone-200 text-[#0A66C2] py-1.5 rounded-full text-[10px] font-bold hover:bg-blue-50 transition-colors"
            >
              LinkedIn
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}