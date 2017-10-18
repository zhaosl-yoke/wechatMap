// pages/login/login.js
var path = require('../../utils/util.js');
var md5 = require('../../utils/md5.js');
//倒计时
var countdown = 60;
var settime = function (that) {
    if (countdown == 0) {
        that.setData({
            is_show: true
        })
        countdown = 60;
        return;
    } else {
        that.setData({
            is_show: false,
            last_time: countdown
        })

        countdown--;
    }
    setTimeout(function () {
        settime(that)
    },1000)
}

Page({
    data: {
        mobile: '',
        code: '',
        receive_code:'',
        psd:'',
        red: "#f89e93",
        last_time: '',
        is_show: true,
        psd_type:"password",
        toggle: false
    },
    onLoad: function (options) {
       
    },
    mobileInput: function (e) {
        this.setData({
            mobile: e.detail.value
        })
    },
    codeInput: function (e) {
        this.setData({
            code: e.detail.value
        })
    },
    psdInput: function (e) {
        this.setData({
            psd: e.detail.value
        })
    },
    //用户输入失去焦点
    mobileBlur: function () {
        console.log(this.data.userValue)
        let regMobile = /^0?1[3|4|5|7|8][0-9]\d{8}$/;
        if (this.data.mobile == "") {
            wx.showModal({
                title: 'artapp提示',
                content: '请输入电话号码',
                showCancel: false,
                success: function (res) {
                    if (res.confirm) {
                        console.log('用户点击确定')
                    }
                }
            })
        } else {
            if (!regMobile.test(this.data.mobile)) {
                wx.showModal({
                    title: 'artapp提示',
                    content: '请输入正确的电话号码',
                    showCancel: false,
                    success: function (res) {
                        if (res.confirm) {
                            console.log('用户点击确定')
                        }
                    }
                })
            } else {
                this.setData({
                    red: "#f44a33"
                })
            }
        }
    },
    //获取验证码事件
    receiveCode:function() {
        let that = this;
        if (this.data.mobile == "") {
            wx.showModal({
                title: 'artapp提示',
                content: '请输入电话号码',
                showCancel: false,
                success: function (res) {
                    if (res.confirm) {
                        console.log('用户点击确定')
                    }
                }
            })
        } else {
            // 将获取验证码按钮隐藏60s，60s后再次显示
            that.setData({
                is_show: (!that.data.is_show)  //false
            })
            settime(that);
            wx.request({
                url: path.serverPath + path.path + 'user/SendMobileSMS', //仅为示例，并非真实的接口地址
                method: 'POST',
                header: { "Content-Type": "application/x-www-form-urlencoded" },
                success: function (res) {
                    console.log(res.data.body.Code);
                    if (res.data.success) {
                        that.setData({
                            receive_code: res.data.body.Code
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
                    "mobile": this.data.mobile,
                    "type": 2
                }
            })
        }
    },
    //查看密码事件
    lookPsd:function() {
        let value = !this.data.toggle;
        this.setData({
            toggle: value,
            psd_type: "password"
        })
        if (value) {
            this.setData({
                psd_type: "text"
            })  
        }
    },
    //确定事件
    confirm: function () {
        if (this.data.psd == "") {
            wx.showModal({
                title: 'artapp提示',
                content: '请输入密码',
                showCancel: false,
                success: function (res) {
                    if (res.confirm) {
                        console.log('用户点击确定')
                    }
                }
            })
        } else {
            wx.request({
                url: path.serverPath + path.path + 'user/forgetPassword', //仅为示例，并非真实的接口地址
                method: 'POST',
                header: { "Content-Type": "application/x-www-form-urlencoded" },
                success: function (res) {
                    console.log(res);
                    if (res.data.success) {
                        wx.showToast({
                            title: res.data.msg,
                            icon: 'success',
                            duration: 3000,
                        })
                        wx.navigateTo({
                            url: '../login/login',
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
                    "mobile": this.data.mobile,
                    "code": this.data.code,
                    "newPassword": md5.hex_md5(this.data.psd)
                }
            })
        }
    },
    //忘记密码事件
    forget: function () {
        wx.navigateTo({
            url: '../restpsd/restpsd'
        })
    }
})