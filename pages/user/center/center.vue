<template>
	<view class="center">
		<view class="center_box_bg">
			<view class="base">
				<image class="profily_header" v-if="!userInfo" :src="defaultImg"></image>
				<image class="profily_header" v-else :src="userInfo.avatarUrl"></image>
				<!-- 有数据状态  -->
				<view v-if="hasBoundHouse == true && hasLogin == true">
					<view>
						<text class="tx1">{{ myHouse.ownerInfo.realname + ' ' }}</text>
						<text class="tx2">-{{ ' ' + myHouse.ownerInfo.city }}</text>
					</view>
					<view>
					</view>
					<view>
						<text class="tx3" style="margin-right: 20upx;">{{ myHouse.ownerInfo.villagename }}</text>
						<text class="tx3">{{ myHouse.ownerInfo.roomnum }}</text>
					</view>
				</view>
				<!-- 未绑定房产状态 -->
				<view v-if="hasBoundHouse == false && hasLogin == true">
					<view>
						<view @click="getNav('bound-house')"><text>请绑定房产</text></view>
					</view>
				</view>
				<!-- 未登录状态 -->
				<view v-if="hasLogin == false">
					<view>
						<view @click="getNav('login')"><text>请登录</text></view>
					</view>
				</view>
				<image class="base_image" v-if="hasLogin != false" @click="logout"
					src="/static/fumou-center-template/setting.png" mode=""></image>
			</view>

			<view class="order_status">
				<view class="status" v-for="(item, index) in status" :key="index" @click="getNav(item.url)">
					<image class="icon" :src="item.icon" mode="aspectFit"></image>
					<text>{{ item.name }}</text>
					<uni-badge v-if="item.id === 2 && evaluateNum > 0" :text="evaluateNum" type="error" size="small" class="badge-num" />
				</view>
			</view>
			<view class="center_menu">
				<view class="menu_item" v-for="(item, index) in menus" :key="index" @click="getNav(item.url)">
					<image :src="item.icon" mode="aspectFit"></image>
					<text>{{ item.name }}</text>
					<uni-icons class="icon" type="arrowright"></uni-icons>
				</view>
			</view>
		</view>
		<view class="uni-empty">
			<text class="text1"></text>
			四川和喜物业服务有限公司--版权所有
			<text class="text2"></text>
		</view>
		<!-- 底部自定义tabbar -->
		<mini-tabbar :active-index="1" />
	</view>
</template>

<script>
	import MiniTabbar from '@/components/mini-tabbar/mini-tabbar.vue';
	export default {
		components: {
			MiniTabbar
		},
		data() {
			return {
				defaultImg: '/static/images/avatar.png',
				status: [{
						name: '我的订单',
						icon: '/static/fumou-center-template/my-order.jpg',
						url: 'order',
						id: 1
					},
					{
						name: '我的工单',
						icon: '/static/fumou-center-template/work-order.jpg',
						url: 'repair-order',
						id: 2
					},
					// {
					// 	name: '发票下载',
					// 	icon: '/static/fumou-center-template/download.jpg',
					// 	url: 'electronic_invoice',
					// 	id: 3
					// },
					{
						name: '我的余额',
						icon: '/static/fumou-center-template/balance.jpg',
						url: 'charge-money',
						id: 4
					}
				],
				menus: [{
						name: '我的房产',
						icon: '/static/fumou-center-template/house.jpg',
						url: 'my-house'
					},
					{
						name: '我的车辆',
						icon: '/static/fumou-center-template/car.jpg',
						url: 'my-car'
					},
					{
						name: '我的工单',
						icon: '/static/fumou-center-template/w-order.jpg',
						url: 'repair-order'
					},
					{
						name: '联系物业',
						icon: '/static/fumou-center-template/contact.jpg',
						url: 'call'
					},
					{
						name: '关于我们',
						icon: '/static/fumou-center-template/about.jpg',
						url: 'about'
					}
				],
				ownerInfo: '',
				orderList: []
			};
		},
		onShow() {
			if (this.$store.state.login_token) {
				this.getData();
				this.getRepairList();
			}
		},
		methods: {
			getRepairList() {
				this.$api.repairlist({}, res => {
					if (res.code === 1) {
						this.orderList = res.data || [];
					}
				});
			},
			getData() {
				this.$api.userCenter({}, res => {
					if (res.code == 1) {
						this.$store.commit('setMyHouse', res.data);
					}
				});
			},
			logout() {
				uni.showModal({
					title: '是否退出登录？',
					content: '退出登录将无法收到消息,您真的要退出登录吗？',
					success: res => {
						if (res.confirm) {
							setTimeout(() => {
								this.$store.commit('logout');
							}, 100);
						}
					}
				});
			},
			getNav(url) {
				if (!url) {
					uni.showToast({
						icon: 'none',
						title: '正在开发...'
					});
					return;
				}
				this.$Router.push({
					name: url
				});
			}
		},
		computed: {
			userInfo() {
				let userInfo = {};
				try {
					userInfo = uni.getStorageSync('userInfo');
					return userInfo;
				} catch (e) {
					// error
				}
				return userInfo;
			},
			myHouse() {
				return this.$store.state.myHouse;
			},
			hasBoundHouse() {
				return this.$store.state.hasBoundHouse;
			},
			hasLogin() {
				return this.$store.state.hasLogin;
			},
			evaluateNum() {
				// status：0待接单 1已处理 2处理中 1,4待评价
				const statusToCount = [1, 4];
				return this.orderList.filter((task) => statusToCount.includes(task.status)).length
			}
		}
	};
</script>

<style>
	@import url('./center.css');
</style>