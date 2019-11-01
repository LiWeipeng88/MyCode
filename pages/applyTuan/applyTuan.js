const app = getApp();
Page({
  data: {

  },
  onLoad: function (e) {
    var that = this;
    if (e && e.status) {
      that.setData({
        status: e.status
      })
      console.log("进了");
      console.log(e.mid)
    }

    if (!wx.getStorageSync("up_mid")) {
      if (e.mid) {
        wx.setStorageSync("up_mid", e.mid)
        console.log(e.mid)
        console.log("存数据")
      }

    }
    console.log(wx.getStorageSync("up_mid"))
  },
  onShow: function () {
    var that = this;
    if (!app.globalData.plumSession) {
      app.wechatSq(that);
    } else {
      that.requestIndex();
      //that.requestActivitylist();
    };
    // that.setData({
    //   leaderReason:app.globalData.leaderReason
    // })
  },

  requestIndex: function () {
    var that = this;
    that.getSlient();
  },
  getSlient: function () {
    var that = this;
    var slient = app.globalData.slient ? app.globalData.slient : '';
    that.setData({
      slient: slient
    })
    if (slient == 1) {
      that.setData({
        isShowgetuser: true
      })
    }
  },
  getuserInfo: function (e) {
    var that = this;
    if (e.detail.userInfo) {
      var userInfo = e.detail.userInfo;
      console.log(userInfo);
      var slient = that.data.slient;
      var again = false;
      if (slient == 0) {
        again = true;
      }
      var tuan_id = that.data.groupId;
      app.getuserInfo(that, userInfo, again, tuan_id);
    }
  },
  //获取输入的内容
  dataChage: function (e) {
    var that = this;
    var type = e.currentTarget.dataset.type;
    that.setData({
      [type]: e.detail.value
    });
    console.log(that.data[type]);
  },
  submitInfor: function () {
    var that = this;
    console.log(that.data.name);
    console.log(that.data.phone);
    var data = {};
    data.map = "applet_sequence_leader_apply";
    data.name = that.data.name ? that.data.name : '';
    data.mobile = that.data.phone ? that.data.phone : '';
    data.wxcode = that.data.wx ? that.data.wx : '';
    data.area = that.data.area ? that.data.area : '';
    data.remark = that.data.note ? that.data.note : '';
    if (wx.getStorageSync('up_mid') != '') {
      data.up_mid = wx.getStorageSync('up_mid') ? wx.getStorageSync('up_mid') : '';
    }

    if (data.name == '') {
      app.errorTip(that, '请输入姓名', 2000);
      return;
    }
    if (data.mobile == '') {
      app.errorTip(that, '请输入手机号', 2000);
      return;
    }
    console.log(data);
    wx.request({
      url: app.globalData.requestUrl,
      data: data,
      success: function (res) {
        console.log(res.data);
        if (res.data.ec == 200) {
          wx.showModal({
            title: '',
            content: res.data.data.msg,
            confirmColor: '#48C23D',
            success: function (res) {
              // if (res.confirm) {
              // wx.navigateBack({
              //   delta:1
              // })
              wx.switchTab({    //跳转到tabBar页面，并关闭其他所有tabBar页面
                url: "/pages/index/index"
              })

              // }
            }
          })
          // app.errorTip(that, res.data.data.msg, 2000);
        } else {
          app.errorTip(that, res.data.em, 2000);
        }
      },
      complete: function () {
        wx.hideLoading();
      }
    });
  },
  //重新申请
  reApply: function () {
    var that = this;
    that.setData({
      status: 0
    })
  },
})