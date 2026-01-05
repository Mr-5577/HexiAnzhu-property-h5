<template>
	<view class="invoice">
		<view class="uni-empty" v-if="record.length == 0">{{ moreData }}</view>
		<view class="car-wrapper" v-else>
			<view class="car-item" v-for="(item, index) in record" :key="index">
				<view v-if="item.filepath">
					<view class="plate">
						{{ item.money }}
						<text style="font-weight: 400;font-size: 24upx;">（元）</text>
					</view>
					<view class="item-wrapper">
						<text class="name">订单号：</text>
						<text class="value">{{ item.sn }}</text>
					</view>
					<view class="item-wrapper">
						<text class="name">创建日期：</text>
						<text class="value">{{ timestampTime(item.createtime) }}</text>
					</view>
					<view class="btn-wrapper" @click="showInvoice(item)">
						<image src="/static/images/load.png" mode="aspectFit"></image>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			limit: 15,
			page: 1,
			record: [],
			moreData: '请前往物业中心打印发票',
			totalCount: 0
		};
	},
	onReachBottom() {
		let totalPage = Math.ceil(this.totalCount / this.limit);
		if (this.page < totalPage) {
			this.page++;
			this.getInvoice();
		}
	},
	methods: {
		getInvoice() {
			let data = {
				page: this.page,
				limit: this.limit
			};
			this.$api.getOrderSn(data, res => {
				if (res.data.record) {
					res.data.record.forEach(res => {
						if (res.filepath) {
							this.record.push(res);
						}
					});
				}
				this.totalCount = res.data.count;
				this.page = parseInt(res.data.page);
			});
		},
		timestampTime(time) {
			return this.$uitls.timestampToTime(time);
		},
		showInvoice(item) {
			if (!item.filepath) {
				uni.showToast({
					icon: 'none',
					title: '此订单暂无发票'
				});
				return;
			}

			let imgShowUrl = item.filepath;
			wx.downloadFile({
				url: imgShowUrl,
				header: {},
				success: function(res) {
					var filePath = res.tempFilePath;
					if (res.statusCode == 404) {
						wx.showToast({
							title: '获取文件失败',
							icon: 'success',
							duration: 2000
						});
					} else {
						wx.openDocument({
							filePath: filePath,
							fileType: 'pdf',
							success: function(res) {
								wx.showToast({
									title: '打开成功',
									icon: 'success',
									duration: 2000
								});
							},
							fail: function(res) {
								uni.showModal({
									title: '提示',
									content: '请到物业前台打印发票',
									success: function(resp) {
										
									}
								});
							}
						});
					}
				},
				fail: function(res) {
					uni.showModal({
						title: '提示',
						content: '请到物业前台打印发票',
						success: function(resp) {
							
						}
					});
				}
			});
		}
	},
	onLoad() {
		this.getInvoice();
	}
};
</script>

<style lang="scss">
.invoice {
	min-height: 100vh;
	box-sizing: border-box;
	background-color: #fafafa;
	padding: 30upx 24upx;
	.car-wrapper {
		.car-item {
			padding: 30upx;
			background-color: #fff;
			box-shadow: 0 0 6upx rgba(0, 0, 0, 0.05);
			border-radius: 10upx;
			position: relative;
			margin-bottom: 30upx;
			.plate {
				font-size: 32upx;
				color: #333;
				line-height: 44upx;
				font-weight: 600;
			}
			.item-wrapper {
				margin-top: 10upx;
				.name,
				.value {
					display: inline-block;
					font-size: 28upx;
					color: #666;
					line-height: 40upx;
				}
			}
			.btn-wrapper {
				position: absolute;
				top: 50%;
				right: 30upx;
				transform: translateY(-50%);
				image {
					width: 76upx;
					height: 76upx;
					vertical-align: middle;
				}
			}
		}
		.car-item:last-child {
			margin-bottom: 0;
		}
	}
}
</style>
