const app = getApp();
const Charts = require('../../utils/wxcharts.js');
Page({
  data: {
    page: 0,
    noMoretip: false,
    showLoading: true,
  },
  onLoad: function (e) {
    var that = this;
    var res = wx.getSystemInfoSync();
    that.setData({
      cavasW: res.windowWidth,
      cavasH: res.windowWidth/1.875
    });
    that.chartData();
    // that.requestHistoryList();
  },
  //营业日报
  toBusinessDaily:function(){
    var that = this;
    wx.navigateTo({
      url: '/subpages/businessDaily/businessDaily',
    })
  },
   //活动详情
   chartData: function () {
    var that = this;
    wx.showLoading({
      title: '正在加载',
      mask: true
    });
    wx.request({
      url: app.globalData.requestUrl,
      data: {
        map: 'applet_sequence_leader_index'
      },
      success: function (res) {
        console.log(res.data);
        if (res.data.ec == 200) {
          var data = res.data.data;
          that.setData({
            chartData:res.data.data,
            list:res.data.paihang,
            yuepaihang: res.data.yuepaihang
          })
          that.chartArea(data);
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
  //图表canvans组件
  chartArea:function(data){
    var that = this;
    var cavasW = that.data.cavasW;
    var cavasH = that.data.cavasH;
    var line = {
      canvasId: 'chartArea', // canvas-id
      type: 'area', // 图表类型，可选值为pie, line, column, area, ring
      categories: data.dateArr,
      // dataPointShape:'circle',
      series: [{ // 数据列表
        name: ' ',
        data: data.moneyArr,
        color:'#2FCD98',
        //data: [10, 10, 10, 10, 10,40, 10, 10]
      }],
      xAxis: {
        gridColor: '#fff',
        fontColor: '#999'
      },
      yAxis: {
        disabled:true,
        min: 0, // Y轴起始值
        gridColor:'#fff',
      },
      width: cavasW,
      height: cavasH,
      dataLabel: true, // 是否在图表中显示数据内容值
      legend: false, // 是否显示图表下方各类别的标识
      extra: {
        lineStyle: 'straight' // (仅对line, area图表有效) 可选值：curve曲线，straight直线 (默认)
      }
    };
    console.log(line);
    new Charts(line);
  },
  //活动统计-参与活动
  toJoinActivity:function(){
    var that = this;
    wx.navigateTo({
      url: '/subpages/joinActivity/joinActivity',
    })
  },
  //订单列表
  toActivityorder: function () {
    var that = this;
    wx.navigateTo({
      url: '/subpages/Activityorder/Activityorder',
    })
  },
  //订单核销页面
  toOrderHexiao:function(){
    var that = this;
    wx.navigateTo({
      url: '/subpages/orderHexiao/orderHexiao',
    })
  },
  //分销中心
  toFxCenter:function(){
    var that = this;
    wx.navigateTo({
      url: '/subpages/fxCenter/fxCenter',
    })
  },

  toXiaji: function () {
    var that = this;
    wx.navigateTo({
      url: '/pages/xiaji/xiaji',
    })
  },


  //小区月排行表
  toRankList:function(){
    var that = this;
    wx.navigateTo({
      url: '/subpages/rankList/rankList',
    })
  }
})