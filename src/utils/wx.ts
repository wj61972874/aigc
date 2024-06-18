
import request from '@/services/request';
import _ from 'lodash';

var eventMap = {
  voiceRecordEnd: [],
  voicePlayEnd: [],
};

let wx;




function isWX(): boolean {
    const ua =
      typeof navigator !== 'undefined' && navigator.userAgent.toLocaleLowerCase();
    return ua?.indexOf('micromessenger') > -1;
  }
  
  wx = window.wx;

  wx.ready((callback) => {
    callback = callback || function () {};
    // alert('wx ready : ');
  });

  //todo
  wx.error(function (res) {
    // message.error('微信签名认证失败');
    alert('wx error : ' + JSON.stringify(res));
  });

  wx.init = function (callback) {
    console.log("微信jssdk初始化")
    // alert("微信jssdk初始化")
    callback = callback || function () {};
    if (!isWX()) return callback();
    let query = encodeURIComponent(location.href.split('#')[0]);
    let url =  `https://brandsai.suntory.com.cn/api/aigc/wechatJsapi/ticket/get?url=${query}`;

    

    request.get(url).then(
      (data) => {
        // alert("微信jssdk初始化 signature")
        wx.config({
          debug: true,
          appId: data.appId,
          timestamp: data.timestamp, // 必填，生成签名的时间戳
          nonceStr: data.nonceStr, // 必填，生成签名的随机串
          signature: data.signature, // 必填，签名，见附录1
          jsApiList: [
            'updateTimelineShareData',
            'updateAppMessageShareData',
          ],
          openTagList: ['wx-open-launch-weapp'],
        });
        wx.ready(callback);
      },
      (err) => {
        if (err.errMsg === 'config:ok') {
          return;
        }
        console.error('wx_err', err);
      },
    );
  };

  wx.on = function (name, handler) {
    eventMap[name].push(handler);
  };

  wx.off = function (name, handler) {
    _.remove(eventMap[name], (cb) => cb === handler);
  };

export default wx;
