const fs = require("fs");
const path = require('path');
const FlashRecognizer = require("../../asr/flashRecognizer");

// 设置接口需要参数，具体请参考 接口文档
const query = {
  engine_type : '16k_zh',
  voice_format : 'wav',
  secretkey: '',
  secretid: '',
  appid: 0,
  // 以下为非必填参数，可跟据业务自行修改
  // hotword_id : '08003a00000000000000000000000000',
  // filter_dirty: 0,
  // filter_modal: 0,
  // filter_punc: 0,
  // convert_num_mode : 0
};

const asrReq = new FlashRecognizer(query);

const filePathTestOne = path.resolve('./voice_gpu.mp3');
const data = fs.readFileSync(filePathTestOne);

asrReq.recognize(data, (error, response, data) => {
  if(error){
    console.log(error);
    return;
  }
  console.log(data);
});
