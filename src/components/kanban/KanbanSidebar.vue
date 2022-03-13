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
          <input type="text" v-model="nameValue" ref="editInput"/>
          <div class="btn-group">
            <button @click="confirmEdit" :disabled="nameValue.length===0">수정</button>
            <button @click="cancleEdit">취소</button>
          </div>
        </div>
      </div>

      <div class="sidebar__group">
        <div class="sidebar__content">
          <p>dueDate</p>
          <button class="kanban-btn">수정{{taskId}}</button>
        </div>
      </div>
    </div>
   </transition>
</template>

<script>
export default {
  emit:['close-sidebar', 'update-name'],
  props:{
    sidebar:{
      type: Boolean,
      default:false
    },
    taskName:{
      type:String,
      required:true
    },
    taskId:{
      type:Number,
    }
  },
  data(){
    return{
      nameEditStatus: false,
      nameValue:''
    }
  },
  watch:{
    taskName(){
      this.nameEditStatus = false
    }
  },
  methods:{
    close(){
      this.$emit('close-sidebar')
    },
    editName(){
      setTimeout(() => {
        this.$refs.editInput.focus()
      }, 100);

      this.nameValue = this.taskName
      this.nameEditStatus = true
    },
    confirmEdit(){
      const nameData = {
        id: this.taskId,
        name: this.nameValue
      }
      this.$emit('update-name',nameData)
    },
    cancleEdit(){
      this.nameEditStatus = false
    }
  }
}
</script>

<style lang="scss" scoped>
  .sidebar {
    height: 100%;
    width: 21vw;
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

  button{
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