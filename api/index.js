const errCode = ({ code, msg, url, data, content, loadingTxt }) => {
  return new Promise((resolve, reject) => {
    let { systemInfo, init} = getApp().globalData
    // 登录态失效处理code == 100 || 
    if (code == 1001) {
      // 自动登录，用于微信授权登录
      wx.getUserInfo({
        withCredentials: true,
        success: res => {
          let { avatarUrl, nickName } = res.userInfo
          // 重新登录
          wx.login({
            success: ({ code }) => {
              login({ code, avatar: avatarUrl, nickname: nickName, lastloginversion: init.version, devicetype: systemInfo.system.indexOf('iOS') > 0 ? '1' : '2' }).then(res => {
                // 重新请求登录态失效之前的接口
                return http({ url, data: { ...data }, content, loadingTxt })
              }).then(res => { resolve(res) })
            }
          })
        }
      })
    } else if (code == 401) {
      if (!getCurrentPages().includes('pages/login/index')){
        wx.navigateTo({
          url: '../login/index'
        })
      }
    } else if (code == 204) { // 解决分页
      resolve([])
    } else if (code == 202) { // 解决免费次数用完，购买问题
      wx.showModal({
        title: '提示',
        content: msg,
        showCancel: true,
        cancelText: '取消',
        confirmText: '购买',
        success: res => {
          if (res.confirm) {
            resolve({isPay: true})
          }
        }
      })
    } else {
      wx.showToast({
        title: msg,
        icon: 'none',
        duration: 1000,
        mask: true
      })
    }
  })
}

export const login = (data) =>
  new Promise((resolve, reject) => {
    let { globalData, func} = getApp()
    wx.showLoading({
      title: '登录中...'
    })
    http({ url: 'login/wechatlogin', data: { ...data } }).then(res => {
      let userInfo = res
      // 设置登录态
      func.cookie.set('token', userInfo.token, { domain: globalData.doMain, maxAge: globalData.maxAge })
      // 保存用户信息
      globalData.userInfo = userInfo
      wx.hideLoading()
      resolve(res);
    })
  })
export const http = ({ url, data = {}, method = 'POST', content, loadingTxt = '加载中...' } = {}) =>
  new Promise((resolve, reject) => {
    let token = ''

    if (getApp()) {
      var { func: { cookie }, globalData: { doMain, baseUrl } } = getApp()
      // 获取token
      token = cookie.get('token', doMain) || ''
    } else {
      baseUrl = 'https://c.jdbz.com/'
    }
    
    // 加载框
    content ? content.setData({ hidding: false, loadingTxt }) : '';
    
    // Object.assign(data, { token })
    wx.request({
      url: baseUrl + url,
      data,
      method,
      header: {
        "Authorization": token,
        "content-type": "application/x-www-form-urlencoded"
      },
      success: res => {
        // 隐藏加载框
        // content ? content.setData({ hidding: true }) : '';
        if (res.data.code == 200) {
          resolve(res.data.response);
        } else {
          // 处理错误方法
          errCode({ ...res.data, content, url, data, loadingTxt }).then(res => { resolve(res) });
        }
      },
      fail: err => {
        // content ? content.setData({ hidding: true }) : '';
        // 处理错误方法
        errCode({ error_code: 500, msg: '服务器错误', content, url, data, loadingTxt}).then(res => { resolve(res) });
      },
      complete: () => {
        content ? content.setData({ hidding: true }) : '';
      }
    })
  })
// 文件上传
export const file = ({ url, path, data = {}, content, loadingTxt = '加载中...' } = {}) =>
  new Promise((resolve, reject) => {
    // 全局app
    let { func: { cookie }, globalData: { doMain, baseUrl } } = getApp()
    // 获取请求 cookies
    let PHPSESSID = `PHPSESSID=${cookie.get('PHPSESSID', doMain)}`
    let token = cookie.get('token', doMain)

    Object.assign(data, { token })
    wx.uploadFile({
      url: baseUrl + url,
      filePath: path,
      name: 'temp_file',
      formData: data,
      header: {
        "Cookie": PHPSESSID
      },
      success: res => {
        // 隐藏加载框
        content ? content.setData({ hidding: true }) : '';
        let result = JSON.parse(res.data)
        if (result.success) {
          resolve(result);
        } else {
          // 处理错误
          errCode({ ...result, url, data, loadingTxt, path, content }).then(res => { resolve(res) });
        }
      },
      fail: err => {
        // 隐藏加载框
        content ? content.setData({ hidding: true }) : '';
        // 处理错误
        errCode({ error_code: 500, msg: '服务器错误', url, data, loadingTxt, path, content }).then(res => { resolve(res) });
      }
    })
  })
