import { IsString, IsNumber } from 'class-validator'

export class LegalPersonDto {
	constructor(name: string, phone: string, cnpj: string, company_id: number) {
		this.name = name
		this.cnpj = cnpj 
		this.phone = phone
		this.company_id = company_id
	}

	@IsString()
	name: string
	
	@IsString()
	phone

	@IsString()
	cnpj: string

	@IsNumber()
	company_id: number 
}
