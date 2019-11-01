var tcity = require("../../utils/citys.js");
var app = getApp()
Page({
  data: {
    nocheckIconUrl: '../../images/icon_nocheck.png',
    checkIconUrl: '../../images/icon_checked.png',
    chooseAddressVal: ''
  },
  onLoad: function (e) {
    if(e && e.type){
      this.setData({
        chooseDefaultType: e.type
      })
    }
    console.log(this.data.chooseDefaultType);
  },
  onShow: function () {
    var that = this;
    //发起请求，获取列表列表
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      mask: true,
      duration: 10000
    });
    wx.request({
      url: app.globalData.requestUrl,
      data: {
        map: 'applet_address_list'
      },
      success: function (res) {
        if (res.data.ec == 200) {
          console.log(res.data.data);
          var addressList = res.data.data;
          var defaultId = '';
          var curAddressData = '';
          for (var i = 0; i < addressList.length; i++) {
            if (addressList[i].isdefault == '1') {
              defaultId = addressList[i].id;
              curAddressData = addressList[i];
              that.setData({
                curAddressData: curAddressData
              })
            }
          }
          that.setData({
            addressList: addressList,
            chooseAddressVal: defaultId
          })
          var chooseType = that.data.chooseDefaultType;
          // if (chooseType) {
          //   wx.getStorage({
          //     key: 'submitOrder',
          //     success: function (res) {
          //       console.log(res.data)
          //       var orderInfo = res.data;
          //       orderInfo.address = curAddressData;
          //       wx.setStorage({
          //         key: "submitOrder",
          //         data: orderInfo,
          //         success: function () {
          //           console.log('存储编辑地址成功');
          //         }
          //       })
          //     }
          //   })
          // }
        } else {
          that.setData({
            addressList: [],
            chooseAddressVal: ''
          })
        }
      },
      complete: function () {
        wx.hideToast();
      }
    });
  },
  chooseAddress: function (e) {
    var that = this;
    var curAddressId = e.currentTarget.dataset.id;
    var chooseAddressVal = that.data.chooseAddressVal;
    if (curAddressId == chooseAddressVal) {
      console.log(that.data.chooseDefaultType);
      if (that.data.chooseDefaultType =='waitorder'){
        wx.getStorage({
          key: 'submitOrder',
          success: function (res) {
            console.log(res.data)
            var orderInfo = res.data;
            console.log(orderInfo)
            orderInfo.address = that.data.curAddressData;
            that.changepostmoney(orderInfo);
          }
        })
      }
      return;
    }
    //发起请求，获取列表列表
    wx.showToast({
      title: '设置中',
      icon: 'loading',
      mask: true,
      duration: 10000
    });
    wx.request({
      url: app.globalData.requestUrl,
      data: {
        map: 'applet_address_default',
        id: curAddressId
      },
      success: function (res) {
        if (res.data.ec == 200) {
          console.log(res.data);
          that.setData({
            chooseAddressVal: curAddressId
          })
          var chooseType = that.data.chooseDefaultType;
          if (chooseType) {
            var curAddressData = res.data.data.addressData;
            wx.getStorage({
              key: 'submitOrder',
              success: function (res) {
                console.log(res.data)
                var orderInfo = res.data;
                console.log(orderInfo)
                orderInfo.address = curAddressData;
                that.changepostmoney(orderInfo);
              }
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
  },
  editAddress: function (e) {
    var that = this;
    var editId = e.currentTarget.dataset.id;
    var addressList = that.data.addressList;
    var curEditaddress = {};
    for (var i = 0; i < addressList.length; i++) {
      if (addressList[i].id == editId) {
        curEditaddress = addressList[i]
      }
    }
    console.log(curEditaddress);
    wx.setStorage({
      key: "curEditaddress",
      data: curEditaddress,
      success: function () {
        wx.navigateTo({
          url: '../editAddress/editAddress?type=edit'
        })
      }
    })
  },
  addAddress: function () {
    // wx.removeStorage({
    //   key: 'curEditaddress',
    //   success: function (res) {
    //     wx.navigateTo({
    //       url: '../addAddress/addAddress?type=add'
    //     })
    //   },
    //   fail:function(){
    //     wx.navigateTo({
    //       url: '../addAddress/addAddress?type=add'
    //     })
    //   }
    // })
    wx.navigateTo({
      url: '../addAddress/addAddress?type=add'
    })
  },
  getweChatAddress: function () {
    var that = this;
    console.log("AAA");
    wx.getSetting({
      success(res) {
        console.log(!res['scope.address']);
        if (!res['scope.address']) {
          wx.authorize({
            scope: 'scope.address',
            success() {
              wx.chooseAddress({
                success: function (res) {
                  // 保存获取到的地址到数据库
                  that.saveAddress(res);
                }
              })
            }
          })
        }
      },
      fail(res) {
        console.log(res);
      }
    })
  },
  saveAddress: function (res) {
    var that = this;
    var data = {};
    data.map = 'applet_address_add';
    data.name = res.userName;
    data.mobile = res.telNumber;
    data.address = res.detailInfo;
    data.pro = res.provinceName;
    data.city = res.cityName;
    data.area = res.countyName;
    data.code = res.postalCode;
    //发起请求，获取列表列表
    wx.showToast({
      title: '正在提交',
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
          wx.showToast({
            title: res.data.data.msg,
            icon: 'success',
            duration: 2000,
            success: function () {
              if (that.data.operaType == 'orderadd') {
                var curAddressData = res.data.data.address;
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
                      }
                    })
                  }
                })
              }
              that.onShow();
            }
          })
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
  },
  changepostmoney:function(data){
    var that = this;
    console.log('邮费');
    console.log(data)
    var goods=[];
    var prov=data.address.province;
    var city = data.address.city;
    for(var i=0;i<data.goodsData.length;i++){
      goods[i] = {
        gid: data.goodsData[i].id,
        num: data.goodsData[i].num,
        gfid: data.goodsData[i].gfid
      }
    }
    console.log(prov);
    console.log(city);
    console.log(goods)
    wx.request({
      url: app.globalData.requestUrl,
      data: {
        map: 'applet_get_post_fee',
        prov: prov,
        city:city,
        goods:goods
      },
      success: function (res) {
        console.log(res.data)
        if (res.data.ec == 200) {
          console.log(res.data.data)
          var total = parseFloat(data.total - data.postTotal + res.data.data);
          data.total = total.toFixed(2);
          data.postTotal = (res.data.data).toFixed(2);
          console.log(data.total);
          wx.setStorage({
            key: "submitOrder",
            data: data,
            success: function () {
              wx.navigateBack({
                delta: 1
              })
            }
          })
        } else {
          wx.showModal({
            title: '提示',
            content: res.data.em,
            showCancel: false
          });
        }
      },
      complete: function () {
        // wx.hideToast();
      }
    });
  }
})