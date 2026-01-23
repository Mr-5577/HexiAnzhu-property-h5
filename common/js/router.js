import Vue from 'vue'
import Router from 'uni-simple-router'
import store from '@/store/index.js'
import api from '@/common/js/api.js'
Vue.use(Router)
const router = new Router({
	routes: [{
			name: "index",
			path: "/pages/main/index/index"
		},
		{
			name: "payment",
			path: "/pages/payment/payment"
		},
		{
			name: "login",
			path: "/pages/login/login"
		},
		{
			name: "complaint",
			path: "/pages/main/maintenance/complaint"
		},
		{
			name: "maintenance",
			path: "/pages/main/maintenance/maintenance"
		},
		{
			name: "add-person",
			path: "/pages/main/maintenance/add-person"
		},
		{
			name: "bill-detail",
			path: "/pages/main/est-pay/bill-detail"
		},
		{
			name: "bill-type-detail",
			path: "/pages/main/est-pay/bill-type-detail"
		},
		{
			name: "more-bill",
			path: "/pages/main/est-pay/more-bill"
		},
		{
			name: "charge-explain",
			path: "/pages/main/est-pay/charge-explain"
		},
		{
			name: "charge-records",
			path: "/pages/main/est-pay/charge-records"
		},
		{
			name: "charge-money",
			path: "/pages/main/est-pay/charge-money"
		},
		{
			name: "est-pay",
			path: "/pages/main/est-pay/est-pay"
		},
		{
			name: "pre-pay",
			path: "/pages/main/est-pay/pre-pay"
		},
		{
			name: "shopping",
			path: "/pages/shopping/shopping"
		}, {
			name: "community",
			path: "/pages/community/community"
		},
		{
			name: "bound-house",
			path: "/pages/reg/bound-house/bound-house"
		},
		{
			name: "add-tower",
			path: "/pages/reg/bound-house/add-tower"
		}, {
			name: "add-project",
			path: "/pages/reg/bound-house/add-project"
		}, {
			name: "add-unit",
			path: "/pages/reg/bound-house/add-unit"
		}, {
			name: "add-room",
			path: "/pages/reg/bound-house/add-room"
		}, {
			name: "add-city",
			path: "/pages/reg/bound-house/add-city"
		}, {
			name: "message",
			path: "/pages/message/message"
		}, {
			name: "notice",
			path: "/pages/main/notice/notice"
		}, {
			name: "notice-detail",
			path: "/pages/main/notice/detail"
		}, {
			name: "call",
			path: "/pages/main/call/call"
		},
		{
			name: "center",
			path: "/pages/user/center/center"
		},
		{
			name: "my-house",
			path: "/pages/user/my-house/my-house"
		}, {
			name: "choose-type",
			path: "/pages/main/est-pay/choose-type"
		}, {
			name: "to-pay",
			path: "/pages/main/est-pay/to-pay"
		}, {
			name: "car-to-pay",
			path: "/pages/main/car/car-to-pay"
		}, {
			name: "car-pay",
			path: "/pages/main/car/car-pay"
		}, {
			name: "order",
			path: "/pages/user/order/order"
		}, {
			name: "order-detail",
			path: "/pages/user/order/detail"
		},
		{
			name: "repair-order",
			path: "/pages/user/repair-order/repair-order"
		},
		{
			name: "repair-order-detail",
			path: "/pages/user/repair-order/detail"
		},

		{
			name: "my-car",
			path: "/pages/user/my-car/my-car"
		},
		{
			name: "about",
			path: "/pages/user/about/about"
		},
		{
			name: "user-agreement",
			path: "/pages/user/user-agreement/user-agreement"
		},
		{
			name: "service-explain",
			path: "/pages/user/service-explain/service-explain"
		},
		{
			name: "my-key",
			path: "/pages/main/my-key/my-key"
		},
		{
			name: "housekeeper",
			path: "/pages/main/housekeeper/housekeeper"
		},
		{
			name: "add-review",
			path: "/pages/main/housekeeper/add-review"
		},
		{
			name: "electronic_invoice",
			path: "/pages/main/electronic_invoice/electronic_invoice"
		},
		{
			name: "electronic_invoice_detail",
			path: "/pages/main/electronic_invoice/detail"
		},
		{
			name: "evaluate",
			path: "/pages/user/repair-order/evaluate"
		},
		{
			name: "est-oweAndpre-pay",
			path: "/pages/main/est-pay/est-oweAndpre-pay/est-oweAndpre-pay"
		},
		{
			name: "est-car-oweAndpre-pay",
			path: "/pages/main/car/est-car-oweAndpre-pay"
		},
		{
			name: "author",
			path: "/pages/author/author"
		},
		{
			name: "appointment",
			path: "/pages/main/appointment/appointment"
		},
		{
			name: "akeyhall",
			path: "/pages/main/akeyhall/akeyhall"
		},
		{
			name: "akeyhall-success",
			path: "/pages/main/akeyhall/success"
		},
		{
			name: "integrated-service",
			path: "/pages/main/service/integrated-service"
		},
		{
			name: "activity-detail",
			path: "/pages/main/activity/activity-detail"
		},
		{
			name: "visitor-register",
			path: "/pages/visitor/visitor-register"
		}
	]
})
router.beforeEach(async (to, from, next) => {
	//进入主页路由不用验证是否绑定房产和登录
	// 配置化白名单
	const WHITE_ROUTES = [
		'index',
		'center',
		'author',
		'shopping',
		'about',
		'user-agreement',
		'service-explain',
		'add-tower',
		'add-project',
		'add-unit',
		'add-room',
		'add-city',
		'order-detail',
		'choose-type',
		'car-pay',
		'est-pay',
		'visitor-register'
	]
	if (WHITE_ROUTES.includes(to.name)) {
		next()
		return
	}
	if (!store.state.hasLogin) { //验证是否登录
		if (to.name === 'login') {
			next();
			return;
		}
		// let codeRes = await uni.login()
		// await api.getUserOpenid({
		// 	code: codeRes[1].code
		// }, res => {
		// 	if (res.code == 1) {
		// 		api.login_by_openid_xcx({
		// 			cache_name: res.data
		// 		},res =>{
		// 			if(res.code == 1){
		// 				store.commit('loginToken', res.data);
		// 				next();
		// 			}else{
		// 				uni.showModal({
		// 					content: '请先登录',
		// 					confirmColor: '#ffcf5a',
		// 					success(res) {
		// 						if (res.confirm) {
		// 							next({
		// 								name: 'login',
		// 								NAVTYPE: 'push'
		// 							});
		// 						}
		// 					}
		// 				});
		// 			}
		// 		})
		// 	}
		// })
		uni.showModal({
			content: '请先登录',
			cancelColor: '#898989',
			cancelText: '不去了',
			confirmColor: '#fe845e',
			confirmText: '去登录',
			success(res) {
				if (res.confirm) {
					next({
						name: 'login',
						NAVTYPE: 'push'
					});
				}
			}
		});
		return;
	}
	if (!store.state.hasBoundHouse) { //验证是否绑定房产
		if (to.name === 'bound-house') {
			next();
			return;
		}
		uni.showModal({
			title: '未绑定房产',
			cancelColor: '#898989',
			cancelText: '取消',
			confirmColor: '#fe845e',
			confirmText: '去绑定',
			content: '是否前往绑定房产？',
			success(resp) {
				if (resp.confirm) {
					next({
						name: 'bound-house',
						NAVTYPE: 'push'
					});
				}
			}
		})
		return;
	}
	next();
})
router.afterEach((to, from, next) => {

})
export default router