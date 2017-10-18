var path = require('../../utils/util.js')
Page({
  data: {
    markers: [],
    inputVal:"",
    show: false,
    majorArray:[],
    listArray:[],
    phone:"无",
    gif: true,
    animationData: {},
    major1:'',
    major2:'',
    major3:'',
    centerX:'',
    centerY:'',
    latitude:'',
    longitude:'',
    currentItemCode:'',
    currentItemCode2: '',
    dataCode1:'',
    dataCode2: '',
    dataCode3: '',
    majorName:'全部',
    controls: [{
        id: 1,
        iconPath: '/../image/position.png',
        position: {
            left: 10,
            top: 500 -30,
            width: 32,
            height: 32
        },
        clickable: true
    }],
    showText:"登录",
    token:'',
    url:"http://artapp-dev-bucket.oss-cn-beijing.aliyuncs.com/",
    Full:"Full",
    Lite: "Lite",
    m:"m",
    km:"km",
    showPrompt:false,
    id:1,
    id2:'',
    instId:''
  },
  onLoad: function (options) {
    let that = this;
    console.log('地图定位！');
    that.getMajor();
    that.setData({
        instId: options.id
    })
    wx.getLocation({
        type: 'wgs84', //返回可以用于wx.openLocation的经纬度
        success: (res) => {
            console.log(res);
            that.setData({
                latitude: res.latitude,
                longitude: res.longitude
            })
            if (that.data.instId) {
                that.getSchoolList(res.latitude, res.longitude, that.data.instId, '', '', 1);
            } else {
                that.getSchoolList(res.latitude, res.longitude, '', '', '', 1);
            }
            
        }
    });
    //获取本地token
    wx.getStorage({
        key: 'token',
        success: function (res) {
            console.log(res.data);
            that.setData({
                token: res.data
            })
            wx.request({
                url: path.serverPath + path.path + 'artmap/checkToken', //仅为示例，并非真实的接口地址
                method: 'POST',
                header: { "Content-Type": "application/x-www-form-urlencoded" },
                success: function (res) {
                    if (res.data.success) {
                        that.setData({
                            showText: "我的机构"
                        })
                    }
                },
                data: {
                    "token": res.data
                }
            })
        }
    })
  },
  //点击登录事件 
  login() {
      if (this.data.showText == "登录") {
          wx.navigateTo({
              url: '../login/login'
          })
      } else if (this.data.showText == "我的机构") {
          wx.navigateTo({
              url: '../instdetailedit/instdetailedit?token=' + this.data.token
          })
      }
  },
  //添加机构事件
  register() {
    wx.navigateTo({
      url: '../register/register'
    })
  },
  //导航事件
  moveTo(event) {
    console.log(event.currentTarget.dataset.item);
    let item = event.currentTarget.dataset.item;
    wx.openLocation({
      latitude: Number(item.latitude),
      longitude: Number(item.longitude)
    })  
  },
  //打电话事件
  callPhone(event) {
    console.log(event.currentTarget.dataset.item);
    let phone = event.currentTarget.dataset.phone;
    if (phone) {
      wx.makePhoneCall({
        phoneNumber: phone + "" //仅为示例，并非真实的电话号码
      })
    }
  },
  //查看详情事件
  detail(e) {
        let dataset = e.currentTarget.dataset;
        let institutionid = dataset.institutionid;
        let schoolid = dataset.schoolid;
        wx.navigateTo({
            url: '../instdetail/instdetail?institutionid=' + institutionid + "&schoolid=" + schoolid
        })
  },
  //清除input事件
  clearInput(e) {
    this.setData({
      inputVal: ""
    })
  },
  regionchange(e) {
    console.log(e.type)
  },
  markertap(e) {
    console.log(e.target)
  },
  //生成列表事件
  getSchoolList(lat,lng,addressId, majorCode, addressDesc,orderType) {
    let that = this;
    wx.showToast({
        title: "加载中",
        icon: "loading",
        duration: 3000
    }); 
    wx.request({
        url: path.serverPath + path.path +'userAddress/selectAllUserAddressDetailList', //仅为示例，并非真实的接口地址
        method: 'POST',
        header: { "Content-Type": "application/x-www-form-urlencoded" },
        success: function (res) {
            console.log(res.data.body);
            let DataList = res.data.body.DataList;
            if (DataList.length) {
                that.setData({
                    listArray: res.data.body.DataList
                })
            } else {
                that.setData({
                    showPrompt: true
                })
            }
        },
        data:{
            "lat": lat,
            "lng": lng,
            "addressId": addressId,
            "majorCode": majorCode,
            "addressDesc": addressDesc,
            "orderType": orderType
        }
    })
  },
  //获取专业事件
  getMajor() {
      let that = this;
      wx.showToast({
          title: "加载中",
          icon: "loading",
          duration: 3000
      });  
      wx.request({
          url: path.serverPath + path.path  +'dictionary/getDictionaryInfo', //仅为示例，并非真实的接口地址
          method: 'POST',
          header: { "Content-Type": "application/x-www-form-urlencoded" },
          success: function (res) {
              //console.log(res.data.body);
              let listDictionarys = res.data.body.listDictionarys;
              that.setData({
                  major1: listDictionarys[0].codeName,
                  major2: listDictionarys[1].codeName,
                  major3: listDictionarys[2].codeName,
                  majorCode1: listDictionarys[0].code,
                  majorCode2: listDictionarys[1].code,
                  majorCode3: listDictionarys[2].code,
                  majorArray: listDictionarys
              })
          },
          data: {
              "typeId": "01"
          }
      })
  },
  //显示专业
  showMajor:function() {
    this.setData({
        show: true
    })
  },
  //关闭专业弹窗
  closeMajor:function() {
      this.setData({
          show: false
      })
  },
  //选择专业
  chooseMajor(e) {
      //console.log(e.currentTarget.dataset.code)
      //console.log(this)
      this.getSchoolList(this.data.latitude, this.data.longitude,'', e.currentTarget.dataset.code, '', 1);
      this.setData({
          currentItemCode: e.currentTarget.dataset.code,
          show: false,
          majorName: e.currentTarget.dataset.name,
          currentItemCode2: 0
      })  
  },
  //选择专业2
  major1:function(e) {
      //console.log(this.data.majorName);
      this.getSchoolList(this.data.latitude, this.data.longitude, '', e.currentTarget.dataset.code, '', 1);
        this.setData({
            currentItemCode2: e.currentTarget.dataset.code,
            majorName: "全部",
            currentItemCode: 0
        })  
  },
  major2: function (e) {
      this.getSchoolList(this.data.latitude, this.data.longitude, '', e.currentTarget.dataset.code, '', 1);
      this.setData({
          currentItemCode2: e.currentTarget.dataset.code
      })  
  },
  major3: function (e) {
      this.getSchoolList(this.data.latitude, this.data.longitude, '', e.currentTarget.dataset.code, '', 1);
      this.setData({
          currentItemCode2: e.currentTarget.dataset.code
      })  
  },
  //按视频数量排序
  mount:function(e) {
      this.setData({
          id: e.currentTarget.dataset.id
      })
      this.getSchoolList(this.data.latitude, this.data.longitude, '', '', '', 1);
  },
  //按距离排序
  distance: function (e) {
      this.setData({
          id: e.currentTarget.dataset.id
      })
      this.getSchoolList(this.data.latitude, this.data.longitude, '', '', '', 2);
  },
  //查看地图事件
  map:function() {
      wx.navigateTo({
          url: '../map/map'
      })
  },
  //定位后移动中心事件
  moveToLocation: function () {
    this.mapCtx.moveToLocation()
  },
  createMarker(point) {
    let latitude = point.lat;
    let longitude = point.lng;
    let totalName = point.institutionName + '(' + point.addressDesc+')';
    let majorName = point.majorName ? point.majorName : "暂无专业信息";
    let address = point.province + point.city + point.area + point.address;
    //截取机构校区名称
    if (totalName.length > 10) {
        totalName = totalName.substring(0, 10) + '...';
    } else {
        totalName = totalName;
    }
    //截取地址
    if (address.length > 10) {
        address = address.substring(0, 10) + '...';
    } else {
        address = address;
    }
    //截取专业
    let marker = {
      iconPath: "../../image/location.png",
      id: point.id || 0,
      name: point.name || '',
      latitude: latitude,
      longitude: longitude,
      width: 29,
      height: 39,
      callout:{
        content: totalName + '<br/>' + (majorName.split(',',3)) + "&nbsp;|&nbsp;" + address,
        color:"#333",
        fontSize:"14",
        borderRadius:"10",
        bgColor:"#fff",
        padding:10,
        display:"BYCLICK"
      }
    };
    return marker;
  }
})