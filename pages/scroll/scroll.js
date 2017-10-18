var time = require('../../utils/util.js')
Page({
  data: {
    searchKeyword: '',  //需要搜索的字符  
    searchSongList: [], //放置返回数据的数组  
    isFromSearch: true,   // 用于判断searchSongList数组是不是空数组，默认true，空的数组  
    searchPageNum: 1,   // 设置加载的第几次，默认是第一次  
    callbackcount: 15,      //返回数据的个数  
    searchLoading: false, //"上拉加载"的变量，默认false，隐藏  
    searchLoadingComplete: false,  //“没有数据”的变量，默认false，隐藏 
    url:"http://artapp-dev-bucket.oss-cn-beijing.aliyuncs.com/", //路径头部
    defaultPath: "../../image/default.png"//默认路径
  },
  onLoad:function() {
    this.fetchSearchList();
    console.log(time.translateTime(1499599105000))
  },
  play_video(event) {
      console.log(event.currentTarget.dataset.data);
      let data = event.currentTarget.dataset.data;
      let url = "http://artapp-dev-bucket.oss-cn-beijing.aliyuncs.com/";
      let videoPath = url + data.media;
      let poster = data.videoCover ? url + data.videoCover : "../../image/default.png";
      wx.navigateTo({
          url: '../video/video?videoPath=' + videoPath + "&poster=" + poster,
      })
  },
  //搜索，访问网络  
  fetchSearchList: function () {
    let that = this;
    let searchKeyword = that.data.searchKeyword,//输入框字符串作为参数  
      searchPageNum = 1,//把第几次加载次数作为参数  
      callbackcount = 8; //返回数据的个数  
    //访问网络  
    util.getSearchMusic(searchKeyword,searchPageNum, callbackcount, function (data) {
      console.log(data)
      //判断是否有数据，有则取数据  
      if (data.body.musicCircleInfos.length != 0) {
        let musicCircleInfos = data.body.musicCircleInfos;
        for (var i = 0; i < musicCircleInfos.length;i ++) {
          musicCircleInfos[i].createTime = time.translateTime(musicCircleInfos[i].createTime);
        }
        let searchList = [];
        //如果isFromSearch是true从data中取出数据，否则先从原来的数据继续添加  
        that.data.isFromSearch ? searchList = data.body.musicCircleInfos : searchList = that.data.searchSongList.concat(data.body.musicCircleInfos)
        that.setData({
          searchSongList: searchList, //获取数据数组  
          searchLoading: true  //把"上拉加载"的变量设为false，显示 
        });
        //没有数据了，把“没有数据”显示，把“上拉加载”隐藏  
      } else {
        that.setData({
          searchLoadingComplete: true, //把“没有数据”设为true，显示  
          searchLoading: false  //把"上拉加载"的变量设为false，隐藏  
        });
      }
    })
  },
  //查看更多
  more() {
    wx.navigateTo({
      url: '../detail/detail',
    })
  }
})  
