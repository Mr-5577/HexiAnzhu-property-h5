<template>
	<view>
		<!-- 顶部 -->
		<view class="main-header">
			<view class="main-project  uni-ellipsis">
				<view class="uni-font-32" @click="getNav('my-house')">
					<text v-show="hasLogin === false">请登录</text>
					<text v-show="hasLogin === true && hasBoundHouse === false">请绑定房产</text>
					<view v-show="hasLogin === true && hasBoundHouse === true && myHouse.ownerInfo.villagename">
						<image src="/static/images/addr.png" mode="aspectFit"
							style="width: 30upx;height: 30upx;margin-right: 10upx;vertical-align: middle;"></image>
						<text
							style="vertical-align: middle;font-weight: 600;">{{ myHouse.ownerInfo.villagename }}</text>
					</view>
				</view>
			</view>
			<!-- #ifdef APP-PLUS -->
			<view class="uni-cell-10 main-message" @click="getNav('message')">
				<image :src="message" mode="aspectFit" class="main-message-icon"></image>
			</view>
			<!-- #endif -->
		</view>
		<s-pull-scroll ref="pullScroll" :pullDown="pullDown" :top="150" downLoadingText="正在刷新..." :enablePullUp="false">
			<view class="main">
				<view class="main-content">
					<view style="margin: 0 20upx 20upx;">
						<!-- 轮播图 -->
						<view class="main-banner">
							<swiper class="swiper" :indicator-dots="indicatorDots" :autoplay="autoplay"
								:interval="interval" :duration="duration">
								<swiper-item v-for="(item, index) in banners" :key="index">
									<image :src="item" mode="widthFix"></image>
								</swiper-item>
							</swiper>
						</view>
						<!-- 菜单按钮 -->
						<view class="main-grad-8">
							<uni-grid :column="4" :highlight="true">
								<uni-grid-item v-for="(item, index) in list" :key="index" style="margin-top: 20upx;">
									<view @click="getItemNav(item)">
										<view class="uni-flex-center">
											<image :src="item.image" class="image" mode="aspectFill" />
										</view>
										<view class="text" style="text-align: center;">{{ item.name }}</view>
									</view>
								</uni-grid-item>
							</uni-grid>
						</view>
					</view>
				</view>
				<!-- 通知公告 -->
				<view class="notice-wrapper">
					<view class="notice-title">通知公告</view>
					<view class="notice-content">
						<view class="notice-item">
							<text class="text" v-if="noticeList" @click="noticeDetail">{{ noticeList.name }}</text>
							<text class="text" v-else>暂无新的通知公告</text>
						</view>
					</view>
				</view>
				<!-- 我的管家 -->
				<view class="uni-flex-center" style="margin: 20upx;background-color: #fff;border-radius: 10upx;"
					v-if="housekeeper">
					<view class="housekeeper uni-cell-90 uni-flex-btw" @click="toHousekeeper">
						<view class="uni-cell-20 uni-flex-center">
							<image :src="housekeeprImg" mode="aspectFit" class="housekeeper-header"></image>
						</view>
						<view class="uni-cell-30 uni-flex-center" style="text-align: left">
							<view style="height: 100upx;">
								<view class="uni-font-36" style="color: #333;font-weight: 500;">
									{{ housekeeper.realname }}
								</view>
								<view class="uni-font-28" style="color: #ccc;">您的专属管家</view>
							</view>
						</view>
						<view class="uni-cell-20"></view>
						<view class="uni-cell-30 uni-flex-center">
							<view class="housekeeper-btn">呼叫管家</view>
						</view>
					</view>
				</view>
				<!-- 为你推荐部分 -->
				<view class="recommend" v-if="showGoods && recommendList.length > 0">
					<view class="title">为你推荐</view>
					<view class="recd-wrapper">
						<view class="recd-item" v-for="(item, index) in recommendList" :key="index"
							@click="goodsClick(item)">
							<image :src="item.cover_pic" mode="aspectFill"></image>
							<view class="name">{{ item.name }}</view>
							<text class="text1">已售{{ item.virtual_sales }}</text>
							<text class="text2">/</text>
							<text class="text3">剩余{{ item.goods_num }}</text>
							<view class="price-car">
								<text class="current">￥{{ item.purchase_price }}</text>
								<text class="old">￥{{ item.original_price }}</text>
								<uni-icons type="cart" class="cart"></uni-icons>
							</view>
						</view>
					</view>
				</view>
				<view class="uni-flex-center">
					<view class="main-topic uni-cell-90">
						<view class="title"></view>
					</view>
				</view>
				<!-- 更新modal -->
				<view @touchmove.stop.prevent="moveHandle">
					<yomol-upgrade :type="upgradeType" :url="upgradeUrl" title="发现新版本" :content="upgradeContent"
						ref="yomolUpgrade"></yomol-upgrade>
				</view>
				<li-toast :showToast="showToast"></li-toast>
			</view>
		</s-pull-scroll>
	</view>
