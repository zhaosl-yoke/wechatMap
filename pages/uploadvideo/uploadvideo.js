// pages/uploadtea/uploadtea.js
var path = require('../../utils/util.js');
Page({
    data: {
        flag: false,
        title: '',
        catalog: '',
        filename: '',
        extension: '',
        minetype: '',
        thumb: '',
        duration: '',
        array: ['视频', '图片'],
        index: '',
        token: '1eef6305-31ba-4a64-ada5-5ed8ca38be9d',
        schoolid: 638,
        show: false,
        thumbPath: '',
        url: "http://artapp-dev-bucket.oss-cn-beijing.aliyuncs.com/",
        src: '',
        institutionid: 404
    },
    onLoad: function (options) {
        // this.setData({
        //   token: options.token,
        //   schoolid: options.schoolid,
        //     institutionid: option.institutionid
        // })
    },
    bindPickerChange: function (e) {
        console.log('picker发送选择改变，携带值为', e.detail.value);
        if (e.detail.value == 0) {
            wx.navigateTo({
                url: '../map/map'
            })
        }
        this.setData({
            index: e.detail.value
        })
    },
    //上传文件
    uploadFile: function () {
        let that = this;
        wx.chooseVideo({
            sourceType: ['album', 'camera'],
            maxDuration: 60,
            success: function (res) {
                console.log(res);
                // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
                var tempFilePath = res.tempFilePath
                wx.uploadFile({
                    url: path.serverPath + path.path + 'artmap/saveTeachResultFileToOSS', //仅为示例，非真实的接口地址
                    filePath: tempFilePath,
                    name: 'teachResultMedia',
                    success: function (res) {
                        console.log(res);
                        let data = JSON.parse(res.data);
                        let body = JSON.parse(res.data).body;
                        console.log(data.success);
                        console.log(body)
                        if (data.success) {
                            var teachResult = body.teachResult;
                            that.setData({
                                catalog: teachResult.catalog,
                                extension: teachResult.extension,
                                filename: teachResult.filename,
                                minetype: teachResult.minetype,
                                duration: teachResult.duration,
                                thumb: teachResult.thumb,
                                thumbPath: that.data.url + teachResult.thumb,
                                src: that.data.url + teachResult.catalog + '/' + teachResult.filename + '.' + teachResult.extension
                            })
                            if (that.data.thumb) {
                                that.setData({
                                    show: true
                                })
                            }
                        } else {
                            wx.showModal({
                                title: 'artapp提示',
                                content: data.msg,
                                success: function (res) {
                                    if (res.confirm) {
                                        console.log('用户点击确定')
                                    }
                                }
                            })
                        }
                    },
                    fail: function (res) {
                        console.log(res);
                    }
                })
            }
        })
    },
    titleInput: function (e) {
        this.setData({
            title: e.detail.value
        })
    },
    publish: function () {
        let that = this;
        if (!that.data.title) {
            wx.showModal({
                title: 'artapp提示',
                content: '请输入标题',
                success: function (res) {
                    if (res.confirm) {
                        console.log('用户点击确定')
                    }
                }
            })
            return;
        }
        wx.request({
            url: path.serverPath + path.path + 'artmap/addTeachResult', //仅为示例，并非真实的接口地址
            method: 'POST',
            header: { "Content-Type": "application/x-www-form-urlencoded" },
            success: function (res) {
                console.log(res)
                if (res.data.success) {
                    wx.navigateTo({
                        url: '../instdetailedit/instdetailedit?token=' + that.data.token + "&institutionid=" + that.data.institutionid + "&schoolid=" + that.data.schoolid
                    })
                }
            },
            data: {
                'token': that.data.token,
                'addressId': that.data.schoolid,
                'title': that.data.title,
                'catalog': that.data.catalog,
                'filename': that.data.filename,
                'extension': that.data.extension,
                'minetype': that.data.minetype,
                'thumb': that.data.thumb,
                'duration': that.data.duration
            }
        })
    }
})