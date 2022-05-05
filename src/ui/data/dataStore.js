// package that bundles up query parameters given as an Object into URL syntax
import querystring from "querystring";

// simple utility function to encode the given object as query parameters
// and return the resulting JSON
// NOTE: queryParameters contains values meant to be passed along with the URL
// (i.e., after the ?)
// NOTE: protocolOptions contains values meant to be passed along with the request
// (i.e., GET/POST, headers, etc.)
async function getJSON(url, apiAction, queryParameters, protocolOptions) {
  const parameters = queryParameters
    ? `?${querystring.stringify(queryParameters)}`
    : "";
  const urlWithParameters = `${url}${apiAction}${parameters}`;
  console.log("getJSON", urlWithParameters);
  const response = await fetch(urlWithParameters, {
    credentials: "include",
    ...(protocolOptions || {}),
  });

  // only convert response if request suceeded
  if (response.ok) {
    return response.json();
  }

  // FIXME: probably a better way to handle this - return an empty data object
  console.error(response);
  return {};
}

const apiUrlBase = process.env.VUE_APP_SERVER_API_BASE;

export const dataStore = {
  data: [],
  userCreatePlayerCards: [],
  userFavoritePlayerCards: [],
  currentUser: null,

  // add a player card to the create page
  async addCreatePlayerCard(player) {
    // console.log(`Adding new link ${newLink.name} to group ${this.data[groupId].title}`);
    this.data = await getJSON(
      apiUrlBase,
      "api/add_create_card",
      // could also send URL query parameters, but none needed for this example
      null,
      {
        // add new data to be saved with values sent in body field
        method: "POST",
        // create JSON string automatically
        body: JSON.stringify({
          playerID: player.id,
          playerName: player.firstName + " " + player.lastName,
          userID: this.currentUser.id,
        }),
        headers: { "Content-type": "application/json;charset=UTF-8" },
      }
    );
    console.log();
    this.filterData();
  },
  //remove a player card from the create page
  async removeCreatePlayerCard(playerCard) {
    this.data = await getJSON(
      apiUrlBase,
      "api/remove_create_card",
      // could also send URL query parameters, but none needed for this example
      null,
      {
        // add new data to be saved with values sent in body field
        method: "POST",
        // create JSON string automatically
        body: JSON.stringify({ keyID: playerCard.keyID }),
        headers: { "Content-type": "application/json;charset=UTF-8" },
      }
    );
    this.filterData();
  },

  async refreshCreatePlayerCard(playerCard) {
    this.data = await getJSON(
      apiUrlBase,
      "api/refresh_create_card",
      // could also send URL query parameters, but none needed for this example
      null,
      {
        // add new data to be saved with values sent in body field
        method: "POST",
        // create JSON string automatically
        body: JSON.stringify({
          playerID: playerCard.apiID,
          keyID: playerCard.keyID,
        }),
        headers: { "Content-type": "application/json;charset=UTF-8" },
      }
    );
    this.filterData();
  },

  async addSentimentAnalysis(playerCard) {
    this.data = await getJSON(
      apiUrlBase,
      "api/add_sentiment_analysis",
      // could also send URL query parameters, but none needed for this example
      null,
      {
        // add new data to be saved with values sent in body field
        method: "POST",
        // create JSON string automatically
        body: JSON.stringify({
          playerName: playerCard.name,
          keyID: playerCard.keyID,
        }),
        headers: { "Content-type": "application/json;charset=UTF-8" },
      }
    );
    this.filterData();
  },

  async addComment(playerCard, newComment) {
    this.data = await getJSON(
      apiUrlBase,
      "api/add_comment",
      // could also send URL query parameters, but none needed for this example
      null,
      {
        // add new data to be saved with values sent in body field
        method: "POST",
        // create JSON string automatically
        body: JSON.stringify({
          keyID: playerCard.keyID,
          newComment: newComment,
        }),
        headers: { "Content-type": "application/json;charset=UTF-8" },
      }
    );
    this.filterData();
  },

  async removeComment(playerCard, comment) {
    this.data = await getJSON(
      apiUrlBase,
      "api/remove_comment",
      // could also send URL query parameters, but none needed for this example
      null,
      {
        // add new data to be saved with values sent in body field
        method: "POST",
        // create JSON string automatically
        body: JSON.stringify({
          playerCardKeyID: playerCard.keyID,
          commentKeyID: comment.keyID,
        }),
        headers: { "Content-type": "application/json;charset=UTF-8" },
      }
    );
    this.filterData();
  },

  async editComment(playerCard, originalComment, editedComment) {
    this.data = await getJSON(
      apiUrlBase,
      "api/edit_comment",
      // could also send URL query parameters, but none needed for this example
      null,
      {
        // add new data to be saved with values sent in body field
        method: "POST",
        // create JSON string automatically
        body: JSON.stringify({
          playerCardKeyID: playerCard.keyID,
          commentKeyID: originalComment.keyID,
          editedComment: editedComment,
        }),
        headers: { "Content-type": "application/json;charset=UTF-8" },
      }
    );
    this.filterData();
  },

  async addFavoritePlayerCard(playerCard) {
    this.data = await getJSON(
      apiUrlBase,
      "api/add_favorite_card",
      // could also send URL query parameters, but none needed for this example
      null,
      {
        // add new data to be saved with values sent in body field
        method: "POST",
        // create JSON string automatically
        body: JSON.stringify({ card: playerCard }),
        headers: { "Content-type": "application/json;charset=UTF-8" },
      }
    );
    this.filterData();
  },

  async removeFavoritePlayerCard(playerCard) {
    this.data = await getJSON(
      apiUrlBase,
      "api/remove_favorite_card",
      // could also send URL query parameters, but none needed for this example
      null,
      {
        // add new data to be saved with values sent in body field
        method: "POST",
        // create JSON string automatically
        body: JSON.stringify({ keyID: playerCard.keyID }),
        headers: { "Content-type": "application/json;charset=UTF-8" },
      }
    );
    this.filterData();
  },

  async addExplorePlayerCard(playerCard, displayName) {
    this.data = await getJSON(
      apiUrlBase,
      "api/add_explore_card",
      // could also send URL query parameters, but none needed for this example
      null,
      {
        // add new data to be saved with values sent in body field
        method: "POST",
        // create JSON string automatically
        body: JSON.stringify({ card: playerCard, displayName: displayName }),
        headers: { "Content-type": "application/json;charset=UTF-8" },
      }
    );
    console.log(this.data);
    this.filterData();
  },

  async removeExplorePlayerCard(playerCard) {
    this.data = await getJSON(
      apiUrlBase,
      "api/remove_explore_card",
      // could also send URL query parameters, but none needed for this example
      null,
      {
        // add new data to be saved with values sent in body field
        method: "POST",
        // create JSON string automatically
        body: JSON.stringify({ keyID: playerCard.keyID }),
        headers: { "Content-type": "application/json;charset=UTF-8" },
      }
    );
    this.filterData();
  },

  async checkNewUser() {
    // get the logged in user
    this.currentUser = await getJSON(
      apiUrlBase,
      "api/get_user",
      // could also send URL query parameters, but none needed for this example
      null,
      {
        // add new data to be saved with values sent in body field
        method: "GET",
        headers: { "Content-type": "application/json;charset=UTF-8" },
      }
    );
    //Only do all this if the user we got is logged in
    if (this.currentUser.email) {
      this.data = await getJSON(
        apiUrlBase,
        "api/add_user",
        // could also send URL query parameters, but none needed for this example
        null,
        {
          // add new data to be saved with values sent in body field
          method: "POST",
          body: JSON.stringify({ user: this.currentUser }),
          headers: { "Content-type": "application/json;charset=UTF-8" },
        }
      );
      //add the login time of the current user to the database, only if the user is a logged in user
      if (this.currentUser.email) {
        let today = new Date();
        let date =
          today.getFullYear() +
          "-" +
          (today.getMonth() + 1) +
          "-" +
          today.getDate();
        let time =
          today.getHours() +
          ":" +
          today.getMinutes() +
          ":" +
          today.getSeconds();
        let dateTime = date + " " + time;
        this.data = await getJSON(
          apiUrlBase,
          "api/add_login_time",
          // could also send URL query parameters, but none needed for this example
          null,
          {
            // add new data to be saved with values sent in body field
            method: "POST",
            body: JSON.stringify({
              email: this.currentUser.email,
              time: dateTime,
            }),
            headers: { "Content-type": "application/json;charset=UTF-8" },
          }
        );
      }
      this.getCorrectFields();
      this.filterData();
    } else {
      this.data = await getJSON(
        apiUrlBase,
        "api/get_all_data",
        // could also send URL query parameters, but none needed for this example
        null,
        {
          // add new data to be saved with values sent in body field
          method: "GET",
          headers: { "Content-type": "application/json;charset=UTF-8" },
        }
      );
    }
  },

  async changeDisplayName(user, newDisplayName) {
    this.data = await getJSON(
      apiUrlBase,
      "api/change_display_name",
      // could also send URL query parameters, but none needed for this example
      null,
      {
        // add new data to be saved with values sent in body field
        method: "POST",
        // create JSON string automatically
        body: JSON.stringify({ id: user.id, newDisplayName: newDisplayName }),
        headers: { "Content-type": "application/json;charset=UTF-8" },
      }
    );
    this.getCorrectFields();
    this.filterData();
  },

  //since the get_user call gives the id associated with the req (google profile id), we want to update the user's id with the correct ID from Firebase
  //same with name
  getCorrectFields() {
    if (this.data.users) {
      let usersArray = Object.values(this.data.users);
      usersArray.forEach((dbUser) => {
        // what if we just changed the email? then we would have to look for something else unique
        if (dbUser.email == this.currentUser.email) {
          console.log(dbUser.displayName);
          console.log("matched");
          this.currentUser.id = dbUser.id;
          this.currentUser.displayName = dbUser.displayName;
        }
      });
    }
  },

  getCorrectEmail() {
    if (this.data.users) {
      let usersArray = Object.values(this.data.users);
      usersArray.forEach((dbUser) => {
        // what if we just changed the email? then we would have to look for something else unique
        if (dbUser.displayName == this.currentUser.displayName) {
          console.log("matched");
          this.currentUser.email = dbUser.email;
        }
      });
    }
  },

  filterData() {
    this.userCreatePlayerCards = [];
    this.userFavoritePlayerCards = [];
    if (this.data.createPlayerCards) {
      let dbCreatePlayerCardsArray = Object.values(this.data.createPlayerCards);
      dbCreatePlayerCardsArray.forEach((playerCard) => {
        if (playerCard.userID == this.currentUser.id) {
          this.userCreatePlayerCards.push(playerCard);
        }
      });
    }
    if (this.data.favoritePlayerCards) {
      let dbFavoritePlayerCardsArray = Object.values(
        this.data.favoritePlayerCards
      );
      dbFavoritePlayerCardsArray.forEach((playerCard) => {
        if (playerCard.userID == this.currentUser.id) {
          this.userFavoritePlayerCards.push(playerCard);
        }
      });
    }
  },

  // check if we've already added the card to the user specific array
  isDuplicate(cardID) {
    console.log(this.userCreatePlayerCards);
    //if the user's create player cards already has a card with that same cardID in it, don't add
    console.log(
      this.userCreatePlayerCards.some(
        (playerCard) => playerCard.cardID == cardID
      )
    );
    return this.userCreatePlayerCards.some(
      (playerCard) => playerCard.cardID == cardID
    );
  },
};
