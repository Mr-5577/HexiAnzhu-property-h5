<template>
	<view class="uni-padding-wrap">
		<view>活动细则：</view>
		<view class="border">
			<view class="uni-flex uni-flex-btw">
				<view class="uni-cell-50 uni-bg-gray padding-left">预缴月份数</view>
				<view class="uni-cell-50 uni-bg-gray padding-left ">优惠月份数</view>
			</view>
			<view>
				<view class="uni-flex uni-flex-btw border-bottom" :class="" v-for="(item,i) in rule" :key="i">
					<view class="uni-cell-50  padding-left">{{item.prestore_ymonth}}</view>
					<view class="uni-cell-50  padding-left border-left">{{item.preferential_ymonth}}</view>
				</view>
			</view>
		</view>
		
		<view class="tips">
			本次活动最终解释权归阳光物业所有，如有疑问，请咨询物业中心服务人员
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
			rule:[]
			};
		},
		onLoad(option) {
			this.rule = JSON.parse(option.rule)
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #fff;
		.uni-bg-gray{
			background-color: #e8e8e8;
		}
		.padding-left{
			padding-left: 10rpx;
		}
		.border{
			border:  2rpx solid #e8e8e8;
		}
		.border-bottom{
			border-bottom:  2rpx solid #e8e8e8;
		}
		.border-left {
			border-left:  2rpx solid #e8e8e8;
		}
		.tips{
			padding-top: 10rpx ;
			font-size: 24rpx;
			color: #acacac;
		}
	}
</style>