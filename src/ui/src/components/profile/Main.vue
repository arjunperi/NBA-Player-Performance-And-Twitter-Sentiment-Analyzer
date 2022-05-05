<template>
    <div id = "App">
      <header>
            <h1>PROFILE</h1>
        </header>
      <!-- <b-card title ="My Profile">
        <b-badge v-if= "user.isAdmin">Admin</b-badge>
        <b-table borderless 
        :items= "profileItems" stacked />
        <button type="button" class="btn btn-primary" @click = "nameModalVisible = true">Change Display Name</button>
      </b-card> -->
      <b-card id = "login-card">
        <h4>
          <b-badge v-if= "user.isAdmin" variant = "warning">Admin</b-badge>
        </h4>
        
        <br v-if = "user.isAdmin">
        <div>
          Display Name: {{user.displayName}}
        </div>
        <span class = "br"></span>
        <div>
          Email: {{user.email}}
        </div>
        <span class = "br"></span>
        <div>
          <button type="button" class="btn btn-dark btn-sm" @click = "nameModalVisible = true">Change Display Name</button>
        </div>
      </b-card>
<!-- 
    <b-card-group v-if= "user.isAdmin">
      <b-card title ="Login Records">
        <b-table borderless 
        :items= "items" stacked />
      </b-card>
    </b-card-group>
     -->

    <div v-if = "user.isAdmin">
      <b-card id = "login-card">
        <h4>Login Records:</h4>
        <div v-for = "(loginRecord, l) in allData.data.loginRecords" :key = "l">
        {{loginRecord.email}} logged in at: {{loginRecord.time}}
        </div>
      </b-card>
    </div>

    <!-- Modal for changing display name-->
    <b-modal v-model= "nameModalVisible" @ok = "changeDisplayName()">
      <label for="name-modal"><b>Note that changing your display name will change it on any cards that you have published to the Esxplore page. </b> 
        <br>
        <br>
        New Display Name: </label>
      <b-form-input trim id="name-modal" v-model= "newDisplayName"></b-form-input>
    </b-modal>
    <footer>
 
  <a rel="license" href="http://creativecommons.org/licenses/by/4.0/">
    <img alt="Creative Commons License" style="border-width:0" src="https://i.creativecommons.org/l/by/4.0/88x31.png" id = "rights" />
  </a><br />This work is licensed under a <a rel="license" href="http://creativecommons.org/licenses/by/4.0/">Creative Commons Attribution 4.0 International License</a>.
</footer>
  </div>
</template>

<script>
import { dataStore } from '../../../data/dataStore.js';
// import Draggable from "vuedraggable";

export default {
  name: 'ProfileMain',
  components: {
    // Draggable
  },
  props: {
    user: 
    {
      type: Object,
      required: true
    }
  },
    data () {
    return {
      allData: dataStore,
      profileItems: [{
          displayName: this.user.displayName,
          email: this.user.email,
        }
      ],
      nameModalVisible: false,
      newDisplayName: "",
    };
  },
  methods: {
    async changeDisplayName(){
      console.log(this.newDisplayName);
      await this.allData.changeDisplayName(this.user, this.newDisplayName); 
      console.log(this.allData.data.errorMessages.displayNameTaken);
      if (this.allData.data.errorMessages.displayNameTaken == 1){
        alert("Sorry! That display name is already taken.");
      }
    },

  },
  async mounted () {
  }
}
</script>

<style>
</style>
