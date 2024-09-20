import express from 'express'
import { join } from 'path'
const app = express()

app.set('views', join(__dirname, '../views'))
app.set('view engine', 'pug')

app.get('/api/board', (req, res) => {
  const boardSize = req.query['board-size']
  if (!boardSize) return res.send('Error getting board size')
  let rows, cols

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
  res.render('board', { rows, cols, colorPairs })
})

app.get('/api/card/:index', (req, res) => {
  const index = parseInt(req.params.index, 10)
  const currentColor = req.query.color
  const colorActive = req.query.active === 'true' ? true : false

  res.render('card', {
    index,
    color: currentColor,
    colorActive,
  })
})

function generateColorPairs(rows, cols) {
  const totalCards = rows * cols
  const numPairs = totalCards / 2

  // later this could be just colors in a DB; i.e. select * from colors order by random() limit totalCards
  const colors = [
    '#FF5733',
    '#33FF57',
    '#3357FF',
    '#FF33A1',
    '#F0FF33',
    '#33FFF0',
    '#FF8C33',
    '#8C33FF',
    '#FFC300',
    '#DAF7A6',
    '#FF6F61',
    '#6B5B95',
    '#88B04B',
    '#F7D8BA',
    '#B5E48F',
    '#FF9B85',
    '#E91E63',
    '#00BCD4',
    '#FFEB3B',
    '#CDDC39',
    '#673AB7',
    '#FF5722',
    '#4CAF50',
    '#9C27B0',
    '#3F51B5',
    '#607D8B',
    '#009688',
    '#795548',
    '#FFC107',
    '#8BC34A',
    '#F44336',
    '#2196F3',
    '#FF9800',
  ]

  // Select the required number of unique colors
  const selectedColors = colors.slice(0, numPairs)

  // Create pairs of colors
  const colorPairs = [...selectedColors, ...selectedColors]

  return colorPairs.sort(() => Math.random() - 0.5)
}

export default app
