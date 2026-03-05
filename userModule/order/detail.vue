<template>
	<view id="order-detail" v-if="orderData.sn">
		<view class="detail-wrapper">
			<view class="money">{{ allMoney }}元</view>
			<view class="text">账单金额（元）</view>
			<view class="content">
				<view class="item">
					<text class="name">订单号</text>
					<text class="code">{{ orderData.sn }}</text>
				</view>
				<view class="item">
					<text class="name">缴费类型</text>
					<text class="code">{{ allType }}</text>
				</view>
				<view class="item">
					<text class="name">创建时间</text>
					<text class="code">{{ timestampToTime(orderData.createtime) }}</text>
				</view>
			</view>
		</view>

		<view class="canvas-hide"><canvas style="width: 760px; height: 480px" canvas-id="myCanvas"
				id="myCanvas"></canvas></view>
		<canvas class="canvas-hide" canvas-id="qrcode" style="width: 80px;height: 80px;" />

		<view class="btn-wrapper">
			<button class="btn1" plain :disabled="disabled" v-if="orderType === 2" @click="payment">去支付</button>
			<button class="btn2" plain :disabled="disabled" v-if="orderType === 2" @click="delOrder">删除订单</button>
			<button class="btn1" plain :disabled="disabled" v-if="orderType === 1 && filepath"
				@click="downloadInvoice">下载发票</button>
			<button class="btn1" plain :disabled="disabled" v-if="orderType === 1 && !filepath"
				@click="supInvoice">补开发票</button>
			<button class="btn2" plain :disabled="disabled" v-if="orderType === 1"
				@click="downloadReceipt">下载收据</button>
		</view>
	</view>
</template>

