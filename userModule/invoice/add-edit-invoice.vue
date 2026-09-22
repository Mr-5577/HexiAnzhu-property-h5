<template>
	<view class="invoice-add">
		<!-- 顶部提示条 -->
		<view class="tip-bar">
			<view class="tip-icon">!</view>
			<view class="tip-text">请确保填写信息与营业执照/身份信息一致，避免开票失败</view>
		</view>

		<!-- 抬头类型切换 -->
		<view class="section">
			<view class="section-title">发票抬头类型</view>
			<view class="type-switch">
				<view class="type-item" :class="{ active: form.inv_type === 2 }" @click="switchType(2)">
					<text class="type-name">企业</text>
					<text class="type-desc">公司/单位报销使用</text>
				</view>
				<view class="type-item" :class="{ active: form.inv_type === 1 }" @click="switchType(1)">
					<text class="type-name">个人</text>
					<text class="type-desc">个人消费使用</text>
				</view>
			</view>
		</view>

		<!-- 表单区域 -->
		<view class="section">
			<view class="section-title">抬头信息</view>

			<!-- 抬头名称 -->
			<view class="form-item">
				<text class="label">
					<text class="required">*</text>
					{{ form.inv_type === 2 ? ' 企业名称' : ' 个人姓名' }}
				</text>
				<input class="input" v-model="form.inv_title" :placeholder="form.inv_type === 2 ? '请输入企业全称' : '请输入个人姓名'"
					placeholder-class="placeholder" maxlength="100" />
			</view>

			<!-- 统一社会信用代码（企业） -->
			<view class="form-item" v-if="form.inv_type === 2">
				<text class="label">
					<text class="required">*</text>
					纳税人识别号
				</text>
				<input class="input" v-model="form.union_code" placeholder="请输入统一社会信用代码" placeholder-class="placeholder"
					maxlength="18" />
			</view>

			<!-- 身份证号（个人） -->
			<view class="form-item" v-if="form.inv_type === 1">
				<text class="label">
					<text class="required">*</text>
					身份证号码
				</text>
				<input class="input" v-model="form.union_code" placeholder="请输入身份证号码" placeholder-class="placeholder"
					maxlength="18" />
			</view>

			<!-- 发票类型（仅企业，对应 inv_special） -->
			<view class="form-item" v-if="form.inv_type === 2">
				<text class="label">
					<text class="required">*</text>
					发票类型
				</text>
				<picker class="picker" mode="selector" :range="invSpecialOptions" :value="form.inv_special"
					@change="onInvSpecialChange">
					<view class="picker-inner">
						<text class="picker-value">{{ invSpecialOptions[form.inv_special] }}</text>
						<uni-icons type="arrowdown" size="14" color="#999"></uni-icons>
					</view>
				</picker>
			</view>

			<!-- 联系电话 -->
			<view class="form-item">
				<text class="label">联系电话</text>
				<input class="input" v-model="form.tel" placeholder="请输入联系电话（选填）" placeholder-class="placeholder"
					maxlength="20" />
			</view>

			<!-- 收票邮箱 -->
			<view class="form-item">
				<text class="label">收票邮箱</text>
				<input class="input" v-model="form.email" placeholder="请输入接收发票的邮箱（选填）" placeholder-class="placeholder"
					maxlength="50" />
			</view>
		</view>

		<!-- 设为默认 -->
		<view class="section">
			<view class="switch-item">
				<view class="switch-left">
					<text class="switch-name">设为默认抬头</text>
					<text class="switch-desc">开票时优先使用此抬头</text>
				</view>
				<switch style="transform:scale(0.8)" :checked="form.default === 1" color="#ffcf5a"
					@change="onDefaultChange" />
			</view>
		</view>

		<!-- 编辑模式下显示删除按钮 -->
		<view class="section" v-if="isEdit">
			<view class="delete-btn" @click="handleDelete">删除此抬头</view>
		</view>

		<!-- 底部保存按钮 -->
		<view class="footer">
			<view class="save-btn" :class="{ disabled: !canSubmit }" @click="handleSave">
				{{ isEdit ? '保存修改' : '保存' }}
			</view>
		</view>
	</view>
</template>

