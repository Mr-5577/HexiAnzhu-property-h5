<template>
	<view class="housekeeper">
		<!-- 头像、介绍部分 -->
		<view class="header">
			<view class="avatar"><image :src="housekeeper.hpath ? '/static/images/avatar.png' : '/static/images/avatar.png'" mode="aspectFit"></image></view>
			<view class="user-name">{{ housekeeper.name }}</view>
			<view class="labels">
				<text class="lab1" v-if="housekeeper.birthday">{{ birthday(housekeeper) }}0后</text>
				<text class="lab2" v-if="housekeeper.intime">入职{{ inTimeWork(housekeeper.intime) }}年</text>
				<text class="lab3" v-if="housekeeper.stars">评分{{ housekeeper.stars }}</text>
			</view>
			<view class="btn-wrapper">
				<text class="hujiao" @click="call()">呼叫管家</text>
				<image @click="copyWexin" src="/static/images/weixin.png" mode="aspectFit"></image>
				<text class="evaluate" @click="addReview">评价TA</text>
			</view>
		</view>
		<!-- 住户评价、服务区域部分 -->
		<view class="content-wrapper">
			<uni-segmented-control :current="current" :values="items" :style-type="styleType" :active-color="activeColor" @clickItem="onClickItem" />
			<!-- 住户评价部分 -->
			<view class="eval" v-if="current == 0">
				<view v-if="userViews.length == 0" style="color: #ccc;text-align: center;">暂无数据！</view>
				<view class="eval-item" v-for="(item, index) in userViews" :key="index">
					<image src="/static/images/avatar.png" mode="aspectFit"></image>
					<view class="intro-wrapper">
						<view class="introduce">
							<text class="name">{{ item.username }}</text>
							<text class="date">{{ item.ctime }}</text>
							<view class="rate"><uni-rate :readonly="true" :value="item.score" :size="16" :margin="5" /></view>
						</view>
						<view class="eval-text">{{ item.content }}</view>
					</view>
				</view>
			</view>
			<!-- 服务区域部分 -->
			<view class="service-area" v-if="current == 1">
				<view v-if="housekeeper.servicearea.length == 0" style="color: #ccc;text-align: center;">暂无数据！</view>
				<view v-else>
					<view class="adr-wrapper">
						<uni-icons class="uicon" type="location-filled"></uni-icons>
						<text class="title">{{ housekeeper.villageinfo ? housekeeper.villageinfo.villagename : '无项目名' }}</text>
					</view>
					<view class="b-wrapper">
						<view class="b-item" v-for="(item, index) in housekeeper.servicearea" :key="index">{{ item }}</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
// 用户评价组件
import userReview from '@/components/user-review/user-review.vue';
import uniSegmentedControl from '@/components/uni-segmented-control/uni-segmented-control.vue';
import uniRate from '@/components/uni-rate/uni-rate.vue';
export default {
	components: {
		userReview,
		uniSegmentedControl,
		uniRate
	},
	data() {
		return {
			items: ['住户评价', '服务区域'],
			activeColor: '#ec4040',
			current: 0,
			styleType: 'text',
			mark: false,
			housekeeprImg: '/static/img/header-img.png',
			userViews: [],
			uid: '',
			housekeeper: ''
		};
	},
	onShow() {
		this.uid = this.$Route.query.id;
		this.getStewardInfo();
	},
	methods: {
		// 点击住户评价、服务区域切换处理
		onClickItem(index) {
			if (this.current !== index) {
				this.current = index;
			}
		},

		// 工作时间数据提取
		inTimeWork(intime) {
			let time = '';
			if (intime) {
				time = intime.substring(0, 4);
			}
			let nowYear = new Date().getFullYear();
			const housekeeprYear = nowYear - parseInt(time);
			return housekeeprYear;
		},

		// 几0后数据提取
		birthday(house) {
			let date = '';
			if (house.birthday) {
				date = house.birthday.substring(2, 3);
			}
			return date;
		},

		// 获取管家数据
		getStewardInfo() {
			let data = {
				id: this.uid
			};
			this.$api.keeperinfo(data, res => {
				this.housekeeper = res.data;
				this.getHousekeeperEvaluate();
			});
		},

		// 获取评价信息数据
		getHousekeeperEvaluate() {
			this.$api.housekeeperEvaluate({ id: this.uid }, res => {
				this.userViews = res.data;
			});
		},

		// 联系管家
		call() {
			if (!this.housekeeper.mobile) {
				uni.showToast({
					icon: 'none',
					title: '暂无手机号'
				});
				return;
			}
			uni.makePhoneCall({
				phoneNumber: this.housekeeper.mobile
			});
		},

		// 跳转评价管家页面
		addReview() {
			this.$Router.push({ name: 'add-review', params: { id: this.uid, uname: this.housekeeper.name, address: this.housekeeper.villageinfo.villagename } });
		},

		// 点击微信图标处理
		copyWexin() {
			
			if (!this.housekeeper.weixin) {
				uni.showToast({
					icon: 'none',
					title: '暂无微信号'
				});
				return;
			}
			uni.setClipboardData({
				data: this.housekeeper.weixin,
				success() {
					// #ifdef APP-PLUS
					uni.showModal({
						title: '提示',
						content: '已经复制微信号，是否打开微信？',
						success(res) {
							if (res.confirm) {
								// 判定微信是否安装
								if (plus.runtime.isApplicationExist({ pname: 'com.tencent.mm', action: 'weixin://' })) {
									plus.runtime.launchApplication({ pname: 'com.tencent.mm', extra: { url: '' } }, function(e) {
										uni.showToast({
											icon: 'none',
											title: '微信应用打开失败'
										});
									});
								} else {
									uni.showToast({
										icon: 'none',
										title: '微信应用未安装'
									});
								}
							}
						}
					});
					// #endif
				}
			});
		}
	}
};
</script>

<style>
@import './housekeeper.css';
</style>
