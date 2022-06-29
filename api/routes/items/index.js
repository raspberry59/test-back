const express = require('express')
const router = express.Router()
const pool = require('../../db')

router.get('/', (request, response, next) => {
  pool.query('SELECT id, name FROM items ORDER BY id ASC', (error, results) => {
    if (error) return response.sendStatus(500)
    if (error)
      return next(
        new Error('This is an error and it should be logged to the console')
      )

    response.status(200).json(results.rows)
  })
})

router.get('/:id', (request, response) => {
  const id = parseInt(request.params.id)
  if (typeof id !== 'number' || isNaN(id)) return response.sendStatus(400)

  pool.query('SELECT * FROM items WHERE id = $1', [id], (error, results) => {
    if (error) return response.sendStatus(500)
    if (results.rowCount === 0) return response.sendStatus(404)

    response.status(200).json(results.rows)
  })
})

router.put('/:id', (request, response) => {
  const id = parseInt(request.params.id)
  if (typeof id !== 'number' || isNaN(id) || !request.body)
    return response.sendStatus(400)
  const { name, description, manufacturer } = request.body

  pool.query(
    'UPDATE items SET name = $2, description = $3, manufacturer = $4 WHERE id = $1 RETURNING id',
    [id, name, description, manufacturer],
    (error, results) => {
      if (error) return response.sendStatus(500)
      if (results.rowCount === 0) return response.sendStatus(404)

      response.status(200).json(results.rows[0])
    }
  )
})

router.post('/', (request, response) => {
  if (!request.body) return response.sendStatus(400)

  const { name, description, manufacturer } = request.body

  pool.query(
    'INSERT INTO items (name, description, manufacturer) VALUES ($1, $2, $3) RETURNING id',
    [name, description, manufacturer],
    (error, results) => {
      if (error) return response.sendStatus(500)

      response.status(200).json(results.rows[0])
    }
  )
})

router.delete('/:id', (request, response) => {
  const id = parseInt(request.params.id)
  if (typeof id !== 'number' || isNaN(id)) return response.sendStatus(400)

  pool.query('DELETE FROM items WHERE id = $1', [id], (error, results) => {
    if (error) return response.sendStatus(500)
    if (results.rowCount === 0) return response.sendStatus(404)

    response.status(200).json({ id: id })
  })
})

module.exports = router
