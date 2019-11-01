var Moment = require("../../utils/moment.js");
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var data = {};
    data.map = 'applet_sequence_xianlu_list';

    wx.request({
      url: app.globalData.requestUrl,
      data: data,
      success: function (res) {

        console.log(res)

        that.setData({
          list:res.data.data
        })
    var wc=0,wwc=0;
      for(var i=0;i<res.data.data.length;i++){

        if (res.data.data[i]['over']==1){
          wc=wc+1
          }else{
            wwc=wwc+1
          }
      }
  
        that.setData({
          wc: wc,
          wwc:wwc,
          total:wc+wwc
        })

      }
    
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },
  toImg:function(e){
    
    var shequ_id=e.target.dataset.id
    var over = e.target.dataset.over

    if(over==1){
      wx.showModal({
        title: '提示',
        content: '此小区已上传',
        showCancel: false,
       
      })
      return false;
    }

   
    wx.redirectTo({
      url: '/pages/upimg/upimg?id=' + shequ_id,
      
    })

  },
  lookqh:function(){
    
    wx.navigateTo({
      url: '/pages/qianhuo/qianhuo',
    })


  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  }
})