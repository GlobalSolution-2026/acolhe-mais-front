import type { ChangeEvent } from 'react';
import { useForm } from 'react-hook-form';
import { FiMapPin } from 'react-icons/fi';
import { mascararCep } from '../../utils/formatadores';
import { regrasCep } from '../../utils/validacoes';
import CampoFormulario from '../CampoFormulario';
import { BOTAO_CONTORNO } from './classes';

interface CampoCepOpcionalProps {
  /** Texto acima do campo (ex.: "Informe seu CEP para ver a UPA mais próxima."). */
  mensagem: string;
  /** Recebe o CEP com a máscara (00000-000) quando a pessoa confirma. */
  onInformar: (nrCep: string) => void;
  /** Texto do botão (padrão: "Ver a mais próxima"). */
  textoBotao?: string;
}

/**
 * Campo de CEP mostrado depois que a orientação já deu o resultado, para quem pulou o CEP no Início.
 * Regra: o CEP é opcional no Início (a orientação nunca trava); sem ele, o app não diz qual unidade é a
 * mais próxima e pede o CEP aqui. Mesma máscara e mesma validação (8 números) do Início.
 */
export default function CampoCepOpcional({ mensagem, onInformar, textoBotao = 'Ver a mais próxima' }: CampoCepOpcionalProps) {
  const { register, handleSubmit, setValue, formState: { errors, isSubmitted } } = useForm<{ cep: string }>({
    defaultValues: { cep: '' },
  });

  const registroCep = register('cep', {
    ...regrasCep,
    onChange: (e: ChangeEvent<HTMLInputElement>) => {
      setValue('cep', mascararCep(e.target.value), { shouldValidate: isSubmitted });
    },
  });

  return (
    <form
      onSubmit={handleSubmit(({ cep }) => onInformar(cep))}
      className="flex flex-col gap-3 rounded-xl border border-borda bg-branco p-4"
      noValidate
    >
      <p className="font-semibold">{mensagem}</p>
      <CampoFormulario id="cepResultado" label="Seu CEP" placeholder="00000-000" numerico registro={registroCep} erro={errors.cep} />
      <button type="submit" className={`${BOTAO_CONTORNO} cursor-pointer`}>
        <FiMapPin aria-hidden /> {textoBotao}
      </button>
    </form>
  );
}
