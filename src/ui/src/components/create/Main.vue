<template>
    <div id = "App">
      <header>
            <h1>CREATE</h1>
        </header>
        <hr>
      <div >
        <div v-if = "user.email">
          <h5> Welcome to the Create Page! Here you can search for your favorite NBA players and create unique player with both performance and popular opinion metrics.
            <span class = "br"></span> 
            <div>
              <button type="button" class="btn btn-dark btn-sm" @click= "instructionsModalVisible = true">Click Here to Learn How to Use the Page</button>
            </div>
          </h5>
          <hr>
        </div>
        <div v-else>
          <h5> Welcome to the Create Page! Here you can search for your favorite NBA players and create unique player with both performance and popular opinion metrics. 
                Please log in to create your own player cards.
          </h5>
          <hr>
        </div>
      <b-container>
        <h3>Search Players</h3>
        <br>
        <b-row align-h="center">
          <b-col sm="5">
         
              <b-form-group id="fieldset-horizontal"
                label-cols-sm="4"
                label-cols-lg="3"
                content-cols-sm
                content-cols-lg="7"
                label="First Name:"
                label-for="input-horizontal"
              >
                <b-form-input type="text" v-model = "firstNameSearch" id="input-horizontal" placeholder="Enter Player's First Name"></b-form-input>
              </b-form-group>
              <b-form-group id="fieldset-horizontal"
                label-cols-sm="4"
                label-cols-lg="3"
                content-cols-sm
                content-cols-lg="7"
                label="Last Name:"
                label-for="input-horizontal"
              >
                <b-form-input type="text" v-model = "lastNameSearch" id="input-horizontal" placeholder="Enter Player's Last Name"></b-form-input>
              </b-form-group>
              <button type="button" :disabled = "nbaAPIBusy || user.email == null" class="btn btn-success btn-sm" @click= "searchPlayers(); collapseVisible = false">Search</button>
          </b-col>
        </b-row>
      </b-container>
    </div>
    <span class = "br"></span>
    <div v-if = "user.email">
    <div>
      <!-- Using modifiers -->
      <b-button @click = "collapseVisible = !collapseVisible" class="btn btn-dark btn-sm"> Click to Toggle Search Results</b-button>
      <!-- Element to collapse -->
      <b-collapse id="collapse-2" v-model= "collapseVisible" v-for = "(player,p) in players" :key= "p">
          <b-card id = "search">{{player.firstName}} {{player.lastName}}
            <br>
            <div>
              <button type="button" :disabled = "nbaAPIBusy" class="btn btn-success" @click = "addCreatePlayerCard(player)"> Create Player Card</button>
            </div>
          </b-card>      
      </b-collapse>
    </div>
    <br>
    <div class = "columns">
      <div v-for = "(playerCard, p) in allData.userCreatePlayerCards" :key = "p">
        <Draggable
        :group = "allData.userCreatePlayerCards">
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
            <hr>
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
                  <Draggable>
                      <comment
                          class = "card-comments"
                          v-for = "(comment,j) in playerCard.comments" :key = j
                          :comment = "comment" 
                          :playerCard = "playerCard"  
                          :editable = "true"
                      />
                  </Draggable>
                
              </ul>
            </div>
            <hr>
            <button type="button" :disabled = "sentimentAPIBusy" class="btn btn-dark btn-sm" @click = "displaySentimentAnalysis(playerCard)"> View / Refresh Twitter Sentiment Analysis</button>

            <span class="br"></span>
            <div>
              <button type="button" class="btn btn-dark btn-sm" @click = "commentModalVisible = true; playerCardToAddComment = playerCard">Add a Comment</button>
            </div>
            <span class="br"></span>
            <div>
              <button type="button" class="btn btn-dark btn-sm" @click = "addFavoritePlayerCard(playerCard)">Add to Favorites</button>
            </div>
            <span class="br"></span>
            <div>
              <button type="button" class="btn btn-dark btn-sm" @click = "addExplorePlayerCard(playerCard)">Publish to Explore Page</button>
            </div>
            <span class="br"></span>
            <div>
              <button type="button" class="btn btn-danger btn-sm" @click = "removeCreatePlayerCard(playerCard)">Remove From My Create Page</button>
            </div>
            
            </b-card>  
        </Draggable>

         <!-- modal for adding comments -->
          <b-modal v-model= "commentModalVisible" @ok = "addComment()">
            <label for="comment-modal">New Comment</label>
            <b-form-input trim id="comment-modal" v-model= "newComment"></b-form-input>
          </b-modal>

          <!-- modal for viewing instructions -->
          <b-modal v-model= "instructionsModalVisible" hide-footer>
            <div>
              <h3>CREATING A PLAYER CARD</h3>
              <ul>
                <li>
                  Begin your journey to creating your own player card by entering in an NBA player's first and last name in the corresponding search fields and then pressing the "Search" button.
                  <ul>
                    <li>If you want to search for players using only first name or only last name, you can do that as well!</li>
                    <li>If there exist two players with the same name, this will be specified via uppercase letters.</li>
                  </ul>
                </li>
                <li>
                  Next, press the "Click to Toggle Search Results" button to see the results of your search. Find the player you were looking for, click on the "Create Player Card" button,
                  and you're done! Your created player card will appear on the screen and will display that player's career stats.
                  <ul>
                    <li>Press "Click to Toggle Search Results" once more to hide search results.</li>
                    <li>You can't create the same player card twice, so pressing "Create Player Card" on LeBron James will only create one LeBron James card.</li>
                  </ul>
                </li>
              </ul>
              <hr>
              <h3>GETTING TWITTER SENTIMENT ANALYSIS</h3>
              <ul>
                <li>
                  To receive a sentiment analysis score from the Tweets collected about your chosen player, simply press the "View/Refresh Twitter Sentiment Analysis" button on your player card.
                  The Twitter and IBM Watson APIs work together in amazing ways, but the work they do is complex - <b>please be patient as your sentiment analysis loads.</b> In the meantime, 
                  feel free to search for other players and create new player cards!
                </li>
                <ul>
                  <li>
                    IBM Watson's API runs natural language processing algorithms to analyze text and return a score representing the associated sentiment. Notorious runs each 
                    tweet through the API and takes the averages of all the scores. The scores range from -1 to 1, with -1 being the most negative and 1 being the most positive. 
                  </li>
                  <li>
                    Pressing the "View/Refresh Twitter Sentiment Analysis" button runs natural language processing algorithms on the most recent tweets 
                    <b>from the moment you press the button.</b> This means that every time you press the button, you are getting the latest tweets about your selected player
                    and thus an updated sentiment analysis! Pressing this button also refreshes the careers stats for that player, in case they just played a game and you want 
                    their updated figures. You will notice that the creation time of your card will also update every time you refresh it, indicating the creation of a new statistical
                    snapshot.
                  </li>
                </ul>
              </ul>
              <hr>
              <h3>OTHER FEATURES</h3>
              <ul>
                <li>
                  Press the "Add a Comment" button to add a comment to your player card. You can add as many comments as you would like, and you can edit or remove individual
                  comments. 
                  <ul>
                    <li>
                      Pressing the "View/Refresh Twitter Sentiment Analysis" button is considered creating a new statistical snapshot and thus a new 
                      card, so any comments that you had will be removed. 
                    </li>
                  </ul>
                </li>
                <li>
                  Press the "Add to Favorites" button to save your player card to your favorites page. 
                  <ul>
                    <li>
                      You can only add a certain card to your favorites once. However, as mentioned previously, pressing the "View/Refresh Twitter Sentiment Analysis" button is 
                      considered creating a new statistical snapshot. This means that you <b>are</b> allowed to add a certain card to your favorites, refresh it at a later time, and then 
                      also add this refreshed card to your favorites. 
                    </li>
                  </ul>
                </li>
                <li>
                  Press the "Publish to Explore Page" button to post your player card to the explore page for everyone else to see, with your display name attributed to it.
                  <ul>
                    <li>
                      The same rules for adding the same player card multiple times as above apply.
                    </li>
                  </ul>
                </li>
                <li>
                  Press "Remove From My Create Page" to Remove your created player card at any time. 
                  <ul>
                    <li>
                      Don't worry! Removing your card from the Create page will <b>not</b> remove it from your favorites or the explore page if you had previously saved/published it. You can 
                      remove those instances directly from the pages where they exist.
                    </li>
                  </ul>
                </li>
                
              </ul>
            </div>
          </b-modal>
        
      </div>
    </div>
    </div> 
  </div>
