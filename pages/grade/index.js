// pages/grade/index.js
import { getdataInfo, getdata, paynumber} from '../../api/api.js'
const { globalData } = getApp()

// 获取数据
function _getdataInfo(content, data) {
  getdataInfo(data, content).then(res => {
    let { mode} = content.data
    let resultArr = []
    let { info, list, remark, result} = res
    // 设置标题
    wx.setNavigationBarTitle({
      title: info.title
    })
    
    let getListData = setList(list, content.data.mode)
    content.setData({
      info, list: getListData.list, remark, result, resultArr: getListData.resultArr
    })
  })
}
// 设置数据
function setList(list, mode) {
  let resultArr = []
  list = list.map(item => {
    let consult = mode == 1 ? item.titles[0].consult[0] : ''
    // 填充到数组，解决单数默认问题，不在下拉选择
    resultArr.push({
      key: item.id,
      id: item.id,
      val1: '',
      val2: '',
      val3: consult
    })
    return {
      ...item,
      consult,
      tapIndex: 0
    }
  })
  return {
    list,
    resultArr
  }
}
// 计算
function _getdata(content, data) {
  getdata(data, content).then(res => {
    if (res.isPay) {
      if (globalData.userInfo && globalData.userInfo.openid) {
        paynumber({ number: 1}).then(res => {
          let { nonceStr, package: _package, paySign, signType, timeStamp } = res.arr
          wx.requestPayment({
              timeStamp,
              nonceStr,
              package: _package,
              signType,
              paySign,
              success: res => {
                this.setData({
                  success: true
                })
              }
            })
        })
      } else {
        wx.login({
          success: ({ code}) => {
            paynumber({ number: 1, code}).then(res => {
              let { nonceStr, package: _package, paySign, signType, timeStamp } = res.arr
              wx.requestPayment({
                timeStamp,
                nonceStr,
                package: _package,
                signType,
                paySign,
                success: res => {
                  this.setData({
                    success: true
                  })
                }
              })
            })
          }
        })
      }
      
    } else {
      let score = res.result + ''
      score = score.indexOf(',') > 0 ? score.split(',') : [score]
      content.setData({
        score,
        resultArr: setList(content.data.list, content.data.mode).resultArr,
        reportUrl: res.report_url, // 跳转url
        // report: res.report      // 下载链接
      })
    }
  })
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    resultArr: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let { joint, mode, title} = options
    this.setData({
      joint, mode, title
    })
    _getdataInfo(this, { joint, mode})
  },
  onShow() {
    if (this.data.success) {
      wx.showToast({
        title: '支付成功，请再次点击计算~',
        icon: 'none',
        duration: 1000,
        mask: true
      })
    }
  },
  // 点击进入详情
  goDetail(e) {
    // if (this.data.long) {
    //   return
    // }
    wx.navigateTo({
      url: e.currentTarget.dataset.url
    })
  },
  // 选择标题，因为有的地方有多个
  chooseTitle(e) {
    this.setData({
      long: true
    })
    let index = e.currentTarget.dataset.index
    let { list, resultArr, mode} = this.data
    let item = list[index]
    if (item.titles.length <= 1) return false
    let title = item.titles.map(item => item.name)
    wx.showActionSheet({
      itemList: title,
      success: res => {
        list[index].tapIndex = res.tapIndex
        let consult = mode == 1 ? item.titles[res.tapIndex].consult[0] : ''
        list[index].consult = consult
        // resultArr[index]

        let tapIndex = resultArr.findIndex(item => item.key == list[index].id)

        resultArr[tapIndex] = { ...resultArr[tapIndex], id: item.id, val3: consult } // 这是list的id，修改后

        this.setData({
          list
        })
      },
      complete: () => {
        this.setData({
          long: false
        })
      }
    })
  },
  // 第一个输入框内容
  input1(e) {
    let { resultArr, list } = this.data
    let index = e.currentTarget.dataset.index
    let item = list[index]
    let value = e.detail.value
    let tapIndex = resultArr.findIndex(item => item.key == list[index].id)

    // resultArr[tapIndex] = { ...resultArr[tapIndex], id: item.titles[item.tapIndex].id, val1: value } // 这是titles的id， 修改前
    resultArr[tapIndex] = { ...resultArr[tapIndex], id: item.id, val1: value } // 这是list的id，修改后

    this.setData({
      resultArr
    })
  },
  // 第二个输入框内容
  input2(e) {
    let { resultArr, list } = this.data
    let index = e.currentTarget.dataset.index
    let item = list[index]
    let value = e.detail.value
    let tapIndex = resultArr.findIndex(item => item.key == list[index].id)

    // resultArr[tapIndex] = { ...resultArr[tapIndex], id: item.titles[item.tapIndex].id, val2: value }  // 这是titles的id， 修改前
    resultArr[tapIndex] = { ...resultArr[tapIndex], id: item.id, val2: value }  // 这是list的id，修改后

    this.setData({
      resultArr
    })
  },
  // 选择参考值
  chooseCKZ(e) {
    let { resultArr, list, mode} = this.data
    let index = e.currentTarget.dataset.index
    let item = list[index]
    let consult = item.tapIndex ? item.titles[item.tapIndex].consult : item.titles[0].consult
 
    if (mode == 1) return false;
    wx.showActionSheet({
      itemList: consult.map((item, index) => index === 0 ? item + '° (推荐) ' : item + '°'),
      success: res => {
        list[index].consult = consult[res.tapIndex]
        let tapIndex = resultArr.findIndex(item => item.key == list[index].id)

        // resultArr[tapIndex] = { ...resultArr[tapIndex], id: item.titles[item.tapIndex].id, val3: consult[res.tapIndex] } // 这是titles的id， 修改前
        resultArr[tapIndex] = { ...resultArr[tapIndex], id: item.id, val3: consult[res.tapIndex] } // 这是list的id，修改后

        this.setData({
          resultArr,
          list
        })
      }
    })
  },
  // 计算
  getData() {
    let { resultArr, joint, mode} = this.data
    let isSubmit = true
    resultArr.map(item => {
      for(let i in item) {
        console.log(item.i)
        if (!item[i]) {
          wx.showToast({
            title: '请补充完整！',
            icon: 'none',
            duration: 1000,
            mask: true
          })
          isSubmit = false
          break
        }
      }
    })

    if (isSubmit) {
      _getdata(this, { joint, mode, content_json: JSON.stringify(resultArr) })
    }
  },
  // 生成word文档
  createWord() {
    if (this.data.reportUrl) {
      // 直接跳转网页
      wx.navigateTo({
        url: '/pages/webview/index?type=1&title=' + this.data.title + '&src=' + this.data.reportUrl
      })
    } else {
      wx.showToast({
        title: '请先计算，才能生成报告！',
        icon: 'none',
        duration: 1000,
        mask: true
      })
    }
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
    
    // if (this.data.report) {
    //   wx.showLoading({
    //     title: '下载中...'
    //   })
    //   wx.downloadFile({
    //     url: this.data.report,
    //     success: res => {
    //       let filePath = res.tempFilePath
          
    //       wx.getFileSystemManager().saveFile({
    //         tempFilePath: res.tempFilePath,
    //         filePath: wx.env.USER_DATA_PATH + "/" + this.data.title + new Date().getTime() +  '.docx',
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
    // } else {
    //   wx.showToast({
    //     title: '请先计算，才能生成报告！',
    //     icon: 'none',
    //     duration: 1000,
    //     mask: true
    //   })
    // }
  }
})