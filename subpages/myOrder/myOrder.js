const app = getApp();
Page({
  data: {
    orderfenlei: 'all',
    showLoading: true,
    noMoretip: false,
    page: 0,
  },
  onLoad: function (e) {
    var that = this;
    if (e && e.type) {
      that.setData({
        orderfenlei: e.type
      })
    }
    that.requestOrderList();
  },
  chooseFenlei: function (e) {
    var that = this;
    var fenlei = e.target.dataset.fenlei;
    that.setData({
      orderList: null,
      orderfenlei: fenlei,
      page: 0,
      noMoretip: false,
      showLoading: true
    });
    that.requestOrderList();
  },
  requestOrderList: function () {
    var that = this;
    var data = {};
    var page = that.data.page;
    data.map = 'applet_sequence_trade_list';
    data.page = page;
    data.status = that.data.orderfenlei;
    wx.request({
      url: app.globalData.requestUrl,
      data: data,
      success: function (res) {
        console.log(page);
        console.log(res.data);
        if (res.data.ec == 200) {
          var allArr = [];
          var initArr = that.data.orderList ? that.data.orderList : [];
          var curArr = res.data.data;
          var lastPageLength = curArr.length;
          if (page > 0) {
            allArr = initArr.concat(curArr);
          } else {
            allArr = res.data.data;
          }
          // for (var i = 0; i < allArr.length; i++) {
          //   allArr[i].shortContent = (allArr[i].content).substring(0, 50);
          //   allArr[i].isShowAll = false;
          // }
          that.setData({
            orderList: allArr
          })
          if (lastPageLength < 10) {
            that.setData({
              noMoretip: true,
              showLoading: false
            });
          }
          console.log(that.data.orderList);
        } else {
          if (page <= 0) {
            that.setData({
              orderList: [],
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
        wx.hideToast();
        wx.stopPullDownRefresh();
      }
    });
  },
  onPullDownRefresh: function () {
    var that = this;
    that.setData({
      page: 0,
      noMoretip: false,
      showLoading: true
    });
    that.requestOrderList();
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
      that.requestOrderList();
    }
  },
  orderDetail: function (e) {
    var that = this;
    var tid = e.currentTarget.dataset.tid;
    wx.navigateTo({
      url: '/subpages/orderDetail/orderDetail?tid=' + tid,
    })
  },
  //取消订单
  cancelOrder: function (e) {
    var that = this;
    var orderId = e.target.dataset.id;
    wx.showModal({
      title: '',
      cancelText: '再考虑下',
      confirmText: '取消订单',
      content: '订单还未付款，确认取消吗？',
      confirmColor: '#1AAD16',
      success: function (res) {
        if (res.confirm) {
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
              map: 'applet_cancel_order',
              // suid: app.globalData.suid,
              tid: orderId
            },
            success: function (res) {
              console.log(res.data);
              // if (res.data.ec == 200) {
              //   console.log(res.data.data);
              app.errorTip(that, '订单已取消成功~', 2000);
              that.onPullDownRefresh();
              // } else {
              //   wx.showModal({
              //     title: '提示',
              //     content: res.data.em,
              //     showCancel: false
              //   });
              // }
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
  //删除订单
  delOrder: function (e) {
    var that = this;
    var orderId = e.target.dataset.id;
    wx.showModal({
      title: '删除提示',
      cancelText: '取消',
      confirmText: '确认',
      content: '确认删除该订单吗',
      confirmColor: '#1AAD16',
      success: function (res) {
        if (res.confirm) {
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
              map: 'applet_order_delete',
              // suid: app.globalData.suid,
              tid: orderId
            },
            success: function (res) {
              if (res.data.ec == 200) {
                console.log(res.data.data);
                app.errorTip(that, res.data.data.msg, 2000);
                that.onPullDownRefresh();
              } else {
                app.errorTip(that, res.data.em, 2000);
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
})