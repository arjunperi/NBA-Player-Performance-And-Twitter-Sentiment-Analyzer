<template>
    <div id = "App">
      <header>
            <h1>EXPLORE</h1>
        </header>
        <hr>
        <div v-if= "user.email">
          <h5> Welcome to the Explore Page! Here you can see all of the player card creations that other users have created and published. Scroll through and see what 
            sort of interesting stats you can find! Please note that you can only remove cards from the explore page that you published.
            <hr>
          </h5>
        </div>
        <div v-else>
          <h5> Welcome to the Explore Page! Here you can see all of the player card creations that other users have created and published. Scroll through and see what 
            sort of interesting stats you can find! 
          </h5>
          <hr>
        </div>
            <div class = "columns">
            <div
            v-for = "(playerCard, p) in allData.data.explorePlayerCards" :key = "p">
            <Draggable>
                <b-card id = "card">
                Created At: {{playerCard.time}}
                <br>
                Published by: {{playerCard.displayName}}
                <br>
                <br>
                <h3>
                  {{playerCard.name}}
                </h3>
                <hr>
                <h5>
                  Career Statistics
                </h5>
                <br>
                Points Per Game: {{playerCard.stats.points}}
                <br>
                Assists Per Game: {{playerCard.stats.assists}}
                <br>
                Minutes Per Game: {{playerCard.stats.minutes}}
                <br>
                Field Goal Percentage: {{playerCard.stats.fgp}}%
                <br>
                Free Throw Percentage: {{playerCard.stats.ftp}}%
                <br>
                Offensive Rebounds Per Game: {{playerCard.stats.oreb}}
                <br>
                Defensive Rebounds Per Game: {{playerCard.stats.dreb}}
                <br>
                Total Rebounds Per Game: {{playerCard.stats.reb}}
                <br>
                Steals Per Game: {{playerCard.stats.stl}}
                <br>
                Blocks Per Game: {{playerCard.stats.blk}}
                <br>
                Turnovers Per Game: {{playerCard.stats.tov}}
                <br>
                Plus Minus: {{playerCard.stats.plsmin}}
                <hr>
                <div v-if = "playerCard.score">
                  <h5>
                    Twitter Sentiment Analysis Score
                  </h5>
                  <br>
                  {{playerCard.score}}
                </div> 
                <hr>
                <div v-if = "playerCard.comments">
                  <h5>Comments</h5>
                  <br>
                  <ul>
                      <!-- <draggable
                      :list = "filteredResults"
                      group = "comments"
                      > -->
                          <comment
                              class = "card-comments"
                              v-for = "(comment,j) in playerCard.comments" :key = j
                              :comment = "comment" 
                              :playerCard = "playerCard"  
                              :editable = "false"
                          />
                      <!-- </draggable> -->
                  </ul>
                </div>
                <hr>
                <div v-if = "playerCard.userID == user.id">
                    <button type="button" class="btn btn-danger btn-sm" @click = "removeExplorePlayerCard(playerCard)">Remove My Post From Explore Page</button>
                </div>
                
                </b-card>  
            </Draggable>
            </div>
        </div>
    </div>
</template>

<script>
import Draggable from "vuedraggable";
import {dataStore} from "../../../data/dataStore.js"
import Comment from "../create/Comment.vue"

export default {
  name: 'ExploreMain',
  components: {
    Comment,
    Draggable
  },

  props: {
    user: {
        type: Object,
        required: true
    }
  },
    data () {
    return {
        allData: dataStore
    };
  },
  methods: {
      async removeExplorePlayerCard(playerCard){
          this.allData.removeExplorePlayerCard(playerCard);
      }
  },

  async mounted () {
  }
}
</script>

<style>
</style>
