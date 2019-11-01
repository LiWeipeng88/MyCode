const app = getApp();
Page({
  data: {

  },
  onLoad: function (e) {
    var that = this;
    if (e && e.groupId) {
      that.setData({
        groupId: e.groupId
      })
    };
    that.requestDetail();
  },
  //活动统计内容
  requestDetail: function () {
    var that = this;
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.globalData.requestUrl,
      data: {
        map: 'applet_sequence_group_info_sum',
        groupId: that.data.groupId
      },
      success: function (res) {
        console.log(res.data);
        if (res.data.ec == 200) {
          that.setData({
            detailData:res.data.data
          })
          // app.errorTip(that, res.data.data.msg, 2000);
        } else {
          // app.errorTip(that, res.data.em, 2000);
        }
      },
      complete: function () {
        wx.hideLoading();
      }
    });
  },
  //打开订单明细
  toActivityorder:function(){
    var that = this;
    var groupId = that.data.groupId;
    wx.navigateTo({
      url: '/subpages/Activityorder/Activityorder?groupId=' + groupId,
    })
  }
})