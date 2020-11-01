// pages/bill/index.js
const { func, globalData } = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    type: [
      { name: '个人', value: '1'},
      { name: '公司', value: '2' }
    ],
    typeIndex: 1
  },
  onLoad() {
    this.setData({
      email: globalData.userInfo.email, 
      phone: globalData.userInfo.username
    })
  },
  chooseType(e) {
    this.setData({
      typeIndex: e.detail.value
    })
  },

  submit(e) {
    let { company, email, number, phone } = e.detail.value
    let { type, typeIndex} = this.data

    if (!company || company == '') {
      wx.showToast({
        title: typeIndex == 1 ? '请输入姓名!' : '请输入单位名称!',
        icon: 'none',
        duration: 1000,
        mask: true
      })
      return false
    }
    if (typeIndex == 2 && !number || typeIndex == 2 && number == '') {
      wx.showToast({
        title: '请输入纳税人识别号!',
        icon: 'none',
        duration: 1000,
        mask: true
      })
      return false
    }
    if (!phone || phone == '') {
      wx.showToast({
        title: '请输入收票人手机号!',
        icon: 'none',
        duration: 1000,
        mask: true
      })
      return false
    }
    if (!func.util.checkPhone(phone)) {
      wx.showToast({
        title: '请输入正确的手机号!',
        icon: 'none',
        duration: 1000,
        mask: true
      })
      return false
    }
    if (!email || email == '') {
      wx.showToast({
        title: '请输入收票人邮箱!',
        icon: 'none',
        duration: 1000,
        mask: true
      })
      return false
    }
    if (!func.util.checkEmail(email)) {
      wx.showToast({
        title: '请输入正确的邮箱!',
        icon: 'none',
        duration: 1000,
        mask: true
      })
      return false
    }
    wx.setStorageSync('bill', { company, email, number, phone, type: typeIndex})
    wx.navigateBack({
      delta: 1,
    })
  }
})