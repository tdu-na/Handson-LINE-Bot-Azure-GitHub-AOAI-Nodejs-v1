'use strict';

const line = require('@line/bot-sdk');
const express = require('express');
const crypto = require("crypto");
const fs = require('fs');
const path = require('path');

const BASE_URL = process.env.BASE_URL;
const BASE_PUBLIC_DIR = 'public';

// create LINE SDK config from env variables
const config = {
  channelSecret: process.env.CHANNEL_SECRET,
};

// create LINE SDK client
const client = new line.messagingApi.MessagingApiClient({
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN
});
const blobClient = new line.messagingApi.MessagingApiBlobClient({
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
});

// create Express app
// about Express itself: https://expressjs.com/
const app = express();

// serve static and downloaded files
app.use(`/${BASE_PUBLIC_DIR}`, express.static(BASE_PUBLIC_DIR));

// register a webhook handler with middleware
// about the middleware, please refer to doc
app.post('/callback', line.middleware(config), (req, res) => {
  console.log('start');
  // console.log(req.body);
  Promise
  .all(req.body.events.map(handleEvent))
  .then((result) => res.json(result))
  .catch((err) => {
    console.error(err);
    res.status(500).end();
  });
});

// event handler
async function handleEvent(event) {
  const userId = event.source.userId;
  let userGender = "";
  let userAge = "";
  let userBirthPlace = "";
  let userResidence = "";
  let userResidenceForm = "";
  let userOccupation = "";
  let userAnswer = "";
  let waitingFor = ""; // 次に入力を求める内容を格納する変数
  
  // 


  // event.message.textが「性別、年齢、出身地域、居住地域、居住形態、職業」のいずれかの場合、waitngForに格納
  if (event.message.text === "性別" || event.message.text === "年齢" || event.message.text === "出身地域" || event.message.text === "居住地域" || event.message.text === "居住形態" || event.message.text === "職業") {
    waitingFor = event.message.text;
  } else {
    userAnswer = event.message.text;
  }
  switch (waitingFor) {
    case "性別":
      userGender = userAnswer;
      waitingFor = ""; // 次の質問に移る
      break;
    case "年齢":
      userAge = userAnswer;
      waitingFor = "";
      break;
    case "出身地域":
      userBirthPlace = userAnswer;
      waitingFor = "";
      break;
    case "居住地域":
      userResidence = userAnswer;
      waitingFor = "";
      break;
    case "居住形態":
      userResidenceForm = userAnswer;
      waitingFor = "";
      break;
    case "職業":
      userOccupation = userAnswer;
      waitingFor = "";
      break;
    default:
  }

  console.log("userAnswer =", userAnswer);
  console.log("userGender =", userGender);
  console.log("userAge =", userAge);
  console.log("userBirthPlace =", userBirthPlace);
  console.log("userResidence =", userResidence);
  console.log("userResidenceForm =", userResidenceForm);
  console.log("userOccupation =", userOccupation);

  
    if (event.type !== 'message' && event.type !== 'postback') {
      // ignore non-text-message event
      return Promise.resolve(null);
    } else if (event.type === 'postback') {
      if (event.postback.data === 'sticker') {
        //https://developers.line.biz/ja/reference/messaging-api/#sticker-message
        //https://developers.line.biz/ja/docs/messaging-api/sticker-list/#sticker-definitions
        return client.replyMessage({
          replyToken: event.replyToken,
          messages: [{
            type: 'sticker',
            packageId: "11537",
            stickerId: "52002735"
          }]
        });
      }
    
    } else if (event.message.text === '性別') {
        //https://developers.line.biz/ja/reference/messaging-api/#quick-reply
        return client.replyMessage({
          replyToken: event.replyToken,
          messages: [{
            type: 'text',
            text: '性別はなんですか？',
            "quickReply": {
              "items": [
                {
                  "type": "action",
                  "action": {
                    "type":"message",
                    "label":"男性",
                    "text": "男性",
                  }
                },
                {
                  "type": "action",
                  "action": {
                    "type":"message",
                    "label":"女性",
                    "text":"女性",
                  }
                },
                {
                  "type": "action",
                  "action": {
                    "type":"message",
                    "label":"その他",
                    "text":"その他",
                  }
                }
              ]
            }
          }]
        });
      } else if (event.message.text === '年齢') {
        //https://developers.line.biz/ja/reference/messaging-api/#quick-reply
        return client.replyMessage({
          replyToken: event.replyToken,
          messages: [{
            type: 'text',
            text: '年齢はいくつですか？',
            "quickReply": {
              "items": [
                {
                  "type": "action",
                  "action": {
                    "type":"message",
                    "label":"20歳未満",
                    "text": "20歳未満",
                  }
                },
                {
                  "type": "action",
                  "action": {
                    "type":"message",
                    "label":"20代",
                    "text":"20代",
                  }
                },
                {
                  "type": "action",
                  "action": {
                    "type":"message",
                    "label":"30代",
                    "text":"30代"
                  }
                },
                {
                  "type": "action",
                  "action": {
                    "type":"message",
                    "label":"40代",
                    "text":"40代"
                  }
                },
                {
                  "type": "action",
                  "action": {
                    "type":"message",
                    "label":"50代",
                    "text":"50代"
                  }
                },
                {
                  "type": "action",
                  "action": {
                    "type":"message",
                    "label":"60代",
                    "text":"60代"
                  }
                },
                {
                  "type": "action",
                  "action": {
                    "type":"message",
                    "label":"70代",
                    "text":"70代"
                  }
                },
                {
                  "type": "action",
                  "action": {
                    "type":"message",
                    "label":"80代",
                    "text":"80代"
                  }
                },
                {
                  "type": "action",
                  "action": {
                    "type":"message",
                    "label":"90代",
                    "text":"90代"
                  }
                }
              ]
            }
          }]
        });
      } else if (event.message.text === '出身地域') {
        //https://developers.line.biz/ja/reference/messaging-api/#quick-reply
        return client.replyMessage({
          replyToken: event.replyToken,
          messages: [{
            type: 'text',
            text: '出身地域はどこですか？',
            "quickReply": {
              "items": [
                {
                  "type": "action",
                  "action": {
                    "type":"message",
                    "label":"北海道",
                    "text":"北海道"
                  }
                },
                {
                  "type": "action",
                  "action": {
                    "type":"message",
                    "label":"東北",
                    "text":"東北"
                  }
                },
                {
                  "type": "action",
                  "action": {
                    "type":"message",
                    "label":"関東",
                    "text":"関東"
                  }
                },
                {
                  "type": "action",
                  "action": {
                    "type":"message",
                    "label":"中部",
                    "text":"中部"
                  }
                },
                {
                  "type": "action",
                  "action": {
                    "type":"message",
                    "label":"近畿",
                    "text":"近畿"
                  }
                },
                {
                  "type": "action",
                  "action": {
                    "type":"message",
                    "label":"中国",
                    "text":"中国"
                  }
                },
                {
                  "type": "action",
                  "action": {
                    "type":"message",
                    "label":"四国",
                    "text":"四国"
                  }
                },
                {
                  "type": "action",
                  "action": {
                    "type":"message",
                    "label":"九州・沖縄",
                    "text":"九州・沖縄"
                  }
                },
                {
                  "type": "action",
                  "action": {
                    "type":"message",
                    "label":"海外",
                    "text":"海外"
                  }
                }
              ]
            }
          }]
        });
    } else if (event.message.text === '居住地域') {
      //https://developers.line.biz/ja/reference/messaging-api/#quick-reply
      return client.replyMessage({
        replyToken: event.replyToken,
        messages: [{
          type: 'text',
          text: '居住地域はどこですか？',
          "quickReply": {
            "items": [
              {
                "type": "action",
                "action": {
                  "type":"message",
                  "label":"北海道",
                  "text":"北海道"
                }
              },
              {
                "type": "action",
                "action": {
                  "type":"message",
                  "label":"東北",
                  "text":"東北"
                }
              },
              {
                "type": "action",
                "action": {
                  "type":"message",
                  "label":"関東",
                  "text":"関東"
                }
              },
              {
                "type": "action",
                "action": {
                  "type":"message",
                  "label":"中部",
                  "text":"中部"
                }
              },
              {
                "type": "action",
                "action": {
                  "type":"message",
                  "label":"近畿",
                  "text":"近畿"
                }
              },
              {
                "type": "action",
                "action": {
                  "type":"message",
                  "label":"中国",
                  "text":"中国"
                }
              },
              {
                "type": "action",
                "action": {
                  "type":"message",
                  "label":"四国",
                  "text":"四国"
                }
              },
              {
                "type": "action",
                "action": {
                  "type":"message",
                  "label":"九州・沖縄",
                  "text":"九州・沖縄"
                }
              },
              {
                "type": "action",
                "action": {
                  "type":"message",
                  "label":"海外",
                  "text":"海外"
                }
              }
            ]
          }
        }]
      });
  } else if (event.message.text === '居住形態') {
    //https://developers.line.biz/ja/reference/messaging-api/#quick-reply
    return client.replyMessage({
      replyToken: event.replyToken,
      messages: [{
        type: 'text',
        text: '居住形態はなんですか？',
        "quickReply": {
          "items": [
            {
              "type": "action",
              "action": {
                "type":"message",
                "label":"都市部",
                "text":"都市部"
              }
            },
            {
              "type": "action",
              "action": {
                "type":"message",
                "label":"郊外",
                "text":"郊外"
              }
            },
            {
              "type": "action",
              "action": {
                "type":"message",
                "label":"農村部",
                "text":"農村部"
              }
            }
          ]
        }
      }]
    });
} else if (event.message.text === '職業') {
  //https://developers.line.biz/ja/reference/messaging-api/#quick-reply
  return client.replyMessage({
    replyToken: event.replyToken,
    messages: [{
      type: 'text',
      text: '職業はなんですか？',
      "quickReply": {
        "items": [
          {
            "type": "action",
            "action": {
              "type":"message",
              "label":"正社員",
              "text":"正社員"
            }
          },
          {
            "type": "action",
            "action": {
              "type":"message",
              "label":"契約社員",
              "text":"契約社員"
            }
          },
          {
            "type": "action",
            "action": {
              "type":"message",
              "label":"派遣社員",
              "text":"派遣社員"
            }
          },
          {
            "type": "action",
            "action": {
              "type":"message",
              "label":"パート・アルバイト",
              "text":"パート・アルバイト"
            }
          },
          {
            "type": "action",
            "action": {
              "type":"message",
              "label":"自営業",
              "text":"自営業"
            }
          },
          {
            "type": "action",
            "action": {
              "type":"message",
              "label":"無職（学生、専業主婦・主夫、失業者など）",
              "text":"無職（学生、専業主婦・主夫、失業者など）"
            }
          }
        ]
      }
    }]
  });
}
  

    // create a echoing text message
    // const echo = { type: 'text', text: event.message.text };

    // // use reply API
    // return client.replyMessage({
    //   replyToken: event.replyToken,
    //   messages: [echo],
    // });
}

