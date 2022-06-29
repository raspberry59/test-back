const express = require('express')
const router = express.Router()
const pool = require('../../db')

router.get('/', (requset, response) => {
  pool.query(
    'SELECT id, name FROM groups ORDER BY id ASC',
    (error, results) => {
      if (error) return response.sendStatus(500)

      response.status(200).json(results.rows)
    }
  )
})

router.get('/:id', (requset, response) => {
  const id = parseInt(requset.params.id)
  if (typeof id !== 'number' || isNaN(id)) return response.sendStatus(400)

  pool.query('SELECT * FROM groups WHERE id = $1', [id], (error, results) => {
    if (error) return response.sendStatus(500)
    if (results.rowCount === 0) return response.sendStatus(404)

    response.status(200).json(results.rows)
  })
})

router.put('/:id', (request, response) => {
  const id = parseInt(request.params.id)
  if (typeof id !== 'number' || isNaN(id) || !request.body)
    return response.sendStatus(400)
  const { name, parent_id } = request.body

  pool.query(
    'UPDATE groups SET name = $2, parent_id = $3 WHERE id = $1 RETURNING id',
    [id, name, parent_id],
    (error, results) => {
      if (error) return response.sendStatus(500)
      if (results.rowCount === 0) return response.sendStatus(404)

      response.status(200).json(results.rows[0])
    }
  )
})

router.post('/', (request, response) => {
  if (!request.body) return response.sendStatus(400)
  const { name, parent_id } = request.body

  pool.query(
    'INSERT INTO groups (name, parent_id) VALUES ($1, $2) RETURNING id',
    [name, parent_id],
    (error, results) => {
      if (error) return response.sendStatus(500)

      response.status(200).json(results.rows[0])
    }
  )
})

router.delete('/:id', (requset, response) => {
  const id = parseInt(requset.params.id)
  if (typeof id !== 'number' || isNaN(id)) return response.sendStatus(400)

  pool.query('DELETE FROM groups WHERE id = $1', [id], (error, results) => {
    if (error) return response.sendStatus(500)
    if (results.rowCount === 0) return response.sendStatus(404)

    response.status(200).json({ id: id })
  })
})

module.exports = router
