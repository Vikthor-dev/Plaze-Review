<template>
  <div class="container">
    <nav v-if="this.$route.name !== 'Login' && this.$route.name !== 'Register'" class="navbar">
      <h3>Enjoying Summer?</h3>
      <button
        class="btn btn-primary"
        type="button"
        data-toggle="collapse"
        data-target="#collapse-navbar"
        aria-expanded="false"
        aria-controls="multiCollapseExample2"
      >
        <i class="fas fa-bars"></i>
      </button>
    </nav>

    <div class="collapse multi-collapse" id="collapse-navbar">
      <div id="collapse-div" class="card card-body">
        <div style="margin-bottom:15px;" class="row">
          <div class="col">
            <router-link to="/">
              <a href="#">
                <i id="sidebar-icon" class="fas fa-home"></i>
              </a>
            </router-link>
          </div>
          <div class="col">
            <router-link to="/add">
              <a href="#">
                <i id="sidebar-icon" class="fas fa-plus-circle"></i>
              </a>
            </router-link>
          </div>
          <div class="col">
            <router-link to="/my-reviews">
              <a href="#">
                <i id="sidebar-icon" class="fas fa-images"></i>
              </a>
            </router-link>
          </div>
          <div class="col">
            <router-link to="/stats">
              <a href="#">
                <i id="sidebar-icon" class="fas fa-chart-pie"></i>
              </a>
            </router-link>
          </div>
          <div class="col">
            <router-link to="/login">
              <a href="#">
                <i id="sidebar-icon" class="fas fa-sign-out-alt"></i>
              </a>
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <p class="lead">{{post.title}}</p>
    <img  :src="post.url" class="figure-img img-fluid rounded" alt="Post Image" />
    <figcaption style="margin-bottom:250px" class="figure-caption">{{timeAgo}}.</figcaption>
    <div class="data">
      <div class="user">
        <p class="lead">Posted By: {{post.postedBy}}</p>
      </div>
      <div class="description">
        <p>{{post.description}}</p>
      </div>
      <div class="other">
        <div class="b-type">
          <p>
            <img id="icons" src="@/assets/beach.png" alt="Beach Type" />
            Beach type: {{post.beach_type}}
          </p>
        </div>

        <div class="lifeguard">
          <p>
            <img id="icons" src="@/assets/cross.png" alt="Lifeguard" />
            Lifeguard on the beach: {{post.lf_tower}}
          </p>
        </div>

        <div class="pets">
          <p>
            <img id="icons" src="@/assets/animals.png" alt="Pets" />
            Pets allowed: {{post.pets_allowed_answer}}
          </p>
        </div>

        <div class="free">
          <p>
            <img id="icons" src="@/assets/money.png" alt="Free" />
            Free: {{post.free_beach}}
          </p>
        </div>
      </div>
    </div>

    <h3 id="comment-section-title">Comment Section</h3>

    <div class="container">
    <div class="comment-section">
        <div :key="comment.id" v-for="comment in this.comments" class="comment-box">
        <p><img id="profile-picture" src="@/assets/account.png" alt="Profile Picture"> <strong style="margin-right:15px">{{comment.postedBy}}</strong><small>{{formatTime(comment.posted_at)}}</small></p>
        <p>{{comment.comment_text}}</p>
        <img data-toggle="modal" data-target="#exampleModal" v-if="store.userId==comment.postedBy_id" @click="delete_comment(comment.id)" id="delete-comment" src="@/assets/interface.png" alt="Delete Comment!">
      </div>
    </div>
    </div>
    <div class="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLabel">Comment</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        Comment Deleted.Please refresh page.
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-primary" data-dismiss="modal">Close</button>
      </div>
    </div>
  </div>
</div>

    <form @submit.prevent="add_comment" id="comment-form">
          <input v-model="store.comment_text" id="comment-input" class="form-control" type="text" placeholder="Your comment goes here!" required/>
          <button  data-toggle="modal" data-target="#exampleModalCenter" id="comment-button" type="submit" class="btn btn-primary">Comment</button>
    </form>
    <div class="modal fade" id="exampleModalCenter" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLongTitle">Modal title</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        Comment Added.Please refresh page.
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-primary" data-dismiss="modal">Close</button>
      </div>
    </div>
  </div>
</div>
  </div>
</template>

