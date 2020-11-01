// pages/webview/index.js
const { globalData, func} = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    // 非鉴定标准
    if (options.src) {
      let { src, title } = options
      wx.setNavigationBarTitle({
        title
      })
      this.setData({
        src: globalData.baseUrl + globalData.webviewUrl + src
      })
    } else {
      wx.setNavigationBarTitle({
        title: '鉴定标准'
      })
      if (globalData.init) {
        this.setData({
          src: globalData.init.cad
        })
      } else {
        func.initFun = res => {
          this.setData({
            src: res.cad
          })
        }
      }
    }
  }
})