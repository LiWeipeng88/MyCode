const app = getApp();
Page({
  data: {
    codeNum:'',
  },
  onLoad: function (e) {
    var that = this;
  },
  //获取输入的核销码
  codeValue:function(e){
    var that = this;
    that.setData({
      codeNum:e.detail.value
    })
  },
  //扫码查询
  toScanCode:function(){
    var that = this;
    wx.scanCode({
      success:function(res){
        console.log(res.result);
        var tid = res.result;
        that.verifyCode(tid);
        // wx.navigateTo({
        //   url: '/subpages/searchHexiao/searchHexiao?code=' + tid,
        // })
      }
    })
  },
  toSearchHexiao:function(){
    var that = this;
    var codeNum = that.data.codeNum;
    if (codeNum==''){
      app.errorTip(that, '请输入核销码', 2000);
      return false;
    };
    that.verifyCode(codeNum);
  },
  //验证核销码
  verifyCode:function(code){
    var that = this;
    console.log(code);
    wx.request({
      url: app.globalData.requestUrl,
      data: {
        map: 'applet_sequence_get_trade_verify',
        code: code
      },
      success: function (res) {
        if (res.data.ec == 200) {
          console.log(res.data.data);
          console.log('成功'); 
          wx.navigateTo({
            url: '/subpages/searchHexiao/searchHexiao?code='+code,
          })

        } else {
          console.log('失败');
          app.errorTip(that, '核销码错误或订单信息不存在！', 2000);
          console.log(res.data);
          // wx.showModal({
          //   title: '提示',
          //   content: res.data.em,
          //   showCancel: false
          // });
        }
      },
      complete: function () {
        wx.hideToast();
      }
    });
  },
  //核销记录
  toHexiaoRecord:function(){
    var that = this;
    wx.navigateTo({
      url: '/subpages/hexiaoRecord/hexiaoRecord',
    })
  },
})