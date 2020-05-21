<template>
<div id="app">
    <div v-if="this.$route.name !== 'Login' && this.$route.name !== 'Register'" id="mySidenav" class="sidenav">
         <ul class="list-unstyled components">
                <br>
                <li>
                    <router-link to="/"><a href="#"><i id="sidebar-icon" class="fas fa-home"></i></a></router-link>
                </li>
                <li>
                    <router-link to="/add"><a href="#"><i id="sidebar-icon" class="fas fa-plus-circle"></i></a></router-link>
                </li>
                <li>
                    <router-link to="/my-reviews"><a href="#"><i id="sidebar-icon" class="fas fa-images"></i></a></router-link>
                </li>
                <li>
                    <router-link to="/stats"><a href="#"><i id="sidebar-icon" class="fas fa-chart-pie"></i></a></router-link>
                </li>
                <li>
                    <router-link to="/profile"><a href="#"><i id="sidebar-icon" class="fas fa-user-circle"></i></a></router-link>
                </li>
                <li>
                     <router-link to="/login"><a href="#"><i id="sidebar-icon" class="fas fa-sign-out-alt"></i></a></router-link>
                </li>
            </ul>
    </div>

    <div class="content">
      <vue-page-transition name="fade-in-right">
         <router-view/>
    </vue-page-transition>
    </div>
    <div class="navbar-down">

    </div>
</div>
</template>

<script>
import store from '@/store.js';
import axios from 'axios';
    export default{
        data(){
            return{
                store
            }
        }
    }
</script>

<style lang="scss" scoped>
    .content{
        
    }
  .sidenav {
  height: 100%;
  width: 80px;
  position: fixed;
  z-index: 1;
  top: 0;
  left: 0;
  background-color:rgb(130, 174, 245);
}

.sidenav a {
  margin-top: 40px;
  padding-left: 10px;
  font-size: 35px;
  color:whitesmoke;
  display: block;
  transition: font-size 0.3s;
}

.sidenav a:hover{
    font-size: 40px;
}

.sidenav a:hover {
  color:rgb(31, 99, 209);
}
    @media (max-width: 768px) {
       .sidenav a{
           margin-top:10px;
           margin-bottom:30px;
       }
    .navbar-down{
      margin-top:100px;
    }
    #mySidenav{
        display: none;
    }
    }
</style>

