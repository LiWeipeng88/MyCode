const app = getApp();
Page({
  data: {
    couponStatus:0,
    page: 0,
    noMoretip: false,
    showLoading: true,
  },
  onLoad: function (e) {
    var that = this;
    that.requestCouponList();
  },
  //tab切换
  toggleChange: function (e) {
    var that = this;
    var couponStatus = e.currentTarget.dataset.status;
    that.setData({
      couponStatus: couponStatus,
      couponList: null,
      page: 0,
      noMoretip: false,
      showLoading: true,
    });
    that.requestCouponList();
  },
  //列表数据
  requestCouponList: function () {
    var that = this;
    wx.showLoading({
      title: '正在加载',
      mask: true
    });
    var data = {};
    var page = that.data.page;
    // app.setVersion(that);
    data.map = 'applet_my_coupon';
    data.page = page;
    data.status = that.data.couponStatus;
    wx.request({
      url: app.globalData.requestUrl,
      data: data,
      success: function (res) {
        console.log(res.data);
        if (res.data.ec == 200) {
          var allArr = [];
          var initArr = that.data.couponList;
          var curArr = res.data.data;
          var lastPageLength = curArr.length;
          if (page > 0) {
            allArr = initArr.concat(curArr);
          } else {
            allArr = res.data.data;
          }
          that.setData({
            couponList: allArr
          })
          if (lastPageLength < 10) {
            that.setData({
              noMoretip: true,
              showLoading: false
            });
          }
          console.log(that.data.couponList);
        } else {
          console.log(res.data)
          if (page <= 0) {
            that.setData({
              couponList: [],
              noMoretip: false,
              showLoading: false
            })
          } else {
            that.setData({
              noMoretip: true,
              showLoading: false
            });
          }
        }
      },
      complete: function () {
        wx.hideLoading();
        wx.stopPullDownRefresh();
      }
    });
  },
  onPullDownRefresh: function () {
    this.setData({
      page: 0,
      noMoretip: false,
      showLoading: true
    });
    this.requestCouponList();
    console.log("下拉刷新");
  },
  onReachBottom: function () {
    var that = this;
    console.log("到达页面底部")
    var isMore = that.data.noMoretip;
    var page = that.data.page;
    page++;
    that.setData({
      page: page
    });
    if (isMore) {
      console.log("已完成或正在加载");
    } else {
      that.requestCouponList();
    }
  },
  //使用优惠券
  useCoupon:function(){
    var that = this;
    wx.reLaunch({
      url: '/pages/index/index',
    })
  },
  //优惠券大厅
  toCouponlist:function(){
    var that = this;
    wx.navigateTo({
      url: '/subpages/couponList/couponList',
    })
  }
})