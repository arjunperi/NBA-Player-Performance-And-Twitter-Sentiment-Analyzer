# NBA Player Sentiment Analysis & Statistics Comparator

This project combines NBA, Twitter, and IBM Watson APIs to contrast NBA statistics with Twitter Sentiment analysis for players. 

## Arjun Peri

### Timeline

Start Date: 
3/20/2021

Finish Date: 
4/28/2021

Hours Spent:
~100 hrs


### Collaboration

Resources used:
- See welcome page for a list of sources, assets, and attributions


### Assignment Notes

How to use:
- There are no special access instructions/keys needed to run the app.
- Once logged in, I would suggest beginning by visitng the Create page. There is a button with a modal pop-up that details exactly how to use the page and its features. 

Data Authenticity: 
- [Twitter Data](https://developer.twitter.com/en/docs/authentication/overview)
    - The Twitter data used in my web app comes directly from the Twiter API and Twitter Developer portal. This link describes the authentication methods used to ensure data is secured and accurate,
    and the other API docs on the page also verify the credibility of the source.
- [Sentiment Analysis Data](https://www.predictiveanalyticstoday.com/ibm-watson-alchemyapi/)
    - The sentiment analysis data is done via IBM Watson's Natural Language Understanding API. IBM is an extremely well-established entity with highly sophisticated technologies, and the 
    above link details the API from a website that rates analytical tools like this. 
- [NBA Players and Statistics Data](https://sheriffjolaoso.com/blog/professional-development-and-professional-enablement)
    - The NBA data is collected using rapidapi's API-NBA. The API is well documented and has been used for many projects similar to mine. It has real-time data and 
    is comprehensive in its breadth and depth. Linked is a project that uses the API to see if team's with poor traditional stats are strong in stats that are not typically
    discussed. 


Database Description: 
- Top level 'data'
- 'createPlayerCards' hold all of the cards that have been created by users on the Create page. They contain the stats and sentiment score to display which are updated
upon the corresponding API calls, a userID to map the card to the user that created it, an apiID to map the card to the player it is referencing, a keyID which matches 
the randomly generated Firebase key for easy lookup, and a cardID to determine whether that card is a unique statistical snapshot (for purposes of determining whether adding 
the card to another section like favorites is allowed). There is also a timestamp of when that card was created or refreshed to be displayed.
- 'explorePlayerCards' holds all of the cards published to the Explore page. These elements contain the same fields as those in createPlayerCards, with the addition
of a displayName field so that it can be shown which users published which cards along with making it easy to change the display name on an explore card if the publishing user 
changes their display name. 
- 'favoritePlayerCards' holds all the cards that have been saved by users to their Favorites page. These contain all of the same fields as those in createPlayerCards.
- 'users' holds all of the different logged in users information: displayName, email, id, isAdmin, and photo. When a user logs in, the site automatically checks if that user
is new and adds to this structure if so. The userID here is mapped to the Firebase generated key. 
- 'loginRecords' holds the email and time of users logging into the page so that admins can see. 
- 'errorMessages' holds the value of whether or not a certain displayName has already been taken when user tries to edit their curerent display name. 
- Adding, updating, and removing is made very easy by mapping id's to the firebase-generated key. 


Different User Roles:
- As a non-logged in user you can only view the Explore page. You cannot edit any data on the page, and you cannot use the Create, Favorites, or Profile page. 
- Logged-in users can use the create page, save to their favorites, and publish to the explore page. They can remove/edit cards on their own create and favorites page, 
but they can only remove cards from the Explore page that they themselves have published. They can also visit the profile page to see their profile and change their display name.
- Admin users can see the site's login records on their profile page. 


Error Checking: 
- When users are searching for players on the Create page, I needed to ensure that they enter text that can be processed by the API-NBA. To do this, I checked to make 
sure that they entered only alphabetical characters, and no spaces, numbers, or other characters. If they fail to do this, they are prompted with an alert that tells them,
- When users are entering text for comments and display name, they must enter some sort of text. To ensure this, I checked to see if after removing all the spaces from their
entered text the length of the String is greater than 0. If not, that means they entered only spaces and they are met with an alert.
- I also needed to prevent a user from changing their display name to one that is already taken. To do this, I send their chosen name up to the database and check if it 
exists there. If so, the 'errorMessages' field gets updated and sent back to the frontend, which then alerts the user. 

Frameworks and Code Design: 
- The Vue.js framework was extremely helpful in maintaining responsiveness of my fronted. I used components to organize the different pages and aspects of the frontend, and 
this made editing and debugging far easier. It was also cool to see that for something like a comment, I was able to directly use the component I made for the Trello project, 
thus demonstrating the power and reusability of components. 
- I also used the MVC and Data Store framework to maintain clear responsibilities of my frontend and backend and ensure that the path of my data and how it is updated is 
consistent. In this, I use a frontend data store that calls methods on the backend server, which tell the backend data store to update the database. The changes from the data
base are then sent back down to the frontend datastore, which the Vue app responsively reads from. In doing this, I made sure the frontend just needs to worry about its own local data structure, the backend never has to worry about what is being displayed, and the database is only updated by one actor through one allowed path.

Responsiveness: 
- I have CSS media queries in my style.css file that change the background color for users depending on if they are on a computer, ipad, or iPhone. Beyond that, 
the website is completely resposive and all the elements fit to the width of the screen as intended. 

Bugs, Notes, and Considerations: 
- The process of analyzing Tweets is complex. I need to fetch the Tweets, and then send each one through the Watson API. This means calling the Watson API many times, resulting 
in a latency that can be viewed on the frontend. I made sure to allow for other frontend interaction while the analyses are loading, but I would have liked to find a better
solution and reduce this latency. 
    - When refreshing the sentiment analysis for a given player card, often times the score will change significantly. This is in part due to an influx of new tweets, but if I were able to send all 100 of the allowed most recent Tweets through the Watson API (if not for the huge wait time this would cause), I think the analyses would be more consistent and telling. 
