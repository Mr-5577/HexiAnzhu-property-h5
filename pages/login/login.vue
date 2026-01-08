<template>
	<view class="content">
		<!-- <template>
			<view class="forget-bg">
				<view class="forget-card">
					<view class="forget-input forget-margin-b"><input type="number" placeholder="请输入您的手机号"
							v-model="tel" /></view>
					<view class="forget-input forget-margin-b">
						<view class="verify-left"><input type="number" placeholder="请输入验证码" v-model="code" /></view>
						<view class="verify-right" v-show="show"><button class="verify-btn" plain
								@click="getCode">获取验证码</button></view>
						<view class="verify-right" v-show="!show">
							<button class="verify-btn-active">{{ count }} s后重试</button>
						</view>
					</view>
				</view>
			</view>
		</template>
		<view class="oauth-row" v-if="hasProvider" v-bind:style="{ top: positionTop + 'px' }">
			<view class="oauth-image" v-for="provider in providerList" :key="provider.value">
				<image :src="provider.image" @tap="oauth(provider.value)"></image>
			</view>
		</view> -->
		<view class="btn-wrapper">
			<!-- <view class="forget-btn"><button class="landing" plain :disabled="code === ''"
					@click="bindLogin">登录</button></view> -->
			<!-- #ifdef MP-WEIXIN -->
			<view class="forget-btn">
				<button class="wx-btn" type="primary" :disabled="!allowLogin" open-type="getPhoneNumber"
					@getphonenumber="getphonenumber">
					<span class="text">用户快速登录</span>
				</button>
			</view>
			<!-- #endif -->
		</view>
	</view>
</template>

