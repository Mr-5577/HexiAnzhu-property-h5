<template>
	<view class="center">
		<view class="center_top" style="background-color: #ec3e3e;"></view>
		<view class="center_box_bg">
			<view class="profily">
				<view class="base">
					<image class="profily_header" v-if="!userInfo" :src="defaultImg"></image>
					<image class="profily_header" v-else :src="userInfo.avatarUrl"></image>
					<!-- 有数据状态  -->
					<view v-if="hasBoundHouse == true && hasLogin == true">
						<view>
							<text class="tx1">{{ myHouse.ownerInfo.realname + ' ' }}</text>
							<text class="tx2">-{{ ' ' + myHouse.ownerInfo.villageaddr }}</text>
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
					<image class="base_image" v-if="hasLogin != false" @click="logout" src="/static/images/setting.png" mode=""></image>
				</view>
				
				<view class="order_status">
					<view class="status" v-for="(item, index) in status" :key="index" @click="getNav(item.url)">
						<image class="icon" :src="item.icon" mode="aspectFit"></image>
						<text>{{ item.name }}</text>
					</view>
				</view>
			</view>
			<view class="baiban"></view>
			<view class="center_menu">
				<view class="menu_item" v-for="(item, index) in menus" :key="index" @click="getNav(item.url)">
					<image :src="item.icon" mode="aspectFit"></image>
					<text>{{ item.name }}</text>
				</view>
			</view>
		</view>
		<view class="uni-empty">和喜安筑物业服务公司—版权所有</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			defaultImg: '/static/images/avatar.png',
			status: [
				{
					name: '我的订单',
					icon: '/static/images/order.png',
					url: 'order'
				},
				{
					name: '我的工单',
					icon: '/static/images/work-order.png',
					url: 'repair-order'
				},
				{
					name: '发票下载',
					icon: '/static/images/download.png',
					url: 'electronic_invoice'
				},
				{
					name: '我的余额',
					icon: '/static/images/balance.png',
					url: 'charge-money'
				}
			],
			menus: [
				{
					name: '我的房产',
					icon: '/static/images/house.png',
					url: 'my-house'
				},
				{
					name: '我的车辆',
					icon: '/static/images/my-car.png',
					url: 'my-car'
				},
				{
					name: '我的工单',
					icon: '/static/images/my-order.png',
					url: 'repair-order'
				},
				{
					name: '联系物业',
					icon: '/static/images/connection.png',
					url: 'call'
				},
				{
					name: '关于我们',
					icon: '/static/images/about.png',
					url: 'about'
				}
			],
			ownerInfo: ''
		};
	},
	onShow() {
		this.getData();
	},
	methods: {
		getData() {
			let data = {};
			this.$api.userCenter(data, res => {
				this.$store.commit('setMyHouse', res.data);
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
			this.$Router.push({ name: url });
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
		}
	}
};
</script>

<style>
@import url('./center.css');
</style>
