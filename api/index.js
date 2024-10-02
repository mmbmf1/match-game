import express from 'express'

const app = express()

// Temporarily remove all body-parsing middleware
// app.use(express.json())
// app.use(express.urlencoded({ extended: true }))

app.post('/api/board', (req, res) => {
  let body = ''
  req.on('data', (chunk) => {
    body += chunk.toString() // Convert Buffer to string
  })
  req.on('end', () => {
    console.log('Raw Body:', body) // Log the raw body
    res.send('Received')
  })
})

app.get('/api/card/:index', (req, res) => {
  res.send('Card endpoint')
})

export default app
