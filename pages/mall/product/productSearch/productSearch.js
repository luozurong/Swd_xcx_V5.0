// pages/mall/product/productSearch/productSearch.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    historyFlag: true,
    historyArr: JSON.parse(JSON.stringify(wx.getStorageSync('historyArr'))) || [],
    records: [],
    current: 1,
    isLoadFlag: true,
    name: '',
    isNoData: false,
    columnType: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.columnType) {   //搜索来源 0.普通商品搜索 1.栏目商品搜索
      this.setData({
        columnType: options.columnType
      })
    } else {
      this.setData({
        columnType: 0
      })
    }
  },

  onSearch(e) {
    this.setData({
      historyFlag: false,
      name: e.detail,
      records: [],
      current: 1
    });

    let historyArrTamp = this.data.historyArr;
    historyArrTamp.unshift(e.detail);
    let historyArrTampSet = Array.from(new Set(historyArrTamp));

    this.setData({
      historyArr: historyArrTampSet
    });
    wx.setStorageSync('historyArr', historyArrTampSet);

    this.searchCommodityRequest(e.detail)
  },
  onCancel() {
    wx.navigateBack();
  },

  /**
   * 商品搜索
   */
  searchCommodityRequest(name) {
    let that = this;
    let params = {
      header: {},
      body: {
        name: name,
        size: 10,
        current: that.data.current,
        columnType: this.data.columnType
      }
    }
    getApp().API.searchCommodity(params).then((res) => {
      if (res.code == 0) {
        let recordsTampArr = res.data.records;
        let recordsTamp = recordsTampArr.concat(that.data.records);

        for (let i in recordsTamp) {
          //标签过滤
          if (recordsTamp[i].label && recordsTamp[i].label.indexOf("；") != -1) {
            recordsTamp[i].label = recordsTamp[i].label.split("；");
          } else {
            let aa = [];
            aa.push(recordsTamp[i].label)
            recordsTamp[i].labelArr = aa;
          }

          //价格过滤
          recordsTamp[i].pricePre = parseInt(recordsTamp[i].price);
          recordsTamp[i].priceNext = '.' + String(parseFloat(recordsTamp[i].price).toFixed(2)).split('.')[1];

          recordsTamp[i].specialPricePre = parseInt(recordsTamp[i].specialPrice);
          recordsTamp[i].specialPriceNext = '.' + String(parseFloat(recordsTamp[i].specialPrice).toFixed(2)).split('.')[1];

          recordsTamp[i].salePricePre = parseInt(recordsTamp[i].salePrice);
          recordsTamp[i].salePriceNext = '.' + String(parseFloat(recordsTamp[i].salePrice).toFixed(2)).split('.')[1];

          if (recordsTamp[i].imgUrl && recordsTamp[i].imgUrl.indexOf(";") != -1) {
            recordsTamp[i].imgUrl = recordsTamp[i].imgUrl.split(";")[0];
          }
        }

        if (recordsTamp.length < 10) {
          that.setData({
            isLoadFlag: false
          })
        } else {
          let currentTamp = that.data.current;
          currentTamp += 1;

          that.setData({
            current: currentTamp,
            isLoadFlag: true
          })
        }

        that.setData({
          records: recordsTamp
        });

        //缺省
        if (recordsTamp.length == 0) {
          that.setData({
            isNoData: true
          })
        } else {
          that.setData({
            isNoData: false
          })
        }
      }
    })
  },

  /**
   * 删除历史
   */
  productSearchDelete() {
    wx.removeStorageSync('historyArr');
    this.setData({
      historyArr: []
    })
  },

  onfocus() {
    this.setData({
      historyFlag: true
    })
  },

  productSearchLabel(e) {
    this.setData({
      historyFlag: false,
      name: e.target.dataset.name,
      records: [],
      current: 1
    })
    this.searchCommodityRequest(e.target.dataset.name);
  },

  /**
   * 跳转商品详情
   */
  jumpProductDetail(e){
    console.log(e);
    let columnId = e.currentTarget.dataset.columnid;
    let id = e.currentTarget.dataset.id;
    let isRx = e.currentTarget.dataset.isrx;
    let url = '';
    if (isRx == 1) {
      url = `/pages/mall/product/productDetail/productDetail?comId=${id}&columnId=${id}&shareUserId=0&isRx=1`;
    } else {
      url = `/pages/mall/product/productDetail/productDetail?comId=${id}&columnId=${id}&shareUserId=0`;
    }
    wx.navigateTo({
      url: url,
    })
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
    if (this.data.isLoadFlag){
      this.searchCommodityRequest(this.data.name);
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})