import request from './request.js';
import baseUrl from './baseUrl.js'
class agriknow {
  constructor() {
    this._baseUrl = baseUrl;
    console.log(this._baseUrl);
    this._defaultHeader = {
      'Content-Type': 'application/json'
    };
    this._request = new request;
    this._request.setErrorHandler(this.errorHander)
  }

  /**
   * 获取用户登录授权token，userId
   */
  getLoginInfo() {
    this._request._data.body.roleId = wx.getStorageSync('userId') || '';
    this._request._header = {
      authorization: 'Bearer ' + wx.getStorageSync('token') || '',
    }
  }

  /**
   * 统一的异常处理方法
   */
  errorHander(res) {
    console.error(res)
  }

  /**
   * 数据接口
   */
  getAddressList(data) { // 获取收货地址列表
    return this._request.postRequest(this._baseUrl + '/mall/appMall/getReciveSite', data).then(res => res.data).catch(e => console.log(e))
  }
  getAddressDetail(data) { // 获取收货地址详情
    return this._request.postRequest(this._baseUrl + '/mall/appMall/getSiteDetail', data).then(res => res.data).catch(e => console.log(e))
  }
  getSaveAddress(data) { // 保存收货地址
    return this._request.postRequest(this._baseUrl + '/mall/appMall/addReciveSite', data).then(res => res.data).catch(e => console.log(e))
  }
  getDeleteAddress(data) { // 删除收货地址
    return this._request.postRequest(this._baseUrl + '/mall/appMall/delSite', data).then(res => res.data).catch(e => console.log(e))
  }
  getUpdateAddress(data) { // 更新收货地址
    return this._request.postRequest(this._baseUrl + '/mall/appMall/updateSite', data).then(res => res.data).catch(e => console.log(e))
  }
  getHealthBonus(data) { // 获取健康奖金
    return this._request.postRequest(this._baseUrl + '/appService/personInfo/getHealthBonusList', data).then(res => res.data).catch(e => console.log(e))
  }
  myInquiryList(data) { //获取问诊列表
    return this._request.postRequest(this._baseUrl + '/appService/inquiryOrder/myInquiryList', data).then(res => res.data).catch(e => console.log(e))
  }
  getInquiryList(data) { //获取问诊列表
    return this._request.postRequest(this._baseUrl + '/appService/inquiryOrder/getInquiryList', data).then(res => res.data).catch(e => console.log(e))
  }
  getArticle(data) { // 文章详情
    return this._request.postRequest(this._baseUrl + '/news/infoDetail/getArticle', data).then(res => res.data).catch(e => console.log(e))
  }
  getMyDoctorList(data) { // 医生列表
    return this._request.postRequest(this._baseUrl + '/appService/personInfo/getMyDoctorList', data).then(res => res.data).catch(e => console.log(e))
  }
  getDoctorPage(data) { // 医生主页
    return this._request.postRequest(this._baseUrl + '/appService/employee/getEmployeeInfoById', data).then(res => res.data).catch(e => console.log(e))
  } 
  getDepartmentInfo(data) { // 名医堂
    return this._request.postRequest(this._baseUrl + '/appService/depDoctor/getDepartmentInfo', data).then(res => res.data).catch(e => console.log(e))
  } 
  homeClassification(data) { // 商城首页商品分类
    return this._request.postRequest(this._baseUrl + '/mall/appMall/homeClassification', data).then(res => res.data).catch(e => console.log(e))
  }
  saveComToCar(data) { // 加入购物车
    return this._request.postRequest(this._baseUrl + '/mall/appMall/saveComToCar', data).then(res => res.data).catch(e => console.log(e))
  }
  getShopCarNum(data) { // 获取购物车数量
    return this._request.postRequest(this._baseUrl + '/mall/appMall/getShopCarNum', data).then(res => res.data).catch(e => console.log(e))
  }
  getUnEfficacyCommodity(data) { //获取购物车失效商品
    return this._request.postRequest(this._baseUrl + '/mall/appMall/getUnEfficacyCommodity', data).then(res => res.data).catch(e => console.log(e))
  }
  delBatchShopCar(data) { //批量删除购物车商品
    return this._request.postRequest(this._baseUrl + '/mall/appMall/delBatchShopCar', data).then(res => res.data).catch(e => console.log(e))
  }
  getColumnList(data) { // 获取栏目列表
    return this._request.postRequest(this._baseUrl + '/mall/appMall/getColumnList', data).then(res => res.data).catch(e => console.log(e))
  }
  getColumnCommodity(data) { // 获取栏目列表数据
    return this._request.postRequest(this._baseUrl + '/mall/appMall/getColumnCommodity', data).then(res => res.data).catch(e => console.log(e))
  }
  classiCommodityList(data) { // 获取分类列表数据
    return this._request.postRequest(this._baseUrl + '/mall/appMall/classiCommodityList', data).then(res => res.data).catch(e => console.log(e))
  }
  commodityDetil(data) { // 获取商品详情
    return this._request.postRequest(this._baseUrl + '/mall/appMall/commodityDetil', data).then(res => res.data).catch(e => console.log(e))
  }
  getRequirementListNum(data) { // 获取需求清单数量
    return this._request.postRequest(this._baseUrl + '/mall/requirementList/getRequirementListNum', data).then(res => res.data).catch(e => console.log(e))
  }
  saveRequirementCom(data) { // 加入需求清单
    return this._request.postRequest(this._baseUrl + '/mall/requirementList/saveRequirementCom', data).then(res => res.data).catch(e => console.log(e))
  } 
  getRequirementList(data) { // 需求清单列表
    return this._request.postRequest(this._baseUrl + '/mall/requirementList/getRequirementList', data).then(res => res.data).catch(e => console.log(e))
  }
  changeRequirementNum(data) { // 需求清单列表
    return this._request.postRequest(this._baseUrl + '/mall/requirementList/changeRequirementNum', data).then(res => res.data).catch(e => console.log(e))
  }
  delRequirement(data) { //删除清单列表商品
    return this._request.postRequest(this._baseUrl + '/mall/requirementList/delRequirement', data).then(res => res.data).catch(e => console.log(e))
  }
  requirementListChangeSelect(data) { //保存清单列表商品状态
    return this._request.postRequest(this._baseUrl + '/mall/requirementList/changeSelect', data).then(res => res.data).catch(e => console.log(e))
  }
  searchCommodity(data) { // 商品搜索
    return this._request.postRequest(this._baseUrl + '/mall/appMall/searchCommodity', data).then(res => res.data).catch(e => console.log(e))
  }
  getShopCarList(data) { // 购物车列表
    return this._request.postRequest(this._baseUrl + '/mall/appMall/getShopCarList', data).then(res => res.data).catch(e => console.log(e))
  }
  changeCarNum(data) { // 某个商品的数量
    return this._request.postRequest(this._baseUrl + '/mall/appMall/changeCarNum', data).then(res => res.data).catch(e => console.log(e))
  }
  changeSelect(data) { // 选中1个商品
    return this._request.postRequest(this._baseUrl + '/mall/appMall/changeSelect', data).then(res => res.data).catch(e => console.log(e))
  }
  chooseAll(data) { // 全选选中商品
    return this._request.postRequest(this._baseUrl + '/mall/appMall/chooseAll', data).then(res => res.data).catch(e => console.log(e))
  }
  delShopCar(data) { // 删除购物车商品
    return this._request.postRequest(this._baseUrl + '/mall/appMall/delShopCar', data).then(res => res.data).catch(e => console.log(e))
  }
  recommendComList(data) { // 删除购物车商品
    return this._request.postRequest(this._baseUrl + '/mall/appMall/recommendComList', data).then(res => res.data).catch(e => console.log(e))
  }
  getPrescriptionSign(data) { // 获取处方信息
    return this._request.postRequest(this._baseUrl + '/appService/prescription/getPrescriptionSign', data).then(res => res.data).catch(e => console.log(e))
  }
  getCommodityIds(data) { // 药品获取商品信息
    return this._request.postRequest(this._baseUrl + '/appService/appCommodity/getCommodityIds', data).then(res => res.data).catch(e => console.log(e))
  }
  perOrder(data) { // 预下单
    return this._request.postRequest(this._baseUrl + '/mall/appMall/perOrder', data).then(res => res.data).catch(e => console.log(e))
  }
  placeOrder(data) { // 去下单
    return this._request.postRequest(this._baseUrl + '/mall/appMall/placeOrder', data).then(res => res.data).catch(e => console.log(e))
  }
  placeVisitOrder(data) { // 凭方开药下单
    return this._request.postRequest(this._baseUrl + '/mall/appMall/placeVisitOrder', data).then(res => res.data).catch(e => console.log(e))
  }
  queryRxDrugs(data) { // 商品获取处方药品信息
    return this._request.postRequest(this._baseUrl + '/appService/drug/queryRxDrugs', data).then(res => res.data).catch(e => console.log(e))
  }
  getPayOrderInfo(data) { // 获取订单信息
    return this._request.postRequest(this._baseUrl + '/appService/pay/getPayOrderInfo', data).then(res => res.data).catch(e => console.log(e))
  }
  getOrderList(data) { // 获取订单列表
    return this._request.postRequest(this._baseUrl + '/mall/order/getOrderList', data).then(res => res.data).catch(e => console.log(e))
  }
  rebuyCheck(data) { // 获取失效商品
    return this._request.postRequest(this._baseUrl + '/appService/mallOrder/rebuyCheck', data).then(res => res.data).catch(e => console.log(e))
  }
  subClassification(data) { // 获取商品二级分类数据
    return this._request.postRequest(this._baseUrl + '/mall/appMall/subClassification', data).then(res => res.data).catch(e => console.log(e))
  }
  getDoctorInfo(data) { // 获取科室医生信息
    return this._request.postRequest(this._baseUrl + '/appService/depDoctor/getDoctorListByDepId', data).then(res => res.data).catch(e => console.log(e))
  }
  wxProgramPay(data) { // 支付获取的签名
    return this._request.postRequest(this._baseUrl + '/appService/wxProgram/wxProgramPay', data).then(res => res.data).catch(e => console.log(e))
  }
  wxProgramOrderQuery(data) { // 确认支付
    return this._request.postRequest(this._baseUrl + '/appService/wxProgram/wxProgramOrderQuery', data).then(res => res.data).catch(e => console.log(e))
  }
  unifyOrder(data) { // 余额支付
    return this._request.postRequest(this._baseUrl + '/appService/pay/unifyOrder', data).then(res => res.data).catch(e => console.log(e))
  }
  classiCommodityList(data) { // 获取不同商品分类列表数据
    return this._request.postRequest(this._baseUrl + '/mall/appMall/classiCommodityList', data).then(res => res.data).catch(e => console.log(e))
  }
  getOrderDetail(data) { // 获取订单详情
    return this._request.postRequest(this._baseUrl + '/mall/order/getOrderDetail', data).then(res => res.data).catch(e => console.log(e))
  }
  evaluate(data) { // 提交评论
    return this._request.postRequest(this._baseUrl + '/appService/mallOrder/evaluate', data).then(res => res.data).catch(e => console.log(e))
  }
  getUserAccountInfo(data) { // 获取用户信息
    this.getLoginInfo();
    return this._request.postRequest(this._baseUrl + '/appService/accountInfo/getUserAccountInfo', data).then(res => res.data).catch(e => console.log(e))
  }
  appPic(data) {    // 轮播图
    return this._request.postRequest(this._baseUrl + '/appService/appPic/pic', data).then(res => res.data).catch(e => console.log(e))
  }                        
  getConsultTimeList(data) { // 获取咨询次数列表
    return this._request.postRequest(this._baseUrl + '/appService/personInfo/getConsultTimeList', data).then(res => res.data).catch(e => console.log(e))
  }
  getInsuranceList(data) { // 我的保险
    return this._request.postRequest(this._baseUrl + '/appService/personInfo/getInsuranceList', data).then(res => res.data).catch(e => console.log(e))
  }
  getCollectionList(data) { // 我的收藏
    return this._request.postRequest(this._baseUrl + '/appService/personInfo/getCollectionList', data).then(res => res.data).catch(e => console.log(e))
  }
  getPatientList(data) { // 亲友管理（获取就诊人）
    return this._request.postRequest(this._baseUrl + '/appService/patient/getPatientList', data).then(res => res.data).catch(e => console.log(e))
  }
  visitPatientDetail(data) { // 查询患者信息
    return this._request.postRequest(this._baseUrl + '/appService/inquiryOrder/visitPatientDetail', data).then(res => res.data).catch(e => console.log(e))
  }
  savePatientInfo(data) { // 保存亲友管理（保存就诊人）
    return this._request.postRequest(this._baseUrl + '/appService/patient/savePatientInfo', data).then(res => res.data).catch(e => console.log(e)   )
  }
  getMessage(data) { // 消息中心
    return this._request.postRequest(this._baseUrl + '/umc/message/getMessage', data).then(res => res.data).catch(e => console.log(e))
  }
  getReaded(data) { // 消息中心已读接口
    return this._request.postRequest(this._baseUrl + '/umc/message/updateReadedStatus', data).then(res => res.data).catch(e => console.log(e))
  }
  inquiryOrderSubmit(data) { // 消息中心已读接口
    return this._request.postRequest(this._baseUrl + '/appService/inquiryOrder/submit', data).then(res => res.data).catch(e => console.log(e))
  }
  getMyMedicalList(data) { // 我的病历
    return this._request.postRequest(this._baseUrl + '/appService/personInfo/getMyMedicalList', data).then(res => res.data).catch(e => console.log(e))
  }
  getMedicalDetailByOrderId(data) { // 病历详情
    return this._request.postRequest(this._baseUrl + '/appService/prescription/getMedicalDetailByOrderId', data).then(res => res.data).catch(e => console.log(e))
  }
  getOrderCommodity(data) { // 获取售后订单商品信息
    return this._request.postRequest(this._baseUrl + '/appService/refundApply/getOrderCommodity', data).then(res => res.data).catch(e => console.log(e))
  }
  saveRefundOrder(data) { // 生成售后订单
    return this._request.postRequest(this._baseUrl + '/appService/refundApply/saveRefundOrder', data).then(res => res.data).catch(e => console.log(e))
  }
  getOrderList(data) { // 获取商城订单列表
    return this._request.postRequest(this._baseUrl + '/mall/order/getOrderList', data).then(res => res.data).catch(e => console.log(e))
  }
  cancelOrder(data) { // 取消商城待支付订单
    return this._request.postRequest(this._baseUrl + '/mall/order/cancelOrder', data).then(res => res.data).catch(e => console.log(e))
  }
  refundMoney(data) { // 待发货退款
    return this._request.postRequest(this._baseUrl + '/mall/order/refundMoney', data).then(res => res.data).catch(e => console.log(e))
  }
  getOrderDetail(data) { // 获取订单详情
    return this._request.postRequest(this._baseUrl + '/mall/order/getOrderDetail', data).then(res => res.data).catch(e => console.log(e))
  }
  getInquiryOrderDetails(data) { // 获取问诊订单详情
    return this._request.postRequest(this._baseUrl + '/appService/inquiryOrder/getInquiryOrderDetails', data).then(res => res.data).catch(e => console.log(e))
  }
  orderPreviewAmount(data) { // 获取我的订单右上角数字
    return this._request.postRequest(this._baseUrl + '/appService/mallOrder/orderPreviewAmount', data).then(res => res.data).catch(e => console.log(e))
  }
  getInquiryOrderList(data) { // 获取问诊订单列表
    return this._request.postRequest(this._baseUrl + '/appService/visitOrder/getInquiryOrderList', data).then(res => res.data).catch(e => console.log(e))
  }
  getRelationArticle(data) { // 文章相关阅读
    return this._request.postRequest(this._baseUrl + '/news/infoDetail/getRelationArticle', data).then(res => res.data).catch(e => console.log(e))
  }
  confirmReceipt(data) { // 商城确定收货
    return this._request.postRequest(this._baseUrl + '/appService/mallOrder/confirmReceipt', data).then(res => res.data).catch(e => console.log(e))
  }
  getExpressInfo(data) { // 订单物流信息
    return this._request.postRequest(this._baseUrl + '/mall/order/getExpressInfo', data).then(res => res.data).catch(e => console.log(e))
  }
  updateNumber(data) { // 文章点赞/取消---文章收藏/取消收藏
    return this._request.postRequest(this._baseUrl + '/news/infoDetail/updateNumber', data).then(res => res.data).catch(e => console.log(e))
  }
  getRefundOrder(data) { // 获取售后订单详情
    return this._request.postRequest(this._baseUrl + '/appService/refundApply/getRefundOrder', data).then(res => res.data).catch(e => console.log(e))
  }
  updatePersonInfo(data) { // 保存个人资料
    return this._request.postRequest(this._baseUrl + '/appService/personInfo/updatePersonInfo', data).then(res => res.data).catch(e => console.log(e))
  }
  getRefundPage(data) { // 获取售后订单列表
    return this._request.postRequest(this._baseUrl + '/appService/refundApply/getRefundPage', data).then(res => res.data).catch(e => console.log(e))
  }
  getIncomeInfoList(data) { // 获取余额
    return this._request.postRequest(this._baseUrl + '/appService/personInfo/getIncomeInfoList', data).then(res => res.data).catch(e => console.log(e))
  }
  getPrescriptionSign(data) { // 获取处方笺
    return this._request.postRequest(this._baseUrl + '/appService/prescription/getPrescriptionSign', data).then(res => res.data).catch(e => console.log(e))
  }
  getMeasureDataBySfzh(data) { // 获取一体机测量数据根据身份证
    return this._request.postRequest(this._baseUrl + '/healthPlatform/deviceMeasuredData/getMeasureDataBySfzh', data).then(res => res.data).catch(e => console.log(e))
  }
  updateSelfInfo(data) { // 保存本人信息(就诊人页面使用，精简了头像，地址，昵称等字段。并且身份证为非必填)
    return this._request.postRequest(this._baseUrl + '/appService/patient/updateSelfInfo', data).then(res => res.data).catch(e => console.log(e))
  }
  getPhoneByFaceId(data) { //通过faceId获取对应绑定的手机号码
    return this._request.postRequest(this._baseUrl + '/appService/doorPhone/getPhoneByFaceId', data).then(res => res.data).catch(e => console.log(e))
  } 
  bindAccountPhoneByFaceId(data) { //通过faceId获取对应绑定的手机号码
    return this._request.postRequest(this._baseUrl + '/appService/doorPhone/bindAccountPhoneByFaceId', data).then(res => res.data).catch(e => console.log(e))
  } 
}

export default agriknow