// pages/history/index.js
import { gethistory} from '../../api/api.js'
const { globalData} = getApp()

function _gethistory(content, data) {
  gethistory(data, content).then(res => {
    let result = res || []

    let getOver = result.length == 0 ? true : false
    let { list} = content.data

    if (data.page <= 1) {
      wx.pageScrollTo({
        scrollTop: 0,
        duration: 1000,
      })
    }
    
    list = data.page > 1 ? [...list, ...result] : result
    content.setData({
      list,
      getOver,
      page: ++ data.page
    })
  })
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    getOver: false,   // 判断有没有分页全部加载
    page: globalData.initPage,
    type: {
      1: '单侧受伤',
      2: '双侧均伤'
    },
    id: 0,
    nav: {
      0: '全部',
      1: '肩',
      2: '膝',
      3: '肘',
      4: '踝',
      5: '腕',
      6: '髋'
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },
  
  auth(e) {
    // 获取数据
    _gethistory(this, { joint: this.data.id, page: globalData.initPage })
  },

  nav(e) {
    let { id} = e.currentTarget.dataset
    this.setData({
      id,
      getOver: false
    })
    
    _gethistory(this, { joint: id, page: globalData.initPage })
  },

  // 生成word文档
  createWord(e) {
    let { report, title} = e.currentTarget.dataset

    wx.navigateTo({
      url: '/pages/webview/index?type=1&title=' + title + '&src=' + report
    })
    // wx.getSavedFileList({
    //   success: res => {
    //     if (res.fileList.length) {
    //       res.fileList.map(item => {
    //         wx.removeSavedFile({
    //           filePath: item.filePath
    //         })
    //       })
    //     }
    //   }
    // })
    // if (report) {
    //   wx.showLoading({
    //     title: '下载中...'
    //   })
    //   wx.downloadFile({
    //     url: report,
    //     success: res => {

    //       wx.getFileSystemManager().saveFile({
    //         tempFilePath: res.tempFilePath,
    //         filePath: wx.env.USER_DATA_PATH + "/" + title + new Date().getTime() + '.docx',
    //         success: res => {
    //           wx.openDocument({
    //             filePath: res.savedFilePath
    //           })
    //         }
    //       })
    //     },
    //     complete: () => {
    //       wx.hideLoading()
    //     }
    //   })
    // } 
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    let { page, id, hidding, getOver} = this.data
    if (!getOver) {
      _gethistory(this, { joint: id, page })
    }
    
  }
})