import express from 'express'

const app = express()

// Use express.urlencoded() middleware
app.use(express.urlencoded({ extended: true }))

app.post('/api/board', (req, res) => {
  console.log('Parsed Body:', req.body) // Log the parsed body
  const boardSize = req.body['board-size']
  if (!boardSize) return res.send('Error getting board size, no params')

  // Your existing logic here...
  res.send('Board size received: ' + boardSize)
})

app.get('/api/card/:index', (req, res) => {
  res.send('Card endpoint')
})

export default app
