// pages/personalCenter/myRecord/recordDetail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    visitType: '11', // 10是开方；11是咨询
    haveRex: false, //包含处方药 包含处方药
    orderNo: '', //订单id
    patientName: '',
    patientGender: '',
    patientAge: '',
    diagnoseDetail: '',
    isCheck: true, // true 正在审核
    drugList: [],
    prescriptionSignOrderNo: '',
    medicalAdvice: '', //医嘱
    pressTime: null, //医嘱的定时器
    drugSourceType: 2, //0药房私库 1商城南风药房 2平台药库
    faceId: '',
    phone: '', //小程序的手机号码
    firstQueryFlag: true, //第一次请求显示loading
    longIdFlag: true, //false 是大屏机进入 ,true 我的病历进入
    noBindFlag: false,//不绑定  true 不绑定
    queryStrTamp: null
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.orderId) {
      var orderId = options.orderId;
      var visitType = options.visitType;
      this.setData({
        orderNo: orderId,
        visitType: visitType,
        longIdFlag: true,
      })
      this.getMedicalDetailByOrderId();
    } else if (options.scene) {
      var queryStr = decodeURIComponent(options.scene);
      var queryObj = queryStr.split('&');
      var orderId = queryObj[1].split('=')[1]
      console.log(orderId);
      this.setData({
        orderNo: orderId,
        longIdFlag: false,
        queryStrTamp: true,
      })
      this.getMedicalDetailByOrderId();
    }
    if (this.data.isCheck) {
      var that = this;
      this.pressTime = setInterval(function () {
        that.getMedicalDetailByOrderId();
      }, 10 * 1000)
    } else {
      clearInterval(this.pressTime)
    }
    getApp().watch(that.getUserId, 'token');
  },

  //监听用户已经登录
  getUserId(token) {
    if (token) {
      setTimeout(() => {
        if (this.data.queryStrTamp) {       //扫码进入
          this.getMedicalDetailByOrderId();
        } else {
          this.getMedicalDetailByOrderId(); //页面跳转进入
        }
      }, 1000)
    }
  },

  getParams(queryParams) {
    var p = new Promise(function (resolve, reject) {
      var params = {
        body: {
          queryStr: queryStr
        }
      }
      resolve("调用成功");
    })
    return p;
  },
  getMedicalDetailByOrderId() { // 病历详情
    if (this.data.firstQueryFlag) {
      wx.showLoading({
        title: '加载中',
      })
    }
    var orderId = this.data.orderNo;
    var params = {
      header: {},
    }
    var body = {};
    if (this.data.longIdFlag) {
      body = {
        orderId: orderId
        // orderId: '7bed2e12de8a45c486e901ce19fb1649'
      }
    } else {
      body = {
        orderNo: orderId
        // orderId: '7bed2e12de8a45c486e901ce19fb1649'
      }
    }
    params.body = body;
    getApp().API.getMedicalDetailByOrderId(params).then(res => {
      this.setData({
        firstQueryFlag: false
      })
      if (res.code == 0) {
        var result = res.data;
        if (result) {
          wx.hideLoading();
          this.setData({
            drugList: result.drugList,
            patientName: result.patientName,
            patientGender: result.patientGender,
            patientAge: result.patientAge,
            diagnoseDetail: result.diagnoseDetail,
            haveRex: result.haveRex,
            isCheck: result.isCheck,
            medicalAdvice: result.medicalAdvice,
            prescriptionSignOrderNo: result.orderId,
            drugSourceType: result.drugSourceType,
            visitType: result.orderType,
            faceId: result.faceId,
            facePhone: result.phone,
          })
          if (result.faceId && !this.data.noBindFlag) {
            this.checkPhoneByFaceId(result.faceId, result.phone)
          }
          if (!result.isCheck) {
            clearInterval(this.pressTime)
          }
        }
      } else {
        wx.hideLoading();
      }
    }).catch(err => {
      wx.hideLoading();
      clearInterval(this.pressTime)
    })
  },

  checkPhoneByFaceId(faceId, facePhone) {
    // var params = {
    //   body: {
    //     faceId: faceId
    //   }
    // }
    // getApp().API.getPhoneByFaceId(params).then(res => {
    //   if (res.code == 0) {

    //   }
    // })
    var phone = wx.getStorageSync('phone');
    if (phone) {
      if (faceId && facePhone != phone) {
        var tmpPhone = phone + ''
        var showPhone = tmpPhone.replace(tmpPhone.substring(3, 7), "****");
        console.log(showPhone)
        this.setData({
          noBindFlag: true
        })
        var _this = this;
        wx.showModal({
          title: '请确认绑定手机号码',
          content: '您已绑定了' + showPhone + '手机号，是否要绑定新手机',
          cancelText: '暂不绑定',
          confirmText: '绑定',
          success(res) {
            if (res.confirm) {
              _this.bindAccountPhoneByFaceId();
            }
          }
        })
      }
    } else {
      this.bindAccountPhoneByFaceId()
    }

  },
  bindAccountPhoneByFaceId() {
    var params = {
      header: {},
      body: {
        faceId: this.data.faceId,
        phone: this.data.phone,
      }
    }
    getApp().API.bindAccountPhoneByFaceId(params).then(res => {
      console.log(res)
      if (res.code == 0) {
        var result = res.data;
        if (result.isBind == 1) {
          wx.showToast({
            title: '重新绑定成功'
          })
        } else {
          wx.showToast({
            title: res.message
          })
        }
      } else {
        wx.showToast({
          title: res.message
        })
      }
    })
  },
  goToMyRecord() {
    wx.navigateTo({
      url: 'myrecord',
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    let titleName = '病历详情';
    if (this.data.visitType == 1) {
      titleName = '疾病总结'
    }
    wx.setNavigationBarTitle({
      title: titleName // 其他页面传过来的标题名
    })

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    //判断是否授权
    getApp().loginByWechat().then(() => {
      console.log(1111)
      getApp().isLoginFlagFunc()
    })
  },
  topreDetail() { // 跳转处方详情
    var orderNo = this.data.prescriptionSignOrderNo;
    wx.navigateTo({
      url: '../prescriptionDetail/index?orderId=' + orderNo,
    })
  },
  goBuyMedicine(e) {
    console.log(e.currentTarget.dataset.type)
    var orderNo = this.data.orderNo;
    if (e.currentTarget.dataset.type) { //咨询
      wx.navigateTo({
        url: '../../mall/orderConfirm/orderConfirm?orderNo=' + orderNo + "&confirmOrderSource=" + 5,
      })
    } else { //凭方开药
      wx.navigateTo({
        url: '../../mall/orderConfirm/orderConfirm?orderNo=' + orderNo + "&confirmOrderSource=" + 6,
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