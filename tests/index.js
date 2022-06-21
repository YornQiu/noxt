const Application = require('../packages/core/application')
const router = require('../packages/router')()
const body = require('../packages/body')

const app = new Application()

app.use(body)

router.post('/user/login', async function (req, res) {
  res.body = await req.body()
})

app.use(router.routes())

app.listen(3000)
console.log('listening at port: 3000')
