class NewSpeechCredential {
  constructor(query){
    this.config = {
      appid: query.appid,
      secretid: query.secretid,
      token: query.token
    };
    this.query = query || null;
  }

  formatSignString(params){
    let strParam = "";
    let signStr = "asr.cloud.tencent.com/asr/v2/";
    if(this.config['appid']){
      signStr += this.config['appid'];
    }
    const keys = Object.keys(params);
    keys.sort();
    for (let i = 0, len = keys.length; i < len; i++) {
      strParam += `&${keys[i]}=${params[keys[i]]}`;
    }
    return `${signStr}?${strParam.slice(1)}`;
  }
  async createQuery(){
    const params = {};
    const time = new Date().getTime();
    const guid = () => {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = Math.random() * 16 | 0,
          v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
    };
    params['secretid'] = this.config.secretid || '';
    params['engine_model_type'] = this.query.engine_model_type || '16k_zh';
    params['timestamp'] = Math.round(time / 1000);
    params['expired'] = Math.round(time / 1000) + 24 * 60 * 60;
    params['nonce'] = Math.round(time / 100000);
    params['voice_id'] = guid();

    // 非必填参数
    this.query.hasOwnProperty('voice_format') && (params['voice_format'] = this.query.voice_format);
    this.query.hasOwnProperty('hotword_id') && (params['hotword_id'] = this.query.hotword_id);
    this.query.hasOwnProperty('needvad') && (params['needvad'] = this.query.needvad);
    this.query.hasOwnProperty('filter_dirty') && (params['filter_dirty'] = this.query.filter_dirty);
    this.query.hasOwnProperty('filter_modal') && (params['filter_modal'] = this.query.filter_modal);
    this.query.hasOwnProperty('filter_punc') && (params['filter_punc'] = this.query.filter_punc);
    this.query.hasOwnProperty('convert_num_mode') && (params['convert_num_mode'] = this.query.convert_num_mode);
    this.query.hasOwnProperty('word_info') && (params['word_info'] = this.query.word_info);
    this.query.hasOwnProperty('vad_silence_time') && (params['vad_silence_time'] = this.query.vad_silence_time);
    this.query.hasOwnProperty('max_speak_time') && (params['max_speak_time'] = this.query.max_speak_time);

    this.config.token &&  (params['token'] = this.config.token);

    return params;
  }
  // 获取签名原文
  async getSignStr() {
    const queryStr = await this.createQuery();
    return this.formatSignString(queryStr);
  }
}
module.exports = NewSpeechCredential;
