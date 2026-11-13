
export const regrasNome = {
  required: 'Informe seu nome completo.',
  maxLength: { value: 150, message: 'O nome pode ter no máximo 150 caracteres.' },
  pattern: {
    value: /^[A-Za-zÀ-ÖØ-öø-ÿ'’ -]+$/,
    message: 'Use apenas letras (espaços, apóstrofos e hífens são aceitos).',
  },
  validate: (valor: string) => valor.trim().includes(' ') || 'Digite nome e sobrenome.',
};


export const regrasCartaoSus = {
  required: 'O número do Cartão SUS é obrigatório.',
  pattern: {
    value: /^\d{15}$/,
    message: 'O Cartão SUS deve conter exatamente 15 números.',
  }
};

// O edital exige o celular com DDD
export const regrasCelular = {
  required: 'O número de celular é obrigatório.',
  pattern: {
    value: /^[0-9]{10,11}$/, 
    message: 'Informe o celular com DDD, contendo apenas números (10 ou 11 dígitos).',
  }
};

export const regrasDataNascimento = {
  required: 'A data de nascimento é obrigatória.',
};

export const regrasSexo = {
  required: 'Informe o sexo.',
};