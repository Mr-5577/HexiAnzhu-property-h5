<template>
	<view class="repair">
		<view class="uni-flex-center">
			<view class="uni-padding-wrap">
				<uni-segmented-control :current="current" :values="tabItems" :style-type="styleType"
					:active-color="activeColor" @clickItem="onClickItem" />
			</view>
		</view>
		<!-- 加载状态部分 -->
		<view class="load" v-if="loading">
			<image src="/static/images/load.gif" mode="aspectFit"></image>
		</view>
		<view class="content" v-else>
			<!-- <view class="empty" v-if="list.length == 0">
				<image src="/static/images/fa-mask.png" mode=""></image>
				<view class="tip">当前房产暂无工单记录</view>
				<button class="btn" plain @click="toMyhouse">更换房产</button>
			</view> -->
			<view class="uni-empty" v-if="list.length == 0">{{ loadingText }}</view>
			<view v-else>
				<view class="repair-item" v-for="(item, index) in list" :key="index" @click="toDetail(item)">
					<view class="left">
						<view class="type">{{item.label == 1 ? item.typename+'(报事)':item.typename+'(投诉)'}}</view>
						<view class="addr">
							{{ item.villagename + ' ' + item.room }}
						</view>
						<view class="date">
							{{ item.create_time }}
						</view>
					</view>
					<view class="right" v-if="item.status == 10">
						<view class="h-user">处理人：{{ item.realname }}</view>
						<view class="btn" @click.stop="evaluate(item)">评价TA</view>
					</view>
					<view class="right" v-else>
						<text class="status" style="color: #ffcf5a;background-color: #fcf6e5;"
							v-if="item.status == 0">{{ item.statusMsg }}</text>
						<text class="status" style="color: #33b5ff;background-color: rgba(51,181,255,0.1);"
							v-else-if="item.status == 2">{{ item.statusMsg }}</text>
						<text class="status" style="color: #65d8bf;background-color: rgba(101,216,191,0.1);"
							v-else-if="item.status == 1">{{ item.statusMsg }}</text>
						<text class="status" style="color: #ec7f27;background-color: rgba(236,127,39,0.1);"
							v-else-if="item.status == 10">{{ item.statusMsg }}</text>
						<view class="handle">处理人：{{ item.realname ? item.realname : "无" }}</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import uniSegmentedControl from '@/components/uni-segmented-control/uni-segmented-control.vue';
	export default {
		components: {
			uniSegmentedControl
		},
		data() {
			return {
				loadingText: '暂无数据',
				items: ['全部', '待接单', '处理中', '已处理', '待评价'],
				activeColor: '#ffcf5a',
				current: 0,
				styleType: 'text',
				// 列表数据，status：0待接单 1已处理 2处理中 1,4待评价
				list: [],
				// 是否正在加载数据
				loading: false
			};
		},
		computed: {
			repairStats() {
				const stats = {
					total: 0, // 全部
					pending: 0, // 待接单
					completed: 0, // 已处理
					processing: 0, // 处理中
					unEvaluated: 0, // 待评价
				};
				this.list.forEach(task => {
					stats.total++;
					switch (task.status) {
						case 0:
							stats.pending++;
							break;
						case 1:
							stats.completed++;
							stats.unEvaluated++;
							break;
						case 2:
							stats.processing++;
							break;
						case 4:
							stats.unEvaluated++;
							break;
					}
				});
				return stats;
			},
			tabItems() {
				return [
					{ text: '全部' },
					{ text: '待接单' },
					{ text: '处理中' },
					{ text: '已处理' },
					{
						text: '待评价',
						// 待评价：有数量时显示角标
						badge: this.repairStats.unEvaluated
					}
				];
			}
		},
		onLoad() {
			this.getRepairlist();
		},
		onReachBottom: function() {
			// console.log('我触底了要加载数据了: ' + JSON.stringify('我触底了要加载数据了'));
		},
		methods: {
			onClickItem(index) {
				if (this.current !== index) {
					this.current = index;
				}
			},
			toDetail(item) {
				this.$Router.push({
					name: 'repair-order-detail',
					params: {
						id: item.id,
						label: item.label
					}
				});
			},
			getRepairlist() {
				this.loading = true;
				this.$api.repairlist({}, res => {
					this.loading = false;
					if (res.code === 0) {
						this.list = res.data || [];
					}
				});
			},
			// 跳转评价页面
			evaluate(item) {
				if (item.id) {
					this.$Router.push({
						name: 'evaluate',
						params: {
							id: item.id,
							label: item.label
						}
					});
				}
			},
			// 跳转我的房产页面
			toMyhouse() {
				this.$Router.push({
					name: 'my-house'
				});
			}
		},
	};
</script>

<style lang="scss">
	.repair {
		padding-top: 80upx;

		.load {
			text-align: center;
			padding: 30upx;
			height: 50upx;

			image {
				width: 50upx;
				height: 50upx;
			}
		}

		.content {
			padding: 30upx 24upx;

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

			.repair-item {
				padding: 30upx;
				box-shadow: 0 0 6upx rgba(0, 0, 0, 0.05);
				display: flex;
				margin-bottom: 30upx;
				background-color: #fff;
				border-radius: 10upx;

				.left {
					flex: 1;

					.type {
						font-size: 30upx;
						line-height: 42upx;
						color: #333;
						font-weight: 600;
					}

					.addr,
					.date {
						font-size: 28upx;
						line-height: 40upx;
						color: #666;
						margin-top: 10upx;
					}
				}

				.right {
					text-align: right;

					.status {
						display: inline-block;
						font-size: 24upx;
						line-height: 34upx;
						padding: 4upx 14upx;
						border-radius: 4upx;
					}

					.handle {
						margin-top: 56upx;
						font-size: 26upx;
						line-height: 36upx;
						color: #999;
					}

					.h-user {
						font-size: 26upx;
						line-height: 36upx;
						color: #999;
					}

					.btn {
						display: inline-block;
						color: #fff;
						font-size: 28upx;
						line-height: 40upx;
						padding: 10upx 24upx;
						border-radius: 6upx;
						margin-top: 46upx;
						background-color: #ffcf5a;
					}
				}
			}
		}
	}


	.uni-flex-center {
		background: #ffffff;
		position: fixed;
		top: 0;
		width: 100%;
		z-index: 999;
	}

	.uni-padding-wrap {
		width: 90%;
		padding: 0;
	}
</style>