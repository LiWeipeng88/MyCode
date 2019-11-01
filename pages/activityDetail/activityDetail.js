const app = getApp();
Page({
  data: {
    cartModelShow:false,
    memberShow:false,
    page_num: 20,
    showLoading:false
  },
  onLoad: function (e) {
    var that = this;
    //console.log(e);
  
    wx.setStorageSync("comid", e.groupId);
    console.log(e.groupId)
    if (e.groupId) {

      that.setData({
        tuan_id: e.groupId
      })

    }
    
    // wx.setStorageSync("wuye_id_1","wuye_id");
    
  //ajax6


    
    if (e) {
      if (e.scene) {
        var scene = decodeURIComponent(e.scene).split('&');
        console.log(scene);
       
        var secneObj = {};
        for (var i = 0; i < scene.length; i++) {
          var arr = scene[i].split('=');
          var key = arr[0];
          secneObj[key] = arr[1];
        }
        e = secneObj;
      }
      if (e && e.id) {
        that.setData({
          id: e.id
        })
      };
      if (e && e.groupId) {
        that.setData({
          groupId: e.groupId
        })
      }
    }

    


  },

  onReachBottom1:function(){
   var that=this;
   var page_num=that.data.page_num;
    page_num = page_num+10;
    console.log(page_num);
    

    
    wx.showLoading({
      title: '加载中',
    })
   
    wx.request({
      url: app.globalData.requestUrl,
      data: {
        map: 'applet_sequence_activity_detail',
        id: that.data.id,
        page_num: page_num,
      },
      success: function (res) {
        console.log(res);
        wx.hideLoading()
        that.setData({
          info:res.data,
          page_num: page_num,
          showLoading: true

        })

        
      },
      
    })

    
    //console.log(99999)
  },
  hideGetuser: function () {
    var that = this;
    that.setData({
      isShowgetuser: false
    })
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
  onShow:function(){
    var that = this;
    if (!app.globalData.plumSession) {
      app.wechatSq(that);
    } else {
      that.requestIndex();
      //that.requestActivitylist();
    };

    if (app.globalData.comInfor) {

      that.setData({
        comInfor: app.globalData.comInfor
      })
    }

    //判断是否为空
   
    console.log(66666)
    if (!app.globalData.plumSession) {
      app.wechatSq(that);
    } else {
      app.contactData(that);
      that.requestDetail();
    };
  },
  onUnload: function () {
    var that = this;
    clearInterval(that.data.menberWrap);
  },
  onHide: function () {
    var that = this;
    clearInterval(that.data.menberWrap);
  },
  getPhoneNumber: function (e) {
    var that = this;
    app.getPhone(e, that);
  },
  contactRecord: function () {
    app.contactRecord()
  },
  //活动详情
  requestDetail: function () {
    var that = this;
    wx.showLoading({
      title: '正在加载',
      mask: true
    });


    var mid_ = app.globalData.userInfo.mid;
    that.setData({
      tuan_id:''

    })
    console.log()
    wx.request({
      url: app.globalData.requestUrl,
      data: {
        map: 'applet_sequence_activity_detail',
        id:that.data.id,
        mid_: mid_,
        tuan_id:that.data.tuan_id
      },
      success: function (res) {
        // if (that.data.detailInfor.community ==""){
        //     wx.navigateTo({
        //       url: '../../subpages/selectArea/selectArea',
        //     })
        //   }
        console.log(99999)
        
        console.log(that.data.detailInfor)
        console.log(99999)
        
        
  that.setData({
    info:res.data.data.data
  })

        if (res.data.ec == 200) {
          var memberList = res.data.data.memberList;
          var memberData;
          that.setData({
            memberShow:false,
            
          });
          if (memberList.length>0){
            that.data.menberWrap = setInterval(function(){
              var num = Math.floor(Math.random() * memberList.length);
              memberData = memberList[num];
              that.setData({
                memberData: memberData,
                memberShow:true
              });
              setTimeout(function(){
                that.setData({
                  memberShow: false
                });
              },5000)
              console.log(that.data.memberShow)
            },8000)
          }
          that.setData({
            detailInfor:res.data.data,
            memberList: memberList,
            goodsList: res.data.data.goods,
            cartList: res.data.data.cartList
          })
          that.getCartGoodNum();//计算购物车中的商品数量
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
  //拨打电话
  makePhone:function(e){
    var that = this;
    var mobile = e.currentTarget.dataset.mobile;
    app.makeCallphone(mobile);
  },
  // 预览图片
  peiviewImg: function (e) {
    var curimg = e.currentTarget.dataset.curimg;
    var imgs = e.currentTarget.dataset.imgs;
    wx.previewImage({
      current: curimg, // 当前显示图片的http链接
      urls: imgs // 需要预览的图片http链接列表
    })
  },
  // 修改购买商品的数量    
  goodNumCount: function (e) {
    var that = this;
    var dataset = e.target.dataset;
    var type = dataset.type;
    console.log(type);
    if (type == 'add') {
      that.addGoodNum(dataset);
      return;
    }
    if (type == 'sub') {
      console.log("减少商品");
      that.minusGoodNum(dataset);
      return;
    }

  },
  // 添加菜品数量
  addGoodNum: function (dataset) {
    var that = this;
    console.log(dataset);
    var id  = dataset.id;
    that.addGoodNumOpera(id);
  },
  //添加商品数量
  addGoodNumOpera: function (id) {
    var that = this;
    var type = 1;//此时是增加操作
    var gid = id;//商品id
    var goodIndex;
    var goodsList = that.data.goodsList;
    for (var i = 0; i < goodsList.length; i++) {
      if (goodsList[i].id == id) {
        console.log('对其商品的购买数量进行加1');
        if (goodsList[i].stock > goodsList[i].num){
          goodsList[i].num = goodsList[i].num++;
        }else{
          app.errorTip(that, '超出库存量', 2000);
          return;
        }
        goodIndex = i;
      }
    }
    goodsList[goodIndex].num++;//根据id找到的脚标，对其购买数量进行加1
    var cartList = that.data.cartList;
    var isCartHas = false;
    if (cartList.length>0){
      for (var i = 0; i < cartList.length; i++) {
        if (cartList[i].gid == id) {
          console.log('购物车中有此商品');
          cartList[i].num++;
          isCartHas = true;
        }
      }
    }
    var obj={};
    obj.gid = gid;
    obj.name = goodsList[goodIndex].name;
    obj.price = goodsList[goodIndex].price;
    obj.num = goodsList[goodIndex].num;
    if (!isCartHas){
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
  // 减少菜品数量
  minusGoodNum: function (dataset) {
    var that = this;
    console.log(dataset);
    var id = dataset.id;
    that.minusGoodNumOpera(id);
  },
  minusGoodNumOpera: function (id) {
    var that = this;
    var type = -1;//此时是减少操作
    var gid = id;//商品id
    var goodIndex;
    var goodsList = that.data.goodsList;
    for (var i = 0; i < goodsList.length; i++) {
      if (goodsList[i].id == id) {
        console.log('对其商品的购买数量进行减1');
        goodsList[i].num = goodsList[i].num--;
        goodIndex = i;
        if (goodsList[i].num<=0){
          goodsList[i].num = 0;
        }
      }
    }
    if (goodsList[goodIndex].num>0){
      goodsList[goodIndex].num--;//根据id找到的脚标，对其购买数量进行减1
    }else{
      goodsList[goodIndex].num=0;
      return;
    }
    var cartList = that.data.cartList;
    var isCartHas = false;
    if (cartList.length > 0) {
      for (var i = 0; i < cartList.length; i++) {
        if (cartList[i].gid == id) {
          if (cartList[i].num>1){
            cartList[i].num--;
          } else if (cartList[i].num <= 1) {
            cartList[i].num = 0;
            cartList.splice(i, 1);
            console.log(cartList);
            console.log("删除购物车中此中商品");
          }
          isCartHas = true;
          console.log("购物车中已存在");
        }
      }
    }
    that.addRequestCart(gid, type);//调取购物车增减接口操作
    that.setData({
      goodsList: goodsList,
      cartList: cartList
    })
    if (cartList.length <= 0) {
      that.setData({
        cartModelShow: false
      })
    }
    that.getCartGoodNum();
  },
  //添加到购物车
  addRequestCart: function (gid, number) {
    var that = this;
    var data = {};
    data.map = 'applet_sequence_edit_cart';
    data.gid = gid;
    data.aid = that.data.id;
    data.num = number;
    console.log(data);
    // wx.showLoading({
    //   title: '加载中',
    //   mask: true
    // })
    wx.request({
      url: app.globalData.requestUrl,
      data: data,
      success: function (res) {
        console.log("修改购物车数量");
        console.log(res.data);
        if (res.data.ec == 200) {
          // app.errorTip(that, res.data.data.msg, 2000);
        } else {
          // that.setData({
          //   cartList: []
          // })
          app.errorTip(that, res.data.em, 2000);
        }
      },
      complete: function () {
        wx.hideLoading();
        wx.stopPullDownRefresh();
      }
    })
  },
  // 获取购物车商品总数
  getCartGoodNum: function () {
    var that = this;
    var cartList = that.data.cartList;
    console.log('购物车');
    console.log(cartList);
    var sumNum = 0;
    for (var key in cartList) {
      sumNum += parseInt(cartList[key].num);
    }
    that.setData({
      cartSumNum: sumNum,
    })
  },
  // 清空购物车
  clearCart: function () {
    var that = this;
    var goodsList = that.data.goodsList;
    var cartList = that.data.cartList;
    wx.showModal({
      title: '提示',
      content: '确定要清空购物车吗？',
      success: function (res) {
        if (res.confirm) {
          //操作商品中的商品购买数量为0
          for (var i = 0; i < goodsList.length;i++){
            if (goodsList[i].num>0){
              goodsList[i].num = 0;
            }
          }
          //操作购物车中的商品购买数量为0
          for (var i = 0; i < cartList.length; i++) {
            if (cartList[i].num > 0) {
              cartList[i].num = 0;
            }
          }
          that.deleteRequestCart();
          that.setData({
            goodsList: goodsList,
            cartList: [],
            cartSumNum: 0,
            cartModelShow: false
          })
        }
      }
    })
  },
  deleteRequestCart: function () {
    var that = this;
    var data = {};
    data.map = 'applet_sequence_empty_cart';
    data.aid = that.data.id;
    // wx.showLoading({
    //   title: '加载中',
    //   mask: true
    // })
    wx.request({
      url: app.globalData.requestUrl,
      data: data,
      success: function (res) {
        console.log("删除购物车");
        console.log(res.data);
        if (res.data.ec == 200) {
          // app.errorTip(that, res.data.data.msg, 2000);
        } else {
          // that.setData({
          //   cartList: []
          // })
          app.errorTip(that, res.data.em, 2000);
        }
      },
      complete: function () {
        wx.hideLoading();
        wx.stopPullDownRefresh();
      }
    })
  },
  cartModelShow:function(){
    var that = this;
    var cartList = that.data.cartList;
    if (cartList.length>0){
      that.setData({
        cartModelShow: true
      })
    }else{
      app.errorTip(that, '请添加商品~', 2000);
    }
  },
  cartModelHide: function () {
    var that = this;
    that.setData({
      cartModelShow: false
    })
  },
  //商品详情
  goodDetail:function(e){
    var that = this;
    var id = e.currentTarget.dataset.id;
    var aid = that.data.id;

    var wuye_id=e.currentTarget.dataset.wuye;
   
   
    //周边订单标识 1为周边0为普通
    

      that.setData({
        wuye_id:wuye_id
      })
   
  
    if (that.data.groupId){
      wx.navigateTo({
        url: '/pages/goodDetail/goodDetail?aid=' + aid + '&id=' + id + '&groupId=' + that.data.groupId + '&wuye_id=' + wuye_id,
      })
    }else{
      wx.navigateTo({
        url: '/pages/goodDetail/goodDetail?aid=' + aid + '&id=' + id + '&wuye_id=' + wuye_id,
      })
    }
  },
  //申请当团长
  toApplyTuan: function () {
    var that = this;
    wx.navigateTo({
      url: '/pages/applyTuan/applyTuan',
    })
  },
  // 去结算  提交订单跳转
  submitOrder: function (e) {
    // try {
    //   wx.removeStorageSync('voucherInfo')
    //   wx.removeStorageSync('addressInfo')
    // } catch (e) {
    //   // Do something when catch error
    // }
    var that = this;
    var cartList = that.data.cartList;  //购物车中的商品
    var asaId = that.data.id;
    var data = {};
    data.map = 'applet_sequence_create_trade';
    data.asaId = asaId;
    if (that.data.groupId) {
      data.groupId = that.data.groupId ;
    }
    var buys = [];
    for (var key in cartList) {
      var obj = {};
      obj.gid = cartList[key].gid;
      obj.num = cartList[key].num;
      buys.push(obj);
    }
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
                url: '/pages/waitBuyerPay/waitBuyerPay?wuye=0'
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
  //返回首页
  backIndex:function(){
    var that = this;
    wx.reLaunch({
      url: '/pages/index/index',
    })
  },
  onShareAppMessage: function () {
    var that = this;
    var id = that.data.id;
    var groupId,path;
    var tuan_id = app.globalData.comInfor.id;
    //that.data.groupId
    if (tuan_id!=''){
      //groupId = that.data.groupId;
      console.log(tuan_id)
      //+ tuan_id
      path = '/pages/activityDetail/activityDetail?id=' + id + '&groupId=' + tuan_id ;
    }else{
      path = '/pages/activityDetail/activityDetail?id=' + id
    }
    var title = that.data.detailInfor.title;
    var shareInfo = app.globalData.shareInfo;
    title = shareInfo.shareTitle ? shareInfo.shareTitle : title;
    var cover = shareInfo.shareCover ? shareInfo.shareCover : ''
    console.log(path)
    return {
      title: title,
      imageUrl: cover,
      path: path,
      success: function () {
        console.log(path)
      }
    }
  }
})