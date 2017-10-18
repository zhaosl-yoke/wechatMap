var path = require('../../utils/util.js')
Page({
  data: {
    markers: [],
    inputVal:"",
    show: false,
    majorArray:[],
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
    instId: '',
    lat:'',
    lng:''
  },
  onLoad: function (options) {
    let that = this;
    console.log('地图定位！');
    that.getMajor();
    that.setData({
        instId: options.id,
        lat:options.lat,
        lng:options.lng
    })
    if (that.data.instId) {
        that.setData({
            centerX: that.data.lng,
            centerY: that.data.lat,
            latitude: that.data.lat,
            longitude: that.data.lng,
            markers: that.getSchoolMarkers(that.data.instId, '', '', 1)
        })
    } else {
        wx.getLocation({
            type: 'gcj02', //返回可以用于wx.openLocation的经纬度
            success: (res) => {
                let latitude = res.latitude;
                let longitude = res.longitude;
                //console.log(longitude);
                //let marker = that.createMarker(res);
                that.setData({
                    centerX: longitude,
                    centerY: latitude,
                    latitude: res.latitude,
                    longitude: res.longitude,
                    markers: that.getSchoolMarkers('', '', '', 1),
                })
            }
        });
    }
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
                            showText: "我的机构",
                        })
                    }
                },
                data: {
                    "token": res.data
                }
            })
        }
    })
    console.log(that.data.token);
  },
  //点击登录事件 
  login() {
      if (this.data.showText == "登录") {
          wx.navigateTo({
              url: '../login/login'
          })
      } else if (this.data.showText == "我的机构"){
          wx.navigateTo({
              url: '../instdetailedit/instdetailedit?token='+this.data.token
          })
      }
    
  },
  //搜索事件
  search: function() {
      wx.navigateTo({
          url: '../search/search'
      })
  },
  //列表查看事件
  showList() {
      if (this.data.instId) {
          wx.navigateTo({
              url: '../list/list?id='+this.data.instId
          })
      } else {
          wx.navigateTo({
              url: '../list/list'
          })
      }
    
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
  detail() {
    console.log(13)
    wx.navigateTo({
      url: '../scroll/scroll'
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
  //定位组件的点击事件
  controltap(e) {
    console.log(e.controlId)
    let that = this;
    //this.moveToLocation()
    wx.getLocation({
        type: 'gcj02', //返回可以用于wx.openLocation的经纬度
        success: (res) => {
            let latitude = res.latitude;
            let longitude = res.longitude;
            console.log(longitude);
            //let marker = that.createMarker(res);
            that.setData({
                centerX: longitude,
                centerY: latitude,
                latitude: res.latitude,
                longitude: res.longitude,
                markers: that.getSchoolMarkers('', '', '', 1),
            })
        }
    });
  },
  //生成marker事件
  getSchoolMarkers(addressId, majorCode, addressDesc,orderType) {
    let that = this;
    wx.request({
        url: path.serverPath + path.path +'userAddress/selectAllUserAddressDetailList2', //仅为示例，并非真实的接口地址
        method: 'POST',
        header: { "Content-Type": "application/x-www-form-urlencoded" },
        success: function (res) {
            //console.log(res.data.body);
            let DataList = res.data.body.DataList;
            let markers = [];
            for (let item of DataList) {
                let marker = that.createMarker(item);
                markers.push(marker)
            }
            that.setData({
                markers: markers
            })
            return markers;
        },
        data:{
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
      this.getSchoolMarkers('', e.currentTarget.dataset.code, '', 1);
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
        this.getSchoolMarkers('', e.currentTarget.dataset.code, '', 1);
        this.setData({
            currentItemCode2: e.currentTarget.dataset.code,
            majorName: "全部",
            currentItemCode: 0
        })  
  },
  major2: function (e) {
      this.getSchoolMarkers('', e.currentTarget.dataset.code, '', 1);
      this.setData({
          currentItemCode2: e.currentTarget.dataset.code,
          majorName: "全部",
          currentItemCode: 0
      })  
  },
  major3: function (e) {
      this.getSchoolMarkers('', e.currentTarget.dataset.code, '', 1);
      this.setData({
          currentItemCode2: e.currentTarget.dataset.code,
          majorName: "全部",
          currentItemCode: 0
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