<template>
	<view class="home-page">
		<!-- 背景图片 -->
		<image v-show="showBgImage" class="page-bg" src="/static/img/main/page-bg.jpg" mode="aspectFill" />
		<!-- 自定义导航栏顶部 -->
		<view class="main-header">
			<view class="main-project  uni-ellipsis">
				<view class="uni-font-32" @click="toTagetPage">
					<text style="color: #fae6d7ff" v-show="hasLogin === false">请登录</text>
					<text style="color: #fae6d7ff" v-show="hasLogin === true && hasBoundHouse === false">请绑定房产</text>
					<view v-show="hasLogin === true && hasBoundHouse === true && myHouse.ownerInfo.villagename">
						<image src="/static/img/main/community.png" mode="aspectFit"
							style="width: 35upx;height: 40upx;margin-right: 10upx;vertical-align: middle;"></image>
						<text
							style="vertical-align: middle;font-weight: 600;color: #fae6d7ff;font-size: 26upx;">{{ myHouse.ownerInfo.villagename }}</text>
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
								:interval="interval" :duration="duration" :circular="true">
								<swiper-item v-for="(item, index) in banners" :key="index">
									<image :src="item" mode="widthFix"></image>
								</swiper-item>
							</swiper>
						</view>
						<!-- 通知公告 -->
						<view class="notice-wrapper">
							<view class="notice-title">通知公告</view>
							<view class="notice-content">
								<view class="notice-list">
									<view class="notice-item" v-if="noticeList.length > 0" :key="currentIndex"
										:class="{ sliding: isSliding }" @click="noticeDetail">
										<text class="notice-text">{{ currentNotice.name || '' }}</text>
									</view>
									<text class="notice-text" v-else>暂无新的通知公告</text>
								</view>
								<view class="more-notice" @click="toNoticeList">
									<uni-badge v-if="noticeList.length > 1" :text="noticeList.length.toString()"
										type="error" size="small"></uni-badge>
									<uni-icons type="arrowright" size="20" style="line-height: 1.3;"></uni-icons>
								</view>
							</view>
						</view>
						<!-- 缴费、报修 -->
						<view class="fast-card">
							<view class="card-content" @click="toPay">
								<view class="card-left">
									<text class="amount">￥{{ paymentAmount }}</text>
									<text class="pending-pay">待缴金额</text>
									<text class="pay-now">立即缴费</text>
								</view>
								<image src="/static/img/main/payment.png" class="right-img" mode="aspectFill" />
							</view>
							<view class="card-content" @click="toRepair">
								<view class="card-right">
									<text class="repair-text">报事报修</text>
									<text class="online-repair">线上快速报</text>
								</view>
								<image src="/static/img/main/repair.png" class="right-img" mode="aspectFill" />
							</view>
						</view>
					</view>
				</view>
				<!-- 菜单按钮 -->
				<view class="main-grad-8">
					<view class="custom-grid">
						<view class="custom-grid-item" v-for="(item, index) in gridList" :key="index"
							@click="getItemNav(item)">
							<view class="grid-item-content">
								<image :src="item.image" class="grid-item-image" mode="aspectFill" />
								<view class="grid-item-text">{{ item.name }}</view>
							</view>
						</view>
					</view>
				</view>
				<!-- 我的管家 -->
				<view class="my-butler" v-if="housekeeper">
					<text class="butler-title">呼叫管家</text>
					<view class="housekeeper uni-cell-90 uni-flex-btw" @click="toHousekeeper">
						<view class="uni-cell-20 uni-flex-center">
							<image src="/static/img/main/avatar.png" mode="aspectFit" class="housekeeper-header">
							</image>
						</view>
						<view class="uni-cell-30 uni-flex-center" style="text-align: left">
							<view style="height: 100upx;">
								<view class="uni-font-36" style="color: #333;font-weight: 500;">
									{{ housekeeper.realname || '' }}
								</view>
								<view class="uni-font-28" style="color: #c6bebd;">您的专属管家</view>
							</view>
						</view>
						<view class="uni-cell-20"></view>
						<view class="uni-cell-30 uni-flex-center">
							<view class="housekeeper-btn">呼叫管家</view>
						</view>
					</view>
				</view>
				<!-- 热门活动 -->
				<view class="promotion" v-if="activityList && activityList.length > 0">
					<test class="promotion-title">热门活动</test>
					<view class="promotion-list">
						<view class="promotion-item" v-for="(item,index) in activityList" :key="index"
							@click="toActivityDetail(item)">
							<image :src="item.head_pic" mode="aspectFit" class="promotion-img"></image>
							<text class="promotion-description">{{ item.title }}</text>
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
		<!-- 广告弹窗 -->
		<view v-if="showAdPopup && adData" class="ad-popup-mask">
			<view class="ad-popup-content">
				<view class="ad-image-container">
					<!-- mode="aspectFit" 自动保持比例并完整显示 -->
					<image :src="adData.window_pic" mode="aspectFit" @click="handleAdClick" class="ad-image" />
				</view>
				<view class="ad-close" @click="closeAd">我知道了</view>
			</view>
		</view>
		<!-- 底部自定义tabbar -->
		<mini-tabbar :active-index="0" />
	</view>
