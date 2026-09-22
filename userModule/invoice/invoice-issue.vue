<template>
	<view class="invoice-bill">
		<!-- 顶部 tab -->
		<view class="uni-flex-center">
			<view class="uni-padding-wrap">
				<uni-segmented-control :current="currentIndex" :values="tabItems" :style-type="'text'"
					:active-color="'#ffcf5a'" @clickItem="onClickItem" />
			</view>
		</view>

		<!-- 首次加载 -->
		<view class="load" v-if="loading">
			<image src="/static/images/load.gif" mode="aspectFit"></image>
			<text class="loading-text">加载中...</text>
		</view>

		<view class="content" v-else>
			<!-- ==================== 可开票 ==================== -->
			<block v-if="currentIndex === 0">
				<view class="uni-empty" v-if="billableList.length === 0">暂无可开票记录</view>

				<block v-else>
					<!-- 全选 -->
					<view class="select-all">
						<view class="select-all-left" @click="toggleAll">
							<view class="invoice-checkbox" :class="{ checked: isAllChecked }">
								<text v-if="isAllChecked" class="check-icon">✓</text>
							</view>
							<text class="select-all-text">全选</text>
						</view>
						<text class="select-all-tip">已选 {{ selectedList.length }} 项</text>
					</view>

					<!-- 可开票列表 -->
					<view class="bill-item" v-for="(item, index) in billableList" :key="item.id">
						<view class="invoice-checkbox"
							:class="{ checked: isSelected(item), disabled: item.invc_status == '1' || item.is_invoice == '2' }"
							@click="toggleSelect(item)">
							<text v-if="isSelected(item)" class="check-icon">✓</text>
						</view>
						<view class="bill-left">
							<view class="bill-title">{{ item.title }}</view>
							<view class="bill-sub">订单号：{{ item.sn }}</view>
							<view class="bill-sub">缴费时间：{{ item.create_time }}</view>
							<view class="bill-sub">费用类型：{{ item.feeType }}</view>
						</view>
						<view class="bill-right">
							<text class="amount">¥{{ item.money }}</text>
							<text class="status" :class="getTargStatus(item.invc_status).cls">
								{{ getTargStatus(item.invc_status).text }}
							</text>
						</view>
					</view>

					<!-- 加载更多 -->
					<view class="load-more" v-if="billableList.length > 0">
						<text v-if="loadingMore">加载中...</text>
						<text v-else-if="billableFinished">没有更多了</text>
					</view>
				</block>
			</block>

			<!-- ==================== 已开票 ==================== -->
			<block v-else>
				<view class="uni-empty" v-if="issuedList.length === 0">暂无已开票记录</view>

				<block v-else>
					<view class="bill-item issued" v-for="(item, index) in issuedList" :key="item.id">
						<view class="issued-top" @click="toDetail(item)">
							<view class="bill-left">
								<view class="bill-title">{{ item.sn }}</view>
								<view class="bill-sub">发票号：{{ item.fphm || '--' }}</view>
								<view class="bill-sub">开票时间：{{ formatTime(item.open_time) }}</view>
							</view>
							<view class="bill-right">
								<text class="amount">¥{{ item.money }}</text>

								<text class="status" :class="getTargStatus(item.invc_status).cls">
									{{ getTargStatus(item.invc_status).text }}
								</text>
							</view>
						</view>

						<view class="issued-actions">
							<!-- <view class="btn-primary btn-primary--ghost" @click.stop="handleReissue(item)">重新开票</view> -->
							<!-- 只有开票状态为已开票、fphm有值 才能下载发票 -->
							<view class="btn-primary btn-primary--action" v-if="item.invc_status == '2' && item.fphm"
								@click.stop="handleDownload(item)">下载发票</view>
							<view v-else class="download-btn-default">下载发票</view>
						</view>
					</view>

					<view class="load-more" v-if="issuedList.length > 0">
						<text v-if="loadingMore">加载中...</text>
						<text v-else-if="issuedFinished">没有更多了</text>
					</view>
				</block>
			</block>
		</view>

		<!-- 底部开票栏 -->
		<view class="footer" v-if="currentIndex === 0">
			<view class="footer-left">
				<!-- <text class="footer-label">已选 {{ selectedList.length }} 项</text> -->
                <view class="footer-label-row">
                    <text class="footer-label">已选 {{ selectedList.length }} 项</text>
                    <view class="subject-icon" @click.stop="showInfoDialog = true">
                        <uni-icons type="info" size="16" color="#ec7f27"></uni-icons>
                    </view>
                </view>
				<text class="footer-amount">合计 ¥{{ totalAmount }}</text>
			</view>
			<view class="btn-primary btn-primary--footer" v-if="selectedList.length > 0 && !submitting" @click="toIssue">去开票</view>
			<view class="disabled-btn-default" v-else>{{ submitting ? '提交中...' : '去开票' }}</view>
		</view>

		<!-- 发票抬头 -->
		<uni-popup class="popup-dialog" ref="popupRef" type="bottom" background-color="#fff"
			border-radius="10px 10px 0 0" :is-mask-click="false">
			<view class="popup-contain">
				<view class="popup-top">
					<text class="popup-title">选择发票抬头</text>
					<uni-icons type="closeempty" size="18" class="close-btn" @click="closePopup"></uni-icons>
				</view>

				<view class="popup-content">
					<view class="invoice-list" v-if="invoiceList.length > 0">
						<view v-for="item in invoiceList" :key="item.id" class="invoice-item"
							:class="{ active: selectedGroupId === item.id }" @click="toggleGroup(item.id)">
							<view class="invoice-main">
								<view class="invoice-title-row">
									<text class="invoice-title">{{ item.inv_title }}</text>
									<text class="invoice-tag"
										:class="item.inv_type === 2 ? 'tag-company' : 'tag-personal'">
										{{ item.inv_type === 2 ? '企业' : '个人' }}
									</text>
									<text class="invoice-tag tag-default" v-if="item.default === 1">默认</text>
								</view>
								<view class="invoice-code">
									{{ item.inv_type === 2 ? '统一社会信用代码：' : '身份证号：' }}{{ item.union_code }}
								</view>
								<view class="invoice-type">
									发票类型：{{ item.inv_special === 1 ? '增值税专用发票' : '增值税普通发票' }}
								</view>
							</view>
							<view class="invoice-checkbox invoice-checkbox--right"
								:class="{ checked: selectedGroupId === item.id }">
								<text v-if="selectedGroupId === item.id" class="check-icon">✓</text>
							</view>
						</view>
					</view>

					<!-- 空状态 -->
					<view v-else class="empty-state">
						<text class="empty-text">暂无抬头</text>
					</view>
				</view>

				<view class="popup-bottom" v-if="invoiceList.length > 0">
					<button class="btn-primary btn-primary--submit" @click="confirmSelection">确定</button>
				</view>
			</view>
		</uni-popup>

        <!-- 可开票科目说明 -->
         <subjectInfoDialog v-model="showInfoDialog"></subjectInfoDialog>
	</view>
