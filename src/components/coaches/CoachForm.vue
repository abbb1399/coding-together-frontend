<template>
  <form @submit.prevent="submitForm">
    <div class="form-control" :class="{invalid: !firstName.isValid}"> 
      <label for="firstname">성</label>
      <input type="text" id="firstname" v-model.trim="firstName.val" @blur="clearValidity('firstname')">
      <p v-if="!firstName.isValid">성은 반드시 입력되야 합니다.</p>
    </div>
    <div class="form-control" :class="{invalid: !lastName.isValid}">
      <label for="lastname">이름</label>
      <input type="text" id="lastname" v-model.trim="lastName.val" @blur="clearValidity('lastName')"> 
      <p v-if="!lastName.isValid">이름은 반드시 입력되야 합니다.</p>
    </div>
    <div class="form-control" :class="{invalid: !description.isValid}">
      <label for="description">설명</label>
      <textarea id="description" rows="5" v-model.trim="description.val" @blur="clearValidity('description')"></textarea> 
      <p v-if="!description.isValid">설명은 반드시 입력되야 합니다..</p>
    </div>
     <div class="form-control" :class="{invalid: !rate.isValid}">
      <label for="rate">시급</label>
      <input type="number" id="rate" v-model.number="rate.val" @blur="clearValidity('rate')"> 
      <p v-if="!rate.isValid">시급은 0원보다 커야 합니다.</p>
    </div>
    <div class="form-control" :class="{invalid: !areas.isValid}"> 
      <h3>Areas of Expertise</h3>
      <div>
        <input type="checkbox" id="frontend" value="frontend" v-model="areas.val" @blur="clearValidity('areas')"> 
        <label for="frontend">프론트엔드 개발자</label>
      </div>
      <div>
        <input type="checkbox" id="backend" value="backend" v-model="areas.val" @blur="clearValidity('areas')"> 
        <label for="backend">백엔드 개발자</label>
      </div>
      <div>
        <input type="checkbox" id="career" value="career" v-model="areas.val" @blur="clearValidity('areas')"> 
        <label for="career">커리어 상담</label>
      </div>
      <p v-if="!areas.isValid">최소한 하나는 선택 되어야 합니다.</p>
    </div>
    <p v-if="!formIsValid">제대로 입력 하신 후, 다시 등록해주세요.</p>
    <base-button>등록</base-button>
  </form>
</template>

<script>
export default {
  emits:['save-data'],
  data(){ 
    return{
      firstName:{
        val:'',
        isValid:true
      },
      lastName:{
        val:'',
        isValid:true
      },
      description:{
        val:'',
        isValid:true
      },
      rate:{
        val:null,
        isValid:true
      },
      areas:{
        val:[],
        isValid:true
      },
      formIsValid:true 
    }
  },
  methods:{
    // input이 blur될때마다 에러표시 지워주기
    clearValidity(input){
      // this.firstName, this.lastName ....
      this[input].isValid = true
    },
    validateForm(){
      this.formIsValid = true
      
      if(this.firstName.val === ''){
        this.firstName.isValid = false
        this.formIsValid = false
      }
      if(this.lastName.val === ''){
        this.lastName.isValid = false
        this.formIsValid = false
      }
      if(this.description.val === ''){
        this.description.isValid = false
        this.formIsValid = false
      }
      if(!this.rate.val || this.rate.val < 0){
        this.rate.isValid = false
        this.formIsValid = false
      }
      if(this.areas.val.length === 0){
        this.areas.isValid = false
        this.formIsValid = false
      }
    },
    submitForm(){
      this.validateForm()

      if(!this.formIsValid){
        return
      }

      const formData={
        first: this.firstName.val,
        last: this.lastName.val,
        desc: this.description.val,
        rate: this.rate.val,
        areas:this.areas.val
      }
      this.$emit('save-data',formData)
    }
  }
}
</script>