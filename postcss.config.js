module.exports = {
  plugins: [
    require("tailwindcss"),
    require("autoprefixer"),
    require("postcss-pxtorem")({
      rootValue: 16, // 你的根元素字体大小，默认是16px
      unitPrecision: 5, // rem单位转换的小数精度
      propList: ["*"], // 可以从px更改为rem的属性列表
      selectorBlackList: [], // 忽略转换的选择器列表
      replace: true, // 是否替换包含px的属性值
      mediaQuery: false, // 是否允许在媒体查询中转换px
      minPixelValue: 0, // 设置要替换的最小像素值
    }),

    // ...
  ],
};
