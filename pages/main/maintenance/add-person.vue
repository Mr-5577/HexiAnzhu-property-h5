<template>
	<view class="content">
		<view class="input-wrapper">
			<view class="uni-flex-btw">
				<text class="title uni-cell-20">联系人：</text>
				<input type="text" class="uni-cell-80" focus clearable v-model="form.name" placeholder="请输入联系人" />
			</view>
			<view class="uni-flex-btw">
				<text class="title uni-cell-20">手机号：</text>
				<input type="number" class="uni-cell-80" clearable v-model="form.tel" placeholder="请输入联系人手机号" />
			</view>
		</view>
		<!-- #ifdef MP-WEIXIN -->
		<view class="uni-margin-top-150"><button type="primary" class="btn" @click="register">添加联系人</button></view>
		<!-- #endif -->
	</view>
</template>

<script>
export default {
	data() {
		return {
			form: {
				name: '',
				tel: ''
			}
		};
	},
	// #ifdef APP-PLUS
	onNavigationBarButtonTap(res) {
		this.register();
	},
	// #endif
	methods: {
		isPhone(e) {
			let phone = e;
			var myreg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
			if (myreg.test(phone) === false) {
				uni.showToast({
					icon: 'none',
					title: '请输入正确的手机号'
				});
				return false;
			}
			return true;
		},
		register() {
			const data = {
				name: this.name,
				tel: this.tel
			};
			if (!this.form.name) {
				uni.showToast({
					icon: 'none',
					title: '联系人不能为空'
				});
				return;
			}
			const isphone = this.isPhone(this.form.tel);
			if (isphone) {
				this.$api.addRepairContacts(this.form, res => {
					uni.showToast({
						icon: 'none',
						title: '添加成功'
					});
					setTimeout(res => {
						uni.navigateBack({
							delta: 1
						});
					}, 2000);
				});
			}
		}
	}
};
</script>

<style>
page {
	background-color: #FAFAFA;
}
.content {
	padding: 30upx 24upx;
}
.input-wrapper {
	border: 1px solid #ebebeb;
	border-radius: 10upx;
	padding: 30upx;
	background-color: #fff;
}
.uni-margin-top-150 {
	margin-top: 300upx;
}
.uni-flex-btw {
	line-height: 44upx;
}
.uni-flex-btw:first-child {
	border-bottom: 1px solid #ebebeb;
	margin-bottom: 30upx;
	padding-bottom: 30upx;
}
.btn {
	background-color: #ec4040 !important;
	font-size: 30upx;
	line-height: 40upx;
	padding: 24upx 0;
}
</style>
