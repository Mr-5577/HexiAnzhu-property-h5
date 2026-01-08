<template>
	<view class="">
		<view style="margin-top: 100px;">
			<view class="uni-flex-center">
				<image class="img" src="@/static/img/main/success.png"></image>
			</view>
			<view class="text-blod uni-text-center">
				电梯即将到达
			</view>
			<view class="uni-text-center">
				<text>请前往</text>
				<text>{{address}}电梯口</text>
				<text>乘坐</text>
			</view>
		</view>
		<view class="uni-flex-center fixed">
			<button class="foot-btn" @click="back">返回上一页</button>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			address:''
		};
	},
	methods: {
		back(){
			uni.navigateBack({
				delta:1
			})
		}
	}
};
</script>

<style lang="less">
	page{
		background-color: #FFFFFF;
		.img{
			height: 76px;
			width: 66px;
		}
		.text-blod{
			font-weight: bold;
			font-size: 16px;
		}
		.fixed{
			width: 100%;
			position: fixed;
			bottom: 20rpx;
			left: 0;
		}
		.foot-btn{
			background-color: #ffab5d;
			color: #FFFFFF;
			border: none;
			margin: 20rpx;
			width: 100%;
			font-size: 28rpx;
			height: 88rpx;
			line-height: 88rpx;
		}
	}
</style>
