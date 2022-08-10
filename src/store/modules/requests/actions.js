import axios from "axios"
import {address} from '../../../../config/address'

export default {
  async contactCoach(context, request){
    try{
      const response = await axios.post(
        `${address}/requests`, 
        request,
      )
      request.id = response._id
      // newRequest.coachId = payload.coachId

      context.commit('addRequest', request)
    }catch(e){
      console.log(e)
    }
  },

  async fetchRequests(context,page){
    // 로그인한사람의 유저 아이디
    // const userId = context.rootGetters.userId
    const token = context.rootGetters.token

    try{
      const {data} = await axios.get(
        `${address}/requests/${page}`,
        { headers: { Authorization: `Bearer ${token}` }}
      )

      context.commit('setRequests', data)
    }catch(e){
      console.log(e)
    }
  },

  haveRequestRead(_,id){
    try{
      axios.patch(`${address}/requests/${id}`)
    }catch(e){
      console.log(e)
    }
  }
}