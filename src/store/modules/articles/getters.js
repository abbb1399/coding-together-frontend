export default {
  articles(state){
    return state.articles
  },
  article(state){
    return state.article
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
  getUploadFileName(state){
    return state.fileName
  },
  getMyPageList(state){
    return state.myList
  }
}