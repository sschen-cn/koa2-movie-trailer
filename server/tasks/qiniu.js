const qiniu = require('qiniu')
const nanoid = require('nanoid')
const config = require('../config')
const mongoose = require('mongoose')
const Movie = mongoose.model('Movie')

const bucket = config.qiniu.bucket
const mac = new qiniu.auth.digest.Mac(config.qiniu.AK, config.qiniu.SK)
const cfg = new qiniu.conf.Config()
const client = new qiniu.rs.BucketManager(mac, cfg)

const uploadToQiniu = async (url, key) => {
  return new Promise((resolve, reject) => {
    client.fetch(url, bucket, key, (err, ret, info) => {
      if (err) {
        reject(err)
      } else {
        if (info.statusCode === 200) {
          resolve({ key })
        } else {
          reject(info)
        }
      }
    })
  })
}

;(async () => {
  // let moviesList = await Movie.find({})
  // console.log(moviesList)
  // for (let i = 0; i < moviesList.length; i++) {
  //   let movies = [{
  //     video: moviesList[i].video,
  //     doubanId: moviesList[i].doubanId,
  //     cover: moviesList[i].cover,
  //     poster: moviesList[i].poster
  //   }]
  let movies = await Movie.find({})
  movies.map(async movie => {
    if (movie.video && !movie.videoKey) {
      try {
        console.log('开始传video')
        let videoData = await uploadToQiniu(movie.video, nanoid() + '.mp4')
        // console.log('开始传cover')
        // let coverData = await uploadToQiniu(movie.cover, nanoid() + '.jpg')
        // console.log('开始传poster')
        // let posterData = await uploadToQiniu(movie.poster, nanoid() + '.jpg')
        await(1000)
        if(videoData.key) {
          movie.videoKey = videoData.key
        }
        // if(coverData.key) {
        //   movie.coverKey = coverData.key
        // }
        // if(posterData.key) {
        //   movie.posterKey = posterData.key
        // }
      } catch (err) {
        console.log(err)
      }
      movie.save()
    }
    if (movie.cover && !movie.coverKey) {
      try {
        console.log('开始传cover')
        let coverData = await uploadToQiniu(movie.cover, nanoid() + '.jpg')
        await(1000)
        if(coverData.key) {
          movie.coverKey = coverData.key
        }
    } catch (err) {
      console.log(err)
      }
      movie.save()
    }
    if (movie.poster && !movie.posterKey) {
      try {
        console.log('开始传cover')
        let coverData = await uploadToQiniu(movie.poster, nanoid() + '.jpg')
        await(1000)
        if(coverData.key) {
          movie.posterKey = coverData.key
        }
      } catch (err) {
        console.log(err)
      }
      movie.save()
    }
  })

  console.log('电影数据更新完毕')
  // let movies = [{
  //   video: 'http://vt1.doubanio.com/201810250103/ad560e20c22a1623c18609e527e5af61/view/movie/M/302050194.mp4',
  //   doubanId: '3025375',
  //   cover: 'https://img3.doubanio.com/img/trailer/medium/2388151680.jpg?',
  //   poster: 'https://img3.doubanio.com/view/photo/l_ratio_poster/public/p2388501883.jpg'
  // }]

})()