<script>
	// import uQRCode from '@/common/uqrcode.js';
	export default {
		data() {
			return {
				orderData: {},
				orderType: 1, //1已缴费  2未缴费
				allMoney: 0,
				allType: '',
				disabled: false,
				// 发票路径
				filepath: '',
				// 项目id
				vid: ''
			};
		},

		onLoad(option) {
			let data = {};
			if (option.scene) {
				const scene = decodeURIComponent(option.scene);
				this.vid = this.getQuery(scene, 'vid');
				data.id = this.getQuery(scene, 'id');
				data.vid = this.getQuery(scene, 'vid');
				data.sn = '';
				data.type = 1;
			} else {
				let obj = JSON.parse(decodeURIComponent(option.query));
				data.id = obj.id;
				data.sn = obj.sn;
				data.type = obj.type;
			}
			this.orderType = data.type;
			this.getOrderDetail(data);
		},

		onShow() {
			this.disabled = false;
		},

		methods: {
			// 获取订单详情数据
			getOrderDetail(data) {
				this.$api.orderInfo(data, res => {
					this.filepath = res.data.filepath ? res.data.filepath : '';
					if (this.orderType == 1) {
						this.orderData = res.data;
						this.allMoney = this.orderData.money;
						this.allType = [];
						if (this.orderData.costWater) {
							this.allType.push(this.orderData.costWater[0].table_type);
						}
						if (this.orderData.costEle) {
							this.allType.push(this.orderData.costEle[0].table_type);
						}
						if (this.orderData.costWg) {
							this.allType.push(this.orderData.costWg[0].table_type);
						}
						if (this.orderData.costCarWg) {
							this.allType.push(this.orderData.costCarWg[0].table_type);
						}
						if (this.orderData.costCar) {
							this.allType.push(this.orderData.costCar[0].table_type);
						}
						if (this.orderData.balance) {
							this.allType.push(this.orderData.balance[0].table_type);
						}
						this.allType = this.$uitls.toString(this.allType);
					} else {
						let datas = res.data;
						this.orderData = datas[0];
						this.allMoney = 0;
						this.allType = [];
						datas.forEach(res => {
							this.allMoney = this.allMoney + parseFloat(res.money);
							this.allType.push(res.table_type);
						});
						this.allType = this.$uitls.toString(this.allType);
						this.allMoney = this.allMoney.toFixed(2);
					}
				});
			},

			// 时间格式化
			timestampToTime(timestamp) {
				var date = new Date(timestamp * 1000); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
				var Y = date.getFullYear() + '-';
				var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
				var D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' ';
				var h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
				var m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
				var s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
				return Y + M + D + h + m + s;
			},

			// 去支付
			payment() {
				// let orderInfo ={}
				let datas = {
					sn: this.orderData.sn,
					money: this.allMoney
				};
				this.disabled = true;
				this.$store.commit('setOrderData', datas);
				this.$Router.push({
					name: 'payment'
				});
			},

			// 删除订单
			delOrder() {
				let _this = this;
				uni.showModal({
					title: '',
					content: '确定要删除该订单吗？',
					confirmText: '删除订单',
					cancelText: '不删除',
					confirmColor: '#ffcf5a',
					success(res) {
						if (res.confirm) {
							let data = {
								order_num: _this.orderData.sn
							};
							_this.$api.delOrder(data, res => {
								_this.recordList = [];
								uni.showToast({
									icon: 'none',
									title: '删除订单成功!',
									duration: 2000,
									success() {
										uni.navigateBack({
											delta: 1
										});
									}
								});
							});
						}
					}
				});
			},

			// 提取地址中的参数
			getQuery(query, key) {
				var map = query.split('&');
				for (var i = 0; i < map.length; i++) {
					var pair = map[i].split('=');
					if (pair[0] == key) {
						return pair[1];
					}
				}
			},

			// 下载发票
			downloadInvoice() {
				if (!this.filepath) {
					uni.showToast({
						icon: 'none',
						title: '此订单暂无发票'
					});
					return;
				}

				wx.downloadFile({
					url: this.filepath,
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
										success: function(resp) {}
									});
								}
							});
						}
					},
					fail: function(res) {
						uni.showModal({
							title: '提示',
							content: '请到物业前台打印发票',
							success: function(resp) {}
						});
					}
				});
			},

			// 补开发票
			supInvoice() {
				// let data = {
				// 	id: this.orderData.id
				// };
				// if (this.vid) {
				// 	data.vid = this.vid;
				// }
				// // 获取收据详情数据
				// this.$api.openBill(data, result => {
				// 	uni.showToast({
				// 		icon: 'none',
				// 		title: '发票补开成功！'
				// 	});
				// 	let obj = {
				// 		id: this.orderData.id,
				// 		sn: this.orderData.sn,
				// 		type: 1
				// 	};
				// 	if (this.vid) {
				// 		obj.vid = this.vid;
				// 	}
				// 	this.getOrderDetail(obj);
				// });
				uni.showToast({
					icon: 'none',
					title: '请到物业前台打印发票'
				});
			},

			// 下载收据
			downloadReceipt() {
				let data = {
					id: this.orderData.id
				};
				if (this.vid) {
					data.vid = this.vid;
				}
				// 获取收据详情数据
				this.$api.receiptInfo(data, result => {
					this.receiptSave(result.data);
					// 生成二维码
					// uQRCode.make({
					// 	canvasId: 'qrcode',
					// 	text: `http://est.ygddwy.com/web/receipt.html?id=${data.id}`,
					// 	size: 80,
					// 	margin: 0,
					// 	backgroundColor: '#ffffff',
					// 	foregroundColor: '#000000',
					// 	fileType: 'png',
					// 	success: res => {
					// 		result.data.qrUrl = res;
					// 		this.receiptSave(result.data);
					// 	}
					// });
				});
			},

			// 生成收据并下载
			receiptSave(data) {
				const ctx = uni.createCanvasContext('myCanvas');
				// 填充背景色，白色
				ctx.setFillStyle('#800000');
				// fillRect(x,y,宽度，高度)
				ctx.fillRect(50, 50, 660, 380);
				// 填充背景色，白色
				ctx.setFillStyle('#fff');
				// fillRect(x,y,宽度，高度)
				ctx.fillRect(52, 52, 656, 376);

				ctx.setFontSize(20);
				ctx.setFillStyle('#000000');
				ctx.fillText('收据', 360, 35);

				ctx.setFontSize(14);
				ctx.setFillStyle('#000000');
				ctx.fillText('状态：', 560, 20);
				ctx.setFillStyle('#0000FF');
				ctx.fillText(data.status_text || '', 610, 20, 100);

				ctx.setFontSize(15);
				ctx.setFillStyle('#000000');
				ctx.fillText('No', 545, 40);
				ctx.setFontSize(14);
				ctx.setFillStyle('#800000');
				ctx.fillText(data.receipt_num || '', 570, 40, 150);

				// 第一排
				ctx.setFontSize(14);
				ctx.setFillStyle('#000000');
				ctx.fillText('小区名称：', 80, 90);
				ctx.setFillStyle('#0000FF');
				ctx.fillText(data.villagename || '', 160, 90, 150);

				ctx.setFontSize(14);
				ctx.setFillStyle('#000000');
				ctx.fillText('房号/姓名：', 280, 90);
				ctx.setFillStyle('#0000FF');
				ctx.fillText((data.roomnum || '') + '/' + (data.owner_name || ''), 360, 90, 180);

				ctx.setFontSize(14);
				ctx.setFillStyle('#000000');
				ctx.fillText('日期：', 550, 90);
				ctx.setFillStyle('#0000FF');
				ctx.fillText(data.date || '', 590, 90, 150);

				// 第二排
				ctx.setFontSize(14);
				ctx.setFillStyle('#000000');
				ctx.fillText('收费项目：', 80, 130);

				ctx.setFontSize(14);
				ctx.setFillStyle('#000000');
				ctx.fillText('摘     要：', 340, 130);

				ctx.setFontSize(14);
				ctx.setFillStyle('#000000');
				ctx.fillText('金额：', 600, 130);

				for (let i = 0; i < data.subject_detail.length; i++) {
					ctx.setFontSize(14);
					ctx.setFillStyle('#0000FF');
					ctx.fillText(data.subject_detail[i].project || '', 80, 160 + i * 30);

					ctx.setFontSize(14);
					ctx.setFillStyle('#0000FF');
					ctx.fillText(data.subject_detail[i].zy || '', 270, 160 + i * 30);

					ctx.setFontSize(14);
					ctx.setFillStyle('#0000FF');
					ctx.fillText('￥' + (data.subject_detail[i].mainmoney || '0'), 580, 160 + i * 30);
				}

				ctx.setFontSize(14);
				ctx.setFillStyle('#000000');
				ctx.fillText('合计：', 90, 340);
				ctx.setFillStyle('#0000FF');
				ctx.fillText('￥' + (data.money || '0'), 130, 340, 100);

				ctx.setFontSize(14);
				ctx.setFillStyle('#000000');
				ctx.fillText('人民币(大写)：', 235, 340);
				ctx.setFillStyle('#0000FF');
				ctx.fillText(data.capitalization_money || '', 325, 340, 165);

				ctx.setFontSize(14);
				ctx.setFillStyle('#000000');
				ctx.fillText('渠道：', 490, 340);
				ctx.setFillStyle('#0000FF');
				ctx.fillText(data.pay_type || '', 530, 340, 80);

				ctx.setFontSize(14);
				ctx.setFillStyle('#000000');
				ctx.fillText('收款单位：', 80, 390);
				ctx.setFillStyle('#0000FF');
				ctx.fillText(data.payee || '', 150, 390, 170);

				ctx.setFontSize(14);
				ctx.setFillStyle('#000000');
				ctx.fillText('收款人：', 325, 390);
				ctx.setFillStyle('#0000FF');
				ctx.fillText(data.creater || '', 380, 390, 180);

				ctx.setFontSize(14);
				ctx.setFillStyle('#000000');
				ctx.fillText('交款人：', 450, 390);
				ctx.setFillStyle('#0000FF');
				ctx.fillText(data.owner_name || '', 505, 390, 150);

				// 绘制二维码、印章
				if (data.qrCode) {
					ctx.drawImage(data.qrCode, 610, 320, 80, 80);
				}
				if (data.seal_image) {
					ctx.drawImage(data.seal_image, 210, 360, 80, 80);
				}

				ctx.draw(true, () => {
					setTimeout(function() {
						uni.canvasToTempFilePath({
							canvasId: 'myCanvas',
							x: 0,
							y: 0,
							width: 760,
							height: 480,
							success: function(res) {
								// 在这里保存图片
								uni.saveImageToPhotosAlbum({
									filePath: res.tempFilePath,
									success: res => {
										wx.showToast({
											title: '收据下载成功！',
											icon: 'success',
											duration: 2000
										});
									},
									fail: err => {
										wx.showToast({
											title: '收据下载失败！',
											icon: 'none',
											duration: 2000
										});
									}
								});
							},
							fail: function(error) {
								wx.showToast({
									title: '收据下载失败！',
									icon: 'none',
									duration: 2000
								});
							}
						});
					}, 100);
				});
			}
		}
	};
