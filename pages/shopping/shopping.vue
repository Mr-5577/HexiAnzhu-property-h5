<template>
	<view>
		<!--主体-->
		<!-- <view class="idxMain">
			<swiper class="swiper" indicator-active-color='#fff' :indicator-dots="indicatorDots" :autoplay="autoplay" :interval="interval" :duration="duration">
				<swiper-item v-for="(item,index) in bannerList" :key='index' @click="JumpFuneralNews(index,item)">
					<view class="swiper-item">
						<image :src="item.imgs"></image>
					</view>
					<view class="swiper-title">
						<view class="swiper-title-box">{{ item.title }}</view>
					</view>
				</swiper-item>
			</swiper>
			<view class="contBg">
				<view class="contOver" v-for="(item,index) in contOneList" :key="index">
					<view class="idxMainBox">
						<view class="contOverLt">
							<view class="contTxt">{{ item.title }}</view>
							<view class="contTime">{{ item.author }} {{ item.updateTime }}</view>
						</view>
						<view class="contRtImg"><image :src="item.imgs"></image></view>
					</view>
				</view>
			</view>
			<view class="shopOver">
				<view class="contTitle">
					<view class="idxMainBox">推荐商品</view>
				</view>
				<view class="idxMainBox">
					<view class="shopLt" v-for="(item,index) in contTwoList" :key='index'>
						<view class="shopImg"><image :src="item.imgs" mode="aspectFill"></image></view>
						<view class="shopTxt">{{ item.name }}</view>
						<view class="shopMoney"><text>￥{{ item.money }}</text><text>/剩余{{ item.yu }}</text></view>
					</view>
				</view>
			</view>
		</view> -->
		<!--主体-->
		<view class="uni-empty">
			敬请期待...
		</view>
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				bannerList:[
					{ id:1, imgs:'/static/img/main-banner.jpg' },
					{ id:2, imgs:'/static/img/main-banner.jpg' }
				],//轮播图
				
				contOneList:[
					{ id:1, title:'物业 服务', author:'平台', updateTime:'2019-7-30', imgs:'/static/img/main-banner.jpg' },
					{ id:2, title:'上门回收', author:'平台', updateTime:'2019-7-30', imgs:'/static/img/main-banner.jpg' },
				],//内容1
				
				contTwoList:[
					{ id:1, imgs:'/static/img/main-banner.jpg', name:'商品商品商品商品', money:'50', yu:'50' },
					{ id:2, imgs:'/static/img/main-banner.jpg', name:'商品商品商品商品', money:'50', yu:'50' },
					{ id:3, imgs:'/static/img/main-banner.jpg', name:'商品商品商品商品', money:'50', yu:'50' },
					{ id:4, imgs:'/static/img/main-banner.jpg', name:'商品商品商品商品', money:'50', yu:'50' },
					{ id:5, imgs:'/static/img/main-banner.jpg', name:'商品商品商品商品', money:'50', yu:'50' },
					{ id:6, imgs:'/static/img/main-banner.jpg', name:'商品商品商品商品', money:'50', yu:'50' },
					{ id:7, imgs:'/static/img/main-banner.jpg', name:'商品商品商品商品', money:'50', yu:'50' },
					{ id:8, imgs:'/static/img/main-banner.jpg', name:'商品商品商品商品', money:'50', yu:'50' },
				],//内容2
				
				/*图片轮播*/
				indicatorDots: true,
				autoplay: true,
				interval: 2000,
				duration: 500,
				
			}
		},
		onLoad() {
			
		},
		methods: {
			JumpFuneralNews(evl){
				console.log(evl);
			},
			//官网复制的轮播
			changeIndicatorDots(e) {
				this.indicatorDots = !this.indicatorDots
			},
			changeAutoplay(e) {
				this.autoplay = !this.autoplay
			},
			intervalChange(e) {
				this.interval = e.target.value
			},
			durationChange(e) {
				this.duration = e.target.value
			}
			
		}
	}
</script>

<style>
	@import url("./shopping.css");
</style>
