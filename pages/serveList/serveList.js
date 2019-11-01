// pages/serveList/serveList.js
const app = getApp();
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
    console.log(options);
    var that=this;
   

    if (options){
      var aid=options.aid;

        wx.request({
          url: app.globalData.requestUrl,
          
          data: {
            map: 'applet_sequence_wuyecate_list',
            aid: aid,
          },
          success: function (res) {
            console.log(res);
            that.setData({
              cate: res.data,
            })
          }
        })

      that.setData({
        aid: aid
      })


    }


    
  },

  goodDetail: function (e) {
    var that = this;
    var id = e.currentTarget.dataset.id;
    var aid = e.currentTarget.dataset.aid;

    var wuye_id = e.currentTarget.dataset.wuye;


    //周边订单标识 1为周边0为普通


    that.setData({
      wuye_id: wuye_id,
      aid: aid
    })


    if (that.data.groupId) {
      wx.navigateTo({
        url: '/pages/goodDetail/goodDetail?aid=' + aid + '&id=' + id + '&groupId=' + that.data.groupId + '&wuye_id=' + wuye_id,
      })
    } else {
      wx.navigateTo({
        url: '/pages/goodDetail/goodDetail?aid=' + aid + '&id=' + id + '&wuye_id=' + wuye_id,
      })
    }
  },
  backIndex: function () {
    console.log('----------')
    wx.switchTab({
      url: '/pages/index/index',
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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

    return {
      title: "柒個秋天",
      //path: '/pages/goodDetail/goodDetail?aid=' + aid + "&id=" + goods_id + "&wuye_id=" + wuye_id,
      path: 'pages/serveList/serveList?aid='+this.data.aid,
      imageUrl: '',  //用户分享出去的自定义图片大小为5:4,
      success: function (res) {
        // 转发成功
        console.log("分享成功");

        console.log('pages/serveList/serveList?aid='+this.data.aid);
        wx.showToast({
          title: "分享成功",
          icon: 'success',
          duration: 2000
        })
      },
      fail: function (res) {
        // 分享失败
        console.log("分享失败");
      },
    }
  }
})