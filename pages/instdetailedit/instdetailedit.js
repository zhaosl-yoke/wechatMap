// pages/instdetail/instdetail.js
var path = require('../../utils/util.js');

Page({
    data: {
        schoolArray:[],
        schoolName:'',
        show:false,
        institutionid: '',
        schoolid: '',
        majorArray:[],
        majorArrayTotal: [],
        content:'',
        time:'',
        teaArray:[],
        url: "http://artapp-dev-bucket.oss-cn-beijing.aliyuncs.com/",
        a:"/",
        b:'.',
        pic:"图片",
        video:"视频",
        border: true,
        borderStyle:"border-bottom: solid 1px #999;",
        token:"",
        currentItemId:'',
        schoolIntro:'',
        phone:'',
        address:'',
        showMajor:false,
        id:'',
        currentItemCode:'',
        checked: false,
        color: "#333",
        borderColor: '',
        majorCodes:'',
        selectMajor:[]
    },
    onLoad: function (options) {
          this.setData({
                institutionid: options.institutionid,
                schoolid: options.schoolid,
                token: options.token
          })
        //this.totalMajor();

        this.schoolInfo();
        // this.major();
        // this.blackboard();
        // this.teaList();
        // this.schoolIntro();
        
    },
    //获取校区
    schoolInfo:function() {
        let that = this;
        wx.request({
            url: path.serverPath + path.path + 'artmap/selectInstAddress1', //仅为示例，并非真实的接口地址
            method: 'POST',
            header: { "Content-Type": "application/x-www-form-urlencoded" },
            success: function (res) {
                //console.log(res);
                if (res.data.success) {
                    let userAddresses = res.data.body.userAddresses;
                    if (userAddresses.length) {
                        that.setData({
                            schoolArray: userAddresses
                        })
                        for (var i = 0; i < userAddresses.length; i++) {
                            that.setData({
                                schoolName: userAddresses[0].addressDesc,
                                institutionid: userAddresses[0].userId,
                                schoolid: userAddresses[0].id
                            })
                        }
                    }
                }
            },
            data: {
                'token': that.data.token
            }
        })
        setTimeout(function() {
            that.major();
            that.blackboard();
            that.teaList();
            that.schoolIntro();
        },1000)
    },
    //根据id获取校区信息
    schoolIntro: function (institutionId, addressId) {
        let that = this;
        wx.request({
            url: path.serverPath + path.path + 'artmap/selectUserAddressById', //仅为示例，并非真实的接口地址
            method: 'POST',
            header: { "Content-Type": "application/x-www-form-urlencoded" },
            success: function (res) {
                let DataList = res.data.body.DataList;
                if (res.data.success) {
                    if (DataList.length) {
                        //console.log(res)
                        that.setData({
                            schoolName2: DataList[0].addressDesc,
                            schoolIntro: DataList[0].desc1 ? DataList[0].desc1:"暂无校区简介",
                            phone: DataList[0].phone,
                            address: DataList[0].province + DataList[0].city + DataList[0].area + DataList[0].address,
                        })
                    } else {

                    }
                }
            },
            data: {
                'institutionId': that.data.institutionid,
                'addressId': that.data.schoolid
            }
        })
    },
    //编辑校区信息事件
    editInst:function() {
        wx.navigateTo({
            url: '../editinst/editinst?institutionid=' + this.data.institutionid + "&schoolid=" + this.data.schoolid+"&token="+this.data.token
        })
    },
   //切换校区事件
    tabSchool:function() {
        this.setData({
            show: true
        })
    },
    //关闭校区弹窗
    closeSchool:function() {
        this.setData({
            show: false
        })
    },
    //选择校区事件
    chooseSchool:function(e) {
        console.log(e)
        let id = e.currentTarget.dataset.id;
        let name = e.currentTarget.dataset.name;
        let institutionId = e.currentTarget.dataset.inst;
        let addressId = e.currentTarget.dataset.school;
        this.setData({
            currentItemId: id,
            show: false,
            institutionid: institutionId,
            schoolid: addressId,
            schoolName: name,
            schoolName2: '',
            majorArray: [],
            teaArray: [],
            content: '',
            time: '',
        })
        this.major();
        this.blackboard();
        this.teaList();
        this.schoolIntro();
    },
    //弹出专业选择框
    addMajor:function() {
        this.setData({
            showMajor: true
        })
        this.totalMajor();
    },
    //查询所有专业
    totalMajor: function() {
        let that = this;
        wx.request({
            url: path.serverPath + path.path + 'dictionary/getDictionaryInfo', //仅为示例，并非真实的接口地址
            method: 'POST',
            header: { "Content-Type": "application/x-www-form-urlencoded" },
            success: function (res) {
                if (res.data.success) {
                    let listDictionarys = res.data.body.listDictionarys;
                    if (listDictionarys.length) {
                        for (var i = 0; i < listDictionarys.length; i++) {
                            listDictionarys[i].checked = false;
                            listDictionarys[i].index = i;
                        }
                        that.setData({
                            majorArrayTotal: listDictionarys
                        })
                            console.log(listDictionarys)
                    }
                }
            },
            data: {
                'typeId': '01'
            }
        })
    },
    //获取专业
    major: function (institutionId, addressId) {
        let that = this;
        wx.request({
            url: path.serverPath + path.path + 'artmap/selectAddressMajorByAddressId', //仅为示例，并非真实的接口地址
            method: 'POST',
            header: { "Content-Type": "application/x-www-form-urlencoded" },
            success: function (res) {
                if (res.data.success) {
                    let DataList = res.data.body.DataList;
                    if (DataList.length) {
                        that.setData({
                            majorArray: DataList
                        })
                    } else {
                        majorArray:[]
                    }
                }
            },
            data: {
                'institutionId': that.data.institutionid,
                'addressId': that.data.schoolid
            }
        })
    },
    //选择专业
    chooseMajor: function(e) {
        var majorArrayTotal = this.data.majorArrayTotal;
        var checkArr = e.detail.value;
        this.setData({
            selectMajor: []
        })
        for (var i = 0; i < majorArrayTotal.length; i++) {
            if (checkArr.indexOf(i + "") != -1) {
                majorArrayTotal[i].checked = true;
                this.setData({
                    selectMajor: this.data.selectMajor.concat(majorArrayTotal[i].code)
                })
            } else {
                majorArrayTotal[i].checked = false;
            }
        }
        console.log(this.data.selectMajor);
        if (this.data.selectMajor.length) {
            for (var j = 0; j < this.data.selectMajor.length; j++) {
                this.setData({
                    majorCodes: this.data.selectMajor.join(",")
                })
            }
        }
        console.log(this.data.majorCodes);
        this.setData({
            majorArrayTotal: majorArrayTotal
        })  
    },
    //保存专业
    closeMajor: function () {
        let that = this;
        wx.request({
            url: path.serverPath + path.path + 'artmap/addAddressMajor', //仅为示例，并非真实的接口地址
            method: 'POST',
            header: { "Content-Type": "application/x-www-form-urlencoded" },
            success: function (res) {
                if (res.data.success) {
                    console.log(res);
                    wx.showToast({
                        title: res.data.msg,
                        icon: "success",
                        duration: 3000
                    });
                    that.setData({
                        showMajor: false
                    })
                    that.major();
                } else {
                    wx.showToast({
                        title: res.data.msg,
                        icon: "error",
                        duration: 3000
                    });
                }
            },
            data: {
                'token': that.data.token,
                'addressId': that.data.schoolid,
                'majorCodes': that.data.majorCodes
            }
        })
    },
    closeMajor2:function() {
        this.setData({
            showMajor: false
        })
    },
    //删除专业
    deleteMajor:function(e) {
        let id = e.currentTarget.dataset.id;
        let that = this;
        wx.request({
            url: path.serverPath + path.path + 'artmap/deleteAddressMajor', //仅为示例，并非真实的接口地址
            method: 'POST',
            header: { "Content-Type": "application/x-www-form-urlencoded" },
            success: function (res) {
                if (res.data.success) {
                    console.log(res);
                    wx.showToast({
                        title: res.data.msg,
                        icon: "success",
                        duration: 3000
                    });
                    that.major();
                } else {
                    wx.showToast({
                        title: res.data.msg,
                        icon: "error",
                        duration: 3000
                    });
                }
            },
            data: {
                'token': that.data.token,
                'addressId': that.data.schoolid,
                'id': id
            }
        })
    },
    //获取小黑板
    blackboard: function (institutionId, addressId) {
        let that = this;
        wx.request({
            url: path.serverPath + path.path + 'artmap/selectBlackboardByAddressId', //仅为示例，并非真实的接口地址
            method: 'POST',
            header: { "Content-Type": "application/x-www-form-urlencoded" },
            success: function (res) {
                if (res.data.success) {
                    //console.log(res);
                    let DataList = res.data.body.DataList;
                    if (DataList.length) {
                        that.setData({
                            content: DataList[0].desc1,
                            time: path.translateTime2(DataList[0].createTime)
                        })
                    } else {
                        that.setData({
                            content: "暂无小黑板信息",
                            time: ''
                        })
                    }
                }
            },
            data: {
                'institutionId': that.data.institutionid,
                'addressId': that.data.schoolid
            }
        })
    },
    //编辑小黑板详情
    editBoard:function() {
        wx.navigateTo({
            url: '../editboard/editboard?institutionid=' + this.data.institutionid + "&schoolid=" + this.data.schoolid
        })
    },
    //获取教学成果列表
    teaList: function (institutionId, addressId) {
        let that = this;
        wx.request({
            url: path.serverPath + path.path + 'artmap/selectAddressTeachResultList', //仅为示例，并非真实的接口地址
            method: 'POST',
            header: { "Content-Type": "application/x-www-form-urlencoded" },
            success: function (res) {
                if (res.data.success) {
                    let DataList = res.data.body.DataList;
                    if (DataList.length) {
                        if (DataList.length > 2 ) {
                            for (var i = 0; i < 2; i++) {
                                that.setData({
                                    teaArray: that.data.teaArray.concat(DataList[i])
                                })
                            }
                        } else {
                            that.setData({
                                teaArray: DataList
                            })
                        }
                    } else {

                    }
                }
            },
            data: {
                'institutionId': that.data.institutionid,
                'addressId': that.data.schoolid,
                'pageNum': 1,
                'pageSize': 1000
            }
        })
    },
    //添加教学成果
    addtea:function() {
        wx.navigateTo({
            url: '../uploadtea/uploadtea?schoolid=' + this.data.schoolid+"&token="+this.data.token
        })
    },
    //查看更多教学成果事件
    lookMore:function() {
        wx.navigateTo({
            url: '../videolist/videolist?institutionid=' + this.data.institutionid + "&schoolid=" + this.data.schoolid
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
    }
})