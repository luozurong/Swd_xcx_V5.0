
Page({

  /**
   * 页面的初始数据
   */
  data: {
    comList: [],
    freight: 0,
    orderPrice: 0,
    site: {},
    siteStatus: 0,
    siteStatusFlag: 0,
    sumPrice: 0,
    sumQty: 0,
    inquiryPrice: 0,
    hasEntity: 0,
    remark: '',
    columnId: '',
    orderNo: '',
    isDeleteShopCartProduct: '',
    isRx: null,
    patientInfo: wx.getStorageSync('patientInfo') ? wx.getStorageSync('patientInfo') : {}, //用药人信息 
    queryRxDrugsRecords: null,   //处方药品信息
    confirmOrderSource: null,    //立即购买1  购物车2  重新购买3  凭方开药4   大屏机咨询5   大屏机问诊6    处方笺7
    isDeleteShopCartProduct: '',
    loadingOver: false,
    isChangeNumFlag: false       //判断数量是否可以更改
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //this.preOrderRequest();
    
    this.setData({
      columnId: options.columnId
    });

    if (options.orderNo){
      this.setData({
        orderNo: options.orderNo, 
      })
    }

    if (options.confirmOrderSource){
      let isChangeNumFlag = false;
      console.log(options.confirmOrderSource);
      if (options.confirmOrderSource == 4 || options.confirmOrderSource == 6 || options.confirmOrderSource == 7){
        isChangeNumFlag = true;
      }
      this.setData({
        confirmOrderSource: options.confirmOrderSource,
        isChangeNumFlag: isChangeNumFlag
      });

      console.log(isChangeNumFlag);
    }

    if (options.isDeleteShopCartProduct){
      this.setData({
        isDeleteShopCartProduct: 1
      })
    }else{
      this.setData({
        isDeleteShopCartProduct: 0
      })
    }

    if(options.isRx){
      this.setData({
        isRx: 1
      })
    }

    this.queryRxDrugs();
  },

  /**
   * 获取订单数据
   */
  getOrderDetail(orderNo){
    let that = this;
    let params = {
      header: {},
      body: {
        orderNo: orderNo
      }
    }
    getApp().API.getOrderDetail(params).then((res) => {
      if(res.code == 0){
        let comListTamp = res.data.comList;
        let comListInfo = [];
        for (let i in comListTamp){
          if ((comListTamp[i].status != null && comListTamp[i].inventory != null) && comListTamp[i].status == 0 && comListTamp[i].inventory > 0){
            var comListObj = {
              columnId: comListTamp[i].columnId,
              qty: comListTamp[i].qty,
              comId: comListTamp[i].commodityId
            }
            comListInfo.push(comListObj);
          }
        }
        wx.setStorageSync('comList', comListInfo);
        that.preOrderRequest();
      }
    })
  },

  /**
   * 预下单
   */
  preOrderRequest(){
    let that = this;
    let params = {
      header: {},
      body: {
        userId: wx.getStorageSync('userId'),
        comList: JSON.parse(JSON.stringify(wx.getStorageSync('comList'))),
        payType: '',
      }
    }

    if(this.data.confirmOrderSource == 4){  //兼容凭方开药
      params.body.businessTypeId = 9;
    }

    wx.showLoading({
      title: '加载中',
    })
    getApp().API.perOrder(params).then((res) => {
      wx.hideLoading();
      that.setData({
        loadingOver: true
      })
      if (res.code == 0) {
        let orderCofirmTamp = res.data;
        for (let i in orderCofirmTamp.comList) {
          //缩略图过滤
          if (orderCofirmTamp.comList[i].imgUrl) {
            orderCofirmTamp.comList[i].imgUrl = orderCofirmTamp.comList[i].imgUrl.split(";")[0];
          } else {
            orderCofirmTamp.comList[i].imgUrl = '';
          }
          //价格过滤
          orderCofirmTamp.comList[i].pricePre = parseInt(orderCofirmTamp.comList[i].price);
          orderCofirmTamp.comList[i].priceNext = '.' + String(parseFloat(orderCofirmTamp.comList[i].price).toFixed(2)).split('.')[1];
        }

        that.setData({
          comList: orderCofirmTamp.comList,
          hasEntity: orderCofirmTamp.hasEntity,
          orderPrice: orderCofirmTamp.orderPrice.toFixed(2),
          siteStatus: orderCofirmTamp.siteStatus,
          sumPrice: orderCofirmTamp.sumPrice.toFixed(2),
          sumQty: orderCofirmTamp.sumQty,
          inquiryPrice: orderCofirmTamp.inquiryPrice != null ? orderCofirmTamp.inquiryPrice.toFixed(2) : '',
          freight: orderCofirmTamp.freight.toFixed(2)
        });

        let siteObj = {};
        if (wx.getStorageSync('addressInfo')) {
          let jsonAddressInfo = wx.getStorageSync('addressInfo');
          let siteStorage = JSON.parse(JSON.stringify(jsonAddressInfo));
          siteObj = Object.assign(that.data.site, siteStorage);
        }
        /**
         * 地址过滤
         */
        if (wx.getStorageSync('addressInfo') && orderCofirmTamp.siteStatus == 0) {
          that.setData({
            siteStatusFlag: 0,
            site: siteObj
          })
        } else if (!wx.getStorageSync('addressInfo') && orderCofirmTamp.siteStatus == 0) {
          that.setData({
            siteStatusFlag: 0,
            site: orderCofirmTamp.site
          })
        } else if (orderCofirmTamp.siteStatus == 2 && wx.getStorageSync('addressInfo')) {
          that.setData({
            siteStatusFlag: 0,
            site: wx.getStorageSync('addressInfo')
          })
        } else if (orderCofirmTamp.siteStatus == 2 && !wx.getStorageSync('addressInfo')) {
          that.setData({
            siteStatusFlag: 2,
          })
        } else if (orderCofirmTamp.siteStatus == 1) {
          that.setData({
            siteStatusFlag: 1
          })
        }
      }
    });
  },

  /**
   * 数量减
   */
  subProduct(e){
    let index = parseInt(e.target.dataset.index);
    if (this.data.isChangeNumFlag){
      return false;
    }
    let comListTamp = this.data.comList;
    if (comListTamp[index].qty > 1) {
      comListTamp[index].qty -= 1;
    }
    this.setData({
      comList: comListTamp
    });
    this.preOrderFunc();
  },
  /**
   * 数量增
   */
  addProduct(e){
    let index = parseInt(e.target.dataset.index);
    if (this.data.isChangeNumFlag) {
      return false;
    }
    let comListTamp = this.data.comList;
    if (comListTamp[index].qty < comListTamp[index].inventory) {
      comListTamp[index].qty += 1;
      this.setData({
        comList: comListTamp
      });
      this.preOrderFunc();
    }else {
      wx.showToast({
        title: '亲，没有更多库存了',
        icon: 'none',
        duration: 1000
      })
    }
  },

  /**
   * 更改数量
   */
  inputChange(e){
    let num = e.detail.value;
    let index = parseInt(e.target.dataset.index);

    if(Number(num) == 0){
      num = 1;
    } 

    let comListTamp = this.data.comList;
    if (num < comListTamp[index].inventory) {
      comListTamp[index].qty = num;
      e.detail.value = num;
    }else{
      comListTamp[index].qty = comListTamp[index].inventory;
      e.detail.value = comListTamp[index].inventory;
      setTimeout(() => {
        wx.showToast({
          title: '亲，没有更多库存了',
          icon: 'none',
          duration: 1000
        })
      },500)
    }

    this.setData({
      comList: comListTamp
    })
    this.preOrderFunc();
  },

  /**
   * 预下单数据更改该
   */
  preOrderFunc() {
    let recordsTamp = this.data.comList;
    let comList = []
    for (let i in recordsTamp) {
        var comListTamp = {}
        comListTamp.comId = recordsTamp[i].comId;
        comListTamp.columnId = recordsTamp[i].columnId;
        comListTamp.qty = recordsTamp[i].qty;
        comList.push(comListTamp);
    }
    wx.setStorageSync('comList', comList);
    this.preOrderRequest();
  },

  /**
   * 留言
   */
  changeTextArea(e) {
    let value = e.detail.value;
    wx.setStorageSync('remark', value);
    
    this.setData({
      remark: value
    })
  },

  /**
   * 获取处方信息
   */
  getPrescriptionSign(orderId){
    let params = {
      header: {},
      body: {
        orderId: orderId
      }
    }
    getApp().API.getPrescriptionSign(params).then(res => {
      console.log(res);
      if(res.code == 0){
        let prescriptionDrugList = res.data.prescriptionDrugList
        let drugArr = [];
        let ids = [];
        for (let i in prescriptionDrugList){
          let drugArrTamp = {
            comId: prescriptionDrugList[i].drugStandardId,
            qty: prescriptionDrugList[i].count
          }
          drugArr.push(drugArrTamp);
          ids.push(prescriptionDrugList[i].drugStandardId);
        }
        console.log(drugArr);
        this.getCommodityIds(ids, drugArr);
      }
    });
  },

  /**
   * 药品获取商品信息
   */
  getCommodityIds(ids,comListTamp){
    let params = {
      header: {},
      body: {
        ids: ids
      }
    };
    getApp().API.getCommodityIds(params).then(res => {
      console.log(res);
      if(res.code == 0){
        let data = res.data;
        let comListArr = [];
        for (let i in data) {
          for (let k in comListTamp) {
            if (data[i].drugId == comListTamp[k].comId) {
              //匹配有效商品
              let comListObj = {
                comId: data[i].commodityId,
                columnId: "",
                qty: comListTamp[k].qty ? comListTamp[k].qty : 1
              };
              comListArr.push(comListObj);
            }
          }
        }
        console.log(comListArr);
        wx.setStorageSync('comList', comListArr);
        this.preOrderRequest();
      }
    })
  },

  /**
   * 获取病例详情信息
   */
  getMedicalDetailByOrderId(orderNo){
    let params = {
      header: {},
      body: {
        orderNo: orderNo
      }
    }

    getApp().API.getMedicalDetailByOrderId(params).then(res => {
      console.log(res);
      if(res.code == 0){
        let prescriptionDrugList = res.data.drugList
        let drugArr = [];
        let ids = [];
        for (let i in prescriptionDrugList) {
          let drugArrTamp = {
            comId: prescriptionDrugList[i].drugStandardId,
            qty: prescriptionDrugList[i].count
          }
          drugArr.push(drugArrTamp);
          ids.push(prescriptionDrugList[i].drugStandardId);
        }
        console.log(drugArr);
        this.getCommodityIds(ids, drugArr);
      }
    })
  },

  /**
   * 根据处方药商品id列表，查询对应的处方药的详细数据
   */
  queryRxDrugs() {
    let that = this;
    let commodityIds = [];
    let comList = wx.getStorageSync('comList');
    for (let i in comList) {
      commodityIds.push(comList[i].comId)
    }
    let params = {
      header: {},
      body: {
        commodityIds: commodityIds
      }
    }
    getApp().API.queryRxDrugs(params).then(res => {
      if (res.code == 0) {
        let queryRxDrugsTamp =  res.data;
        let comListTamp = wx.getStorageSync('comList');
        for (let i in queryRxDrugsTamp){
          queryRxDrugsTamp[i].count = comListTamp[i].qty
        }
        that.setData({
          queryRxDrugsRecords: queryRxDrugsTamp
        });
      }
    })
  },

  /**
   * 提交订单
   */
  goPay(){
    let that = this;
    if (this.data.hasEntity == 1){
      if (!this.data.site.id) {
        wx.showToast({
          title: '请填写收货地址',
          icon: 'none',
          duration: 2000
        })
        return false;
      }
    }

    if (this.data.isRx == 1){
      this.placeVisitOrder();
    }else{
      this.placeOrderRequest();
    }
  },

  /**
   * 去下单
   */
  placeOrderRequest() {
    let that = this;

    let siteId;                      //判断实体商品还是虚拟商品
    if (this.data.hasEntity == 0){
      siteId = '';
    }else{
      siteId = this.data.site.id;
    }

    let orderType = 0;               //判断订单类型 商城订单0 问诊订单1
    if (this.data.confirmOrderSource == 4 || this.data.confirmOrderSource == 5 || this.data.confirmOrderSource == 6 || this.data.confirmOrderSource == 7) {
      orderType = 1
    }

    let orderSource = null;          //判断订单来源 APP0 小程序2 中航3 银川4 终端视频问诊5 
    if (this.data.confirmOrderSource == 5 || this.data.confirmOrderSource == 6) {
      orderSource = 5; 
    } else {
      orderSource = 2;
    }

    let params = {
      header: {},
      body: {
        userId: wx.getStorageSync('userId'),
        siteId: siteId,
        remark: wx.getStorageSync('remark'),
        comList: JSON.parse(JSON.stringify(wx.getStorageSync('comList'))),
        orderSource: orderSource,
        isDeleteShopCartProduct: this.data.isDeleteShopCartProduct,
        orderType: orderType,
        officeVisitOrderId: '',
        payType: ''                   //医保支付为4 其他为''
      }
    }
    wx.showLoading({
      title: '加载中',
    })
    getApp().API.placeOrder(params).then((res) => {
      wx.hideLoading();
      if (res.code == 0) {
        wx.setStorageSync('remark', '');
        wx.redirectTo({
          url: `../pay/pay?orderId=${res.data.orderId}&businessType=2&jumpType=2`,
        })
      }else{
        wx.showToast({
          title: res.message,
          icon: 'none'
        })
      }
    })
  },

  /**
   * 去下单(凭方开药)
   */
  placeVisitOrder(){
    let that = this;
    let siteId;
    if (this.data.hasEntity == 0) {
      siteId = '';
    } else {
      siteId = this.data.site.id;
    }

    if (!this.data.patientInfo.patientId){
      wx.showToast({
        title: '请填写用药人信息',
        icon: 'none'
      })
      return false;
    }

    let visitOfficeDrugParam = {
      roleId: wx.getStorageSync('userId'),
      roleType: 1,
      clinicId: 90000,
      roleUserId: wx.getStorageSync('userId'),
      patientId: this.data.patientInfo.patientId,              //'cb2a60845559425aa133bca77bd2d2d5'
      drugstoreId: '',
      inquiryImgList: this.data.patientInfo.inquiryImgList,
      diagnose: this.data.patientInfo.diagnose,                //'唇单纯疱疹,急性肾小球肾炎，IgA肾病',
      mainSuit: this.data.patientInfo.mainSuit,                //'"1侧头痛恶心2天',
      medicalHistory: this.data.patientInfo.medicalHistory,    //'高血压，糖尿病，过劳肥',
      illnessDuration: this.data.patientInfo.illnessDuration,  //'一月内',
      allergy: this.data.patientInfo.allergy,                  //'青霉素，链霉素，贫穷',
      inquiryType: 9,
      familyMedicalHistory: this.data.patientInfo.familyMedicalHistory, //'无',
      expertId: '',
      drugList: this.data.queryRxDrugsRecords
    };

    let params = {
      header: {},
      body: {
        userId: wx.getStorageSync('userId'),
        siteId: siteId,
        remark: wx.getStorageSync('remark'),
        comList: JSON.parse(JSON.stringify(wx.getStorageSync('comList'))),
        orderSource: 2,
        isDeleteShopCartProduct: this.data.isDeleteShopCartProduct,
        orderType: 1,
        officeVisitOrderId: '',
        payType: '',  //医保支付为4 其他为''
        inquiryType:  9,
        visitOfficeDrugParam: visitOfficeDrugParam
      
      }
    }
    wx.showLoading({
      title: '加载中',
    })
    getApp().API.placeVisitOrder(params).then((res) => {
      wx.hideLoading();
      if (res.code == 0) {
        wx.setStorageSync('remark', '');
        wx.redirectTo({
          url: `../pay/pay?orderId=${res.data.orderId}&businessType=2&jumpType=2`,
        })
      } else {
        wx.showToast({
          title: res.message,
          icon: 'none'
        })
      }
    })
  },

  /**
   * 跳转地址列表
   */
  jumpAddressList(e){
    if (e.currentTarget.dataset.sitestatus == 0 || e.currentTarget.dataset.sitestatus == 2){
      wx.navigateTo({
        url: '/pages/mall/address/addressList?type=pay'
      })
    }else{
      wx.navigateTo({
        url: '/pages/mall/address/addressEdit?type=pay&way=add&source=orderConfirm'
      })
    }
  },

  /**
   * 跳转到用药人信息
   */
  jumpPatientPage(){
    let comList = wx.getStorageSync('comList');
    let commodityIds = [];
    for (let i in comList){
       commodityIds.push(comList[i].comId)
    }
    let commodityIdsTamp = JSON.stringify(commodityIds);
   
    wx.navigateTo({
      url: '/pages/patient/filloutInfo/filloutInfo?inquiryType=9&commodityIds=' + commodityIdsTamp
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
      remark: wx.getStorageSync('remark') || ''
    });
    console.log(this.data.orderNo);
    console.log(this.data.confirmOrderSource);
    if(this.data.confirmOrderSource == 3){          //重新购买
      this.getOrderDetail(this.data.orderNo);
    } else if(this.data.confirmOrderSource == 5){    //大屏机咨询
      this.getMedicalDetailByOrderId(this.data.orderNo)
    } else if (this.data.confirmOrderSource == 6){   //大屏机问诊
      this.getMedicalDetailByOrderId(this.data.orderNo);
    } else if (this.data.confirmOrderSource == 7) {
      this.getPrescriptionSign(this.data.orderNo) //大屏机处方笺
    }else{
      this.preOrderRequest();
    }

    if (wx.getStorageSync('patientInfo')){
      this.setData({
        patientInfo: wx.getStorageSync('patientInfo')
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

  }
})