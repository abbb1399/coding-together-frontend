export default {
  articles(state){
    return state.articles
  },
  hasArticles(state){
    return state.articles && state.articles.length > 0
  },
  // state,getters,rootState,rootGetters
  isArticle(_,getters,_2,rootGetters){
    const articles = getters.articles
    const userId = rootGetters.userId

    // console.log(articles)
    // console.log(userId)
    return articles.some(article => article.owner === userId)
  },
  shouldUpdate(state){
    const lastFetch = state.lastFetch
    if(!lastFetch){
      return true
    }
    const currentTimeStamp = new Date().getTime()
    return (currentTimeStamp - lastFetch) / 1000 > 60 // 1분 보단 길게
  },
  getUploadFileName(state){
    return state.fileName
  },
  getMyPageList(state){
    return state.myList
  }
}