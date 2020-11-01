// components/login/index.js
const { globalData, func} = getApp()

Component({
  options: {
    multipleSlots: true
  },

  /**
   * 组件的属性列表
   */
  properties: {

  },
  /**
   * 组件的初始数据
   */
  data: {
    show: true
  },

  /**
   * 组件的方法列表
   */
  methods: {
    buttonLogin(e) {
      let self = this
      if (e.detail.errMsg != 'getUserInfo:fail auth deny') {
        let { avatarUrl, nickName } = e.detail.userInfo
        wx.login({
          success: ({ code}) => {
            func.login({ code}).then(res => {
              this._hidden()
              this.triggerEvent('on-login')
            })
          }
        })
      } else {
        wx.showModal({
          title: '提示',
          content: '您还未授权获取用户信息，请设置',
          success(res) {
            if (res.confirm) {
              wx.openSetting({
                success: res => {
                  if (res.authSetting['scope.userInfo']) {
                    self.login()
                  }
                }
              })
            }
          }
        })
      }
    },
    login() {
      let self = this
      wx.getUserInfo({
        withCredentials: true,
        success: (res) => {
          let { avatarUrl, nickName } = res.userInfo
          wx.login({
            success: ({ code}) => {
              func.login({ code}).then(res => {
                this._hidden()
                this.triggerEvent('on-login')
              })
            },
          })
        }
      })
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
    }
  }
})
