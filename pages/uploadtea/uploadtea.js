// pages/uploadtea/uploadtea.js
var path = require('../../utils/util.js');
Page({
    data: {
       flag: false,
       title:'',
       catalog:'',
       filename:'',
       extension:'',
       minetype:'',
       thumb:'',
       duration:'',
       array: ['视频','图片'],
       index:'',
       schoolid:'638',
       token:'dc826fe7-62ea-422b-995d-6913c48fd004'
    },
    onLoad: function (options) {
        // this.setData({
        //     token: options.token
        // })
    },
    bindPickerChange: function (e) {
        console.log('picker发送选择改变，携带值为', e.detail.value);
        if (e.detail.value == 0) {
            wx.navigateTo({
                url:'../uploadvideo/uploadvideo?token='+this.data.token
            })
        } else if (e.detail.value == 1){
            wx.navigateTo({
                url: '../uploadpic/uploadpic?token=' + this.data.token
            })
        }
    },
    //上传文件
    uploadFile: function () {
        // let that = this;
        // wx.chooseImage({
        //     count: 1, // 默认9
        //     sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
        //     sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
        //     success: function (res) {
        //         // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        //         var tempFilePaths = res.tempFilePaths
        //         wx.uploadFile({
        //             url: path.serverPath + path.path + 'artmap/saveTeachResultFileToOSS', //仅为示例，非真实的接口地址
        //             filePath: tempFilePaths[0],
        //             name: 'teachResultMedia',
        //             success: function (res) {
        //                 console.log(res);
        //                 // var thumbPath = JSON.parse(res.data).body.thumbPath;
        //                 // that.setData({
        //                 //     thumb: thumbPath,
        //                 //     showPic: true,
        //                 //     picPath: that.data.url + thumbPath
        //                 // })
        //             }
        //         })
        //     }
        // })
    },
    titleInput:function(e) {
        this.setData({
            title: e.detail.value
        })
    }
})