</template>

<script>
	import uniSegmentedControl from '@/components/uni-segmented-control/uni-segmented-control.vue';
	import subjectInfoDialog from './subject-info-dialog.vue';
	import {
		invoiceStatusEnum
	} from './invoice';
	export default {
		components: {
			uniSegmentedControl,
            subjectInfoDialog
		},
		data() {
			return {
				loading: false,
				loadingMore: false,
				currentIndex: 0, // 0 可开票  1 已开票

				billableList: [], // 可开票列表
				issuedList: [], // 已开票列表
				selectedList: [], // 已选中的可开票项

				page: 1,
				limit: 99,
				billableFinished: false,
				issuedFinished: false,

				invoiceList: [], // 发票抬头列表
				selectedGroupId: null, // 当前选中的抬头 id
                submitting: false, // 开票提交中
                showInfoDialog: false,
			};
		},
		computed: {
			tabItems() {
				return [{
					text: '可开票'
				}, {
					text: '已开票'
				}];
			},
			isAllChecked() {
				return this.billableList.length > 0 &&
					this.selectedList.length === this.billableList.length;
			},
			totalAmount() {
				const total = this.selectedList.reduce((sum, item) => {
					return sum + Number(item.money || 0);
				}, 0);
				return total.toFixed(2);
			}
		},
		onLoad() {
			this.refresh();
		},
		onPullDownRefresh() {
			this.refresh();
		},
		onReachBottom() {
			if (this.loading || this.loadingMore) return;
			if (this.currentIndex === 0) {
				if (this.billableFinished) return;
				this.getBillableList(false);
			} else {
				if (this.issuedFinished) return;
				this.getIssuedList(false);
			}
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
			getTargStatus(status) {
				const obj = invoiceStatusEnum.find(s => s.value == status) || {
					text: '未知',
					cls: 'status-pending'
				};
				return obj;
			},
			// 重置 + 重新加载当前 tab
			refresh() {
				this.page = 1;
				this.selectedList = [];
				if (this.currentIndex === 0) {
					this.billableList = [];
					this.billableFinished = false;
					this.getBillableList(true);
				} else {
					this.issuedList = [];
					this.issuedFinished = false;
					this.getIssuedList(true);
				}
			},

			// 切换 tab
			onClickItem(index) {
				if (this.currentIndex === index) return;
				this.currentIndex = index;
				// 每次切 tab 都清空并重置分页，重新加载
				this.page = 1;
				this.selectedList = [];
				// 切 tab 滚回顶部
				uni.pageScrollTo({
					scrollTop: 0,
					duration: 0
				});
				if (index === 0) {
					// 可开票列表
					this.billableList = [];
					this.billableFinished = false;
					this.getBillableList(true);
				} else {
					// 已开票列表
					this.issuedList = [];
					this.issuedFinished = false;
					this.getIssuedList(true);
				}
			},

			isSelected(item) {
				return this.selectedList.some(row => row.id === item.id);
			},

			toggleSelect(item) {
				// 只有未开票、开票失败的才能选择
				if (item.invc_status == '0' || item.invc_status == '3') {
					const idx = this.selectedList.findIndex(row => row.id === item.id);
					if (idx > -1) {
						this.selectedList.splice(idx, 1);
					} else {
						this.selectedList.push(item);
					}
				} else {
					uni.showToast({
						title: '该订单不可开票',
						icon: 'none'
					});
				}
			},

			toggleAll() {
				if (this.isAllChecked) {
					this.selectedList = [];
				} else {
					// this.selectedList = this.billableList.slice();
					// 只把未开票或者开票失败的加进去
					this.selectedList = this.billableList.filter(item => {
						return item.invc_status == '0' || item.invc_status == '3';
					});
				}
			},

			// 数据处理
			formatBillable(item) {
				const details = item.details || [];
				const first = details[0] || {};
				const feeType = details
					.map(d => d.subject_text)
					.filter(Boolean)
					.join('、') || '—';

				return {
					...item,
					feeType,
					title: first.subject_name || '缴费订单',
				};
			},

			// 可开票列表
			async getBillableList(isRefresh) {
				if (isRefresh) {
					this.loading = true
				} else {
					this.loadingMore = true
				};
				try {
					const res = await this.$api.invoiceCanList({
						page: this.page,
						limit: this.limit
					})
					this.loading = false;
					this.loadingMore = false;
					uni.stopPullDownRefresh();
					if (res.code === 1 && res.data) {
						const list = res.data.list || [];
						const formatted = list.map(this.formatBillable);

						if (isRefresh) {
							this.billableList = formatted;
						} else {
							this.billableList = this.billableList.concat(formatted);
						}

						if (list.length < this.limit) {
							this.billableFinished = true;
						} else {
							this.page++;
						}
					}
				} catch (error) {
					this.loading = false;
					this.loadingMore = false;
					uni.stopPullDownRefresh();
				}
			},

			// 已开票列表
			async getIssuedList(isRefresh) {
				if (isRefresh) {
					this.loading = true
				} else {
					this.loadingMore = true
				};

				try {
					const res = await this.$api.invoiceMadeList({
						page: this.page,
						limit: this.limit
					})
					this.loading = false;
					this.loadingMore = false;
					uni.stopPullDownRefresh();
					if (res.code === 1 && res.data) {
						const list = res.data.list || [];

						if (isRefresh) {
							this.issuedList = list;
						} else {
							this.issuedList = this.issuedList.concat(list);
						}

						if (list.length < this.limit) {
							this.issuedFinished = true;
						} else {
							this.page++;
						}
					}

				} catch (error) {
					this.loading = false;
					this.loadingMore = false;
					uni.stopPullDownRefresh();
				}
			},

			// 去开票
			toIssue() {
				if (this.selectedList.length === 0) {
					uni.showToast({ title: '请先选择要开票的记录', icon: 'none' });
					return;
				}
                // 选择发票抬头
                this.chooseTitle();

				// const count = this.selectedList.length;
				// const content = count === 1 ?
				// 	`将为「${this.selectedList[0].title}」开具 ¥${this.totalAmount} 的发票，是否开票？` :
				// 	`已选 ${count} 笔订单，合计 ¥${this.totalAmount}，是否开票？`;

				// uni.showModal({
				// 	title: '确认开票',
				// 	content,
				// 	confirmText: '确认开票',
				// 	confirmColor: '#ec7f27',
				// 	success: (res) => {
				// 		if (!res.confirm) return;
				// 		this.chooseTitle();
				// 	}
				// });
			},

			// 拉取抬头列表，让用户选择
			async chooseTitle() {
				uni.showLoading({ title: '加载抬头...' });
				try {
					const res = await this.$api.invoiceTitleList({
						page: 1,
						limit: 999
					});
					uni.hideLoading();
					if (res.code === 1 && res.data) {
						const titles = res.data.list || [];
						// 审核通过的抬头
						const reviewed = titles.filter(t => t.is_check == 1);
						if (reviewed.length === 0) {
							// 是否有未审核的抬头
							const hasPending = titles.some(t => t.is_check != 1);
							if (hasPending) {
								uni.showToast({
									title: '您有未审核的发票抬头，请耐心等待审核',
									icon: 'none'
								});
							} else {
								uni.showModal({
									title: '提示',
									content: '您还没有添加发票抬头，请先添加发票抬头',
									confirmText: '去添加',
									success: (r) => {
										if (r.confirm) {
											this.$Router.push({
												name: 'invoice-title'
											});
										}
									}
								});
							}
						} else {
							this.invoiceList = reviewed;
							// 默认选中默认抬头，没有则选第一个
							const defaultTitle = reviewed.find(t => t.default == 1);
							this.selectedGroupId = defaultTitle ? defaultTitle.id : reviewed[0].id;
							this.$refs.popupRef.open();
						}
					}
				} catch (error) {
					uni.hideLoading();
				}
			},
			// 关闭抬头弹窗
			closePopup() {
				this.$refs.popupRef.close()
			},
			// 选中抬头
			toggleGroup(id) {
				this.selectedGroupId = id;
			},
			// 确认开票
			confirmSelection() {
				if (!this.selectedGroupId) {
					uni.showToast({
						title: '请选择发票抬头',
						icon: 'none'
					});
					return;
				}
				const title = this.invoiceList.find(t => t.id === this.selectedGroupId);
				if (!title) return;

				this.$refs.popupRef.close();
				this.doIssue(title);
			},
			// 调用批量开票接口
			async doIssue(title) {
                if (this.submitting) return; // 防连点

				// 开票类型取抬头的 inv_special：0=普票，1=专票
				const inv_special = Number(title.inv_special) || 0;
				// 专票必须企业抬头（个人抬头后端也会拒）
				if (inv_special === 1 && title.inv_type !== 2) {
					uni.showToast({ title: '专票仅支持企业抬头', icon: 'none' });
					return;
				}
				// 需要开票的记录 id 列表
				const ids = this.selectedList.map(item => item.id).join(",")

                this.submitting = true;
				uni.showLoading({ title: '提交中...', mask: true });
				try {
					const params = {
						ids, // 可开票的ID
						title_id: title.id, // 发票抬头ID
						fp_type: inv_special == 1 ? 2 : 1, // 发票类型fp_type字段值：1=普票（默认），2=专票
						// ownerId: this.$store.state.myHouse.ownerInfo.oid, // 业主ID
					}
					const res = await this.$api.invoiceBatch(params)
					uni.hideLoading();
					if (res.code === 1) {
                        // 先清空选中，避免用户在弹窗期间重复操作
                        this.selectedList = [];
                        this.selectedGroupId = null;

						uni.showModal({
							title: '提交成功',
							content: '开票申请成功，请5分钟后在已开票中下载发票！',
							cancelText: '继续开票',
                            confirmText: '前往查看',
                            confirmColor: '#ec7f27',
							success: (r) => {
                                if (r.confirm) {
                                    // 切到「已开票」并重新加载，让用户立刻看到这条记录
                                    this.onClickItem(1);
                                } else {
                                    // 留在「可开票」，刷新一次让状态同步（可能变成"开票中"）
                                    this.refresh();
                                }
							}
						});
					} else {
						uni.showModal({
                            title: '提交失败',
                            content: '开票申请提交失败，请稍后重试！',
                            showCancel: false,
                            confirmText: '知道了',
                            confirmColor: '#ec7f27'
                        });
					}
				} catch (error) {
					uni.hideLoading();
					uni.showModal({
                        title: '提交失败',
                        content: '提交失败,请检查网络后重试。若不确定是否提交成功，请先到「已开票」查看，避免重复开票。',
                        showCancel: false,
                        confirmText: '知道了',
                        confirmColor: '#ec7f27'
                    });
				} finally {
                    this.submitting = false;
                }
			},

			// 已开票详情
			toDetail(item) {
				this.$Router.push({
					name: 'invoice-detail',
					params: {
						id: item.id
					}
				});
			},

			// 重新开票
			handleReissue(item) {
				uni.showModal({
					title: '重新开票',
					content: `确定要重新开具「${item.title}」的发票吗？重新开票后原发票将失效！`,
					confirmColor: '#ec7f27',
					success: (res) => {
						if (!res.confirm) return;
						console.log('重新开票', item);
					}
				});
			},
			normalizeFilePath(filePath) {
                // 反斜杠 → 正斜杠   // 去掉开头的斜杠
				return (filePath ?? "").replace(/\\/g, "/").replace(/^\/+/, "");
			},

			// 下载发票
			async handleDownload(item) {
				if (item.invc_status != '2') {
					uni.showToast({ title: '发票未开具', icon: 'none' });
					return;
				}
				if (!item.fphm) {
					uni.showToast({ title: '发票号码不存在', icon: 'none' });
					return;
				}
				if (!item.filepath) {
					uni.showToast({ title: '没有发票地址', icon: 'none' });
					return;
				}
				uni.showLoading({ title: '获取中...' });

				const path = this.normalizeFilePath(item.filepath); // 处理地址
				const tergetUrl = `${this.$store.state.invoiceDownloadUrl}/${path}`;
				uni.downloadFile({
                    url: tergetUrl,
                    success: (r) => {
                        if (r.statusCode !== 200) {
                            uni.hideLoading();
                            uni.showToast({ title: '获取文件失败', icon: 'none' });
                            return;
                        }
                        // 先用 saveFile 转换为稳定路径
                        uni.saveFile({
                            tempFilePath: r.tempFilePath,
                            success: (saveRes) => {
                                uni.hideLoading();
                                uni.openDocument({
                                    filePath: saveRes.savedFilePath, // 使用保存后的路径
                                    fileType: 'pdf',
                                    showMenu: true,
                                    fail: () => {
                                        uni.showToast({ title: '打开失败', icon: 'none' });
                                    }
                                });
                            },
                            fail: () => {
                                uni.hideLoading();
                                uni.showToast({ title: '保存文件失败', icon: 'none' });
                            }
                        });
                    },
                    fail: (err) => {
                        uni.hideLoading();
                        console.log('下载失败', err);
                        uni.showToast({ title: '下载失败', icon: 'none' });
                    }
                });
			}
		}
	};
