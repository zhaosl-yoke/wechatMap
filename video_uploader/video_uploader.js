'use strict';
const Promise = require('../utils/bluebird.js');
const wechat = require('../utils/wechat.js');
const util = require('../utils/util.js');

const defaultData = {
    _chooseVideo: 'chooseVideo',
    _previewVideo: 'previewVideo',
    // 这个方法可以用来设置选择好图片后的回调，但不成熟，先注释掉
    // setChooseImageCallback: 'setChooseImageCallback',
    imageUploadTitle: '上传视频',
    sourceType: ['camera', 'album'],
    sizeType: ['compressed'],
    maxCount: 9,
    uploadedVideosPaths: [],
    uploadParams: {
        url: '',
        name: 'file',
        formData: {}
    }
};

class VideoUploader {
    // 请确保 key 是唯一的，否则同一个页面内多个实例的数据和方法会互相覆盖
    constructor(pageContext, key = ''){
        let that = this;
        this.key = key;
        this.page = pageContext;
        this.data = this.page.data[key];

        this.data._chooseVideo = this.data._chooseVideo + key;
        this.data._previewVideo = this.data._previewVideo + key;
        // this.data.setChooseImageCallback = this.data.setChooseImageCallback + key;

        let uploadedVideosPaths = `${key}.uploadedVideosPaths`;
        this.page.setData({
            [key]: this.data,
            [uploadedVideosPaths]: [] // 为了在有默认图片时，点击 previewImage 生效
        });

        // 为了在有默认图片时，点击 previewImage 生效
        this.page.setData({
            [uploadedVideosPaths]: this.data.uploadedVideosPaths
        });


        this.page[this.data._chooseVideo] = this.chooseVideo.bind(this);
        this.page[this.data._previewVideo] = this.previewVideo.bind(this);
        // this.page[this.data.setChooseImageCallback] = this.setChooseImageCallback.bind(this);
        
    }

    chooseVideo() {
        let data = this.data;
        wechat.chooseVideo(data.sourceType, data.sizeType, data.maxCount).then(res => {
          this._chooseVideoCb(res);
        },e => {
            console.log(e);
        });
    }

    previewVideo(e) {
        let current = e.target.dataset.src;
        wx.previewVideo({
            current: current,
            urls: this.data.uploadedVideosPaths
        });
    }


    _chooseVideoCb(res){
      let filePath = res.tempFilePath;
        this._uploadVideo(res).then(res => {
            this._addToUploadedPaths(res, filePath);
        }, e => {
            console.log(e);
        });
    }

    _uploadVideo(res){
        let data = this.data;
        let filePath = res.tempFilePath;
        let uploadParams = data.uploadParams;
        let formData = Object.assign({}, uploadParams['formData'], {});

        console.info('为了演示效果，直接 resolve true ，真实使用时，请删除 return Promise.resolve(true);'); 
        return Promise.resolve(true);

        return wechat.uploadFile(uploadParams['url'],filePath,uploadParams['name'], formData);
    }

    _addToUploadedPaths(resp, filePath){
        if (this._isUploadSuccess(resp)) {
            this.data.uploadedVideosPaths.push(filePath);
            this.page.setData({
                [this.key]: this.data
            });
        }
        else {
            console.error(resp);
        }
    }
    _isUploadSuccess(resp){
        console.info('为了演示效果，直接 return true ，真实使用时，请写自己的判断逻辑'); 
        return true;
    }

}

VideoUploader.mergeData = function(data){
    return util.mergeDeep({}, defaultData, data);
};

module.exports = VideoUploader;

