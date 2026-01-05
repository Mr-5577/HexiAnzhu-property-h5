<template>
	<view class="order-wrapper">
		<!-- 数据列表 -->
		<view class="list-box">
			<view class="swipe-wrapper" v-for="(item, index) in wfkList" :key="index">
				<uni-swipe-action :options="options2" @click.stop="bindClick(item)">
					<view class="container_of_slide">
						<view class="slide_list" @tap="getDetail(item,2)" :disabled="isDisable">
							<view class="now-message-info" hover-class="uni-list-cell-hover" :style="{ width: Screen_width + 'px' }">
								<view class="list-right">
									<view class="list-title" v-if="item.ordernum">{{ item.ordernum }}</view>
									<view class="list-detail">{{ timestampToTimes(item.ctime) }}</view>
								</view>
								<view class="list-r">
									<view class="status" style="color: #ec4040;background-color: rgba(236,64,64, 0.05);">待缴费</view>
									<view class="money">¥ {{ item.money }}</view>
								</view>
							</view>
							<view style="clear:both"></view>
						</view>
					</view>
				</uni-swipe-action>
			</view>
			<!-- <view  v-for="(item, index) in wfkList" :key="index" >
				<view class="container_of_slide">
					<view class="slide_list" @tap="getDetail(item)" style="display: flex;">
						<view class="now-message-info" hover-class="uni-list-cell-hover">
							<view class="icon-circle" style="background: #ED7A30;">未缴</view>
							<view class="list-right">
								<view class="list-title" v-if="item.ordernum">{{ item.ordernum }}</view>
								<view class="list-detail">{{ timestampToTimes(item.ctime) }}</view>
							</view>
							<view class="list-right-1">{{ item.money }}</view>
						</view>
						<view class="cancel_order">取消订单</view>
					</view>
				</view>
			</view> -->
		</view>
		<view class="list-box">
			<view class="container_of_slide" v-for="(item, index) in recordList" :key="index">
				<view class="slide_list" @tap="getDetail(item,1)">
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
		<view class="uni-empty" v-if="recordList.length==0 && wfkList.length==0">{{ loadingText }}</view>
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
						backgroundColor: '#ec4040'
					}
				}
			],
			totalCount: 0
		};
	},
	onLoad() {
		const res = uni.getSystemInfoSync();
		// 计算主体部分高度,单位为px
		this.recordList = []
		this.wfkList = [];
		this.getList();
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
		getDetail(item,type) {
			this.isDisable = true;
			setTimeout(() => {
				this.isDisable = false; //点击一次时隔两秒后才能再次点击
			}, 2000);
			if(type === 2){
				var data = {
					sn: item.ordernum,
					type: type
				};
			}else{
				var data = {
					sn: item.sn,
					type: type
				};
			}
			this.$api.orderInfo(data, res => {
				let datas = JSON.stringify(res.data);
				// return
				this.$Router.push({ name: 'order-detail', params: { data: datas, type: type } });
			});
		},
		//取消订单
		del(item) {
			let _this = this;
			uni.showModal({
				title: '',
				content: '确定要删除该订单吗？',
				confirmText: '删除订单',
				cancelText: '不删除',
				confirmColor: '#ff3b32',
				success(res) {
					if (res.confirm) {
						let data = {
							order_num: item.ordernum
						};
						_this.$api.delOrder(data, res => {
							_this.recordList =[];
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
				confirmColor: '#ff3b32',
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
		}
	}
};
</script>

<style scoped>
@import url('./order.css');
</style>
