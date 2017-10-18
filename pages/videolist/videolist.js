// pages/joblist/joblist.js
var path = require('../../utils/util.js');
//var request = require('../../utils/request.js');
Page({
    data: {
        institutionid: '',
        schoolid: '',
        jobArray: [],
        searchLoading: false, //"上拉加载"的变量，默认false，隐藏  
        searchLoadingComplete: false,  //“没有数据”的变量，默认false，隐藏 
        searchPageNum: 1,   // 设置加载的第几次，默认是第一次  
        callbackcount: 9,      //返回数据的个数  
        searchSongList: [],
        not: '不限',
        part: '兼职',
        all: '全职',
        height: '',
        url: "http://artapp-dev-bucket.oss-cn-beijing.aliyuncs.com/",
        a: "/",
        b: '.',
        pic: "图片",
        video: "视频",
        videos:'',
        noCheckPath:'../../image/no_check.png',
        checkPath:'../../image/check.png',
        selectMajor:[],
        selectVideo: [],
        length:'',
        selectedAllStatus: false,
        token: ''
    },
    onLoad: function (options) {
        var that = this
        that.setData({
            institutionid: options.institutionid,
            schoolid: options.schoolid,
            token: options.token,
        })
        that.videoList();
        wx.getSystemInfo({
            success: function (res) {
                console.log(res);
                that.setData({
                    height: res.windowHeight - 44
                })
            }
        })
    },
    getVideo:function() {
        let that = this;
        let institutionId = that.data.institutionid;
        let   addressId = that.data.schoolid;
        wx.request({
            url: path.serverPath + path.path + 'artmap/selectAddressTeachResultList',
            data: {
                institutionId: institutionId,
                addressId: addressId,
                pageNum: 1,
                pageSize: 1000
            },
            method: 'POST',
            header: { "Content-Type": "application/x-www-form-urlencoded" },
            success: function (res) {
                if (res.data.success) {
                    let DataList = res.data.body.DataList;
                    if (DataList.length) {
                        for (let i = 0; i < DataList.length; i++) {
                            DataList[i].index = i;
                            DataList[i].checked = false;
                        }
                        that.setData({
                            searchSongList: DataList
                        })
                    }
                }
            }
        })
    },
    videoList: function () {
        let that = this;
        let institutionId = that.data.institutionid,
            addressId = that.data.schoolid,
            searchPageNum = that.data.searchPageNum,//把第几次加载次数作为参数  
            callbackcount = that.data.callbackcount; //返回数据的个数  
        //访问网络  
        that.getVideoList(institutionId, addressId, searchPageNum, callbackcount, function (data) {
            console.log(data)
            //判断是否有数据，有则取数据  
            if (data.body.DataList.length != 0) {
                let DataList = data.body.DataList;
                for (var i = 0; i < DataList.length; i++) {
                    DataList[i].createTime = path.translateTime(DataList[i].createTime);
                    DataList[i].index = i;
                    DataList[i].checked = false;
                }
                let searchList = [];
                //如果isFromSearch是true从data中取出数据，否则先从原来的数据继续添加  
                that.data.isFromSearch ? searchList = data.body.DataList : searchList = that.data.searchSongList.concat(data.body.DataList)
                that.setData({
                    searchSongList: searchList, //获取数据数组  
                    searchLoading: false,  //把"上拉加载"的变量设为false，显示 
                    length: data.body.DataList.length
                });
                //没有数据了，把“没有数据”显示，把“上拉加载”隐藏  
            } else {
                that.setData({
                    searchLoadingComplete: true, //把“没有数据”设为true，显示  
                    searchLoading: false  //把"上拉加载"的变量设为false，隐藏  
                });
            }
            console.log(that.data.searchSongList)
        })
    },
    getVideoList: function (institutionId, addressId, pageindex, callbackcount, callback) {
        wx.request({
            url: path.serverPath + path.path + 'artmap/selectAddressTeachResultList',
            data: {
                institutionId: institutionId,
                addressId: addressId,
                pageNum: pageindex,
                pageSize: callbackcount
            },
            method: 'POST',
            header: { "Content-Type": "application/x-www-form-urlencoded" },
            success: function (res) {
                //if (res.statusCode == 200) {
                callback(res.data);
                // }
            }
        })
    },
    //滚动到底部触发事件  
    searchScrollLower: function () {
        let that = this;
        if (that.data.searchLoading && !that.data.searchLoadingComplete) {
            that.setData({
                searchPageNum: that.data.searchPageNum + 1,  //每次触发上拉事件，把searchPageNum+1  
                isFromSearch: false  //触发到上拉事件，把isFromSearch设为为false  
            });
            that.videoList();
        }
    },
    chooseVideo:function(e) {
        var searchSongList = this.data.searchSongList;
        var checkArr = e.detail.value;
        this.setData({
            selectMajor: []
        })
        for (var i = 0; i < searchSongList.length; i++) {
            if (checkArr.indexOf(i + "") != -1) {
                searchSongList[i].checked = true;
                this.setData({
                    selectMajor: this.data.selectMajor.concat(searchSongList[i].id)
                })
            } else {
                searchSongList[i].checked = false;
            }
        }
        console.log(this.data.selectMajor);
        if (this.data.selectMajor.length) {
            for (var j = 0; j < this.data.selectMajor.length; j++) {
                this.setData({
                    videos: this.data.selectMajor.join(",")
                })
            }
        }
        console.log(this.data.videos);
        if (this.data.selectMajor.length != length) {
            this.setData({
                selectedAllStatus: false
            })  
        }
        this.setData({
            searchSongList: searchSongList
        })  
    },
    //全选
    all:function() {
        let that = this;
        var searchSongList = this.data.searchSongList;
        that.setData({
            selectVideo: []
        })
        for (var i = 0; i < searchSongList.length; i++) {
            searchSongList[i].checked = true;
            selectVideo: that.data.selectVideo.push(searchSongList[i].id)
        }
        console.log(that.data.selectVideo);
        if (that.data.selectVideo.length) {
            for (var j = 0; j < that.data.selectVideo.length; j++) {
                that.setData({
                    videos: that.data.selectVideo.join(",")
                })
            }
        }
        console.log(that.data.videos);
        that.setData({
            selectedAllStatus: true,
            searchSongList: searchSongList
        }) 
    },
    //删除
    deleteVideo:function() {
        let that = this;
        wx.request({
            url: path.serverPath + path.path + 'artmap/deleteTeachResult', //仅为示例，并非真实的接口地址
            method: 'POST',
            header: { "Content-Type": "application/x-www-form-urlencoded" },
            success: function (res) {
                console.log(res);
                if (res.data.success) {
                    wx.showToast({
                        title: res.data.msg,
                        icon: 'success',
                        duration: 2000
                    })
                    that.getVideo();
                }
            },
            data: {
                'token': that.data.token,
                'addressId': that.data.schoolid,
                'ids': that.data.videos
            }
        })
    },
    //置顶
    toTop:function() {
        let that = this;
        if (that.data.selectMajor.length > 1) {
            wx.showModal({
                title: 'artapp提示',
                content: '只能选择一项进行置顶',
                showCancel: false,
                success: function (res) {
                    if (res.confirm) {
                        console.log('用户点击确定')
                    }
                }
            })
        }
        wx.request({
            url: path.serverPath + path.path + 'artmap/updateTeachResultIsTop', //仅为示例，并非真实的接口地址
            method: 'POST',
            header: { "Content-Type": "application/x-www-form-urlencoded" },
            success: function (res) {
                console.log(res);
                if (res.data.success) {
                    wx.showToast({
                        title: res.data.msg,
                        icon: 'success',
                        duration: 2000
                    })
                    that.getVideo();
                }
            },
            data: {
                'token': that.data.token,
                'addressId': that.data.schoolid,
                'id': that.data.videos,
                "isHead": 1
            }
        })
    },
    //查看教学成果详情
    lookPic: function (e) {
        let id = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: '../lookpic/lookpic?id=' + id
        })
    },
    lookVideo: function (e) {
        let id = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: '../lookvideo/lookvideo?id=' + id
        })
    }
    
})