const crypto = require('crypto');
const request = require('request');
const NewCredential = require('../common/credential');

class FlashRecognizer {
  constructor(params) {
    this.appid = params.appid || '';
    this.secretid = params.secretid || '';
    this.secretkey = params.secretkey || '';
    this.query = {
      ...params
    };
    this.OnError = function () { };
  }
  // 拼接鉴权数据
  getUrl() {
    if (!this.appid || !this.secretid) {
      console.log('请确认是否填入appid和secretid');
      return false;
    }
    const asr = new NewCredential(this.query);
    return asr.getSignStr();
  }
  // 签名函数示例
  signCallback(signStr) {
    const hash = crypto.createHmac("sha1", this.secretkey || "");
    return hash.update(Buffer.from(signStr, 'utf8')).digest('base64');
  }
  doRequest(url, data, headers, callback) {
    const req = {
      method: 'POST',
      url: url,
      headers: headers,
      json: false,
      body: data
    };

    request(req, function (error, response, body) {
      /**
       * `.request` 的请求回调
       * @callback requestCallback
       * @param {Error} error 请求错误
       * @param {Object} response 请求响应
       * @param {String} body API 请求结果
       */
      callback(error, response, body);
    });
  }
  recognize(videoData, callback) {
    const signStr = this.getUrl();
    const headers = {};
    if (!signStr) {
      console.log('鉴权失败');
      return;
    }
    headers['Authorization'] = this.signCallback(signStr);
    headers['Host'] = 'asr.cloud.tencent.com';
    const url = `http://${signStr.substring(4, signStr.length)}`;
    this.doRequest(url, videoData, headers, callback);
  }
}
module.exports = FlashRecognizer;
