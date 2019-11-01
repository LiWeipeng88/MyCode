// subpages/rankList/rankList.js
const app = getApp();
Page({
  data: {
  
  },
  onLoad: function (e) {
    var that = this;
    if (!app.globalData.plumSession) {
      app.wechatSq(that);
    } else {
      that.requestRankList();
    };
  },
  //列表数据
  requestRankList: function () {
    var that = this;
    wx.showLoading({
      title: '正在加载',
      mask: true
    });
    var data = {};
    // var page = that.data.page;
    // app.setVersion(that);
    data.map = 'applet_sequence_community_rank';
    // data.page = page;
    wx.request({
      url: app.globalData.requestUrl,
      data: data,
      success: function (res) {
        console.log(res.data);
        if (res.data.ec == 200) {
          that.setData({
            rankList: res.data.data
          });
          console.log(that.data.rankList);
          // var allArr = [];
          // var initArr = that.data.couponList;
          // var curArr = res.data.data;
          // var lastPageLength = curArr.length;
          // if (page > 0) {
          //   allArr = initArr.concat(curArr);
          // } else {
          //   allArr = res.data.data;
          // }
          // that.setData({
          //   couponList: allArr
          // })
          // if (lastPageLength < 10) {
          //   that.setData({
          //     noMoretip: true,
          //     showLoading: false
          //   });
          // }
          // console.log(that.data.couponList);
        } else {
          // console.log(res.data)
          // if (page <= 0) {
          //   that.setData({
          //     couponList: [],
          //     noMoretip: false,
          //     showLoading: false
          //   })
          // } else {
          //   that.setData({
          //     noMoretip: true,
          //     showLoading: false
          //   });
          // }
        }
      },
      complete: function () {
        wx.hideLoading();
        wx.stopPullDownRefresh();
      }
    });
  },
  onPullDownRefresh: function () {
    // this.setData({
    //   page: 0,
    //   noMoretip: false,
    //   showLoading: true
    // });
    this.requestRankList();
    console.log("下拉刷新");
  },
})