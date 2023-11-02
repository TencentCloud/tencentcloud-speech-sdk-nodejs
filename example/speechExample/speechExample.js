const fs = require("fs");
const path = require("path");
const { EventEmitter } = require("events");
const SpeechRecognizer = require("../../asr/speechRecognizer");
const filePathTestOne = path.resolve("./voice_gpu.wav");

const appId = "";
const secretId = "";
const secretkey = "";
const SliceSize = 6400;

// 设置接口需要参数，具体请参考 接口文档
const query = {
  // 用户参数
  secretkey: secretkey,
  secretid: secretId,
  appid: appId,
  // 实时识别接口参数
  engine_model_type: "16k_zh", // 因为内置WebRecorder采样16k的数据，所以参数 engineModelType 需要选择16k的引擎，为 '16k_zh'
  // 以下为非必填参数，可跟据业务自行修改
  voice_format: 1,
  hotword_id: "",
  needvad: 1,
  filter_dirty: 1,
  filter_modal: 2,
  filter_punc: 0,
  convert_num_mode: 1,
  word_info: 2,
  max_speak_time: 60000,
};

class SpeechExample {
  constructor(query) {
    this.query = query;
    this.asrReq = new SpeechRecognizer(query);
    this.eventEmitter = new EventEmitter();
  }

  // 实时识别
  async start() {
    this.onListener();
    await this.asrReq.start(this.eventEmitter);
  }
  // 识别数据处理
  OnRecoginze() {
    const self = this;
    let key = 0;
    // 创建可读流来读取音频文件
    const readStream = fs.createReadStream(filePathTestOne, {
      highWaterMark: SliceSize,
    });
    readStream.on("data", (chunk) => {
      setTimeout(() => {
        self.asrReq.write(chunk);
      }, 1000 * key);
      ++key;
    });

    readStream.on("end", () => {
      console.log("音频文件读取完成。");
    });

    readStream.on("error", (error) => {
      console.error(`读取音频文件时出错：${error.message}`);
    });
  }
  // 注册监听事件
  onListener() {
    const self = this;
    this.eventEmitter.on("OnRecoginze", this.OnRecoginze.bind(self));
    this.eventEmitter.on("OnRecognitionStart", this.OnRecognitionStart);
    this.eventEmitter.on("OnSentenceBegin", this.OnSentenceBegin);
    this.eventEmitter.on(
      "OnRecognitionResultChange",
      this.OnRecognitionResultChange
    );
    this.eventEmitter.on("OnSentenceEnd", this.OnSentenceEnd);
    this.eventEmitter.on("OnRecognitionComplete", this.OnRecognitionComplete);
    this.eventEmitter.on("OnError", this.onError);
  }
  // 开始识别的时候
  OnRecognitionStart(result) {
    console.log("OnRecognitionStart", result);
  }
  // 一句话开始的时候
  OnSentenceBegin(result) {
    console.log("OnSentenceBegin", result);
  }
  // 识别结果发生变化的时候
  OnRecognitionResultChange(result) {
    console.log("OnRecognitionResultChange", result);
  }
  // 一句话结束的时候
  OnSentenceEnd(result) {
    console.log("OnSentenceEnd", result);
  }
  // 识别结束的时候
  OnRecognitionComplete(result) {
    console.log("OnRecognitionComplete", result);
  }
  onError(result) {
    console.log("onError", result);
  }
}

const asrReq = new SpeechExample(query);
asrReq.start();
