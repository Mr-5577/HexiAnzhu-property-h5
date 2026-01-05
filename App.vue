<script>
export default {
	onLaunch: function() {
		//仅出现在 5+App 平台下的代码
		// #ifdef APP-PLUS
		plus.runtime.setBadgeNumber(0);
		// 锁定屏幕方向
		plus.screen.lockOrientation('portrait-primary');
		const _self = this;
		// App接收推送消息
		const _handlePush = function(message) {
			/**
			 * 通过 vuex 来同步页面的数据，
			 * 实际开发中，这里可能是跳转到某个页面等操作，请根据自身业务需求编写。
			 */
			_self.$store.commit('updatePushMessage',message);
		};
		//点击普通推送消息
		plus.push.addEventListener('click', function(message) {
			_handlePush(message.content);
			// //点击推送消息跳转到消息页面
			// uni.navigateTo({
			// 	url:'/pages/message/message'
			// })
		});
		
		//直接监听到穿透消息
		plus.push.addEventListener('receive', function(message) {
			let content = JSON.parse(message.content)
			plus.runtime.setBadgeNumber(1);//设置应用快捷数字角标
			for (let var1 in content) {
				_handlePush(content[var1]);
				uni.showToast({
					icon:'none',
					title:'接收到新消息',
					duration:3000
				})
			}
		});
		// #endif
	},
	onShow: function() {
		try {
			const hasLogin = uni.getStorageSync('hasLogin');
			const loginToken = uni.getStorageSync('loginToken');
			if (loginToken) {
				this.$store.commit('loginToken', loginToken);
				this.getData();
			}
			if (hasLogin) {
				this.$store.commit('setHasLogin', hasLogin);
			}
		} catch (e) {
			// error
		}
	},
	onHide: function() {
	},
	methods:{
		getData() {
			let data = {};
			this.$api.userCenter(data, res => {
				this.$store.commit('setMyHouse', res.data);
			});
		},
	}
};
</script>

<style>
/*每个页面公共css */
@import './common/css/main.css';
@import './common/css/uni.css';
@import './common/css/icon.css';
[v-cloak] {
	display: none;
}
page {
	background: #f7f6fb;
}
.po-event-none{
	pointer-events: none
}
.content {
	display: flex;
	flex: 1;
	flex-direction: column;
	padding: 20upx;
}

.input-group {
	background-color: #ffffff;
	margin-top: 40upx;
	position: relative;
}

.input-group::before {
	position: absolute;
	right: 0;
	top: 0;
	left: 0;
	height: 1upx;
	content: '';
	-webkit-transform: scaleY(0.5);
	transform: scaleY(0.5);
	background-color: #c8c7cc;
}

.input-group::after {
	position: absolute;
	right: 0;
	bottom: 0;
	left: 0;
	height: 1upx;
	content: '';
	-webkit-transform: scaleY(0.5);
	transform: scaleY(0.5);
	background-color: #c8c7cc;
}

.input-row {
	display: flex;
	flex-direction: row;
	position: relative;
}

.input-row .title {
	width: 20%;
	height: 80upx;
	min-height: 80upx;
	padding: 15upx 0;
	padding-left: 30upx;
	line-height: 80upx;
}

.input-row.border::after {
	position: absolute;
	right: 0;
	bottom: 0;
	left: 15upx;
	height: 1upx;
	content: '';
	-webkit-transform: scaleY(0.5);
	transform: scaleY(0.5);
	background-color: #c8c7cc;
}

.btn-row {
	margin-top: 50upx;
	padding: 20upx;
}

button.primary {
	background-color: #0faeff;
}
</style>
