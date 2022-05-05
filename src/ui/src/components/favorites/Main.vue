<template>
    <div id = "App">
      <header>
            <h1>FAVORITES</h1>
        </header>
        <hr>
        <div v-if = "user.email">
          <h5> 
            Welcome to your Favorites Page! Here you can view all of the player card creations that you have saved, or remove ones that you no longer want saved. 
          </h5>
          <hr>
        </div>
        <div v-else>
          <h5> 
            Please log in to save your favorite statistical snapshots and view them all in one place. Feel free to visit the Explore page to see of the creations that other users 
            have published!
          </h5>
          <hr>
        </div>
        <div v-if = "user.email">
            <div class = "columns">
            <div v-for = "(playerCard, p) in allData.userFavoritePlayerCards" :key = "p">
              <Draggable>
                <b-card id = "card">
                Created At: {{playerCard.time}}
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
                <br>  
                <br>
                <div v-if = "playerCard.score != null">
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
                <div>
                    <button type="button" class="btn btn-danger btn-sm" @click = "removeFavoritePlayerCard(playerCard)">Remove From My Favorites</button>
                </div>
                </b-card>  
              </Draggable>
            </div>
        </div>
        </div>
    </div>
</template>

<script>
import Draggable from "vuedraggable";
import {dataStore} from "../../../data/dataStore.js"
import Comment from "../create/Comment.vue"

export default {
  name: 'FavoritesMain',
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
    async removeFavoritePlayerCard(playerCard){
        this.allData.removeFavoritePlayerCard(playerCard);
    }
  },

  async mounted () {
  }
}
</script>

<style>
</style>
