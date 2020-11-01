//index.js
//获取应用实例
import { getuserInfo} from '../../api/api.js'
const { globalData, func} = getApp()

function _getuserInfo(content) {
  wx.showLoading({
    title: '加载中...',
    mask: true
  })
  getuserInfo().then(res => {
    globalData.userInfo = res
    content.setData({
      userInfo: res
    })
    wx.hideLoading()
  })
}
Page({
  data: {
    way: { 1: '单侧受伤', 2: '双侧均伤'},
    wayIndex: 0,
    kind: [
      { name: '肩关节', id: 1},
      { name: '膝关节', id: 2},
      { name: '肘关节', id: 3},
      { name: '踝关节', id: 4},
      { name: '腕关节', id: 5},
      { name: '髋关节', id: 6}
    ],
    kindIndex: -1
  },
  chooseKind(e) {
    let index = e.currentTarget.dataset.index
    this.setData({
      kindIndex: index
    })
  },
  chooseWay(e) {
    this.setData({
      wayIndex: e.currentTarget.dataset.id
    })
  },
  goPage(e) {
    let { kind, kindIndex, wayIndex} = this.data
    
    if (kindIndex < 0) {
      wx.showToast({
        title: '请选择关节!',
        icon: 'none',
        duration: 1000,
        mask: true
      })
      return false
    }
    if (wayIndex <= 0) {
      wx.showToast({
        title: '请选择检测方式!',
        icon: 'none',
        duration: 1000,
        mask: true
      })
      return false
    } 
    wx.navigateTo({
      url: e.currentTarget.dataset.page + '?joint=' + kind[kindIndex].id + '&mode=' + wayIndex + '&title=' + (kind[kindIndex].name + '损伤报告')
    })
  },
  auth() {
    _getuserInfo(this)
  }
})
