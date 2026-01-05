<template>
	<view class="add-review">
		<view class="header">
			<view class="at-jie">
				<image src="/static/images/avatar.png" mode=""></image>
				<view class="jie">
					<text class="name">{{uname}}</text>
					<text class="label">专属管家</text>
					<view class="text">{{address}}</view>
				</view>
			</view>
			<view class="star">
				<text class="title">服务评分</text>
				<view class="rate">
					<uni-rate v-model="starValue" :value="5" :size="20" :margin="10"/>
				</view>
			</view>
		</view>
		<!-- 标签选择部分 -->
		<view class="labels" v-if="false">
			<text @click="labSelect(item)" :class="['lab-item', item.active ? 'active' : '']" v-for="item in labelList" :key="item.id">
				{{item.name}}
			</text>
		</view>
		<!-- 其它评价部分 -->
		<view class="other">
			<view class="title">其它评价</view>
			<textarea  class="text-input-area" v-model="content" placeholder="请填写评价内容" maxlength="140"></textarea>
		</view>
		
		<view class="btn-wrapper">
			<view class="btn" @click="addReview">提交评价</view>
		</view>
	</view>
</template>

<script>
import uniRate from '@/components/uni-rate/uni-rate.vue'
export default {
	components: {
		uniRate
	},
	data() {
		return {
			// 标签数据列表
			labelList: [
				{
					name: '服务好',
					id: 1,
					active: false
				},
				{
					name: '处理速度快',
					id: 2,
					active: false
				},
				{
					name: '认真负责',
					id: 3,
					active: false
				},
				{
					name: '处理速度快',
					id: 4,
					active: false
				},
				{
					name: '认真负责',
					id: 5,
					active: false
				},
			],
			// 当前选中的标签
			currentLab: [],
			// 评分绑定值
			starValue: 5,
			// 管家 id
			uid:'',
			// 管家姓名
			uname: '',
			// 管家所属项目名
			address: '',
			// 评价内容
			content: '',
		};
	},
	onNavigationBarButtonTap() {
		this.addReview();
	},
	methods: {
		// 点击标签处理
		labSelect(lab) {
			if (lab.active) {
				lab.active = false;
				let i = 0;
				this.currentLab.forEach((item, index) => {
					if (item.id == lab.id) {
						i = index;
					}
				})
				this.currentLab.splice(i, 1);
			} else {
				lab.active = true;
				this.currentLab.push(lab);
			}
		},
		// 提交评价处理
		addReview(){
			let _this = this;
			let text = '确定要提交评价数据吗！';
			if (this.starValue <= 3) {
				text = '您确定要给我打这么低的分吗？';
			}
			uni.showModal({
				title: '提示',
				content: text,
				success :function(res) {
					if (res.confirm) {
						let data = {
							id:_this.uid,
							stars: _this.starValue,
							content: _this.content
						};
						_this.$api.housekeeperAddEvaluate(data,res =>{
							uni.navigateBack({
								delta:1
							})
						})
					} else if (res.cancel) {
					}
				}
			});
		}
	},
	onLoad() {
		this.uid = this.$Route.query.id;
		this.uname = this.$Route.query.uname;
		this.address = this.$Route.query.address;
	}
};
</script>

<style lang="scss">
.add-review {
	min-height: 100vh;
	box-sizing: border-box;
	padding-bottom: 160upx;
	background-color: #fff;
	.header {
		padding: 60upx 24upx;
		border-bottom: 30upx solid #FAFAFA;
		.at-jie {
			margin-bottom: 60upx;
			display: flex;
			image {
				width: 120upx;
				height: 120upx;
				margin-right: 30upx;
			}
			.jie {
				flex: 1;
				padding-top: 10upx;
				.name {
					font-size: 30upx;
					line-height: 42upx;
					margin-right: 20upx;
					font-weight: 600;
					vertical-align: middle;
				}
				.label {
					display: inline-block;
					font-size: 26upx;
					line-height: 36upx;
					color: #ec3e3e;
					background-color: rgba(236,62,62, 0.1);
					padding: 4upx 20upx;
					border-radius: 4upx;
					vertical-align: middle;
				}
				.text {
					font-size: 28upx;
					line-height: 40upx;
					color: #333;
					margin-top: 10upx;
				}
			}
		}
		.star {
			>.title {
				font-size: 30upx;
				font-weight: 600;
				line-height: 44upx;
				margin-right: 30upx;
			}
			.rate {
				display: inline-block;
			}
		}
	}
	.labels {
		padding: 40upx 0 0;
		display: flex;
		flex-wrap: wrap;
		.lab-item {
			font-size: 28upx;
			line-height: 40upx;
			padding: 10upx 40upx;
			background-color: #f5f5f5;
			color: #666;
			border-radius: 4upx;
			margin: 0 24upx 30upx;
		}
		.lab-item.active {
			padding: 8upx 38upx;
			border: 1px solid #ec3e3e;
			color: #ec3e3e;
			background-color: rgba(236,62,62, 0.1);
		}
	}
	.other {
		padding: 40upx 24upx 0;
		.title {
			font-size: 30upx;
			line-height: 44upx;
			color: #333;
			font-weight: 600;
			margin-bottom: 40upx;
		}
		.text-input-area {
			padding: 20upx;
			background-color: #f5f5f5;
			border-radius: 10upx;
			color: #333;
			font-size: 26upx;
			line-height: 36upx;
			height: 240upx;
			box-sizing: border-box;
			width: 100%;
			border: none;
		}
	}
	.btn-wrapper {
		padding: 20upx 24upx 40upx;
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		box-sizing: border-box;
		.btn {
			font-size: 28upx;
			line-height: 40upx;
			color: #fff;
			padding: 24upx;
			background-color: #ec3e3e;
			border-radius: 6upx;
			text-align: center;
		}
		.btn:active {
			opacity: 0.6;
		}
	}
}
</style>
