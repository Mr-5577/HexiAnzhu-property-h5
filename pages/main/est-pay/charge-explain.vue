<template>
	<view class="content">
		<view>1.{{ content1 }}</view>
		<view class="uni-margin-top-40">2.{{ content2 }}</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			content1: '物业服务中心为每位客户创建了专属账户，充值金额将计入该专属账户中，账户余额将用于支付物业账单；如您在多个社区持有房产，则拥有多个专属账户，不同社区的账户余额不能跨社区支付使用。',
			content2: '账户充值明细及支出明细可在【历史记录】中查看，如对账户余额使用情况有疑问，可咨询账户所在物业服务中心。'
		};
	},
	methods: {}
};
</script>

<style>
page {
	background: #ffffff;
}
.content {
	margin: 40upx;
	color: #898989;
}
</style>
