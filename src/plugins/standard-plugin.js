import moment from 'moment'
import swal from 'sweetalert2'

export default{
  install(app){
    // app.config.globalProperties.$moment = moment

    
    // moment.js를 자주 쓰기 때문에 plugin에 등록
    app.provide('$moment', moment)

    // sweetalert2 등록
    app.provide('$swal', swal)

    // input,textarea focus
    app.directive('focus',{
      mounted(el){
        el.focus()
      }
    })

    // highlight
    app.directive('highlight',{
      mounted(el){
        el.style.color = 'red'
      }
    })
  }
}