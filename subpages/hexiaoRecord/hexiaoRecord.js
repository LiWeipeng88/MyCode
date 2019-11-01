const app = getApp();
Page({
  data: {
    showLoading: true,
    noMoretip: false,
    page: 0,
  },
  onLoad: function (e) {
    var that = this;
    that.requestRecordList();
  },
  requestRecordList: function (type) {
    var that = this;
    wx.showLoading({
      title: '加载中',
    });
    var data = {};
    var page = that.data.page;
    data.map = 'applet_sequence_my_verify';
    data.page = page;
    wx.request({
      url: app.globalData.requestUrl,
      data: data,
      success: function (res) {
        console.log(page);
        console.log(res.data);
        if (res.data.ec == 200) {
          var allArr = [];
          var initArr = that.data.recordList ? that.data.recordList : [];
          var curArr = res.data.data;
          var lastPageLength = curArr.length;
          if (page > 0) {
            allArr = initArr.concat(curArr);
          } else {
            allArr = res.data.data;
          }
          that.setData({
            recordList: allArr
          })
          if (lastPageLength < 10) {
            that.setData({
              noMoretip: true,
              showLoading: false
            });
          }
          console.log(that.data.recordList);
        } else {
          if (page <= 0) {
            that.setData({
              recordList: [],
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
    var that = this;
    that.setData({
      page: 0,
      noMoretip: false,
      showLoading: true
    });
    var type = that.data.type;
    that.requestRecordList(type);
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
      that.requestRecordList();
    }
  },
})