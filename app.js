//app.js
import cookie from './utils/weapp-cookie'
import { login } from 'api/index'
const util = require('./utils/util.js')
import { init } from '/api/api.js'

App({
  onLaunch: function () {
    // 获取设备信息
    wx.getSystemInfo({
      success: res => {
        this.globalData.systemInfo = res
      }
    })
    if (!this.globalData.init) {
      init().then(res => {
        this.globalData.init = res
        if (this.func.initFun) {
          this.func.initFun(res)
        }
      })
    }
  },
  globalData: {
    init: null,
    cookie: null,
    systemInfo: null,
    userInfo: null,
    initPage: 1,
    baseUrl: 'https://c.jdbz.com/',
    webviewUrl: 'index.php/Webservice/V100/',
    doMain: 'www.c.jdbz.com',
    maxAge: 60*60*24,
  },
  func: {
    login,
    cookie,
    util
  }
})