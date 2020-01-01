// pages/patient/filloutInfo/filloutInfo.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sexList: [{
        value: 1,
        name: '男'
      },
      {
        value: 2,
        name: '女'
      }
    ],
    sexItem: '男', //默认显示的
    relationList: ["本人", "父母", "子女", "配偶", "其他"],
    relationItem: '本人', //默认显示的
    // 历史就诊人
    historyList: [],
    formData: null,
    // 默认显示的
    currentTab: -1,
    index: 0,
    historyAdd: false, //是否点击添加就诊人
    birth: '', //出生日期
    showPopup: false, //是否显示协议遮罩层
    expertId: '',     //医生专家Id
    inquiryType: '',   //问诊类型 9：凭方开药
    patientId: '',
    isSubmit: true,
    commodityIds: ''
  },

  // 协议滚动
  scroll() {},

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

  // 监听身份证号填写
  watchIdCard: function (event) {
    // console.log(event.detail.value);
    var idCard = event.detail.value;
    if (this.isCardID(idCard)) {

    } else {
      wx.showToast({
        title: '请输入正确的身份证号码',
        icon: 'none',
        duration: 1000
      })
    }
    if (event.detail.value) {
      var nowYear = new Date().getFullYear();
      var year = idCard.slice(6, 10);
      var month = idCard.slice(10, 12);
      var day = idCard.slice(12, 14);
      var patientDob = year + '-' + month + '-' + day;
      var memberAge = nowYear - year;
      var sex = ''
      if (parseInt(idCard.substr(16, 1)) % 2 == 1) {
        sex = '1';
      } else {
        sex = '2';
      }
      var temp1 = 'formData.idCard'
      var temp2 = 'formData.patientDob'
      var temp3 = 'formData.memberAge'
      var temp4 = 'formData.sex'
      this.setData({
        [temp1]: event.detail.value, //更新
        [temp2]: patientDob, //更新
        [temp3]: memberAge, //更新
        [temp4]: sex, //更新
      })
    }
  },

  // 监听姓名填写
  watchPatientName: function(event) {
    // console.log(event.detail.value);
    var temp = 'formData.patientName'
    this.setData({
      [temp]: event.detail.value, //更新
    })
  },

  // 监听手机号码填写
  watchPhone: function(event) {
    // console.log(event.detail.value);
    var phone = /^1([38][0-9]|4[579]|5[0-3,5-9]|6[6]|7[0135678]|9[89])\d{8}$/;
    if (!phone.test(event.detail.value) && event.detail.value) {
      wx.showToast({
        title: '请输入正确的手机号码',
        icon: 'none',
        duration: 1000
      })
    }
    var temp = 'formData.contractPhone'
    this.setData({
      [temp]: event.detail.value, //更新
    })
  },

  // 点击出生日期
  pickerBirth: function() {
    wx.showToast({
      title: '已根据身份证号为您自动匹配出生日期，无需手动改动',
      icon: 'none',
      duration: 1000
    })
  },

  // 出生日期选取确定
  bindDateChange: function(e) {
    // console.log('picker发送选择改变，携带值为', e.detail.value)
    var temp = 'formData.patientDob'
    this.setData({
      [temp]: e.detail.value, //更新
    })
  },


  // 添加就诊人
  historyAdd: function() {
    var tempData = {
      "patientId": "",
      "patientName": "",
      "sex": 1,
      "idCard": "",
      "contractPhone": "",
      "memberAge": "",
      "patientDob": "",
      "relation": "父母",
      "isAbnormalNotify": "",
      "isEmergencyContact": "",
      "isPushData": "",
      "isScanning": "",
    };
    this.setData({
      historyAdd: true, //更新
      currentTab: -1,
      formData: tempData,
      relationList: ["父母", "子女", "配偶", "其他"], //更新
    })
  },

  // 历史就诊人选择
  navbarTap: function(e) {
    var that = this;
    if (e.currentTarget.id == 0) {
      this.setData({
        relationList: ["本人"], //更新
      })
    } else {
      this.setData({
        relationList: ["父母", "子女", "配偶", "其他"], //更新
      })
    }
    var temp = 'formData.relation'
    this.setData({
      historyAdd: true, //更新
      currentTab: e.currentTarget.id, //勾选CSS变化
      formData: that.data.historyList[e.currentTarget.id],
      [temp]: that.data.relationList[0]
    })
  },

  // 性别选择
  bindSex: function(event) {
    var classify = event.currentTarget.dataset.classify;
    var temp = 'formData.sex'
    // console.log(classify); //当前点击项
    if (!this.data.formData.idCard) {
      this.setData({
        [temp]: classify, //更新
      })
    } else {
      wx.showToast({
        title: '已根据身份证号为您自动匹配出性别，无需手动改动',
        icon: 'none',
        duration: 1000
      })
    }
  },

  // 关系选择
  bindRelation: function(event) {
    var classify = event.currentTarget.dataset.classify;
    var temp = 'formData.relation'
    // console.log(classify); //当前点击项
    this.setData({
      [temp]: classify, //更新
    })
  },

  /**
   * 同意协议
   */
  agree() {
    const that = this;
    let params = {
      header: {},
      body: null
    };
    if (this.data.formData.relation == '本人'){
      params.body = {
        name: this.data.formData.patientName,
        idCard: this.data.formData.idCard,
        phone: this.data.formData.contractPhone,
        birthday: this.data.formData.patientDob,
        gender: this.data.formData.sex  ,
      }
      getApp().API.updateSelfInfo(params).then(data => {
        if (data.code == 0) {
          that.onClose();
          let url = '/pages/patient/diseaseDesc/diseaseDesc?patientId=' + data.data.patientId + '&expertId=' + that.data.expertId + '&sex=' + that.data.formData.sex;
          if (this.data.inquiryType == 9) {
            url += `&inquiryType=9&patientAge=${that.data.formData.memberAge}&patientGender=${that.data.formData.sex}&patientName=${that.data.formData.patientName}&commodityIds=${this.data.commodityIds}`
          }
          console.log(url);
          if (that.data.formData.memberAge < 6 && that.data.formData.memberAge > 90) {
            wx.showToast({
              title: '就诊人实际年龄必须大于等于6周岁、小于等于90周岁',
              icon: 'none'
            })
            return false;
          }

          wx.navigateTo({
            url: url
          })
        } else {
          wx.showToast({
            title: data.message,
            icon: 'none'
          })
        }
      }).catch(err => { })
    }else{
      params.body = that.data.formData;
      if (!this.data.historyAdd) {
        params.body.editType = 0;
        params.body.patientId = ''
      } else {
        params.body.editType = 2;
        params.body.patientId = this.data.formData.patientId
        //params.body.patientId = ''
      }
      getApp().API.savePatientInfo(params).then(data => {
        if (data.code == 0) {
          that.onClose();
          let url = '/pages/patient/diseaseDesc/diseaseDesc?patientId=' + data.data.patientId + '&expertId=' + that.data.expertId + '&sex=' + that.data.formData.sex; 
          if(this.data.inquiryType == 9){
            url += `&inquiryType=9&patientAge=${that.data.formData.memberAge}&patientGender=${that.data.formData.sex}&patientName=${that.data.formData.patientName}&commodityIds=${this.data.commodityIds}`
          }
          console.log(url);
          if (that.data.formData.memberAge < 6 && that.data.formData.memberAge > 90){
            wx.showToast({
              title: '就诊人实际年龄必须大于等于6周岁、小于等于90周岁',
              icon: 'none'
            })
            return false;
          }
          
          wx.navigateTo({
            url: url
          })
        }else{
          wx.showToast({
            title: data.message,
            icon: 'none'
          })
        }
      }).catch(err => { })
    }
  },

  /**
   * 获取亲友管理信息
   */
  getPatientList() {
    const that = this;
    let params = {
      header: {},
      body: {
        // pageNumber: 1,
        // pageSize: 20,
      }
    };
    wx.showLoading({
      title: '加载中..',
    })
    getApp().API.getPatientList(params).then(data => {
      if (data.code == 0) {
        var tempArr = data.data.memberList;
        tempArr.unshift(data.data.selfInfo);
        for (var i in tempArr) {
          if (tempArr[i].sex != 2) {
            tempArr[i].sex = 1
          }
          if (tempArr[i].idCard) {
            var nowYear = new Date().getFullYear();
            var year = tempArr[i].idCard.slice(6, 10);
            var month = tempArr[i].idCard.slice(10, 12);
            var day = tempArr[i].idCard.slice(12, 14);
            tempArr[i].patientDob = year + '-' + month + '-' + day;
            tempArr[i].memberAge = nowYear - year;
          }
        }
        if (tempArr.length > 0) {
          that.setData({
            historyList: tempArr,
          })
        }else{
          that.setData({
            historyAdd: true,
          })
        }
      }
      setTimeout(function () {
        wx.hideLoading()
      }, 500)
    }).catch(err => {
      setTimeout(function () {
        wx.hideLoading()
      }, 500)
    })
  },

  /**
   * 关闭协议遮罩层
   */
  onClose() {
    this.setData({
      showPopup: false
    });
  },

  /**
   * 提交信息
   */
  submit() {
    if(this.data.isSubmit){
      this.setData({
        isSubmit: false
      })
      setTimeout(()=>{
        this.setData({
          isSubmit: true
        })
      },1000);
    }else{
      return false;
    }
    var values = this.data.formData;
    console.log(values)
    if (!values) {
      wx.showToast({
        title: '请填选就诊人信息',
        icon: 'none',
        duration: 1000
      })
      return
    }
    if (values.idCard) {
      var idCard = values.idCard;
      if (this.isCardID(idCard)) {

      } else {
        wx.showToast({
          title: '请输入正确的身份证号码',
          icon: 'none',
          duration: 1000
        })
        return
      }
    }
    if (!values) {
      wx.showToast({
        title: '请选择就诊人',
        icon: 'none',
        duration: 1000
      })
      return
    }
    if (!values.patientName) {
      wx.showToast({
        title: '请输入姓名',
        icon: 'none',
        duration: 1000
      })
      return
    }
    if (!values.patientDob) {
      wx.showToast({
        title: '请输入出生日期',
        icon: 'none',
        duration: 1000
      })
      return
    }
    if (!values.relation) {
      wx.showToast({
        title: '请选择关系',
        icon: 'none',
        duration: 1000
      })
      return
    }
    var phone = /^1([38][0-9]|4[579]|5[0-3,5-9]|6[6]|7[0135678]|9[89])\d{8}$/;
    if (!phone.test(values.contractPhone) && values.contractPhone) {
      console.log(111)
      wx.showToast({
        title: '请输入正确的手机号码',
        icon: 'none',
        duration: 1000
      })
      return;
    }
    this.agree();
    // this.setData({
    //   showPopup: true
    // });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    const year = new Date().getFullYear();
    const month = new Date().getMonth() + 1;
    const day = new Date().getDate();
    this.setData({
      expertId: options.expertId,
      maxDate: year + '-' + month + '-' + day, //更新
    })

    if (options.inquiryType == 9){
      this.setData({
        inquiryType: 9
      })
    }
    if (options.commodityIds){
      this.setData({
        commodityIds: options.commodityIds
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.getPatientList();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})