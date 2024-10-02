import express from 'express'
import { join } from 'path'
const app = express()
import { createClient } from '@supabase/supabase-js'

app.set('views', join(__dirname, '../views'))
app.set('view engine', 'pug')

app.use(express.json())

app.post('/api/board', async (req, res) => {
  console.log('Request received:')
  console.log('Method:', req.method)
  console.log('Headers:', req.headers)
  console.log('Raw body:', req.rawBody)
  console.log('Parsed body:', req.body)
  console.log('Query:', req.query)
  console.log('Params:', req.params)

  const boardSize = req.body['board-size']
  if (!boardSize) return res.send('Error getting board size, no params')
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

  try {
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_KEY
    )
    const { data, error } = await supabase
      .schema('games')
      .from('boards')
      .insert({ size: boardSize.split('x')[0] })
      .select()

    if (error) {
      console.error('Supabase error:', error)
      return res.send('Error creating board')
    }

    const boardId = data[0].id

    const colorPairs = generateColorPairs(rows, cols)
    res.render('board', { rows, cols, colorPairs, boardId })
  } catch (error) {
    return res.status(500).send('Error creating board')
  }
})

app.get('/api/card/:index', (req, res) => {
  const index = parseInt(req.params.index, 10)
  const currentColor = req.query.color
  const colorActive = req.query.active === 'true' ? true : false

  const boardId = req.query.boardId
  console.log('👀 🔍 ~ app.get ~ boardId:', boardId)

  // workflow for card flip
  // check the last turn for the passed boardId
  // if there is not first card, add it to the first_card column in the turns table return to client: "select another card"
  // if there is a first card, add the current card to the second_card column in the turns table
  // check if first and second card are a match
  // if match return to client: "cards matched" and disable the cards
  // if not match return to client: "cards not matched" and flip the cards back over

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
