// subpages/selectArea/selectArea.js
const app = getApp();
Page({
  data: {

  },
  onLoad: function () {
    var that = this;
    wx.showLoading({
      title: '加载中',
    });
    that.setData({
      sessionForm: app.globalData.sessionForm ? app.globalData.sessionForm : ''
    })
    app.setVersion(that);
  },
  onShow: function () {
    var that = this;
    app.contactData(that);
    if (app.globalData.comInfor) {
      that.setData({
        comInfor: app.globalData.comInfor
      });
      console.log(that.data.comInfor)
    }
    that.setData({
      userInfo: app.globalData.userInfo,
      slient: app.globalData.slient
    })
    if (app.globalData.slient == 1) {
      that.setData({
        isShowgetuser: true
      })
    }
    app.setNavtitle('个人中心');
    if (!app.globalData.plumSession) {
      app.wechatSq(that);
    } else {
      that.requestMine();
    }
  },
  getPhoneNumber: function (e) {
    var that = this;
    app.getPhone(e, that);
  },
  qiandao: function (e) {
    var that = this;
    
    
    wx.showModal({
      title: '提示',
      content: '签到功能已迁移到首页',
      showCancel: false,
      confirmText: "去首页", //默认是“确定”
      success:function(){
    //     wx.navigateTo({
    //   url: '/pages/index/index',
    // })
      wx.switchTab({
        url: '/pages/index/index',
       
      })

      }
    })
    return false;
  },
  jiameng: function (e) {
    var that = this;

    wx.navigateTo({
      url: '/pages/upload/upload',
    })

  },
  contactRecord: function () {
    app.contactRecord()
  },
  hideGetuser: function () {
    var that = this;
    that.setData({
      isShowgetuser: false
    })
  },
  // 获取用户信息
  getuserInfo: function (e) {
    var that = this;
    console.log(that);
    if (e.detail.userInfo) {
      var userInfo = e.detail.userInfo;
      console.log(userInfo);
      var slient = that.data.slient;
      var again = false;
      if (slient == 0) {
        again = true;
      }
      app.getuserInfo(that, userInfo, again);
    }
  },
  requestMine: function () {
    var that = this;
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.globalData.requestUrl,
      data: {
        map: 'applet_member_center_cfg'
      },
      success: function (res) {
        if (res.data.ec == 200) {
          console.log(res.data.data);
          that.setData({
            mineInfo: res.data.data,
            title: res.data.data.title
          });
          if (that.data.title) {
            app.setNavtitle(that.data.title);
          }
          app.globalData.shopStatus = res.data.data.shopStatus;
          app.globalData.leaderReason = res.data.data.leaderReason;
        } else {

        }
      },
      complete: function () {
        wx.hideLoading();
        wx.stopPullDownRefresh();
      }
    });
  },
  //打开地址所对应的地图
  openLocation: function (e) {
    var that = this;
    var name = e.currentTarget.dataset.name;
    var lng = Number(e.currentTarget.dataset.lng);
    var lat = Number(e.currentTarget.dataset.lat);
    wx.openLocation({
      latitude: lat,
      longitude: lng,
      name: name,
      address: name,
      scale: 18
    });
  },
  //技术支持
  toTechnicalPage: function (e) {
    var that = this;
    var onoff = e.currentTarget.dataset.onoff;
    console.log(onoff);
    if (onoff == 2) {
      wx.setStorageSync('appletad', true);
      that.setData({
        appletad: true
      })
    }
    if (onoff) {
      wx.navigateTo({
        url: '/pages/technicalPage/technicalPage'
      })
    }
  },
  //我的订单
  toMyOrder:function(e){
    var that = this;
    var type = e.currentTarget.dataset.type;
    wx.navigateTo({
      url: '/subpages/myOrder/myOrder?type='+type,
    })
  },
  //我的优惠券
  toMycoupon:function(){
    var that = this;
    wx.navigateTo({
      url: '/subpages/myCoupon/myCoupon',
    })
  },
  //优惠券大厅
  toCouponList:function(){
    var that = this;
    wx.navigateTo({
      url: '/subpages/couponList/couponList',
    })
  },
  //申请当团长
  toApplyTuan:function(e){
    var that = this;
    var status = e.currentTarget.dataset.status;
    wx.navigateTo({
      url: '/pages/applyTuan/applyTuan?status='+status,
    })
  },
  //团长管理中心
  toTuanManage:function(){
    var that = this;
    wx.navigateTo({
      url: '/subpages/tuanManage/tuanManage',
    })
  },
  //我是供应商
  toSupplierApply:function(){
    var that = this;
    wx.navigateTo({
      url: '/subpages/supplierApply/supplierApply',
    })
  },
  //团长信息
  toTuanInfor:function(){
    var that = this;
    wx.navigateTo({
      url: '/subpages/colonelInfor/colonelInfor',
    })
  },
  //个人设置页面
  toPersonalSet:function(){
    var that = this;
    wx.navigateTo({
      url: '/subpages/personalSet/personalSet',
    })
  },
  onShareAppMessage: function (res) {
    var that = this;
    let mid = that.data.mineInfo.mid;
    console.log(mid)
    return {
      title: '分享',
      path: '/pages/applyTuan/applyTuan?mid=' + mid + "&status=0",
      imageUrl: '',  //用户分享出去的自定义图片大小为5:4,
      success: function (res) {
        // 转发成功
        wx.showToast({
          title: "分享成功",
          icon: 'success',
          duration: 2000
        })
      },
      fail: function (res) {
        // 分享失败
      },
    }
  },
})