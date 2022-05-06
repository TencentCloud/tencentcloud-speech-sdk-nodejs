class NewCredential {
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
    let signStr = "POSTasr.cloud.tencent.com/asr/flash/v1/";
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
  createQuery(){
    const params = {};
    const time = new Date().getTime();
    params['secretid'] = this.config.secretid || '';
    params['engine_type'] = this.query.engine_type || '16k_zh';
    params['voice_format'] = this.query.voice_format || 'wav';
    params['timestamp'] = Math.round(time / 1000);

    // 非必填参数
    this.query.hasOwnProperty('speaker_diarization') && (params['speaker_diarization'] = this.query.speaker_diarization);
    this.query.hasOwnProperty('filter_dirty') && (params['filter_dirty'] = this.query.filter_dirty);
    this.query.hasOwnProperty('filter_modal') && (params['filter_modal'] = this.query.filter_modal);
    this.query.hasOwnProperty('filter_punc') && (params['filter_punc'] = this.query.filter_punc);
    this.query.hasOwnProperty('convert_num_mode') && (params['convert_num_mode'] = this.query.convert_num_mode);
    this.query.hasOwnProperty('word_info') && (params['word_info'] = this.query.word_info);
    this.query.hasOwnProperty('first_channel_only') && (params['first_channel_only'] = this.query.first_channel_only);

    this.config.token && (params['token'] = this.config.token);

    return params;
  }
  // 获取签名原文
  getSignStr() {
    const queryStr = this.createQuery();
    return this.formatSignString(queryStr);
  }
}
module.exports = NewCredential;
