<template>
  <div class ="app">
    <header>
      <b-navbar toggleable="lg" type="dark" variant="dark">
        <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
        <b-collapse id="nav-collapse" is-nav>
          <b-navbar-nav>
            <b-nav-item @click= "page='home'">Home</b-nav-item>
            <b-nav-item @click= "page='create'">Create</b-nav-item>
            <b-nav-item @click= "page='explore'">Explore</b-nav-item>
            <b-nav-item @click= "page='favorites'">Favorites</b-nav-item>
          </b-navbar-nav>

           <b-navbar-nav class="ml-auto">
              <b-navbar-nav right>
                  <b-avatar v-if= "user.photo" :src= "user.photo" />
              </b-navbar-nav>
                  <b-nav-item-dropdown right>
                    <!-- Using 'button-content' slot -->
                      <template v-if = "user.email" #button-content>
                        <em>{{user.displayName}}</em>
                      </template>
                      <template v-else #button-content>
                        <em>User</em>
                      </template>
                      <b-dropdown-item v-if= "user.email" @click= "page='profile'">Profile</b-dropdown-item>
                      <b-dropdown-item v-else :href= "apiUrlBase + 'api/auth/login'">Sign In</b-dropdown-item>
                      <b-dropdown-item :href= "apiUrlBase + 'api/auth/logout'">Sign Out</b-dropdown-item>
                  </b-nav-item-dropdown>
            </b-navbar-nav>
        </b-collapse>
      </b-navbar>
    </header>
    <br>
    <b-container fluid> 
      <home-main 
        class = "home"
        v-if= "page==='home'"
        :user = "user"
      />
      <profile-main 
        v-if= "page==='profile'"
        :user = "user"
      />
      <create-main 
        v-if= "page==='create'"
        :user = "user"
      />
      <favorites-main 
        v-if= "page==='favorites'"
        :user = "user"
      />
      <explore-main 
        v-if= "page==='explore'"
        :user = "user"
      />
    </b-container>
  </div>

</template>

<script>
// import Draggable from "vuedraggable";
import CreateMain from "./components/create/Main.vue"
import FavoritesMain from "./components/favorites/Main.vue"
import ExploreMain from "./components/explore/Main.vue"
import ProfileMain from "./components/profile/Main.vue"
import HomeMain from "./components/home/Main.vue"
import {dataStore} from "../data/dataStore.js"

export default {
  name: 'App',
  components: {
    CreateMain,
    FavoritesMain,
    ExploreMain,
    ProfileMain,
    HomeMain
  },
    data () {
    return {
      apiUrlBase: process.env.VUE_APP_SERVER_API_BASE,
      page: 'home',
      allData: dataStore,
      temp: "cool",
      user: {}, 
    };
  },
  methods: {
  },
  async mounted(){
    await this.allData.checkNewUser(); 
    this.user = this.allData.currentUser;
    console.log("in app" , this.user); 
  }
}

</script>

