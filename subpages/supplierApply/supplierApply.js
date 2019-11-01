const app = getApp();
Page({
  data: {
    tsModelShow:false
  },
  onLoad: function (e) {
    var that = this;
    if (!app.globalData.plumSession) {
      app.wechatSq(that);
    } else {
      that.requestFormdata();
    }
  },
  //获取输入的内容
  // dataChange: function (e) {
  //   var that = this;
  //   var type = e.currentTarget.dataset.type;
  //   that.setData({
  //     [type]: e.detail.value
  //   });
  //   console.log(that.data[type]);
  // },
  // submitInfor: function () {
  //   var that = this;
  //   console.log(that.data.name);
  //   console.log(that.data.phone);
  //   var data = {};
  //   data.map = "applet_sequence_supplier_apply";
  //   data.name = that.data.name ? that.data.name : '';
  //   data.mobile = that.data.phone ? that.data.phone : '';
  //   data.remark = that.data.brief ? that.data.brief : '';
  //   if (data.name == '') {
  //     app.errorTip(that, '请输入姓名', 2000);
  //     return;
  //   }
  //   if (data.mobile == '') {
  //     app.errorTip(that, '请输入手机号', 2000);
  //     return;
  //   }
  //   console.log(data);
  //   wx.request({
  //     url: app.globalData.requestUrl,
  //     data: data,
  //     success: function (res) {
  //       console.log(res.data);
  //       if (res.data.ec == 200) {
  //         that.ModelShow();
  //       } else {
  //         app.errorTip(that, res.data.em, 2000);
  //       }
  //     },
  //     complete: function () {
  //       wx.hideLoading();
  //     }
  //   });
  // },
  // 请求表单数据
  requestFormdata: function () {
    var that = this;
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.globalData.requestUrl,
      data: {
        map: 'applet_sequence_supplier_form'
      },
      success: function (res) {
        if (res.data.ec == 200) {
          console.log(res.data.data)
          var formData = res.data.data.formData;
          if (formData) {
            for (var i = 0; i < formData.length; i++) {
              formData[i].id = i;
              formData[i].value = '';
            }
            that.setData({
              formTitle: res.data.data.title,
              formData: formData
            })
            if (res.data.data.title) {
              wx.setNavigationBarTitle({
                title: res.data.data.title
              })
            }
          }
          console.log(that.data);
        } else {
          console.log(res.data)
          wx.setNavigationBarTitle({
            title: '我是供应商'
          })
          that.setData({
            formData: []
          })
          app.errorTip(that, res.data.em, 2000);
        }
      },
      complete: function () {
        wx.hideLoading();
        wx.stopPullDownRefresh();
      }
    });
  },
  onPullDownRefresh: function () {
    var that = this;
    that.onLoad();
  },
  // 监控数据改变
  dataChange: function (e) {
    var that = this;
    var formData = that.data.formData;
    var id = e.currentTarget.dataset.id;
    var curVal = e.detail.value;
    for (var i = 0; i < formData.length; i++) {
      if (formData[i].id == id) {
        if (formData[i].type == 'select') {
          formData[i].value = formData[i].data.options[curVal].title;
        } else {
          formData[i].value = curVal;
        }
      }
    }
    that.setData({
      formData: formData
    })
  },
  chooseLocation: function (e) {
    var that = this;
    var formData = that.data.formData;
    var id = e.currentTarget.dataset.id;
    wx.chooseLocation({
      success: (res) => {
        console.log(res);
        var value = [];
        value.push(res.address);
        value.push(res.latitude);
        value.push(res.longitude);
        for (var i = 0; i < formData.length; i++) {
          if (formData[i].id == id) {
            formData[i].value = value;
            formData[i].valueShow = res.address;
          }
        }
        console.log(formData);
        console.log(id);
        that.setData({
          formData: formData
        })
        console.log(that.data.formData);
        // that.setData({
        //   curLocation: curLocation,
        //   curChooseLatitude: res.latitude,
        //   curChooseLongitude: res.longitude
        // })
        // ['回家卡上发还是付款方式', '34.44', '1555' ]
      },
      fail: (res) => {
        wx.getSetting({
          success: (res) => {
            if (res.authSetting['scope.userLocation']) {
              that.setData({
                locationTips: "无法获取您的当前定位地址，请打开定位权限"
              })
            } else {
              wx.openSetting({
                success: (res) => {
                  res.authSetting = {
                    "scope.userLocation": true
                  }
                  console.log(res.authSetting);
                }
              })
            }
          }
        })
      }
    })
  },
  // 上传图片
  chooseSingleImage: function (e) {
    var that = this;
    var id = e.currentTarget.dataset.id;
    wx.showActionSheet({
      itemList: ['从相册中选择', '拍照'],
      itemColor: "#333",
      success: function (res) {
        if (!res.cancel) {
          if (res.tapIndex == 0) {
            that.chooseWxImage('album', id)
          } else if (res.tapIndex == 1) {
            that.chooseWxImage('camera', id)
          }
        }
      }
    })
  },
  //选择单图
  chooseWxImage: function (type, id) {
    var that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: [type],
      success: function (res) {
        console.log(res);
        var temPath = res.tempFilePaths[0];
        that.upload_file(temPath, id);
      }
    })
  },
  // 上传单图到服务器
  upload_file: function (temPath, id) {
    var that = this;
    var formData = that.data.formData;
    wx.showLoading({
      title: '上传中',
    })
    wx.uploadFile({
      url: app.globalData.requestUrl + '?&map=applet_img_upload',
      filePath: temPath,
      name: 'image',
      success: function (res) {
        var data = JSON.parse(res.data);
        var realpath = app.globalData.domin + data.data.path;
        if (data.ec == 200) {
          for (var i = 0; i < formData.length; i++) {
            if (formData[i].id == id) {
              formData[i].img = realpath;
              formData[i].value = data.data.path;
            }
          }
          that.setData({
            formData: formData
          })
          console.log(that.data.formData);
        } else {
          wx.showModal({
            title: '提示',
            content: data.em,
            showCancel: false
          });
        }
      },
      complete: function () {
        wx.hideLoading();
      }
    });
  },
  submitData: function () {
    var that = this;
    var formData = that.data.formData;
    for (var i = 0; i < formData.length; i++) {
      if (formData[i].require == 'true') {
        if (formData[i].value == '') {
          app.errorTip(that, formData[i].data.title + '为必填项', 2000);
          return;
        }
      }
    }
    var data = {
      map: 'applet_sequence_supplier_apply',
      data: formData
    }
    console.log(data);
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.globalData.requestUrl,
      data: data,
      success: function (res) {
        if (res.data.ec == 200) {
          console.log(res.data.data)
          for (var i = 0; i < formData.length; i++) {
            if (formData[i].type == 'upload') {
              formData[i].img = '';
            }
            formData[i].value = '';
            formData[i].valueShow = '';
          }
          that.setData({
            formData: formData
          })
          that.ModelShow();
          // app.errorTip(that, res.data.data.msg, 2000);
        } else {
          console.log(res.data)
          app.errorTip(that, res.data.em, 2000);
        }
      },
      complete: function () {
        wx.hideLoading();
      }
    });
  },
  //提示弹窗出现
  ModelShow:function(){
    var that = this;
    that.setData({
      tsModelShow:true
    })
  },
  //提示弹窗关闭
  ModelHide: function () {
    var that = this;
    that.setData({
      tsModelShow: false
    });
    wx.navigateBack({
      delta: 1
    });
  },
})