<script>
import axios from 'axios';
import store from "@/store.js";
import moment from "moment";
import { Posts } from "@/services";
export default {
  props: ["id"],
  data() {
    return {
      store,
      post: "",
      comments:[]
    };
  },
  async mounted() {
    this.post = await Posts.getOne(this.id);
    console.log(this.post);
    this.fetch_comments()
    axios.get('http://localhost:3000/user', { headers: { token: localStorage.getItem('token')}})
       .then(res => {
        store.first_name = res.data.user.first_name;
        store.last_name = res.data.user.last_name;
        store.username = res.data.user.username;
        store.email = res.data.user.email
        store.userId = res.data.user.id
      })
  },
  methods: {
   async add_comment(){
      try{
        let comment={
          postedBy:store.username,
          postedBy_id:store.userId,
          comment_text:store.comment_text,
          posted_at:Date.now(),
          post_id:this.id
        }
        store.comment_text=''
      await Posts.new_comment(comment)
      }catch(err){
        console.log("Error: ",err)
      }
    },
    async fetch_comments(){
      axios.get(`http://localhost:3000/comments/${this.id}`)
       .then(res => {
         this.comments=res.data;
         this.comments = this.comments.map(doc => {                                      
            return{
                id:doc._id,
                post_id:doc.post_id,
                postedBy:doc.postedBy,
                postedBy_id:doc.postedBy_id,
                posted_at:doc.posted_at,
                comment_text:doc.comment_text    
              }
          })
          console.log("Komentari sa backenda: ",this.comments)
      })
    },
    formatTime(time){
      let date = new Date(time).toLocaleString()
      return date
    },
    async delete_comment(id){
       console.log("Comment id: ",id)
       axios.post(`http://localhost:3000/comments/${id}`)
       .then(res=>{
         console.log("Deleting comment response: ",res)
       })
    }
  },
  computed: {
    timeAgo() {
      let a = new Date(this.post.posted_at).getTime();
      return moment(a).fromNow();
    }
  }
};
</script>

<style scoped lang="scss">
#delete-comment{
  margin:10px;
  height: 20px;
  width: 20px;
}
#delete-comment:hover{
  height: 25px;
  width: 25px;
  transition:0.2s;
  cursor: pointer;
}
#comment-form{
  margin-top: 20px;
  transform: translate(0px,-480px);
  #comment-input {
  transform: translate(15px,0px);
  width: 400px;
  }
  #comment-button{
    transform: translate(470px,-45px);
    margin-top: 10px;
  } 
}
.comment-box {
  border-radius: 15px;
  background-color: rgb(227, 241, 255);
  margin-bottom: 15px;
  .row {
    margin-top: 10px;
  }
  #postedBy {
    margin-left: 10px;
  }
  #date {
    margin-left: 10px;
  }
  #text {
    margin-right: 10px;
  }
  #profile-picture {
    height: 40px;
    width: 40px;
    margin-left: 10px;
    margin-bottom: 5px;
    margin-top: 5px;
    margin-right: 10px;
  }
  p {
    margin-left: 10px;
    margin-right: 10px;
    text-align: justify;
    font-family:Arial, Helvetica, sans-serif;
    font-size: 17px;
  }
}
#comment-section-title {
  transform: translate(0px, -500px);
  margin-bottom: 30px;
}
.comment-section {
  width: 550px;
  height: 400px;
  transform: translate(0px, -500px);
  overflow: auto;
}
.container {
  margin-top: 20px;
  margin-bottom: 30px;
}
img {
  height: 350px;
  width: 550px;
  border-radius: 20px;
}
.data {
  width: 555px;
  transform: translate(600px, -630px);
  margin-top: 10px;
  .description {
    text-align: justify;
    p {
      font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
      font-size: 20px;
    }
  }
  .other {
    font-family: "Gill Sans", "Gill Sans MT", Calibri, "Trebuchet MS",
      sans-serif;
    font-size: 20px;
  }
  #icons {
    height: 20px;
    width: 20px;
    margin-right: 10px;
  }
}
.navbar {
  display: none;
  margin-left: 100px;
  margin-right: 80px;
  margin-top: 20px;
  margin-bottom: 40px;
  border-radius: 5px;
  height: 70px;
  background-color: rgb(130, 174, 245);
  h3 {
    color: whitesmoke;
    transition: font-size 0.5s;
  }
  h3:hover {
    font-size: 30px;
  }
  button {
    display: none;
  }
}
.navbar:hover {
  animation: swing 1s;
}
@media (max-width: 768px) {
  #comment-form{
  transform: translate(0px,-480px);
 #comment-input {
   transform: translate(10px,540px);
   width:300px;
  }
  #comment-button{
    transform:translate(10px,550px);
    margin-bottom: 100px;
  } 
}
  #comment-button{
    transform: translate(0px,800px);
  } 
  #comment-section-title{
    transform: translateY(100px);
  }
  #postedBy{
    display: none;
  }
  #date{
    display: none;
  }
  .comment-section{
    width: 320px;
    transform: translateY(100px);
    margin-top: 20px;
    margin-bottom: 50px;
  }
  img {
    width: auto;
    height: auto;
  }
  .data {
    transform: translate(0px, -200px);
    width: 100%;
  }
  .navbar {
    display: inline-flex;
    width: 320px;
    margin-left: 10px;
    h3 {
      display: none;
    }
    button {
      display: block;
    }
  }
  #collapse-div {
    background-color: rgb(130, 174, 245);
    margin-left: 15px;
    margin-right: 20px;
    margin-bottom: 10px;
  }
  #sidebar-icon {
    height: 30px;
    width: 30px;
  }
}
</style>