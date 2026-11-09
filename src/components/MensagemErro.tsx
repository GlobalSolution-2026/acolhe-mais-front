import { FiAlertCircle } from 'react-icons/fi';
import Botao from './Botao';

interface MensagemErroProps {
  mensagem: string;
  onRetry?: () => void;
}

export default function MensagemErro({ mensagem, onRetry }: MensagemErroProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center animate-fade-in">
      <div className="w-12 h-12 mb-4 text-rose-500 bg-rose-50 rounded-full flex items-center justify-center">
        <FiAlertCircle className="w-6 h-6" />
      </div>
      <h3 className="text-lg font-semibold text-slate-900 mb-2">
        Ops, algo deu errado
      </h3>
      <p className="text-sm text-slate-600 max-w-md mb-6">
        {mensagem}
      </p>
      {onRetry && (
        <Botao acao={onRetry} variante="secundario">
          Tentar novamente
        </Botao>
      )}
    </div>
  );
}