</template>

<script>
import Draggable from "vuedraggable";
import {dataStore} from "../../../data/dataStore.js"
import Comment from "./Comment.vue"

export default {
  name: 'CreateMain',
  components: {
    Draggable,
    Comment
  },

  props: {
    user: {
      type: Object,
      required: true
    }
  },

    data () {
    return {
      players: null, 
      firstNameSearch: "",
      lastNameSearch: "",
      searchTextEntered: "",
      playerInfoArray: [],
      analysis: null,
      allData: dataStore,
      nbaAPIBusy: false,
      sentimentAPIBusy: false,
      commentModalVisible: false,
      newComment: "",
      collapseVisible: false,
      instructionsModalVisible: false,
      playerCardToAddComment: null,
      apiUrlBase: process.env.VUE_APP_SERVER_API_BASE,
    };
  },
  methods: {
    async searchPlayers(){
      this.nbaAPIBusy = true;
      if (this.isValidSearch(this.firstNameSearch + this.lastNameSearch)){
        let concatenatedSearch = this.firstNameSearch + "," + this.lastNameSearch;
        console.log(concatenatedSearch);
        const response = await fetch(this.apiUrlBase + "api/search_players?tags=" + concatenatedSearch);
        this.players = await response.json(); 
        console.log(this.players);
      }
      this.nbaAPIBusy = false;
    },
    isValidSearch(inputText){
      let letters = /^[A-Za-z]+$/;
      if(inputText.match(letters)){
        return true;
      }
      else {
        alert("Please use only alphabetical characters in your search input. \nDo not include spaces, special characters, numbers, or any other non-alphabetical characters");
        return false;
        }
    },
    async addCreatePlayerCard(player){
      this.nbaAPIBusy = true;
      await this.allData.addCreatePlayerCard(player);
      console.log(this.allData.data);
      this.nbaAPIBusy = false; 
    },
    async removeCreatePlayerCard(playerCard){
      this.allData.removeCreatePlayerCard(playerCard);
    },
    async addFavoritePlayerCard(playerCard){
      this.allData.addFavoritePlayerCard(playerCard);
    },
    async addExplorePlayerCard(playerCard){
      this.allData.addExplorePlayerCard(playerCard, this.user.displayName);
    },
    async displaySentimentAnalysis(playerCard){
      this.sentimentAPIBusy = true
      this.nbaAPIBusy = true; 
      await this.allData.refreshCreatePlayerCard(playerCard);
      this.nbaAPIBusy = false;
      await this.allData.addSentimentAnalysis(playerCard); 
      this.sentimentAPIBusy = false;
    },
    async addComment(){
      console.log(this.playerCardToAddComment);
      console.log(this.newComment);
      if (this.isValidComment(this.newComment)){
        await this.allData.addComment(this.playerCardToAddComment, this.newComment); 
      }
      else {
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
