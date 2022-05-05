const admin = require("firebase-admin");

// provide global access to initialized app database
const { FIREBASE_CONFIG } = require("./secrets");
admin.initializeApp({
  credential: admin.credential.cert(FIREBASE_CONFIG),
  databaseURL: `https://${FIREBASE_CONFIG.project_id}-default-rtdb.firebaseio.com`,
});
const DB = admin.database();

//random number generator
const { uuid } = require("uuidv4");

// actual data structure that the rest of the program will interact with
module.exports = {
  // could store a local copy of the database data to reduce time querying,
  // but note that any "extra" data only here in server will be wiped out
  // periodically when Heroku restarts server
  dataRef: DB.ref("data"),
  createPlayerCardsRef: DB.ref("data/createPlayerCards"),
  usersRef: DB.ref("data/users"),
  favoritePlayerCardsRef: DB.ref("data/favoritePlayerCards"),
  explorePlayerCardsRef: DB.ref("data/explorePlayerCards"),
  loginRecordsRef: DB.ref("data/loginRecords"),
  errorMessagesRef: DB.ref("data/errorMessages"),

  // return all the data
  async getData() {
    console.log(`Getting data at ${this.getTimeStamp()}`);
    // NOT the data directly, get current snapshot of all data to process locally
    const snapshot = await this.dataRef.once("value");
    // return actual data held within snapshot (also has convenience functions like forEach to process the data)
    return snapshot.val();
    // note could catch possible errors here, but should be caught be "general" error middleware
  },

  async addCreatePlayerCard(stats, name, userID, apiID, time) {
    if (await this.isUniqueCreation(name, userID)) {
      const newCreatePlayerCardRef = await this.createPlayerCardsRef.push({
        name: name,
        apiID: apiID,
        stats,
        userID: userID,
        cardID: uuid(),
        time: time,
      });
      const newCreatePlayerCardID = newCreatePlayerCardRef.key;
      await newCreatePlayerCardRef.child("/keyID").set(newCreatePlayerCardID);
    }
  },

  //make sure we don't add the same card twice
  async isUniqueCreation(name, userID) {
    //go through all of the create player cards of a specific user and make sure they have not already added this card
    //need the user ID
    const snapshot = await this.createPlayerCardsRef.once("value");
    let match = 0;
    snapshot.forEach((dbCard) => {
      if (userID == dbCard.val().userID && name == dbCard.val().name) {
        match++;
      }
    });
    return match == 0;
  },

  async removeCreatePlayerCard(id) {
    await this.createPlayerCardsRef.child(`${id}`).remove();
  },

  async refreshCreatePlayerCard(stats, id) {
    await this.createPlayerCardsRef.child(`${id}/stats`).set(stats);
    //since we refreshed it, it should get a new unique ID
    await this.createPlayerCardsRef.child(`${id}/cardID`).set(uuid());
  },

  //add/update the sentiment analysis to a playerCard specified by an ID
  async addSentimentAnalysis(score, id, time) {
    await this.createPlayerCardsRef.child(`${id}/score`).set(score);
    //since we refreshed it, it should get a new unique ID
    await this.createPlayerCardsRef.child(`${id}/cardID`).set(uuid());
    await this.createPlayerCardsRef.child(`${id}/time`).set(time);
    //new card so remove all the comments
    await this.createPlayerCardsRef.child(`${id}/comments`).remove();
  },

  //add a comment to a create player card
  async addComment(id, newComment) {
    const newCommentRef = await this.createPlayerCardsRef
      .child(`${id}/comments`)
      .push({
        text: newComment,
      });
    const newCommentID = newCommentRef.key;
    await newCommentRef.child("/keyID").set(newCommentID);
  },

  //edit comment on a player card
  async editComment(cardID, commentID, editedComment) {
    await this.createPlayerCardsRef
      .child(`${cardID}/comments/${commentID}/text`)
      .set(editedComment);
  },

  //remove comment from player card
  async removeComment(cardID, commentID) {
    await this.createPlayerCardsRef
      .child(`${cardID}/comments/${commentID}`)
      .remove();
  },

  //only add if we have never added a card with the same cardID
  //card ID gets refreshed anytime you call the APIs, which is what we want because that means we are creating or refreshing the data on the card
  async addFavoritePlayerCard(playerCard) {
    if (
      await this.isUniqueCard(playerCard.cardID, this.favoritePlayerCardsRef)
    ) {
      const newFavoritePlayerCardRef = await this.favoritePlayerCardsRef.push(
        playerCard
      );
      const newFavoritePlayerCardID = newFavoritePlayerCardRef.key;
      await newFavoritePlayerCardRef
        .child("/keyID")
        .set(newFavoritePlayerCardID);
    }
  },

  async removeFavoritePlayerCard(id) {
    await this.favoritePlayerCardsRef.child(`${id}`).remove();
  },

  async addExplorePlayerCard(playerCard, displayName) {
    if (
      await this.isUniqueCard(playerCard.cardID, this.explorePlayerCardsRef)
    ) {
      const newExplorePlayerCardRef = await this.explorePlayerCardsRef.push(
        playerCard
      );
      const newExplorePlayerCardID = newExplorePlayerCardRef.key;
      await newExplorePlayerCardRef.child("/keyID").set(newExplorePlayerCardID);
      await newExplorePlayerCardRef.child("/displayName").set(displayName);
    }
  },

  async removeExplorePlayerCard(id) {
    await this.explorePlayerCardsRef.child(`${id}`).remove();
  },

  //check if the favorites have a card with the same cardID
  async isUniqueCard(cardID, ref) {
    const snapshot = await ref.once("value");
    let match = 0;
    snapshot.forEach((dbCard) => {
      if (cardID == dbCard.val().cardID) {
        match++;
      }
    });
    console.log("matchap:", match);
    return match == 0;
  },

  //check if the email exists in the array of users
  //if not, add a new user object to database
  async addUser(user) {
    const snapshot = await this.usersRef.once("value");
    let match = 0;
    snapshot.forEach((dbUser) => {
      if (user.email == dbUser.val().email) {
        match++;
      }
    });
    //we didn't find any email matches, thus we need to create a new user
    if (match == 0) {
      const newUserRef = await this.usersRef.push(user);
      const newUserID = newUserRef.key;
      await newUserRef.child("/id").set(newUserID);
    }
  },

  //change a user's display name, only if there is not a user with the same display name already
  //any explore player cards with that display name need to change as well
  async changeDisplayName(id, newDisplayName) {
    await this.changeDisplayNameExplorePlayerCards(id, newDisplayName);
    await this.errorMessagesRef.child(`/displayNameTaken`).set(0);
    if (await this.isUniqueDisplayName(id, newDisplayName)) {
      await this.usersRef.child(`${id}/displayName`).set(newDisplayName);
    } else {
      await this.errorMessagesRef.child(`/displayNameTaken`).set(1);
    }
  },

  //find all the explore cards with this user ID
  //set their display names to the new display name
  async changeDisplayNameExplorePlayerCards(id, displayName) {
    const snapshot = await this.explorePlayerCardsRef.once("value");
    let keys = [];
    snapshot.forEach((dbExplore) => {
      if (id == dbExplore.val().userID) {
        keys.push(dbExplore.key);
      }
    });
    if (keys.length > 0) {
      for (key of keys) {
        await this.explorePlayerCardsRef
          .child(`${key}/displayName`)
          .set(displayName);
      }
    }
  },

  async isUniqueDisplayName(id, newDisplayName) {
    const snapshot = await this.usersRef.once("value");
    let match = 0;
    snapshot.forEach((dbUser) => {
      //make sure we're not comparing to ourself
      if (newDisplayName == dbUser.val().displayName && id != dbUser.val().id) {
        match++;
      }
    });
    return match == 0;
  },

  //add user and time when logging in
  async recordLogin(email, time) {
    await this.loginRecordsRef.push({
      email: email,
      time: time,
    });
  },

  // basic utility to display the time in a readable format
  getTimeStamp() {
    return new Date().toISOString().slice(0, 19).replace("T", " ");
  },
};
