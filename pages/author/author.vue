<template>
	<view id="author">
		<!-- 未登录授权页面 -->
		<view v-if="!isLogin">
			<view class="bd-content">
				<!-- <image class="u-img" src="../../static/img/login.png" mode=""></image> -->
				<view class="text1">和喜慧管家申请获得以下权限</view>
				<view class="text2">获得你的微信公开信息(昵称、头像等)</view>
				<view class="forget-btn"><button class="wx-btn" :disabled="btnDisabled" open-type="getPhoneNumber"
						@getphonenumber="getphonenumber">登录授权</button></view>
			</view>
		</view>
		<view v-if="isLogin && !isLoading">
			<!-- 绑定房产授权部分 -->
			<view class="bd-content" v-if="type == 3">
				<!-- <image class="u-img" src="../../static/img/author.png" mode=""></image> -->
				<view class="text1">尊敬的{{ roomObj.villagename ? roomObj.villagename : '' }}业主</view>
				<view class="text2">您的管家{{roomObj.housekeeper_name}}邀您绑定房产：</view>
				<view class="text3">{{ roomObj.villagename ? roomObj.villagename : '' }}
					房号：{{ roomObj.roomnum ? roomObj.roomnum : '' }}</view>
				<view class="forget-btn"><button :disabled="btnDisabled" class="wx-btn"
						@click="userAuthor">绑定房产</button></view>
			</view>
			<!-- 物业费、车辆费支付部分 -->
			<view class="wg-wrapper" v-else>
				<view class="wg-content">
					<view class="header">{{ costObj.village.villageaddr + costObj.village.villagename }} — 收款方</view>
					<!-- 物业费缴纳信息部分 -->
					<view class="wy-wrapper" v-if="type == 1">
						<view class="qf-content" v-if="costObj.wg && costObj.wg.length > 0">
							<view class="title">物业欠费</view>
							<view class="hd">
								<text>欠费金额(元)</text>
								<text>欠费月份</text>
								<text>欠费科目</text>
							</view>
							<view class="qf-item" v-for="item in costObj.wg" :key="item.id">
								<text class="money">{{ item.money }}</text>
								<text class="month">{{ item.ymonth }}</text>
								<text class="object">物业费</text>
							</view>
						</view>
						<view class="yj-content" v-if="costObj.wg_yj && costObj.wg_yj.money">
							<view class="title">物业预缴</view>
							<view class="hd">
								<text>预缴金额(元)</text>
								<text>开始月份</text>
								<text>预缴数量(月)</text>
							</view>
							<view class="qf-item">
								<text class="money">{{ costObj.wg_yj.money }}</text>
								<text class="month">{{ costObj.wg_yj.ymonth }}</text>
								<text class="object">{{ costObj.wg_yj.num }}</text>
							</view>
						</view>
					</view>
					<!-- 车辆费缴纳信息部分 -->
					<view class="car-wrapper" v-else>
						<view class="qf-content" v-if="costObj.car && costObj.car.length > 0">
							<view class="title">车辆欠费</view>
							<view class="car-wrapper" v-for="(item, index) in costObj.car" :key="index">
								<view class="cname">{{ costObj.plates }}</view>
								<view class="hd">
									<text>欠费金额(元)</text>
									<text>欠费月份</text>
									<text>欠费科目</text>
								</view>
								<view class="qf-item" v-for="itm in item.car" :key="itm.id">
									<text class="money">{{ itm.money }}</text>
									<text class="month">{{ itm.ymonth }}</text>
									<text class="object">车位费</text>
								</view>
							</view>
						</view>
						<view class="yj-content">
							<view class="title">车辆预缴</view>
							<view class="car-wrapper">
								<view class="cname">{{ costObj.plates }}</view>
								<view class="hd">
									<text>预缴金额(元)</text>
									<text>开始月份</text>
									<text>预缴数量(月)</text>
								</view>
								<view class="qf-item">
									<text class="money">{{ costObj.car_yj.money }}</text>
									<text class="month">{{ costObj.car_yj.ymonth }}</text>
									<text class="object">{{ costObj.car_yj.num }}</text>
								</view>
							</view>
						</view>
					</view>
					<view class="total">
						<text class="tx1">收款合计：</text>
						<text class="tx2">{{ costObj.paymoney ? costObj.paymoney : '0.00' }}元</text>
					</view>
					<view class="forget-btn"><button class="wx-btn" @click="userAuthor">立即支付</button></view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				// 是否正在加载房产、支付数据
				isLoading: false,
				// 物业支付：1，车辆支付：2，绑定：3
				type: 1,
				// 是否禁用button
				btnDisabled: false,
				// 订单id
				orderId: '"11616"',
				// 消息id
				msgId: '',
				// 楼栋管家id
				userId: '',
				// 订单数据
				orderInfo: {},
				// 房间id
				roomId: '',
				// 房产信息对象
				roomObj: {},
				// 物业费/车辆费信息对象
				costObj: {}
			};
		},
		computed: {
			isLogin() {
				return this.$store.state.hasLogin;
			}
		},
		onLoad(option) {
			const scene = decodeURIComponent(option.scene);
			let arr = scene.split('&');
			arr.forEach((item) => {
				let arr1 = item.split('=');
				switch (arr1[0]) {
					case 't':
						this.type = arr1[1];
						break;
					case 's':
						this.orderId = arr1[1];
						break;
					case 'm':
						this.msgId = arr1[1];
						break;
					case 'u':
						this.userId = arr1[1];
						break;
					case 'r':
						this.roomId = arr1[1];
						break;
				}
			})
			// 已经登录处理
			if (this.$store.state.hasLogin) {
				// 获取房产或者订单基础信息
				let data = {
					type: this.type,
					login_token: this.$store.state.login_token
				};
				if (this.type != 3) {
					data.sn_id = this.orderId;
					data.user_id = this.userId;
				} else {
					data.rooms_id = this.roomId;
					data.msg_id = this.msgId;
				}
				this.getInfo(data);
			}
		},
		methods: {
			// 获取房产或者支付订单数据
			getInfo(data) {
				this.isLoading = true;
				uni.showLoading({
					title: '数据加载中'
				})
				this.$api.author(data, res => {
					if (res.code == 1) {
						if (this.type == 3) {
							this.roomObj = res.data;
						} else {
							this.costObj = res.data;
						}
					} else {
						uni.showToast({
							icon: 'none',
							title: res.msg
						})
					}
					this.isLoading = false;
					uni.hideLoading({
						title: '数据加载中'
					})
				});
			},

			//获取手机号并授权登录
			getphonenumber(e) {
				let _this = this;
				uni.login({
					provider: 'weixin',
					success(loginRes) {
						let data = {
							encryptedData: e.detail.encryptedData,
							iv: e.detail.iv,
							code: loginRes.code
						};
						_this.$api.login_xcx(data, res => {
							try {
								uni.setStorageSync('loginToken', res.data);
								_this.$store.commit('loginToken', res.data);
							} catch (e) {
								//TODO handle the exception
							}
							if (_this.$store.state.hasLogin) {
								// 获取房产或者订单基础信息
								let data = {
									type: _this.type,
									login_token: _this.$store.state.login_token
								};
								if (_this.type != 3) {
									data.sn_id = _this.orderId;
									data.user_id = _this.userId;
								} else {
									data.rooms_id = _this.roomId;
									data.msg_id = _this.msgId;
								}
								_this.getInfo(data);
							}
						});
					}
				});
			},

			// 授权后获取数据
			userAuthor() {
				// 判断是支付还是绑定
				if (this.type == 3) {
					this.btnDisabled = true;
					// 绑定房产请求
					this.bindHouse();
				} else {
					// 唤起微信支付
					this.requestPayment();
				}
			},

			// 发起支付处理
			async requestPayment() {
				this.btnDisabled = true;
				uni.showLoading({
					title: '正在发起支付...'
				});

				// 获取预支付订单信息
				let orderInfo = await this.getOrderInfo('wxpay');

				if (orderInfo.code !== 1) {
					uni.showModal({
						content: '获得订单信息失败',
						showCancel: false
					});
					uni.hideLoading();
					return;
				}
				// #ifdef APP-PLUS
				let orderInfos = orderInfo.data;
				uni.requestPayment({
					provider: 'wxpay',
					orderInfo: orderInfos,
					success: e => {
						uni.showToast({
							title: '感谢您的使用!',
							success() {
								uni.navigateBack({
									delta: 2
								});
							}
						});
					},
					fail: e => {
						uni.showModal({
							content: '支付失败',
							showCancel: false
						});
					},
					complete: () => {
						this.btnDisabled = false;
					}
				});
				// #endif
				uni.hideLoading();
				// #ifdef MP-WEIXIN
				uni.requestPayment({
					timeStamp: orderInfo.data.timeStamp,
					nonceStr: orderInfo.data.nonceStr,
					package: orderInfo.data.package,
					signType: 'MD5',
					paySign: orderInfo.data.paySign,
					success: e => {
						uni.showToast({
							title: '感谢您的使用!',
							success() {
								uni.switchTab({
									url: '/pages/main/index/index'
								});
							}
						});
					},
					fail: e => {
						uni.showModal({
							content: '支付失败',
							showCancel: false
						});
					},
					complete: () => {
						this.btnDisabled = false;
					}
				});
				// #endif
			},

			// 获取支付信息
			getOrderInfo(type) {
				let _this = this;
				// 实际的支付
				let data = {
					sn: this.costObj.sn,
					total_fee: this.costObj.paymoney,
				};
				return new Promise(res => {
					// #ifdef APP-PLUS
					if (type == 'alipay') {
						_this.$api.aliPay(data, resp => {
							uni.hideLoading();
							res(resp);
						});
					} else {
						_this.$api.payMent(data, resp => {
							uni.hideLoading();
							res(resp);
						});
					}

					// #endif
					// #ifdef MP-WEIXIN
					_this.$api.payMentXcx(data, resp => {
						uni.hideLoading();
						res(resp);
					});
					// #endif
				});
			},

			// 绑定房产请求
			bindHouse() {
				let data = {
					login_token: this.$store.state.login_token, //登录令牌
					idcard: this.roomObj.idcard, //		身份证号
					vid: this.roomObj.vid, //		项目id
					bid: this.roomObj.bid, //		楼栋id
					unit: this.roomObj.unit, //		单元id
					roomid: this.roomObj.roomid, //		房间号
					msg_id: this.msgId
				};
				this.$api.bind(data, res => {
					this.$store.commit('bindHouse', res.data);
					uni.showToast({
						title: '房产绑定成功！'
					});
					setTimeout(() => {
						uni.hideToast();
						this.btnDisabled = false;
						uni.switchTab({
							url: '/pages/main/index/index'
						});
					}, 1000);
				});
				setTimeout(() => {
					this.btnDisabled = false;
				}, 5000);
			}
		}
	};
