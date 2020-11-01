// pages/login/index.js
import { login, getuserInfo} from '../../api/api.js'
const { func, globalData} = getApp()
// 普通登录
function _login(content, data) {
  wx.showLoading({
    title: '登录中...',
  })
  login(data).then(res => {
    let { token} = res
    // 设置登录态
    func.cookie.set('token', token, { domain: globalData.doMain, maxAge: globalData.maxAge })
    wx.hideLoading()
    // 获取用户详情
    getuserInfo().then(userInfo => {
      globalData.userInfo = userInfo
      wx.switchTab({
        url: '../index/index'
      })
    })
  })
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    form: {},
    nav: ['密码登录', '验证码登录'],
    navIndex: 0
  },
  nav(e) {
    let index = e.currentTarget.dataset.index
    this.setData({
      navIndex: index
    })
  },
  changeLoginWay(e) {
    this.setData({
      navIndex: e.detail.current
    })
  },
  inputPhone(e) {
    this.setData({
      phone2: e.detail.value
    })
  },
// 普通登录
  loginsubmit(e) {
    let { phone1, phone2, password, code } = e.detail.value
    let navIndex = this.data.navIndex
    // 密码登录
    if (navIndex == 0) {
      if (!phone1 || phone1 == '') {
        wx.showToast({
          title: '请输入手机号！',
          icon: 'none',
          duration: 1000,
          mask: true
        })
        return false
      }
      if (!password || password == '') {
        wx.showToast({
          title: '请输入密码！',
          icon: 'none',
          duration: 1000,
          mask: true
        })
        return false
      }
      _login(this, { username: phone1, password, login_type: 1})
    } else {
      // 验证码登录
      if (!phone2 || phone2 == '') {
        wx.showToast({
          title: '请输入手机号！',
          icon: 'none',
          duration: 1000,
          mask: true
        })
        return false
      }
      if (!code || code == '') {
        wx.showToast({
          title: '请输入验证码！',
          icon: 'none',
          duration: 1000,
          mask: true
        })
        return false
      }
      _login(this, { username: phone2, linecode: code, login_type: 2 })
    }
  },
  // 微信登录
  wxLogin(e) {
    // 获取用户详情
    getuserInfo().then(userInfo => {
      globalData.userInfo = userInfo
      wx.switchTab({
        url: '../index/index'
      })
    })
  }
})