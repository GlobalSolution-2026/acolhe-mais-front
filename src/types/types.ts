// ==========================================
// TIPAGENS DE COMPONENTES VISUAIS (Manter)
// ==========================================

export interface CabecalhoProps {
  titulo: string;
}

export interface ItemMenu {
  label: string;
  path: string;
}

export type IntegranteBase = {
  nome: string;
  rm: string;
  turma: string;
  foto: string;
};

export type RedesSociais = {
  linkedin: string;
  github: string;
};

export type IntegranteProps = IntegranteBase & RedesSociais & {
  funcao?: string;
  contribuicao?: string[];
};

export type FormContatoInputs = {
  nome: string;
  email: string;
  mensagem: string;
};

export type FaqItemType = {
  pergunta: string;
  resposta: string;
};

export type TimelineItemProps = {
  numero: number;
  titulo: string;
  descricao: string;
};

export type StatusRequisicao = 'idle' | 'loading' | 'success' | 'error';

export type FeedbackType = {
  id?: string;
  nome: string;
  email: string;
  mensagem: string;
};

// ==========================================
// TIPAGENS DA API JAVA (CitizenTech)
// ==========================================

export type TipoPerfil = 'COMUM' | 'CRIADOR' | 'MODERADOR';
export type StatusValidacao = 'PENDENTE' | 'APROVADO' | 'REJEITADO';
export type CategoriaId = 'critico' | 'estrutural' | 'rotina';
export type Impacto = 'CRITICO' | 'ESTRUTURAL' | 'ROTINA'; 
export type DecisaoModeracao = 'A' | 'R'; 

export interface Usuario {
  id: number;
  nmCompleto: string;
  email: string;
  username: string;
  dtNascimento: string; 
  sdPonto: number;
  nvUsuario: number;
  tipoPerfil: TipoPerfil;
}

export interface Comunidade {
  id: number;
  nmComunidade: string;
  descricao: string;
  dtCriacao: string;
  idCriador: number;
  idRanking: number | null; 
}

export interface Postagem {
  id: number;
  ctTexto: string;
  ctUrl: string;
  stValidacao: StatusValidacao;
  ptGerado: number;
  idUsuario: number;
  idComunidade: number;
}

// Formato de erro devolvido pela API Java
export interface ErroApi {
  erro: string;
  status: number;
}

// DTOs de Entrada (Cadastro e Login)
export interface UsuarioCadastro {
  nmCompleto: string;
  cpf: string;
  email: string;
  username: string;
  senha: string;
  dtNascimento: string; 
}

export type LoginRequest = Pick<UsuarioCadastro, 'username' | 'senha'>;

export interface PostagemCadastro {
  ctTexto: string;
  ctUrl: string;
  impacto: Impacto;
  idUsuario: number;
  idComunidade: number;
}