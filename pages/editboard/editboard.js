// pages/blackboard/blackboard.js
var path = require('../../utils/util.js');
Page({
    data: {
        institutionid: '',
        schoolid: '',
        link: '',
        content: '',
        contentValue:'',
        linkValue:'',
        token:''
    },
    onLoad: function (options) {
        let that = this;
        that.setData({
            institutionid: options.institutionid,
            schoolid: options.schoolid 
        })
        that.blackboardInfo();
        wx.getStorage({
            key: 'token',
            success: function (res) {
                console.log(res.data)
                that.setData({
                    token: res.data
                })
            }
        })
    },
    //查询小黑板信息
    blackboardInfo: function () {
        let that = this;
        wx.request({
            url: path.serverPath + path.path + 'artmap/selectBlackboardByAddressId', //仅为示例，并非真实的接口地址
            method: 'POST',
            header: { "Content-Type": "application/x-www-form-urlencoded" },
            success: function (res) {
                console.log(res);
                if (res.data.success) {
                    let DataList = res.data.body.DataList;
                    if (DataList.length) {
                        let content = DataList[0].desc1;
                        let link = DataList[0].link;
                        that.setData({
                            content: content,
                            link: link
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
    contentInput:function() {
        this.setData({
            contentValue: e.detail.value
        })
    },
    linkInput: function () {
        this.setData({
            linkValue: e.detail.value
        })
    },
    //保存事件
    save:function() {
        if (!this.data.content) {
            wx.showModal({
                title: 'artapp提示',
                content: '请输入小黑板内容',
                showCancel: false,
                success: function (res) {
                    if (res.confirm) {
                        console.log('用户点击确定')
                    }
                }
            })
            return;
        } else {
            let that = this;
            wx.request({
                url: path.serverPath + path.path + 'artmap/addBlackboard', //仅为示例，并非真实的接口地址
                method: 'POST',
                header: { "Content-Type": "application/x-www-form-urlencoded" },
                success: function (res) {
                    console.log(res);
                    if (res.data.success) {
                        // wx.showToast({
                        //     title: res.data.msg,
                        //     icon: "success",
                        //     duration: 3000
                        // });  
                        wx.navigateTo({
                            url: '../instdetailedit/instdetailedit'
                        })
                    }
                },
                data: {
                    'token': that.data.token,
                    'addressId': that.data.schoolid,
                    'content': (that.data.contentValue || that.data.content),
                    'link': (that.data.linkValue || that.data.link)
                }
            })
        }
    }
})