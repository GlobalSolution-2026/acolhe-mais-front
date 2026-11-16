import { Link } from 'react-router-dom';
import EstadoVazio from '../EstadoVazio';
import { BASE_CELULAR, queryRetorno, type DestinoLogin } from '../../services/navegacao';
import { BOTAO_CONTORNO, BOTAO_PRIMARIO } from './classes';

interface PedirLoginProps {
  /** Explica por que precisa entrar (ex.: "Entre para ver suas consultas."). */
  mensagem: string;
  /** Para onde voltar depois do login (vazio = Perfil). */
  destino?: DestinoLogin;
}

/** Estado das telas que pedem login: mensagem + botões Entrar e Criar conta. */
export default function PedirLogin({ mensagem, destino = '' }: PedirLoginProps) {
  const query = queryRetorno({ destino });
  return (
    <div className="flex flex-col gap-3">
      <EstadoVazio mensagem={mensagem} />
      <Link to={`${BASE_CELULAR}/entrar${query}`} className={BOTAO_PRIMARIO}>Entrar</Link>
      <Link to={`${BASE_CELULAR}/criar-conta${query}`} className={BOTAO_CONTORNO}>Criar conta</Link>
    </div>
  );
}
