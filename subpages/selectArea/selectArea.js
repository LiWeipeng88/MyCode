// subpages/selectArea/selectArea.js
const app = getApp();
Page({
  data: {
    showLoading: true,
    noMoretip: false,
    page: 0,
    keyword:''
  },
  onLoad: function (e) {
    var that =this;
    if (e && e.comLimit){
      var comLimit = e.comLimit;
      that.setData({
        comLimit: e.comLimit
      })
    }
    // that.requestAreaList();
  },
  onShow:function(){
    var that = this;
    if (app.globalData.comInfor) {
      that.setData({
        comInfor: app.globalData.comInfor
      })
    }

   
    if (app.globalData.location){
      that.setData({
        location:app.globalData.location
      });
      
      console.log(wx.getStorageSync('comList'))
      if (that.data.comLimit == 1 && wx.getStorageSync('comList')) {
        console.log('下单选择小区');
        var comList = wx.getStorageSync('comList');
        console.log(comList);
        // that.setData({
        //   AreaList: comList
        // })

        that.requestAreaList();
      } else {
        console.log('请求小区列表');
        that.requestAreaList();
      }
    }else{
      that.getLocation();
    }
    console.log(that.data.comLimit);
    // console.log(wx.getStorageSync('comList'))
    // if (that.data.comLimit == 1 && wx.getStorageSync('comList')){
    //   var comList = wx.getStorageSync('comList');
    //   console.log(comList);
    //   that.setData({
    //     AreaList: comList
    //   })
    // }else{
    //   that.requestAreaList();
    // }
  },
  getLocation: function () {
    var that = this;
    console.log('执行定位');
    wx.getLocation({
      success: (res) => {
        console.log(res);
        console.log('定位成功');
        that.setData({
          lat: res.latitude,
          lng: res.longitude
        })
        var location = {
          lat: res.latitude,
          lng: res.longitude
        }
        that.setData({
          location: location
        });
        console.log(wx.getStorageSync('comList'))
        if (that.data.comLimit == 1 && wx.getStorageSync('comList')) {
          var comList = wx.getStorageSync('comList');
          console.log(comList);
          that.setData({
            AreaList: comList
          })
        } else {
          console.log('请求小区列表');
          that.requestAreaList();
        }
        app.globalData.location = location;
        // app.getCurAddress(res.latitude, res.longitude, that);
      },
      fail: (res) => {
        console.log('定位失败');//不获取位置信息进行调取全部小区
        var data=[]
        data.map = 'applet_sequence_community_list';
        wx.request({
          url: app.globalData.requestUrl,
          data: data,
          success: function (res) {
             var allArr=res.data.data
            console.log(res)
            that.setData({
              AreaList: allArr,
              mi:0
            })

          }
         
        });




        
        wx.getSetting({
          success: (res) => {
            if (res.authSetting['scope.userLocation']) {
              app.errorTip(that, "无法获取您的当前定位地址，请打开定位权限", 2000);
            } else {
              wx.openSetting({
                success: (res) => {
                  res.authSetting = {
                    "scope.userLocation": true
                  }
                  console.log(res.authSetting);
                }
              })
            }
          }
        })
      }
    })
  },
  requestAreaList: function (keyword) {
    var that = this;
    wx.showLoading({
      title: '正在加载',
      mask: true
    });
    var location = that.data.location;
   
    var data = {};
    var page = that.data.page;
    // app.setVersion(that);
    data.map = 'applet_sequence_community_list';
    data.page = page;
   

    if (!location) {
      data.lng = '';
      data.lat = ''; 
    }else{
      data.lng = location.lng;
      data.lat = location.lat; 

    }
    console.log(data)
    if (keyword){
      data.keyword = keyword;
    }
    wx.request({
      url: app.globalData.requestUrl,
      data: data,
      success: function (res) {
        console.log(res.data);
        if (res.data.ec == 200) {
          var allArr = [];
          var initArr = that.data.AreaList;
          var curArr = res.data.data;
          var lastPageLength = curArr.length;
          if (page > 0) {
            allArr = initArr.concat(curArr);
          } else {
            allArr = res.data.data;
          }
          that.setData({
            AreaList: allArr
          })
          if (lastPageLength < 10) {
            that.setData({
              noMoretip: true,
              showLoading: false
            });
          }
          console.log(that.data.AreaList);
        } else {
          console.log(res.data)
          if (page <= 0) {
            that.setData({
              AreaList: [],
              noMoretip: false,
              showLoading: false
            })
          } else {
            that.setData({
              noMoretip: true,
              showLoading: false
            });
          }
        }
      },
      complete: function () {
        wx.hideLoading();
        wx.stopPullDownRefresh();
      }
    });
  },
  onPullDownRefresh: function () {
    this.setData({
      page: 0,
      noMoretip: false,
      showLoading: true,
      keyword:'',
    });
    this.onLoad();
    this.onShow();
    console.log("下拉刷新");
  },
  // onReachBottom: function () {
  //   var that = this;
  //   if(that.data.mi==0){
  //     return false;
  //   }
  //   console.log("到达页面底部")
  //   var isMore = that.data.noMoretip;
  //   var page = that.data.page;
  //   var keyword = that.data.keyword;
  //   page++;
  //   that.setData({
  //     page: page
  //   });
  //   if (isMore) {
  //     console.log("已完成或正在加载");
  //   } else {
  //     //下拉刷新
  //    that.requestAreaList(keyword);
  //   }
  // },
  //搜索地区
  searchArea:function(e){
    var that = this;
    var keyword = e.detail.value;
    that.setData({
      keyword: keyword
    });
    that.requestAreaList(keyword);
  },
  //打开地址所对应的地图
  openLocation:function(e){
    var that =this;
    var name = e.currentTarget.dataset.name;
    var lng = Number(e.currentTarget.dataset.lng);
    var lat = Number(e.currentTarget.dataset.lat);
    wx.openLocation({
      latitude:lat,
      longitude:lng,
      name:name,
      address:name,
      scale:18
    });
  },
  //选择地区
  chooseArea:function(e){
    var that = this;
    var comInfor = e.currentTarget.dataset.com;
    console.log(comInfor)
    console.log(8888888888888)
    app.globalData.comInfor = comInfor;
    console.log(app.globalData.comInfor);
    that.setData({
      comInfor: comInfor
    });
    wx.setStorageSync('xq_idds', comInfor.id)
    that.submitInfor(comInfor.id);
    if (app.globalData.comInfor){
      wx.navigateBack({
        delta: 1
      })
    };
  },
  //提交选择的小区信息
  submitInfor:function(id){
    var that = this;
    wx.request({
      url: app.globalData.requestUrl,
      data: {
        map : 'applet_sequence_change_community',
        id:id
      },
      success: function (res) {
        console.log(res.data);
        if (res.data.ec == 200) {

        } else {

        }
      },
      complete: function () {
        wx.hideLoading();
        wx.stopPullDownRefresh();
      }
    });
  }
})