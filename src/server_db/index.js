// set up authentication
const auth = require("./authentication.js");

// package for responding to requests for a specific URL
const express = require("express");
// package for logging attempts to access the server (for easier debugging)
const morgan = require("morgan");
// package that replicates fetch functionality built into the browser
const fetch = require("node-fetch");
// package that bundles up query parameters given as an Object into URL syntax
const querystring = require("querystring");

// hard coded set of admin users (BOTH remote and local)
const adminEmailAddresses = [
  "arjun.peri55@gmail.com",
  "fake_alice@cs.duke.edu",
  "rcd@cs.duke.edu",
  "dquan@cs.duke.edu",
];

// set up server specific configuration values
const { NBA_API, TWITTER_API } = require("./secrets.js");

const { get } = require("http");

const NBA_API_PROTOCOL_OPTIONS = {
  method: "GET",
  headers: {
    "x-rapidapi-key": NBA_API.TOKEN,
    "x-rapidapi-host": "api-nba-v1.p.rapidapi.com",
  },
};

const TWITTER_API_PROTOCOL_OPTIONS = {
  method: "GET",
  headers: {
    "User-Agent": "v2RecentSearchJS",
    authorization: `Bearer ${TWITTER_API.BEARER_TOKEN}`,
  },
};

const dataStore = require("./dataStore.js");
// allow code to be run locally or when deployed on a remote host
const PORT = process.env.PORT || 3000;
const app = express();
auth.setupAuthentication(app);

app.listen(PORT, () => console.log(`App listening on port ${PORT}`));

app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms")
);

// parse JSON data sent to URL requests
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//test to see if we are fetching correctly
async function getJSON(url, apiAction, queryParameters, protocolOptions) {
  const parameters = queryParameters
    ? `?${querystring.stringify(queryParameters)}`
    : "";
  const urlWithParameters = `${url}${apiAction}${parameters}`;
  console.log(urlWithParameters);
  // const response = await fetch(urlWithParameters, protocolOptions);
  // return response.json();
  const response = await fetch(urlWithParameters, {
    credentials: "include",
    ...(protocolOptions || {}),
  });
  if (response.ok) {
    return response.json();
  }
  // FIXME: probably a better way to handle this - return an empty data object
  console.error(response);
  return {};
}

//API only allows for first name OR last name lookup, so choose one then loop through to manually check the other
//first, get all players with first name
async function fetchPlayersFromSearch(firstName, lastName) {
  //if last name is empty and first name isn't
  if (firstName && !lastName) {
    console.log("if");
    //get all players with first matching first name
    let firstNameAction = `players/firstName/${firstName}`;
    let matches = await getJSON(
      NBA_API.URL,
      firstNameAction,
      "",
      NBA_API_PROTOCOL_OPTIONS
    );
    let firstNameMatches = [];
    matches.api.players.forEach((player) => {
      firstNameMatches.push({
        firstName: player.firstName,
        lastName: player.lastName,
        id: player.playerId,
      });
    });
    return firstNameMatches;
  }
  //if first name is empty and last name isn't
  else if (!firstName && lastName) {
    console.log("elseif");
    //get all players with first matchning last name
    let lastNameAction = `players/lastName/${lastName}`;
    let matches = await getJSON(
      NBA_API.URL,
      lastNameAction,
      "",
      NBA_API_PROTOCOL_OPTIONS
    );
    let lastNameMatches = [];
    matches.api.players.forEach((player) => {
      lastNameMatches.push({
        firstName: player.firstName,
        lastName: player.lastName,
        id: player.playerId,
      });
    });
    return lastNameMatches;
  }
  //if neither are empty
  else {
    console.log("else");
    let firstNameAction = `players/firstName/${firstName}`;
    let firstNameMatches = await getJSON(
      NBA_API.URL,
      firstNameAction,
      "",
      NBA_API_PROTOCOL_OPTIONS
    );
    let fullNameMatches = [];
    //find the player in the array of first name matches also has the given last name
    firstNameMatches.api.players.forEach((player) => {
      if (
        player.firstName.toLowerCase() == firstName.toLowerCase() &&
        player.lastName.toLowerCase() == lastName.toLowerCase()
      ) {
        fullNameMatches.push({
          firstName: player.firstName,
          lastName: player.lastName,
          id: player.playerId,
        });
      }
    });
    return fullNameMatches;
  }
}

