<script>
	export default {
		onLaunch: async function() {
			// 小程序启动时设置广告状态为false
			this.$store.commit('setHasShownAd', false);

			if (wx.canIUse('getUpdateManager')) {
				const updateManager = wx.getUpdateManager();
				updateManager.onCheckForUpdate(function(res) {
					if (res.hasUpdate) {
						updateManager.onUpdateReady(function() {
							wx.showModal({
								title: '更新提示',
								content: '新版本已经准备好，是否重启应用？',
								success: function(res) {
									if (res.confirm) {
										updateManager.applyUpdate();
									}
								}
							});
						});
						updateManager.onUpdateFailed(function() {
							wx.showModal({
								title: '已经有新版本了哟~',
								content: '新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~'
							});
						});
					}
				});
			} else {
				wx.showModal({
					title: '提示',
					content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
				});
			}

			// let codeRes = await uni.login()
			// await this.$api.getUserOpenid({
			// 	code: codeRes[1].code
			// }, res => {
			// 	if (res.code == 1) {
			// 		this.$api.login_by_openid_xcx({
			// 			cache_name: res.data.cache_name
			// 		},res =>{
			// 			if(res.code == 1){
			// 				this.$store.commit('loginToken', res.data);
			// 				this.getData();
			// 			}
			// 		})
			// 	}
			// })

		},
		onShow: async function() {

			// try {
			// 	const hasLogin = uni.getStorageSync('hasLogin');
			// 	const loginToken = uni.getStorageSync('loginToken');
			// 	if (loginToken) {
			// 		this.$store.commit('loginToken', loginToken);
			// 		await this.getData();
			// 	}
			// 	if (hasLogin) {
			// 		this.$store.commit('setHasLogin', hasLogin);
			// 	}
			// } catch (e) {
			// 	// error
			// }
		},
		onHide: function() {},
		methods: {
			async getData() {
				let data = {};
				await this.$api.userCenter(data, res => {
					this.$store.commit('setMyHouse', res.data);
				});
			}
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

	.po-event-none {
		pointer-events: none;
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