// pages/chat/patient/patientInformation.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    patientImgPath: 'https://nfys-static.kinglian.cn/xcx/personalCenter/user.png',
    ageText: '',
    patientName: '',
    patientGender: '',
    healthInfo: '',
    listImageUrl: [],
    familyGen:'无',
    sickTime:'',
    anamnesis:'无',
    allergy:'无'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options)
    var orderId = options.orderId;
    this.visitPatientDetail(orderId)
  },

  visitPatientDetail(orderId) {
    let params = {
      header: {},
      body: {
        orderId:orderId
        // orderId: "dba5e88df9164aaf964603edb050f218"
      }
    };
    app.API.visitPatientDetail(params).then(res => {
      console.log(res)
      if (res.code == 0) {
      var result = res.data;
        console.log(result)
        this.setData({
          listImageUrl: result.listImageUrl,
          allergy: result.allergy,
          patientName: result.patientName,
          patientImgPath: result.patientImgPath ? result.patientImgPath : this.data.patientImgPath,
          patientGender: result.patientGender,
          ageText: result.ageText,
          familyGen: result.familyGen,
          healthInfo: result.healthInfo?result.healthInfo:'-',
          sickTime: result.sickTime?result.sickTime:'-',
          anamnesis: result.anamnesis,
        })
      }
    }).catch(err => {
      console.log(err)
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  /**
   * 预览图片
   */
  priewImg(e) {
    var index = e.currentTarget.dataset.index;
    var imgArr = this.data.listImageUrl;
    wx.previewImage({
      current: imgArr[index], //当前图片地址
      urls: imgArr, //所有要预览的图片的地址集合 数组形式
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  }
})