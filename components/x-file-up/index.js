// pages/components/x-file-up/index.js
import { fileup} from '../../api/api.js'
function _fileUp(content, data) {
  fileup({ avatar: data.path}).then(res => {
    content.triggerEvent('on-file', res.file_url)
  })
}
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    count: {
      type: Number,
      value: 1
    },
    disabled: Boolean
  },

  /**
   * 组件的初始数据
   */
  data: {
    list: []
  },

  /**
   * 组件的方法列表
   */
  methods: {
    file() {
      if (this.data.disabled) return false;
      wx.chooseImage({
        count: this.data.count,
        success: ({ tempFilePaths}) => {
          let url = tempFilePaths[0]
          wx.getFileSystemManager().readFile({
            filePath: url, //选择图片返回的相对路径
            encoding: 'base64', //编码格式
            success: res => { //成功的回调
              var base64 = 'data:image/png;base64,' + res.data
              _fileUp(this, { path: base64 })
            }
          })
        }
      })
    }
  }
})
