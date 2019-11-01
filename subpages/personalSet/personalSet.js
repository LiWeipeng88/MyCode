const app = getApp();
Page({
  data: {

  },
  onLoad: function (e) {
    var that = this;
    that.mineInfor();
  },
  onShow:function(){
    var that = this;
    if (app.globalData.comInfor) {
      that.setData({
        comInfor: app.globalData.comInfor,
        comName: app.globalData.comInfor.name,
        comId: app.globalData.comInfor.id
      })
    }
  },
  //个人信息
  mineInfor: function () {
    var that = this;
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      mask: true,
      duration: 10000
    });
    wx.request({
      url: app.globalData.requestUrl,
      data: {
        map: 'applet_sequence_get_member_info'
      },
      success: function (res) {
        if (res.data.ec == 200) {
          console.log(res.data.data);
          that.setData({
            name: res.data.data.realName ? res.data.data.realName:'',
            phone: res.data.data.mobile ? res.data.data.mobile:'',
            wx: res.data.data.weixin ? res.data.data.weixin:'',
            comId: res.data.data.comId,
            comName: res.data.data.comData ? res.data.data.comData.name:'',
            address: res.data.data.comData.name
          })

        } else {
          console.log(res.data);
        }
      },
      complete: function () {
        wx.hideToast();
      }
    });
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
  //选择小区
  toSelectArea:function(){
    var that = this;
    wx.navigateTo({
      url: '/subpages/selectArea/selectArea',
    })
  },
  //地址管理
  toAddressManage:function(){
    var that = this;
    wx.navigateTo({
      url: '/pages/addressManage/addressManage?type=mine',
    })
  },
  //保存信息
  submitInfor:function(){
    var that = this;
    var data = {};
    data.map ="applet_sequence_save_member_info";
    data.realName = that.data.name;
    data.mobile = that.data.phone;
    data.weixin = that.data.wx;
    data.comId = that.data.comId;
    if (data.realName == '') {
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
      data:data,
      success: function (res) {
        if (res.data.ec == 200) {
          console.log(res.data.data);
          app.errorTip(that, res.data.data.msg, 2000);
          wx.navigateBack({
            delta:1
          })
        } else {
          console.log(res.data);
          app.errorTip(that, res.data.em, 2000);
        }
      },
      complete: function () {
        wx.hideToast();
      }
    });
  },
})