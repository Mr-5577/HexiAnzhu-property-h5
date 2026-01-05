<template>
	<view id="about">
		<view class="about-header uni-flex-center">
			<view>
				<image src="/static/images/logo.png" style="border-radius: 20upx;" mode="aspectFit" class="about-logo"></image>
				<view class="uni-text-center">
					和喜安筑物业服务公司
					<!-- #ifdef APP-PLUS -->
					：v {{ version }}
					<!-- #endif -->
				</view>
			</view>
		</view>
		<view class="center_menu">
			<view class="menu_item" v-for="(item, index) in menus" :key="index" @click="getNav(item.url)">
				<text>{{ item.name }}</text>
				<uni-icons class="uicon" type="arrowright"></uni-icons>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			version: 0,
			menus: [
				{
					name: '用户协议',
					key: 1,
					url: 'user-agreement'
				},
				{
					name: '服务说明',
					key: 2,
					url: 'service-explain'
				}
			]
		};
	},
	methods: {
		getNav(url) {
			this.$Router.push({ name: url });
		}
	},
	onLoad() {
		// #ifdef APP-PLUS
		this.version = plus.runtime.version;
		// #endif
	}
};
</script>

<style>
#about {
	min-height: 100vh;
	background-color: #fafafa;
}
.uni-text-center {
	color: #333;
	font-size: 32upx;
	line-height: 50upx;
	font-weight: 600;
}
.about-header {
	height: 500upx;
	background-color: #fff;
	margin-bottom: 30upx;
}
.about-logo {
	height: 200upx;
	border-radius: 20upx;
}
.center_menu {
	width: 100%;
	display: inline-block;
	background-color: #fff;
	padding: 0 24upx;
	box-sizing: border-box;
}
.menu_item {
	font-size: 30upx;
	line-height: 42upx;
	border-bottom: 1px solid #ebebeb;
	padding: 40upx 0;
}
.menu_item:last-child {
	border-bottom: none;
}
.uicon {
	float: right;
	vertical-align: middle;
}
.uicon .uni-icons {
	color: #999 !important;
}
</style>
