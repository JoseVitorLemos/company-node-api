import path from 'path';

module.exports = {    
	client: 'sqlite',
	connection: {
		filename: path.resolve(__dirname, 'src', 'infra', 'db', 'database.sqlite')
	},
	migrations: {
		directory: path.resolve(__dirname, 'src', 'infra', 'db', 'migrations')
	},
	useNullAsDefault: true
}
