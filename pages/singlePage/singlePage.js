//index.js
//获取应用实例
var WxParse = require('../../wxParse/wxParse.js');
const app = getApp()

Page({
  data: {
    isLoading:true,
    isShowgetinfo:false
  },
  //事件处理函数
  onLoad: function () {
    var that = this;
    if (!app.globalData.plumSession){
      app.wechatSq(that);
    }else{
      that.indexInfor();
    }
  },
  onShow: function () {
    var that = this;
    var title = that.data.title;
    if (title) {
      wx.setNavigationBarTitle({
        title: title
      })
    }
  },
  indexInfor: function () {
    var that = this;
    wx.showLoading({
      title: '数据加载中',
    })
    wx.request({
      url: app.globalData.requestUrl,
      data: {
        map: 'applet_start_page',
      },
      success: function (res) {
        console.log(res.data);
        app.globalData.followOpen = res.data.data.followOpen;
        if (res.data.ec == 200) {
          that.requestIndex();
          var version = app.globalData.version;
          var base = app.globalData.base;
          var versionBase = res.data.data.versionBase;
          console.log(version);
          if (res.data.data.isauth && base >= versionBase) {
            that.setData({
              detail: res.data.data,
              isauth: res.data.data.isauth,
              title: res.data.data.headTitle
            })
            var article = res.data.data.content;
            //article为连接数据接口时接收到的富文本数据信息       
            // 富文本解析
            WxParse.wxParse('article', 'html', article, that, 5)
            if (res.data.data.headTitle){
              wx.setNavigationBarTitle({
                title: res.data.data.headTitle
              })
            }
          }else{
            var indexUrl = res.data.data.indexUrl;
            wx.reLaunch({
              url: indexUrl
            })
          }
        } else {
          console.log(res.data)
          app.errorTip(that, res.data.em, 2000);
        }
      },
      complete: function () {
        wx.hideLoading();
        wx.stopPullDownRefresh();
        that.setData({
          isLoading:false
        })
      }
    });
  },
  getuserInfo:function(e){
    var that = this;
    if (e.detail.userInfo){
      that.setData({
        isShowgetinfo: false
      })
      var userInfo = e.detail.userInfo;
      console.log(userInfo);
      app.globalData.getuserInfo = userInfo;
      app.wechatSq(that);
    }else{
      that.setData({
        isShowgetinfo: true
      })
    }
  },
  saveUserinfo: function (plumSession,indexUrl){
    var that = this;
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.globalData.requestUrl,
      data: {
        map: 'applet_member_info',
        plum_session_applet: plumSession
      },
      success: function (res) {
        console.log(res.data);
        if (res.data.ec == 200) {
          app.globalData.userInfo = res.data.data;
          if (app.globalData.userInfo){
            that.requestIndex();
          }
          app.globalData.requestUrl = app.globalData.requestUrl + '&plum_session_applet=' + res.data.data.plum_session_applet;
          if (indexUrl) {
            wx.reLaunch({
              url: indexUrl
            })
          }
        } else {
          console.log(res.data)
          app.errorTip(that, res.data.em, 2000);
        }
      },
      complete: function () {
        wx.hideLoading();
        wx.stopPullDownRefresh();
      }
    });
  },
  requestIndex: function () {
    var that = this;
    wx.showLoading({
      title: '加载中',
      mask: true,
      time: 100000
    })
    console.log('首页' + app.globalData.requestUrl);
    wx.request({
      url: app.globalData.requestUrl,
      data: {
        map: 'applet_sequence_index'
      },
      success: function (res) {
        console.log("首页数据");
        console.log(res.data);
        if (res.data.ec == 200) {
          that.setData({
            indexInfo: res.data.data,
          });
          if (res.data.data.name) {
            wx.setNavigationBarTitle({
              title: res.data.data.name
            })
          }
          app.globalData.watermark = res.data.data.watermark;
          app.globalData.openWatermark = res.data.data.openWatermark;
          app.globalData.supportOpen = res.data.data.supportOpen;
          app.globalData.watermarkLogo = res.data.data.watermarkImg;
          app.globalData.telphone = res.data.data.mobile;
          var shareInfo = {
            shareCover: res.data.data.shareCover,
            shareTitle: res.data.data.shareTitle
          }
          app.globalData.shareInfo = shareInfo;
        } else {
          console.log(res.data)
          that.setData({
            indexInfo: "",
            noticeList: "",
            categoryList: ""
          })
          app.errorTip(that, res.data.em, 2000);
        }
      },
      complete: function () {
        wx.hideLoading();
      }
    });
  },
  openLocation: function (e) {
    var lng = Number(e.currentTarget.dataset.lng);
    console.log(typeof (lng));
    var lat = Number(e.currentTarget.dataset.lat);
    var name = this.data.detail.name;
    var address = this.data.detail.address;
    wx.openLocation({
      latitude: lat,
      longitude: lng,
      name: name,
      address: address,
      scale: 18
    })
  },
  makeCall: function (e) {
    var phone = e.currentTarget.dataset.phone;
    wx.showModal({
      title: phone,
      content: '',
      confirmText: '拨打',
      confirmColor: '#48C23D',
      success: function (res) {
        if (res.confirm) {
          wx.makePhoneCall({
            phoneNumber: phone,
            success: function () {
              console.log("拨打电话成功！")
            },
            fail: function () {
              console.log("拨打电话失败！")

            }
          })
        }
      }
    })
  },
  onPullDownRefresh: function () {
    var that = this;
    that.onLoad();
    this.onReady();
    console.log("下拉刷新");
  },
  playVideo: function () {
    var that = this;
    that.setData({
      isShowVideo: true
    })
    this.videoContext.play();
  },
  hideVideo: function () {
    var that = this;
    that.setData({
      isShowVideo: false
    })
  },
  yyNameChange: function (e) {
    this.setData({
      yyName: e.detail.value
    })
  },
  yyTelChange: function (e) {
    this.setData({
      yyTel: e.detail.value
    })
  },
  yyMarkChange: function (e) {
    this.setData({
      yyMark: e.detail.value
    })
  },
  yuyueSubmit: function () {
    var that = this;
    var data = {};
    data.map = 'applet_submit_appointment';
    data.name = that.data.yyName;
    data.mobile = that.data.yyTel;
    data.content = that.data.yyMark;
    data.prompt = that.data.detail.appointButton;
    if (data.name.length <= 0) {
      app.errorTip(that, '您的姓名不能为空', 2000);
      return;
    }
    if (data.mobile.length != 11) {
      app.errorTip(that, '请输入正确的手机号', 2000);
      return;
    }
    //发起请求，获取列表列表
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      mask: true,
      duration: 10000
    });
    wx.request({
      url: app.globalData.requestUrl,
      data: data,
      success: function (res) {
        if (res.data.ec == 200) {
          app.errorTip(that, res.data.data.msg, 2000);
          that.setData({
            yyName: "",
            yyTel: "",
            yyMark: ""
          })
        } else {
          console.log(res.data)
          app.errorTip(that, res.data.em, 2000);
        }
      },
      complete: function () {
        wx.hideToast();
        wx.stopPullDownRefresh();
      }
    });
  },
  onShareAppMessage: function () {
    var title = this.data.title;
    var shareInfo = app.globalData.shareInfo;
    title = shareInfo.shareTitle ? shareInfo.shareTitle : title;
    var cover = shareInfo.shareCover ? shareInfo.shareCover : '';
    return {
      title: title,
      imageUrl: cover,
      path: '/pages/singlePage/singlePage',
      success:function(){
        wx.request({
          url: app.globalData.requestUrl,
          data: {
            map: 'applet_share_get_point'
          },
          success: function (res) {
            console.log(res.data);
            if (res.data.ec == 200) {
              if(res.data.data.msg){
                console.log(res.data.data.msg);
                app.errorTip(that, res.data.data.msg, 2000);
              }
            } else {
              if (res.data.em){
                app.errorTip(that, res.data.em, 2000);
              }
            }
          },
          complete: function () {
          }
        });
      }
    }
  },
})
