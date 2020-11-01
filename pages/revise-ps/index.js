// pages/revise-ps/index.js
import { updataPs} from '../../api/api.js'

function _updataPs(content, data) {
  updataPs(data, content).then(res => {
    wx.showToast({
      title: '密码修改成功！',
      icon: 'none',
      duration: 1000,
      mask: true
    })
    setTimeout(() => {
      wx.navigateBack({
        delta: 1,
      })
    }, 1000)
  })
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hidding: true
  },

  submit(e) {
    let { oldValue, newValue, againValue } = e.detail.value
    if (!oldValue || oldValue == '') {
      wx.showToast({
        title: '请输入旧密码！',
        icon: 'none',
        duration: 1000,
        mask: true
      })
      return false
    }
    if (!newValue || newValue == '') {
      wx.showToast({
        title: '请输入新密码！',
        icon: 'none',
        duration: 1000,
        mask: true
      })
      return false
    }
    if (!againValue || againValue == '') {
      wx.showToast({
        title: '请再次确认密码！',
        icon: 'none',
        duration: 1000,
        mask: true
      })
      return false
    }
    if (againValue != newValue) {
      wx.showToast({
        title: '两次密码输入不一致！',
        icon: 'none',
        duration: 1000,
        mask: true
      })
      return false
    }
    _updataPs(this, { old_password: oldValue, password: newValue, confirm_password: againValue})
  }
})