// pages/joblist/joblist.js
var path = require('../../utils/util.js');
//var request = require('../../utils/request.js');
Page({
    data: {
        institutionid: '',
        schoolid: '',
        jobArray:[],
        searchLoading: false, //"上拉加载"的变量，默认false，隐藏  
        searchLoadingComplete: false,  //“没有数据”的变量，默认false，隐藏 
        searchPageNum: 1,   // 设置加载的第几次，默认是第一次  
        callbackcount: 9,      //返回数据的个数  
        searchSongList:[],
        not:'不限',
        part:'兼职',
        all:'全职',
        height:''
    },
    onLoad: function (options) {
        var that = this
       that.setData({
            institutionid: options.institutionid,
            schoolid: options.schoolid 
        })
    that.jobList();
    wx.getSystemInfo({
        success: function (res) {
            console.log(res);
            that.setData({
                height: res.windowHeight + "px"
            })
        }
    })
    },
    jobList: function () {
        let that = this;
        let institutionId = that.data.institutionid,
            addressId = that.data.schoolid,
            searchPageNum = that.data.searchPageNum,//把第几次加载次数作为参数  
            callbackcount = that.data.callbackcount; //返回数据的个数  
        //访问网络  
        that.getJobList(institutionId,addressId,searchPageNum, callbackcount, function (data) {
            console.log(data)
            //判断是否有数据，有则取数据  
            if (data.body.DataList.length != 0) {
                let DataList = data.body.DataList;
                for (var i = 0; i < DataList.length; i++) {
                    DataList[i].createTime = path.translateTime(DataList[i].createTime);
                }
                let searchList = [];
                //如果isFromSearch是true从data中取出数据，否则先从原来的数据继续添加  
                that.data.isFromSearch ? searchList = data.body.DataList : searchList = that.data.searchSongList.concat(data.body.DataList)
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
    getJobList:function(institutionId, addressId, pageindex, callbackcount, callback) {
        wx.request({
            url: path.serverPath + path.path + 'artmap/selectAddressJobList',
            data: {
                institutionId: institutionId,
                addressId: addressId,
                pageNum: pageindex,
                pageSize: callbackcount,
                inuse: 1
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
            that.jobList();
        }
    },
    //查看招聘详情事件
    lookDetail:function(e) {
        //console.log(e.currentTarget.dataset.id)
        let id = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: '../jobdetail/jobdetail?institutionid=' + this.data.institutionid + "&schoolid=" + this.data.schoolid+"&id="+id
        })
    }
})