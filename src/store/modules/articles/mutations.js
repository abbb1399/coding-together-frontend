export default {
  registerArticle(state, payload){
    state.articles.push(payload)
  },
  setArticles(state, payload){
    state.articles = payload
  },
  setArticle(state,payload){
    state.article = payload
  },
  setUploadFileName(state, fileName){
    state.fileName = fileName
  },
  setMyArticle(state, myList){
    state.myList = myList.articles
    state.total = myList.total
  },
  setMyArticleDetail(state, myListDetail){
    state.myListDetail = myListDetail
  }
}