<script>
	import mInput from '@/components/m-input.vue';

	export default {
		components: {
			mInput
		},
		data() {
			return {
				providerList: [],
				hasProvider: false,
				tel: '',
				code: '',
				positionTop: 0,
				globalData: {},
				userInfo: {},
				show: true,
				imei: '', //设备唯一标识
				timestamp: '',
				count: 0,
				m_cid: '',
				allowLogin: true,
			};
		},
		async onLoad() {
			this.allowLogin = false;
			let _this = this;
			this.timestamp = new Date().getTime();
			// #ifdef MP-WEIXIN
			_this.imei = '121243434234231';

			// #endif
			// #ifdef APP-PLUS
			this.m_cid = plus.push.getClientInfo().clientid;
			plus.device.getOAID({
				success(e) {
					_this.imei = e.oaid;
				},
				fail(e) {}
			});
			// #endif
			let codeRes = await uni.login()
			await this.$api.getUserOpenid({
				code: codeRes[1].code
			}, res => {
				if (res.code == 1) {
					_this.$api.login_by_openid_xcx({
						cache_name: res.data
					}, res => {
						if (res.code == 1) {
							uni.setStorageSync('loginToken', res.data);
							_this.$store.commit('loginToken', res.data);
							_this.$api.userCenter({}, res => {
								_this.myHouse = res.data;
								_this.$store.commit('setMyHouse', res.data);
								let pages = getCurrentPages();
								if (pages[pages.length - 2]) {
									uni.navigateBack()
								} else {
									if (_this.$store.state.hasLogin) {
										_this.$Router.replaceAll({
											name: 'index'
										});
									}
								}
							});
						}
					})
				}
			})
			setTimeout(() => {
				this.allowLogin = true;
			}, 1000)
		},
		methods: {
			//获取手机号
			async getphonenumber(e) {
				this.allowLogin = false;
				let _this = this;
				let cache_name = ''
				let codeRes = await uni.login()
				await this.$api.getUserOpenid({
					code: codeRes[1].code
				}, res => {
					if (res.code == 1) {
						cache_name = res.data
						let data = {
							code: e.detail.code,
							cache_name: cache_name
						};
						_this.$api.login_xcx(data, res => {
							try {
								uni.setStorageSync('loginToken', res.data);
								_this.$store.commit('loginToken', res.data);
							} catch (e) {
								//TODO handle the exception
							}
							uni.showLoading({
								title: '正在登录'
							})

							setTimeout(() => {
								uni.hideLoading();
								let pages = getCurrentPages();
								if (pages[pages.length - 2]) {
									uni.navigateBack()
								} else {
									if (_this.$store.state.hasLogin) {
										_this.$Router.replaceAll({
											name: 'index'
										});
									}
								}
								this.allowLogin = true;
							}, 1000)

						});
					}
				})
			},

			// 获取验证码
			getCode() {
				if (!this.$uitls.isPhone(this.tel)) {
					return;
				}
				let data = {
					tel: this.tel
				};
				uni.showLoading({
					title: '正在获取验证码'
				});
				this.$api.sendSms(data, res => {
					uni.showToast({
						icon: 'none',
						title: res.msg
					});
					this.timers();
				});
			},

			//倒计时
			timers() {
				const TIME_COUNT = 120;
				if (!this.timer) {
					this.count = TIME_COUNT;
					this.show = false;
					this.timer = setInterval(() => {
						if (this.count > 0 && this.count <= TIME_COUNT) {
							this.count--;
						} else {
							this.show = true;
							clearInterval(this.timer);
							this.timer = null;
						}
					}, 1000);
				}
			},

			// 获取服务供应商数据
			initProvider() {
				const filters = ['weixin'];
				uni.getProvider({
					service: 'oauth',
					success: res => {
						if (res.provider && res.provider.length) {
							for (let i = 0; i < res.provider.length; i++) {
								if (~filters.indexOf(res.provider[i])) {
									if (res.provider[i] === 'weixin') {
										this.providerList.push({
											value: res.provider[i],
											image: '/static/img/' + res.provider[i] + '.png'
										});
									}
								}
							}
							this.hasProvider = true;
						}
					},
					fail: err => {
						console.error('获取服务供应商失败：' + JSON.stringify(err));
					}
				});
			},

			initPosition() {
				/**
				 * 使用 absolute 定位，并且设置 bottom 值进行定位。软键盘弹出时，底部会因为窗口变化而被顶上来。
				 * 反向使用 top 进行定位，可以避免此问题。
				 */
				this.positionTop = uni.getSystemInfoSync().windowHeight - 100;
			},

			// 点击登录按钮
			bindLogin() {
				let _this = this;
				if (!this.$uitls.isPhone(this.tel)) {
					return;
				}
				if (!this.code) {
					uni.showToast({
						icon: 'none',
						title: '请输入验证码'
					});
					return;
				}
				// #ifdef APP-PLUS

				if (this.$store.state.wxUserInfo.openId) {
					var data = {
						timestamp: new Date().getTime(),
						appkey: this.$store.state.appkey,
						tel: this.tel,
						imei: this.imei,
						code: this.code,
						m_cid: this.m_cid,
						openid: this.$store.state.wxUserInfo.openId
					};
				} else {
					var data = {
						timestamp: new Date().getTime(),
						appkey: this.$store.state.appkey,
						tel: this.tel,
						imei: this.imei,
						code: this.code,
						m_cid: this.m_cid
					};
				}
				uni.showLoading({
					title: '正在登陆...'
				});
				this.$api.logins(data, res => {
					try {
						uni.setStorageSync('loginToken', res.data);
						this.$store.commit('loginToken', res.data);
					} catch (e) {
						//TODO handle the exception
					}

					if (this.$store.state.hasLogin) {
						this.$Router.replaceAll({
							name: 'index'
						});
					}
				});
				// #endif

				// #ifdef MP-WEIXIN
				wx.checkSession({
					success(e) {
						uni.login({
							provider: 'weixin',
							success(loginRes) {
								try {
									uni.setStorageSync('wxCode', loginRes.code);
									_this.loginWx(loginRes.code);
								} catch (e) {
									//TODO handle the exception
								}
							}
						});
					},
					fail(err) {
						//重新登录
						uni.login({
							provider: 'weixin',
							success(loginRes) {
								try {
									uni.setStorageSync('wxCode', loginRes.code);
									_this.loginWx(loginRes.code);
								} catch (e) {
									//TODO handle the exception
								}
							}
						});
					}
				});
				// #endif
			},

			loginWx(wxCode) {
				let data = {
					code: wxCode,
					tel: this.tel,
					telcode: this.code
				};
				uni.showLoading({
					title: '正在登陆...'
				});
				this.$api.login_xcx(data, res => {
					try {
						uni.setStorageSync('loginToken', res.data);
						this.$store.commit('loginToken', res.data);
					} catch (e) {
						//TODO handle the exception
					}
					let pages = getCurrentPages();
					if (this.$store.state.hasLogin) {
						this.$Router.replaceAll({
							name: 'index'
						});
					}
				});
			},

			oauth(value) {
				uni.login({
					provider: value,
					success: res => {
						uni.getUserInfo({
							provider: value,
							success: infoRes => {
								/**
								 * 实际开发中，获取用户信息后，需要将信息上报至服务端。
								 * 服务端可以用 userInfo.openId 作为用户的唯一标识新增或绑定用户信息。
								 */
								this.toMain(infoRes.userInfo);
							}
						});
					},
					fail: err => {
						uni.hideLoading();
						uni.showToast({
							icon: 'none',
							title: '授权登录失败：' + JSON.stringify(err.errMsg)
						});
					}
				});
			},

			toMain(userInfo) {
				this.$store.commit('loginWeChat', userInfo);
				if (this.$store.state.hasAuthorized) {
					this.login();
				} else {
					uni.navigateBack();
				}
			},

			login() {
				let data = {
					openid: this.$store.state.wxUserInfo.openId,
					appkey: this.$store.state.appkey,
					timestamp: this.timestamp,
					tel: this.tel,
					imei: this.imei,
					m_cid: this.m_cid
				};
				// if (!this.tel) {
				// 	uni.showToast({
				// 		icon: 'none',
				// 		title: '绑定手机号'
				// 	});
				// 	return;
				// }
				// if (!this.$uitls.isPhone(this.tel)) {
				// 	uni.showToast({
				// 		icon: 'none',
				// 		title: '请输入正确的手机号'
				// 	});
				// 	return;
				// }
				uni.showLoading({
					title: '正在登陆...'
				});
				this.$api.logins(data, res => {
					uni.setStorageSync('loginToken', res.data);
					this.$store.commit('loginToken', res.data);
					if (this.$store.state.hasLogin) {
						this.$Router.replaceAll({
							name: 'index'
						});
					}
				});
			}
		},

		onReady() {
			// #ifdef APP-PLUS
			this.initPosition();
			this.initProvider();
			// #endif
		}
	};
