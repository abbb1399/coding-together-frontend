<template>
  <transition name="side" mode="out-in">
    <div class="sidebar" v-if="sidebar">
      <a class="closebtn" @click="close">&times;</a>

      <div class="sidebar__group">
        <div v-if="!nameEditStatus" class="sidebar__content">
          <p>{{taskName}}</p>
          <button class="kanban-btn" @click="editName">수정</button>
        </div>
        <div v-else class="sidebar__input">
          <base-spinner2 v-if="spinner"/>
          <div v-else>
            <input type="text" v-model="nameInputValue" ref="editInput"/>
            <div class="btn-group">
              <button class="kanban-btn" @click="confrimEditName" :disabled="nameInputValue.length===0">수정</button>
              <button class="kanban-btn" @click="cancleEditName">취소</button>
            </div>
          </div>
        </div>
      </div>

      <div class="sidebar__group">
        <div class="sidebar__content">
          <p>기한</p>
          <button class="kanban-btn" @click="editDate">수정</button>
        </div>
        <div class="sidebar__input">
          <p v-if="!dateEditStatus" class="date-paragraph">{{test}}</p>
          <input v-else @change="changeDate" type="date" :value="dueDate" class="date-input">
        </div>
      </div>

      <div class="sidebar__group">
        <button class="kanban-btn" @click="deleteTask">업무 삭제</button>
      </div>

    </div>
   </transition>
</template>

<script>
export default {
  emit:['close-sidebar', 'update-name','delete-task','update-date'],
  props:{
    sidebar:{
      type: Boolean,
      default:false
    },
    boardId:{
      type:String,
      required:true
    }, 
    taskName:{
      type:String,
      required:true
    },
    taskId:{
      type:String,
    },
    dueDate:{
      type:String
    }
  },
  data(){
    return{
      nameEditStatus: false,
      nameInputValue:'',
      spinner: false,
      dateEditStatus:false,
    }
  },
  watch:{
    taskName(){
      this.nameEditStatus = false
    }
  },
  computed:{
    loadingStatus(){
      return this.spinner
    },
    test(){
      return this.dueDate
    }

  },
  methods:{
    close(){
      this.$emit('close-sidebar')
    },
    editName(){
      this.nameInputValue = this.taskName
      this.nameEditStatus = true
      
      this.$nextTick(()=>{
        this.$refs.editInput.focus()
      })
    },
    confrimEditName(){
      // 같은이름 수정일시
      if(this.taskName === this.nameInputValue){
        return this.nameEditStatus = false
      }

      this.spinner= true
      
      setTimeout(async () => {
        const nameData = {
          status:'NAME',
          boardId : this.boardId,
          taskId: this.taskId,
          taskName: this.nameInputValue,
        }
        this.$emit('update-task',nameData)
        await this.$store.dispatch('kanbans/updateTask', nameData)
       
        this.spinner = false
        this.nameEditStatus = false
      }, 1000);
    },
    cancleEditName(){
      this.nameEditStatus = false
    },
    editDate(){
      this.dateEditStatus = !this.dateEditStatus
    },
    async changeDate(e){
      const dateData = {
        status:'DATE',
        boardId : this.boardId,
        taskId: this.taskId,
        taskDate: e.target.value
      }
      this.$emit('update-task',dateData)
      await this.$store.dispatch('kanbans/updateTask', dateData)

      this.dateEditStatus = false
    },
    deleteTask(){
      this.$emit('delete-task')
    }
  }
}
</script>

<style lang="scss" scoped>
  .sidebar {
    height: 100%;
    width: 23vw;
    position: fixed;
    z-index: 1;
    top: 0;
    right: 0;
    background-color: #fafafa;
    overflow-x: hidden;
    padding-top: 60px;
    box-shadow: -4px 0 8px #bfbfbf;

    &__group{
      width: 90%;
      margin: 0 auto;
      padding: 1rem 0 1rem 0;
      border-bottom: 1px solid #dbdbdb;
    }

    &__content{
      display: flex;
      justify-content: space-between;
      align-items: center;

      p{
        font-weight: 600;
      }
    }

    &__input{
      input{
        width: 100%;
        border-radius: 5px;
        border: 1px solid black;
        padding: 5px;
      }


      .btn-group{
        display: flex;
        justify-content: space-between;
        margin-top: .5rem;
      }

      .date-paragraph{
        margin-top: .7rem;
      }

      .date-input{
        margin-top: .7rem;
      }
    }

    .closebtn {
      position: absolute;
      top: 0;
      right: 25px;
      font-size: 36px;
      margin-left: 50px;
      cursor: pointer;
    }
  }

  .kanban-btn{
    background: #fff;
    border-radius: 5px;
    border: 1px solid gray;
    font-size: 10px;
    padding: 5px;
    cursor: pointer;
    width: 3.5rem;

    &:hover,
    &:active{
      background: darken(#fff, 5%)
    }
  }

  // Vue Transition css
  .side-leave-to{
    opacity: 0;
    transform: translateX(30px);
  }

  .side-leave-active{
    transition: all 0.2s ease-in;
  }

  // .side-enter-to,
  // .side-leave-from{
  //   opacity: 1;
  //   transform: translateX(0);
  // }
</style>