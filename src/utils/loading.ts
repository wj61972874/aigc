// 定义加载动画的HTML结构
const loadingHTML = `
<div class="load-view">
  <div class="load-an-view">
    <div class="load-circle">
      <div class="load-container load-container1">
        <div class="circle1"></div>
        <div class="circle2"></div>
        <div class="circle3"></div>
        <div class="circle4"></div>
      </div>
      <div class="load-container load-container2">
        <div class="circle1"></div>
        <div class="circle2"></div>
        <div class="circle3"></div>
        <div class="circle4"></div>
      </div>
      <div class="load-container load-container3">
        <div class="circle1"></div>
        <div class="circle2"></div>
        <div class="circle3"></div>
        <div class="circle4"></div>
      </div>
    </div>
  </div>
  <div class="load-tip">加载中...</div>
</div>`;

// 获取app节点
const appNode = document.getElementById("app");

// 定义showLoading方法
export function showLoading() {
  // 创建一个div元素
  const loader = document.createElement("div");
  // 设置这个div的innerHTML为加载动画的HTML结构
  loader.innerHTML = loadingHTML;
  // 给这个div设置一个特定的id，方便之后的移除
  loader.id = "loadingDiv";
  // 将这个div添加到app节点下
  appNode.appendChild(loader);
}

// 定义hideLoading方法
export function hideLoading() {
  // 通过id获取之前添加的加载动画div
  const loader = document.getElementById("loadingDiv");
  // 如果这个div存在，则移除它
  if (loader) {
    appNode.removeChild(loader);
  }
}

// 调用showLoading方法显示加载动画
// showLoading();

// // 假设加载完成后，调用hideLoading方法隐藏加载动画
// // setTimeout只是用来模拟加载过程，实际使用时应根据实际加载情况调用hideLoading
// setTimeout(hideLoading, 3000); // 这里是3秒后隐藏加载动画
