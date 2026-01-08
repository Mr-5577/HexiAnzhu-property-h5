import store from '@/store/index.js';
import uniRequest from './request.js';

let apis = {}
//  测试
 apis.test = (callback) => {
	uniRequest.post('/api/test').then(callback)
 }
//登录
 apis.logins = (data, callback) => {
	uniRequest.post('/api/login', data).then(callback)
 }
 //发送短信
 apis.sendSms = (data, callback) => {
	uniRequest.post('/api/verificationCode', data).then(callback)
 }
 //获取房源
 apis.getResource = (data, callback) => {
 	uniRequest.post('/api/getResource', data).then(callback)
 }
 //绑定房产
 apis.bind = (data, callback) => {
 	uniRequest.post('/api/bind', data).then(callback)
 }
 //解绑房产
 apis.unbind = (data, callback) => {
 	uniRequest.post('/api/unbind', data).then(callback)
 }
 //获取当前房产和全部车位欠费信息
 apis.getDefult = (data, callback) => {
 	uniRequest.post('/api/getDefult', data).then(callback)
 }
 //获取房产物管费水电费欠费和预缴列表
 apis.getRoomsMaterial = (data, callback) => {
 	uniRequest.post('/api/getRoomsMaterial', data).then(callback)
 }
 //资源预缴信息
 apis.advancePaymentPage = (data, callback) => {
 	uniRequest.post('/api/advancePaymentPage', data).then(callback)
 }
  //资源预缴信息(新)
 apis.advancePaymentPagenew = (data, callback) => {
 	uniRequest.post('/api/advancePaymentPagenew', data).then(callback)
 }
 //欠费预缴生成同一订单
 apis.generateorder = (data, callback) => {
 	uniRequest.post('/api/generateorder', data).then(callback)
 }
 
 
 //车位服务费的欠费，车位水电欠费详情
 apis.getCarMaterial = (data, callback) => {
 	uniRequest.post('/api/getCarMaterial', data).then(callback)
 }
 //个人中心首页的数据
 apis.userCenter = (data, callback) => {
 	uniRequest.post('/api/userCenter', data).then(callback)
 }
 //用户选择缴费并提交订单
 apis.payList = (data, callback) => {
 	uniRequest.post('/api/payList', data).then(callback)
 }
 //每月账单
 apis.everyMonth = (data, callback) => {
 	uniRequest.post('/api/everyMonth', data).then(callback)
 }
 //房产月账单列表
 apis.roomsMonthBillList = (data, callback) => {
 	uniRequest.post('/api/roomsMonthBillList', data).then(callback)
 }
 //房产月账单列表
 apis.carMonthBillList = (data, callback) => {
 	uniRequest.post('/api/carMonthBillList', data).then(callback)
 } 
 //用户订单历史列表
 apis.getOrderSn = (data, callback) => {
 	uniRequest.post('/api/getOrderSn', data).then(callback)
 }
 //删除未支付订单
 apis.clearSnAttach = (data, callback) => {
 	uniRequest.post('/api/clearSnAttach', data).then(callback)
 }
 //取消未支付订单
 apis.delOrder = (data,callback) =>{
 	 uniRequest.post('/api/delOrder', data).then(callback)
 }
 //订单详情
 apis.orderInfo = (data, callback) => {
 	uniRequest.post('/api/orderInfo', data).then(callback)
 }
 //预缴
 apis.advancePayment = (data,callback) =>{
 	 uniRequest.post('/api/advancePayment', data).then(callback)
 }
 //充值
 apis.advanceCoin = (data,callback) =>{
 	 uniRequest.post('/api/advanceCoin', data).then(callback)
 }
 //账户信息
 apis.accountInfo = (data,callback) =>{
 	 uniRequest.post('/api/accountInfo', data).then(callback)
 }
 
 //微信支付
 apis.payMent = (data,callback) =>{
	 uniRequest.post('/api/payMent', data).then(callback)
 }
  //支付宝支付
 apis.aliPay = (data,callback) =>{
 	 uniRequest.post('/api/aliPay', data).then(callback)
 }
 
 //切换房产
 apis.changeRoom = (data,callback) =>{
 	 uniRequest.post('/api/changeRoom', data).then(callback)
 }
 
 
 
 //获取七牛云上传token
 apis.upToken = (data,callback) =>{
 	 uniRequest.post('/api/upToken', data).then(callback)
 }
 //获取报事报修类型
 apis.repairStart = (data,callback) =>{
 	 uniRequest.post('/api/repairStart', data).then(callback)
 }
 //新建报事报修客户联系人
 apis.addRepairContacts = (data,callback) =>{
 	 uniRequest.post('/api/addRepairContacts', data).then(callback)
 }
 //报事报修
 apis.repair = (data,callback) =>{
 	 uniRequest.post('/api/repair', data).then(callback)
 }
 
 //添加投诉建议
 apis.complaint = (data,callback) =>{
 	 uniRequest.post('/api/complaint', data).then(callback)
 }
 
 //报事报修列表
 apis.repairlist = (data,callback) =>{
 	 uniRequest.post('/api/repairlist', data).then(callback)
 }
 //报事报修详情
 apis.repairDetail = (data,callback) =>{
 	 uniRequest.post('/api/repairDetail', data).then(callback)
 }
 //投诉建议详情
 apis.complaintdetail = (data,callback) =>{
 	 uniRequest.post('/api/complaintdetail', data).then(callback)
 }
 
 
 //报事报修评价
 apis.evaluate = (data,callback) =>{
 	 uniRequest.post('/api/evaluate', data).then(callback)
 }
 
 //APP首页
 apis.homeIndex = (data,callback) =>{
 	 uniRequest.post('/api/index', data).then(callback)
 }
 //楼栋管家详情
 apis.stewardInfo = (data,callback) =>{
 	 uniRequest.post('/api/stewardInfo', data).then(callback)
 }
 //我的管家信息
 apis.keeperinfo = (data,callback) =>{
 	 uniRequest.post('/api/housekeeper_info', data).then(callback)
 }
 //管家评价列表
 apis.housekeeperEvaluate = (data,callback) =>{
 	 uniRequest.post('/api/housekeeper_evaluate', data).then(callback)
 }
 apis.housekeeperAddEvaluate = (data,callback) =>{
 	 uniRequest.post('/api/housekeeper_add_evaluate', data).then(callback)
 }
 

 
 //apk包更新信息
 apis.downLoadApp = (data,callback) =>{
 	 uniRequest.post('/api/downLoadApp', data).then(callback)
 }
 
 //通知公告的列表
 apis.circularList = (data,callback) =>{
 	 uniRequest.post('/api/circularList', data).then(callback)
 }
 //通知公告的详情
 apis.circularInfo = (data,callback) =>{
 	 uniRequest.post('/api/circularInfo', data).then(callback)
 }
 
 
 //小程序登录
 apis.login_xcx = (data,callback) =>{
 	 uniRequest.post('/api/login_xcx', data).then(callback)
 }
 //小程序端微信支付
 apis.payMentXcx = (data,callback) =>{
 	 uniRequest.post('/api/payMentXcx', data).then(callback)
 }
 //检测是否开通线上支付
 apis.checkpayway = (data,callback) =>{
 	 uniRequest.post('/api/checkpayway', data).then(callback)
 }
 //余额支付
 apis.balance = (data,callback) =>{
 	 uniRequest.post('/api/balance', data).then(callback)
 }
 //联系物业
 apis.contact =(data,callback) =>{
	 uniRequest.post('/api/contact', data).then(callback)
 }
 
 
//文件上传
apis.uploadRequest = (url,img) =>{
	return new Promise(resolve =>{
		uni.uploadFile({
			url:store.state.baseUrl + url,
			files:img,
			success(response){
				resolve(response)
			},
			fail(error){
				console.log("error: " + JSON.stringify(error));
			}
		})
	})
}
export default apis;
