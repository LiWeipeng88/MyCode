//index.js
//获取应用实例
var WxParse = require('../../wxParse/wxParse.js');
const app = getApp()

Page({
  data: {
    isLoading:true
  },
  //事件处理函数
  onLoad: function () {
    var that = this;
    that.indexInfor();
  },
  onShow: function () {
    var that = this;
    var title = that.data.title;
    console.log(title);
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
        map: 'applet_applet_support',
      },
      success: function (res) {
        if (res.data.ec == 200) {
          console.log(res.data.data)
          that.setData({
            detail: res.data.data,
            title: res.data.data.headTitle
          })
          wx.setNavigationBarTitle({
            title: res.data.data.headTitle
          })
          var article = res.data.data.content;
          // 富文本解析
          WxParse.wxParse('article', 'html', article, that, 5)
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
  nameChage:function(e){
    var that = this;
    that.setData({
      name:e.detail.value
    })
  },
  mobileChage: function (e) {
    var that = this;
    that.setData({
      mobile: e.detail.value
    })
  },
  industryChage: function (e) {
    var that = this;
    that.setData({
      industry: e.detail.value
    })
  },
  submitInfor:function(){
    var that = this;
    var data = {};
    data.map = 'applet_agent_consultation_submit',
    data.name = that.data.name;
    data.mobile = that.data.mobile;
    data.profession = that.data.industry ? that.data.industry : '';
    if(!data.name){
      app.errorTip(that, '请输入您的真实姓名', 2000);
      return false;
    }
    if (!data.mobile) {
      app.errorTip(that, '请输入您的手机号', 2000);
      return false;
    }
    wx.showLoading({
      title: '提交中',
    });
    wx.request({
      url: app.globalData.requestUrl,
      data: data,
      success: function (res) {
        if (res.data.ec == 200) {
          console.log(res.data.data)
          app.errorTip(that, res.data.data.msg, 2000);
          that.setData({
            name:'',
            mobile:'',
            industry:''
          })
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
    console.log("下拉刷新");
  }
})
