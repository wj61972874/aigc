const request = require("request");
const config = require("./config.json");

const http = {
  post: sendPostRequest,
};

const successRes = {
  code: 200,
  message: "success",
  result: null,
};

const errorRes = {
  code: 500,
  message: "发生错误啦~",
  result: null,
};

/**
 * 发送 POST 请求
 * @param {string} url 请求的 URL
 * @param {object} data 请求的数据
 * @returns {Promise<object>} 响应数据
 */
async function sendPostRequest(url, data) {
  const accessToken = await getAccessToken();
  const options = {
    method: "POST",
    url: url + "?access_token=" + accessToken,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(data),
  };

  return new Promise((resolve, reject) => {
    request(options, (error, response) => {
      if (error) {
        // reject(errorRes);
        console.log("--reject error-", errorRes);
        resolve(errorRes);
      } else {
        console.log("--response-", response?.body);
        const resultData = JSON.parse(response?.body);
        if (resultData?.error_code) {
          resolve(errorRes);
        } else {
          resolve({ ...successRes, result: resultData });
        }
      }
    });
  });
}

/**
 * 使用 AK、SK 生成鉴权签名（Access Token）
 * @return {Promise<string>} 鉴权签名信息（Access Token）
 */
function getAccessToken() {
  const options = {
    method: "POST",
    url: "https://aip.baidubce.com/oauth/2.0/token",
    qs: {
      grant_type: "client_credentials",
      client_id: config.client_id,
      client_secret: config.client_secret,
    },
  };

  return new Promise((resolve, reject) => {
    request(options, (error, response) => {
      if (error) {
        reject(error);
      } else {
        resolve(JSON.parse(response.body).access_token);
      }
    });
  });
}

module.exports = http;

// // 示例用法
// const apiUrl =
//   "https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/text2image/sd_xl";
// const requestData = {
//   size: "1024x1024",
//   n: 1,
//   steps: 20,
//   sampler_index: "Euler a",
// };

// sendPostRequest(apiUrl, requestData)
//   .then((response) => {
//     console.log("Response:", response);
//   })
//   .catch((error) => {
//     console.error("Error:", error);
//   });