</script>

<style lang="scss" scoped>
	$primary: #ffcf5a;
	$amount-color: #ec7f27;
	$text-main: #333;
	$text-sub: #999;
	$text-light: #ccc;
	$border-color: #e5e5e5;
	$bg-page: #f5f6f8;

	/* ==================== mixin ==================== */
	@mixin safe-bottom($padding: 20upx) {
		padding-bottom: calc(#{$padding} + constant(safe-area-inset-bottom));
		padding-bottom: calc(#{$padding} + env(safe-area-inset-bottom));
	}

	@mixin status-tag($color) {
		color: $color;
		background-color: rgba($color, 0.1);
	}

	@mixin btn-primary($height: 80upx, $radius: 40upx, $font-size: 30upx) {
		height: $height;
		line-height: $height;
		text-align: center;
		font-size: $font-size;
		color: #fff;
		background-color: $primary;
		border-radius: $radius;
		border: none;

		&::after {
			border: none;
		}

		&:active {
			opacity: 0.8;
		}
	}

	/* ==================== 通用类 ==================== */
	.btn-primary {
		@include btn-primary;

		&--footer {
			width: 240upx;
		}

		&--action {
			min-width: 160upx;
			@include btn-primary(60upx, 32upx, 26upx);
		}

		&--submit {
			@include btn-primary(88upx, 44upx);
		}
	}

	.invoice-checkbox {
		flex: none;
		width: 40upx;
		height: 40upx;
		border-radius: 50%;
		border: 2upx solid #d0d0d0;
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: #fff;

		.check-icon {
			font-size: 24upx;
			color: #fff;
			line-height: 1;
		}

		&.checked {
			background-color: $primary;
			border-color: $primary;
		}

		&.disabled {
			background-color: #dddddd;
			border-color: #e5e5e5;
			opacity: 0.6;

			.check-icon {
				color: #ccc;
			}
		}

		&--right {
			margin-left: 20upx;
		}
	}

	.status {
		font-size: 24upx;
		line-height: 30upx;
		padding: 4upx 14upx;
		border-radius: 4upx;
		margin-top: 12upx;

		&.status-pending {
			@include status-tag(#999);
		}

		&.status-processing {
			@include status-tag(#33b5ff);
		}

		&.status-success {
			@include status-tag(#65d8bf);
		}

		&.status-fail {
			@include status-tag(#f56c6c);
		}
	}

	/* ==================== 主容器 ==================== */
	.invoice-bill {
		min-height: 100vh;
		background-color: $bg-page;
		padding-top: 80upx;
		padding-bottom: 180upx;

		.uni-flex-center {
			background: #fff;
			position: fixed;
			top: 0;
			left: 0;
			width: 100%;
		}

		.uni-padding-wrap {
			width: 90%;
			padding: 0;
		}

		.load {
			position: fixed;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			background-color: rgba(255, 255, 255, 0.7);
			z-index: 9999;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;

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

		.content {
			padding: 30upx 24upx;

			.uni-empty {
				text-align: center;
				font-size: 28upx;
				color: $text-light;
			}

			.load-more {
				text-align: center;
				font-size: 24upx;
				color: $text-sub;
				padding: 30upx 0;
			}

			.select-all {
				display: flex;
				align-items: center;
				justify-content: space-between;
				padding: 0 20upx 20upx;

				.select-all-left {
					display: flex;
					align-items: center;
				}

				.select-all-text {
					font-size: 28upx;
					color: $text-main;
					margin-left: 12upx;
				}

				.select-all-tip {
					font-size: 24upx;
					color: $text-sub;
				}
			}

			/* 列表卡片：可开票 & 已开票共用一份 bill-left/bill-right/amount/status */
			.bill-item {
				display: flex;
				align-items: center;
				padding: 20upx;
				margin-bottom: 20upx;
				background-color: #fff;
				border-radius: 20upx;
				box-shadow: 0 0 6upx rgba(0, 0, 0, 0.05);

				&:active {
					background-color: #fafafa;
				}

				.invoice-checkbox {
					margin-right: 24upx;
					margin-top: 4upx;
				}

				.bill-left {
					flex: 1;
					min-width: 0;
				}

				.bill-title {
					font-size: 30upx;
					line-height: 42upx;
					color: $text-main;
					font-weight: 600;
				}

				.bill-sub {
					font-size: 26upx;
					line-height: 38upx;
					color: $text-sub;
					margin-top: 8upx;
				}

				.bill-right {
					flex: none;
					margin-left: 20upx;
					display: flex;
					flex-direction: column;
					align-items: flex-end;

					.amount {
						font-size: 32upx;
						line-height: 44upx;
						color: $amount-color;
						font-weight: 600;
					}
				}

				/* 已开票：竖排布局 + 操作区 */
				&.issued {
					display: block;

					.issued-top {
						display: flex;
						align-items: flex-start;
					}

					.issued-actions {
						display: flex;
						justify-content: flex-end;
						margin-top: 16upx;
						padding-top: 16upx;
						border-top: 1upx dashed #f0f0f0;
					}

					.download-btn-default {
						width: 160upx;
						height: 60upx;
						line-height: 60upx;
						text-align: center;
						font-size: 26rpx;
						color: #fff;
						background-color: #c4c3c2;
						border-radius: 40rpx;
						border: none;
					}
				}
			}
		}

		.footer {
			position: fixed;
			left: 0;
			right: 0;
			bottom: 0;
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 20upx 24upx;
			@include safe-bottom(20upx);
			background-color: #fff;
			box-shadow: 0 -2upx 10upx rgba(0, 0, 0, 0.05);
			z-index: 99;

			.footer-left {
				display: flex;
				flex-direction: column;

				.footer-label-row {
                    display: flex;
                    align-items: center;

                    .footer-label {
                        font-size: 24upx;
                        color: $text-sub;
                    }

                    .subject-icon {
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        width: 32upx;
                        height: 32upx;
                        margin-left: 8upx;

                        &:active {
                            opacity: 0.6;
                        }
                    }
                }

				.footer-amount {
					font-size: 30upx;
					color: $amount-color;
					font-weight: 600;
					margin-top: 4upx;
				}
			}

			.disabled-btn-default {
				width: 240upx;
				height: 80upx;
				line-height: 80upx;
				text-align: center;
				font-size: 30rpx;
				color: #fff;
				background-color: #c4c3c2;
				border-radius: 40rpx;
				border: none;
			}
		}
	}

	/* ==================== 发票抬头弹窗 ==================== */
	.popup-dialog {
		.popup-contain {
			display: flex;
			flex-direction: column;
			max-height: 80vh;
		}

		.popup-top {
			flex: none;
			width: 100%;
			height: 70upx;
			line-height: 70upx;
			display: flex;
			justify-content: center;
			align-items: center;
			position: relative;

			.popup-title {
				color: $text-main;
				font-size: 32upx;
				font-weight: 600;
			}

			.close-btn {
				position: absolute;
				top: 0;
				right: 20upx;
			}
		}

		.popup-content {
			flex: 1;
			width: 100%;
			padding: 20upx 24upx;
			box-sizing: border-box;
			overflow-y: auto;

			.invoice-list {
				.invoice-item {
					display: flex;
					align-items: center;
					padding: 24upx;
					margin-bottom: 20upx;
					border: 2upx solid $border-color;
					border-radius: 12upx;
					background-color: #fff;
					transition: all 0.2s;

					&:active {
						background-color: #fafafa;
					}

					&.active {
						border-color: $primary;
						background-color: #fffbf0;
					}

					.invoice-main {
						flex: 1;
						min-width: 0;

						.invoice-title-row {
							display: flex;
							align-items: center;
							flex-wrap: wrap;

							.invoice-title {
								font-size: 30upx;
								line-height: 42upx;
								color: $text-main;
								font-weight: 600;
								margin-right: 12upx;
							}

							.invoice-tag {
								font-size: 20upx;
								line-height: 28upx;
								padding: 2upx 10upx;
								border-radius: 4upx;
								margin-right: 10upx;

								&.tag-company {
									@include status-tag(#33b5ff);
								}

								&.tag-personal {
									@include status-tag(#65d8bf);
								}

								&.tag-default {
									@include status-tag($amount-color);
								}
							}
						}

						.invoice-code,
						.invoice-type {
							font-size: 24upx;
							line-height: 34upx;
							color: $text-sub;
							margin-top: 8upx;
							word-break: break-all;
						}
					}
				}
			}

			.empty-state {
				text-align: center;
				padding: 100upx 0;

				.empty-text {
					font-size: 28upx;
					color: $text-light;
				}
			}
		}

		.popup-bottom {
			flex: none;
			padding: 20upx 24upx;
			@include safe-bottom(20upx);
		}
	}
</style>