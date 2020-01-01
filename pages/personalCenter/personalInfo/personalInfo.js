// pages/personalCenter/personalInfo/personalInfo.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    realName: '',
    phone: '',
    sfzh: '',
    gender: '',
    address: '',
    nickname: '',
    avatar: '',
    disabledSex: false,
    disabledIdcard: false,
    disabledPhone: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getUserAccountInfo()
  },

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

  /**
   * 保存个人信息
   */
  saveInfoBtn() {
    var idCard = this.data.sfzh;
    if (this.isCardID(idCard)) {

    } else {
      if (idCard) {
        wx.showToast({
          title: '请输入正确的身份证号码',
          icon: 'none',
          duration: 1000
        })
      }
      return
    }
    
    const that = this;
    let params = {
      header: {},
      body: null
    };
    params.body = that.data;
    getApp().API.updatePersonInfo(params).then(data => {
      if (data.code == 0) {
        wx.showToast({
          title: '资料更新成功',
          icon: 'success',
          duration: 1000
        })
        setTimeout(function(){
          wx.navigateBack({//返回
            delta: 1
          })
        }, 1000)
      }
    }).catch(err => {})
  },

  /**
   * 身份证无法更改啦
   */
  noChange1() {
    var that = this;
    if (this.data.disabledIdcard) {
      wx.showToast({
        title: '已绑定，无法更改啦',
        icon: 'none',
        duration: 1000
      })
    }
  },

  /**
   * 手机号无法更改啦
   */
  noChange2() {
    var that = this;
    if (this.data.disabledPhone) {
      wx.showToast({
        title: '已绑定，无法更改啦',
        icon: 'none',
        duration: 1000
      })
    }
  },

  /**
   * 选择性别
   */
  selectSex() {
    var that = this;
    if (this.data.disabledSex) {
      wx.showToast({
        title: '已根据身份证为您匹配出性别，无需手动更改',
        icon: 'none',
        duration: 1000
      })
      return
    }
    wx.showActionSheet({
      itemList: ['男', '女'],
      success(res) {
        // console.log(res.tapIndex)
        that.setData({
          gender: res.tapIndex + 1, //更新
        })
      },
      fail(res) {
        console.log(res.errMsg)
      }
    })
  },

  /**
   * 监听现住址
   */
  watchAddress(event) {
    // console.log(event.detail.value);
    this.setData({
      address: event.detail.value, //更新
    })
  },

  /**
   * 监听手机号
   */
  watchPhone(event) {
    // console.log(event.detail.value);
    this.setData({
      phone: event.detail.value, //更新
    })
  },

  /**
   * 监听身份证
   */
  watchSfzh(event) {
    // console.log(event.detail.value);
    var idCard = event.detail.value;
    var gender = 1;
    if (idCard) {
      var isIdcard1 = /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$/; //15位数身份证验证正则表达式
      var isIdcard2 = /^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/; //18位数身份证验证正则表达式 ：
      if (isIdcard1.test(idCard) || isIdcard2.test(idCard)) {

      } else {
        wx.showToast({
          title: '请输入正确的身份证号码',
          icon: 'none',
          duration: 1000
        })
        return
      }
      if (parseInt(idCard.substr(16, 1)) % 2 == 1) {
        gender = 1;
      } else {
        gender = 2;
      }
      this.setData({
        sfzh: event.detail.value, //更新
        gender: gender,
        disabledSex: true,
      })
    }
  },

  /**
   * 监听姓名
   */
  watchRealName(event) {
    // console.log(event.detail.value);
    this.setData({
      realName: event.detail.value, //更新
    })
  },

  /**
   * 监听昵称
   */
  watchNickname(event) {
    // console.log(event.detail.value);
    this.setData({
      nickname: event.detail.value, //更新
    })
  },

  /**
   * 监听姓名
   */
  watchRealName(event) {
    // console.log(event.detail.value);
    this.setData({
      realName: event.detail.value, //更新
    })
  },

  /**
   * 获取用户信息
   */
  getUserAccountInfo() {
    const that = this;
    let params = {
      header: {},
      body: {}
    };
    getApp().API.getUserAccountInfo(params).then(data => {
      if (data.code == 0) {
        var resData = data.data;
        var disabledIdcard = false;
        var disabledPhone = false;
        var disabledSex = false;
        if (!resData.telephone) {
          resData.telephone = resData.account;
        }
        if (resData.idCard) {
          if (parseInt(resData.idCard.substr(16, 1)) % 2 == 1) {
            resData.gender = 1;
          } else {
            resData.gender = 2;
          }
          console.log(1111)
          disabledIdcard = true;
          disabledSex = true;
        }
        if (resData.telephone) {
          disabledPhone = true;
        }
        this.setData({
          avatar: resData.imageUrl, //更新
          realName: resData.personName, //更新
          nickname: resData.personOtherName, //更新
          gender: resData.gender, //更新
          sfzh: resData.idCard, //更新
          phone: resData.telephone, //更新
          address: resData.liveAddress, //更新
          disabledIdcard: disabledIdcard,
          disabledPhone: disabledPhone,
          disabledSex: disabledSex,
        })
      }
    }).catch(err => {})
  },

  /**
   * 更换头像
   */
  switchHead() {
    var that = this;

    wx.showActionSheet({

      itemList: ['从相册中选择', '拍照'],

      itemColor: "#f7982a",

      success: function(res) {

        if (!res.cancel) {

          if (res.tapIndex == 0) {

            that.chooseWxImageShop('album'); //从相册中选择

          } else if (res.tapIndex == 1) {

            that.chooseWxImageShop('camera'); //手机拍照

          }

        }

      }

    })
  },

  /**
   * 选择头像图片
   */
  chooseWxImageShop: function(type) {

    var that = this;

    wx.chooseImage({

      sizeType: ['original', 'compressed'],

      sourceType: [type],

      success: function(res) {

        that.upload_file(res.tempFilePaths[0])

      }

    })

  },

  // 上传图片到服务器

  upload_file: function(filePath) {

    var that = this;

    wx.showToast({
      title: '正在上传...',
      icon: 'loading',
      mask: true,
      duration: 1000
    });

    wx.uploadFile({
      url: getApp().globalData.host + '/oss/oss/upload', //仅为示例，非真实的接口地址
      filePath: filePath,
      name: 'file',
      formData: {},
      success(res) {
        const data = JSON.parse(res.data);
        var tempArr = data.data.uploadFilePath;
        if (data.code == 0) {
          wx.showToast({
            title: '上传成功',
            icon: 'success',
            duration: 500
          })
          that.setData({
            avatar: tempArr
          })
        } else {
          wx.showToast({
            title: '上传失败',
            icon: 'warn',
            duration: 500
          })
        }
      },
      fail: function(res) {
        wx.showToast({
          title: '上传失败',
          icon: 'warn',
          duration: 500
        })
      }
    })

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