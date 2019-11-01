// subpages/createrPoster/createrPoster.js
const app = getApp();
Page({
  data: {
  
  },
  onLoad: function (e) {
    var that = this;
    if(e&&e.groupId){
      that.setData({
        groupId: e.groupId
      })
    }
    var res = wx.getSystemInfoSync();
    that.setData({
      winW: res.windowWidth,
      winH: res.windowHeight
    });
    var isDrawfinish = that.data.isDrawfinish;
    if (isDrawfinish) { return; }
    app.requestShareinfo(that);
  },
  saveImage:function(){
    var that = this;
    app.saveImage(that);
  }
})