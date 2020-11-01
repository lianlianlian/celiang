// pages/my-infor/index.js
import { updatauserInfo} from '../../api/api.js'
const { globalData} = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    hidding: true,
    sex: ['保密', '男', '女'],
    form: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  auth() {
    let userInfo = globalData.userInfo
    // 设置用户基本信息
    this.setData({
      form: { ...userInfo, region: userInfo.region || [], gender: userInfo.gender || 0}
    })
  },
  filesuccess(e) {
    let form = this.data.form
    form.avatar = e.detail
    this.setData({
      form
    })
  },
  submit() {
    let { company, email, gender, birthday, city, nickname, region} = this.data.form
    updatauserInfo({ nickname, company, gender, birthday, city, email, region}, this).then(res => {
      wx.showToast({
        title: '信息保存成功~',
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
  },
  inputEmail(e) {
    let form = this.data.form
    form.email = e.detail.value
    this.setData({
      form
    })
  },
  inputNickname(e) {
    let form = this.data.form
    form.nickname = e.detail.value
    this.setData({
      form
    })
  },
  inputCompany(e) {
    let form = this.data.form
    form.company = e.detail.value
    this.setData({
      form
    })
  },

  chooseSex(e) {
    let form = this.data.form

    wx.showActionSheet({
      itemList: this.data.sex,
      success: res => {
        form.gender = res.tapIndex
        this.setData({
          form
        })
      }
    })
  },

  chooseDate(e) {
    let form = this.data.form
    form.birthday = e.detail.value
    this.setData({
      form
    })
  },

  chooseCity(e) {
    let form = this.data.form
    form.region = e.detail.value
    this.setData({
      form
    })
  }
})