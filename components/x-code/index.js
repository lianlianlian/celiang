// components/x-code/index.js
import { sendcode} from '../../api/api.js'

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    phone: String,
    type: Number
  },

  /**
   * 组件的初始数据
   */
  data: {
    times: '获取验证码'
  },

  /**
   * 组件的方法列表
   */
  methods: {
    sendCode(phone) {
      let times = 60;
      let time = null
      let _self = this

      if (this.data.times != '获取验证码') {
        return false;
      }
      if (this.data.phone == '' || !this.data.phone) {
        wx.showToast({
          title: '请输入手机号！',
          icon: 'none',
          duration: 1000,
          mask: true
        })
        return false;
      }
      wx.showLoading({
        title: '发送中...',
      })
      sendcode({ phone: this.data.phone, send_source: this.data.type}).then(res => {
        wx.hideLoading()
        start()
      })
      
      // _getCode({ username: phone })
      function start() {
        times--
        if (times <= 0) {
          times = 60
          _self.setData({
            times: '获取验证码'
          })
          return false
        }
        _self.setData({
          times: times + 's'
        })
        setTimeout(start, 1000)
      }
    }
  }
})
