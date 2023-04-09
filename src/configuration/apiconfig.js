import axios from "axios";
import {Buffer} from "buffer";
import constant from "../configuration/config";
var accessTokenExpiry = 300;
var methodType, authorisationType, URL, data;
export async function callEndpoint(methodType, authorisationType, URL, data) {
  methodType = methodType;
  authorisationType = authorisationType;
  URL = URL;
  data = data;
  if (authorisationType === "Bearer") {
    var accessToken = getCookie("accessToken");
    if (accessToken == null) {
      return new Promise((resolve, reject) => {
        getAccessToken("", "", true).then((response) => {
          callEndpoint(methodType, authorisationType, URL, data)
            .then((response) => {
              resolve(response);
            })
            .catch(reject);
        });
      });
    } else {
      return new Promise((resolve, reject) => {
        var dataversion = getCookie("ticketBookingLang");
        if (dataversion == "en") {
          dataversion = "en-US";
        } else if (dataversion == "ar") {
          dataversion = "ar-SA";
        } else {
          dataversion = "en-US";
        }
        axios({
          url: process.env.REACT_APP_baseurl + URL,
          method: methodType,
          headers: {
            Authorization: "Bearer " + getCookie("accessToken"),
            dataversion: dataversion,
            appplatform: "WEBSITE",
            appversion: "1.0.0",
            usesessioncutoff: "fnb",
          },
          data: data,
        })
          .then((response) => {
            resolve(response);
          })
          .catch(async (ex) => {
            if (ex.response.data.message != undefined) {
              if (ex.response.data.message.toLowerCase() === "unauthorized") {
                await getRefreshToken().then(async (response) => {
                  await callEndpoint(methodType, authorisationType, URL, data)
                    .then((response) => {
                      resolve(response);
                    })
                    .catch(reject);
                });
              } else {
                reject({error: ex.response.data.message});
              }
            } else {
              reject({error: ex.response.data.message});
            }
          });
      });
    }
  } else if (authorisationType === "Basic") {
    var headerObject = new Object();
    headerObject.Authorization = "Basic " + new Buffer.from(process.env.REACT_APP_username + ":" + process.env.REACT_APP_password).toString("base64");
    headerObject.appplatform = "WEBSITE";
    headerObject.appversion = "1.0.0";
    return new Promise((resolve, reject) => {
      axios({
        url: process.env.REACT_APP_baseurl + "" + URL,
        method: methodType,
        headers: headerObject,
        data: data,
      })
        .then((response) => {
          resolve(response);
        })
        .catch((ex) => {
          reject({error: ex.response.data.message});
        });
    });
  }
}

export async function getAccessToken(username, password, keepmesignedin = true) {
  var data = new Object();
  data.accessTokenExpiry = accessTokenExpiry;
  return new Promise((resolve, reject) => {
    axios({
      //url: "https://apidevhedged.influx.co.in/api/v1/users/login",
      url: process.env.REACT_APP_baseurl + "user/v1/token",
      method: "POST",
      data: data,
      auth: {
        username: process.env.REACT_APP_username,
        password: process.env.REACT_APP_password,
      },
    })
      .then((response) => {
        document.cookie = "accessToken=" + response.data.accessToken;
        document.cookie = "refreshToken=" + response.data.refreshToken;
        resolve(response);
      })
      .catch((ex) => {
        reject({error: ex});
      });
  });
}

async function getRefreshToken() {
  var headerDetails = "Basic " + Buffer.from(process.env.REACT_APP_username + ":" + process.env.REACT_APP_password).toString("base64");
  var data = new Object();
  data.refreshToken = getCookie("refreshToken");
  return new Promise(async (resolve, reject) => {
    axios({
      //url: "https://apidevshowplaceicon.influx.co.in/api/v1/users/refreshToken",
      url: process.env.REACT_APP_baseurl + "user/v1/token/refresh",
      method: "POST",
      auth: {
        username: process.env.REACT_APP_username,
        password: process.env.REACT_APP_password,
      },
      data: data,
    })
      .then((response) => {
        ////////console.log("inside success ======>>>>>> ");
        document.cookie = "accessToken=" + response.data.accessToken;
        document.cookie = "refreshToken=" + response.data.refreshToken;
        try {
          let afterLoginToken = JSON.parse(localStorage.getItem("afterLoginToken"));
          afterLoginToken.accessToken = response.data.accessToken;
          afterLoginToken.refreshToken = response.data.refreshToken;
          localStorage.setItem("afterLoginToken",JSON.stringify( afterLoginToken));
        } catch (e) {
          console.log(e);
        }
        resolve(response);
      })
      .catch(async (ex) => {
        ////////console.log("inside failure ======>>>>>> ");
        if (axios.isCancel(ex)) {
          reject({Cancel: ""});
        } else if (ex.response.data.code != 200 || ex.response.data.message.toLowerCase() == "token invalid") {
          await getAccessToken(process.env.REACT_APP_username, process.env.REACT_APP_password).then((response) => {
            callEndpoint(methodType, authorisationType, URL, data)
              .then((response) => {
                resolve(response);
              })
              .catch(reject);
          });
        }
      });
  });
}

export function getValueFromCookie(cookieName) {
  return getCookie(cookieName);
}

function getCookie(name) {
  var cookieArr = document.cookie.split(";");
  for (var i = 0; i < cookieArr.length; i++) {
    var cookiePair = cookieArr[i].split("=");
    if (name === cookiePair[0].trim()) {
      return decodeURIComponent(cookiePair[1]);
    }
  }
  return null;
}
