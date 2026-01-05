<template>
	<view class="call">
		<view class="header">
			<image src="/static/images/logo.png" mode=""></image>
			<view class="title">和喜安筑物业服务公司</view>
		</view>
		<view class="content">
			<view class="content-item">
				{{datas.address ? datas.address : '暂无地址'}}
			</view>
			<view class="content-item" @click="numbers">
				<text>24小时服务电话：</text>
				<text class="tel">{{datas.tel ? datas.tel : '暂无电话号码'}}</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				datas:''
			}
		},
		onLoad() {
			this.contact();
		},
		methods: {
			numbers(){
				if(this.datas.tel){
					uni.makePhoneCall({
					    phoneNumber: this.datas.tel
					});
				}
			},
			contact(){
				this.$api.contact({},res =>{
					this.datas = res.data;
				})
			}
		}
	}
</script>

<style>
.call {
	min-height: 100vh;
	background-color: #FAFAFA;
}
.header {
	padding: 70upx 0 50upx;
	text-align: center;
	background-color: #fff;
}
.header image {
	width: 144upx;
	height: 144upx;
}
.header .title {
	font-size: 32upx;
	color: #333;
	line-height: 50upx;
	font-weight: 600;
}
.content {
	margin-top: 30upx;
	padding: 0 24upx;
	background-color: #fff;
}
.content .content-item {
	font-size: 30upx;
	line-height: 42upx;
	color: #333;
	padding: 40upx 0;
	border-bottom: 1px solid #ebebeb;
}
.content .content-item .tel {
	color: #ec4040;
}
.content .content-item:last-child {
	border-bottom: none;
}
</style>
