const cp = require('child_process')
const { resolve } = require('path')
const mongoose = require('mongoose')
const Movie = mongoose.model('Movie')

;(async () => {
  const script = resolve (__dirname, '../crawler/video')
  const child = cp.fork(script, [])
  let invoked = false
  let movies = await Movie.find({})
  let doubanIdList = []
  for (let i = 0; i < movies.length; i++) {
    doubanIdList.push(movies[i].doubanId)
  }

  child.send(doubanIdList)

  child.on('error', err => {
    if (invoked) return

    invoked = true

    console.log(err)
  })

  child.on('exit', code => {
    if (invoked) return

    invoked = true
    let err = code === 0 ? null : new Error('exit code' + code)

    console.log(err)
  })

  child.on('message', async (data) => {
    // https://img3.doubanio.com/view/photo/l_ratio_poster/public/p2388501883.jpg
    let movie = await Movie.findOne({doubanId: data.doubanId})
    movie.video = data.video
    movie.cover = data.cover
    movie.save()
    console.log(movie)
  })
})()