// pages/patient/filloutInfoPC/filloutInfoPC.js
import Dialog from 'vant-weapp/dialog/dialog';

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
    relationItem: '其他', //默认显示的
    // 历史就诊人
    historyList: [],
    formData: null,
    // 默认显示的
    currentTab: -1,
    index: 0,
    historyAdd: false, //是否点击添加就诊人
    birth: '', //出生日期
    showPopup: false, //是否显示协议遮罩层
    expertId: '', //医生专家Id
    isSubmit: true,
    pics: [], //图片
    isFirst: true,  //是否首次进入
  },

  // 协议滚动
  scroll() { },

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
      if (idCard){
        wx.showToast({
          title: '请输入正确的身份证号码',
          icon: 'none',
          duration: 1000
        })
      }
      return
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
      }else{
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
  watchPatientName: function (event) {
    // console.log(event.detail.value);
    var temp = 'formData.patientName'
    this.setData({
      [temp]: event.detail.value, //更新
    })
  },

  // 监听手机号码填写
  watchPhone: function (event) {
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
  pickerBirth: function () {
    wx.showToast({
      title: '已根据身份证号为您自动匹配出生日期，无需手动改动',
      icon: 'none',
      duration: 1000
    })
  },

  // 出生日期选取确定
  bindDateChange: function (e) {
    // console.log('picker发送选择改变，携带值为', e.detail.value)
    var temp = 'formData.patientDob'
    this.setData({
      [temp]: e.detail.value, //更新
    })
  },

  // 添加就诊人
  historyAdd: function () {
    var tempData = {
      "patientId": "",
      "patientName": "",
      "sex": 1,
      "idCard": "",
      "contractPhone": "",
      "memberAge": "",
      "patientDob": "",
      "relation": "其他",
      "isAbnormalNotify": "",
      "isEmergencyContact": "",
      "isPushData": "",
      "isScanning": "",
      "imgUrl": "",
      "faceMd": wx.getStorageSync('faceId') || '',
      "faceId": wx.getStorageSync('faceId') || '',
    };
    this.setData({
      historyAdd: true, //更新
      currentTab: -1,
      formData: tempData,
      relationList: ["父母", "子女", "配偶", "其他"], //更新
    })
  },

  // 历史就诊人选择
  navbarTap: function (e) {
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
  bindSex: function (event) {
    var classify = event.currentTarget.dataset.classify;
    var temp = 'formData.sex'
    // console.log(classify); //当前点击项
    if (!this.data.formData.idCard){
      this.setData({
        [temp]: classify, //更新
      })
    }else{
      wx.showToast({
        title: '已根据身份证号为您自动匹配出性别，无需手动改动',
        icon: 'none',
        duration: 1000
      })
    }
  },

  // 关系选择
  bindRelation: function (event) {
    var classify = event.currentTarget.dataset.classify;
    var temp = 'formData.relation'
    // console.log(classify); //当前点击项
    this.setData({
      [temp]: classify, //更新
    })
  },
  /**
   * 绑定电话跟faceId
   */
  bindAccountPhoneByFaceId(phone) {
    var faceId = wx.getStorageSync("faceId")
    var params = {
      header: {},
      body: {
        faceId: faceId,
        phone: phone,
      }
    }
    getApp().API.bindAccountPhoneByFaceId(params).then(res => {
      if (res.code == 0) {
        var result = res.data;
        if (result.isBind == 1) {
          console.log('重新绑定成功')
          wx.showToast({
            title: '重新绑定成功',
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
  /**
   * 同意协议
   */
  agree() {
    const that = this;
    if (that.data.isSubmit) {
      var phone = wx.getStorageSync('phone') ;
      var faceId = wx.getStorageSync("faceId")
      if (faceId && phone){
        this.bindAccountPhoneByFaceId(phone)
      }


      that.data.isSubmit = false
      setTimeout(function () {
        that.data.isSubmit = true;
      }, 1000); //一秒内不能重复点击提交

      let params = {
        header: {},
        body: null
      };
      that.data.formData.imgUrl = this.data.pics.join(',')
      params.body = that.data.formData;
      getApp().API.savePatientInfo(params).then(data => {
        if (data.code == 0) {
          that.onClose();
          Dialog.alert({
            message: '数据提交成功，请在南风医生智能设备继续完成余下操作',
            confirmButtonText: '返回小程序主页'
          }).then(() => {

          });
        }else{
          wx.showToast({
            title: data.message,
            icon: 'none',
            duration: 1000
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
        }
      }
    }).catch(err => { })
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
    var values = this.data.formData;
    console.log(values)
    if (!values) {
      wx.showToast({
        title: '请输入就诊人信息',
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
    // if (!values.relation) {
    //   wx.showToast({
    //     title: '请选择关系',
    //     icon: 'none',
    //     duration: 1000
    //   })
    //   return
    // }
    var phone = /^1([38][0-9]|4[579]|5[0-3,5-9]|6[6]|7[0135678]|9[89])\d{8}$/;
    if (!phone.test(values.contractPhone) && values.contractPhone) {
      wx.showToast({
        title: '请输入正确的手机号码',
        icon: 'none',
        duration: 1000
      })
      return;
    }
    if (this.data.pics.length==0) {
      wx.showToast({
        title: '请上传病历信息、医院处方，检查数据',
        icon: 'none',
        duration: 1000
      })
      return
    }
    this.agree()
    // this.setData({
    //   showPopup: true
    // });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getPatientList();
    const year = new Date().getFullYear();
    const month = new Date().getMonth() + 1;
    const day = new Date().getDate();
    this.setData({
      // expertId: options.expertId,
      maxDate: year + '-' + month + '-' + day, //更新
    })

    if (options.scene != undefined) {   //微信直接扫码
      var scan_url = decodeURIComponent(options.scene);
      console.log(scan_url)
      var faceId = '';
      if (scan_url) {
        var tempArr = scan_url.split('=');
        faceId = tempArr[1]
      }
      wx.setStorageSync("faceId", faceId);
    } else {    //微信内部扫一扫
      if (options.faceId){
        wx.setStorageSync("faceId", options.faceId)
      }
    }
  },

  // 跳转首页
  gotoIndex(){
    wx.switchTab({
      url: '/pages/index/index',
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
    if (this.data.isFirst){
      getApp().isLoginFlagFunc();
      this.data.isFirst = false;
      this.historyAdd();
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

  },
  /**
   * 图片上传
   * 
   */

  //上传图片开始
  chooseImg: function (e) {
    var that = this,
      pics = this.data.pics;
    if (pics.length < 9) {
      wx.chooseImage({
        count: 9 - that.data.pics.length, // 最多可以选择的图片张数，默认9
        sizeType: ['original', 'compressed'], // original 原图，compressed 压缩图，默认二者都有
        sourceType: ['album', 'camera'], // album 从相册选图，camera 使用相机，默认二者都有
        success: function (res) {
          // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
          var tempFilePaths = res.tempFilePaths;
          wx.showToast({
            title: '正在上传...',
            icon: 'loading',
            mask: true,
            duration: 1000
          });
          for (var i in tempFilePaths) {
            wx.uploadFile({
              url: getApp().globalData.host +'/oss/oss/upload', //仅为示例，非真实的接口地址
              filePath: tempFilePaths[i],
              name: 'file',
              formData: {
                'user': 'test'
              },
              success(res) {
                const data = JSON.parse(res.data);
                var tempArr = [data.data.uploadFilePath]
                if (data.code == 0) {
                  wx.showToast({
                    title: '上传成功',
                    icon: 'success',
                    duration: 500
                  })
                  that.setData({
                    pics: that.data.pics.concat(tempArr)
                  })
                } else {
                  wx.showToast({
                    title: '上传失败',
                    icon: 'warn',
                    duration: 500
                  })
                }
              },
              fail: function (res) {
                wx.showToast({
                  title: '上传失败',
                  icon: 'warn',
                  duration: 500
                })
              }
            })
          }
        },
      });
    } else {
      wx.showToast({
        title: '最多上传5张图片',
        icon: 'none',
        duration: 1500
      });
    }
  },
  // 删除图片
  deleteImg: function (e) {
    var that = this;
    var pics = this.data.pics;
    var index = e.currentTarget.dataset.index;
    pics.splice(index, 1);
    console.log(pics)
    this.setData({
      pics: pics,
    })
  },
  // 预览图片
  previewImg1: function (e) {
    //获取当前图片的下标
    var index = e.currentTarget.dataset.index;
    //所有图片
    var pics = this.data.pics;
    wx.previewImage({
      //当前显示图片
      current: pics[index],
      //所有图片
      urls: pics
    })
  }
})