</template>
<script>
	import uniGrid from '@/components/uni-grid/uni-grid.vue';
	import uniGridItem from '@/components/uni-grid-item/uni-grid-item.vue';
	import yomolUpgrade from '@/components/yomol-upgrade/yomol-upgrade.vue';
	import liToast from '@/components/li-toast/li-toast.vue';
	import sPullScroll from '@/components/s-pull-scroll';
	import MiniTabbar from '@/components/mini-tabbar/mini-tabbar.vue';

	export default {
		components: {
			uniGrid,
			uniGridItem,
			yomolUpgrade,
			liToast,
			sPullScroll,
			MiniTabbar
		},
		data() {
			return {
				showToast: false,
				/*图片轮播*/
				indicatorDots: true,
				autoplay: true,
				interval: 5000,
				duration: 500,
				banners: ['/static/img/main/banner1.jpg', '/static/img/main/banner2.jpg'],
				gridList: [{
					appid: "wx045946249448b4a9",
					id: 34,
					image: "/static/img/main/complaint.png",
					is_outside: 0,
					name: "投诉建议",
					url: "pages/main/maintenance/complaint",
					vid: 1001
				}, {
					id: 15,
					image: "/static/img/main/renovation.png",
					is_outside: 0,
					name: "找装修",
					url: "pages/main/service/integrated-service",
				}, {
					id: 16,
					image: "/static/img/main/service.png",
					is_outside: 0,
					name: "找服务",
					url: "pages/main/service/integrated-service",
				}, {
					id: 2003,
					image: "/static/img/main/convenience.png",
					is_outside: 0,
					name: "便民信息",
					url: "",
				},],
				upgradeType: 'pkg', //pkg 整包 wgt 升级包
				upgradeContent: '', //更新内容
				upgradeUrl: '', //更新地址
				housekeeper: '', // 管家信息
				myHouse: {
					ownerInfo: {
						villagename: ''
					}
				},
				// 是否显示商品列表
				showGoods: false,
				// 推荐商品数据列表
				recommendList: [],
				showBgImage: true, // 是否显示首页背景图
				noticeList: [], // 通知公告列表
				currentIndex: 0, // 当前显示的通知公告索引
				timer: null, // 定时器
				isSliding: false, // 动画状态
				activityList: [], // 热门活动列表
				showAdPopup: false, // 广告弹窗显示状态
				adData: null, // 广告数据
				paymentAmount: 0, // 代缴金额
			};
		},
		methods: {
			// 开始滚动
			startScroll() {
				if (this.noticeList.length <= 1) return

				// 清除现有定时器
				this.stopScroll()

				// 设置新定时器
				this.timer = setInterval(() => {
					this.nextNotice()
				}, 3000)
			},

			// 切换到下一条
			nextNotice() {
				this.isSliding = true

				setTimeout(() => {
					this.currentIndex = (this.currentIndex + 1) % this.noticeList.length
					this.isSliding = false
				}, 300)
			},

			// 停止滚动
			stopScroll() {
				if (this.timer) {
					clearInterval(this.timer)
					this.timer = null
				}
			},
			async toTagetPage() {
				if (this.hasLogin) {
					this.$Router.push({
						name: 'my-house'
					});
				} else {
					this.$Router.push({
						name: 'login'
					});
				}
			},
			// 刷新
			refresh() {
				this.$nextTick(() => {
					this.$refs.pullScroll.refresh();
				});
			},
			// 应用模块
			getSetting() {
				if (!this.gridList.length) {
					this.$api.setting({}, res => {
						if (res.code == 1) {
							// 按照后端返回sort大小排序
							const data = res.data || []
							this.gridList = data.sort((a, b) => {
								const sortA = Number(a.sort) || 0;
								const sortB = Number(b.sort) || 0;
								return sortA - sortB; // 升序排序
							});
						}
					});
				}
			},

			// 下拉刷新
			pullDown(pullScroll) {
				this.getUserCenter(pullScroll);
				// 获取商品数据
				this.$api.getGoods({}, res => {
					this.recommendList = res.data;
					this.showGoods = res.is_show == 1 ? true : false;
				});
				this.getHomeData();
			},
			moveHandle() {},
			getNav(url) {
				this.$Router.push({
					name: url
				});
			},
			getItemNav(item) {
				if (item.is_outside == 1) {
					// 打开另一个小程序
					uni.navigateToMiniProgram({
						appId: item.appid, // 必填，要打开的小程序 appId
						path: item.url, // 打开的页面路径，如果为空则打开首页
						success(res) {
							console.log('跳转成功！');
						}
					});
					return;
				} else if (item.url) {
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
				}
			},
			noticeDetail() {
				if (this.currentNotice.id) {
					this.$Router.push({
						name: 'notice-detail',
						params: {
							id: this.currentNotice.id
						}
					});
				}
			},
			toNoticeList() {
				this.$Router.push({
					name: 'notice',
					params: {}
				});
			},
			toPay() {
				this.$Router.push({
					name: 'choose-type',
					params: {
						id: 100
					}
				});
			},
			toRepair() {
				this.$Router.push({
					name: 'maintenance',
					params: {
						id: 12
					}
				});
			},
			toHousekeeper() {
				this.$Router.push({
					name: 'housekeeper',
					params: {
						id: this.housekeeper.uid
					}
				});
			},
			toActivityDetail(item) {
				uni.setStorageSync('activityData', item);
				// 传递ID用于标识
				this.$Router.push({
					name: 'activity-detail',
					params: {
						id: item.id
					}
				});
			},
			getUserCenter(pullScroll) {
				this.$api.userCenter({}, res => {
					if (res.code == 1) {
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
			// 通知公告、物业管家、热门活动信息
			getHomeData() {
				// 物业管家
				this.$api.homeIndex({}, res => {
					this.housekeeper = res.data.stewards && res.data.stewards.length > 0 ? res.data.stewards[0] :
						'';
				});
				// 代缴费用信息
				if (this.$store.state.myHouse && this.$store.state.myHouse.ownerInfo.roomid) {
					const params = {
						roomid: this.$store.state.myHouse.ownerInfo.roomid
					}
					this.$api.getRoomsMaterial(params, res => {
						if (res.code === 1) {
							const money = res.data.summoney || 0;
							this.paymentAmount = money.toFixed(2)
						} else {
							this.paymentAmount = 0;
						}
					});
				}
				// 通知公告列表
				this.$api.circularList({}, res => {
					if (res.code == 1) {
						this.noticeList = res.data || [];
						if (this.noticeList.length > 1) {
							this.startScroll()
						}
					}
				});
				// 热门活动列表
				this.$api.getActivityList({}, res => {
					if (res.code === 1) {
						const dataList = res.data || []
						let httpIp = this.qiniuDatas?.http_domain || '';
						if (httpIp.startsWith('http://')) {
							httpIp = httpIp.replace('http://', 'https://')
						}
						this.activityList = dataList.map((item) => {
							return {
								...item,
								head_pic: domain ? `${domain}${item.head_pic}` : item.head_pic,
								window_pic: domain ? `${domain}${item.window_pic}` : item.window_pic,
							}
						})

						// 检查广告弹窗
						this.checkAdPopup();
					}
				});
			},
			// 检查广告弹窗
			checkAdPopup() {
				// 条件检查：登录 + 未展示过广告 + 有广告数据
				if (!this.$store.state.login_token) return;
				if (this.$store.state.hasShownAdInThisSession) return;
				// 数据后端处理，会把要展示的弹窗数据放在第一条，如果第一条数据的is_popup值为1则进行活动弹窗
				const [firstData] = this.activityList || []
				if (firstData && firstData.is_popup === 1) {
					this.adData = firstData;
					// 延迟展示，页面先渲染
					setTimeout(() => {
						this.showAdPopup = true;
						// 标记已展示活动弹窗
						this.$store.commit('setHasShownAd', true);
					}, 1000);
				}
			},
			// 关闭广告
			closeAd() {
				this.showAdPopup = false;
			},
			// 点击广告跳转
			handleAdClick() {
				if (!this.adData || !this.adData.link_url) return;

				// 跳转到广告链接
				uni.navigateTo({
					url: this.adData.link_url
				});

				// 打开另一个小程序
				// uni.navigateToMiniProgram({
				// 	appId: '', // 必填，要打开的小程序 appId
				// 	path: '', // 打开的页面路径，如果为空则打开首页
				// 	success(res) {
				// 		console.log('跳转成功！');
				// 	}
				// });
				// 关闭弹窗
				this.closeAd();
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
			},
			// 获取七牛云凭证
			getUpToken() {
				this.$api.upToken({}, (res) => {
					this.$store.commit("setQiniuData", res.data);
				});
			},
		},
		async onShow() {
			this.showBgImage = true
			if (this.$store.state.login_token) {
				// 获取商品数据
				this.$api.getGoods({}, res => {
					this.recommendList = res.data;
					this.showGoods = res.is_show == 1 ? true : false;
				});
				// 用户信息、房产信息
				this.$api.userCenter({}, async (res) => {
					if (res.code == 1) {
						this.myHouse = res.data;
						this.$store.commit('setMyHouse', res.data);
						// 获取七牛云凭证
						this.getUpToken();
						// 等待1.5秒
						await new Promise(resolve => setTimeout(resolve, 1500))
						this.getHomeData();
						this.getSetting();
					}
				});
			} else {
				// let _this = this;
				// let codeRes = await uni.login()
				// await this.$api.getUserOpenid({
				// 	code: codeRes[1].code
				// }, res => {
				// 	if (res.code == 1) {
				// 		_this.$api.login_by_openid_xcx({
				// 			cache_name: res.data
				// 		}, res => {
				// 			if (res.code == 1) {
				// 				uni.setStorageSync('loginToken', res.data);
				// 				_this.$store.commit('loginToken', res.data);
				// 				_this.$api.userCenter({}, res => {
				// 					_this.myHouse = res.data;
				// 					_this.$store.commit('setMyHouse', res.data);
				// 					_this.getHomeData();
				// 					_this.getSetting();
				// 					//检测更新
				// 				});
				// 			}
				// 		})
				// 	}
				// })
				uni.showModal({
					title: '未登录',
					cancelColor: '#898989',
					cancelText: '取消',
					confirmColor: '#fe845e',
					confirmText: '去登录',
					content: '是否前往登录？',
					success(resp) {
						if (resp.confirm) {
							uni.navigateTo({
								url: '/pages/login/login'
							})
						}
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
				}
				const userInfo = uni.getStorageSync('userInfo');
				if (userInfo) {
					this.$store.commit('setHasLogin', true);
				}
			} catch (e) {
				// error
			}
		},
		onHide() {
			this.showBgImage = false
			this.stopScroll()
		},
		onUnload() {
			this.stopScroll()
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
			},
			currentNotice() {
				return this.noticeList[this.currentIndex] || null
			},
			qiniuDatas() {
				return this.$store.state.qiniuData;
			},
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