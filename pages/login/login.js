// pages/login/login.js
var path = require('../../utils/util.js')
var md5 = require('../../utils/md5.js')
Page({
  data: {
    userValue:'',
    psdValue:'',
    red: "#f89e93",
  },
  onLoad: function (options) {

  },
  userInput:function(e) {
    this.setData({
        userValue: e.detail.value
    })
  },
  psdInput: function (e) {
      this.setData({
          psdValue: e.detail.value
      })
  },
  //用户输入失去焦点
  userBlur:function() {
      console.log(this.data.userValue)
      let regMobile = /^0?1[3|4|5|7|8][0-9]\d{8}$/;
      if (this.data.userValue == "") {
          wx.showModal({
              title: 'artapp提示',
              content: '请输入电话号码',
              showCancel:false,
              success: function (res) {
                  if (res.confirm) {
                      console.log('用户点击确定')
                  } 
              }
          })
      } else {
          if (!regMobile.test(this.data.userValue)) {
              wx.showModal({
                  title: 'artapp提示',
                  content: '请输入正确的电话号码',
                  showCancel: false,
                  success: function (res) {
                      if (res.confirm) {
                          console.log('用户点击确定')
                      } 
                  }
              })
          } else {
              this.setData({
                  red: "#f44a33"
              })
          }
      }
  },
  //登录事件
  login:function() {
      if(this.data.psdValue == "") {
          wx.showModal({
              title: 'artapp提示',
              content: '请输入密码',
              showCancel: false,
              success: function (res) {
                  if (res.confirm) {
                      console.log('用户点击确定')
                  }
              }
          })
      } else {
          wx.request({
              url: path.serverPath + path.path+'user/login4', //仅为示例，并非真实的接口地址
              method: 'POST',
              header: { "Content-Type": "application/x-www-form-urlencoded" },
              success: function (res) {
                  console.log(res);
                  if (res.data.success) {
                      console.log(res.data)
                      wx.setStorage({
                          key: 'token',
                          data: res.data.token,
                      })
                      wx.setStorage({
                          key: 'versionCode',
                          data: res.data.versionCode,
                      })
                      wx.navigateTo({
                          url: '../map/map'
                      })
                  } else {
                      wx.showModal({
                          title: 'artapp提示',
                          content: res.data.msg,
                          showCancel: false,
                          success: function (res) {
                              if (res.confirm) {
                                  console.log('用户点击确定')
                              }
                          }
                      }) 
                  }
                 
              },
              data: {
                  "mobile": this.data.userValue,
                  "password": md5.hex_md5(this.data.psdValue)
              }
          })
      }
  },
  //忘记密码事件
  forget:function() {
      wx.navigateTo({
          url: '../restpsd/restpsd'
      })
  },
  //注册事件
  register: function () {
      wx.navigateTo({
          url: '../addinst/addinst'
      })
  }
//   psdBlur: function () {
//       if (this.data.psdValue == "") {
//           wx.showModal({
//               title: 'artapp提示',
//               content: '请输入密码',
//               showCancel: false,
//               success: function (res) {
//                   if (res.confirm) {
//                       console.log('用户点击确定')
//                   } 
//               }
//           })
//       }
//   },
})