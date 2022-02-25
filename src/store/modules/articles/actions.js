const axios = require('axios');

export default {
  // 글 등록
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

  // 글 불러오기 1
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

  // 글 불러오기 2
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

  // 내가 쓴 글 불러오기
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

  // 내가 쓴 글 삭제
  async deleteMyArticle(context){
    try{
      const token = context.rootGetters.token
      await axios.delete(`http://localhost:3000/article`,
        { headers: { Authorization: `Bearer ${token}` }}
      )
    }catch(e){
      console.log(e)
    }
  },
  
  // 글 업데이트하기
  async updateArticle(context, data){
    const id = data._id

    const articleData = {
      name : data.name,
      description : data.desc,
      areas : data.areas,
      thumbnail: data.thumbnail
    }

    try{
      const token = context.rootGetters.token
      const articles = await axios.patch(`http://localhost:3000/articles/${id}`,
        articleData,
        { headers: { Authorization: `Bearer ${token}` }}
      )

      console.log(articles)
    }catch(e){
      console.log(e)
    }
  },

  // 이미지 업로드
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

  // 이미지 불러오기
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