</script>

<style>
	#author {
		min-height: 100vh;
		background: url('../../static/img/author-bg.png') no-repeat;
		background-size: 100% 100%;
		position: relative;
		box-sizing: border-box;
	}

	#author .mask {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 3000;
		background-color: rgba(0, 0, 0, 0.5);
	}

	#author .mask .status {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		text-align: center;
	}

	#author .mask .status .load-img {
		width: 80rpx;
		height: 80rpx;
		margin-bottom: 20rpx;
	}

	#author .mask .status .load-text {
		display: block;
		color: #fff;
		font-size: 28rpx;
		line-height: 40rpx;
	}

	#author .bd-content {
		background-color: #fff;
		width: 640rpx;
		height: 760rpx;
		border-radius: 20rpx;
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		padding: 0 40rpx;
		box-sizing: border-box;
	}

	#author .bd-content .u-img {
		vertical-align: middle;
		width: 320rpx;
		height: 240rpx;
		position: absolute;
		top: 100rpx;
		left: 50%;
		transform: translateX(-50%);
	}

	#author .bd-content .text1 {
		font-size: 32rpx;
		font-weight: 600;
		line-height: 44rpx;
		margin: 400rpx 0 20rpx 0;
		text-align: center;
	}

	#author .bd-content .text2,
	#author .bd-content .text3 {
		font-size: 30rpx;
		line-height: 42rpx;
		text-align: center;
		margin-bottom: 20rpx;
	}

	#author .bd-content .text3 {
		margin-bottom: 40rpx;
	}

	#author .bd-content .forget-btn .wx-btn,
	#author .wg-content .forget-btn .wx-btn {
		background-color: #ffcf5a;
		color: #fff;
		font-size: 28rpx;
		padding-top: 10rpx;
		padding-bottom: 10rpx;
	}

	#author .bd-content .forget-btn .wx-btn:after,
	#author .wg-content .forget-btn .wx-btn:after {
		display: none;
	}

	#author .wg-content .forget-btn .wx-btn {
		margin-top: 60rpx;
	}

	#author .wg-wrapper {
		width: 100vw;
		min-height: 100vh;
		display: flex;
		align-items: center;
		justify-content: center;
		box-sizing: border-box;
		padding: 30rpx 0;
	}

	#author .wg-content {
		width: 700rpx;
		background-color: #fff;
		border-radius: 20rpx;
		margin: 0 auto;
		box-sizing: border-box;
		padding: 0 40rpx 80rpx;
	}

	#author .wg-content .header {
		font-size: 32rpx;
		color: #333;
		line-height: 44rpx;
		font-weight: 600;
		padding: 60rpx 0;
	}

	#author .wg-content .qf-content,
	#author .wg-content .yj-content {
		background-color: #fafafa;
		border-radius: 10rpx;
		padding: 30rpx;
		margin-bottom: 30rpx;
	}

	#author .wg-content .qf-content .car-wrapper,
	#author .wg-content .yj-content .car-wrapper {
		margin-bottom: 30rpx;
		color: #666;
		font-size: 30rpx;
		line-height: 42rpx;
	}

	#author .wg-content .qf-content .title,
	#author .wg-content .yj-content .title {
		font-size: 26rpx;
		line-height: 32rpx;
		color: #666;
		margin-bottom: 20rpx;
	}

	#author .wg-content .qf-content .cname,
	#author .wg-content .yj-content .cname {
		font-size: 26rpx;
		line-height: 32rpx;
		color: #666;
		margin-bottom: 20rpx;
	}

	#author .wg-content .qf-content .hd,
	#author .wg-content .yj-content .hd {
		display: flex;
	}

	#author .wg-content .qf-content .hd text,
	#author .wg-content .yj-content .hd text {
		flex: 1;
		text-align: center;
		color: #999;
		font-size: 26rpx;
		line-height: 36rpx;
	}

	#author .wg-content .qf-content .qf-item,
	#author .wg-content .yj-content .qf-item {
		display: flex;
	}

	#author .wg-content .qf-content .qf-item .money,
	#author .wg-content .yj-content .qf-item .money {
		flex: 1;
		color: #fcbb22;
		font-size: 30rpx;
		line-height: 42rpx;
		margin-top: 30rpx;
		text-align: center;
	}

	#author .wg-content .qf-content .qf-item .month,
	#author .wg-content .yj-content .qf-item .month {
		flex: 1;
		color: #666;
		font-size: 30rpx;
		line-height: 42rpx;
		margin-top: 30rpx;
		text-align: center;
	}

	#author .wg-content .qf-content .qf-item .object,
	#author .wg-content .yj-content .qf-item .object {
		flex: 1;
		color: #666;
		font-size: 30rpx;
		line-height: 42rpx;
		margin-top: 30rpx;
		text-align: center;
	}

	#author .wg-content .total {
		text-align: right;
	}

	#author .wg-content .total .tx1 {
		font-size: 26rpx;
		line-height: 36rpx;
		color: #999;
	}

	#author .wg-content .total .tx2 {
		font-size: 32rpx;
		color: #333;
		line-height: 44rpx;
		font-weight: 600;
	}
</style>