// pages/personalCenter/familyManage/familyManage.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataSource: [],
    current: 1, // 请求页码
    loadStatus: true,
    noDataFlag:false,//无数据
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getPatientList(1);
  },
  getPatientList(current) {
    const that = this;
    let params = {
      header: {},
      body: {
        roleId: wx.getStorageSync('userId'),
        // roleId: 1541896,
        // pageSize: 10,
        // pageNum: current
      }
    };
    getApp().API.getPatientList(params).then( data => {
      if(data.code == 0) {
        that.setData({dataSource: data.data.memberList});
        console.log(that.data.dataSource)
        if(data.data.memberList.length < 10) {
          that.setData({loadStatus: false})
          if(data.data.memberList.length < 1) {
            that.setData({noDataFlag: true})
          }
        } else {
          let pageNumber = that.data.current + 1;
          that.setData({
            current: pageNumber,
            loadStatus: true
          })
          that.setData({noDataFlag:false})
        }
      }
    }).catch( err => {
      console.log(err)
    })

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  onClose(event) {
    const { position, instance } = event.detail;
    console.log(instance.id)
    const that = this;
    let params = {
      header: {},
      body: {
        patientId: instance.id,
        // roleId : 1541896,
        editType : '1',
        roleId: wx.getStorageSync('userId')
      }
    };
    getApp().API.savePatientInfo(params).then( data => {
      if(data.code == 0) {
        wx.showToast({
          title: '删除成功！',
          icon: 'none',
          duration: 2000
        });
        that.getPatientList(1);
      }else {
        wx.showToast({
          title: '删除失败！',
          icon: 'none',
          duration: 2000
        });
      }
    })
  },
  tofamily(e) { // 编辑亲友
    let dataInfo = e.currentTarget.dataset.info;
    dataInfo = JSON.stringify(dataInfo)
    wx.navigateTo({
      url: `./addFamily?type=1&dataInfo=${dataInfo}`
    });
  },
  addfamily() { // 添加亲友
    wx.navigateTo({
      url: `./addFamily?type=0`
    });
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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
    if(this.data.loadStatus) {
      this.getPatientList(this.data.current)
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})