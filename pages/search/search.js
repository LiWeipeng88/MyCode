// pages/search/search.js
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
  onLoad: function (e) {
    var val="";
    if(e){
      var val=e.val
    }
    var that = this;
    that.getVhot();
   
    var data = {};
    data.map = 'applet_sequence_search';
    data.val = val;
  wx.request({
    url: app.globalData.requestUrl,
    data: data,
    success: function (res) {
      
      console.log(res.data);
     
        
        that.setData({
          goods: res.data,
          val: val,
        })

     
    },
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


  getVal:function(){

    
    var that = this;
    var data = {};
    data.map = 'applet_sequence_search';
    data.val = that.data.val;
    wx.request({
      url: app.globalData.requestUrl,
      data: data,
      success: function (res) {

        console.log(res.data);


        that.setData({
          goods: res.data,
        })


      },
    })

    data.map = 'applet_sequence_searchval';
    wx.request({
      url: app.globalData.requestUrl,
      data: data,
      success: function (res) {

        console.log(res.data);


        // that.setData({
        //   // goods: res.data,
        // })


      },
    })

  },
  getVhot: function () {


    var that = this;
    var data = {};
    data.map = 'applet_sequence_searchval';
   // data.val = that.data.val;
    wx.request({
      url: app.globalData.requestUrl,
      data: data,
      success: function (res) {

        console.log(res.data);


        that.setData({
          search_hot: res.data,
        })


      },
    })

  },




  /**
   * 用户点击右上角分享
   */

  search: function (e) {
    var that = this;
    var val = that.data.val ? that.data.val:'';
    console.log(val);
   
    if (e.currentTarget.dataset.val) {

      var val = e.currentTarget.dataset.val
    }

    that.setData({

      val: val

    })
    that.getVal()

  },
  getSearchVal: function (e) {

    this.setData({

      val: e.detail.value
    })

  },

  goodDetail: function (e) {
    var that = this;
    var id = e.currentTarget.dataset.id;
    var aid = e.currentTarget.dataset.acid;
    
      wx.navigateTo({
        url: '/pages/goodDetail/goodDetail?aid=' + aid + '&id=' + id,
      })
    
  },


  cartModelHide: function () {
    var that = this;
    that.setData({
      cartModelShow: false,
      show_carts: 1
    })
  },
  submitOrder: function (e) {
    // try {
    //   wx.removeStorageSync('voucherInfo')
    //   wx.removeStorageSync('addressInfo')
    // } catch (e) {
    //   // Do something when catch error
    // }


    var that = this;
    console.log(that.data.cartList);
    // return false;
    var dataset = e.target.dataset;
    var double = e.target.dataset.double;
    console.log(dataset)
    console.log("8888888888")
     // that.addGoodNum(dataset);
    

    var cartList = that.data.cartList;  //购物车中的商品
    var asaId = e.target.dataset.acid;

    var gwc = e.target.dataset.gwc;

    var data = {};
    data.map = 'applet_sequence_create_trade';
    data.asaId = asaId;
    if (that.data.groupId) {
      data.groupId = that.data.groupId;
    }
    var buys = [];
    


      var obj = {};
      obj.gid = e.currentTarget.dataset.id;
      obj.num = 1;
      buys.push(obj);
    

    data.buys = buys;
    console.log(data);
    console.log(66666666)
    wx.request({
      url: app.globalData.requestUrl,
      data: data,
      success: function (res) {
        console.log(res.data);
        if (res.data.ec == 200) {
          wx.setStorage({
            key: "submitOrder",
            data: res.data.data,
            success: function (res) {
              console.log(res);

              wx.navigateTo({
                url: '/pages/waitBuyerPay/waitBuyerPay'
              })
            }
          })
        } else {
          app.errorTip(that, res.data.em, 2000);
        }
      },
      complete: function () {
        wx.hideLoading();
        wx.stopPullDownRefresh();
      }
    })
    // wx.navigateTo({
    //   url: '/pages/waitBuyerPay/waitBuyerPay'
    // })
    // wx.setStorage({
    //   key: 'cartOrder',
    //   data: data,
    //   success: function () {
    //     wx.navigateTo({
    //       url: '/pages/waitBuyerPay/waitBuyerPay',
    //     })
    //   }
    // })
  },
  addGoodNum: function (dataset) {
    var that = this;
    console.log(dataset);
    // return false;
    var id = dataset.id;
    that.addGoodNumOpera(id);
  },
  addGoodNumOpera: function (id) {
    var that = this;
    var type = 1;//此时是增加操作
    var gid = id;//商品id
    var goodIndex;
    var goodsList = that.data.goodsList;
    console.log(goodsList)
    for (var i = 0; i < goodsList.length; i++) {

      if (goodsList[i].id == id) {
        console.log('对其商品的购买数量进行加1');
        if (goodsList[i].stock > goodsList[i].num) {
          goodsList[i].num = goodsList[i].num++;
        } else {
          app.errorTip(that, '超出库存量', 2000);
          return;
        }
        goodIndex = i;
      }
    }
    goodsList[goodIndex].num++;//根据id找到的脚标，对其购买数量进行加1
    var cartList = that.data.cartList;
    console.log(cartList)
    var isCartHas = false;
    if (cartList.length > 0) {
      for (var i = 0; i < cartList.length; i++) {
        if (cartList[i].gid == id) {
          console.log('购物车中有此商品');
          cartList[i].num++;
          isCartHas = true;
        }
      }
    }
    var obj = {};
    obj.gid = gid;
    obj.name = goodsList[goodIndex].name;
    obj.price = goodsList[goodIndex].price;
    obj.num = goodsList[goodIndex].num;
    if (!isCartHas) {
      cartList.push(obj);
      console.log('购物车中新增商品');
    }
    that.addRequestCart(gid, type);//调取购物车增减接口操作
    that.setData({
      goodsList: goodsList,
      cartList: cartList
    })
    that.getCartGoodNum();
  },
  
})