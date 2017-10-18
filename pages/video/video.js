var app = getApp();
Page({
    data:{
        src:''
    },
    onLoad: function (options) {
        console.log(options)
        var videoPath = options.videoPath;
        var poster = options.poster;
        // console.log(videoPath);
        // console.log(poster);
        this.setData({
            src: videoPath
        })
    }
})  
