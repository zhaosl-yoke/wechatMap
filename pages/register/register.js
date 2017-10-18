Page({
  data:{

  },
  onload:function() {

  },
  success() {
    wx.navigateTo({
      url: '../addinst/addinst'
    })
  },



  //关闭动画事件
  close_animate() {
	  console.log(1)
	  var animation = wx.createAnimation({
		  duration: 1000,
		  timingFunction: 'ease',
	  })
	  console.log(animation)
	  this.animation = animation

	  animation.right(-310).step()

	  this.setData({
		  animationData: animation.export(),
		  block: true
	  })
  },
  //点击登录事件 
  login() {
	  console.log(1)
	  wx.navigateTo({
		  url: '../login/login',
	  })
  },
  //打开动画事件
  open() {
	  var animation = wx.createAnimation({
		  duration: 1000,
		  timingFunction: 'ease',
	  })
	  console.log(animation)
	  this.animation = animation

	  animation.right(0).step()

	  this.setData({
		  animationData: animation.export(),
		  block: false
	  })
  }
})