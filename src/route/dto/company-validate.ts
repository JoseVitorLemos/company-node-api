import { IsString, Length } from 'class-validator'

class CompanyDto {
	constructor(uf: string, trade_name: string, cnpj: string) {
		this.uf = uf
		this.trade_name = trade_name
		this.cnpj = cnpj
	}	

  @Length(2, 2, { message: 'uf must be two characters' })
	@IsString()
  uf: string;

	@Length(4, 20)
	@IsString()
  trade_name: string

	@IsString()
  cnpj: string 
}

export default CompanyDto
