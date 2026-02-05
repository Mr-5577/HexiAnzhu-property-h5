<template>
	<view class="order-wrapper">
		<!-- 待缴数据列表 -->
		<view class="list-box">
			<view class="swipe-wrapper" v-for="(item, index) in wfkList" :key="index">
				<uni-swipe-action :options="options2" @click.stop="bindClick(item)">
					<view class="container_of_slide">
						<view class="slide_list" @tap="getDetail(item, 2)" :disabled="isDisable">
							<view class="now-message-info" hover-class="uni-list-cell-hover" :style="{ width: Screen_width + 'px' }">
								<view class="list-right">
									<view class="list-title" v-if="item.ordernum">{{ item.ordernum }}</view>
									<view class="list-detail">{{ timestampToTimes(item.ctime) }}</view>
								</view>
								<view class="list-r">
									<view class="status" style="color: #ffcf5a;background-color: #fcf6e5;">待缴费</view>
									<view class="money">¥ {{ item.money }}</view>
								</view>
							</view>
							<view style="clear:both"></view>
						</view>
					</view>
				</uni-swipe-action>
			</view>
		</view>
		<!-- 已缴费部分 -->
		<view class="list-box">
			<view class="container_of_slide" v-for="(item, index) in recordList" :key="index">
				<view class="slide_list" @tap="getDetail(item, 1)">
					<view class="now-message-info" :style="{ width: Screen_width + 'px' }">
						<view class="list-right">
							<view class="list-title" v-if="item.sn">{{ item.sn }}</view>
							<view class="list-detail">{{ timestampToTimes(item.createtime) }}</view>
						</view>
						<view class="list-r">
							<view class="status" style="color: rgb(101, 216, 191);background-color: rgba(101, 216, 191, 0.1);">已缴费</view>
							<view class="money">¥ {{ item.money }}</view>
						</view>
					</view>
					<view style="clear:both"></view>
				</view>
			</view>
		</view>
		<view class="uni-empty" v-if="recordList.length == 0 && wfkList.length == 0">{{ loadingText }}</view>
		<!-- 		<view class="empty" v-if="recordList.length==0 && wfkList.length==0">
			<image src="/static/images/fa-mask.png" mode=""></image>
			<view class="tip">当前房产暂无订单记录</view>
			<button class="btn" plain @click="toMyhouse">更换房产</button>
		</view> -->
	</view>
</template>

<script>
import uniSwipeAction from '@/components/uni-swipe-action/uni-swipe-action.vue';
export default {
	components: {
		uniSwipeAction
	},
	computed: {
		Screen_width() {
			return uni.getSystemInfoSync().windowWidth;
		}
	},
	data() {
		return {
			loadingText: '暂无数据',
			isDisable: false,
			limit: 15,
			page: 1,
			wfkList: [], //未付款订单
			recordList: [], //已付款订单
			options2: [
				{
					text: '删除订单',
					style: {
						backgroundColor: '#ffcf5a'
					}
				}
			],
			totalCount: 0
		};
	},
	onShow() {
		const res = uni.getSystemInfoSync();
		// 计算主体部分高度,单位为px
		this.recordList = [];
		this.wfkList = [];
		if (this.$store.state.login_token) {
			this.getList();
		}
	},
	onReachBottom() {
		let totalPage = Math.ceil(this.totalCount / this.limit);
		if (this.page < totalPage) {
			this.page++;
			this.getList();
		}
	},
	methods: {
		timestampToTimes(ctime) {
			return this.$uitls.timestampToTime(ctime);
		},
		bindClick(item) {
			this.del(item);
		},
		getList() {
			let data = {
				page: this.page,
				limit: this.limit
			};
			this.$api.getOrderSn(data, res => {
				this.wfkList = res.data.wfk;
				if (res.data.record) {
					res.data.record.forEach(res => {
						this.recordList.push(res);
					});
				}
				this.totalCount = res.data.count;
				this.page = parseInt(res.data.page);
			});
		},
		
		getDetail(item, type) {
			// 跳转详情页
			this.$Router.push({ name: 'order-detail', params: { type: type, id: type === 2 ? '' : item.id, sn: type === 2 ? item.ordernum : item.sn } });
		},
		
		//取消订单
		del(item) {
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
							order_num: item.ordernum
						};
						_this.$api.delOrder(data, res => {
							_this.recordList = [];
							_this.wfkList = [];
							_this.getList();
							uni.showToast({
								icon: 'none',
								title: '删除订单成功!',
								duration: 2000
							});
						});
					} else if (res.cancel) {
						console.log('用户点击取消');
					}
				}
			});
		},
		
		// 删除
		remove(item) {
			let _this = this;
			uni.showModal({
				title: '',
				content: '确定要删除该订单吗？',
				confirmText: '删除',
				confirmColor: '#ffcf5a',
				success: function(res) {
					if (res.confirm) {
						let data = {
							order_num: item.sn
						};
						_this.$api.clearSnAttach(data, res => {
							_this.wfkList.splice(0, 1);
							uni.showToast({
								icon: 'none',
								title: '删除成功!',
								duration: 2000
							});
						});
					} else if (res.cancel) {
						console.log('用户点击取消');
					}
				}
			});
		},
		// 跳转我的房产页面
		toMyhouse() {
			this.$Router.push({ name: 'my-house' });
		}
	}
};
</script>

<style lang="scss" scoped>
@import url('./order.css');
.empty {
	text-align: center;
	image {
		width: 250upx;
		height: 220upx;
		margin-top: 250upx;
	}
	.tip {
		font-size: 32upx;
		line-height: 44upx;
		color: #ccc;
		margin-top: 20upx;
		text-align: center;
	}
	.btn {
		font-size: 28upx;
		color: #fff;
		line-height: 40upx;
		padding: 10upx 44upx !important;
		background-color: #ffcf5a;
		border-radius: 4upx;
		margin-top: 60upx;
		display: inline-block;
		border: none !important;
	}
	.btn:active {
		opacity: 0.8;
	}
}
</style>
