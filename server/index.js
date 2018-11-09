const Koa = require('koa')
const mongoose = require('mongoose')
const views = require('koa-views')
const {
  resolve
} = require('path')
const {
  connect,
  initSchemas,
  initAdmin
} = require('./database/init')
const R = require('ramda')
const MIDDLEWARES = ['parcel', 'common', 'router']

const useMiddlewares = (app) => {
  R.map(
    R.compose(
      R.forEachObjIndexed(
        initWith => initWith(app)
      ),
      require,
      name => resolve(__dirname, `./middlewares/${name}`)
    )
  )(MIDDLEWARES)
}

console.log('开始连接数据库');
(async () => {
  await connect()

  initSchemas()

  await initAdmin()

  // require('./tasks/movie')
  // require('./tasks/api')
  // require('./tasks/trailer')
  // require('./tasks/qiniu')

  const app = new Koa()
  await useMiddlewares(app)

  app.listen(3001)
})()