// pages/personalCenter/mydoctor/mydoctor.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataSource: [],
    noDataFlag: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // this.getMyDoctorList();
  },
  todoctorPage() {
    wx.navigateTo({
      url: '../../doctorPage/index'
    });
      
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  getMyDoctorList() { // 获取医生列表
    const that = this;
    let params = {
      header: {},
      body: {
        roleId: 94
      }
    };
    getApp().API.getMyDoctorList(params).then( data => {
      if(data.code == 0) {
        that.setData({dataSource: data.data})
      }
    }).catch( err => {
      wx.showToast({
        title: err,
        icon: 'none',
        duration: 2000
      });
    })
  }
})