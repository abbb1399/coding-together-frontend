<template>
  <section>
    <div class="boards-container">
      <div class="boards-container__board" v-for="(board, index) in boardList" :key="index">
        <draggable  
          v-model="board.list" 
          item-key="id" 
          group="people" 
          :animation="90"
          :multiDrag="true" 
          
          @change="moveTask($event,board._id)"
          @start="dragStart"
          @end="dragEnd"
    
          class="test2"

          ghostClass= "ghost"
          chosenClass= "chosen"
          dragClass="drag"

          :forceFallback="true"
          :fallbackTolerance="3"
        >
          <template #header>
            <div class="boards-container__board__header">
              <h1>{{board.title}}</h1>
              <div class="header__control">
                <p><font-awesome-icon icon="tag"/>&nbsp;{{board.list.length}}</p>
                <button class="boards-container__btn" @click="openAddInput(board, index)">
                  <font-awesome-icon icon="plus" />
                </button>
              </div>     
            </div>
            <div class="boards-container__board__input" v-if="inputStatus && currIndex === index">
              <base-spinner2 v-if="spinnerStatus" />
              <div v-else>
                <p>제목</p>
                <input type="text" v-model="inputValue" @keydown.enter="addTask(board,index)"/>
                <div class="btn__group">
                  <button 
                    class="boards-container__btn" 
                    @click="addTask(board,index)"
                    :disabled="inputValue.length === 0"
                  >
                    생성
                  </button>
                  <button class="boards-container__btn" @click="cancleAdding(index)">취소</button>
                </div>
              </div>
            </div>
          </template>

          <template #item="{ element }">
            <div 
              class="boards-container__board__card" 
              :class="{'selected-task': element.id === selectedTask}"
              @click="clickTaskOpenSideBar(element, board._id)"
            >
              {{ element.name }} {{element.date}}
            </div>
          </template>
        </draggable>
       </div>
    </div>

    <!-- 사이드바 -->
    <kanban-sidebar 
      :sidebar="sidebar"
      :board-id="boardId"
      :task-name="taskName"
      :task-id="taskId"
      :due-date="dueDate"
      @close-sidebar="closeSideBar"
      @update-task="updateTask"
      @delete-task="deleteTask"
    />

  </section>
</template>

<script>
import draggable from "vuedraggable";
import KanbanSidebar from '../../components/kanban/KanbanSidebar.vue'

export default {
  components: {
    draggable,
    KanbanSidebar
  },
  data(){
    return{
      spinnerStatus: false,
      taskId:null,
      taskName:'',
      sidebar: false,
      inputValue:'',
      currIndex:null,
      inputStatus: false,
      boardId:'',
      selectedTask:'',
      dueDate: '없음'
    }
  },
  computed:{
    addStstus(){
      return this.inputStatus
    },
    boardList(){
      return this.$store.getters['kanbans/kanbans']
    }
  },
  async created(){
    await this.$store.dispatch('kanbans/fetchKanbans')
  },
  methods: {
    closeSideBar(){
      this.sidebar = false
    },
    moveTask({added,removed,moved}, boardId) {
      if(added){
        this.$store.dispatch('kanbans/moveTask',{
          status: 'added',
          boardId : boardId,
          task: added.element
        })
      }else if(removed){
        this.$store.dispatch('kanbans/moveTask',{
           status:'removed',
           boardId: boardId,
           task: removed.element
         })
      }else if(moved){
        console.log(moved)
        this.$store.dispatch('kanbans/changeTaskOrder',{
         ...moved,
         boardId: boardId
        })
      }
    },
    dragStart(){
      this.setDragCursor(true)
    },
    dragEnd(){
      this.setDragCursor(false)
    },
    setDragCursor (value) {
      const html = document.getElementsByTagName('html').item(0)
      html.classList.toggle('grabbing', value)
    },
    openAddInput(board, index){
      if(this.inputStatus && this.currIndex === index){
        this.inputStatus = false
      }else{
        this.inputValue = ''
        this.inputStatus = true
      }
      this.currIndex = index
    },
    cancleAdding(){
      this.inputStatus = false
    },
    addTask(board){
      if(this.inputValue.length === 0) return
      this.spinnerStatus = true

      setTimeout(() => {
        const data = {
          id:'TA' + Date.now().toString(36) + Math.random().toString(36).substr(2),
          name:this.inputValue
        }

        board.list.push(data)
        this.$store.dispatch('kanbans/registerTask', {...data, boardId: board._id})
        
        // 초기화
        this.inputValue = ''
        this.spinnerStatus = false
      }, 1000);
    },
    clickTaskOpenSideBar(element,boardId){
      this.dueDate= '없음'

      // 업무 클릭시 옅은파랑으로
      this.selectedTask = element.id

      this.sidebar = true
      this.boardId = boardId
      this.taskName = element.name
      this.taskId = element.id
      
      if(element.date){
        this.dueDate = element.date
      }
    },
    updateTask(taskData){
      const selectedBoard = this.boardList.find(board => board._id === taskData.boardId)
      const selectedTask = selectedBoard.list.find(data => data.id === taskData.taskId )

      if(taskData.status === 'NAME'){
        selectedTask.name=  taskData.taskName
        this.taskName = taskData.taskName
      }else if(taskData.status === 'DATE'){
        selectedTask.date = taskData.taskDate
        this.dueDate = taskData.taskDate
      }
    },
    deleteTask(){
      console.log('ddd')
    }
  }
}
</script>



