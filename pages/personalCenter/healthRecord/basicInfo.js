// pages/personalCenter/healthRecord/basicInfo.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    basicInfoObj:{
      userimg: '',
      username: '',
      sex: '',
      birth: '',
      nation: '',
      idcard: '',
      phone: '',
      payMethods: '',
      medicareCard: '',
      domicileAddress: '',
      currentAddress: '',
      address: '',
    },
    showSex: false, //性别选择
    actionsSex: [{
        name: '男'
      },
      {
        name: '女',
      }
    ],
    showBirth: false, //出生日期选择
    currentDate: null,
    minDate: new Date(1900, 1, 1).getTime(),
    maxDate: new Date().getTime(),
    formatter(type, value) {
      if (type === 'year') {
        return `${value}年`;
      } else if (type === 'month') {
        return `${value}月`;
      } else if (type === 'day') {
        return `${value}日`;
      }
      return value;
    },
    showNation: false, //民族选择
    actionsNation: [{
        name: '汉族'
      },
      {
        name: '少数民族',
      }
    ],
    checks: [ //慢病分类
      {
        name: "无",
        value: '0',
        checked: false
      },
      {
        name: "高血压",
        value: '1',
        checked: false
      },
      {
        name: "糖尿病",
        value: '2',
        checked: false
      },
      {
        name: "其他",
        value: '3',
        checked: false
      }
    ],
    showPayMethods: false,
    actionsPayMethods: [{
        name: '居民大病（绿本）'
      },
      {
        name: '职工大病（蓝本）',
      },
      {
        name: '城镇职工基本医疗保险',
      },
      {
        name: '城镇居民基本医疗保险',
      },
      {
        name: '新型农村合作医疗',
      },
      {
        name: '贫困救助',
      },
      {
        name: '商业医疗保险',
      },
      {
        name: '全公费',
      },
      {
        name: '全自费',
      },
      {
        name: '其他',
      }
    ],
  },

  /**
   * 表单保存
   */
  formSubmit: function (e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
  },

  /**
   * 支付方式选择
   */
  onSelectPayMethods(event) {
    console.log(event.detail)
    var payMethods = 'basicInfoObj.payMethods';
    this.setData({
      showPayMethods: false,
      [payMethods]: event.detail.name,
    });
  },

  /**
     * 关闭支付方式上拉菜单
     */
  onClosePayMethods() {
    this.setData({
      showPayMethods: false,
    });
  },

  /**
   * 支付方式选择
   */
  selectPayMethods() {
    this.setData({
      showPayMethods: true
    });
  },

  /**
   * 选择所属地区
   */
  selectAddress() {
    console.log(this.data.basicInfoObj)
    wx.navigateTo({
      url: '/pages/personalCenter/healthRecord/selectAddress'
    })
  },

  /**
   * 慢病分类选择
   */
  clicks(e) {
    let index = e.currentTarget.dataset.index;
    let arrs = this.data.checks;
    if (arrs[index].checked == false) {
      arrs[index].checked = true;
    } else {
      arrs[index].checked = false;
    }
    this.setData({
      checks: arrs
    })
  },


  /**
   * 出生日期选择
   */
  onSelectBirth(event) {
    var date = new Date(event.detail);
    var year = date.getFullYear();  //年
    var mon = date.getMonth()+1;    //月    月份的范围是从0~11,所以获得的月份要加1才是当前月
    var day = date.getDate();   //日
    var temp = year + '-' + mon + '-' + day;
    var birth = 'basicInfoObj.birth';
    this.setData({
      currentDate: event.detail,
      showBirth: false,
      [birth]: temp,
    });
  },

  /**
   * 出生日期选择
   */
  onInput(event) {
    this.setData({
      currentDate: event.detail
    });
  },

  /**
   * 出生日期选择
   */
  selectBirth() {
    if (this.data.basicInfoObj.birth) {
      var arr = this.data.basicInfoObj.birth.split('-')
      this.setData({
        currentDate: new Date(arr[0], arr[1]-1, arr[2]).getTime(),
      });
    }
    this.setData({
      showBirth: true
    });
  },

  /**
   * 关闭出生日期上拉菜单
   */
  onCloseBirth() {
    this.setData({
      showBirth: false
    });
  },

  /**
   * 民族选择
   */
  selectNation() {
    this.setData({
      showNation: true
    });
  },

  /**
   * 民族选择已选
   */
  onSelectNation(event) {
    var nation = 'basicInfoObj.nation';
    this.setData({
      showNation: false,
      [nation]: event.detail.name,
    });
  },

  /**
   * 关闭民族上拉菜单
   */
  onCloseNation() {
    this.setData({
      showNation: false
    });
  },

  /**
   * 性别选择
   */
  selectSex() {
    this.setData({
      showSex: true
    });
  },

  /**
   * 关闭性别上拉菜单
   */
  onCloseSex() {
    this.setData({
      showSex: false
    });
  },

  /**
   * 已选性别
   */
  onSelectSex(event) {
    var sex = 'basicInfoObj.sex';
    this.setData({
      showSex: false,
      [sex]: event.detail.name,
    });
  },

  /**
   * 更换头像
   */
  switchHead: function() {

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
   * 
   * 选择图片
   */
  chooseWxImageShop: function(type) {

    var that = this;

    wx.chooseImage({

      sizeType: ['original', 'compressed'],

      sourceType: [type],

      success: function(res) {

        that.data.basicInfoObj.userimg = res.tempFilePaths[0],

          that.upload_file(urldate.upimg + 'shop/shopIcon', res.tempFilePaths[0])

        userimg = res.tempFilePaths[0];

        var temp = 'basicInfoObj.userimg';

        that.setData({

          temp: userimg

        })

      }

    })

  },

  /**
   * 
   * 上传图片到服务器
   */
  upload_file: function(url, filePath) {

    var that = this;

    var signature = signa.signaturetik('token=' + token, 'userAccessToken=' + userAccessToken, 'studentAccessToken=' + studentAccessToken);

    wx.uploadFile({

      url: urldate.upimg, //后台处理接口

      filePath: filePath,

      name: 'file',

      header: {

        'content-type': 'multipart/form-data'

      }, // 设置请求的 header

      formData: { //需要的参数

        'token': token,

        'signature': signature,

        'userAccessToken': userAccessToken,

        'studentAccessToken': studentAccessToken

      }, // HTTP 请求中其他额外的 form data

      success: function(res) {

        var data = JSON.parse(res.data);



        that.setData({

          userimg: data.path,

        });

        that.showMessage('上传成功');

      },

      fail: function(res) {

      }

    })

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    
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