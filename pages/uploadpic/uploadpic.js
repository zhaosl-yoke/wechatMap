
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
        picPath: '',
        duration: '',
        show: false,
        url: "http://artapp-dev-bucket.oss-cn-beijing.aliyuncs.com/",
        token: '3ec794cb-d02d-4c9b-99fa-8c85d3b02c99',
        schoolid: 638
    },
    onLoad: function (options) {

    },
    //上传文件
    uploadFile: function () {
        let that = this;
        wx.chooseImage({
            count: 1, // 默认9
            sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            success: function (res) {
                // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
                var tempFilePaths = res.tempFilePaths
                wx.uploadFile({
                    url: path.serverPath + path.path + 'artmap/saveTeachResultFileToOSS', //仅为示例，非真实的接口地址
                    filePath: tempFilePaths[0],
                    name: 'teachResultMedia',
                    success: function (res) {
                        console.log(res);
                        let data = JSON.parse(res.data);
                        if (data.success) {
                            let teachResult = JSON.parse(res.data).body.teachResult;
                            console.log(teachResult)
                            that.setData({
                                catalog: teachResult.catalog,
                                extension: teachResult.extension,
                                filename: teachResult.filename,
                                minetype: teachResult.minetype,
                                duration: teachResult.duration,
                                thumb: teachResult.thumb,
                                picPath: that.data.url + teachResult.catalog + '/' + teachResult.filename + '.' + teachResult.extension
                            })
                            if (that.data.picPath) {
                                that.setData({
                                    show: true
                                })
                            }
                        }
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