<template>
	<view class="invoice-detail">
		<!-- 加载状态 -->
		<view class="load" v-if="loading">
			<image src="/static/images/load.gif" mode="aspectFit"></image>
			<text class="loading-text">加载中...</text>
		</view>

		<block v-else>
			<!-- 顶部状态卡片 -->
			<view class="status-card">
				<view class="status-icon">
					<text class="check">✓</text>
				</view>
				<view class="status-title">已开票</view>
				<view class="status-amount">¥{{ detail.money || '0.00' }}</view>
				<view class="status-tip">发票已开具成功，可下载或发送至邮箱</view>
			</view>

			<!-- 发票基本信息 -->
			<view class="section">
				<view class="section-title">发票信息</view>

				<view class="row">
					<text class="label">发票号码</text>
					<view class="value-row">
						<text class="value">{{ detail.fphm || '--' }}</text>
						<!-- <text class="copy" v-if="detail.fphm" @click="copy(detail.fphm)">复制</text> -->
					</view>
				</view>

				<view class="row">
					<text class="label">开票日期</text>
					<text class="value">{{ formatTime(detail.open_time) }}</text>
				</view>

				<view class="row">
					<text class="label">发票类型</text>
					<text class="value">{{ fpTypeText }}</text>
				</view>
			</view>

			<!-- 抬头信息 -->
			<view class="section">
				<view class="section-title">抬头信息</view>

				<view class="row">
					<text class="label">抬头名称</text>
					<text class="value">{{ detail.inv_title || '--' }}</text>
				</view>
				<!-- inv_type 1 个人  2 企业 -->
				<view class="row" v-if="detail.inv_type == 2">
					<text class="label">纳税人识别号</text>
					<text class="value">{{ detail.union_code || '--' }}</text>
				</view>

				<view class="row" v-if="detail.inv_type == 1">
					<text class="label">身份证号码</text>
					<text class="value">{{ detail.union_code || '--' }}</text>
				</view>

				<view class="row">
					<text class="label">联系电话</text>
					<text class="value">{{ detail.tel || '--' }}</text>
				</view>
			</view>

			<!-- 开票项目明细 -->
			<!-- <view class="section">
				<view class="section-title">开票项目</view>

				<view class="item" v-for="(item, index) in detail.details" :key="index">
					<view class="item-left">
						<view class="item-name">{{ item.tax_project_name || item.subject_name || item.subject_text }}
						</view>
						<view class="item-sub">数量：{{ item.number || 1 }}　单价：¥{{ item.price || '0.00' }}</view>
					</view>
					<view class="item-right">
						<text class="item-amount">¥{{ item.money || '0.00' }}</text>
					</view>
				</view>
			</view> -->

			<!-- 收票邮箱 -->
			<view class="section">
				<view class="section-title">收票邮箱</view>
				<view class="row">
					<text class="label">邮箱</text>
					<view class="value-row">
						<text class="value">{{ detail.email || '--' }}</text>
					</view>
				</view>
			</view>

			<!-- 底部操作按钮 -->
			<!-- <view class="footer">
                <view class="btn primary" @click="download">下载发票</view>
            </view> -->
		</block>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				id: null,
				loading: false,
				// 直接用后端返回的原始对象，不重命名字段
				detail: {}
			};
		},
		computed: {
			// fp_type: 1 普票 / 2 专票
			fpTypeText() {
				const map = {
					1: '增值税普通发票',
					2: '增值税专用发票'
				};
				return map[this.detail.fp_type] || '增值税普通发票';
			}
		},
		onLoad() {
			this.id = this.$Route.query.id;
			this.getDetail();
		},
		methods: {
			formatTime(ts) {
				if (ts === null || ts === undefined || ts === "") return "--";
				const num = Number(ts);
				if (!isNaN(num) && num > 0) {
					// 秒级（< 1e12）转毫秒；毫秒级直接用
					const ms = num < 1e12 ? num * 1000 : num;
					const d = new Date(ms);
					if (isNaN(d.getTime())) return String(ts);
					const pad = (n) => String(n).padStart(2, "0");
					return (
						`${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ` +
						`${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
					);
				}
				return String(ts);
			},
			// 查已开票列表 → 按 id 匹配
			async getDetail() {
				if (!this.id) {
					uni.showToast({
						title: '参数缺失',
						icon: 'none'
					});
					return;
				}
				this.loading = true;
				try {
					const res = await this.$api.invoiceMadeList({
						page: 1,
						limit: 999
					});
					this.loading = false;
					if (res.code === 1 && res.data) {
						const list = res.data.list || [];
						const item = list.find(row => String(row.id) === String(this.id));
						if (item) {
							this.detail = item;
						} else {
							uni.showToast({
								title: '未找到该发票记录',
								icon: 'none'
							});
						}
					}
				} catch (error) {
					this.loading = false;
					uni.showToast({
						title: '加载失败，请重试',
						icon: 'none'
					});
				}
			},

			// 复制
			copy(text) {
				if (!text) return;
				uni.setClipboardData({
					data: String(text),
					success: () => uni.showToast({
						title: '已复制',
						icon: 'none'
					})
				});
			},

			// 下载发票
			async download() {}
		}
	};
</script>
<style lang="scss">
	.invoice-detail {
		min-height: 100vh;
		background-color: #f5f6f8;
		padding-bottom: 200upx;

		.load {
			position: fixed;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			display: flex;
			align-items: center;
			justify-content: center;
			background-color: rgba(255, 255, 255, 0.85);
			z-index: 999;

			image {
				width: 50upx;
				height: 50upx;
			}

			.loading-text {
				color: #b1afaf;
				font-size: 24upx;
				margin-top: 20upx;
			}
		}

		/* 顶部状态卡片 */
		.status-card {
			margin: 30upx 24upx 0;
			padding: 40upx 30upx;
			background: linear-gradient(135deg, #ffdfa0 0%, #ffcf5a 100%);
			border-radius: 16upx;
			display: flex;
			flex-direction: column;
			align-items: center;
			box-shadow: 0 6upx 20upx rgba(255, 207, 90, 0.3);

			.status-icon {
				width: 90upx;
				height: 90upx;
				line-height: 90upx;
				text-align: center;
				border-radius: 50%;
				background-color: rgba(255, 255, 255, 0.4);
				display: flex;
				align-items: center;
				justify-content: center;

				.check {
					font-size: 50upx;
					color: #fff;
					font-weight: 600;
					line-height: 1;
				}
			}

			.status-title {
				font-size: 30upx;
				line-height: 42upx;
				color: #7a5a10;
				margin-top: 20upx;
				font-weight: 600;
			}

			.status-amount {
				font-size: 56upx;
				line-height: 70upx;
				color: #7a5a10;
				font-weight: 700;
				margin-top: 10upx;
			}

			.status-tip {
				font-size: 24upx;
				line-height: 34upx;
				color: rgba(122, 90, 16, 0.7);
				margin-top: 16upx;
			}
		}

		/* 通用区块 */
		.section {
			margin: 24upx;
			padding: 24upx;
			background-color: #fff;
			border-radius: 12upx;
			box-shadow: 0 0 6upx rgba(0, 0, 0, 0.05);

			.section-title {
				font-size: 28upx;
				line-height: 40upx;
				color: #999;
				margin-bottom: 12upx;
				padding-bottom: 12upx;
				border-bottom: 1upx dashed #f0f0f0;
			}

			.row {
				display: flex;
				align-items: flex-start;
				justify-content: space-between;
				padding: 16upx 0;

				.label {
					flex: none;
					width: 150upx;
					font-size: 28upx;
					line-height: 40upx;
					color: #999;
				}

				.value-row {
					flex: 1;
					display: flex;
					align-items: center;
					justify-content: flex-end;

					.value {
						font-size: 28upx;
						line-height: 40upx;
						color: #333;
						text-align: right;
						word-break: break-all;
					}

					.copy {
						flex: none;
						font-size: 24upx;
						line-height: 40upx;
						color: #ffcf5a;
						margin-left: 16upx;
					}

					.copy:active {
						opacity: 0.6;
					}
				}

				.value {
					flex: 1;
					font-size: 28upx;
					line-height: 40upx;
					color: #333;
					text-align: right;
					word-break: break-all;
				}
			}

			/* 开票项目明细 */
			.item {
				display: flex;
				align-items: flex-start;
				padding: 16upx 0;
				border-bottom: 1upx solid #f0f0f0;

				&:last-child {
					border-bottom: none;
				}

				.item-left {
					flex: 1;
					min-width: 0;

					.item-name {
						font-size: 28upx;
						line-height: 40upx;
						color: #333;
					}

					.item-sub {
						font-size: 24upx;
						line-height: 34upx;
						color: #999;
						margin-top: 8upx;
					}
				}

				.item-right {
					flex: none;
					margin-left: 20upx;

					.item-amount {
						font-size: 28upx;
						line-height: 40upx;
						color: #333;
					}
				}
			}
		}

		/* 底部操作栏 */
		.footer {
			position: fixed;
			left: 0;
			right: 0;
			bottom: 0;
			display: flex;
			padding: 20upx 24upx;
			padding-bottom: calc(20upx + constant(safe-area-inset-bottom));
			padding-bottom: calc(20upx + env(safe-area-inset-bottom));
			background-color: #fff;
			box-shadow: 0 -2upx 10upx rgba(0, 0, 0, 0.05);
			z-index: 99;

			.btn {
				flex: 1;
				height: 88upx;
				line-height: 88upx;
				text-align: center;
				font-size: 30upx;
				border-radius: 44upx;

				&:active {
					opacity: 0.8;
				}

				&.primary {
					color: #fff;
					background-color: #ffcf5a;
					border: 2upx solid #ffcf5a;
				}
			}
		}
	}
</style>