//take in a player object and get their stats and return their career averages
async function fetchPlayerStats(id) {
  let playerStatsAction = `statistics/players/playerId/${id}`;
  let stats = await getJSON(
    NBA_API.URL,
    playerStatsAction,
    "",
    NBA_API_PROTOCOL_OPTIONS
  );
  return getAverages(stats.api.statistics);
  // return stats;
}

//helper function to loop through all stats and get averages
function getAverages(statsArray) {
  let pointsArray = [];
  let assistsArray = [];
  let minutesArray = [];
  let fgpArray = [];
  let ftpArray = [];
  let orebArray = [];
  let drebArray = [];
  let rebArray = [];
  let stlArray = [];
  let blkArray = [];
  let tovArray = [];
  let plsminArray = [];

  statsArray.forEach((stats) => {
    //check to make sure its not null
    if (stats.min) {
      // check to make sure they played (couple of different ways the api formats 0 minutes)
      if (stats.min != "0:00" && stats.min != "0" && stats.min != "") {
        pointsArray.push(parseInt(stats.points));
        assistsArray.push(parseInt(stats.assists));
        minutesArray.push(stats.min);
        fgpArray.push(parseInt(stats.fgp));
        ftpArray.push(parseInt(stats.ftp));
        orebArray.push(parseInt(stats.offReb));
        drebArray.push(parseInt(stats.defReb));
        rebArray.push(parseInt(stats.totReb));
        stlArray.push(parseInt(stats.steals));
        blkArray.push(parseInt(stats.blocks));
        tovArray.push(parseInt(stats.turnovers));
        plsminArray.push(parseInt(stats.plusMinus));
      }
    }
  });
  //put all the averages into an object and return it
  let statsObject = {
    points: parseFloat(getAverage(pointsArray).toFixed(1)),
    assists: parseFloat(getAverage(assistsArray).toFixed(1)),
    minutes: getMinutesAverage(minutesArray),
    fgp: parseFloat(getAverage(fgpArray).toFixed(1)),
    ftp: parseFloat(getAverage(ftpArray).toFixed(1)),
    oreb: parseFloat(getAverage(orebArray).toFixed(1)),
    dreb: parseFloat(getAverage(drebArray).toFixed(1)),
    reb: parseFloat(getAverage(rebArray).toFixed(1)),
    stl: parseFloat(getAverage(stlArray).toFixed(1)),
    blk: parseFloat(getAverage(blkArray).toFixed(1)),
    tov: parseFloat(getAverage(tovArray).toFixed(1)),
    plsmin: parseFloat(getAverage(plsminArray).toFixed(1)),
  };
  return statsObject;
}

//helper function that performs the actual calculation of average on an array
function getAverage(array) {
  let total = 0;
  array.forEach((element) => {
    total = total + element;
  });
  return total / array.length;
}

//helper function to take the minutes played string and turn it into a number so we can get the average
function getMinutesAverage(minutesArray) {
  let totalSeconds = 0;
  minutesArray.forEach((element) => {
    let minutes = parseInt(element.substring(0, 2));
    let seconds = parseInt(element.substring(3));
    totalSeconds = totalSeconds + minutes * 60 + seconds;
  });
  //get the average total seconds
  let avgSeconds = Math.floor(totalSeconds / minutesArray.length);
  //convert from seconds back to minutes
  let intPortion = Math.floor(avgSeconds / 60);
  let decimalPortion = avgSeconds / 60 - Math.floor(avgSeconds / 60);
  let secs = Math.floor(decimalPortion * 60);
  //put it in a string to return
  return `${intPortion}:${secs}`;
}

//----------------------------------------------------------------------------------------------------------------
async function fetchTweets(queryString) {
  let tweetSearchAction = "tweets/search/recent";
  const params = {
    query: queryString,
    max_results: 10,
    "tweet.fields": "lang",
  };
  let tweets = await getJSON(
    TWITTER_API.URL,
    tweetSearchAction,
    params,
    TWITTER_API_PROTOCOL_OPTIONS
  );
  return tweets;
}

