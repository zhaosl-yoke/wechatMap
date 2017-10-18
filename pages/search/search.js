// pages/serach/serach.js
var path = require('../../utils/util.js')
Page({
    data: {
        value:'',
        schoolArray: [],
        show: false
    },
    onLoad: function (options) {
    
    },
    //生成列表事件
    getSchoolMarkers(addressId, majorCode, addressDesc, orderType) {
        let that = this;
        wx.request({
            url: path.serverPath + path.path + 'userAddress/selectAllUserAddressDetailList2', //仅为示例，并非真实的接口地址
            method: 'POST',
            header: { "Content-Type": "application/x-www-form-urlencoded" },
            success: function (res) {
                //console.log(res.data.body);
                let DataList = res.data.body.DataList;
                if (DataList.length) {
                    that.setData({
                        schoolArray: DataList
                    })
                } else {
                    that.setData({
                        show: true
                    })
                }
            },
            data: {
                "addressId": addressId,
                "majorCode": majorCode,
                "addressDesc": addressDesc,
                "orderType": orderType
            }
        })
    },
    valueInput:function(e) {
        this.setData({
            value: e.detail.value
        })
    },
    search:function() {
        this.getSchoolMarkers("", "", this.data.value, 1);
    },
    toMap: function(e) {
        let id = e.currentTarget.dataset.id;
        let lat = e.currentTarget.dataset.lat;
        let lng = e.currentTarget.dataset.lng;
        wx.navigateTo({
            url:'../map/map?id='+id+"&lat="+lat+"&lng="+lng
        })
    }
})