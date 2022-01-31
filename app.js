const express = require('express')
const exphbs = require('express-handlebars')
const methodOverride = require('method-override')
const bcrypt = require('bcryptjs')

const db = require('./models')
const Todo = db.Todo
const User = db.User

const app = express()
const PORT = 10335

app.engine('hbs', exphbs.engine({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))

app.get('/', (req, res) => {
  res.send('Hello World')
})

app.get('/users/login', (req, res) => {
  res.render('login')
})

app.post('/users/login', (req, res) => {
  res.send('login')
})

app.get('/users/register', (req, res) => {
  res.render('register')
})

app.post('/users/register', async (req, res) => {
  const { name, email, password, confirmPassword } = req.body

  try {
    await User.create({ name, email, password })

  } catch (error) {
    console.error(error)
  }

})

app.get('/users/logout', (req, res) => {
  res.send('logout')
})

app.listen(PORT, () => {
  console.log(`應用程式成功在 http://localhost:${PORT} 執行中...`)
})