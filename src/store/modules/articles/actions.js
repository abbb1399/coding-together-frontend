const axios = require('axios');

export default {
  async registerArticle(context, data){
    const userId = context.rootGetters.userId

    const articleData = {
      name : data.name,
      description : data.desc,
      areas : data.areas,
      thumbnail: data.thumbnail
    }

    const token = context.rootGetters.token

    try{
      await axios.post(
        'http://localhost:3000/articles', 
        articleData,
        { headers: { Authorization: `Bearer ${token}` }}
      )   

      context.commit('registerArticle',{
        ...articleData,
        id:userId
      })
    }catch(e){
      console.log(e)
    } 
  },

  async loadArticles(context){
    // console.log(payload.forceRefresh)
    // console.log(context.getters.shouldUpdate)

    // if(!payload.forceRefresh && !context.getters.shouldUpdate){
    //   console.log('여기임??')
    //   return
    // }
  
    try{
      const { data } = await axios.get('http://localhost:3000/article-list')

      const articles = []

      data.forEach(element => {
        const dataObj = {
          id: element._id,
          name: element.name,
          description: element.description,
          areas: element.areas,
          owner: element.owner,
          thumbnail: element.thumbnail,
          updatedAt: element.updatedAt
        }
        articles.push(dataObj)
      });  
      
      context.commit('setArticles', articles)
      // context.commit('setFetchTimestamp')  
    }catch(e) {
      console.log(e)
    }
  },

  async moreLoadArticles(context, payload){  
    // console.log(payload.filter)
    try{
      const { data } = await axios.get(`http://localhost:3000/more-article-list/${payload.pageNum}`,{
        params: {
          filter: payload.filter
        }
      })

      const articles = []

      data.forEach(element => {
        const dataObj = {
          id: element._id,
          name: element.name,
          description: element.description,
          areas: element.areas,
          owner: element.owner,
          thumbnail: element.thumbnail,
          updatedAt: element.updatedAt
        }
        articles.push(dataObj)
      });  
      
      context.commit('setArticles', articles)
      // context.commit('setFetchTimestamp')
    }catch(e) {
      console.log(e)
    }
  },

  async fetchMyArticle(context){
    try{
      const token = context.rootGetters.token
      const { data } = await axios.get(`http://localhost:3000/my-article`,
       { headers: { Authorization: `Bearer ${token}` }}
      )

      context.commit('setMyArticle', data)
    }catch(e){
      console.log(e)
    }
  },

  async uploadImage(context,file){
    try{
      const {data} = await axios.post(
       'http://localhost:3000/images',
       file
      )
      context.commit('setUploadFileName', data)
    }catch(e){
      console.log(e)
    }
  },

  async fetchArticleImage(context, filename){
    try{
      await axios.get(
        `http://localhost:3000/images/${filename}`
      )
    }catch(e){
      console.log(e)
    }
  }
}