import { z } from "zod";

const phoneRegex = /^\(?\d{2}\)?[\s-]?\d{4,5}[\s-]?\d{4}$/;
const cpfRegex = /^\d{3}\.?\d{3}\.?\d{3}-?\d{2}$/;

const opt = () => z.string().trim().optional();

export const financingFormSchema = z.object({
  // Passo 1 — veículo de interesse (selecionado do estoque) + simulação
  veiculoPublicId: z.string().trim().min(1, "Selecione o veículo de interesse"),
  veiculoNome: opt(),
  veiculoValor: opt(),
  entrada: z.string().trim().min(1, "Informe o valor de entrada"),
  parcelas: z
    .string()
    .trim()
    .min(1, "Informe o nº de parcelas")
    .regex(/^\d{1,3}$/, "Nº de parcelas inválido"),

  // Passo 2 — Dados Pessoais
  nome: z.string().trim().min(2, "Informe seu nome completo"),
  cpf: z
    .string()
    .trim()
    .min(1, "Informe seu CPF")
    .regex(cpfRegex, "CPF inválido, ex: 123.456.789-00"),
  rgNumero: opt(),
  rgOrgao: opt(),
  rgUf: opt(),
  rgDataEmissao: opt(),
  nascimento: z
    .string()
    .trim()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Data inválida"),
  nacionalidade: opt(),
  naturalidadeCidade: opt(),
  naturalidadeUf: opt(),
  sexo: opt(),
  nomePai: opt(),
  nomeMae: opt(),
  estadoCivil: opt(),
  endCorrespondencia: opt(),
  tipoPessoa: opt(),
  grauInstrucao: opt(),
  numDependentes: opt(),
  email: z.union([z.string().trim().email("E-mail inválido"), z.literal("")]).optional(),
  endereco: opt(),
  enderecoNumero: opt(),
  complemento: opt(),
  bairro: opt(),
  cidade: opt(),
  cep: opt(),
  estado: opt(),
  tempoResidencia: opt(),
  tipoResidencia: opt(),
  telefoneResidencial: opt(),
  tipoTelefone: opt(),
  celular: z
    .string()
    .trim()
    .min(1, "Informe seu celular (WhatsApp)")
    .regex(phoneRegex, "Telefone inválido, ex: (11) 99999-9999"),
  telefoneRecado: opt(),

  // Passo 3 — Dados Profissionais
  empresa: opt(),
  cnpjEmpresaPropria: opt(),
  dataAdmissao: opt(),
  rendaMensal: z.string().trim().min(1, "Informe sua renda mensal"),
  cargoFuncao: opt(),
  endComercial: opt(),
  bairroComercial: opt(),
  cidadeComercial: opt(),
  cepComercial: opt(),
  ufComercial: opt(),
  telefoneComercial: opt(),

  // Passo 4 — Dados do Cônjuge (todos opcionais)
  conjugeNome: opt(),
  conjugeCpf: opt(),
  conjugeRg: opt(),
  conjugeNascimento: opt(),
  conjugeEmpresa: opt(),
  conjugeTelefone: opt(),
  conjugeOcupacao: opt(),
  conjugeRenda: opt(),

  observacoes: opt(),
  /** Honeypot — campo oculto que humano não preenche. */
  website: z.string().optional(),
});

export type FinancingFormValues = z.infer<typeof financingFormSchema>;

/** Campos validados em cada passo (para validação incremental com RHF). */
export const FINANCING_STEP_FIELDS: (keyof FinancingFormValues)[][] = [
  ["veiculoPublicId", "entrada", "parcelas"],
  ["nome", "cpf", "nascimento", "celular", "email"],
  ["rendaMensal"],
  [],
];

/** Body do POST /showroom/{slug}/financing-requests. */
export interface FinancingRequestPayload {
  customerName: string;
  customerCpf?: string;
  customerPhone?: string;
  customerEmail?: string;
  birthDate?: string;
  occupation?: string;
  monthlyIncome?: number;
  vehiclePublicId?: string;
  vehicleName?: string;
  vehiclePrice?: number;
  downPayment?: number;
  installments?: number;
  notes?: string;
  details?: Record<string, Record<string, string>>;
  website?: string;
}
