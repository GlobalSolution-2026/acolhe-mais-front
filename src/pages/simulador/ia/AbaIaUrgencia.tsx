/**
 * Página: aba IA – Verificação de urgência (/simulador/ia-urgencia)
 * Vai mostrar o Modelo 2: formulário (idade, sexo, trauma, dor e estado mental), o resultado
 * e o efeito na orientação. Por enquanto: "Em construção" (bloco 8).
 * Veio de: planejamento do grupo (não há tela equivalente no protótipo).
 * Endpoints (planejados): POST /verificar-urgencia (API Flask).
 * Estados: ainda não se aplica.
 */
import EmConstrucao from '../../../components/EmConstrucao';
import LayoutAba from '../../../components/LayoutAba';
import PainelExplicacao from '../../../components/PainelExplicacao';

/** Aba IA – Verificação de urgência (em construção). */
export default function AbaIaUrgencia() {
  return (
    <LayoutAba
      explicacao={
        <PainelExplicacao
          titulo="IA – Verificação de urgência"
          oQueFaz="Mostra o Modelo 2, que confere se um caso que deu verde ou azul nas regras pode ser urgente."
          regras={[
            'O modelo só pode ELEVAR a cor (verde/azul → amarelo, UPA), nunca baixar.',
            'Só entram dados que o cidadão consegue informar (sem pressão, saturação etc.).',
            'Se a API de IA falhar, a orientação segue com a cor das regras.',
          ]}
          endpoints={[{ metodo: 'POST', rota: '/verificar-urgencia', api: 'FLASK' }]}
        />
      }
    >
      <EmConstrucao titulo="IA – Verificação de urgência" previsao="bloco 8" />
    </LayoutAba>
  );
}
