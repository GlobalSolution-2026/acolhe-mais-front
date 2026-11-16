/**
 * Página: Editar perfil (aba Cidadão → celular, /simulador/cidadao/perfil/editar)
 * O cidadão altera só celular, contato de recado e CEP. Nome, Cartão SUS, nascimento e sexo aparecem
 * só para leitura, com o aviso de procurar a recepção da UBS (RF27).
 * Veio do protótipo: src/pages/cidadao/EditarPerfil.tsx.
 * Endpoints: GET /cidadaos/{id} e PUT /cidadaos/{id} (API Java; o corpo leva só os campos editáveis).
 * Estados: sem login, carregando, erro ao carregar, "Salvando..." e erro ao salvar (400/404).
 */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Loading from '../../../components/Loading';
import MensagemErro from '../../../components/MensagemErro';
import FormularioCidadao, { type DadosCidadao } from '../../../components/celular/FormularioCidadao';
import PedirLogin from '../../../components/celular/PedirLogin';
import { useSimulador } from '../../../context/useSimulador';
import { useCarregar } from '../../../hooks/useCarregar';
import { atualizarCidadao, buscarCidadao } from '../../../services/api';
import { BASE_CELULAR } from '../../../services/navegacao';
import { mensagemDoErro } from '../../../utils/erros';

/** Tela Editar perfil do celular. */
export default function EditarPerfil() {
  const { estado } = useSimulador();
  const idCidadao = estado.idCidadaoAtual;
  const navigate = useNavigate();
  const [enviando, setEnviando] = useState(false);
  const [erroSalvar, setErroSalvar] = useState<string | null>(null);
  const { dados: cidadao, carregando, erro, recarregar } = useCarregar(
    async () => (idCidadao === null ? null : buscarCidadao(idCidadao)),
    [idCidadao],
  );

  if (idCidadao === null) return <PedirLogin mensagem="Entre para editar seus dados." />;
  if (carregando) return <Loading />;
  if (erro || !cidadao) return <MensagemErro mensagem={erro ?? 'Cadastro não encontrado.'} onRetry={recarregar} />;

  /** Regra RF27: manda só celular, contato de recado e CEP. */
  const aoEnviar = async (form: DadosCidadao) => {
    setEnviando(true);
    setErroSalvar(null);
    try {
      await atualizarCidadao(cidadao.idCidadao, {
        nrCelular: form.nrCelular,
        nmContatoRecado: form.nmContatoRecado,
        nrContatoRecado: form.nrContatoRecado,
        nrCep: form.nrCep,
      });
      navigate(`${BASE_CELULAR}/perfil`);
    } catch (e) {
      setErroSalvar(mensagemDoErro(e));
      setEnviando(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-extrabold text-primaria">Editar dados</h1>
      <p className="text-base text-textoSuave">Confira seu celular: é por ele que avisamos a confirmação e as vagas.</p>
      {erroSalvar && <MensagemErro mensagem={erroSalvar} />}
      <FormularioCidadao
        valoresIniciais={cidadao}
        identificacaoSomenteLeitura
        pedirCep
        aoEnviar={(d) => void aoEnviar(d)}
        textoBotao="Salvar"
        textoEnviando="Salvando..."
        enviando={enviando}
      />
    </div>
  );
}