//for each tweet, get the sentiment analysis
async function getSentimentAverages(queryString) {
  let tweetText = "";
  let tweetTextArray = [];
  let sentimentArray = [];
  let tweets = await fetchTweets(queryString);
  for (tweet of tweets.data) {
    if (tweet.lang == "en") {
      tweet.text.split(" ").forEach((word) => {
        if (word.includes("https://t.co/")) {
          tweet.text = tweet.text.replace(word, "");
        }
      });
      tweetTextArray.push(tweet.text);
      tweetText += tweet.text;
      let analysis = await analyzeTweet(tweet.text);
      sentimentArray.push(analysis);
    }
  }
  return computeSentimentAverages(sentimentArray);
  // return sentimentArray;
}

function computeSentimentAverages(sentimentArray) {
  let scoreArray = [];

  sentimentArray.forEach((sentimentObject) => {
    console.log(sentimentObject);
    scoreArray.push(sentimentObject.sentiment.score);
  });

  let scoreAvg = getAverage(scoreArray);

  return Math.round(scoreAvg * 10000) / 10000;
}

//----------------------------------------------------------------------------------------------------------------

const NaturalLanguageUnderstandingV1 = require("ibm-watson/natural-language-understanding/v1");
const { IamAuthenticator } = require("ibm-watson/auth");
const { connect } = require("http2");
const { type } = require("os");
const { database } = require("firebase-admin");
const { stat } = require("fs");

const naturalLanguageUnderstanding = new NaturalLanguageUnderstandingV1({
  version: "2020-08-01",
  authenticator: new IamAuthenticator({
    apikey: "gHpiZj5QTSg8s5G3St2Nb0zmltkv_prqosIrhEFDLZmA",
  }),
  serviceUrl:
    "https://api.us-east.natural-language-understanding.watson.cloud.ibm.com/instances/3c7528e2-0179-4d40-ae9c-11837f412e15",
});

async function analyzeTweet(tweetText) {
  const analyzeParams = {
    text: tweetText,
    language: "en",
    features: {
      sentiment: {},
      // emotion: {}
    },
  };
  let analysisResults = await naturalLanguageUnderstanding.analyze(
    analyzeParams
  );
  let sentimentObject = {
    sentiment: {
      score: analysisResults.result.sentiment.document.score,
      label: analysisResults.result.sentiment.document.label,
    },
  };
  return sentimentObject;
}

//----------------------------------------------------------------------------------------------------------------
function extractUserId(req) {
  return req.user?.id || "<none>";
}

//----------------------------------------------------------------------------------------------------------------

function returnAllData() {
  return async (req, res, next) => {
    // NOTE, not ideal to return ALL the data but makes it easier to debug and use by frontend
    const allData = await dataStore.getData();
    res.status(200);
    res.json(allData);
  };
}

//----------------------------------------------------------------------------------------------------------------

// provide some response to visiting the server directly (i.e., its homepage)
app.get("/", (req, res, next) => {
  res.send('<a href="api/get_data">Get the Data!</a>');
  res.status(200);
});

// return the JSON data resulting from remote API requests
app.get(
  "/api/get_data",
  // returnAllData()
  async (req, res, next) => {
    // let data = await fetchPlayersFromSearch("lebron", "durant");
    // let player = {
    //     firstName: "James",
    //     lastName: "Harden",
    //     id: 216
    // }
    let search = await fetchPlayersFromSearch("Kevin", "");
    let stats = await fetchPlayerStats(153);
    let tweets = await fetchTweets("Kevin Durant");
    // let data = await analyzeTweet("Lebron is better than Jordan");
    let avg = await getSentimentAverages("Kevin Durant");
    try {
      // console.log(data);
      res.status(200);
      // construct JSON object to return, must match what frontend is expecting
      res.json({
        searchResults: search,
        stats: stats,
        tweets: tweets,
        sentimentAvg: avg,
      });
    } catch (error) {
      console.log(error);
      // create error object with useful message
      const err = new Error(
        "Error: Check server --- one or more APIs are currently unavailable."
      );
      // set status code to return with response
      err.status = 503;
    }
  }
);

app.get("/api/get_all_data", returnAllData());

//get all the players that match a given search
app.get("/api/search_players", async (req, res, next) => {
  try {
    if (req.query.tags) {
      console.log("hit");
      console.log(req.query.tags);
      let firstName = req.query.tags.slice(0, req.query.tags.indexOf(","));
      console.log(firstName);
      let lastName = req.query.tags.slice(req.query.tags.indexOf(",") + 1);
      console.log(lastName);
      players = await fetchPlayersFromSearch(firstName, lastName);
    } else {
      console.log("else");
      players = await fetchPlayersFromSearch("kevin", "durant");
    }
    res.status(200);
    // construct JSON object to return, must match what frontend is expecting
    res.json(players);
  } catch (error) {
    console.log(error);
    // create error object with useful message
    const err = new Error(
      "Error: Check server --- one or more APIs are currently unavailable."
    );
    // set status code to return with response
    err.status = 503;
  }
});