<script>
	import {
		invoiceTypeEnum
	} from './invoice';
	export default {
		data() {
			return {
				id: null, // 编辑模式下的抬头 id
				isEdit: false, // 当前是否为编辑模式
				// inv_special：0 普票  1 专票（仅企业）
				invSpecialOptions: invoiceTypeEnum,
				form: {
					inv_title: '', // 抬头名称
					union_code: '', // 统一社会信用代码 / 身份证号
					inv_type: 2, // 1 个人  2 企业
					inv_special: 0, // 是否专票 0/1（仅企业）
					email: '', // 收票邮箱
					tel: '', // 联系电话
					default: 0, // 是否默认抬头 0/1
					is_check: 0 // 是否审核 0/1,新增时默认0
				}
			};
		},
		computed: {
			// 是否可提交
			canSubmit() {
				if (!this.form.inv_title.trim()) return false;
				if (!this.form.union_code.trim()) return false;
				return true;
			}
		},
		onLoad(options) {
			console.log(this.$Route.query);
			const id = this.$Route.query && this.$Route.query.id;
			if (id) {
				this.id = id;
				this.isEdit = true;
				uni.setNavigationBarTitle({
					title: '编辑发票抬头'
				});
				this.getDetail();
			} else {
				this.isEdit = false;
				uni.setNavigationBarTitle({
					title: '新增发票抬头'
				});
				this.form.default = 1; // 新增默认为默认抬头
			}
		},
		methods: {
			// 切换抬头类型，顺便清理不相关字段
			switchType(type) {
				if (this.form.inv_type === type) return;
				this.form.inv_type = type;
				this.form.inv_title = ''; // 切换时清空
				this.form.union_code = ''; // 税号/身份证，切换时清空
				this.form.inv_special = 0; // 个人强制 0
			},

			// 获取抬头详情回填信息编辑
			async getDetail() {
				try {
					const res = await this.$api.invoiceTitleDetail({
						id: this.id
					});
					if (res.code === 1) {
						this.form = Object.assign({}, this.form, res.data);
					}
				} catch (error) {
					console.log(error);
				}
				// this.form = {
				//     inv_title: '四川某某科技有限公司',
				//     union_code: '91110108MA01XXXXXX',
				//     inv_type: 2,
				//     inv_special: 0,
				//     email: 'finance@xingchen.com',
				//     tel: '13800138000',
				//     default: 1
				// };
			},

			// 发票类型切换（专票/普票）
			onInvSpecialChange(e) {
				this.form.inv_special = Number(e.detail.value);
			},

			// 默认开关
			onDefaultChange(e) {
				this.form.default = e.detail.value ? 1 : 0;
			},

			// 保存（新增/编辑）
			async handleSave() {
				if (!this.canSubmit) {
					if (!this.form.inv_title.trim()) {
						uni.showToast({
							title: this.form.inv_type === 2 ? '请输入企业全称' : '请输入个人姓名',
							icon: 'none'
						});
					} else if (!this.form.union_code.trim()) {
						uni.showToast({
							title: this.form.inv_type === 2 ? '请输入纳税人识别号' : '请输入身份证号码',
							icon: 'none'
						});
					}
					return;
				}

				// 身份证格式校验（个人，18位，最后一位可为X）
				if (this.form.inv_type === 1 && !this.$uitls.isIdCard(this.form.union_code.trim())) {
					uni.showToast({
						title: '身份证号码格式不正确',
						icon: 'none'
					});
					return;
				}

				// 统一社会信用代码校验（企业，18位字母数字）
				if (this.form.inv_type === 2 && !this.$uitls.isUSCC(this.form.union_code)) {
					uni.showToast({
						title: '统一社会信用代码格式不正确',
						icon: 'none'
					});
					return;
				}

				// 邮箱格式校验
				if (this.form.email && !this.$uitls.isEmail(this.form.email)) {
					uni.showToast({
						title: '邮箱格式不正确',
						icon: 'none'
					});
					return;
				}

				// 联系电话格式校验
				if (this.form.tel && !this.$uitls.isPhone(this.form.tel)) {
					uni.showToast({
						title: '联系电话格式不正确',
						icon: 'none'
					});
					return;
				}

				// 提交参数
				const params = {
					inv_title: this.form.inv_title.trim(),
					union_code: this.form.union_code.trim(),
					inv_type: this.form.inv_type,
					inv_special: this.form.inv_type === 2 ? Number(this.form.inv_special) : 0,
					email: this.form.email.trim(),
					tel: this.form.tel.trim(),
					default: Number(this.form.default),
					is_check: 0, // 新增/编辑 都是未审核
				};
				if (this.isEdit) params.id = this.id;

				console.log(this.isEdit ? '更新抬头参数：' : '新增抬头参数：', params);
				try {
					const interfaceApi = this.isEdit ? this.$api.invoiceTitleEdit : this.$api.invoiceTitleAdd;
					const res = await interfaceApi(params);
					if (res.code === 1) {
						uni.showToast({
							title: this.isEdit ? '修改成功' : '添加成功',
							icon: 'success'
						});
						setTimeout(() => uni.navigateBack(), 800);
					}
				} catch (error) {
					console.log('error', error);
				}
			},

			// 删除抬头
			handleDelete() {
				uni.showModal({
					title: '删除确认',
					content: '确定要删除此发票抬头吗？删除后不可恢复',
					confirmColor: '#f56c6c',
					success: async (res) => {
						if (!res.confirm) return;
						try {
							const res = await this.$api.invoiceTitleDel({
								id: this.id
							});
							if (res.code === 1) {
								uni.showToast({
									title: '删除成功',
									icon: 'success'
								});
								setTimeout(() => uni.navigateBack(), 800);
							}
						} catch (error) {
							console.log('error', error);
						}
					}
				});
			}
		}
	};
