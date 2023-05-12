import handler from '/virtual:documentx-handler'
import express from 'express'

const app = express()

const PORT = Number(process.env.PORT) || 3000
const HOST = process.env.HOST || 'localhost'

app.use(express.static('client', { index: false }))
app.use(handler)

app.listen(PORT, HOST, () => {
  console.log(`Server listening on http://${HOST}:${PORT}`)
})
