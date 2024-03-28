const http = require("./request");

const text2imageConfig = {
  url: "https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/text2image/sd_xl",
  defaultParams: {
    size: "768x1024",
    n: 1,
    steps: 20,
    sampler_index: "Euler a",
  },
};

const textGenerateConfig = {
  url: "https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/chat/completions",
  defaultParams: {
    disable_search: false,
    enable_citation: false,
  },
};

async function handleResolveModalParmas(prompt) {
  console.log("handleResolveModalParmas start");
  return await http.post(text2imageConfig.url, {
    ...text2imageConfig.defaultParams,
    prompt,
  });
}

function matchTextGerenteType(type, message) {
  switch (type) {
    case 1:
      return `生成一个以“${message}”为头的藏头诗，要求是对仗工整`;
    default:
      return `生成一个以“${message}”为头的藏头诗，要求是对仗工整`;
  }
}
async function handleResolveTextParmas(type, message) {
  console.log("handleResolveTextParmas start");

  const _messages = [
    {
      role: "user",
      content: matchTextGerenteType(type, message),
    },
  ];
  textGenerateConfig.defaultParams.messages = _messages;
  return await http.post(
    textGenerateConfig.url,
    textGenerateConfig.defaultParams
  );
}

module.exports = {
  handleResolveModalParmas,
  handleResolveTextParmas,
};
