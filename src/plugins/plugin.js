import moment from 'moment'

export default{
  install(app){
    // moment.js를 자주 쓰기 때문에 plugin에 등록
    // app.config.globalProperties.$moment = moment
    app.provide('$moment', moment)


    app.directive('highlight',{
      mounted(el){
        el.style.color = 'red'
      }
    })
  }
}