export default {
  registerArticle(state, payload){
    state.articles.push(payload)
  },
  setArticles(state, payload){
    state.articles = payload
  },
  setFetchTimestamp(state){
    state.lastFetch = new Date().getTime()
  },
  setUploadFileName(state, fileName){
    state.fileName = fileName
  },
  setMyArticle(state, myList){
    state.myList = myList
  }

}