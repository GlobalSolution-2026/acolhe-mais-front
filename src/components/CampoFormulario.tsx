import { useState } from 'react';
import type { FieldError, UseFormRegisterReturn } from 'react-hook-form';

interface CampoFormularioProps {
  id: string;
  label: string;
  /** Resultado de register('campo', regras) do react-hook-form. */
  registro: UseFormRegisterReturn;
  erro?: FieldError;
  tipo?: string;
  placeholder?: string;
  /** Teclado numérico no celular (CNS, CEP, telefone). */
  numerico?: boolean;
  /** Campo de senha com botão Mostrar/Ocultar. */
  alternarSenha?: boolean;
}

/**
 * Campo de formulário do simulador (react-hook-form): label, input e a mensagem de erro da validação.
 */
export default function CampoFormulario({ id, label, registro, erro, tipo = 'text', placeholder, numerico, alternarSenha }: CampoFormularioProps) {
  const [senhaVisivel, setSenhaVisivel] = useState(false);
  const classes = `min-h-12 w-full rounded-xl border bg-branco px-4 text-texto outline-none focus:ring-2 focus:ring-primaria ${
    erro ? 'border-gravidade-vermelho' : 'border-borda'
  }`;
  const tipoFinal = alternarSenha && senhaVisivel ? 'text' : tipo;

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="font-semibold text-texto">{label}</label>
      <div className="relative">
        <input
          id={id}
          type={tipoFinal}
          placeholder={placeholder}
          inputMode={numerico ? 'numeric' : undefined}
          aria-invalid={!!erro}
          aria-describedby={erro ? `${id}-erro` : undefined}
          className={`${classes} ${alternarSenha ? 'pr-24' : ''}`}
          {...registro}
        />
        {alternarSenha && (
          <button
            type="button"
            onClick={() => setSenhaVisivel((v) => !v)}
            aria-label={senhaVisivel ? 'Ocultar senha' : 'Mostrar senha'}
            aria-pressed={senhaVisivel}
            className="absolute right-1 top-1/2 min-h-10 -translate-y-1/2 cursor-pointer rounded-lg px-3 text-sm font-bold text-primaria hover:bg-fundo"
          >
            {senhaVisivel ? 'Ocultar' : 'Mostrar'}
          </button>
        )}
      </div>
      {erro && (
        <p id={`${id}-erro`} className="text-sm font-semibold text-gravidade-vermelho">{erro.message}</p>
      )}
    </div>
  );
}
