const swaggerDoc = require('../swagger.json')
const swaggerUi = require('swagger-ui-express')

const express = require('express')
const app = express()
const PORT = process.env.PORT || 3000

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc))

app.get('/health-check', (req, res) => {
  res.json({ status: 'Server is up and running' })
})

app.get('/user/:id', (req, res) => {
  try {
    const userId = req.params.id
    
    if (userId === 'error') {
      throw new Error('Something went wrong')
    }

    if (userId !== '1') {
      res.status(404).json({ error: 'User not found' })
    } else {
      res.json({ user: { id: userId, name: 'User name' } })
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' })
  }
})

app.use((req, res, next) => {
  res.status(404).json({ error: 'Not Found' })
})

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`)
})