//add a createPlayerCard to the database
//call the external API, then add to database
app.post(
  "/api/add_create_card",
  async (req, res, next) => {
    try {
      stats = await fetchPlayerStats(req.body.playerID);
      let today = new Date();
      let date =
        today.getFullYear() +
        "-" +
        (today.getMonth() + 1) +
        "-" +
        today.getDate();
      let time =
        today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
      let dateTime = date + " " + time;
      res.status(200);
      await dataStore.addCreatePlayerCard(
        stats,
        req.body.playerName,
        req.body.userID,
        req.body.playerID,
        dateTime
      );
      next();
    } catch (error) {
      console.log(error);
      // create error object with useful message
      const err = new Error(
        "Error: Check server --- one or more APIs are currently unavailable."
      );
      // set status code to return with response
      err.status = 503;
    }
  },
  returnAllData()
);

//remove create player card from database
app.post(
  "/api/remove_create_card",
  async (req, res, next) => {
    try {
      res.status(200);
      await dataStore.removeCreatePlayerCard(req.body.keyID);
      next();
    } catch (error) {
      console.log(error);
      // create error object with useful message
      const err = new Error(
        "Error: Check server --- one or more APIs are currently unavailable."
      );
      // set status code to return with response
      err.status = 503;
    }
  },
  returnAllData()
);

//refresh NBA stats on a create player card
app.post(
  "/api/refresh_create_card",
  async (req, res, next) => {
    try {
      stats = await fetchPlayerStats(req.body.playerID);
      res.status(200);
      await dataStore.refreshCreatePlayerCard(stats, req.body.keyID);
      next();
    } catch (error) {
      console.log(error);
      // create error object with useful message
      const err = new Error(
        "Error: Check server --- one or more APIs are currently unavailable."
      );
      // set status code to return with response
      err.status = 503;
    }
  },
  returnAllData()
);

//get the sentiment analysis and add it to the playerCard
app.post(
  "/api/add_sentiment_analysis",
  async (req, res, next) => {
    try {
      score = await getSentimentAverages(req.body.playerName);
      let today = new Date();
      let date =
        today.getFullYear() +
        "-" +
        (today.getMonth() + 1) +
        "-" +
        today.getDate();
      let time =
        today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
      let dateTime = date + " " + time;
      res.status(200);
      await dataStore.addSentimentAnalysis(score, req.body.keyID, dateTime);
      next();
    } catch (error) {
      console.log(error);
      // create error object with useful message
      const err = new Error(
        "Error: Check server --- one or more APIs are currently unavailable."
      );
      // set status code to return with response
      err.status = 503;
    }
  },
  returnAllData()
);

//add a comment to the create player card
app.post(
  "/api/add_comment",
  async (req, res, next) => {
    try {
      res.status(200);
      await dataStore.addComment(req.body.keyID, req.body.newComment);
      next();
    } catch (error) {
      console.log(error);
      // create error object with useful message
      const err = new Error(
        "Error: Check server --- one or more APIs are currently unavailable."
      );
      // set status code to return with response
      err.status = 503;
    }
  },
  returnAllData()
);

//remove a commment from player card
app.post(
  "/api/remove_comment",
  async (req, res, next) => {
    try {
      res.status(200);
      await dataStore.removeComment(
        req.body.playerCardKeyID,
        req.body.commentKeyID
      );
      next();
    } catch (error) {
      console.log(error);
      // create error object with useful message
      const err = new Error(
        "Error: Check server --- one or more APIs are currently unavailable."
      );
      // set status code to return with response
      err.status = 503;
    }
  },
  returnAllData()
);

//edit comment on a player card
app.post(
  "/api/edit_comment",
  async (req, res, next) => {
    try {
      res.status(200);
      await dataStore.editComment(
        req.body.playerCardKeyID,
        req.body.commentKeyID,
        req.body.editedComment
      );
      next();
    } catch (error) {
      console.log(error);
      // create error object with useful message
      const err = new Error(
        "Error: Check server --- one or more APIs are currently unavailable."
      );
      // set status code to return with response
      err.status = 503;
    }
  },
  returnAllData()
);

