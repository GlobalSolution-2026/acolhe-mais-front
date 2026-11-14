
export interface ErroResponse {
  erro: string;
  status?: number;
}

export interface Unidade {
  cdUnidade: number;
  nmUnidade: string;
  dsEndereco?: string;
}

export interface Horario {
  idHorario: number;
  cdUnidade: number;
  dtHora: string;
  stLivre: boolean;
}

export interface Cidadao {
  cdCidadao: number;
  nmCompleto: string;
  nuCartaoSus: string; 
  nuCelular: string;   
  dtNascimento: string;
  dsSexo: string;
}


export type CidadaoCadastro = Omit<Cidadao, 'cdCidadao'>;

export interface Consulta {
  idConsulta: number;
  cdCidadao: number;
  idHorario: number;
  stConfirmada: boolean;
}