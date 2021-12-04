import axios from "axios"

export default {
  async contactCoach(context, payload){
    const newRequest = {
      email: payload.email,
      message: payload.message
    }
    
    axios.post(
      'http://localhost:3000/requests', 
      newRequest,
    ).then(response =>{
      newRequest.id = response._id
      newRequest.coachId = payload.coachId

      context.commit('addRequest', newRequest)
    }).catch(e=>{
      console.log(e)
    })
    // const response = await fetch(`https://coach-finder-a904f-default-rtdb.asia-southeast1.firebasedatabase.app/requests/${payload.coachId}.json`,{
    //   method: 'POST',   // id를 새로 생성하기때문에 put이아닌 post
    //   body:JSON.stringify(newRequest)
    // })

    // const responseData = await response.json()

    // if(!response.ok){
    //   const error = new Error(responseData.message || 'send request 실패')
    //   throw error
    // }

    // newRequest.id = responseData.name //name이 unique id. 자동으로 생성. 자세한 사항은 문서 살펴보셈
    // newRequest.coachId = payload.coachId

    // context.commit('addRequest', newRequest)
  },

  async fetchRequests(context){
    // 로그인한사람의 유저 아이디
    const coachId = context.rootGetters.userId
    
    const token = context.rootGetters.token


    console.log(coachId)
    console.log(token)


    const reponse = await axios.get(
      `http://localhost:3000/requests/${coachId}`
      // { headers: { Authorization: `Bearer ${token}` }}
    )

    console.log(reponse)


    // const response = await fetch(`https://coach-finder-a904f-default-rtdb.asia-southeast1.firebasedatabase.app/requests/${coachId}.json?auth=${token}`)
    // const responseData = await response.json()

    // if(!response.ok){
    //   const error = new Error(responseData.message || 'send request 실패')
    //   throw error
    // }

    // const requests = []

    // for (const key in responseData){
    //   const request = {
    //     id: key,
    //     coachId: coachId,
    //     userEmail: responseData[key].userEmail,
    //     message: responseData[key].message
    //   }
    //   requests.push(request)
    // }
    // context.commit('setRequests', requests)
  }
}