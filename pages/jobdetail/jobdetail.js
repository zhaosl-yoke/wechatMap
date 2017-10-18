// pages/jobdetail/jobdetail.js
var path = require('../../utils/util.js');
Page({
    data: {
        institutionid: '',
        schoolid: '',
        id: '',
        job_name:'',
        address:'',
        age:'',
        job_type:'',
        education:'',
        phone: '',
        sex:'',
        show: false,
        imgPath:''
    },
    onLoad: function (options) {
        var that = this
           that.setData({
                institutionid: options.institutionid,
                schoolid: options.schoolid,
                id: options.id
            })
        that.jobDetail();
    },
    //获取招聘信息详情事件
    jobDetail:function() {
        let that = this;
        wx.request({
            url: path.serverPath + path.path + 'artmap/selectAddressJobById',
            method: 'POST',
            header: { "Content-Type": "application/x-www-form-urlencoded" },
            success: function (res) {
                console.log(res);
                if (res.data.success) {
                    let job = res.data.body.job;
                    that.setData({
                        job_name: job.name,
                        address: job.address,
                        age: job.workAgeDesc,
                        education: job.educationDesc,
                        job_type: job.workType == 0 ? "不限" : workType == 1 ? "兼职" : "全职",
                        phone: job.phone,
                        sex: job.sex
                    })
                    console.log(that.data.sex)
                    if (that.data.sex != 0) {
                        that.setData({
                            show: true
                        })
                        if (that.data.sex == 1) {
                            that.setData({
                                imgPath: '../../image/men.png'
                            })
                        } 
                        if (that.data.sex == 2) {
                            that.setData({
                                imgPath: '../../image/women.png'
                            })
                        }
                    }
                    console.log(that.data.imgPath)
                }
            },
            data: {
                institutionId: that.data.institutionid,
                addressId: that.data.schoolid,
                id: that.data.id
            },
        })
    },
    //拨打电话事件
    call:function() {
        wx.makePhoneCall({
            phoneNumber: this.data.phone,
            success: function (data) {
                console.log(data)
            }
        })
    }
 
})