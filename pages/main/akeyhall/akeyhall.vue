<template>
	<view>
		<view class="list">
			<view class="list-cell">
				<view class="list-cell-left">当前选择</view>
				<view class="list-cell-db">
					<picker @change="bindPickerChange" :value="index" :range="array">
						<view class="uni-input">{{ array[index] }}</view>
					</picker>
				</view>
				<view class="uni-flex-center">
					<view class="uni-icon uni-icon-arrowright" ></view>
				</view>
			</view>
		</view>
		<view>
			<view class="line"></view>
			<view class="title">您的位置</view>
			<view class="uni-flex-btw flex-warp uni-cell-100">
				<view class="uni-text-center bg-gray" v-for="i in 4" :key="i">{{i}}</view>
			</view>
		</view>
		<view class="uni-flex-center fixed">
			<button class="foot-btn" @click="submit">确认呼梯</button>
		</view>
		
	</view>
</template>

<script>
export default {
	data() {
		return {
			array: [],
			index: 0
		};
	},
	methods: {
		bindPickerChange() {},
		submit(){
			this.$Router.push({ name: 'akeyhall-success' });
		}
	}
};
</script>

<style lang="less">
	page{
		.list{
			height: 120rpx;
			margin-bottom: 30rpx;
			.list-cell{
				height: 120rpx;
				border: none;
				display: flex;
				line-height: 120rpx;
				.list-cell-left{
					line-height: 120rpx;
					padding: 0 30rpx;
				}
				.list-cell-db{
					width: 70%;
				}
			}
		}
		.uni-list ::before{
			background-color: #FFFFFF;
		}
		.uni-list ::after{
			background-color: #FFFFFF;
		}
		background: #FFFFFF;
		.line{
			background-color: #f7f7f7;
			width: 100%;
			height: 30rpx;
		}
		.title{
			font-size: 24rpx;
			color: #dedede;
			margin: 30rpx 15rpx 0 15rpx;
		}
		.bg-gray{
			background: #f5f5f5;
			height: 68rpx;
			margin: 10rpx 15rpx;
			width: 45%;
			border-radius: 5rpx;
			line-height: 69rpx;
			text-align: center;
		}
	}
	.flex-warp{
		flex-wrap: wrap;
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
</style>
