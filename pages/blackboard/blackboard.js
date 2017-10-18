// pages/blackboard/blackboard.js
var path = require('../../utils/util.js');
Page({
    data: {
        institutionid:'',
        schoolid:'',
        link:'',
        content:''
    },
    onLoad: function (options) {
        this.setData({
            institutionid: options.institutionid,
            schoolid: options.schoolid 
        })
        this.blackboardInfo();
    },
    //查询小黑板信息
    blackboardInfo:function() {
        let that = this;
        wx.request({
            url: path.serverPath + path.path + 'artmap/selectBlackboardByAddressId', //仅为示例，并非真实的接口地址
            method: 'POST',
            header: { "Content-Type": "application/x-www-form-urlencoded" },
            success: function (res) {
                console.log(res);
                if (res.data.success) {
                    let DataList = res.data.body.DataList;
                    let content = DataList[0].desc1;
                    let link = DataList[0].link;
                   that.setData({
                       content: content,
                       link: link
                   })
                }
            },
            data: {
                'institutionId': that.data.institutionid,
                'addressId': that.data.schoolid
            }
        })
    }
})