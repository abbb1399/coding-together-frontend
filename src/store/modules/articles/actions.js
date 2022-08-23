import axios from "../../../plugins/axios"

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
        '/articles', 
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

  // 글 리스트 불러오기
  async loadArticles(context, payload){  
    try{  
      const { data } = await axios.get(
        `/articles/${payload.pageNum}`,{
        params: {
          filter: payload.filter
        }
      })

      const articles = data.map(element => {
        return {
          id: element._id,
          name: element.name,
          description: element.description,
          areas: element.areas,
          owner: element.owner,
          thumbnail: element.thumbnail,
          updatedAt: element.updatedAt
        }
      });  
      
      context.commit('setArticles', articles)
    }catch(e) {
      return Promise.reject({message: '서버에서 불러오는데 실패 했습니다.'})
    }
  },

  // 글 내용 불러오기
  async loadArticleDetail(context,id){
    try{
      const {data} = await axios.get(`/article/${id}`)
    
      context.commit('setArticle',data)
    }catch(e){
      return Promise.reject({message: '없는 글입니다.'})
    }
  },

  // 내가 쓴 글 전부 불러오기
  async fetchMyArticle(context,pageNum){
    try{
      const token = context.rootGetters.token
      const { data } = await axios.get(`/my-article/${pageNum}`,
       { headers: { Authorization: `Bearer ${token}` }}
      )

      context.commit('setMyArticle', data)
    }catch(e){
      console.log(e)
    }
  },

  // 내가 쓴 글 하나 불러오기
  async fetchMyArticleDetail(context,id){
    try{
      const token = context.rootGetters.token
      const { data } = await axios.get(`/my-article-detail/${id}`,
       { headers: { Authorization: `Bearer ${token}` }}
      )

      context.commit('setMyArticleDetail', data)
    }catch(e){
      console.log(e)
    }
  },


  // 내가 쓴 글 삭제
  async deleteMyArticle(context,id){
    try{
      const token = context.rootGetters.token
      await axios.delete(`/article/${id}`,
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
      await axios.patch(`/articles/${id}`,
        articleData,
        { headers: { Authorization: `Bearer ${token}` }}
      )
    }catch(e){
      console.log(e)
    }
  },

  // 이미지 업로드
  async uploadImage(context,{file, type}){
    try{
      const {data} = await axios.post(
       `/images/${type}`,
       file,
       { headers: {'Content-Type': 'multipart/form-data'}}
      )
     
      context.commit('setUploadFileName', data)
    }catch(e){
      throw new Error('5mb 미만의 jpg/jpeg/png 를 올려주세요.')
    }
  }
}