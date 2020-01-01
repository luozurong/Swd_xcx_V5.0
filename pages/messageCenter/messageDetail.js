// pages/message-center/messageDetail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataSource: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getMessage(options.type);
  },
  getMessage(type) {
    const that = this;
    let params = {
      header: {},
      body: {
        userId: wx.getStorageSync('userId'),
        pushMethod: ''
        // userId: 'user1',
      }
    };
    getApp().API.getMessage(params).then( data => {
      if(data.code == 0) {
        // that.setData({data: data.data.records});
        // debugger
        // let Connecting = []; // 健管师
        // let physician = []; // 医师
        // let pharmacist = []; // 药师
        // let logistics = []; // 物流
        // let mall = []; // 商城
        // let friend = []; // 亲友
        // let service = []; // 客服
        let dataSource = data.data;
        let dataAll = [];
        let dataId = [];
        // let 
        for(let i=0; i < dataSource.length; i++) {
          switch(dataSource[i].roleName) {
            case type: 
              dataAll.push(dataSource[i]);
              dataId.push(dataSource[i].id);
              break;
          }
        }
        that.setData({dataSource: dataAll});
        that.pageScrollToBottom();
        that.getReaded(dataId.join(','))
      }
    }).catch( err => {
      console.log(err)
    })
  },
  getReaded(id) {
    const that = this;
    let params = {
      header: {},
      body: {
        id: id,
      }
    };
    getApp().API.getReaded(params).then( data => {
      if(data.code == 0) {
        console.log(data.data)
      }
    }).catch( err => {
      console.log(err)
    })
  },
  pageScrollToBottom: function() {
    wx.createSelectorQuery().select('#j_page').boundingClientRect(function(rect){
      // 使页面滚动到底部
      console.log(rect.bottom)
      wx.pageScrollTo({
        scrollTop: rect.bottom,
        duration: 0
      })
    }).exec()
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

  }
})