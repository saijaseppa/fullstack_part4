const _ = require('lodash')

const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {

    if (blogs.length === 0) {
        return 0
    }
    else if (blogs.length === 1) {
        return blogs[0].likes
    }
    else {
        let amount = 0
        blogs.forEach(blog => {
            amount = amount + blog.likes
        })
        return amount
    }
}

const favoriteBlog = (blogs) => {
    if (blogs.length === 0) {
        return {}
    }
    else if (blogs.length === 1) {
        return {
            'title': blogs[0].title,
            'author': blogs[0].author,
            'likes': blogs[0].likes
        }
    }
    else {
        let mostLikes = { likes: 0 }
        blogs.forEach(blog => {
            if (blog.likes > mostLikes.likes) {
                mostLikes = blog
            }
        })
        return {
            title: mostLikes.title,
            author: mostLikes.author,
            likes: mostLikes.likes
        }
    }
}

const mostBlogs = (blogs) => {
    if (blogs.length === 0) {
        return {}
    }
    else if (blogs.length === 1) {
        return {
            author: blogs[0].author,
            blogs: 1
        }
    }
    else {

        const mostFrequent = _.maxBy(Object.values(_.groupBy(blogs, blog=> blog.author)), arr => arr.length)[0]
        //console.log('lodashhh the most frequent object: ', mostFrequent);
        let blogAmount = 0
        _.forEach(blogs, function(blog) {
            if (blog.author === mostFrequent.author) {
                blogAmount++
            }
        })
        //console.log('blogAmount', blogAmount);
        
        //blogs.forEach(blog => {
        //    let counts = _.countBy(blogs, 'author')
        //    console.log('countsarray', counts);
            //let count = _.sortedLastIndexBy(blogs, {'author': blog.author})
            /*if (count > blogAmount) {
                authorWithMostBlogs = blog.author
                console.log('löydettyjen määrä: ', count);
                blogAmount = count
            }*/
        //})
        
        return {
            author: mostFrequent.author,
            blogs: blogAmount
        }
    }
}

const mostLikes = (blogs) => {
    if (blogs.length === 0) {
        return {}
    }
    else if (blogs.length === 1) {
        return {
            author: blogs[0].author,
            likes: blogs[0].likes
        }
    }
    else {
        //const mostFrequent = _.maxBy(Object.values(_.groupBy(blogs, blog=> blog.author)), arr => arr.length)[0]
        const groupedByAuthor = _.groupBy(blogs, blog=> blog.author);
        console.log('grouped:', groupedByAuthor);
        
        //const likesAmount = _.sumBy(Object.values(_.groupBy(groupedByAuthor, author => author.likes)), arr => arr.lenght)[0]
        const most = 0
        const author = ''
        _.forEach(groupedByAuthor, function(auth) {
           const amount = _.sum(auth.likes)
           if (amount > most) {
            most = amount
            author = auth.author
           }
        })

        console.log('likes maara:', most);
        console.log('author: ', author);
        
        

        return 0
    }
    
}


module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}