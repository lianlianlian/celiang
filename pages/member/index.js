// pages/member/index.js
import { getpayList, pay} from '../../api/api.js'
const { globalData} = getApp()

function _getpayList(content) {
  getpayList(content).then(res => {
    content.setData({
      list: res
    })
  })
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    identity: {
      1: '未开通会员服务',
      2: '会员',
      3: '企业会员'
    },
    type: 0,
    buyIndex: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      userInfo: globalData.userInfo
    })
    _getpayList(this)
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let bill = wx.getStorageSync('bill')
    if (bill) {
      this.setData({
        bill
      })
      wx.removeStorageSync('bill')
    }
    let success = this.data.success
    if (success) {
      wx.showToast({
        title: '支付成功~',
        icon: 'none',
        duration: 1000,
        mask: true
      })
      setTimeout(() => {
        wx.navigateBack({
          delta: 1,
        })
      }, 1000)
    }
  },
  goWebviewPage() {
    wx.navigateTo({
      url: '/pages/webview/index?title=测量软件会员服务协议&src=' + globalData.init.vipagreement
    })
  },
  chooseFP() {
    wx.showActionSheet({
      itemList: ['不开发票', '填写发票'],
      success: res => {
        let tapIndex = res.tapIndex
        this.setData({
          type: tapIndex
        })
        if (tapIndex == 1) {
          wx.navigateTo({
            url: '../bill/index'
          })
        }
      }
    })
  },
  chooseBuy(e) {
    let index = e.currentTarget.dataset.index
    this.setData({
      buyIndex: index
    })
  },
  submit() {
    let { list, buyIndex, type, bill} = this.data
    // 选择开发票。必须填写发票信息
    if (type == 1 && !bill) {
      wx.showToast({
        title: '请填写发票信息',
        icon: 'none',
        duration: 1000,
        mask: true
      })
      return false
    }
    if (globalData.userInfo.openid) {
      pay({ id: list[buyIndex].id, invoice: type, invoice_category: type == 1 ? bill.type : '', name: type == 1 ? bill.company : '', ti_number: type == 1 ? bill.number : '', phone: type == 1 ? bill.phone : '', email: type == 1 ? bill.email : ''}, this).then(res => {
        let { nonceStr, package: _package, paySign, signType, timeStamp} = res.arr
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
        success: res => {
          pay({ id: list[buyIndex].id, invoice: type, invoice_category: type == 1 ? bill.type : '', name: type == 1 ? bill.company : '', ti_number: type == 1 ? bill.number : '', phone: type == 1 ? bill.phone : '', email: type == 1 ?bill.email:'', code: res.code }, this).then(res => {
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
  }
})