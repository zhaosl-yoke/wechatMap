// pages/lookpic/lookpic.js
var path = require('../../utils/util.js');
Page({
    data: {
        id: '',
        videoUrl: '',
        thumb:'',
        url: "http://artapp-dev-bucket.oss-cn-beijing.aliyuncs.com/",
    },
    onLoad: function (options) {
        let that = this;
        that.setData({
            id: options.id        
        })
        console.log(that.data.id);
        that.pic();
    },
    //获取图片路径
    pic: function () {
        let that = this;
        wx.request({
            url: path.serverPath + path.path + 'artmap/selectAddressTeachResultById', //仅为示例，并非真实的接口地址
            method: 'POST',
            header: { "Content-Type": "application/x-www-form-urlencoded" },
            success: function (res) {
                console.log(res);
                if (res.data.success) {
                    let teachResult = res.data.body.teachResult;
                    let filename = teachResult.filename;
                    let catalog = teachResult.catalog;
                    let extension = teachResult.extension;
                    let thumb = teachResult.thumb;
                    that.setData({
                        videoUrl: that.data.url + catalog + '/' + filename + '.' + extension,
                        thumb: that.data.url + thumb
                    })
                }
            },
            data: {
                'id': that.data.id
            }
        })
    }

})