// pages/mall/cart/shopCart.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageNum: 1,
    isLoad: true,
    overFlag: false,   //false整理、true完成
    records: [],
    specialRecords: [],
    chooseAllFlag: false,
    chooseProduct: 0,
    chooseProductArr: [],
    choooseCount: 0,
    isNoData: false,
    cancelFlag: false,
    confirmFlag: false,
    unEfficacyCommodity: [], //失效商品列表
    shopCartCheck: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //this.getShopCarListRequest();
    this.recommendComList();
  },
  /**
   * 购物车列表
   */
  getShopCarListRequest(){
    let that = this;
    let params = {
      header: {},
      body: {
        userId: wx.getStorageSync('userId'),
        pageSize: 100,
        pageNum: this.data.pageNum
      }
    }
    wx.showLoading({
      title: '加载中',
    })
    getApp().API.getShopCarList(params).then((res) => {
      wx.hideLoading();
      if (res.code == 0) {
        let recordsDataTamp = res.data.records;
        for (let i in recordsDataTamp) {
          if (recordsDataTamp[i].label && recordsDataTamp[i].label.indexOf("；") != -1) {
            recordsDataTamp[i].labelArr = recordsDataTamp[i].label.split("；");
          }else {
            let label = [];
            label.push(recordsDataTamp[i].label)
            recordsDataTamp[i].labelArr = label;
          }

          if (recordsDataTamp[i].status == 1){
            recordsDataTamp[i].inventory = 0;
          }
          recordsDataTamp[i].pricePre = parseInt(recordsDataTamp[i].price);
          recordsDataTamp[i].priceNext = '.' + String(parseFloat(recordsDataTamp[i].price).toFixed(2)).split('.')[1];
        }

        let recordsTamp = that.data.records.concat(recordsDataTamp);
        that.setData({
          records: recordsTamp
        });

        if (recordsDataTamp.length < 100) {
          that.setData({
            isLoad: false
          })
        } else {
          let pageNum = that.data.pageNum += 1
          that.setData({
            pageNum: pageNum,
            isLoad: true
          })
        }

        if (that.data.records.length == 0) {
          that.setData({
            isNoData: true
          })
        } else {
          that.setData({
            isNoData: false
          })
        }

        that.chooseFunc();
      }
    });
  },

  /**
   * 商品增加
   */
  addShopCartNum(e){
    let i = e.target.dataset.index;
    let shopCartRecordNum = this.data.records;
    if (shopCartRecordNum[i].qty < shopCartRecordNum[i].inventory) {
      shopCartRecordNum[i].qty ++;
    }else{
      wx.showToast({
        title: '亲，没有这么多库存了',
        icon: 'none'
      })
    }
    console.log(shopCartRecordNum)
    this.setData({
      records: shopCartRecordNum
    });

    this.chooseFunc();

    this.changeCarNumRequest(shopCartRecordNum[i].id, shopCartRecordNum[i].qty)
  },

  /**
   * 商品减少
   */
  subShopCartNum(e) {
    let that = this;
    let i = e.target.dataset.index;
    let shopCartRecordNum = this.data.records;
    if (shopCartRecordNum[i].qty > 1){
      shopCartRecordNum[i].qty -= 1;
    }else{
      wx.showModal({
        title: '删除',
        content: '确认删除选中商品？',
        success(res) {
          if (res.confirm) {
            that.delShopCarRequest(shopCartRecordNum[i].id, i)
          } else if (res.cancel) {}
        }
      })
    } 
    this.setData({
      records: shopCartRecordNum
    });

    this.chooseFunc(); 
    this.changeCarNumRequest(shopCartRecordNum[i].id,shopCartRecordNum[i].qty);
  },

  inputChange(e){
    let num = Number(e.detail.value);
    let index = parseInt(e.target.dataset.index);

    if (Number(num) == 0) {
      num = 1;
    } 

    let recordsTamp = this.data.records;
    if (num < recordsTamp[index].inventory) {
      recordsTamp[index].qty = num;
      e.detail.value = num;
    } else {
      recordsTamp[index].qty = recordsTamp[index].inventory;
      e.detail.value = recordsTamp[index].inventory;
      wx.showToast({
        title: '亲，没有这么多库存了',
        icon: 'none'
      })
    }

    this.setData({
      records: recordsTamp
    })

    console.log(num);
    this.chooseFunc();
    this.changeCarNumRequest(recordsTamp[index].id, recordsTamp[index].qty);
  },

  /**
   * 保存单个购物车数量
   */
  changeCarNumRequest(carComId, num){
    let that = this;
    let params = {
      header: {},
      body: {
        carComId: carComId,
        num: num
      }
    }

    getApp().API.changeCarNum(params).then((res)=>{
      if (res.code == 0) {

      }
    })
  },

  /**
   * 是否选中
   */
  isChoose(e){
    let index = e.target.dataset.index;
    let recordsTamp = this.data.records;
    let flag = recordsTamp[index].isSelect;
    recordsTamp[index].isSelect = flag == 0 ? 1 : 0;

    this.setData({
      records: recordsTamp
    })

    this.changeSelectRequest(recordsTamp[index].id,recordsTamp[index].isSelect);
  },

  /**
   * 选中某个商品
   */
  changeSelectRequest(carComId, flag){
    let that = this;
    let params = {
      header: {},
      body: {
        carComId: carComId,
        flag: flag
      }
    }

    getApp().API.changeSelect(params).then((res) => {
      if (res.code == 0) {
        that.chooseFunc();
      }
    })
  },

  /**
   * 全选
   */
  chooseAll(){
    let chooseAllFlag = this.data.chooseAllFlag ? false : true;
    let recordsTamp = this.data.records
    let ids = []
    for (let i in recordsTamp){
      if (chooseAllFlag)
        recordsTamp[i].isSelect = 1;
      else
        recordsTamp[i].isSelect = 0;
      ids.push(recordsTamp[i].id);
    }

    this.setData({
      chooseAllFlag: chooseAllFlag,
      records: recordsTamp
    });
    let flag = chooseAllFlag ? 1 : 0; 
    ids = ids.join(";");
    this.chooseAllRequest(ids, flag);

    this.chooseFunc();
  },

  chooseAllRequest(ids,isSelect){
    let that = this;
    let params = {
      header: {},
      body: {
        ids: ids,
        isSelect: isSelect
      }
    }

    getApp().API.chooseAll(params).then((res)=>{
      if (res.code == 0) { }
    })
  },

  /**
   * 选择商品
   */
  chooseFunc(){
    let recordsTamp = this.data.records;
    let selectNum = 0;
    let productNum = 0;
    let chooseProductNum = 0;
    let choooseCountTamp = 0;
    let chooseProductArr = [];
    for (let i in recordsTamp){
      if(this.data.shopCartCheck) {
        if(recordsTamp[i].inventory) {
          productNum++;
          if (recordsTamp[i].isSelect){
            selectNum++;
            chooseProductArr.push(recordsTamp[i]);
            chooseProductNum += recordsTamp[i].qty;
            choooseCountTamp += recordsTamp[i].qty * recordsTamp[i].price;
          }
        }
      }else {
        productNum++;
        if (recordsTamp[i].isSelect){
          selectNum++;
          chooseProductArr.push(recordsTamp[i]);
          chooseProductNum += recordsTamp[i].qty;
          choooseCountTamp += recordsTamp[i].qty * recordsTamp[i].price;
          chooseProductArr.push(recordsTamp[i]);
        }
      }
    }
    let chooseAllFlagTamp = selectNum == productNum ? true : false;

    this.setData({
      chooseProductArr: chooseProductArr,
      chooseProduct: chooseProductNum,
      choooseCount: choooseCountTamp.toFixed(2),
      chooseAllFlag: chooseAllFlagTamp
    })
  },

  /**
   * 删除商品
   */
  shopCartDelete(e){
    let that = this;
    let index = e.target.dataset.index;
    wx.showModal({
      title: '删除',
      content: '确认删除选中商品？',
      success(res) {
        if (res.confirm) {
          that.delShopCarRequest(that.data.records[index].id, index)
        } else if (res.cancel) {
  
        }
      }
    })
  },
  delShopCarRequest(id,index){
    let that = this;
    let params = {
      header: {},
      body: {
        id: id
      }
    }

    getApp().API.delShopCar(params).then((res)=>{
      if (res.code == 0) {
        let recordsTamp = that.data.records;
        recordsTamp.splice(index, 1);
        that.chooseFunc();

        setTimeout(() => {
          that.setData({
            records: recordsTamp
          })
        }, 300);
        if (recordsTamp == 0) {
          that.setData({
            isNoData: true
          })
        }
        wx.showToast({
          title: '删除成功',
        })
      }
    })
  },

  /**
   * 跳转确认订单
   */
  jumpOrderConfirm(){
    this.preOrderFunc();
    let comList = wx.getStorageSync('comList');
    console.log(JSON.parse(JSON.stringify(comList)));
    if (JSON.parse(JSON.stringify(comList)).length == 0){
      wx.showToast({
        title: '请选择商品',
        icon: 'none'
      })
      return false;
    }
    wx.setStorage({
      key: "remark",
      data: ""
    })
    wx.navigateTo({
      url: '../orderConfirm/orderConfirm?isDeleteShopCartProduct=1',
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },

  /**
   * 预下单获取去数据
   */
  preOrderFunc(){
    let recordsTamp = this.data.records;
    let comList = []
    for (let i in recordsTamp) {
      if (recordsTamp[i].isSelect == 1 && recordsTamp[i].inventory > 0){
        var comListTamp = {}
        comListTamp.comId = recordsTamp[i].comId;
        comListTamp.columnId = recordsTamp[i].columnId;
        comListTamp.qty = recordsTamp[i].qty;
        comList.push(comListTamp);
      }
    }
    wx.setStorageSync('comList', comList);
  },
  
  /**
   * 跳转到商品详情
   */
  jumpProductDetail(e){
    let id = e.currentTarget.dataset.id;
    let columnId = e.currentTarget.dataset.columnid;
    let isRx = e.currentTarget.dataset.isrx;
    console.log(e);
    if (!columnId){
      columnId = -1
    }
    let url = '';
    if(isRx == 1){
      url = `/pages/mall/product/productDetail/productDetail?comId=${id}&columnId=${columnId}&shareUserId=0&isRx=1`;
    }else{
      url = `/pages/mall/product/productDetail/productDetail?comId=${id}&columnId=${columnId}&shareUserId=0`
    }
    wx.navigateTo({
      url: url,
    })
  },

  /**
   * 跳转到南风医生药房
   */
  jumpDrug(){
    wx.navigateTo({
      url: '/pages/mall/drug/drug?parentId=1000000018&paramsIndex=1',
    })
  },

  /**
   * 整理
   */
  edit(){
    this.setData({
      overFlag: true,
      shopCartCheck: false,
    })
  },

  /**
   * 完成
   */
  over(){
    this.setData({
      overFlag: false,
      shopCartCheck: true,
    })
    this.chooseFunc();
  },

  /**
   * 快速清理失效商品
   */
  cancelShopCartProduct(){
    this.getUnEfficacyCommodityRequest();
    // this.setData({
    //   cancelFlag: true
    // })
  },

  /**
   * 失效商品列表
   */
  getUnEfficacyCommodityRequest(){
    let that = this;
    let params = {
      header: {},
      body: {
        userId: wx.getStorageSync("userId")
      }
    }
    getApp().API.getUnEfficacyCommodity(params).then(res => {
      if(res.code == 0){
        this.setData({
          unEfficacyCommodity: res.data
        });

        if (this.data.unEfficacyCommodity.length == 0) {
          wx.showToast({
            title: '暂无失效商品',
            icon: 'none'
          })
        } else {
          this.setData({
            cancelFlag: true
          })
        }
      }
    })
  },

  /**
   * 取消
   */
  cancelBtn(){
    this.setData({
      cancelFlag: false
    })
  },

  /**
   * 失效商品确认删除
   */
  sureBtn(){
    let that = this;
    let ids = [];
    for (let i in this.data.unEfficacyCommodity){
      ids.push(this.data.unEfficacyCommodity[i].id)
    }
    this.delBatchShopCarRequest(ids);
  },

  /**
   * 批量删除商品请求
   */
  delBatchShopCarRequest(ids){
    let that = this;
    let params = {
      header: {},
      body: {
        ids: ids
      }
    }
    getApp().API.delBatchShopCar(params).then(res => {
      if (res.code == 0 && res.data.isSuccess) {
        wx.showToast({
          title: '删除成功'
        });
        that.getShopCarListRequest();
        this.setData({
          cancelFlag: false,
          records: []
        })
      } else {
        wx.showToast({
          title: '删除失败',
          icon: 'none'
        });
      }
    })
  },

  /**
   * 批量删除商品
   */
  cancelProduct(){
    let that = this;
    let ids = [];
    for (let i in this.data.records){
      if(this.data.records[i].isSelect == 1){
        ids.push(this.data.records[i].id);
      }
    }
    console.log(ids);
    if(ids.length == 0){
      wx.showToast({
        title: '请选择需要删除的商品',
        icon: 'none'
      })
      return false;
    }
    wx.showModal({
      title: '删除',
      content: '确认删除选中商品？',
      confirmColor: '#ff6e26',
      success(res) {
        if (res.confirm) {
          that.delBatchShopCarRequest(ids);
        } else if (res.cancel) {}
      }
    })
  },

  /**
   * 特推商品
   */
  recommendComList(){
    let that = this;
    let params = {
      header: {},
      body: {}
    }
    getApp().API.recommendComList(params).then(res => {
      if (res.code == 0) {
        console.log(res);
        let recordsTamp = res.data.records; 
        
        for (let i in recordsTamp) {
          if (recordsTamp[i].label && recordsTamp[i].label.indexOf("；") != -1) {
            recordsTamp[i].labelArr = recordsTamp[i].label.split("；");
          } else {
            let label = [];
            label.push(recordsTamp[i].label)
            recordsTamp[i].labelArr = label;
          }

          recordsTamp[i].pricePre = parseInt(recordsTamp[i].price);
          recordsTamp[i].priceNext = '.' + String(parseFloat(recordsTamp[i].price).toFixed(2)).split('.')[1];

          recordsTamp[i].salePricePre = parseInt(recordsTamp[i].salePrice);
          recordsTamp[i].salePriceNext = '.' + String(parseFloat(recordsTamp[i].salePrice).toFixed(2)).split('.')[1];

          recordsTamp[i].specialPricePre = parseInt(recordsTamp[i].specialPrice);
          recordsTamp[i].specialPriceNext = '.' + String(parseFloat(recordsTamp[i].specialPrice).toFixed(2)).split('.')[1];
        }
        that.setData({
          specialRecords: recordsTamp
        })
        console.log(this.data.specialRecords);
      }
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
    this.setData({
      records: []
    })
    this.getShopCarListRequest();
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
    if (!this.data.isLoad) return false;
    this.getShopCarListRequest()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})