</template>
<script>
	import uniGrid from '@/components/uni-grid/uni-grid.vue';
	import uniGridItem from '@/components/uni-grid-item/uni-grid-item.vue';
	import yomolUpgrade from '@/components/yomol-upgrade/yomol-upgrade.vue';
	import liToast from '@/components/li-toast/li-toast.vue';
	import sPullScroll from '@/components/s-pull-scroll';

	export default {
		components: {
			uniGrid,
			uniGridItem,
			yomolUpgrade,
			liToast,
			sPullScroll
		},
		data() {
			return {
				showToast: false,
				/*图片轮播*/
				indicatorDots: true,
				autoplay: true,
				interval: 5000,
				duration: 500,
				noticeList: '',
				banners: ['/static/img/main/banner.jpg'],
				service: [{
						img: '/static/img/main/78761498124328542.png',
						title: '电子礼品卡',
						mark: '家乐福9折'
					},
					{
						img: '/static/img/main/78761498124328542.png',
						title: '手机维修',
						mark: '手机维修'
					},
					{
						img: '/static/img/main/72581498124372327.png',
						title: '滴滴出行',
						mark: '滴滴出行3.0'
					}
				],
				list: [],
				upgradeType: 'pkg', //pkg 整包 wgt 升级包
				upgradeContent: '', //更新内容
				upgradeUrl: '', //更新地址
				housekeeprImg: '/static/img/header-img.png',
				housekeeper: '',
				myHouse: {
					ownerInfo: {
						villagename: ''
					}
				},
				// 是否显示商品列表
				showGoods: false,
				// 推荐商品数据列表
				recommendList: []
			};
		},
		methods: {
			// 刷新
			refresh() {
				this.$nextTick(() => {
					this.$refs.pullScroll.refresh();
				});
			},
			getSetting() {
				if (!this.list.length) {
					this.$api.setting({}, res => {
						if (res.code == 1) {
							// 按照后端返回sort大小排序
							for (let i = 0; i < res.data.length; i++) {
								for (let p = 0; p < res.data.length; p++) {
									res.data[p].sort == i + 1 ? this.list.push(res.data[p]) : ''
								}
							}
						}
					});
				}
			},

			// 下拉刷新
			pullDown(pullScroll) {
				this.getData(pullScroll);
				this.getIndex();
				// 获取商品数据
				this.$api.getGoods({}, res => {
					this.recommendList = res.data;
					this.showGoods = res.is_show == 1 ? true : false;
				});
			},
			moveHandle() {},
			getNav(url) {
				this.$Router.push({
					name: url
				});
			},
			getItemNav(item) {
				let _this = this;
				if (item.is_outside == 1) {
					uni.navigateToMiniProgram({
						appId: item.appid,
						path: item.url,
						success(res) {
							console.log('跳转成功！');
						}
					});
					return;
				} else if (item.url) {

					// uni.navigateTo({
					// 	url: '/' + item.url
					// })
					this.$Router.push({
						path: '/' + item.url,
						query: {
							id: item.id
						}
					});


				} else {
					uni.showToast({
						icon: 'none',
						title: '熬夜开发中，请耐心等待！'
					});
					return;
				}

			},
			noticeDetail() {
				if (this.noticeList.id) {
					this.$Router.push({
						name: 'notice-detail',
						params: {
							id: this.noticeList.id
						}
					});
				}
			},
			toHousekeeper() {
				this.$Router.push({
					name: 'housekeeper',
					params: {
						id: this.housekeeper.uid
					}
				});
			},
			getData(pullScroll) {
				let data = {};
				this.$api.userCenter(data, res => {
					if(res.code == 1){
						this.myHouse = res.data;
						this.$store.commit('setMyHouse', res.data);
					}
					pullScroll.success();
				});
			},
			/*
			 * 检测版本升级
			 */
			checkVersionClick() {
				// 获取版本信息
				plus.runtime.getProperty(plus.runtime.appid, widgetInfo => {
					var platform = uni.getSystemInfoSync().platform;
					let versionCode = widgetInfo.versionCode;
					let data = {
						type: 2
					};
					if (platform == 'android') {
						data.type = 1;
						this.$api.downLoadApp(data, res => {
							if (versionCode < res.data.bb_code) {
								this.upgradeType = 'pkg';
								this.upgradeContent = '更新了新版本';
								this.upgradeUrl = res.data.download_url;
								this.$refs.yomolUpgrade.show();
							}
						});
					} else {
						this.$api.downLoadApp(data, res => {
							if (versionCode < res.data.bb_code) {
								this.upgradeType = 'ios';
								this.upgradeContent = '更新了新版本';
								this.upgradeUrl = res.data.download_url;
							}
						});
					}
				});
			},
			getIndex() {
				let data = {};
				this.$api.homeIndex(data, res => {
					this.housekeeper = res.data.stewards && res.data.stewards.length > 0 ? res.data.stewards[0] :
						'';
					this.noticeList = res.data.circular;
				});
			},
			// 点击商品跳转惠选商品页
			goodsClick(good) {
				uni.navigateToMiniProgram({
					appId: 'wxb828b2bc144de444',
					path: `pages/goods/goods?id=${good.id}`,
					success(res) {
						console.log('跳转成功！');
					}
				});
			}
		},
		async onShow() {
			let _this = this;
			if (this.$store.state.login_token) {
				// 获取商品数据
				this.$api.getGoods({}, res => {
					this.recommendList = res.data;
					this.showGoods = res.is_show == 1 ? true : false;
				});
				this.$api.userCenter({}, res => {
					if (res.code == 1) {
						this.myHouse = res.data;
						this.$store.commit('setMyHouse', res.data);
						this.getIndex();
						this.getSetting();
					}
				});
			} else {
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
									_this.getIndex();
									_this.getSetting();
									//检测更新
								});
							} 
						})
					}
				})
			}
			// #ifdef APP-PLUS
			this.checkVersionClick();
			// #endif
		},
		onLoad() {
			//检测是否有登录token
			try {
				const loginToken = uni.getStorageSync('loginToken');
				if (loginToken) {
					this.$store.commit('loginToken', loginToken);
					//首页数据
					// this.getIndex();
				}
				const userInfo = uni.getStorageSync('userInfo');
				if (userInfo) {
					this.$store.commit('setHasLogin', true);
				}
			} catch (e) {
				// error
			}
		},
		computed: {
			// myHouse() {
			// 	return this.$store.state.myHouse;
			// },
			hasBoundHouse() {
				return this.$store.state.hasBoundHouse;
			},
			hasLogin() {
				return this.$store.state.hasLogin;
			},
			message() {
				let _this = this;
				//接收到推送消息
				if (this.$store.state.pushMessage) {
					//消息提示
					_this.showToast = true;
					setTimeout(() => {
						_this.showToast = false;
					}, 5000);
					return '/static/img/message-active.png';
				} else {
					return '/static/img/message.png';
				}
			}
		}
	};
