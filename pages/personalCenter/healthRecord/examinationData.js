// pages/personalCenter/healthRecord/examinationData.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isFirst: true,
    show: true,
    idcard: '',
    resData: null,
    isNoData: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    if (this.data.isFirst) {
      getApp().isLoginFlagFunc();
      this.data.isFirst = false;
    }
    if (!this.data.resData){
      this.setData({
        show: true,
      })
    }
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

  },

  /**
   * 获取一体机测量数据根据身份证
   */
  getMeasureDataBySfzh() {
    const that = this;
    let params = {
      header: {},
      body: {
        sfzh: that.data.idcard,
        // sfzh: "44142354142212512",  //临时测试
      }
    };
    wx.setStorageSync('noRequestToken', 1)
    getApp().API.getMeasureDataBySfzh(params).then(data => {
      if (data.code == 0) {
        var resData = data.data;
        if (resData.userName){
          this.setData({
            resData: resData,
            isNoData: false,
          })
        }

      }
      setTimeout(function () {
        wx.hideLoading()
      }, 500)
      wx.removeStorageSync('noRequestToken');
    }).catch(err => { 
      setTimeout(function () {
        wx.hideLoading()
      }, 500)
      wx.removeStorageSync('noRequestToken');
    })
  },

  onConfirm() {
    var idCard = this.data.idcard;
    if (!this.isCardID(idCard)) {
      wx.showToast({
        title: '请输入正确的身份证号码',
        icon: 'none',
        duration: 1000
      })
      this.setData({
        show: true,
      })
      return
    }
    wx.showLoading({
      title: '加载中..',
    })
    this.getMeasureDataBySfzh();
  },

  onClose() {

  },

  onChange(event) {
    // event.detail 为当前输入的值
    this.data.idcard = event.detail;
  },

  isCardID(sId) {
    var aCity = {
      11: "北京",
      12: "天津",
      13: "河北",
      14: "山西",
      15: "内蒙古",
      21: "辽宁",
      22: "吉林",
      23: "黑龙江",
      31: "上海",
      32: "江苏",
      33: "浙江",
      34: "安徽",
      35: "福建",
      36: "江西",
      37: "山东",
      41: "河南",
      42: "湖北",
      43: "湖南",
      44: "广东",
      45: "广西",
      46: "海南",
      50: "重庆",
      51: "四川",
      52: "贵州",
      53: "云南",
      54: "西藏",
      61: "陕西",
      62: "甘肃",
      63: "青海",
      64: "宁夏",
      65: "新疆",
      71: "台湾",
      81: "香港",
      82: "澳门",
      91: "国外"
    };
    var iSum = 0;
    var info = "";
    if (!/^\d{17}(\d|x)$/i.test(sId))
      return false;

    sId = sId.replace(/x$/i, "a");
    if (aCity[parseInt(sId.substr(0, 2))] == null)
      return false;

    var sBirthday = sId.substr(6, 4) + "-" + Number(sId.substr(10, 2)) + "-" + Number(sId.substr(12, 2));
    var d = new Date(sBirthday.replace(/-/g, "/"));
    if (sBirthday != (d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate()))
      return false;

    for (var i = 17; i >= 0; i--) {
      iSum += (Math.pow(2, i) % 11) * parseInt(sId.charAt(17 - i), 11);
    }
    if (iSum % 11 != 1) return false;
    return true;
  },
})