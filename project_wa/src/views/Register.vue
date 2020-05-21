<template>
    <div>
        <body style="background-image: url('https://i.pinimg.com/originals/1f/d8/ab/1fd8abbd733c5b26029b9427f7f82461.jpg'); background-size: cover;">
    <div class="container">
        <div class="row">
            <div class="col"></div>
                <div id="Mid_col_background" class="col-md-5 col-sm">
                    <form @submit.prevent="signup">
                        <div class="form-group">
                            <h3 style="color: whitesmoke;">Register</h3>
                        </div>
                        <div class="form-group">
                            <label style="color: whitesmoke;" for="exampleInputEmail1"><strong>First Name</strong></label>
                            <input v-model="first_name" type="text" class="form-control" id="exampleInputEmail1" placeholder="Jane" aria-describedby="emailHelp" required>
                          </div>
                          <div class="form-group">
                            <label style="color: whitesmoke;" for="exampleInputEmail1"><strong>Last Name</strong></label>
                            <input v-model="last_name" type="text" class="form-control" id="exampleInputEmail1" placeholder="Doe" aria-describedby="emailHelp" required>
                          </div>
                          <div class="form-group">
                            <label style="color: whitesmoke;" for="exampleInputEmail1"><strong>Username</strong></label>
                            <input v-model="username" type="text" class="form-control" id="exampleInputEmail1" placeholder="Janedoe98" aria-describedby="emailHelp" required>
                          </div>
                        <div class="form-group">
                          <label style="color: rgb(245, 245, 245);" for="exampleInputEmail1"><strong>Email address</strong></label>
                          <input v-model="email" type="email" class="form-control" placeholder="Janedoe@gmail.com" aria-describedby="emailHelp" required>
                        </div>
                        <div class="form-group">
                          <label style="color: whitesmoke;" for="exampleInputPassword1"><strong>Password</strong></label>
                          <input v-model="password" type="password" class="form-control" placeholder="**********" required>
                        </div>
                        <div class="form-group">
                            <label style="color: whitesmoke;" for="exampleInputPassword1"><strong>Confirm Password</strong></label>
                            <input v-model="conf_password" type="password" class="form-control" placeholder="**********" required>
                          </div>
                        <div class="flex-container">
                            <button type="submit" class="btn btn-primary"><strong>Register</strong></button>
                            <router-link to="/login"><button style="margin-left: 10px; margin-right: 30px;" type="submit" class="btn btn-danger"><strong>Login</strong></button></router-link>
                            <a id="forgot_password" style="color:whitesmoke;" href="#"><strong>Forgot password?</strong></a>
                            <br>
                        </div>
                        <p v-if="error">Email already in use!</p>
                        <p v-if="error_2">Passwords do not match or have less than 6 characters!</p>
                      </form>
                </div>
            <div class="col"></div>
        </div>
    </div>
</body>
    </div>
</template>

<script>
import axios from 'axios'
import store from '@/store.js';
export default {
  data(){
    return{
      store,
      first_name:'',
      last_name:'',
      username:'',
      email:'',
      password:'',
      conf_password:'',
      error:false,
      error_2:false
    }
  },
  methods:{
    signup(){
      if(this.password==this.conf_password && this.password.length>6){
      let newUser={
        First_Name:this.first_name,
        Last_Name:this.last_name,
        Username:this.username,
        Email:this.email,
        Password:this.password
      }
      console.log(newUser)
      axios.post('http://localhost:3000/signup', newUser)
      .then(res=>{
        console.log("Response: ",res)
        console.log("Error: ",res.data.status)
        if(res.data.status){
          this.error=true
        }
        else{
          this.error=false
          this.$router.push({name:'Login'})
        }
      })
      }
      else{
        this.error_2=true
      }
    }
  }
}
</script>

<style lang="scss" scoped>
    #Mid_col_background{
        margin-top: 50px;
        padding: 40px;
        border-radius: 10px;
    }
    .flex-container {
  display: flex;
  flex-wrap: wrap;
}

.flex-container > div {
  background-color: #f1f1f1;
  width: 100px;
  margin: 10px;
  text-align: center;
  line-height: 75px;
  font-size: 30px;
}
p{
  color: red;
  margin-top: 10px;
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
    }
</style>