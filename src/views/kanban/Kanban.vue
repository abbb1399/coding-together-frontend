<template>
  <div class="boards-container">
    <div class="boards-container__board" v-for="(board, index) in boardList" :key="index">
      <div class="boards-container__board__header">
        <h1>{{board.title}}</h1>
        <div class="header__control">
          <p><font-awesome-icon icon="tag"/>&nbsp;{{board.list.length}}</p>
          <button class="boards-container__btn" @click="openInput(board, index)">
            <font-awesome-icon icon="plus" />
          </button>
        </div>     
      </div>
      <div class="boards-container__board__input" v-if="inputStatus && currIndex === index">
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

      <draggable  
        v-model="board.list" 
        item-key="id" 
        group="people" 
        :animation="90"
        :forceFallback="true"
        :multiDrag="true" 
        @start="dragStart"
        @end="dragEnd"
        style="height:87vh;"

        ghostClass= "ghost"
        chosenClass= "chosen"
        dragClass="drag"

        :touchStartThreshold="0"
        :fallbackTolerance="0"
      >
        <template #item="{ element }" >
          <div class="boards-container__board__card">{{ element.name }}</div>
        </template>
      </draggable>
    </div>
  </div>
</template>

<script>
import draggable from "vuedraggable";

export default {
  components: {
    draggable
  },
  data(){
    return{
      inputValue:'',
      currIndex:null,
      inputStatus: false,
      boardList:[
        {
          title: 'Board One', 
          list: [
            { name: "Card #1", id: 1 },
            { name: "Card #2", id: 2 },
            { name: "Card #3", id: 3 },
            { name: "Card #4", id: 4 }
          ],
        },
        {
          title: 'Board Two',
          list: [
            { name: "Card #5", id: 5 },
            { name: "Card #6", id: 6 },
            { name: "Card #7", id: 7 }
          ]
        },
        {
          title: 'Board Three',
          list: [
            { name: "Card #8", id: 8 },
            { name: "Card #9", id: 9 },
            { name: "Card #10", id: 10 }
          ]
        },
        {
          title: 'Board Four',
          list: [
            { name: "Card #11", id: 11 },
            { name: "Card #12", id: 12 },
            { name: "Card #13", id: 13 }
          ]  
        }
      ],
    }
  },
  methods: {
    log(evt) {
      console.log(evt);
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
    openInput(board, index){
      if(this.inputStatus && this.currIndex === index){
        this.inputStatus = false
      }else{
        this.inputStatus = true
      }
      
      this.currIndex = index
    },
    cancleAdding(index){
      console.log(index)
      this.inputStatus = false
    },
    addTask(board,index){
      if(this.inputValue.length === 0) return

      console.log(board,index)
      board.list.push({name:this.inputValue})
      this.inputValue = ''
    }


  }
}
</script>



<style lang="scss" scoped>
  .grabbing * {
    cursor: move !important; /* fallback: no `url()` support or images disabled */
    cursor: -webkit-grabbing !important; /* Chrome 1-21, Safari 4+ */
    cursor:    -moz-grabbing !important; /* Firefox 1.5-26 */
    cursor:         grabbing !important; /* W3C standards syntax, should come least */
  }

  // .flip-list-move {
  //   transition: transform .5s;
  // }
  // .no-move {
  //   transition: transform 0s;
  // }
  .ghost {
    opacity: 0.5;
    background: #c8ebfb;
  }

  .chosen{
    background: red;
  }

  .drag{
    background: yellow;
  }

  .boards-container {
    display: grid;
    grid-auto-columns: 272px;
    grid-auto-flow: column;
    // grid-gap: 8px;
    grid-gap: 10px;
    height: 88vh;
    overflow: auto;
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
  }

</style>