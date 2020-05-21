<template>
        <div class="card" style="width: 19rem; height:370px">
        <img style="height:170px;" class="card-img-top" :src="info.url" alt="Card image cap">
        <div class="card-body">
        <p id="postedBy-text">{{info.postedBy}}</p>
        <p id="beach-location-text"><img id="post-location-icon" src="@/assets/maps-and-flags.png" alt="">{{info.title}}</p>
         <star-rating id="star-rating"  :star-size="30" :read-only="true" :show-rating="false" :rating="info.score"></star-rating>
         <button @click="goToDetails()" id="details-button" type="button" class="btn btn-primary btn-sm">Details</button>
         <button v-if="store.userId==data.postedBy_id" @click="goToEdit()" id="edit-button" type="button" class="btn btn-danger btn-sm">Edit Post</button>
        </div>
      </div>
</template>

<script>
import axios from 'axios';
import store from "@/store.js";
import StarRating from 'vue-star-rating'
import { Posts } from "@/services";
export default {
    props:["info"],
    data(){
      return{
        store,
        data:''
      }
    },
   async mounted(){
     axios.get(`http://localhost:3000/posts/${this.info.id}`)
     .then(res=>{
       this.data=res.data
     })
    },
    components: {
      StarRating
  },
  methods:{
    goToDetails(){
      if(this.$route.name !== 'PostDetail'){
        this.$router.push({path:`post/${this.info.id}`})
      }
    },
    goToEdit(){
      if(this.$route.name !== 'EditPost'){
        this.$router.push({path:`edit-post/${this.info.id}`})
      }
    }
  }
}
</script>

<style lang="scss" scoped>

#post-location-icon{
  height: 25px;
  widows: 25px;
  transform: translate(0px,-5px);
  margin-right: 5px;
}
.card-title{
  font-weight: bold;
}
#star-rating{
  transform: translate(0px,-110px);
}
#postedBy-text{
  font-size: 22px;
  font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
  transform: translate(-20px,0px);
  text-align: center;
  transform: translate(0px,-20px);
}
#beach-location-text{
  font-size: 20px;
  font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
  transform: translate(0px,-70px);
  text-align: left;
}
#details-button{
  transform: translate(100px,-140px);
}
#edit-button{
  transform: translate(-120px,-140px);
}
.card-body{
  background-color: rgb(220, 234, 247);
  height: 100px;
}
@media (max-width: 768px) {
  #beach-location-text{
    text-align: left;
  }
  #details-button{
    margin-right: 20px;
  }
  .card{
    width: 25rem;
  }
}
</style>