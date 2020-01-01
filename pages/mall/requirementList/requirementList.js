// pages/mall/requirementtList/requirementtList.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isNoData: false,
    overFlag: false,
    choooseCount: 0,
    records: [],
    shopCartNum: 0,
    count: 0,
    pageNum: 1,
    isLoading: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   
  },

  /**
   * 需求清单列表
   */
  getRequirementList(){
    let that = this;
    let params = {
      header: {},
      body: {
        userId: wx.getStorageSync('userId'),
        pageSize: 10,
        pageNum: this.data.pageNum
      }
    }
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    getApp().API.getRequirementList(params).then( res => {
      wx.hideLoading();
      if(res.code == 0){
        let recordsDataTamp = res.data.records;
        for (let i in recordsDataTamp) {
          if (recordsDataTamp[i].label && recordsDataTamp[i].label.indexOf("；") != -1) {
            recordsDataTamp[i].labelArr = recordsDataTamp[i].label.split("；");
          } else {
            let label = [];
            label.push(recordsDataTamp[i].label)
            recordsDataTamp[i].labelArr = label;
          }
          if (recordsDataTamp[i].status == 1) {
            recordsDataTamp[i].inventory = 0;
          }
          recordsDataTamp[i].pricePre = parseInt(recordsDataTamp[i].price);
          recordsDataTamp[i].priceNext = '.' + String(parseFloat(recordsDataTamp[i].price).toFixed(2)).split('.')[1];
          
          if (recordsDataTamp[i].salePrice){
            recordsDataTamp[i].salePricePre = parseInt(recordsDataTamp[i].salePrice);
            recordsDataTamp[i].salePriceNext = '.' + String(parseFloat(recordsDataTamp[i].salePrice).toFixed(2)).split('.')[1];
          }
          
          if (recordsDataTamp[i].specialPrice){
            recordsDataTamp[i].specialPricePre = parseInt(recordsDataTamp[i].specialPrice);
            recordsDataTamp[i].specialPriceNext = '.' + String(parseFloat(recordsDataTamp[i].specialPrice).toFixed(2)).split('.')[1];
          }
        }
        let recordsTamp = that.data.records.concat(recordsDataTamp);
        that.setData({
          records: recordsTamp
        });
        console.log(that.data.records);
        if (that.data.records.length == 0) {
          that.setData({
            isNoData: true
          })
        }

        if(recordsDataTamp.length < 10){
          that.setData({
            isLoading: false
          })
        }else{
          let pageNum = this.data.pageNum;
          pageNum += 1;
          that.setData({
            pageNum: pageNum
          })
        }
        that.requiremantTotal();
      }
    })
  },

  /**
   * 预下单获取去数据
   */
  preOrderFunc() {
    let recordsTamp = this.data.records;
    let comList = []
    for (let i in recordsTamp) {
      if (recordsTamp[i].isSelect == 1 && recordsTamp[i].inventory > 0) {
        var comListTamp = {}
        comListTamp.comId = recordsTamp[i].comId;
        comListTamp.columnId = recordsTamp[i].columnId;
        comListTamp.qty = recordsTamp[i].qty;
        comList.push(comListTamp);
      }
    }
    if (comList.length > 5) {
      wx.showToast({
        title: '最多只能勾选5种药品',
        icon: 'none'
      })
      return false;
    }else{
      wx.setStorageSync('comList', comList);
      return true
    }
   
  },

  /**
   * 跳转确认订单
   */
  jumpOrderConfirm() {
    if(!this.preOrderFunc()){
      return false;
    }
    let comList = wx.getStorageSync('comList');
    console.log(JSON.parse(JSON.stringify(comList)));
    if (JSON.parse(JSON.stringify(comList)).length == 0) {
      wx.showToast({
        title: '请选择商品',
        icon: 'none'
      })
      return false;
    } else if (JSON.parse(JSON.stringify(comList)).length > 5){
      wx.showToast({
        title: '最多只能勾选5种药品！',
        icon: 'none'
      })
      return false;
    }
    wx.setStorageSync('patientInfo', {})
    wx.setStorage({
      key: "remark",
      data: ""
    })
    wx.navigateTo({
      url: '../orderConfirm/orderConfirm?isDeleteShopCartProduct=1&isRx=1&confirmOrderSource=4',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },

  /**
   * 删除商品
   */
  shopCartDelete(e){
    console.log(e);
    let that = this;
    let index = e.currentTarget.dataset.index;
    wx.showModal({
      title: '删除',
      content: '确认删除选中商品？',
      success(res) {
        if (res.confirm) {
          that.delRequirement(index)
        } else if (res.cancel) {}
      }
    })
  },
  /**
   * 删除清单商品请求
   */
  delRequirement(index){
    let that = this;
    let params = {
      header: {},
      body: { id: that.data.records[index].id}
    }
    getApp().API.delRequirement(params).then(res=>{
      console.log(res);
      if(res.code == 0){
        let recordsTamp = that.data.records;
        recordsTamp.splice(index, 1);
        that.setData({
          records: recordsTamp
        })
        if(that.data.records.length == 0){
          that.setData({
            isNoData: true
          })
        }
      }
    });
  },

  /**
   * 选择商品
   */
  isChoose(e){
    let index = e.target.dataset.index;
    let recordsTamp = this.data.records;
    let num = 0;
    for (let i in recordsTamp){
      if(recordsTamp[i].isSelect == 1 && recordsTamp[i].inventory > 0){
        num += 1;
      }
    }

    if (num < 5) {
      let flag = recordsTamp[index].isSelect;
      if (recordsTamp[index].isSelect == 0){
        let ids = [];
        for (let i in recordsTamp) {
          if (recordsTamp[i].isSelect == 1) {
            ids.push(recordsTamp[i].comId)
          }
        }
        ids.push(recordsTamp[index].comId);
        this.queryRxDrugs(ids, index);
       
      }else {
        this.requirementListChangeSelect(recordsTamp[index].id, 0, index);
      }
    } else {
      if (this.data.records[index].isSelect == 1) {
        let flag = recordsTamp[index].isSelect;
        recordsTamp[index].isSelect = flag == 0 ? 1 : 0;
        this.setData({
          records: recordsTamp
        })
        this.requirementListChangeSelect(recordsTamp[index].id, recordsTamp[index].isSelect, index);
      } else {
        wx.showToast({
          title: '最多只能勾选5种药品！',
          icon: 'none'
        })
        return false;
      }
    }
  },

  /**
   * 保存商品选择状态
   */
  requirementListChangeSelect(ids, isSelect, index) {
    var params = {
      header: {},
      body: {
        carComId: ids,
        flag: isSelect
      }
    };
    getApp().API.requirementListChangeSelect(params).then(res => {
      if (res.code == 0 && res.data.isSuccess) {
        let recordsTamp = this.data.records;
        recordsTamp[index].isSelect = isSelect;
        this.setData({
          records: recordsTamp
        })
        this.requiremantTotal();
      }
    });
  },

  /**
   * 计算价格
   */
  requiremantTotal() {
    let ids = [];
    let count = 0;
    let shopCartNum = 0;
    for (let i = 0; i < this.data.records.length; i++) {
      let tmpQty = Number(this.data.records[i].qty);
      if (this.data.records[i].inventory > 0 && this.data.records[i].isSelect == 1) {
        count += this.data.records[i].price * this.data.records[i].qty;
        shopCartNum += tmpQty;
      }
    }
    this.setData({
      count: count.toFixed(2),
      shopCartNum: shopCartNum
    })
  },

  /**
   * 跳转到商品详情
   */
  jumpProductDetail(e){
    console.log(e);
    let columnId = e.currentTarget.dataset.columnid;
    let id = e.currentTarget.dataset.id;
    let isRx = e.currentTarget.dataset.isRx
    let url = `/pages/mall/product/productDetail/productDetail?comId=${id}&columnId=${columnId}&shareUserId=0&isRx=1`;
    wx.navigateTo({
      url: url
    })
  },

  /**
   * 跳转到南风医生药房
   */
  jumpDrug() {
    wx.navigateTo({
      url: '/pages/mall/drug/drug?parentId=1000000018&paramsIndex=1',
    })
  },

  /**
   * 商品数量加
   */
  addShopCartNum(e){
    console.log(e);
    let index = e.currentTarget.dataset.index;
    let recordsTamp = this.data.records;
    if (recordsTamp[index].maxQuantity){
     if(recordsTamp[index].qty < recordsTamp[index].maxQuantity){
        console.log('成功');
      }else{
       wx.showToast({
         title: `药品的最大数量不能超过${recordsTamp[index].maxQuantity}个`,
         icon: 'none',
       });
       return false;
      }
    } 
    recordsTamp[index].qty += 1;
    if (recordsTamp[index].qty <= recordsTamp[index].inventory){
      this.setData({
        records: recordsTamp
      })
    }else{
      wx.showToast({
        title: '亲，没有这么多库存了',
        icon: 'none',
      });
    }
    this.changeRequirementNum(recordsTamp[index].id, recordsTamp[index].qty)
  },

  /**
   * 商品数量减
   */
  subShopCartNum(e) {
    let that = this;
    let index = e.currentTarget.dataset.index;
    let recordsTamp = this.data.records;
    if(recordsTamp[index].qty == 1){
      wx.showModal({
        title: '删除',
        content: '确认删除选中商品？',
        success(res) {
          if (res.confirm) {
            that.delRequirement(index)
          } else if (res.cancel) {

          }
        }
      })
    }else{
      recordsTamp[index].qty -=1;
      this.setData({
        records: recordsTamp
      })
    }
    this.changeRequirementNum(recordsTamp[index].id,recordsTamp[index].qty)
  },

  /**
   * 输入修改数量
   */
  inputChange(e) {
    let num = Number(e.detail.value);
    let index = parseInt(e.target.dataset.index);

    if (Number(num) == 0) {
      num = 1;
    }
    let recordsTamp = this.data.records;
    let flag = false;
    if (recordsTamp[index].maxQuantity) {
      if (num < recordsTamp[index].maxQuantity) {
        console.log('成功');
      } else {
        wx.showToast({
          title: `药品的最大数量不能超过${recordsTamp[index].maxQuantity}个`,
          icon: 'none',
        });
        flag = true;
      }
    } 
    if (num < recordsTamp[index].inventory) {
      console.log("成功")
    } else {
      wx.showToast({
        title: '亲，没有这么多库存了',
        icon: 'none'
      })
      flag = true
    }
    var valueTamp;
    if (recordsTamp[index].maxQuantity){
      valueTamp= [num, recordsTamp[index].inventory, recordsTamp[index].maxQuantity];
    }else{
      valueTamp = [num, recordsTamp[index].inventory];
    }
    var value = valueTamp[0];
    for(let i in valueTamp){
      if (value > valueTamp[i] ){
        value = valueTamp[i];
      }
    }
    recordsTamp[index].qty = value;
    this.setData({
      records: recordsTamp
    })
    this.changeRequirementNum(recordsTamp[index].id, recordsTamp[index].qty)
  },

  /**
   * 修改数量请求
   */
  changeRequirementNum(carComId, num) {
    var params = {
      header: {},
      body: {
        carComId: carComId,
        num: num
      }
    };
    getApp().API.changeRequirementNum(params).then(res => {
      if (res.code == 0) {
        this.requiremantTotal();
      }
    });
  },

  /**
   * 根据处方药商品id列表，查询对应的处方药的详细数据
   */
  queryRxDrugs(commodityIds,index) {
    let params = {
      header: {},
      body: {
        commodityIds: commodityIds
      }
    }
    getApp().API.queryRxDrugs(params).then(res => {
      if (res.code == 0) {
        let queryRxDrugsTamp = res.data;
        for (let i in queryRxDrugsTamp) {
          let apDrugName = queryRxDrugsTamp[i].apDrugName;
          if (queryRxDrugsTamp[i].preCheck != null && queryRxDrugsTamp[i].preCheck.incoList.length > 0) {
            for (let j in queryRxDrugsTamp[i].preCheck.incoList) {
              for (let k in queryRxDrugsTamp) {
                if ((i != k) && (queryRxDrugsTamp[i].preCheck.incoList[j].incoDrugName == queryRxDrugsTamp[k].apDrugName)) {
                  wx.showToast({
                    title: queryRxDrugsTamp[k].apDrugName + '与' + queryRxDrugsTamp[i].preCheck.incoList[j].apDrugName + "存在禁忌",
                    icon: 'none'
                  })
                  return false;
                }
              }
            }
          }
        }
        this.requirementListChangeSelect(this.data.records[index].id, 1, index);
      }else{
        wx.showToast({
          title: '选取失败',
        })
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
    this.getRequirementList();
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
    if(this.data.isLoading){
      this.getRequirementList();
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})