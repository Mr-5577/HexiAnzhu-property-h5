<template>
	<view>
		<view class="agreement-content"><rich-text :nodes="datas"></rich-text></view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			datas:
				'<h2 class="title">一、服务内容</h2>' +
				'<p class="content">1.1 本服务的具体内容由和喜物业根据实际情况提供，包括但不限于授权用户通过其帐号。和喜物业可以对其提供的服务予以变更，且和喜物业提供的服务内容可能随时变更，用户将会收到和喜物业关于服务变更的通知。</p>' +
				'<p class="content">1.2 和喜物业提供的服务包含免费服务与收费服务。用户可以通过付费方式购买收费服务，具体方式为：用户通过网上银行、支付宝或和喜物业平台提供的其他付费途径，然后根据和喜物业公布的资费标准购买用户欲使用的收费服务，从而获得收费服务使用权限。对于收费服务，和喜物业会在用户使用之前给予用户明确的提示，只有用户根据提示确认其同意按照前述支付方式支付费用并完成了支付行为，用户才能使用该等收费服务。支付行为的完成以银行或第三方支付平台生成“支付已完成”的确认通知为准。</p>' +
				'<h2 class="title">二、服务形式</h2>' +
				'<p class="content">2.1 用户可以通过手机等终端以客户端形式使用“幸福和喜”服务，具体以和喜物业实际提供的为准。同时，和喜物业会不断丰富用户使用“幸福和喜”的终端、形式等。</p>' +
				'<p class="content">2.2 当用户使用“幸福和喜”服务时，用户应选择与用户的终端、系统等相匹配的软件版本，否则，用户可能无法正常使用本服务。</p>' +
				'<h2 class="title">三、服务的许可范围</h2>' +
				'<p class="content"> “幸福和喜”给予用户一项个人的不可转让及非排他性的许可以使用本软件。用户可以为非商业目的的在单一终端设备上下载、安装、使用、登陆本软件。</p>'
		};
	},
	methods: {}
};
</script>

<style>
page {
	background: #ffffff;
}
.agreement-content {
	padding: 30upx 24upx;
}
.title {
	font-size: 32upx;
	color: #333;
	line-height: 44upx;
	padding: 20upx 0;
}
.content {
	font-size: 30upx;
	color: #666;
	line-height: 42upx;
	text-align: justify;
}
</style>