</script>

<style lang="scss">
	#order-detail {
		min-height: 100vh;
		background-color: #fafafa;
		padding: 30upx 24upx;
		box-sizing: border-box;

		.detail-wrapper {
			background-color: #fff;
			box-shadow: 0 0 6upx rgba(0, 0, 0, 0.05);
			padding: 40upx 30upx 60upx;
			border-radius: 10upx;

			.money {
				font-size: 32upx;
				color: #ffcf5a;
				line-height: 44upx;
				text-align: center;
				font-weight: 600;
			}

			.text {
				font-size: 26upx;
				color: #999;
				line-height: 36upx;
				margin: 30upx 0 40upx;
				text-align: center;
			}

			.content {
				padding: 30upx;
				background-color: #fafafa;
				border-radius: 10upx;

				.item {
					display: flex;
					margin-bottom: 30upx;

					.name {
						font-size: 30upx;
						line-height: 42upx;
						color: #999;
					}

					.code {
						flex: 1;
						font-size: 30upx;
						line-height: 42upx;
						color: #333;
						text-align: right;
					}
				}

				.item:last-child {
					margin-bottom: 0;
				}
			}
		}

		.btn-wrapper {
			position: fixed;
			bottom: 0;
			left: 0;
			width: 100%;
			padding: 30upx 24upx 60upx;
			box-sizing: border-box;

			button {
				margin-bottom: 30upx;
				padding: 24upx 0;
				font-size: 28upx !important;
				line-height: 40upx !important;
			}

			button:last-child {
				margin-bottom: 0;
			}

			.btn1 {
				background-color: #ffcf5a;
				color: #fff;
				border: none;
			}

			.btn2 {
				border-color: #ffcf5a;
				color: #ffcf5a;
				background-color: #fff;
			}

			button:active {
				opacity: 0.8;
			}
		}

		.canvas-hide {
			/* 1 */
			position: fixed;
			right: 100vw;
			bottom: 100vh;
			/* 2 */
			z-index: -9999;
			/* 3 */
			opacity: 0;
		}
	}
</style>