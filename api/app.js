const express = require('express')
const bodyParser = require('body-parser')
const fs = require('fs')
const items = require('./routes/items/')
const groups = require('./routes/groups/')

const port = process.env.API_PORT
const app = express()

app.use(bodyParser.json())

app.use(function (request, response, next) {
  let now = new Date().toUTCString()
  let data = `${now} - ${request.method} ${request.url} - ${request.get(
    'user-agent'
  )} - ${request.ip}`
  console.log(data)
  fs.appendFile('access.log', data + '\n', function () {})
  next()
})

app.get('/', (request, response) => {
  response.send(`It's Alive`)
})

app.use('/items', items)
app.use('/groups', groups)

app.listen(port, () => {
  console.log(`server started on ${port}`)
})
