var Moment = require("../../utils/moment.js");
const app = getApp()
Page({



  /**

   * 页面的初始数据

   */

  data: {

    　　//初始化为空
    img_arr:[],
    source: '',
    indeximg:0,
    qh:0,
  },



  /**
  
   * 上传图片
  
   */

  uploadimg: function () {

    var that = this;

    wx.chooseImage({  //从本地相册选择图片或使用相机拍照

      count: 3, // 默认9

      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有

      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有



      success: function (res) {

        console.log(that.data.img_arr)

        //前台显示
        that.data.img_arr[that.data.indeximg] = res.tempFilePaths;
        var index = that.data.indeximg + 1;
        that.setData({
          img_arr: that.data.img_arr,
          source: res.tempFilePaths,
          indeximg:index
        })



        console.log(res.tempFilePaths);
    return false

        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片

      
      }

    })

  },
  del:function(e){
    var id=e.currentTarget.dataset.id
    var data=this.data.source
    
    data.splice(id, 1); 
    console.log(data)  
     this.setData({
       source:data
     })
  },

  qh:function(e){
   var qh=e.detail.value
   console.log(qh)
  this.setData({
    qh:qh
  })
  


  },
  onLoad:function(e){
    if(e){
      this.setData({
        xiaoqu_id:e.id
      })
    }


  },
  upload:function(){
    var tempFilePaths = this.data.source
    
    if (tempFilePaths==""){

      wx.showModal({
        title: '提示',
        content: '请选择图片上传',
        showCancel: false,

      })

    }


    var data = {};
    data.map = 'applet_sequence_upload_xianlu';
    data.xiaoqu_id = this.data.xiaoqu_id
    console.log(tempFilePaths)
    data.qh=this.data.qh
   
    wx.uploadFile({

      url: app.globalData.requestUrl + "&map=" + data.map + "&xiaoqu_id=" + data.xiaoqu_id + "&qh=" + data.qh,

      filePath: tempFilePaths[0],

      name: 'file',

      formData: {
        data,

      },

      success: function (res) {
        
        for (var i=0; i < tempFilePaths.length;i++){

       console.log(i)
        wx.uploadFile({

          url: app.globalData.requestUrl + "&map=" + data.map + "&id=" + res.data,

          filePath: tempFilePaths[i],

          name: 'file',

          formData: {
            data,

          },
          success:function(){


          }
        })
        }
        //打印
    console.log(res)
        if(res.data){
          wx.showModal({
            title: '提示',
            content: '上传成功',
            showCancel: false,
            success:function(){
              wx.redirectTo({
               url: '/pages/upload/upload',
               
             })
            }
          })
        }else{
          wx.showModal({
            title: '提示',
            content: '上传失败',
            showCancel: false,

          })
        }

      }

    })
  }
})