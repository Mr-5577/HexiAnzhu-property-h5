<template>
	<view class="invoice">
		<!-- 顶部提示条 -->
		<view class="tip-bar">
			<view class="tip-icon">!</view>
			<view class="tip-text">抬头信息将用于开具发票，请确保信息真实准确</view>
		</view>

		<view class="content">
			<view class="list-title">
				<text class="t">我的抬头</text>
				<text class="num">共 {{ list.length }} 个</text>
			</view>

			<view class="uni-empty" v-if="list.length === 0">{{ loadingText }}</view>

			<view v-else>
				<view class="invoice-item" v-for="(item, index) in list" :key="item.id">
					<!-- 信息区 -->
					<view class="info">
						<view class="name-row">
							<text class="name">{{ item.inv_title }}</text>
							<text class="tag" :class="item.inv_type === 2 ? 'tag-company' : 'tag-personal'">
								{{ item.inv_type === 2 ? '企业' : '个人' }}
							</text>
							<text class="tag tag-default" v-if="Number(item.default) === 1">默认</text>
							<!-- 审核状态 -->
							<text class="tag" :class="Number(item.is_check) === 1 ? 'tag-pass' : 'tag-reject'">
								{{ Number(item.is_check) === 1 ? '审核通过' : '审核未通过' }}
							</text>
						</view>

						<!-- 企业显示税号 -->
						<view class="tax" v-if="item.inv_type === 2 && item.union_code">
							税号：{{ item.union_code }}
						</view>
						<!-- 个人显示身份证 -->
						<view class="tax" v-else-if="item.inv_type === 1 && item.union_code">
							身份证：{{ item.union_code }}
						</view>

						<!-- 发票类型：用 inv_special 翻译 -->
						<view class="sub" v-if="item.inv_type === 2">
							发票类型：{{ invoiceTypeEnum[Number(item.inv_special)] || invoiceTypeEnum[0] }}
						</view>
						<view class="sub" v-else>
							发票类型：{{ invoiceTypeEnum[0] }}
						</view>

						<view class="sub" v-if="item.tel">联系电话：{{ item.tel || '--' }}</view>
						<view class="sub">收票邮箱：{{ item.email ? item.email : '--' }}</view>
					</view>

					<!-- 操作区：圆角边框按钮，靠右 -->
					<view class="issued-actions">
						<view class="action-btn edit" @tap="handleEdit(item)">编辑</view>
						<view class="action-btn delete" @tap="handleDelete(item)">删除</view>
					</view>
				</view>
			</view>
		</view>

		<!-- 底部新增按钮 -->
		<view class="footer">
			<view class="add-btn" @click="addTitle">+ 新增抬头</view>
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
				loadingText: '暂无发票抬头',
				invoiceTypeEnum,
				list: []
			};
		},
		onShow() {
			// 用 onShow 而非 onLoad，从新增/编辑页返回时会自动刷新
			this.getList();
		},
		methods: {
			async getList() {
				uni.showLoading({
					title: "数据加载中...",
				});
				try {
					const res = await this.$api.invoiceTitleList({
                        app_user_id: this.$store.state.myHouse.ownerInfo.app_uid,
						page: 1,
						limit: 999
					});
					uni.hideLoading()
					if (res.code === 1 && res.data) {
						this.list = res.data.list || [];
					}
				} catch (error) {
					uni.hideLoading()
					console.log(error);
				}
			},

			// 编辑抬头
			handleEdit(item) {
				if (!item || !item.id) return;
				this.$Router.push({
					name: 'add-edit-invoice',
					params: {
						id: item.id
					}
				});
			},

			// 删除抬头
			handleDelete(item) {
				if (!item || !item.id) return;
				uni.showModal({
					title: '删除确认',
					content: '确定要删除「' + item.inv_title + '」吗？删除后不可恢复',
					confirmColor: '#f56c6c',
					success: async (res) => {
						if (!res.confirm) return;
						try {
							const result = await this.$api.invoiceTitleDel({
								id: item.id
							});
							if (result.code === 1) {
								uni.showToast({
									title: '删除成功',
									icon: 'success'
								});
								this.getList();
							}
						} catch (error) {
							console.log('删除失败:', error);
						}
					}
				});
			},

			// 新增抬头
			addTitle() {
				this.$Router.push({
					name: 'add-edit-invoice',
				});
			}
		}
	};
</script>

<style lang="scss">
	.invoice {
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

		.content {
			padding: 30upx 24upx;

			.list-title {
				display: flex;
				align-items: baseline;
				justify-content: space-between;
				margin-bottom: 20upx;

				.t {
					font-size: 30upx;
					line-height: 42upx;
					color: #333;
					font-weight: 600;
				}

				.num {
					font-size: 24upx;
					color: #999;
				}
			}

			.uni-empty {
				text-align: center;
				font-size: 28upx;
				color: #ccc;
				padding: 200upx 0;
			}

			/* 卡片：信息区在上，操作区在下 */
			.invoice-item {
				padding: 20upx;
				margin-bottom: 16upx;
				background-color: #fff;
				border-radius: 16upx;
				box-shadow: 0 0 6upx rgba(0, 0, 0, 0.05);

				&:active {
					background-color: #fafafa;
				}
			}

			/* 信息区 */
			.info {
				.name-row {
					display: flex;
					align-items: center;
					flex-wrap: wrap;
				}

				.name {
					font-size: 30upx;
					line-height: 42upx;
					color: #333;
					font-weight: 600;
					margin-right: 12upx;
				}

				.tag {
					font-size: 20upx;
					line-height: 28upx;
					padding: 2upx 10upx;
					border-radius: 4upx;
					margin-right: 10upx;
				}

				.tag-company {
					color: #33b5ff;
					background-color: rgba(51, 181, 255, 0.1);
				}

				.tag-personal {
					color: #65d8bf;
					background-color: rgba(101, 216, 191, 0.1);
				}

				.tag-default {
					color: #ec7f27;
					background-color: rgba(236, 127, 39, 0.1);
				}

				/* 审核通过 */
				.tag-pass {
					color: #65d8bf;
					background-color: rgba(101, 216, 191, 0.1);
				}

				/* 审核不通过 */
				.tag-reject {
					color: #f56c6c;
					background-color: rgba(245, 108, 108, 0.1);
				}

				.tax,
				.sub {
					font-size: 26upx;
					line-height: 36upx;
					color: #999;
					margin-top: 6upx;
					word-break: break-all;
				}
			}

			/* 操作区：圆角边框按钮，靠右 */
			.issued-actions {
				display: flex;
				justify-content: flex-end;
				margin-top: 10upx;
				padding-top: 10upx;
				border-top: 1upx dashed #f0f0f0;

				.action-btn {
					min-width: 148upx;
					height: 58upx;
					line-height: 54upx;
					text-align: center;
					font-size: 26upx;
					border-radius: 32upx;
					box-sizing: border-box;

					&:active {
						opacity: 0.8;
					}

					&.edit {
						color: #e6a23c;
						background-color: #fff;
						border: 2upx solid #e6a23c;
						margin-right: 20upx;
					}

					&.delete {
						color: #f56c6c;
						background-color: #fff;
						border: 2upx solid #f56c6c;
					}
				}
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

			.add-btn {
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
			}
		}
	}
</style>