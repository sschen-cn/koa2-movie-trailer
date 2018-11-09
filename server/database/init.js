const mongoose = require('mongoose')
const glob = require('glob')
const {
  resolve
} = require('path')


var env = process.env.NODE_ENV || 'production'
var dbUrl = 'mongodb://127.0.0.1:29999/movie-koa2'

if (env !== 'development') {
  dbUrl = 'mongodb://localhost/movie-test'
}



mongoose.Promise = global.Promise

exports.initSchemas = () => {
  glob.sync(resolve(__dirname, './schema/', '**/*.js')).forEach(require)
}

exports.initAdmin = async () => {
  const User = mongoose.model('User')
  let user = await User.findOne({
    username: 'test'
  })

  if (!user) {
    const user = new User({
      username: 'test',
      email: 'test@test.test',
      password: 'test',
      role: 51
    })
    await user.save()
  }
}

exports.connect = () => {
  let maxConnectTimes = 0

  return new Promise((resolve, reject) => {
    if (process.env.NODE_ENV !== 'production') {
      mongoose.set('debug', true)
    }

    mongoose.connect(dbUrl, {
      useNewUrlParser: true
    })

    mongoose.connection.on('disconnected', () => {
      maxConnectTimes++
      console.log('数据库连接失败次数：' + maxConnectTimes);
      if (maxConnectTimes < 5) {
        mongoose.connect(dbUrl, {
          useNewUrlParser: true
        })
      } else {
        throw new Error('数据库异常，请重新配置')
      }
    })

    mongoose.connection.on('error', err => {
      maxConnectTimes++
      console.log('数据库连接失败次数：' + maxConnectTimes);
      if (maxConnectTimes < 5) {
        mongoose.connect(dbUrl, {
          useNewUrlParser: true
        })
      } else {
        throw new Error('数据库异常，请重新配置')
      }
    })

    mongoose.connection.on('open', () => {
      // const Dog = mongoose.model('Dog', { name: String})
      // const doga = new Dog({name: 'alpha'})

      // doga.save().then(() => {
      //   console.log('wang')
      // })

      resolve()
      console.log('MongoDB Connected successfully!')
    })
  })
}