import { useEffect, useState } from 'react';
import { mensagemDoErro } from '../utils/erros';

/** O que o hook devolve para a tela montar os três estados (carregando, erro e os dados). */
export interface Carregamento<T> {
  dados: T | null;
  carregando: boolean;
  erro: string | null;
  /** Busca de novo (botão "Tentar novamente" ou depois de uma ação, como confirmar). */
  recarregar: () => void;
}

/**
 * Chama um serviço quando a tela abre e guarda o resultado, o "carregando" e a mensagem de erro.
 * Toda tela que chama API usa este hook, para tratar carregando, erro e vazio do mesmo jeito.
 * @param buscar função do serviço (ex.: () => listarUnidades('UBS'))
 * @param dependencias quando alguma muda, busca de novo (ex.: o id da UBS na URL)
 */
export function useCarregar<T>(buscar: () => Promise<T>, dependencias: unknown[]): Carregamento<T> {
  const [dados, setDados] = useState<T | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  // Muda a cada recarregar() para o efeito rodar de novo.
  const [tentativa, setTentativa] = useState(0);

  useEffect(() => {
    // ativo = false quando a tela fecha ou a busca muda: a resposta antiga é ignorada.
    let ativo = true;
    buscar()
      .then((resultado) => {
        if (!ativo) return;
        setDados(resultado);
        setErro(null);
      })
      .catch((e) => {
        if (ativo) setErro(mensagemDoErro(e));
      })
      .finally(() => {
        if (ativo) setCarregando(false);
      });
    return () => {
      ativo = false;
    };
    // A função buscar é recriada a cada render; quem decide quando buscar de novo são as dependências.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...dependencias, tentativa]);

  /** Busca de novo mostrando o "carregando" só se ainda não há dados na tela. */
  const recarregar = () => {
    if (dados === null) setCarregando(true);
    setErro(null);
    setTentativa((t) => t + 1);
  };

  return { dados, carregando, erro, recarregar };
}
