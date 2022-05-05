/*
 * Keeps the app's secrets (anything that can be stolen and used inappropriately).
 *
 * @author Arjun Peri
 */

exports.NBA_API = {
    URL: "https://api-nba-v1.p.rapidapi.com/",
    TOKEN: "a55b5b869dmsh15a7d20f50afc60p1bc471jsn48ecee540f6c",
  };
  
  exports.TWITTER_API = {
    URL: "https://api.twitter.com/2/",
    API_KEY: "5MXAGptJXdRwTH5SpOHUOHpVy",
    SECRET_KEY: "N0QIKMaWob2HjUzdXRAUPadhR63in6zgPoG0qMtmBctN7BiLnr",
    BEARER_TOKEN:
      "AAAAAAAAAAAAAAAAAAAAAJcxOQEAAAAA1JOojun1RKS15WNSt%2BBmMUQgTVs%3D7jX6A0JiAzaBEDzklSdRVMtZNxaBFI6FXtFoocqY19NjfG6Arr",
  };
  
  exports.COOKIE_ENCRYPTION_KEY = "SECRET";
  exports.OAUTH = {
    web: {
      client_id:
        "860869993570-b4er11g6biophlj45ll844ihf4qg850u.apps.googleusercontent.com",
      project_id: "module06mutli",
      auth_uri: "https://accounts.google.com/o/oauth2/auth",
      token_uri: "https://oauth2.googleapis.com/token",
      auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
      client_secret: "2_p7isnW9zNJI6j_4J7zYYnv",
      redirect_uris: [
        "http://localhost:8080/api/auth/google/redirect",
        "https://arcane-thicket-82518.herokuapp.com/api/auth/google/redirect",
      ],
    },
  };
  
  // These should represent the final URLs for your front- and backend projects
  exports.DEPLOYED_URLS = {
    // TODO: change to Heroku and GitLab URLs, with a trailing slash
    SERVER: "https://arcane-thicket-82518.herokuapp.com/",
    VIEW: "https://compsci290_2021spring.dukecs.io/portfolio_ap458/final/dist/",
  };
  
  exports.FIREBASE_CONFIG = {
    type: "service_account",
    project_id: "final-b72f4",
    private_key_id: "7b0af4f6272072a418ab45ae5b40af4d143a2c5e",
    private_key:
      "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDVMmt0FoVIhsMp\nDZnYvDlKDAewLPiPhr3T2dPZGI2y+EGFswaw2zl3KsI/fC+mEYrrOo75qNpvF2Cj\n56+RoGPUXmtKMU4OuI0dxZARlJiTviaa4T0o7Rpe8P5QDUs/Q/7yHuRV9MeTVn1R\nHNoG+Fzp5rKrYNOGtRJ6+lpuYubvOZ7QrRv1kxdqwNP3h/tvNSbNTb4bKkEV8wqc\nxFIW3rMqoBY4K0b+IfkHc+XquYlCVx3WxJHjG5sLYBelLqS9xrucW518+q9Jamld\nphuqo4zs5VFy3b6no17PKcFLsb6b9S+6O/xUGxCnJSvGAHeRxv0Jo7vwZBjmaQJ/\niJJ8efcfAgMBAAECggEAB9wD+hOadkIBj9HgigzmT8SBxAzkXOYquVSearJtBtwA\nDl27MWnjhHEfGBgL6aNb67AM9Uc0RkQmW+R+pG+1Pm78pY+LwR8slJxj40IHHes0\noSEMkCWtgzJ/LZRP4dUv4N0irciIUvYtSIA3yWn+guDuVUMMiTrDo6T3EHq06Ly1\n0t67Au3XgMeEmn8Zw8TvL9noczxvlDlOVOQhXF7a29AJNha4VMJUtQp5iF0I3qW0\nZa+NI0O+CTAt0zL/egeinR8ivH51P51VR+9RetaehBw+vRFdZOUxcAGHhi8eTU6y\nP3TLlvDy+lO3uFew4UZzfn+7O+Vmgs5sdToUyzIXAQKBgQDwHC8mnY4GUxD6x8su\nO31B1xXUGlaiLn5QePH2ljWECKkcTdYU+8U3Q1q8D90fV1mcXkwtpXgFqSO0EmT4\nQ0yjL87s8IgXm2YX4KpC3+IwZ2H/w/fWs8wRWx8q/omHvAXKVlvBjUFKkOU09E5u\nAXSQ7WS6y4f8i+uVqfA8oAAPmQKBgQDjTkmgZlcIwwW92OGl55CWd8w5/OsOum9e\nyALcTBTr4hT14Cr6io6dYdqWDriuMKa4Ne7ElAJi2Rm9EdpYBnBHY+MrE/NBa5/F\n6P/vc27+I7yo2vdyTx3WOhWoIhGzA9sZS2T+MgZ/YdTwdINJCZyDUifu9VKH/LjX\nQWfNrEbPdwKBgQCUk0wV3/5nKXVjSMgQFp2eZSJLufSLrKtazkwjIrWAuv8x1XQ4\nTcauOI5nuoVAhIOdv7fxsuc+0XeXUJ6MBNDiVY38jaYYvX8CHXIdqX3EJ+S7KB8v\nCtimkLULnK+rfwwyNRfX/7k8E8bQ6q+xYFMp7suazqCaBFbFqH9QdE01WQKBgQDQ\nBK1MpVuxIQj4HKskcS7ZBPlZeCSFbgjN7Kzxfo8G7/fOrD+o2XR6gzrPaNmKT+vD\nWVgRfoJQg+4SIWx4civ+qWMT4UYU8LFfJURTlohU+8+DmCAr9EuR6cY4ADXCZhz0\noRLjrlRT7uw4wegDx0/8vgrdnJTS7m0aUTj1+Fs1MQKBgD6iRRrHJTe1I7G5jdZO\nRkJSc0+5HmfRvVJXXtU1Ekw2HvLlrC22uk/niJBsakY38p2HNmgce9A3XYLZ6eWL\nkUrzM1iASSOkUesPhMwhh8+N3CfwiC9/DNzX+7Ol4N4TWTRrGd6Yfbb1K3bxH2tT\n7IkqPBz8eZkARDot12oRW50Y\n-----END PRIVATE KEY-----\n",
    client_email: "firebase-adminsdk-h6iyg@final-b72f4.iam.gserviceaccount.com",
    client_id: "102511129142785745393",
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
    client_x509_cert_url:
      "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-h6iyg%40final-b72f4.iam.gserviceaccount.com",
  };
  