<style lang="scss" scoped>
  .test2{
    // background: red;
    height: 84vh;
    overflow-y: auto;
    overflow-x: hidden;
  }

  .grabbing * {
    cursor: move !important; /* fallback: no `url()` support or images disabled */
    cursor: -webkit-grabbing !important; /* Chrome 1-21, Safari 4+ */
    cursor:    -moz-grabbing !important; /* Firefox 1.5-26 */
    cursor:         grabbing !important; /* W3C standards syntax, should come least */
  }

  .ghost {
    opacity: 0.5;
  }

  .chosen{
    // color: #fff;
    /* background-color: #c8ebfb !important; */
  }

  .drag{
     transform: rotate(3deg);
    -moz-transform: rotate(3deg);
    -webkit-transform: rotate(3deg);
  }



  .boards-container {
    display: grid;
    grid-auto-columns: 272px;
    grid-auto-flow: column;
    grid-gap: 10px;
    height: 100%;
    height: calc(100vh - 5rem);
    // overflow: auto;
    padding: .5rem;

    -ms-user-select: none;
    -moz-user-select: -moz-none;
    -khtml-user-select: none;
    -webkit-user-select: none;
    user-select: none;

    &__btn{
      background: #fff;
      border-radius: 5px;
      border: 1px solid gray;
      font-size: 10px;
      padding: 5px;
      cursor: pointer;

      &:hover,
      &:active{
        background: darken(#fff, 5%)
      }
    }

    &__board{
      background: #EBECF0;
      border-radius: 3px;
      display: grid;
      grid-auto-rows: max-content;
      grid-gap: 10px;
      padding: .625rem;
      height: 100% !important;

      &__header{
        display: flex;
        justify-content: space-between;
        margin: 0 0 12px 0;

        h1 {
          font-size: 1rem;
        }

        p{
          margin-right: .5rem;
        }

        .header__control{
          display: flex;
          align-items: center;
        }
      }

      &__card{
        @include card;
        cursor: grab;
      
        &.selected-task{
          background : #e9f3fc;
        }
      }

      &__input{
        @include card;

        .btn__group{
          display: flex;
          justify-content: space-between;
        }
        
        p{
          font-size: 14px;
          font-weight: 600;
          margin-bottom:5px;
        }

        input{
          width:100%;
          padding: 3px;
          border-radius: 5px;
          margin-bottom:5px;
          border: 1px solid
        }

        button{
          width: 3rem;
        }
      }
    }   

    &__spinner-box{
      width:100%; 
      display:flex; 
      justify-content:center;
    }
  }

</style>