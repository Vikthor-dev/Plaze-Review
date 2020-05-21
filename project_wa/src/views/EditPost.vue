<template>
    <div class="container">
    <div class="row">
        <div class="col">
             <img style="height:400px; width:400px;"  :src="post_data.url" class="figure-img img-fluid rounded" alt="Post Image" />
             <star-rating id="star-rating"  :star-size="50" :read-only="true" :show-rating="false" :rating="post_data.score"></star-rating>
        </div>
        <div class="col-md col-sm">
            <p>{{post_data.description}}</p>
        </div>
        <div class="col">
            <label for="input-edit">Beach Type?</label>
            <input id="input-edit" type="text" disabled :value="post_data.beach_type" class="form-control is-valid">
            <label for="input-edit">Lifeguard?</label>
            <input id="input-edit" type="text" disabled :value="post_data.lf_tower" class="form-control is-valid">
            <label for="input-edit">Pets allowed?</label>
            <input id="input-edit" type="text" disabled :value="post_data.pets_allowed_answer" class="form-control is-valid">
            <label for="input-edit">Free?</label>
            <input id="input-edit" type="text" disabled :value="post_data.free_beach" class="form-control is-valid">
            <label for="input-edit">Beach Name :</label>
            <input id="input-edit" type="text" disabled :value="post_data.title" class="form-control is-valid">
        </div>
    </div>
    <br><br><br>
    
    <div class="row row-cols-4">
    <div class="col-md col-sm">
        <croppa v-model="imageData" :height="300" :width="330" :placeholder-font-size="18" :prevent-white-space="true"></croppa>
        <star-rating id="star-rating"  :star-size="50" :show-rating="false" @rating-selected="setRating"></star-rating>
    </div>
    <div class="col-ms col-sm">
        <label for="description-input">Edit your review here :</label>
        <textarea v-model="description" id="description-input" class="form-control is-valid" rows="3" placeholder="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."></textarea>
        </div>
    <div class="col-md col-sm">
        <label for="beach-type">Beach Type</label>
        <select v-model="beach_type" id="beach-type" class="form-control is-valid">
            <option :key="beach_type" v-for="beach_type in beach_types">{{beach_type}}</option>
        </select>

        <label for="lifeguard-check">Lifeguard Tower ?</label>
        <select v-model="lf_tower" id="lifeguard-check" class="form-control is-valid">
            <option :key="lf_tower" v-for="lf_tower in lf_towers">{{lf_tower}}</option>
        </select>

        <label for="pets-check">Pets allowed ?</label>
        <select v-model="pets_allowed_answer" id="pets-check" class="form-control is-valid">
            <option :key="pets_allowed_answer" v-for="pets_allowed_answer in pets_allowed">{{pets_allowed_answer}}</option>
        </select>

        <label for="free-check">Free to access ?</label>
        <select v-model="free_beach" id="free-check" class="form-control is-valid">
            <option :key="free_beach" v-for="free_beach in free_beaches">{{free_beach}}</option>
        </select>

        <label for="beach-check">Beach Name :</label>
        <input v-model="title" id="beach-check" type="text" class="form-control is-valid" placeholder="Beach Name">
    </div>
  </div>
  <div style="margin-top:40px; margin-bottom:20px;" class="input">
      <form @submit.prevent="updatePost">
        <button style="margin-right:10px;" type="submit" class="btn btn-primary">Save</button>
        <router-link to="/"><button type="submit" class="btn btn-secondary">Cancel</button></router-link>
      </form>
      <form @submit.prevent="updatePic">
        <button style="margin-top:10px; margin-bottom:20px;" type="submit" class="btn btn-success">Save Image</button>
      </form>

      <form @submit.prevent="deletePost">
        <button style="margin-top:10px; margin-bottom:20px;" type="submit" class="btn btn-danger">Delete Post</button>
      </form>
  </div>
    </div>
</template>

<script>
import axios from 'axios';
import store from '@/store.js';
import {Posts} from '@/services'
import StarRating from 'vue-star-rating'
export default {
    props:["id"],
    data(){
        return{
            store,
            post_data:'',
            beach_types:['Rocky','Sandy','Concrete'],
            beach_type:undefined,
            lf_towers:['Yes','No'],
            lf_tower:undefined,
            pets_allowed:['Yes','No'],
            pets_allowed_answer:'',
            free_beaches:['Yes','No'],
            free_beach:undefined,
            description:undefined,
            imageData:undefined,
            title:undefined,
            score:undefined
        }
    },
    async mounted(){
        this.post_data = await Posts.getOne(this.id);
        console.log(this.post_data);
    },
    methods:{
        setRating(rating){
          this.score=rating;
          console.log(this.score)
      },
           getImageBlob(){
          return new Promise((resolve,reject)=>{
              this.imageData.generateBlob(blobData =>{
                  if(blobData!=null){
                      resolve(blobData)
                  }else{
                      reject("Error with getting image!")
                  }
              })  
          })
      },
      async updatePost(post,id){
          try{
            let post={
                title:this.title,
                url:this.post_data.url,
                postedBy:this.post_data.postedBy,
                score:this.score,
                description:this.description,
                beach_type:this.beach_type,
                lf_tower:this.lf_tower,
                pets_allowed_answer:this.pets_allowed_answer,
                free_beach:this.free_beach,
                posted_at:Date.now()
            }
            await Posts.update_post(post,this.id)
         }catch(e){
             console.log("Error!",e)
            }
            this.$router.push({name:'Home'})
      },
     async updatePic(){
            try{
            let p = await this.getImageBlob()
            let imageName = "Defaultni user" + "/" + Date.now() + ".png";
            let result = await storage.ref(imageName).put(p)
            let url = await result.ref.getDownloadURL()

            let post={
                title:this.title,
                url:url,
                postedBy:this.post_data.postedBy,
                score:this.score,
                description:this.description,
                beach_type:this.beach_type,
                lf_tower:this.lf_tower,
                pets_allowed_answer:this.pets_allowed_answer,
                free_beach:this.free_beach,
                posted_at:Date.now()
            }
            await Posts.update_post(post,this.id)
         }catch(e){
             console.log("Error!",e)
            }
            this.$router.push({name:'Home'})
      },
      deletePost(){
        console.log("Post id: ",this.id);
        axios.post(`http://localhost:3000/delete_post/${this.id}`)
       .then(res=>{
         console.log("Deleting post response: ",res)
       })
        this.$router.push({name:'Home'})
        location.reload();
      }
    },
    components: {
      StarRating
  }
}
</script>

<style lang="scss" scoped>
    .croppa-container{
        background-color:rgb(200, 224, 250);
        margin-right: 20px;
    }
    p{
        text-align: justify;
        font-family:Arial, Helvetica, sans-serif;
        font-size: 17px;
    }
       #description-input{
        height: 270px;
    }
        label{
        font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
        font-size: 18px;
    }
    .container{
        margin-top: 40px;
    }
    #input-edit{
        margin-bottom: 15px;
    }
    @media (max-width: 768px) {
        button{
            margin-top: 20px;
            margin-bottom: 20px;
        }
    }
</style>