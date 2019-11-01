// subpages/colonelInfor/colonelInfor.js
const app = getApp();
Page({
  data: {
  
  },
  onLoad: function (e) {
    var that = this;
  },
  onShow:function(){
    var that = this;
    console.log(app.globalData.userInfo);
    that.requestDetail();
  },
  callphone:function(e){
    console.log(e)
    wx.makePhoneCall({
      phoneNumber: e.target.dataset.phone,
    })
  },
  //团长信息
  requestDetail: function () {
    var that = this;
    wx.showLoading({
      title: '正在加载',
      mask: true
    });
    wx.request({
      url: app.globalData.requestUrl,
      data: {
        map: 'applet_sequence_leader_info',
      },
      success: function (res) {
        console.log(res.data);
        if (res.data.ec == 200) {
          that.setData({
            detailInfor: res.data.data,
          })
          // app.errorTip(that, res.data.data.msg, 2000);
        } else {
          that.setData({
            detailInfor: '',
          })
          // app.errorTip(that, res.data.em, 2000);
        }
      },
      complete: function () {
        wx.hideLoading();
      }
    });
  },
  // 预览图片
  peiviewImg: function (e) {
    var curimg = e.currentTarget.dataset.curimg;
    var imgs = [e.currentTarget.dataset.curimg];
    wx.previewImage({
      current: curimg, // 当前显示图片的http链接
      urls: imgs // 需要预览的图片http链接列表
    })
  },
  //选择小区
  selectArea:function(){
    var that = this;
    wx.navigateTo({
      url: '/subpages/selectArea/selectArea',
    })
  }
})