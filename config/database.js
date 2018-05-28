if (process.env.NODE_ENV === 'production') {
  module.exports = {
    mongoURI: 'mongodb://manot:Khanthong@2040@ds237610.mlab.com:37610/means-db-prod'
  }
} else {
  module.exports = {
    mongoURI: 'mongodb://localhost/meansdb'
  }
}