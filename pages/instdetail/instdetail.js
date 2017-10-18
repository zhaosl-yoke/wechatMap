// pages/instdetail/instdetail.js
var path = require('../../utils/util.js');

Page({
    data: {
        institutionid: 404,
        schoolid: 638,
        certification: false,
        instName:'',
        phone:'',
        address:'',
        intro:'',
        majorArray:[],
        content:'',
        time:'',
        showJob: false,
        jobArray:[],
        jobTime:'',
        teaArray:[],
        url: "http://artapp-dev-bucket.oss-cn-beijing.aliyuncs.com/",
        a:"/",
        b:'.',
        pic:"图片",
        video:"视频",
        pageNum:1,
        pageSize:3,
        moreText:"查看更多",
        border: true,
        borderStyle:"border-bottom: solid 1px #999;",
        mobileNum:'',
        lat:'',
        lng:'',
        morePic:"../../image/more.png",
        showIcon: false,
        open: false
    },
    onLoad: function (options) {
        //   this.setData({
        //       institutionid: options.institutionid,
        //       schoolid: options.schoolid 
        //   })
        this.schoolInfo();
        this.major();
        this.blackboard();
        this.job();
        this.teaList();
    },
    //获取校区信息
    schoolInfo:function() {
        let that = this;
        wx.request({
            url: path.serverPath + path.path + 'artmap/selectUserAddressById', //仅为示例，并非真实的接口地址
            method: 'POST',
            header: { "Content-Type": "application/x-www-form-urlencoded" },
            success: function (res) {
                //console.log(res);
                if (res.data.success) {
                    let DataList = res.data.body.DataList;
                    if (DataList.length) {
                        let totalAddress = DataList[0].province + DataList[0].city + DataList[0].area + DataList[0].address;
                        let addressDesc = DataList[0].addressDesc;
                        let desc1 = DataList[0].desc1 ? DataList[0].desc1:"暂无校区简介";
                        let lat = DataList[0].lat;
                        let lng = DataList[0].lng;
                        let versionCode = DataList[0].versionCode;
                        let phone = DataList[0].phone;
                        if (versionCode == "Full" || versionCode == "Lite") {
                            that.setData({
                                certification: true,
                                showJob: true
                            })
                        }
                        that.setData({
                            instName: addressDesc,
                            phone: phone,
                            address: totalAddress,
                            intro: desc1,
                            mobileNum: phone,
                            lat: lat,
                            lng: lng
                        })
                        if (desc1.length > 100) {
                            that.setData({
                                showIcon: true
                            })
                        }
                    }
                }
            },
            data: {
                'institutionId': that.data.institutionid,
                'addressId': that.data.schoolid
            }
        })
    },
    //导航事件
    moveTo(event) {
        //console.log(event.currentTarget.dataset.lat);
        let lat = event.currentTarget.dataset.lat;
        let lng = event.currentTarget.dataset.lng;
        wx.openLocation({
            latitude: Number(lat),
            longitude: Number(lng)
        })
    },
    //机构简介展开收缩事件
    fold:function() {
        if (this.data.morePic == "../../image/more.png") {
            this.setData({
                open: true,
                morePic:"../../image/hide.png"
            })
        } else {
            this.setData({
                open: false,
                morePic: "../../image/more.png"
            })
        }
    },
    //获取专业
    major:function() {
        let that = this;
        wx.request({
            url: path.serverPath + path.path + 'artmap/selectAddressMajorByAddressId', //仅为示例，并非真实的接口地址
            method: 'POST',
            header: { "Content-Type": "application/x-www-form-urlencoded" },
            success: function (res) {
                //console.log(res);
                if (res.data.success) {
                    //console.log(res);
                    let DataList = res.data.body.DataList;
                    that.setData({
                        majorArray: DataList
                    })

                }
            },
            data: {
                'institutionId': that.data.institutionid,
                'addressId': that.data.schoolid
            }
        })
    },
    //获取小黑板
    blackboard:function() {
        let that = this;
        wx.request({
            url: path.serverPath + path.path + 'artmap/selectBlackboardByAddressId', //仅为示例，并非真实的接口地址
            method: 'POST',
            header: { "Content-Type": "application/x-www-form-urlencoded" },
            success: function (res) {
                //console.log(res);
                if (res.data.success) {
                    //console.log(res);
                    let DataList = res.data.body.DataList;
                    that.setData({
                        content: DataList[0].desc1,
                        time: path.translateTime2(DataList[0].createTime)
                    })
                }
            },
            data: {
                'institutionId': that.data.institutionid,
                'addressId': that.data.schoolid
            }
        })
    },
    //查看小黑板详情
    lookBoard:function() {
        wx.navigateTo({
            url: '../blackboard/blackboard?institutionid=' + this.data.institutionid + "&schoolid="+this.data.schoolid
        })
    },
    //获取招聘信息列表
    job:function() {
        let that = this;
        wx.request({
            url: path.serverPath + path.path + 'artmap/selectAddressJobList', //仅为示例，并非真实的接口地址
            method: 'POST',
            header: { "Content-Type": "application/x-www-form-urlencoded" },
            success: function (res) {
                //console.log(res);
                if (res.data.success) {
                    //console.log(res);
                    let DataList = res.data.body.DataList;
                    if (DataList.length) {
                        for (let i = 0; i < DataList.length; i++) {
                            DataList[i].createTime = path.translateTime(DataList[i].createTime);
                        }
                        if (DataList.length > 3) {
                            for (let i = 0; i < 3; i++) {
                                that.setData({
                                    jobArray: that.data.jobArray.concat(DataList[i])
                                })
                            }
                        } else {
                            that.setData({
                                jobArray: DataList
                            })
                        }
                    } else {

                    }
                    //console.log(that.data.jobArray)
                }
            },
            data: {
                'institutionId': that.data.institutionid,
                'addressId': that.data.schoolid
            }
        })
    },
    //查看招聘信息列表
    lookJob:function() {
        wx.navigateTo({
            url: '../joblist/joblist?institutionid=' + this.data.institutionid + "&schoolid=" + this.data.schoolid
        })
    },
    //查看单个招聘信息事件
    lookDetail:function(e) {
        let id = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: '../jobdetail/jobdetail?institutionid=' + this.data.institutionid + "&schoolid=" + this.data.schoolid+"&id="+id
        })
    },
    //获取教学成果列表
    teaList:function() {
        let that = this;
        wx.request({
            url: path.serverPath + path.path + 'artmap/selectAddressTeachResultList', //仅为示例，并非真实的接口地址
            method: 'POST',
            header: { "Content-Type": "application/x-www-form-urlencoded" },
            success: function (res) {
                if (res.data.success) {
                    let DataList = res.data.body.DataList;
                    if (that.data.pageSize > DataList.length) {
                        that.setData({
                            border: false,
                            borderStyle:"border:none;",
                            moreText:"没有更多了"
                        })
                    }
                    that.setData({
                        teaArray: DataList
                    })
                }
            },
            data: {
                'institutionId': that.data.institutionid,
                'addressId': that.data.schoolid,
                'pageNum': 1,
                'pageSize': that.data.pageSize
            }
        })
    },
    //查看教学成果详情
    lookPic:function(e) {
        let id = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: '../lookpic/lookpic?id='+id
        })
    },
    lookVideo: function (e) {
        let id = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: '../lookvideo/lookvideo?id='+id
        })
    },
    //查看更多事件
    lookMore:function() {
        this.setData({
            pageNum: 1,
            pageSize: this.data.pageSize + 3
        })
        this.teaList();
    },
    //拨打电话事件
    call:function() {
        wx.makePhoneCall({
            phoneNumber: this.data.mobileNum,
            success:function(data) {
                //consoleconsole.log(data)
            }
        })
    }
})