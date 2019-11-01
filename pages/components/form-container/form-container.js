// components/custom-notice.js
var app = getApp()
app.onHide = function () {
  if (app.globalData.formIds&&app.globalData.formIds.length) {
    var formIds = app.globalData.formIds;
    app.globalData.formIds = [];
    wx.request({
      url: app.globalData.requestUrl,
      data: {
        map: 'applet_save_form_id',
        formIds: formIds
      },
      success: function (res) {
      },
    });
  }
}
Component({
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
  },

  /**
   * 组件的方法列表
   */
  methods: {
    formSubmit: function (e) {
      var that = this;
      console.log(e);
      let formId = e.detail.formId;
      let formIds = app.globalData.formIds ? app.globalData.formIds:[];
      let data = {
        formId: formId,
        expire:parseInt(new Date().getTime()/1000)+604800
      }

      if (formId != 'the formId is a mock one' && formId != 'undefined'){
        formIds.push(data);
      }
      app.globalData.formIds = formIds;
    }
  }
})