</script>

<style>
	.content {
		padding: 0 24upx;
		display: flex;
		justify-content: center;
		align-items: center;
		position: relative;
		height: 100vh;
	}

	.wx-btn {
		border-radius: 44upx;
		height: 84upx;
		line-height: 84upx;
	}

	.wx-btn i {
		height: 80upx;
		line-height: 80upx;
	}

	.verify-left {
		width: calc(100% - 260upx);
	}

	.verify-right {
		padding-left: 20upx;
		margin-top: 10upx;
	}

	.verify-btn {
		height: 80upx;
		line-height: 80upx;
		font-size: 28upx;
		width: 240upx;
		border-radius: 8upx;
		text-align: center;
		color: #ffffff !important;
		background-color: #ffcf5a !important;
		border: none !important;
	}

	.verify-btn:active {
		opacity: 0.6;
	}

	.verify-btn-active {
		height: 80upx;
		line-height: 80upx;
		font-size: 28upx;
		width: 240upx;
		border-radius: 8upx;
		text-align: center;
		color: #ffffff;
		background: #898989;
	}

	.verify-left,
	.verify-right {
		float: left;
	}

	.landing {
		height: 84upx;
		line-height: 84upx;
		border-radius: 44upx;
		font-size: 32upx;
		background-color: #ffcf5a !important;
		color: #fff !important;
		border: none !important;
	}

	.landing:active {
		opacity: 0.6;
	}

	.landing[aria-disabled='true'] {
		opacity: 0.6;
	}

	.forget-btn {
		padding: 10upx 20upx;
		margin-bottom: 30upx;
	}

	.forget-btn:last-child {
		margin-bottom: 80upx;
	}

	.forget-input input {
		background: #f2f5f6;
		font-size: 28upx;
		padding: 10upx 25upx;
		height: 82upx;
		line-height: 68upx;
		border-radius: 2.5rem;
	}

	.forget-margin-b {
		margin-bottom: 25upx;
	}

	.forget-input {
		padding: 10upx 20upx;
		overflow: auto;
	}

	.forget-card {
		background: #fff;
		border-radius: 12upx;
		padding: 60upx 25upx;
		box-shadow: 0 6upx 18upx rgba(0, 0, 0, 0.12);
		position: relative;
		margin-top: 20upx;
	}

	.action-row {
		display: flex;
		flex-direction: row;
		justify-content: center;
	}

	.action-row navigator {
		color: #007aff;
		padding: 0 20upx;
	}

	.oauth-row {
		display: flex;
		flex-direction: row;
		justify-content: center;
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
	}

	.oauth-image {
		width: 100upx;
		height: 100upx;
		border: 1upx solid #dddddd;
		border-radius: 100upx;
		margin: 0 40upx;
		background-color: #ffffff;
	}

	.oauth-image image {
		width: 60upx;
		height: 60upx;
		margin: 20upx;
	}

	.btn-wrapper {
		width: 100%;
	}

	.iconfont {
		margin: 0;
		height: 84upx !important;
		line-height: 84upx !important;
	}

	.text {
		padding-left: 10upx;
		font-size: 30upx;
		display: inline-block;
		vertical-align: top;
		line-height: 84upx;
	}
</style>