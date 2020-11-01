// components/get-userinfo/index.js
import { getuserInfo} from '../../api/api.js'
const { func, globalData} = getApp()

Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },
  options: {
    multipleSlots: true 
  },
  /**
   * 组件的初始数据
   */
  data: {

  },
  pageLifetimes: {
    // 组件所在页面的生命周期函数
    show: function () {
      this._auth()
    },
  },
  /**
   * 组件的方法列表
   */
  methods: {
    _auth() {
      let token = func.cookie.get('token')

      if (token) {
        this._show()
        this.triggerEvent('auth', true)
      } else {
        this._hidden()
        wx.reLaunch({
          url: '../page-login/index'
        })
        // this.triggerEvent('auth', false)
      }
    },
    _show() {
      this.setData({
        show: true
      })
    },
    _hidden() {
      this.setData({
        show: false
      })
    },
    _getuserInfo() {
      getuserInfo({id:wx.getStorageSync('userId')}).then(res => {
        globalData.userInfo = res.infor[0]
        this.triggerEvent('on-user')
      })
    }
  }
})
