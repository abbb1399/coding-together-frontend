import { useStore } from "vuex"

export default function useUnreadRequests() {
  const store = useStore()

  const unreadRequestsCount = () => {
    if(store.getters.isAuthenticated){
      store.dispatch("requests/fetchUnreadRequests")
    } 
  }

  return {
    unreadRequestsCount
  }
}