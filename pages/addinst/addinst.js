var path = require('../../utils/util.js');
var tcity = require("../../utils/citys.js");
var app = getApp()
Page({
    data: {
        provinces: [],
        province: "",
        citys: [],
        city: "",
        countys: [],
        county: '',
        value: [0, 0, 0],
        values: [0, 0, 0],
        condition: false,
        show: false,
        url: "http://artapp-dev-bucket.oss-cn-beijing.aliyuncs.com/",
        showPic: false,
        direction:"right",
        direction2: "right",
        direction3: "right",
        direction4: "right",
        direction5: "right",
        directionA: "right",
        placeholder:'请输入5-30个字符',
        placeholder2: '请输入校长姓名',
        placeholder3: '请输入街道详细地址，5-50个字符',
        placeholder4: '输入负责人电话',
        placeholder5: '请输入招生咨询电话',
        placeholder6: '请输入校区简介，500个字符以内',
        picPath:'',
        institutionName:'',
        userName:'',
        address:'',
        mobile:'',
        phone:'',
        schoolIntro:'',
        thumb:''
        
    },
    //选择城市改变值事件
    bindChange: function (e) {
        //console.log(e);
        var val = e.detail.value
        var t = this.data.values;
        var cityData = this.data.cityData;
        if (val[0] != t[0]) {
            console.log('province no ');
            const citys = [];
            const countys = [];
            for (let i = 0; i < cityData[val[0]].sub.length; i++) {
                citys.push(cityData[val[0]].sub[i].name)
            }
            for (let i = 0; i < cityData[val[0]].sub[0].sub.length; i++) {
                countys.push(cityData[val[0]].sub[0].sub[i].name)
            }
            this.setData({
                province: this.data.provinces[val[0]],
                city: cityData[val[0]].sub[0].name,
                citys: citys,
                county: cityData[val[0]].sub[0].sub[0].name,
                countys: countys,
                values: val,
                value: [val[0], 0, 0]
            })
            return;
        }
        if (val[1] != t[1]) {
            console.log('city no');
            const countys = [];

            for (let i = 0; i < cityData[val[0]].sub[val[1]].sub.length; i++) {
                countys.push(cityData[val[0]].sub[val[1]].sub[i].name)
            }
            this.setData({
                city: this.data.citys[val[1]],
                county: cityData[val[0]].sub[val[1]].sub[0].name,
                countys: countys,
                values: val,
                value: [val[0], val[1], 0]
            })
            return;
        }
        if (val[2] != t[2]) {
            console.log('county no');
            this.setData({
                county: this.data.countys[val[2]],
                values: val
            })
            return;
        }
    },
    //点击弹出选择项事件
    open: function () {
        this.setData({
            condition: !this.data.condition,
            directionA: "left"
        })
    },
    onLoad: function () {
        console.log("onLoad");
        var that = this;
        tcity.init(that);
        var cityData = that.data.cityData;
        const provinces = [];
        const citys = [];
        const countys = [];
        for (let i = 0; i < cityData.length; i++) {
            provinces.push(cityData[i].name);
        }
        console.log('省份完成');
        for (let i = 0; i < cityData[0].sub.length; i++) {
            citys.push(cityData[0].sub[i].name)
        }
        console.log('city完成');
        for (let i = 0; i < cityData[0].sub[0].sub.length; i++) {
            countys.push(cityData[0].sub[0].sub[i].name)
        }
        that.setData({
            'provinces': provinces,
            'citys': citys,
            'countys': countys,
            'province': cityData[0].name,
            'city': cityData[0].sub[0].name,
            'county': cityData[0].sub[0].sub[0].name
        })
        console.log('初始化完成');
    },
    //获取input的value事件
    institutionNameInput:function(e) {
        this.setData({
            institutionName: e.detail.value
        })
    },
    userNameInput: function (e) {
        this.setData({
            userName: e.detail.value
        })
    },
    addressInput: function (e) {
        this.setData({
            address: e.detail.value
        })
    },
    mobileInput: function (e) {
        this.setData({
            mobile: e.detail.value
        })
    },
    phoneInput: function (e) {
        this.setData({
            phone: e.detail.value
        })
    },
    schoolIntroInput: function (e) {
        this.setData({
            schoolIntro: e.detail.value
        })
    },
    //获取input的focus事件
    institutionNameFocus: function (e) {
        this.setData({
            direction:"left",
            placeholder: ""
        })
    },
    userNameFocus: function (e) {
        this.setData({
            direction2: "left",
            placeholder2: ""
        })
    },
    addressFocus: function (e) {
        this.setData({
            direction3: "left",
            placeholder3: ""
        })
    },
    mobileFocus: function (e) {
        this.setData({
            direction4: "left",
            placeholder4: ""
        })
    },
    phoneFocus: function (e) {
        this.setData({
            direction5: "left",
            placeholder5: ""
        })
    },
    schoolIntroFocus: function (e) {
        this.setData({
            placeholder6: ""
        })
    },
    //手机号码失去焦点验证事件
    mobileBlur:function() {
        let regMobile = /^0?1[3|4|5|7|8][0-9]\d{8}$/;
        if (!regMobile.test(this.data.mobile)) {
            wx.showModal({
                title: 'artapp提示',
                content: '请输入正确的手机号码',
                showCancel: false,
                success: function (res) {
                    if (res.confirm) {
                        console.log('用户点击确定')
                    }
                }
            })
            return;
        }
    },
    //上传图片事件
    uploadImage:function() {
        let that = this;
        wx.chooseImage({
            count: 1, // 默认9
            sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            success: function (res) {
                // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
                var tempFilePaths = res.tempFilePaths
                wx.uploadFile({
                    url: path.serverPath + path.path + 'userAddress/uploadThumbToOSS', //仅为示例，非真实的接口地址
                    filePath: tempFilePaths[0],
                    name: 'thumb',
                    success: function (res) {
                        console.log(res);
                        var thumbPath = JSON.parse(res.data).body.thumbPath;
                        that.setData({
                            thumb: thumbPath,
                            showPic: true,
                            picPath: that.data.url + thumbPath
                        })
                    }
                })
            }
        })
    },
    //保存信息事件
    save:function() {
        let that = this;
        let regMobile = /^0?1[3|4|5|7|8][0-9]\d{8}$/;
        if (!that.data.institutionName) {
            wx.showModal({
                title: 'artapp提示',
                content: '请输入校区名称',
                showCancel: false,
                success: function (res) {
                    if (res.confirm) {
                        console.log('用户点击确定')
                    }
                }
            })
            return;
        }
        if (!that.data.userName) {
            wx.showModal({
                title: 'artapp提示',
                content: '请输入校长姓名',
                showCancel: false,
                success: function (res) {
                    if (res.confirm) {
                        console.log('用户点击确定')
                    }
                }
            })
            return;
        }
        if (!that.data.address) {
            wx.showModal({
                title: 'artapp提示',
                content: '请输入街道信息',
                showCancel: false,
                success: function (res) {
                    if (res.confirm) {
                        console.log('用户点击确定')
                    }
                }
            })
            return;
        }
        if (!that.data.schoolIntro) {
            wx.showModal({
                title: 'artapp提示',
                content: '请输入校区简介',
                showCancel: false,
                success: function (res) {
                    if (res.confirm) {
                        console.log('用户点击确定')
                    }
                }
            })
            return;
        }
        if (!that.data.mobile) {
            wx.showModal({
                title: 'artapp提示',
                content: '请输入手机号码',
                showCancel: false,
                success: function (res) {
                    if (res.confirm) {
                        console.log('用户点击确定')
                    }
                }
            })
            return;
        } else if (!regMobile.test(that.data.mobile)){
            wx.showModal({
                title: 'artapp提示',
                content: '请输入正确的手机号码',
                showCancel: false,
                success: function (res) {
                    if (res.confirm) {
                        console.log('用户点击确定')
                    }
                }
            })
            return;
        }
        wx.request({
            url: path.serverPath + path.path + 'institution/addInstInfoAll', //仅为示例，并非真实的接口地址
            method: 'POST',
            header: { "Content-Type": "application/x-www-form-urlencoded" },
            success: function (res) {
                if (res.data.success) {
                    console.log(res);
                    wx.navigateTo({
                        url: '../map/map'
                    })
                } else {
                    wx.showModal({
                        title: 'artapp提示',
                        content: res.data.msg,
                        showCancel: false,
                        success: function (res) {
                            if (res.confirm) {
                                console.log('用户点击确定')
                            }
                        }
                    })
                }
            },
            data: {
                'institutionName': that.data.institutionName,
                'userName': that.data.userName,
                'mobile': that.data.mobile,
                'introduction': that.data.schoolIntro,
                'province': that.data.province,
                'city': that.data.city,
                'area': that.data.county,
                'address': that.data.address,
                'phone': that.data.phone,
                'thumb': that.data.thumb,
                'versionCode': 'Free'
            }
        })
    }
})
