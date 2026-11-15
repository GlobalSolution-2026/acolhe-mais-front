import { DOENCAS_BASE } from '../data/contaDemo';
import type { Cidadao, FichaSaude } from '../types';
import { formatarTelefone } from '../utils/formatadores';

/** Doenças de base em texto ("Diabetes, Hipertensão"); "Outra" mostra o que a pessoa escreveu. */
function textoDoencas(f: FichaSaude): string {
  return f.dsDoencasBase
    .map((cd) => (cd === 'OUTRA' ? f.dsOutraDoenca.trim() || 'Outra' : DOENCAS_BASE.find((d) => d.cd === cd)?.nm ?? cd))
    .join(', ');
}

/** Uma linha da ficha: rótulo pequeno em cima e valor em destaque ("Não informado" quando vazio). */
function Item({ rotulo, valor }: { rotulo: string; valor: string }) {
  return (
    <p>
      <span className="block text-sm font-semibold text-textoSuave">{rotulo}</span>
      <span className="font-bold">{valor || 'Não informado'}</span>
    </p>
  );
}

interface ResumoFichaProps {
  ficha: FichaSaude;
  cidadao: Cidadao;
  /** Mostra também o contato de recado (usado na Emergência). */
  contato?: boolean;
}

/** Resumo da ficha de saúde (veio do protótipo; usado na Emergência e no Perfil). */
export default function ResumoFicha({ ficha, cidadao, contato = false }: ResumoFichaProps) {
  return (
    <div className="flex flex-col gap-3">
      <Item rotulo="Doenças de base" valor={textoDoencas(ficha)} />
      <Item
        rotulo="Medicamentos de uso contínuo"
        valor={ficha.medicamentos.map((m) => (m.dsDose ? `${m.nmMedicamento} (${m.dsDose})` : m.nmMedicamento)).join('; ')}
      />
      <Item rotulo="Alergias" valor={ficha.dsAlergias} />
      <Item rotulo="Tipo sanguíneo" valor={ficha.dsTipoSanguineo === 'NAO_SEI' ? 'Não sabe' : ficha.dsTipoSanguineo} />
      {contato && (
        <Item
          rotulo="Contato de emergência"
          valor={cidadao.nmContatoRecado ? `${cidadao.nmContatoRecado} · ${formatarTelefone(cidadao.nrContatoRecado)}` : ''}
        />
      )}
    </div>
  );
}
