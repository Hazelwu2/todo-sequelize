const express = require('express')
const session = require('express-session')
const exphbs = require('express-handlebars')
const methodOverride = require('method-override')
const bcrypt = require('bcryptjs')

const db = require('./models')
const Todo = db.Todo
const User = db.User

// 載入設定檔
const usePassport = require('./config/passport')
const passport = require('passport')

const app = express()
const PORT = 10335

app.engine('hbs', exphbs.engine({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')
// app.use(bodyParser.urlencoded({ extended: true }))
app.use(methodOverride('_method'))


// Cookie 存的是 session id，session data 存 server
app.use(session({
  secret: 'K,_r*p3h~7G}hq]iL~#jIe7|DMB?E', // 存放在 cookie 的 session id
  resave: false, // 是否強制保存 session，預設是 true
  saveUninitialized: true // session 還沒修改前是否存入 cookie，設定 false 可避免存入太多空的值
}))

usePassport(app)

// Routes

app.get('/', (req, res) => {
  return Todo.findAll({
    raw: true,
    nest: true
  })
    .then(todos => res.render('index', { todos }))
    .catch(error => console.error(error))
})

app.get('/todos/:id', (req, res) => {
  const id = req.params.id
  return Todo.findByPk(id)
    // 資料轉換成 plain Object 使用：todo.toJSON() 
    .then(todo => res.render('detail', { todo: todo.toJSON() }))
    .catch(error => console.log(error))
})

app.get('/users/login', (req, res) => {
  res.render('login')
})

// 加入 middleware，驗證 request 登入狀態
app.post('/users/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/users/login'
}))

app.get('/users/register', (req, res) => {
  res.render('register')
})

app.post('/users/register', (req, res) => {
  const { name, email, password, confirmPassword } = req.body

  User.findOne({ where: { email } }).then(user => {
    if (user) {
      console.log('User already exists')
      return res.render('register', {
        name,
        email,
        password,
        confirmPassword
      })
    }

    return bcrypt
      .genSalt(10) // 產生「鹽」，並設定複雜度係數為 10
      .then(salt => bcrypt.hash(password, salt)) // 為使用者密碼「加鹽」，產生雜湊值
      .then(hash => User.create({
        name,
        email,
        password: hash
      }))
      .then(() => res.redirect('/'))
      .catch(err => console.log(err))
  })
})

app.get('/users/logout', (req, res) => {
  res.send('logout')
})

app.listen(PORT, () => {
  console.log(`應用程式成功在 http://localhost:${PORT} 執行中...`)
})