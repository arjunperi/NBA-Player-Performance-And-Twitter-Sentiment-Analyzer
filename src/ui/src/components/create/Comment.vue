<template>
    <div id = "App">
        <li>
            <div>
                <div>
                {{comment.text}}
                </div>
            </div>
            <div v-if = "editable">
              <hr>
                <b-button class="btn btn-dark btn-sm" size="sm" @click= "commentModalVisible = true"> Edit Comment</b-button>
                <span class = "br"></span>
                <b-button class="btn btn-danger btn-sm" size="sm" @click= "removeComment()"> Remove Comment</b-button>
            </div>
            <!-- Modal for editing comments-->
            <b-modal v-model= "commentModalVisible" @ok = "editComment()">
                <label for="comment-modal">Comment:</label>
                <b-form-input trim id="comment-modal" v-model= "editedComment"></b-form-input>
            </b-modal>
        </li>
    </div>
</template>

<script>
import { dataStore } from '../../../data/dataStore.js';
// import Draggable from "vuedraggable";

export default {
  name: 'Comment',
  components: {
    // Draggable
  },
  props: {
    comment: {
        type: Object,
        required: true
    },
    playerCard: {
        type: Object,
        required: true
    },
    editable: {
        type: Boolean,
        required: true
    }
  },
    data () {
    return {
      allData: dataStore,
      commentModalVisible: false,
      editedComment: ""
    };
    },

  methods: {
      async removeComment(){
          this.allData.removeComment(this.playerCard, this.comment);
      },
      async editComment(){
          if (this.isValidComment(this.editedComment)){
              this.allData.editComment(this.playerCard, this.comment, this.editedComment);
          }
          else{
              alert("Please include a comment with text in it!");
          }
      },
      isValidComment(comment){
      // use / /g to remove all spaces from the string
      let removedSpaces = comment.replace(/ /g, "");
      return (removedSpaces.length > 0); 
    }
      
  },
  async mounted () {
  }
}
</script>

<style>

</style>
