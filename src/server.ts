import app from './config/app'

const port = 3000

app.listen(port, () => { console.log(`App ${process.env.PROJECT_NAME} running at ${port}`) })
