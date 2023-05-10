import { createServer } from 'node:http'
import handler from '/virtual:documentx-handler'

const PORT = Number(process.env.PORT) || 3000
const HOST = process.env.HOST || 'localhost'

createServer((req, res) =>
  handler(req, res, () => {
    if (!res.writableEnded) {
      res.statusCode = 404
      res.end()
    }
  })
).listen(PORT, HOST, () => {
  console.log(`Server listening on http://${HOST}:${PORT}`)
})
