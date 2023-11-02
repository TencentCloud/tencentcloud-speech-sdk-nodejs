const NewSpeechCredential = require("../common/speechcredential");
const WebSocket = require("ws");
const crypto = require('crypto');

class SpeechRecognizer {
  constructor(params) {
    this.appid = params.appid || "";
    this.secretid = params.secretid || "";
    this.secretkey = params.secretkey || '';
    this.socket = null;
    this.isSignSuccess = false; // 是否鉴权成功
    this.isSentenceBegin = false; // 是否一句话开始
    this.query = {
      ...params,
    };
    // 用户鉴权函数
    this.isRecognizeComplete = false; // 当前是否识别结束
  }
  // 签名函数示例
  signCallback(signStr) {
    const hash = crypto.createHmac("sha1", this.secretkey || "");
    return hash.update(Buffer.from(signStr, "utf8")).digest("base64");
  }
  // 暂停识别，关闭连接
  stop() {
    if (this.socket && this.socket.readyState === 1) {
      this.socket.send(JSON.stringify({ type: "end" }));
    } else {
      this.OnError("连接未建立或连接已关闭");
      if (this.socket && this.socket.readyState === 1) {
        this.socket.close();
      }
    }
  }
  // 拼接鉴权数据
  async getUrl() {
    if (!this.appid || !this.secretid) {
      this.OnError("请确认是否填入appid和secretid");
      return false;
    }
    const asr = new NewSpeechCredential(this.query);
    const signStr = await asr.getSignStr();
    return `${signStr}&signature=${encodeURIComponent(
      this.signCallback(signStr)
    )}`;
  }
  // 建立websocket链接 data 为用户收集的音频数据
  async start(listener) {
    if(this.socket){
      this.OnError("recognizer is already started");
    }
    this.listener = listener
    const url = await this.getUrl();
    if (!url) {
      this.OnError("鉴权失败");
      return;
    }
    const self = this;
    this.socket = new WebSocket(`wss://${url}`);
    this.socket.onopen = (e) => {
      // 连接建立时触发事件分发，开始识别音频
      if(this.socket.readyState === 1){
        this.listener.emit('OnRecoginze');
      }
    };
    this.socket.onmessage = (e) => {
      // 连接建立时触发
      const response = JSON.parse(e.data);
      if (response.code !== 0) {
        this.OnError(response.message);
        self.socket.close();
        return;
      } else {
        if (!this.isSignSuccess) {
          this.OnRecognitionStart(response);
          this.isSignSuccess = true;
        }
        if (response.final === 1) {
          this.isRecognizeComplete = true;
          this.OnRecognitionComplete(response);
          return;
        }
        if (response.result) {
          if (response.result.slice_type === 0) {
            this.OnSentenceBegin(response);
            this.isSentenceBegin = true;
          } else if (response.result.slice_type === 2) {
            if (!this.isSentenceBegin) {
              this.OnSentenceBegin(response);
            }
            this.OnSentenceEnd(response);
          } else {
            this.OnRecognitionResultChange(response);
          }
        }
      }
    };
    this.socket.onerror = (e) => {
      // 通信发生错误时触发
      this.socket.close();
      this.OnError(e);
    };
    this.socket.onclose = (event) => {
      if (!this.isRecognizeComplete) {
        this.OnError(event);
      }
    };
  }
  // 发送数据
  write(data) {
    if (!this.socket || this.socket.readyState !== 1) {
      this.OnError("连接未建立，请稍后发送数据！");
      return;
    }
    this.socket.send(data);
  }
  // 开始识别的时候
  OnRecognitionStart(res) {
    this.listener.emit('OnRecognitionStart', res)
   
  }
  // 一句话开始的时候
  OnSentenceBegin(res) {
    this.listener.emit('OnSentenceBegin', res)
  }
  // 识别结果发生变化的时候
  OnRecognitionResultChange(res) {
    this.listener.emit('OnRecognitionResultChange', res)
  }
  // 一句话结束的时候
  OnSentenceEnd(res) {
    this.listener.emit('OnSentenceEnd', res)
  }
  // 识别结束的时候
  OnRecognitionComplete(res) {
    this.listener.emit('OnRecognitionComplete', res)
  }
  // 识别失败
  OnError(err) {
    this.listener.emit('OnError', err)
  }
}

module.exports = SpeechRecognizer;
