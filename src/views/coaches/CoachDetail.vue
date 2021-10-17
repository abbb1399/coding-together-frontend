<template>
  <div>
    <section>
      <base-card>
        <h2>{{name}}</h2>
        <h3>{{rate}}원/시간</h3>
      </base-card>
    </section>
    <section>
      <base-card>
        <header>
          <h2>관심있나요? 지금 신청하세요!</h2>
          <base-button link :to="contactLink">연락하기</base-button>
        </header>
        <router-view></router-view>
      </base-card>
    </section>
    <section>
      <base-card>
        <base-badge v-for="area in areas" :key="area" :type="area" :title="area" ></base-badge>
        <!-- <p>{{description}}</p> -->
        <div id="viewer"/>
      </base-card>
    </section>
  </div>
</template>

<script>
import Viewer from '@toast-ui/editor/dist/toastui-editor-viewer';
import '@toast-ui/editor/dist/toastui-editor-viewer.css';
// import '@toast-ui/editor/dist/toastui-editor.css'

export default {
  props:['id'],
  data(){
    return{
      selectedCoach:null,
    }
  },
  mounted(){
    new Viewer({
      el: document.querySelector('#viewer'),
      // 표시하고자 하는 내용은 여기에 들어간다.
      initialValue: this.description
    });
  },
  computed:{
    name(){
      return this.selectedCoach.name
    },
    areas(){
      return this.selectedCoach.areas
    },
    rate(){
      return this.selectedCoach.hourlyRate
    },
    description(){
      return this.selectedCoach.description
    },
    contactLink(){
      // console.log(this.id)
      // console.log(this.$route.path )
      return this.$route.path + '/' + this.id + '/contact'
      // return this.$route.path + '/contact'
    }
  },
  created(){
    this.selectedCoach = this.$store.getters['coaches/coaches'].find(coach => coach.id === this.id)
  }
}
</script>