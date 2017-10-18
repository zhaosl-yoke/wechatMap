var app = getApp()
Page({
  data: {
    motto: 'Hello WeApp',
    userInfo: {}
  },
  onButtonTap: function() {
    wx.navigateTo({
      url: '../map/map'
    })
  },
  onLoad: function () {
    console.log('onLoad')
    var that = this
  	//登录
    wx.login({
      success: function () {
        wx.getUserInfo({
          success: function (res) {
            that.setData({userInfo: res.userInfo})
            that.update()

          }
        })
      },
      fail: function (res) {
        console.log(res)
      }
    });
  }
})
