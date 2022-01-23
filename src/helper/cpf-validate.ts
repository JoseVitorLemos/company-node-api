import { cpf } from 'cpf-cnpj-validator'

export function cpfValidate (value: string): boolean {
	return cpf.isValid(value)
}
