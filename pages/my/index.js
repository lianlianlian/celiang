// pages/my/index.js
import { getuserInfo, bindWx} from '../../api/api.js'
const { func, globalData} = getApp()

function _getuserInfo(content) {
  getuserInfo().then(res => {
    globalData.userInfo = res
    content.setData({
      userInfo: res
    })
  })
}
function _bindWx(content, data) {
  bindWx(data, content).then(res => {
    var options = {}
    if (data.handle == 1) {
      options = { ...globalData.userInfo, openid: data.code}
    } else {
      options = { ...globalData.userInfo, openid: '' }
    }
    globalData.userInfo = options
    content.setData({
      userInfo: options
    })
    wx.showToast({
      title: data.handle == 1 ? '绑定微信成功!' : '解绑微信成功!',
      icon: 'none',
      duration: 1000,
      mask: true
    })
  })
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hidding: true,
    identity: {
      1: '普通用户',
      2: '会员',
      3: '企业会员'
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    _getuserInfo(this)
  },
  onLoad() {
    if (globalData.init) {
      this.setData({
        showMember: globalData.init.vip_status == 2 ? false : true,
        src: globalData.init.vip_status == 3 ? globalData.init.vip_pay + func.cookie.get('token', globalData.doMain) : ''
      })
    } else {
      func.initFun = res => {
        this.setData({
          showMember: res.vip_status == 2 ? false : true,
          src: res.vip_status == 3 ? res.vip_pay + func.cookie.get('token', globalData.doMain) : ''
        })
      }
    }
    
  },
  call() {
    wx.makePhoneCall({
      phoneNumber: globalData.init.tel
    })
  },
  bindWx(e) {
    let { type } = e.currentTarget.dataset
    wx.showModal({
      content: type == 1 ? "确定要绑定微信吗?" : "确定要解绑微信吗?",
      showCancel: true,
      cancelText: '取消',
      confirmText: type == 1 ? "绑定" : "解绑",
      success: res => {
        if (res.confirm) {
          if (type == 1) {
            wx.login({
              success: res => {
                _bindWx(this, { handle: type, code: res.code })
              }
            })
          } else {
            _bindWx(this, { handle: type, code: res.code })
          }
        }
      }
    })
    
  },
  loginout() {
    wx.showModal({
      title: '提示',
      content: '确定要退出登录吗？',
      showCancel: true,
      success: res => {
        if (res.confirm) {
          func.cookie.remove('token')
          wx.reLaunch({
            url: '../page-login/index'
          })
        }
      }
    })
  }
})