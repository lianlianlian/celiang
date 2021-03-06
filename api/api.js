import { http, file } from './index.js';
export const getuserInfo = (data, content) => http({ url: 'mine/userinfo', data, content, method: 'get'})
export const updatauserInfo = (data, content) => http({ url: 'mine/saveInfo', data, content, method: 'post' })
export const login = (data, content) => http({ url: 'login/login', data, content })
export const register = (data, content) => http({ url: 'login/register', data, content })
export const updataPs = (data, content) => http({ url: 'mine/savePw', data, content })
export const getdataInfo = (data, content) => http({ url: 'login/measure', data, content, method: 'get' })
export const getdata = (data, content) => http({ url: 'mine/measure', data, content, method: 'post' })
export const gethistory = (data, content) => http({ url: 'mine/measureList', data, content, method: 'get' })
export const getpayList = (content) => http({ url: 'Mine/memberService', content, method: 'get' })
export const fileup = (data, content) => http({ url: 'mine/saveAvatarBase64', data, content, method: 'post' })
export const bindWx = (data, content) => http({ url: 'Mine/wechat', data, content, method: 'post' })
export const pay = (data, content) => http({ url: 'mine/buyMember', data, content, method: 'post' })
export const paynumber = (data, content) => http({ url: 'Mine/buyNumber', data, content, method: 'post' })
export const sendcode = (data, content) => http({ url: 'login/sendLine', data, content, method: 'post' })
export const forget = (data, content) => http({ url: 'login/findPw', data, content, method: 'post' })
export const init = (data, content) => http({ url: 'Index/other', data, content, method: 'get' })