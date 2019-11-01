const app = getApp();
Page({
  data: {
    img: ["https://ss1.baidu.com/6ONXsjip0QIZ8tyhnq/it/u=2029909669,4268108141&fm=173&app=25&f=GIF?w=218&h=146&s=2292CE6D1C8367645604A59E0300D083", "https://ss1.baidu.com/6ONXsjip0QIZ8tyhnq/it/u=3811647973,88540033&fm=173&app=49&f=JPEG?w=218&h=146&s=AD0AA75F30790B9E902864A30300E062", "https://ss1.baidu.com/6ONXsjip0QIZ8tyhnq/it/u=1371648073,4245922747&fm=173&app=25&f=JPEG?w=218&h=146&s=27FC7F860AF3C7EB8E2EAF610300F06C","https://ss2.baidu.com/6ONYsjip0QIZ8tyhnq/it/u=2907690539,590412813&fm=173&app=49&f=JPEG?w=218&h=146&s=6788BB45502305191E3465160300C040"],
    index:0,
    fx:0
  },
  radiochange:function(e){
    console.log(e)
    this.setData({
      index: e.detail.value

    })

  },

  onLoad: function (e) {
    var that = this;
    var true_id = e.true_id ? e.true_id:0
    console.log(e.tid)
    console.log(true_id)
    console.log("sssssssss")
    console.log(e.jifen)
   if(e.jifen==1){
     that.setData({
       str:'兑换',
        tp_jifen: 1
     })
   }else{
     that.setData({
       str: '购买',
       tp_jifen: 2
     })
   }

    if(e&&e.tid){
      that.setData({
        tid:e.tid,
        otid: e.tid,
        id: e.id,
        groupId: e.groupId,
        url:e.url,
        true_id: true_id
      })

   
      if(e.url!=0){
        wx.setStorageSync("notsession", 'notsession');
      }

    }
    console.log(e)
    console.log("看看有没有E")
  // if(e){

  //   var ee=e.a;
  // console.log(e)
  //   console.log(99999)
  //   if(ee==1){
  //     console.log(ee);
  //     that.setData({
  //       fx: 0,
        
  //     })
  //   }
  // }
    
    that.getGroupId();
    wx.request({
      url: app.globalData.requestUrl,
      data: {
        map: 'applet_sequence_share_exp',
        tid: that.data.tid
      },
      success: function (res) {

        if (res){

       
        that.setData({
          exp: res.data.data
          
        })
        }
      }

    })
   
    if (true_id!=0){

  
    wx.request({
      url: app.globalData.requestUrl,
      data: {
        map: 'applet_sequence_share_image',

      },
      success: function (res) {

        that.setData({
          img: res.data

        })

      }

    })
    }


  },
  lookOrder:function(){
    var that = this;
    var tid = that.data.tid;
    wx.navigateTo({
      url: '/subpages/orderDetail/orderDetail?tid=' + tid + "&id=" + that.data.id + "&groupId=" + that.data.groupId,
      //url: '/subpages/orderDetail/orderDetail?tid=9373201901013795003529' + tid,
    })
  },
  //获得分组id
  getGroupId:function(){
    var that = this;
    
    

    wx.request({
      url: app.globalData.requestUrl,
      data: {
        map: 'applet_sequence_trade_info',
        tid:that.data.tid,
        //tid: "9373201901035284236945"
      },
      success: function (res) {
        
        if (res.data.ec == 200) {
          console.log(app.globalData.shuju)
          
          that.setData({
            groupId: res.data.data.groupId
          });

            wx.request({
              url: app.globalData.requestUrl,
              data: {
                map: 'applet_sequence_share_image',
                groupId: res.data.data.groupId,
                order_id: that.data.tid
              },
              success: function (r) {
               console.log(r)
                console.log("这是成功数据")
                that.setData({
                  img: r.data,
                  g_name: 123,
                  goods: r.data
                }) 

                
                wx.setStorageSync("aid", r.data.a_id)
                wx.setStorageSync("goods_id", r.data.goods_id)
                wx.setStorageSync("wuye_id", r.data.wuye_id)
                wx.setStorageSync("name", r.data.name)
                wx.setStorageSync("img", r.data.img)
                wx.setStorageSync("nickname", r.data.nickname)
              }

            })
          



        } else {

          if (that.data.url != 0) {
            var plum_session_applet = that.data.url;
            app.globalData.lsUrl=app.globalData.requestUrl + "&plum_session_applet=" + plum_session_applet
          }
         
          console.log(app.globalData.requestUrl)
          wx.request({
            url: app.globalData.lsUrl,
            data: {
              map: 'applet_sequence_share_image',
              groupId: that.data.groupId,
              order_id: that.data.tid
            },
            success: function (r) {
              console.log(r)
              console.log("这是成功数据")
              that.setData({
                img: r.data,
                g_name: 123,
                goods: r.data
              })


              wx.setStorageSync("aid", r.data.a_id)
              wx.setStorageSync("goods_id", r.data.goods_id)
              wx.setStorageSync("wuye_id", r.data.wuye_id)
              wx.setStorageSync("name", r.data.name)
              wx.setStorageSync("img", r.data.img)
              wx.setStorageSync("nickname", r.data.nickname)
            }

          })





        }
      },
      complete: function () {
        wx.hideToast();
      }
    });
  },
  onShareAppMessage:function(){
    var that = this;
    // var img1=this.data.img
    // var index=this.data.index
    // var tid = that.data.tid;
     var groupId = that.data.groupId;
    //console.log(that.data)
    // wx.request({
    //   url: app.globalData.requestUrl,
    //   data: {
    //     map: 'applet_sequence_share_image',
    //     groupId: groupId,
    //     order_id: tid,
    //   },
    //   success: function (res) {
    //     console.log(res)
    //     that.setData({
    //       info: res.data

    //     })
       
    //   }

    // })

  // var title= that.data.g_name
  console.log(that.data.goods);
    var aid = wx.getStorageSync("aid");
    var goods_id = wx.getStorageSync("goods_id");
    var wuye_id = wx.getStorageSync("wuye_id");
    var name = wx.getStorageSync("name");
    var img = wx.getStorageSync("img");
    var nickname = wx.getStorageSync("nickname");
    var tid = that.data.tid;
    var otid = that.data.otid;
   
    console.log(otid)
    console.log(app.globalData.requestUrl)
    var true_id=that.data.true_id;
    if(true_id!=0){

      wx.request({
        url: app.globalData.requestUrl,
        data: {
          otid: otid ,
          map: 'applet_sequence_add_exp',
        },
        success: function (res) {
          console.log(res)
          that.setData({
            exp: res.data

          })

        }

      })




    }

    
    
    return {
      title: "我在柒個秋天"+that.data.str+"了以下质优价廉的好商品" + name,
      //path: '/pages/goodDetail/goodDetail?aid=' + aid + "&id=" + goods_id + "&wuye_id=" + wuye_id,
      path: 'subpages/paySuccess/paySuccess?a=1&tid=' + tid + "&groupId=" + groupId + "&id=" + that.data.id + '&url=' + app.globalData.shuju + "&jifen=" + that.data.tp_jifen,
      imageUrl: '',  //用户分享出去的自定义图片大小为5:4,
      success: function (res) {
        // 转发成功
    console.log("分享成功");
   
        console.log("分享失败");
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

  },

  go_goods:function(e){
    var id=e.currentTarget.dataset.id;
    var groupId = e.currentTarget.dataset.aid;
    var wuye_id = e.currentTarget.dataset.wuye_id;
    console.log(e)
    wx.navigateTo({
      url: '/pages/goodDetail/goodDetail?aid=' + groupId + "&id=" + id + "&wuye_id=" + wuye_id,
    })

  },
  //返回活动
  backActive:function(){
    var that = this;
    var id = that.data.id;
    var groupId = that.data.groupId;
    console.log(groupId);
    if (groupId){
      wx.navigateTo({
        url: '/pages/activityDetail/activityDetail?id=' + id + '&aid=' + groupId,
      })
    }else{
      wx.navigateTo({
        url: '/pages/activityDetail/activityDetail?id=' + id,
      })
    }
  }, 
  //返回首页
  backIndex:function(){
    wx.reLaunch({
      url: '/pages/index/index',
    })
  }
})