<template>
    <div>
        <header>
            <h1>NOTORIOUS.</h1>
            <h6>Powered by <a href="https://cloud.ibm.com/apidocs/natural-language-understanding">IBM Watson</a>, 
            <a href="https://developer.twitter.com/en/docs/twitter-api">Twitter API</a>, and 
            <a href="https://rapidapi.com/api-sports/api/api-nba/details"> API-NBA</a></h6>
        </header>
        <hr>
        <br>
        <div>
            <h3>
                Simultaneous Growth of Twitter and the NBA
            </h3>
            <br>
            <div>
                <div>
                    The NBA is an ever-complex, ever-changing league. Over the past few decades, the NBA has siginificantly evolved in accordance with the advent of new, sophisticaed technology. 
                    Players have access to better traning and rehabilitation equipment, teams are taking advantage of advanced metrics and analytics to improve their strategies, 
                    and the game itself is evolving as a result. For example, over the past twenty years, the average number of three pointers attempted per game has gone up 
                    nearly <a href="https://www.sbnation.com/nba/2021/3/10/22323023/nba-three-point-shooting-breaking-point"> 25%</a>, thanks in part to the analytical tools 
                    that have proved the efficiency of the three point shot. 
                </div>
                <br>
                <div>
                    As the game continues to change, topics surrounding the evolvement of playstyle, training habits, load management, and player freedom
                    are constantly being discussed among experts and casual-watchers alike, with many of these discussions happening on social media. Being one of the most 
                    popular social media platforms tailored to text-based posts, Twitter is a natural host for NBA discourse. As Twitter and the NBA have grown together, 
                    Twitter has become the epicenter of basketball fandom - a place where analysis, highlights, insults, and praise coexist. Even the NBA acknowledges the 
                    prevalence of its Twitter community, as evidenced a section of NBA.com called <a href="http://global.nba.com/nbapulse/">NBA pulse</a>  which ranks the top three trending 
                    players on Twitter by “mentions per hour” in real-time. 
                </div>
            </div>
            <hr>
            <br>
            <h3>Notorious - Contrasting On-Court Performance of NBA Players with Public Opinion</h3>
                <br>
                <div>
                    <div>
                        With so many tweets being consistently churned out about the NBA, the question of if/how these tweets might affect players arises. NBA fans on Twitter get straight
                        to the point, and they never hestitate to let a player know what they think after he's had a bad game or made a unfavorable decision - like they did with Clippers 
                        guard Paul George after a <a href="https://cassiuslife.com/playlist/paul-george-seth-curry-playoff-p/">poor playoff performance.</a> 
                    </div>
                    <br>
                    <div>
                        <b>This is where Notorious comes in.</b>
                        Notorious allows you to search for any NBA player and visualize a unique player card consisting of their career statistical averages along with a sentiment analysis score 
                        based on the Tweets containing their name. This enables you to compare a player's performance metrics with their public opinion, seeing the effect that a player's stats
                        might have on their Twitter popularity or vice versa. Notorious uses rapidapi's <a href="https://rapidapi.com/api-sports/api/api-nba/details">API-NBA</a> to 
                        search for players and their stats, the <a href="https://developer.twitter.com/en/docs/twitter-api">Twitter API </a> to collect tweets about that player, and IBM Watson's 
                        <a href="https://cloud.ibm.com/apidocs/natural-language-understanding">Natural Language Understanding API </a> to run these tweets through machine learning algorithms
                        and return a sentiment score. Notorious also allows you to save these statistical snapshots to your favorites, or even publish them to the explore 
                        page for all other users to see. <b> Log in and head over to the Create page or visit the Explore page to get started!</b>
                    </div>
                    
                </div>

        </div>
        <footer id = "partialPageFooter">
 
  <a rel="license" href="http://creativecommons.org/licenses/by/4.0/">
    <img alt="Creative Commons License" style="border-width:0" src="https://i.creativecommons.org/l/by/4.0/88x31.png" id = "rights" />
  </a><br />This work is licensed under a <a rel="license" href="http://creativecommons.org/licenses/by/4.0/">Creative Commons Attribution 4.0 International License</a>.
</footer>
    </div>
</template>

<script>
import { dataStore } from '../../../data/dataStore.js';

export default {
  name: 'ProfileMain',
  components: {
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
      allData: dataStore
    };
  },
  methods: {
   
  },
  async mounted () {
  }
}
</script>

<style>
</style>
