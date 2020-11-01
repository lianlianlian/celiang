// pages/register/index.js
import { register} from '../../api/api.js'
const { func, globalData } = getApp()

function _register(content, data) {
  register(data, content).then(res => {
    let { token } = res
    // 设置登录态
    func.cookie.set('token', token, { domain: globalData.doMain, maxAge: globalData.maxAge })
    wx.showToast({
      title: '注册成功！',
      icon: 'none',
      duration: 1000,
      mask: true
    })
    setTimeout(() => {
      wx.navigateBack({
        delta: 2,
      })
    }, 1000)
  })
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hidding: true,
    phone: '',
    agreement: ''
  },
  onLoad() {
    if (globalData.init) {
      this.setData({
        agreement: globalData.init.agreement
      })
    } else {
      func.initFun = res => {
        this.setData({
          agreement: res.agreement
        })
      }
    }
  },

  inputPhone(e) {
    this.setData({
      phone: e.detail.value
    })
  },
  goWebviewPage() {
    wx.navigateTo({
      url: '../webview/index?title=用户协议&src=' + this.data.agreement
    })
  },

  submit(e) {
    let { phone, password, code, company, email } = e.detail.value

    if (!phone || phone == '') {
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
    if (!password || password == '') {
      wx.showToast({
        title: '请输入密码！',
        icon: 'none',
        duration: 1000,
        mask: true
      })
      return false
    }
    if (!company || company == '') {
      wx.showToast({
        title: '请输入单位名称！',
        icon: 'none',
        duration: 1000,
        mask: true
      })
      return false
    }
    _register(this, { username: phone, linecode: code, password, company, email})
  }
})