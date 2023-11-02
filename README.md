# 简介

欢迎使用腾讯云语音SDK，腾讯云语音SDK为开发者提供了访问腾讯云语音识别、语音合成等语音服务的配套开发工具，简化腾讯云语音服务的接入流程。

本项目是腾讯云语音SDK的Nodejs语言版本。

# 依赖环境

1. 使用相关产品前需要在腾讯云控制台已开通相关语音产品。
2. 在腾讯云控制台[账号信息](https://console.cloud.tencent.com/developer)页面查看账号APPID，[访问管理](https://console.cloud.tencent.com/cam/capi)页面获取 SecretID 和 SecretKey 。
3. 将获取的APPID、SecretID 和 SecretKey填入 example/目录下的demo 中。
4. 录音文件识别极速版其他参数参考 https://cloud.tencent.com/document/product/1093/52097 。
5. 实时语音识别其他参数参考 https://cloud.tencent.com/document/product/1093/48982。

# 运行demo

进入 example/flashExample目录 执行 node flashExample.js

进入 example/speechExample 执行 node speechExample.js

# 示例

参见 [examples](https://github.com/TencentCloud/tencentcloud-speech-sdk-nodejs/tree/master/example) 目录的示例代码。