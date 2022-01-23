import { Express } from 'express'

const log = (app: Express) => {
	app.use((req, _res, next) => {
		const { url, method } = req 
		console.log(`${method} - ${url} at ${new Date()}`)
		next()
	})
}

export default log
