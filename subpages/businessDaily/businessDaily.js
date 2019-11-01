const app = getApp();
// const Charts = require('../../utils/wxcharts-min.js');
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
    that.requestHistoryList();
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
            chartData:res.data.data
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
        color:'#2FCD98'
        // data: [0, 0, 0, 0, 0, 0, 0, 0]
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
  //历史营业状态
  requestHistoryList: function () {
    var that = this;
    wx.showLoading({
      title: '正在加载',
      mask: true
    });
    var data = {};
    var page = that.data.page;
    // app.setVersion(that);
    data.map = 'applet_sequence_leader_day_list';
    data.page = page;
    wx.request({
      url: app.globalData.requestUrl,
      data: data,
      success: function (res) {
        console.log(res.data);
        if (res.data.ec == 200) {
          var allArr = [];
          var initArr = that.data.historyList;
          var curArr = res.data.data;
          var lastPageLength = curArr.length;
          if (page > 0) {
            allArr = initArr.concat(curArr);
          } else {
            allArr = res.data.data;
          }
          that.setData({
            historyList: allArr
          })
          if (lastPageLength < 10) {
            that.setData({
              noMoretip: true,
              showLoading: false
            });
          }
          console.log(that.data.historyList);
        } else {
          console.log(res.data)
          if (page <= 0) {
            that.setData({
              historyList: [],
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
    });
    this.requestHistoryList();
    console.log("下拉刷新");
  },
  onReachBottom: function () {
    var that = this;
    console.log("到达页面底部")
    var isMore = that.data.noMoretip;
    var page = that.data.page;
    page++;
    that.setData({
      page: page
    });
    if (isMore) {
      console.log("已完成或正在加载");
    } else {
      that.requestHistoryList();
    }
  },

  //日报明细
  toDailyDetail:function(e){
    var that = this;
    var date = e.currentTarget.dataset.day;
    wx.navigateTo({
      url: '/subpages/dailyDetail/dailyDetail?date='+date,
    })
  },
})