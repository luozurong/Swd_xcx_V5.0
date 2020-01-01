// pages/patient/diseaseDesc/diseaseDesc.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    diseaseTime: ["一周内", "一月内", "半年内", "大于半年"],
    timeItem: '一周内', //默认显示的
    medicalHistory: ["无", "高血压", "糖尿病", "其他"],
    medicalHistoryItem: '无', //默认显示的
    allergicHistory: ["无", "青霉素", "链霉素", "其他"],
    allergicHistoryItem: '无', //默认显示的
    judgeList: ["否", "是"],
    familyHistoryItem: '否', //默认显示的
    abnormalItem: '否', //默认显示的
    lactationItem: '否', //默认显示的
    hepatorenalItem: '否', //默认显示的
    pics: [], //图片
    formData: {
      allergy: "无",
      diagnose: "",
      drugstoreId: "",
      expertId: "",
      familyMedicalHistory: "否",
      illnessDuration: "一周内",
      inquiryImgList: [],
      inquiryType: "6",
      mainSuit: "",
      medicalHistory: "无",
      patientId: "",
      // isPatientDiagnose: 0,
      // patientAge: null,
      // patientGender: null,
      // patientName: null
    },
    isLactation: '1', // sex=1，男，没有哺乳期。sex=2，女
    inquiryType: null,
    isSubmit: true,
    patientXian: null,  //处方药限制 inquiryType： 9
    mainSuit: []
  },

  // 肝肾功能
  bindHepatorenal: function(event) {
    var classify = event.currentTarget.dataset.classify;
    // console.log(classify); //当前点击项
    this.setData({
      hepatorenalItem: classify, //更新
    })
  },

  // 哺乳期
  bindLactation: function(event) {
    var classify = event.currentTarget.dataset.classify;
    // console.log(classify); //当前点击项
    this.setData({
      lactationItem: classify, //更新
    })
  },

  // 异常反应
  bindAbnormal: function(event) {
    var classify = event.currentTarget.dataset.classify;
    // console.log(classify); //当前点击项
    this.setData({
      abnormalItem: classify, //更新
    })
  },

  // 家族史
  bindfamilyHistory: function(event) {
    var classify = event.currentTarget.dataset.classify;
    // console.log(classify); //当前点击项
    var temp = 'formData.familyMedicalHistory'
    if (classify == '是') {
      this.setData({
        [temp]: '', //更新
        familyHistoryItem: classify, //更新
      })
    } else {
      this.setData({
        [temp]: classify, //更新
        familyHistoryItem: classify, //更新
      })
    }
  },

  // 过敏史
  bindAllergicHistory: function(event) {
    var classify = event.currentTarget.dataset.classify;
    // console.log(classify); //当前点击项
    var temp = 'formData.allergy'
    if (classify == '其他') {
      this.setData({
        [temp]: '', //更新
        allergicHistoryItem: classify, //更新
      })
    } else {
      this.setData({
        [temp]: classify, //更新
        allergicHistoryItem: classify, //更新
      })
    }
  },

  // 病史
  bindMedicalHistory: function(event) {
    var that = this;
    var classify = event.currentTarget.dataset.classify;
    // console.log(classify); //当前点击项
    var temp = 'formData.medicalHistory'
    if (classify == '其他') {
      this.setData({
        [temp]: '', //更新
        medicalHistoryItem: classify, //更新
      })
    } else {
      that.setData({
        [temp]: classify, //更新
        medicalHistoryItem: classify, //更新
      })
    }
  },

  // 疾病时长
  bindTime: function(event) {
    var classify = event.currentTarget.dataset.classify;
    // console.log(classify); //当前点击项
    var temp = 'formData.illnessDuration'
    this.setData({
      [temp]: classify, //更新
      timeItem: classify, //更新
    })
  },

  /**
   * 监听过敏史填写
   */
  watchAllergy: function(event) {
    var temp = 'formData.allergy'
    this.setData({
      [temp]: event.detail.value, //更新
    })
  },

  /**
   * 监听家族史填写
   */
  watchFamilyMedicalHistory: function(event) {
    var temp = 'formData.familyMedicalHistory'
    this.setData({
      [temp]: event.detail.value, //更新
    })
  },

  /**
   * 监听既往病史填写
   */
  watchMedicalHistory: function(event) {
    var temp = 'formData.medicalHistory'
    this.setData({
      [temp]: event.detail.value, //更新
    })
  },

  /**
   * 监听主诉填写
   */
  watchMainSuit: function(event) {
    var temp = 'formData.mainSuit'
    this.setData({
      [temp]: event.detail.value, //更新
    })
  },

  /**
   * 监听疾病填写
   */
  diagnoseBlur: function (event) {
    var temp = 'formData.diagnose'
    this.setData({
      [temp]: event.detail.value, //更新
    })
  },

  /**
   * 提交信息
   */
  submit() {
    if (this.data.isSubmit) {
      this.setData({
        isSubmit: false
      })
      setTimeout(() => {
        this.setData({
          isSubmit: true
        })
      }, 1000);
    } else {
      return false;
    }
    if (this.data.abnormalItem == '是') {
      wx.showToast({
        title: '互联网医院暂不能提供用药异常患者开处方',
        icon: 'none',
        duration: 1000
      })
      return
    }
    if (this.data.lactationItem == '是') {
      wx.showToast({
        title: '互联网医院暂不能提供孕、哺乳期患者开处方',
        icon: 'none',
        duration: 1000
      })
      return
    }
    if (this.data.hepatorenalItem == '是') {
      wx.showToast({
        title: '互联网医院暂不能提供肝肾功能异常患者开处方',
        icon: 'none',
        duration: 1000
      })
      return
    }
    var values = this.data.formData;
    if (this.data.inquiryType == 9 && !values.diagnose){
      wx.showToast({
        title: '请输入您确诊的疾病',
        icon: 'none',
        duration: 1000
      })
      return
    }
    if (!values.mainSuit) {
      wx.showToast({
        title: '请输您目前哪里不舒服',
        icon: 'none',
        duration: 1000
      })
      return
    }
    if (!values.medicalHistory) {
      wx.showToast({
        title: '请补充其他既往病史',
        icon: 'none',
        duration: 1000
      })
      return
    }
    if (!values.allergy) {
      wx.showToast({
        title: '请补充其他过敏史',
        icon: 'none',
        duration: 1000
      })
      return
    }
    if (!values.familyMedicalHistory) {
      wx.showToast({
        title: '请补充家族史信息',
        icon: 'none',
        duration: 1000
      })
      return
    }
    var pics = this.data.pics;
    values.inquiryImgList = pics;
    // for (var i in pics){
    //   values.inquiryImgList.unshift(pics[i])
    // }

    const that = this;
    let params = {
      header: {},
      body: null
    };
    params.body = values;
    if (that.data.inquiryType == 9){
      params.body.inquiryType = 9;
      let patientXian = that.data.patientXian;
      
      let age = that.data.formData.patientAge;
      let sex = that.data.formData.patientGender;
      let drugNameAge = [];
      let drugNameSex = [];
      if (patientXian.length > 0){
        for (let i in patientXian) {
          let ageFlag = false;
          let sexFlag = false;
          let sexXian = [];
          if (patientXian[i].preCheck) {
          for (let k in patientXian[i].preCheck.preCheckDiaList) {
            
              //年龄
              if (age > patientXian[i].preCheck.preCheckDiaList[k].maxAge || age < patientXian[i].preCheck.preCheckDiaList[k].minAge) ageFlag = false;
              else ageFlag = true;

              //性别
              sexXian.push(patientXian[i].preCheck.preCheckDiaList[k].sex);
           
            

          }
          //console.log('数组：'+ sexXian); 
          if (sexXian.indexOf(3) != -1 || sexXian.indexOf(parseInt(sex)) != -1) sexFlag = true;
          else sexFlag = false;
          // console.log('判断：' + sexXian.indexOf(3) != -1, sexXian.indexOf(parseInt(sex)) != -1);
          // console.log('结果：' + sexFlag);

          if (!ageFlag) drugNameAge.push(patientXian[i].preCheck.apDrugName);
          if (!sexFlag) drugNameSex.push(patientXian[i].preCheck.apDrugName);
          }
        }

        //年龄判断
        let drugNameAgeTamp = Array.from(new Set(drugNameAge));
        if (drugNameAgeTamp.length > 0) {
          wx.showModal({
            content: `用药人的年龄与${drugNameAgeTamp.toString()}药品的使用年龄不一致，确认继续购买？`,
            showCancel: true,
            cancelText: '修改',
            cancelColor: '#aaa',
            confirmText: '确定',
            confirmColor: '',
            success: function (res) {
              wx.setStorageSync('patientInfo', params.body);
              wx.navigateBack({
                delta: 2
              })
              return false;
            },
            fail: function (res) { },
          })
          return false;
        }

        //性别判断
        let drugNameSexTamp = Array.from(new Set(drugNameSex));
        if (drugNameSexTamp.length > 0) {
          wx.showModal({
            content: `用药人的性别与${drugNameSexTamp.toString()}药品的使用性别不一致，确认继续购买？`,
            showCancel: true,
            cancelText: '修改',
            cancelColor: '#aaa',
            confirmText: '确定',
            confirmColor: '',
            success: function (res) {
              wx.setStorageSync('patientInfo', params.body);
              wx.navigateBack({
                delta: 2
              })
              return false;
            },
            fail: function (res) { },
          })
          return false;
        }
      }
    
      wx.setStorageSync('patientInfo', params.body);
      wx.navigateBack({
        delta: 2
      })
      return false;
    }


    getApp().API.inquiryOrderSubmit(params).then(data => {
      if (data.code == 0) {
        
        if(data.data.orderId == ''){
          wx.showToast({
            title: data.message,
            icon: 'none'
          })
          return false;
        }
        
        var orderId = data.data.orderId;
        wx.navigateTo({
          url: '/pages/mall/pay/pay?orderId=' + orderId + '&businessType=1' + '&jumpType=1'
        })
      }
    }).catch(err => { })


  },

  /**
   * 根据处方药商品id列表，查询对应的处方药的详细数据
   */
  queryRxDrugs(){
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
        this.setData({
          patientXian: res.data
        });
        console.log(this.data.patientXian);
        let patientXianTamp = this.data.patientXian;
        let mainSuit = [];
        for(let i in patientXianTamp){
          if (patientXianTamp[i].preCheck){
            for (let j in patientXianTamp[i].preCheck.preCheckDiaList) {
              if (patientXianTamp[i].preCheck.preCheckDiaList[j].mainSuit) {
                mainSuit.push(patientXianTamp[i].preCheck.preCheckDiaList[j].mainSuit)
              }
            }
          }
        }
        let mainSuitTamp = Array.from(new Set(mainSuit));
        let mainSuitTampAttr = [];
        for (let k in mainSuitTamp){
          let mainSuitTampAttrObje = {
            name: mainSuitTamp[k],
            flag: false
          }
          mainSuitTampAttr.push(mainSuitTampAttrObje)
        }
        this.setData({
          mainSuit: mainSuitTampAttr
        })
      }
    })
  },

  /**
   * 选择疾病
   */
  chooseSuit(e){
    let index = e.currentTarget.dataset.index;
    let mainSuitTamp = this.data.mainSuit;
    
    mainSuitTamp[index].flag = mainSuitTamp[index].flag ? false : true;
    this.setData({
      mainSuit: mainSuitTamp
    });
    if (mainSuitTamp[index].flag) {
      var temp = 'formData.diagnose'
      let diagnoseString = this.data.formData.diagnose;
      diagnoseString += mainSuitTamp[index].name;
      this.setData({
        [temp]: diagnoseString, //更新
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // console.log(getCurrentPages())
    var temp1 = 'formData.expertId'
    var temp2 = 'formData.patientId'
    this.setData({
      [temp1]: options.expertId, //更新
      [temp2]: options.patientId, //更新
      isLactation: options.sex, //更新
    });

    var temp3 = 'formData.patientAge';
    var temp4 = 'formData.patientGender';
    var temp5 = 'formData.patientName';
    if (options.inquiryType == 9){
      this.setData({
        inquiryType: 9,
        [temp3]: options.patientAge,
        [temp4]: options.patientGender,
        [temp5]: options.patientName
      })
    }

    this.queryRxDrugs();

    console.log(options.commodityIds)
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

  },

  /**
   * 图片放大查看
   */
  previewImg: function (e) {

    var index = e.target.dataset.index; //当前图片地址
    var imgArr = e.target.dataset.list; //所有要预览的图片的地址集合 数组形式
    console.log(index, imgArr)
    wx.previewImage({
      current: imgArr[index],
      urls: imgArr,
    })
  },
  /**
   * 图片上传
   * 
   */

  //上传图片开始
  chooseImg: function (e) {
    var that = this,
      pics = this.data.pics;
    if (pics.length < 5) {
      wx.chooseImage({
        count: 5 - that.data.pics.length, // 最多可以选择的图片张数，默认9
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
              url: getApp().globalData.host + '/oss/oss/upload', //仅为示例，非真实的接口地址
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
  },

})