//add a playerCard to a user's favorites
app.post(
  "/api/add_favorite_card",
  async (req, res, next) => {
    try {
      await dataStore.addFavoritePlayerCard(req.body.card);
      next();
    } catch (error) {
      console.log(error);
      // create error object with useful message
      const err = new Error(
        "Error: Check server --- one or more APIs are currently unavailable."
      );
      // set status code to return with response
      err.status = 503;
    }
  },
  returnAllData()
);

//remove favorite player card from database
app.post(
  "/api/remove_favorite_card",
  async (req, res, next) => {
    try {
      res.status(200);
      await dataStore.removeFavoritePlayerCard(req.body.keyID);
      next();
    } catch (error) {
      console.log(error);
      // create error object with useful message
      const err = new Error(
        "Error: Check server --- one or more APIs are currently unavailable."
      );
      // set status code to return with response
      err.status = 503;
    }
  },
  returnAllData()
);

//add a playerCard to the explore page
app.post(
  "/api/add_explore_card",
  async (req, res, next) => {
    try {
      await dataStore.addExplorePlayerCard(req.body.card, req.body.displayName);
      next();
    } catch (error) {
      console.log(error);
      // create error object with useful message
      const err = new Error(
        "Error: Check server --- one or more APIs are currently unavailable."
      );
      // set status code to return with response
      err.status = 503;
    }
  },
  returnAllData()
);

//remove player card from explore page if you were the one who posted it
app.post(
  "/api/remove_explore_card",
  async (req, res, next) => {
    try {
      res.status(200);
      await dataStore.removeExplorePlayerCard(req.body.keyID);
      next();
    } catch (error) {
      console.log(error);
      // create error object with useful message
      const err = new Error(
        "Error: Check server --- one or more APIs are currently unavailable."
      );
      // set status code to return with response
      err.status = 503;
    }
  },
  returnAllData()
);

//get the twitter sentiment analysis
app.get("/api/get_analysis", async (req, res, next) => {
  try {
    if (req.query.tags) {
      console.log(req.query.tags);
      analysis = await getSentimentAverages(req.query.tags);
    } else {
      console.log("else");
    }
    res.status(200);
    // construct JSON object to return, must match what frontend is expecting
    res.json(analysis);
  } catch (error) {
    console.log(error);
    // create error object with useful message
    const err = new Error(
      "Error: Check server --- one or more APIs are currently unavailable."
    );
    // set status code to return with response
    err.status = 503;
  }
});

// API for getting information on the logged in user
app.get("/api/get_user", (req, res, next) => {
  // extract out the useful parts of the req.user object
  const id = extractUserId(req);
  const email = req.user?.emails ? req.user.emails[0].value : null;
  res.json({
    id,
    displayName: req.user?.displayName,
    email,
    isAdmin: adminEmailAddresses.includes(email),
    photo: req.user?.photos?.length >= 1 ? req.user.photos[0].value : null,
  });
});

// API for getting information on the logged in user
app.post(
  "/api/add_user",
  async (req, res, next) => {
    try {
      const user = req.body.user;
      await dataStore.addUser(user);
      next();
    } catch (error) {
      console.log(error);
      // create error object with useful message
      const err = new Error(
        "Error: Check server --- one or more APIs are currently unavailable."
      );
      // set status code to return with response
      err.status = 503;
    }
  },
  returnAllData()
);

// API for changing a user's display name
app.post(
  "/api/change_display_name",
  async (req, res, next) => {
    try {
      await dataStore.changeDisplayName(req.body.id, req.body.newDisplayName);
      next();
    } catch (error) {
      console.log(error);
      // create error object with useful message
      const err = new Error(
        "Error: Check server --- one or more APIs are currently unavailable."
      );
      // set status code to return with response
      err.status = 503;
    }
  },
  returnAllData()
);

// API for recording the user's log in time for admin logs
app.post(
  "/api/add_login_time",
  async (req, res, next) => {
    try {
      await dataStore.recordLogin(req.body.email, req.body.time);
      next();
    } catch (error) {
      console.log(error);
      // create error object with useful message
      const err = new Error(
        "Error: Check server --- one or more APIs are currently unavailable."
      );
      // set status code to return with response
      err.status = 503;
    }
  },
  returnAllData()
);
