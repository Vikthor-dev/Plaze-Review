<template>
    <div>
        <body style="background-image: url('https://i.pinimg.com/originals/1f/d8/ab/1fd8abbd733c5b26029b9427f7f82461.jpg'); background-size: cover;">
    <div class="container">
        <div class="row">
            <div class="col"></div>
                <div id="Mid_col_background" class="col-md-5 col-sm">
                    <form @submit.prevent="login">
                        <div class="form-group">
                            <h3 style="color: whitesmoke;">Sign In</h3>
                        </div>
                        <div class="form-group">
                          <label style="color: whitesmoke;" for="exampleInputEmail1"><strong>Email address</strong></label>
                          <input v-model="email" type="email" class="form-control"  placeholder="Janedoe@gmail.com" aria-describedby="emailHelp" required>
                        </div>
                        <div class="form-group">
                          <label style="color: whitesmoke;" for="exampleInputPassword1"><strong>Password</strong></label>
                          <input v-model="password" type="password" class="form-control" placeholder="**********" required>
                        </div>
                        <div class="flex-container">
                            <button style="margin-right: 30px;" type="submit" class="btn btn-primary"><strong>Sign In</strong></button>
                            <router-link to="/register"><button style="margin-left: 10px; margin-right: 30px;" type="submit" class="btn btn-danger"><strong>Register</strong></button></router-link>
                            <a id="forgot_password" style="color:whitesmoke;" href="#"><strong>Forgot password?</strong></a>
                        </div>
                        <br>
                        <p id="error" v-if="error_check">{{error}}</p>
                        <p id="success" v-if="login_check">{{title}}</p>
                      </form>
                </div>
            <div class="col"></div>
        </div>
    </div>
</body>
    </div>
</template>

<script>
import axios from 'axios';
import store from '@/store.js';
export default {
    data(){
        return{
            store,
            email:'',
            password:'',
            error_check:false,
            login_check:false,
            error:'',
            title:''
        }
    },
    methods:{
        login(){
            let user={
                Email:this.email,
                Password:this.password
            }
            axios.post('http://localhost:3000/login', user)
            .then(res=>{
                console.log(res)
                if(res.data.error){
                    this.error_check=true
                    this.error=res.data.error
                }
                if(res.data.title){
                    this.login_check=true
                    this.title=res.data.title
                }
                if(res.data.token){
                    localStorage.setItem('token',res.data.token)
                    this.$router.push({name:'Home'})
                }
            })
        }
    }
}
</script>

<style lang="scss" scoped>
    #Mid_col_background{
        margin-top: 150px;
        padding: 40px;
        border-radius: 10px;
    }
    .flex-container {
  display: flex;
  flex-wrap: wrap;
}
#error{
  color: red;
  margin-top: 10px;
}
#success{
  color:green;
  margin-top: 10px;
}

body{
    height: 700px;
}

.flex-container > div {
  background-color: #f1f1f1;
  width: 100px;
  margin: 10px;
  text-align: center;
  line-height: 75px;
  font-size: 30px;
}
    @media only screen and (max-width: 600px) {
        #Mid_col_background{
            height: 350px;
            border-radius: 0px;
            height: 800px;
        }
        #forgot_password{
            margin-top: 10px;
        }
        body{
            height: 100%;
        }
    }
</style>