import { cnpj } from 'cpf-cnpj-validator'

export function cnpjValidate (value: string): boolean {
	return cnpj.isValid(value)
}
