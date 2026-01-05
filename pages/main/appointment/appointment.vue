<template>
	<view id="appointment">
		<view class="content">
			<view class="header">
				<view class="row" @click="addressChange">
					<text class="name">金沙云湖香榭林 1-1-2905</text>
					<view class="value"></view>
					<uni-icons type="arrowright"></uni-icons>
				</view>
				<!-- 年-月-日 时 -->
				<view class="row">
					<text class="name">来访时间：</text>
					<view class="value">
						<biaofun-datetime-picker
							placeholder="请选择活动时间"
							defaultValue="2020-06-08 10"
							start="2000-02-03 02"
							end="2100-10-28 22"
							fields="hour"
							@change="changeDatetimePicker"
						></biaofun-datetime-picker>
					</view>
					<uni-icons type="arrowright"></uni-icons>
				</view>
			</view>
			<view class="user-info">
				<view class="info-item">
					<view class="name">访客姓名</view>
					<input type="text" value="" placeholder="请输入姓名"/>
				</view>
				<view class="info-item">
					<view class="name">联系方式</view>
					<input type="number" value="" placeholder="请输入来访人联系方式(必填)" />
				</view>
				<view class="info-item">
					<view class="name">车牌号</view>
					<input type="text" value="" placeholder="请输入来访人车牌号"/>
				</view>
			</view>
		</view>
		
		<view class="btn-content">
			<button class="my-btn">提交预约</button>
		</view>
	</view>
</template>

<script>
	import biaofunDatetimePicker from '@/components/biaofun-datetime-picker/biaofun-datetime-picker.vue'
	export default {
		components: {
			biaofunDatetimePicker
		},
		
		data() {
			return {
				
			};
		},
		
		methods: {
			/**
			 * 确认选择日期时间
			 * @param {Object} date 日期数据
			 */
			changeDatetimePicker(date) {
				console.log('选择的日期时间数据：', date)
			},
			
			// 跳转地址更改页面
			addressChange() {
				uni.navigateTo({
					url: `/pages/main/appointment/project-select`
				})
			}
		}
	}
</script>

<style lang="scss">
#appointment {
	font-family: "PingFang SC";
	height: 100vh;
	/* #ifdef H5 */
	height: calc(100vh - 88rpx);
	/* #endif */
	display: flex;
	flex-direction: column;
	overflow: hidden;
	.content {
		flex: 1;
		.header {
			border-top: 30rpx solid #F7F7F7;
			border-bottom: 30rpx solid #F7F7F7;
			background-color: #fff;
			padding: 0 24rpx;
			.row {
				display: flex;
				height: 120rpx;
				align-items: center;
				color: #333;
				border-bottom: 1px solid #ebebeb;
				font-size: 32rpx;
				.name {
					flex-shrink: 0;
					font-weight: 600;
				}
				.value {
					flex: 1;
				}
				.uni-icons {
					line-height: 42rpx;
				}
			}
			.row:active {
				opacity: 0.8;
			}
			.row:last-child {
				border: none;
			}
		}
		
		.user-info {
			padding: 0 24rpx;
			.info-item {
				padding-top: 40rpx;
				.name {
					font-weight: 600;
					font-size: 32rpx;
					color: #333;
					line-height: 44rpx;
					margin-bottom: 20rpx;
				}
				input {
					padding: 20rpx 0;
					color: #333;
					line-height: 42rpx;
					font-size: 30rpx;
					border-bottom: 1px solid #ebebeb;
				}
			}
			.info-item:last-child {
				margin-bottom: 100rpx;
			}
		}
	}

	.btn-content {
		padding: 0 24rpx 100rpx;
		.my-btn {
			background-color: #ec3e3e;
			color: #fff;
			font-size: 28rpx;
			line-height: 40rpx;
			padding: 24rpx 0;
			border-radius: 6rpx;
			border: none;
			outline: none;
		}
		.my-btn:after {
			display: none;
		}
		.my-btn:active {
			opacity: 0.6;
		}
	}
}
</style>
