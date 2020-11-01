// pages/reset-ps/index.js
import { forget} from '../../api/api.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    hidding: true,
    phone: ''
  },

  inputPhone(e) {
    this.setData({
      phone: e.detail.value
    })
  },
  submit(e) {
    let { phone, password, code, againPassword } = e.detail.value

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
        title: '请输入新密码！',
        icon: 'none',
        duration: 1000,
        mask: true
      })
      return false
    }
    if (!againPassword || againPassword == '') {
      wx.showToast({
        title: '请再次输入密码！',
        icon: 'none',
        duration: 1000,
        mask: true
      })
      return false
    }
    if (againPassword != password) {
      wx.showToast({
        title: '两次密码输入不一致！',
        icon: 'none',
        duration: 1000,
        mask: true
      })
      return false
    }
    forget({ username: phone, linecode: code, password, confirm_password: againPassword}, this).then(res => {
      wx.showToast({
        title: '密码设置成功!',
        icon: 'none',
        duration: 1000,
        mask: true
      })
      setTimeout(() => {
        wx.navigateBack({
          delta: 1,
        })
      },1000)
    })
  }
})