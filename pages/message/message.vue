<template>
	<view>
		<view class="uni-list">
			<view class="uni-list-cell" hover-class="uni-list-cell-hover" >
				<view class="uni-media-list">
					<image class="uni-media-list-logo" :src="img"></image>
					<view class="uni-media-list-body">
						<template v-if="message">
							<view class="uni-media-list-text-top">通知消息</view>
							<view class="uni-media-list-text-bottom uni-ellipsis">{{ message }}</view>
						</template>
						<template v-else>
							<view class="uni-media-list-text-top">{{ list.title }}</view>
							<view class="uni-media-list-text-bottom uni-ellipsis">{{ list.content }}</view>
						</template>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			img: '/static/img/main/76581498124194994.png',
			list:{ title: '通知消息', content: '暂无消息' },
			
		};
	},
	methods: {},
	computed:{
		message(){
			return this.$store.state.pushMessage
		}
	}
};
</script>

<style></style>