</script>

<style lang="scss">
	@import './index.css';

	.recommend {
		margin-top: 20rpx;
		padding: 0 24rpx;

		.title {
			padding: 20rpx 0;
			font-size: 36rpx;
			color: #333;
			line-height: 50rpx;
			font-weight: 600;
		}

		.recd-wrapper {
			display: flex;
			justify-content: space-between;
			flex-wrap: wrap;

			.recd-item {
				width: 340rpx;
				background-color: #fff;
				padding-bottom: 80rpx;
				margin-bottom: 20rpx;
				border-radius: 12rpx;
				position: relative;

				image {
					width: 100%;
					height: 280rpx;
				}

				.name {
					font-size: 28rpx;
					line-height: 40rpx;
					color: #333;
					margin-top: 10rpx;
					padding: 0 10rpx;
				}

				.text1,
				.text2,
				.text3 {
					font-size: 24rpx;
					line-height: 36rpx;
					margin-top: 6rpx;
					color: #999;
				}

				.text1 {
					margin-left: 10rpx;
				}

				.text2 {
					color: #ebebeb;
					margin: 0 4rpx;
				}

				.text3 {
					color: #666;
				}

				.price-car {
					position: absolute;
					bottom: 20rpx;
					left: 0;
					padding: 0 10rpx;
					width: 100%;
					box-sizing: border-box;

					.current {
						font-size: 32rpx;
						color: #f6692b;
						line-height: 44rpx;
					}

					.old {
						font-size: 24rpx;
						line-height: 36rpx;
						color: #ccc;
						text-decoration: line-through;
						margin-left: 16rpx;
					}

					.cart {
						position: absolute;
						top: -6rpx;
						right: 10rpx;
						font-size: 36rpx !important;
						color: #ffbc19 !important;
					}

					.cart .uni-icons {
						font-size: 36rpx !important;
						color: #ffbc19 !important;
					}
				}
			}
		}
	}
</style>