const express = require('express')
const app = express()

app.get('/api', (req, res) => {
  res.send('test')
})

module.exports = app
