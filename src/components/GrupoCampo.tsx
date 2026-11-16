import type { ReactNode } from 'react';
import type { FieldError } from 'react-hook-form';

/** Propriedades do grupo de um campo de formulário. */
interface GrupoCampoProps {
  /** id do controle (input, select ou textarea) que vem em children. */
  id: string;
  label: string;
  /** O controle já registrado no react-hook-form. */
  children: ReactNode;
  /** Dica fixa abaixo do campo (id: "<id>-dica"). */
  dica?: string;
  /** Erro da validação (id: "<id>-erro"). */
  erro?: FieldError;
}

/**
 * Monta label, campo, dica e mensagem de erro das páginas institucionais (ex.: Contato).
 * O controle recebe aria-invalid e aria-describedby na própria página, apontando para
 * "<id>-dica" e "<id>-erro", para o leitor de tela ler a dica e o erro junto com o campo.
 */
export default function GrupoCampo({ id, label, children, dica, erro }: GrupoCampoProps) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="font-bold text-texto">
        {label}
      </label>
      {children}
      {dica && (
        <p id={`${id}-dica`} className="text-sm text-textoSuave">
          {dica}
        </p>
      )}
      {erro && (
        <p id={`${id}-erro`} className="text-sm font-semibold text-gravidade-vermelho">
          {erro.message}
        </p>
      )}
    </div>
  );
}
