const express = require('express')
const app = express()

app.get('/api', (req, res) => {
  console.log('👀 🔍 ~ app.get ~ req:', req)
  res.send('test')
})

app.get('/board', (req, res) => {
  console.log('👀 🔍 ~ app.get ~ req:', req)
  res.send('board is here')
})

module.exports = app
