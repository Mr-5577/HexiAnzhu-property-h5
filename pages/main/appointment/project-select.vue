<template>
	<view id="visitorAdsChange">
		<radio-group @change="radioChange">
			<view @click="selecteAds(item)" :class="['address-item', item.checked ? 'active' : '']" v-for="item in addressList" :key='item.id'>
				<view class="p-name">{{item.name}}</view>
				<view class="code">{{item.code}}</view>
				<view class="radio"><radio color="#ec3e3e" :value="item.id" :checked="item.checked" /></view>
			</view>
		</radio-group>
		
		<view class="btn-content">
			<button class="my-btn">更改地址</button>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			// 地址数据列表
			addressList: [
				{
					id: 1,
					name: '眉山市-1519.望江榭1',
					code: '1-1-2905',
					checked: true
				},
				{
					id: 2,
					name: '眉山市-1519.望江榭2',
					code: '1-1-2905',
					checked: false
				},
				{
					id: 3,
					name: '眉山市-1519.望江榭3',
					code: '1-1-2905',
					checked: false
				},
				{
					id: 4,
					name: '眉山市-1519.望江榭4',
					code: '1-1-2905',
					checked: false
				},
				{
					id: 5,
					name: '眉山市-1519.望江榭5',
					code: '1-1-2905',
					checked: false
				},
				{
					id: 6,
					name: '眉山市-1519.望江榭6',
					code: '1-1-2905',
					checked: false
				},
			]
		};
	},
	
	methods: {
		radioChange(e) {
			this.addressList.forEach((item) => {
				item.checked = false;
				if (item.id == e.detail.value) {
					item.checked = true;
				}
			})
		},
		selecteAds(address) {
			if (!address.checked) {
				this.addressList.forEach((item) => {
					item.checked = false;
				})
				address.checked = true;
			}
		}
	}
	
};
</script>

<style lang="scss">
#visitorAdsChange {
	font-family: 'PingFang SC';
	min-height: 100vh;
	/* #ifdef H5 */
	min-height: calc(100vh - 88rpx);
	/* #endif */
	background-color: #fafafa;
	padding: 0 24rpx 228rpx;
	box-sizing: border-box;
	overflow: hidden;
	.address-item {
		border-radius: 10rpx;
		box-shadow: 0 0 rgba(0, 0, 0, 0.05);
		background-color: #fff;
		margin-top: 30rpx;
		padding: 28rpx;
		position: relative;
		border: 1px solid #fff;
		.p-name {
			font-size: 32rpx;
			line-height: 44rpx;
			color: #333;
			font-weight: 600;
			margin-bottom: 10rpx;
		}
		.code {
			font-size: 28rpx;
			line-height: 40rpx;
			color: #666;
		}
		.radio {
			position: absolute;
			top: 50%;
			right: 30rpx;
			transform: translateY(-50%);
			/* #ifdef MP-WEIXIN */
			> radio {
				transform: scale(0.8);
			}
			/* #endif */
			::v-deep uni-radio {
				.uni-radio-input {
					width: 36rpx;
					height: 36rpx;
					margin-right: 0;
				}
			}
		}
	}

	.address-item.active {
		background-color: rgba(236,62,62, 0.1);
		border: 1px solid #ec3e3e;
		.p-name,
		.code {
			color: #ec3e3e;
		}
	}
	
	.btn-content {
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		box-sizing: border-box;
		padding: 40rpx 24rpx 100rpx;
		background-color: #fafafa;
		.my-btn {
			background-color: #ec3e3e;
			color: #fff;
			font-size: 28rpx;
			line-height: 40rpx;
			padding: 24rpx 0;
			border-radius: 6rpx;
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