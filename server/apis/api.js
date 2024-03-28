const Router = require("koa-router");
const {
  handleResolveModalParmas,
  handleResolveTextParmas,
} = require("./modalServices");
const router = new Router({ prefix: "/api" });

// GET 请求接口
router.get("/api/get/test", async (ctx) => {
  ctx.body = "This is a GET request test endpoint";
});

// POST 请求接口
router.post("/aigc/text2Image", async (ctx) => {
  console.log("参数入参---", ctx.request.body);
  const { prompt } = ctx.request.body;
  //   ctx.body = "This is a POST request test endpoint";
  //处理Stable-Diffusion-XL模型prompt数据
  const res = await handleResolveModalParmas(prompt);
  ctx.body = res;
});

// 文案生成
router.post("/aigc/textGenerate", async (ctx) => {
  console.log("参数入参---", ctx.request.body);
  const { type, massages } = ctx.request.body;
  //   ctx.body = "This is a POST request test endpoint";
  //处理Stable-Diffusion-XL模型prompt数据
  const res = await handleResolveTextParmas(type, massages);
  ctx.body = res;
});

module.exports = router;
