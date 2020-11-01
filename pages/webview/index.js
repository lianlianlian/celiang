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
    wx.hideShareMenu()

    // 非鉴定标准
    if (options.src) {
      let { src, title, type='' } = options
      wx.setNavigationBarTitle({
        title
      })
      this.setData({
        src
      })
      // 显示分享按钮 ，针对生成测量报告
      if (type == 1) {
        wx.showShareMenu({
          withShareTicket: true
        })
      }
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
  },
  onShareAppMessage() {
    return {
      title: this.data.title,
      path: '/pages/webview/index?title=' + this.data.title + '&src=' + this.data.src
    }
  }
})