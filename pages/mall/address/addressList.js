
Page({

  /**
   * 页面的初始数据
   */
  data: {
    data: [],
    current: 1, // 请求页码
    loadStatus: true,
    type: '', // 进来不同页面
    way: '' ,// 跳转不同类型页面
    noDataFlag:false,//无数据
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getAddressList(1);
    this.setData({
      type: options.type
    })
    console.log(options)
  },
  getAddressList(current) {
    const that = this;
    let params = {
      header: {},
      body: {
        userId: wx.getStorageSync('userId'),
        pageSize: 10,
        pageNum: current
      }
    };
    getApp().API.getAddressList(params).then( data => {
      if(data.code == 0) {
        that.setData({data: data.data.records});
        if(data.data.records.length < 10) {
          that.setData({loadStatus: false})
          if(data.data.records.length < 1) {
            that.setData({noDataFlag: true})
          }
        } else {
          let pageNumber = that.data.current + 1;
          that.setData({
            current: pageNumber,
            loadStatus: true
          })
        }
      }

      //解决默认地址bug
      let addressInfo = wx.getStorageSync('addressInfo');
      console.log(addressInfo);
      for(let i in that.data.data){
        if(addressInfo.id == that.data.data[i].id){
          console.log(that.data.data[i]);
          addressInfo = Object.assign(addressInfo, { isSelect: that.data.data[i].isSelect});
          wx.setStorageSync('addressInfo', addressInfo)
        }
      }

    }).catch( err => {
      console.log(err)
    })

  },
  // 跳转编辑地址
  toedit(e) {
    wx.navigateTo({
      url: `addressEdit?type=${this.data.type}&way=edit&siteId=${e.target.dataset.id}`
    });
  },
  // 跳转添加地址
  toadd() {
    wx.navigateTo({
      url: `addressEdit?type=${this.data.type}&way=add`
    });
  },
  getData(e) { // 选择地址(废弃)
    let addressInfo = JSON.stringify(e.currentTarget.dataset.type);
    wx.setStorageSync('addressInfo', addressInfo);
  },
  onReachBottom: function() {
    if(this.data.loadStatus) {
      this.getAddressList(this.data.current)
    }
  },
  /**
   * 选择地址
   */
  chooseAddress(e){
    let index = e.currentTarget.dataset.index;
    let addressChooseData = this.data.data[index];
    wx.setStorageSync('addressInfo', addressChooseData);
    wx.navigateBack();
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
    this.setData({
      current: 1
    })
    this.getAddressList(1);
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