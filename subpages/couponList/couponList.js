const app = getApp();
Page({
  data: {
    page: 0,
    noMoretip: false,
    showLoading: true,
  },
  onLoad: function (e) {
    var that = this;
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
    data.map = 'applet_coupon_list';
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
  // 领取优惠券
  getCoupon: function (e) {
    var that = this;
    var couponId = e.currentTarget.dataset.id;
    wx.request({
      url: app.globalData.requestUrl,
      data: {
        map: 'applet_coupon_receive',
        cid: couponId
      },
      success: function (res) {
        console.log(res.data);
        if (res.data.ec == 200) {
          app.errorTip(that, res.data.data.msg, 2000);
          that.setData({
            page: 0,
            noMoretip: false,
            showLoading: true,
          });
          that.onLoad();
        } else {
          console.log(res.data);
          app.errorTip(that, res.data.em, 2000);
        }
      },
      complete: function () {

      }
    })
  },
  //返回首页
  backIndex:function(){
    var that = this;
    wx.reLaunch({
      url: '/pages/index/index',
    })
  },
})