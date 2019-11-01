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
    errorTip: {
      text: '',
      isShow: false
    },
    name: '',
    mobile: '',
    addressdetail: '',
    code: ''
  },
  onLoad: function (e) {
    var that = this;
    tcity.init(that);

    var cityData = that.data.cityData;

    const provinces = [];
    const citys = [];
    const countys = [];

    for (let i = 0; i < cityData.length; i++) {
      provinces.push(cityData[i].name);
    }
    // console.log('省份完成');
    for (let i = 0; i < cityData[0].sub.length; i++) {
      citys.push(cityData[0].sub[i].name)
    }
    // console.log('city完成');
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
    // console.log('初始化完成');

    console.log(e);
    that.setData({
      operaType: e.type
    })
    // var operaType = e.type;
    // if (operaType == 'edit') {
      // that.setData({
      //   operaType: 'edit'
      // })
    // } else {
    //   that.setData({
    //     operaType: operaType
    //   })
    // }
    // wx.hideNavigationBarLoading()
    wx.getStorage({
      key: "curEditaddress",
      success: function (res) {
        console.log('编辑地址-----');
        console.log(res);
        that.setData({
          // operaType: operaType,
          name: res.data.name,
          mobile: res.data.mobile,
          addressdetail: res.data.address,
          code: res.data.post,
          editId: res.data.id,
          // curChooseAddress: res.data.province,
          curChooseLatitude: res.data.lat,
          curChooseLongitude: res.data.lng,
          isdefault: res.data.isdefault,
          province: res.data.province,
          city: res.data.city,
          county: res.data.area
        })
      }
    })

  },
  bindChange: function (e) {
    console.log(e);
    var val = e.detail.value;
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
        province: this.data.provinces[val[0]],
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
        province: this.data.provinces[val[0]],
        city: this.data.citys[val[1]],
        county: this.data.countys[val[2]],
        values: val
      })
      return;
    }
  },
  chooseLocation: function () {
    var that = this;
    wx.chooseLocation({
      success: (res) => {
        that.setData({
          curChooseAddress: res.address,
          curChooseLatitude: res.latitude,
          curChooseLongitude: res.longitude
        })
      }
    })
  },
  open: function () {
    this.setData({
      condition: !this.data.condition
    })
  },
  nameChange: function (e) {
    this.setData({
      name: e.detail.value
    })
  },
  mobileChange: function (e) {
    this.setData({
      mobile: e.detail.value
    })
  },
  detailChange: function (e) {
    this.setData({
      addressdetail: e.detail.value
    })
  },
  codeChange: function (e) {
    this.setData({
      code: e.detail.value
    })
  },
  saveAddress: function () {
    var that = this;
    var data = {};
    data.map = 'applet_address_add';
    data.name = that.data.name;
    data.mobile = that.data.mobile;
    data.address = that.data.addressdetail;
    data.pro = that.data.province;
    data.city = that.data.city;
    data.area = that.data.county;
    // data.pro = that.data.curChooseAddress;
    data.lat = that.data.curChooseLatitude;
    data.lng = that.data.curChooseLongitude;
    data.code = that.data.code;
    data.id = that.data.editId;
    // var operatype = that.data.operaType;
    // if (operatype == 'edit') {
    //   data.id = that.data.editId;
    // }
    var errorTxt = '';
    if (data.name.length > 0) {
      if (data.mobile.length > 0) {
        if (data.address.length > 0) {
          console.log("可以添加地址啦");
          //发起请求，获取列表列表
          wx.showToast({
            title: '提交中',
            icon: 'loading',
            mask: true,
            duration: 10000
          });
          wx.request({
            url: app.globalData.requestUrl,
            data: data,
            success: function (res) {
              if (res.data.ec == 200) {
                console.log(res.data.data);
                console.log(that.data.operaType);
                if (that.data.operaType == 'waitorder') {
                  var curAddressData = res.data.data.address;
                  // 存储当前编辑地址信息
                  console.log(curAddressData);
                  wx.getStorage({
                    key: 'submitOrder',
                    success: function (res) {
                      console.log(res.data)
                      var orderInfo = res.data;
                      orderInfo.address = curAddressData;
                      wx.setStorage({
                        key: "submitOrder",
                        data: orderInfo,
                        success: function () {
                          wx.navigateBack({
                            delta: 1
                          })
                          console.log('更改后的地址更新-----');
                          console.log(orderInfo);
                        }
                      })
                    }
                  })
                } else {
                  wx.navigateBack({
                    delta: 1
                  })
                }
              } else {
                wx.showModal({
                  title: '提示',
                  content: res.data.em,
                  showCancel: false
                });
              }
            },
            complete: function () {
              wx.hideToast();
            }
          });
        } else {
          errorTxt = '请输入详细地址';
        }
      } else {
        errorTxt = '请输入正确的手机号';
      }
    } else {
      errorTxt = '请输入姓名';
    }
    app.errorTip(that, errorTxt, 2000);
  },
  deleteAddress: function (e) {
    var delId = e.target.dataset.editid;
    wx.showModal({
      title: '',
      content: '确认删除该收货地址吗？',
      confirmColor: '#1AAD16',
      success: function (res) {
        if (res.confirm) {
          //发起请求，获取列表列表
          wx.showToast({
            title: '删除中',
            icon: 'loading',
            mask: true,
            duration: 10000
          });
          wx.request({
            url: app.globalData.requestUrl,
            data: {
              map: 'applet_address_delete',
              suid: app.globalData.suid,
              id: delId
            },
            success: function (res) {
              if (res.data.ec == 200) {
                console.log(res.data.data);
                wx.showModal({
                  title: '提示',
                  content: res.data.data.msg,
                  showCancel: false,
                  success: function () {
                    wx.navigateBack({
                      delta: 1
                    })
                  }
                });
              } else {
                wx.showModal({
                  title: '提示',
                  content: res.data.em,
                  showCancel: false
                });
              }
            },
            complete: function () {
              wx.hideToast();
            }
          });
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  onUnload: function () {
    wx.removeStorage({
      key: 'curEditaddress',
      success: function (res) {
        // console.log("清楚缓存成功")
      }
    })
  }
})