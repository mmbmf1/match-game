import express from 'express'
import { join } from 'path'
import { createClient } from '@supabase/supabase-js'

const app = express()

app.set('views', join(__dirname, '../views'))
app.set('view engine', 'pug')

app.use(express.urlencoded({ extended: true }))

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
)

app.post('/api/board', async (req, res) => {
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

app.get('/api/card/:index', async (req, res) => {
  let match = false
  const index = parseInt(req.params.index, 10)
  const currentColor = req.query.color
  const colorActive = req.query.active === 'true' ? true : false
  const boardId = req.query.boardId

  if (colorActive) {
    const { data: turns, error } = await supabase
      .schema('games')
      .from('turns')
      .select()
      .eq('board_id', boardId)
      .order('created_at', { ascending: false })
    if (error) console.log('👀 🔍 ~ app.get ~ error:', error)

    // first turn
    if (
      !turns?.length ||
      (turns[0].first_card_index && turns[0].second_card_index)
    ) {
      const { data: firstTurn, error } = await supabase
        .schema('games')
        .from('turns')
        .insert({
          board_id: boardId,
          first_card_index: index,
          first_card_color: currentColor,
        })
        .select()
      if (error) console.log('👀 🔍 ~ app.get ~ error:', error)
    } else if (!turns[0].second_card_index) {
      // second turn
      if (turns[0].first_card_index !== index) {
        const { data: secondTurn, error } = await supabase
          .schema('games')
          .from('turns')
          .update({ second_card_index: index, second_card_color: currentColor })
          .eq('id', turns[0].id)
          .select()
        if (error) console.log('👀 🔍 ~ app.get ~ error:', error)

        if (
          secondTurn[0].first_card_color === secondTurn[0].second_card_color
        ) {
          match = secondTurn[0]
        }
      }
    }
  }

  res.render('card', {
    index,
    color: currentColor,
    colorActive,
    boardId,
    match,
  })
})

function generateColorPairs(rows, cols) {
  const totalCards = rows * cols
  const numPairs = totalCards / 2

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

  const selectedColors = colors.slice(0, numPairs)
  const colorPairs = [...selectedColors, ...selectedColors]

  return colorPairs.sort(() => Math.random() - 0.5)
}

export default app
