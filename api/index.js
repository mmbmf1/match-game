const express = require('express')
const app = express()
const path = require('path')
const pug = require('pug')

app.set('views', path.join(__dirname, '../views'))
app.set('view engine', 'pug')

app.get('/api', (req, res) => {
  console.log('👀 🔍 ~ app.get ~ req:', req)
  res.send('test')
})

app.get('/api/board', (req, res) => {
  // console.log('👀 🔍 ~ app.get ~ req:', req.query)
  const boardSize = req.query['board-size'] // Get board size from query string
  if (!boardSize) return res.send('Error getting board size')
  // const board = pug.compileFile('views/board.pug')
  // res.send('board is here')
  let rows, cols

  // Determine the number of rows and columns based on the board size
  switch (boardSize) {
    case '4x4':
      rows = 4
      cols = 4
      break
    case '6x6':
      rows = 6
      cols = 6
      break
    case '8x8':
      rows = 8
      cols = 8
      break
    default:
      return res.status(400).send('Invalid board size selected')
  }

  const colorPairs = generateColorPairs(rows, cols)

  console.log('👀 🔍 ~ app.get ~ colorPairs:', colorPairs)

  // Render the Pug template with rows and cols
  res.render('board', { rows, cols })
})

function generateColorPairs(rows, cols) {
  const numPairs = (rows * cols) / 2
  const colors = [
    '#FF5733',
    '#33FF57',
    '#3357FF',
    '#FF33A1',
    '#F0FF33',
    '#33FFF0',
    '#FF8C33',
    '#8C33FF',
  ]
  const selectedColors = colors.slice(0, numPairs)
  const colorPairs = [...selectedColors, ...selectedColors]

  for (let i = colorPairs.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[colorPairs[i], colorPairs[j]] = [colorPairs[j], colorPairs[i]]
  }

  return colorPairs
}

module.exports = app