</script>

<style lang="scss">
	.invoice-add {
		min-height: 100vh;
		background-color: #f5f6f8;
		padding-bottom: 220upx;

		.tip-bar {
			display: flex;
			align-items: center;
			padding: 20upx 24upx;
			background-color: #fcf6e5;

			.tip-icon {
				flex: none;
				width: 30upx;
				height: 30upx;
				line-height: 30upx;
				text-align: center;
				border-radius: 50%;
				background-color: #ffcf5a;
				color: #fff;
				font-size: 22upx;
				font-weight: 600;
				margin-right: 12upx;
			}

			.tip-text {
				flex: 1;
				font-size: 24upx;
				line-height: 34upx;
				color: #ec7f27;
			}
		}

		.section {
			margin: 24upx;
			padding: 30upx;
			background-color: #fff;
			border-radius: 12upx;
			box-shadow: 0 0 6upx rgba(0, 0, 0, 0.05);

			.section-title {
				font-size: 28upx;
				line-height: 40upx;
				color: #999;
				margin-bottom: 24upx;
			}
		}

		.type-switch {
			display: flex;

			.type-item {
				flex: 1;
				padding: 24upx 20upx;
				border: 2upx solid #e5e5e5;
				border-radius: 10upx;
				margin-right: 20upx;
				transition: all 0.2s;
				display: flex;
				flex-direction: column;

				&:last-child {
					margin-right: 0;
				}

				.type-name {
					font-size: 30upx;
					line-height: 42upx;
					color: #333;
					font-weight: 600;
				}

				.type-desc {
					font-size: 22upx;
					line-height: 32upx;
					color: #999;
					margin-top: 6upx;
				}

				&.active {
					border-color: #ffcf5a;
					background-color: #fffbf0;

					.type-name {
						color: #e6a23c;
					}
				}
			}
		}

		.form-item {
			display: flex;
			align-items: center;
			padding: 24upx 0;
			border-bottom: 1upx solid #f0f0f0;

			&:last-child {
				border-bottom: none;
			}

			.label {
				flex: none;
				width: 200upx;
				font-size: 28upx;
				line-height: 40upx;
				color: #333;

				.required {
					color: #f56c6c;
					margin-right: 4upx;
				}
			}

			.input {
				flex: 1;
				font-size: 28upx;
				line-height: 40upx;
				color: #333;
				text-align: right;
			}

			.placeholder {
				color: #c0c4cc;
				font-size: 28upx;
			}

			.picker {
				flex: 1;

				.picker-inner {
					display: flex;
					align-items: center;
					justify-content: flex-end;

					.picker-value {
						font-size: 28upx;
						color: #333;
						margin-right: 8upx;
					}
				}
			}
		}

		.switch-item {
			display: flex;
			align-items: center;
			justify-content: space-between;

			.switch-left {
				display: flex;
				flex-direction: column;

				.switch-name {
					font-size: 28upx;
					line-height: 40upx;
					color: #333;
				}

				.switch-desc {
					font-size: 22upx;
					line-height: 32upx;
					color: #999;
					margin-top: 6upx;
				}
			}
		}

		.delete-btn {
			height: 80upx;
			line-height: 80upx;
			text-align: center;
			font-size: 30upx;
			color: #f56c6c;
			border-radius: 10upx;
			background-color: #fff;

			&:active {
				background-color: #fef0f0;
			}
		}

		.footer {
			position: fixed;
			left: 0;
			right: 0;
			bottom: 0;
			padding: 20upx 24upx;
			padding-bottom: calc(20upx + constant(safe-area-inset-bottom));
			padding-bottom: calc(20upx + env(safe-area-inset-bottom));
			background-color: #fff;
			box-shadow: 0 -2upx 10upx rgba(0, 0, 0, 0.05);
			z-index: 99;

			.save-btn {
				height: 88upx;
				line-height: 88upx;
				text-align: center;
				font-size: 30upx;
				color: #fff;
				background-color: #ffcf5a;
				border-radius: 44upx;

				&:active {
					opacity: 0.8;
				}

				&.disabled {
					background-color: #f0d9a0;
					color: #fff;
				}
			}
		}
	}
</style>