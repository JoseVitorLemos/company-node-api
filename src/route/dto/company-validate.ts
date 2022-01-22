import { IsString, Length } from 'class-validator'

class CompanyDto {
	constructor(uf: string, trade_name: string, cnpj: string) {
		this.uf = uf
		this.trade_name = trade_name
		this.cnpj = cnpj
	}	

  @Length(2)
  uf: string;

	@IsString()
  trade_name: string
	
	@IsString()
  cnpj: string 
}

export default CompanyDto
