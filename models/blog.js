const mongoose = require('mongoose')
const config = require('../utils/config')
const logger = require('../utils/logger')

const mongoUrl = config.MONGODB_URI

logger.info('connecting to mongo')
mongoose.connect(mongoUrl)
    .then(result => {
        logger.info('connected to MongoDB')
    })
    .catch((error) => {
        logger.error('error connecting to MongoDB:', error.message)
    })


const blogSchema = new mongoose.Schema({
    title: String,
    author: String,
    url: String,
    likes: Number
})

blogSchema.set('toJSON', {
    transform: (_document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject._v
    }
})

module.exports = mongoose.model('Blog', blogSchema)
