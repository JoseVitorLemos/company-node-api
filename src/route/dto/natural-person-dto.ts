import { IsString, IsNumber, IsDateString } from 'class-validator'

export class NaturalPersonDto {
	constructor(name: string, phone: string, cpf: string, rg: string, birth_date: Date, company_id: number) {
		this.name = name
		this.cpf = cpf
		this.rg = rg
		this.phone = phone
		this.birth_date = birth_date
		this.company_id = company_id
	}

	@IsString()
	name: string
	
	@IsString()
	phone

	@IsString()
	cpf: string

	@IsString()
	rg: string

	@IsDateString()
	birth_date: Date 

	@IsNumber()
	company_id: number 
}