const getStreamData = async (stream)  => {
    return new Promise(resolve => {
      let result = [];
      stream.on("data", (chunk) => {
        result.push(Buffer.from(chunk));
      });
      stream.on("end", () => {
        resolve(result);
      });
    });
}

//https://developers.line.biz/flex-simulator/
const flexMsg = {
    "type": "carousel",
    "contents": [
      {
        "type": "bubble",
        "hero": {
          "type": "image",
          "size": "full",
          "aspectRatio": "20:13",
          "aspectMode": "cover",
          "url": "https://scdn.line-apps.com/n/channel_devcenter/img/fx/01_5_carousel.png"
        },
        "body": {
          "type": "box",
          "layout": "vertical",
          "spacing": "sm",
          "contents": [
            {
              "type": "text",
              "text": "Arm Chair, White",
              "wrap": true,
              "weight": "bold",
              "size": "xl"
            },
            {
              "type": "box",
              "layout": "baseline",
              "contents": [
                {
                  "type": "text",
                  "text": "$49",
                  "wrap": true,
                  "weight": "bold",
                  "size": "xl",
                  "flex": 0
                },
                {
                  "type": "text",
                  "text": ".99",
                  "wrap": true,
                  "weight": "bold",
                  "size": "sm",
                  "flex": 0
                }
              ]
            }
          ]
        },
        "footer": {
          "type": "box",
          "layout": "vertical",
          "spacing": "sm",
          "contents": [
            {
              "type": "button",
              "style": "primary",
              "action": {
                "type": "uri",
                "label": "Add to Cart",
                "uri": "https://linecorp.com"
              }
            },
            {
              "type": "button",
              "action": {
                "type": "uri",
                "label": "Add to wishlist",
                "uri": "https://linecorp.com"
              }
            }
          ]
        }
      },
      {
        "type": "bubble",
        "hero": {
          "type": "image",
          "size": "full",
          "aspectRatio": "20:13",
          "aspectMode": "cover",
          "url": "https://scdn.line-apps.com/n/channel_devcenter/img/fx/01_6_carousel.png"
        },
        "body": {
          "type": "box",
          "layout": "vertical",
          "spacing": "sm",
          "contents": [
            {
              "type": "text",
              "text": "Metal Desk Lamp",
              "wrap": true,
              "weight": "bold",
              "size": "xl"
            },
            {
              "type": "box",
              "layout": "baseline",
              "flex": 1,
              "contents": [
                {
                  "type": "text",
                  "text": "$11",
                  "wrap": true,
                  "weight": "bold",
                  "size": "xl",
                  "flex": 0
                },
                {
                  "type": "text",
                  "text": ".99",
                  "wrap": true,
                  "weight": "bold",
                  "size": "sm",
                  "flex": 0
                }
              ]
            },
            {
              "type": "text",
              "text": "Temporarily out of stock",
              "wrap": true,
              "size": "xxs",
              "margin": "md",
              "color": "#ff5551",
              "flex": 0
            }
          ]
        },
        "footer": {
          "type": "box",
          "layout": "vertical",
          "spacing": "sm",
          "contents": [
            {
              "type": "button",
              "flex": 2,
              "style": "primary",
              "color": "#aaaaaa",
              "action": {
                "type": "uri",
                "label": "Add to Cart",
                "uri": "https://linecorp.com"
              }
            },
            {
              "type": "button",
              "action": {
                "type": "uri",
                "label": "Add to wish list",
                "uri": "https://linecorp.com"
              }
            }
          ]
        }
      },
      {
        "type": "bubble",
        "body": {
          "type": "box",
          "layout": "vertical",
          "spacing": "sm",
          "contents": [
            {
              "type": "button",
              "flex": 1,
              "gravity": "center",
              "action": {
                "type": "uri",
                "label": "See more",
                "uri": "https://linecorp.com"
              }
            }
          ]
        }
      }
    ]
  }

// listen on port
const port = process.env.PORT || 7071;
app.listen(port, () => {
  console.log(`listening on ${port}`);
  console.log(config);
});
