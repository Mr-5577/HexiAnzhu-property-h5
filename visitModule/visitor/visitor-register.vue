<template>
	<view class="visitor-register-page">
		<!-- 自定义导航栏 无返回按钮 -->
		<view class="custom-navbar">
			<text class="title">来访登记</text>
		</view>
		<!-- 来访类型展示 -->
		<view class="visitor-type-card">
			<text style="visibility: hidden;">*</text>
			<view class="type-label">来访类型：</view>
			<view class="type-value">{{ visitorType == 0 ? '外卖人员' : '普通访客' }}</view>
		</view>

		<!-- 到访信息表单 -->
		<scroll-view class="form-container" scroll-y v-if="!hasHistory">
			<!-- 访客信息 -->
			<view class="form-section">
				<!-- 访客姓名 -->
				<view class="form-item">
					<view class="item-label">
						<text class="required">*</text>访客姓名：
					</view>
					<input class="item-input" v-model="formData.visitorName" placeholder="请输入来访人姓名" maxlength="20" />
				</view>

				<!-- 身份证 -->
				<view class="form-item">
					<view class="item-label">
						<text class="required">*</text>访客身份证：
					</view>
					<view class="item-right">
						<input class="item-input" v-model="formData.idCard" placeholder="请输入来访人身份证" maxlength="18"
							type="idcard" @input="validateIdCard" />
						<view v-if="idCardError" class="error-text">{{ idCardError }}</view>
					</view>
				</view>

				<!-- 手机号 -->
				<view class="form-item">
					<view class="item-label">
						<text class="required">*</text>访客手机号：
					</view>
					<view class="item-right">
						<input class="item-input" v-model="formData.phone" placeholder="来访人手机号" type="tel"
							maxlength="11" @input="validatePhone" disabled />
						<view v-if="phoneError" class="error-text">{{ phoneError }}</view>
					</view>
					<button class="phone-number" type="primary" :disabled="!allowLogin" open-type="getPhoneNumber"
						@getphonenumber="getphonenumber">
						<span class="phone-text">获取手机号</span>
					</button>
				</view>
			</view>

			<!-- 业主信息 -->
			<view class="form-section">
				<!-- 业主小区 -->
				<view class="form-item">
					<view class="item-label">
						<text class="required">*</text>业主小区：
					</view>
					<input class="item-input" v-model="formData.communityName" placeholder=" " type="text" disabled />
				</view>

				<!-- 楼栋，普通来访必填，外卖来访不显示 -->
				<view class="form-item" v-if="visitorType == 1">
					<view class="item-label">
						<text class="required">*</text>业主楼栋：
					</view>
					<picker class="item-picker" @change="buildingChange" :range="buildingList" range-key="name"
						:value="buildingIndex" :disabled="!formData.communityId">
						<text class="picker-content" :class="{ disabled: !formData.communityId }">
							{{ formData.buildingName || '请选择楼栋' }}
						</text>
					</picker>
				</view>
				<!-- 单元，普通来访必填，外卖来访不显示 -->
				<view class="form-item" v-if="visitorType == 1">
					<view class="item-label">
						<text class="required">*</text>业主单元：
					</view>
					<picker class="item-picker" @change="unitChange" :range="unitList" range-key="name"
						:value="unitIndex" :disabled="!formData.buildingId">
						<text class="picker-content" :class="{ disabled: !formData.buildingId }">
							{{ formData.unitName || '请选择单元' }}
						</text>
					</picker>
				</view>
				<!-- 房号，普通来访必填，外卖来访不显示 -->
				<view class="form-item" v-if="visitorType == 1">
					<view class="item-label">
						<text class="required">*</text>业主房号：
					</view>
					<picker class="item-picker" @change="roomChange" :range="roomList" range-key="name"
						:value="roomIndex" :disabled="!formData.unitId">
						<text class="picker-content" :class="{ disabled: !formData.unitId }">
							{{ formData.roomName || '请选择房号' }}
						</text>
					</picker>
				</view>

				<!-- 业主手机，普通来访必填，外卖来访不显示 -->
				<view class="form-item" v-if="visitorType == 1">
					<view class="item-label">
						<text class="required">*</text>业主手机：
					</view>
					<view class="item-right">
						<input class="item-input" v-model="formData.ownerPhone" placeholder="请填写业主手机号" type="tel"
							maxlength="11" @input="validateOwnerPhone" />
						<view v-if="ownerPhoneError" class="error-text">{{ ownerPhoneError }}</view>
					</view>
				</view>
			</view>

			<!-- 提交按钮 -->
			<view class="submit-btn-container">
				<button class="submit-btn" :class="{ disabled: !canSubmit }" @click="handleSubmit"
					:disabled="!canSubmit">
					提交登记
				</button>
			</view>
		</scroll-view>

		<!-- 到访信息展示 -->
		<view class="register-info" v-if="hasHistory">
			<view class="visit-date">
				<text class="date-text">到访日期</text>
				<text class="date-text">{{ currentTime }}</text>
			</view>
			<view class="visit-user">
				<text class="user-text">访客姓名：{{ formData.visitorName }}</text>
				<text class="user-text">访客电话：{{ formData.phone }}</text>
			</view>
		</view>

		<!-- 加载中提示 -->
		<view v-if="loading" class="loading-mask">
			<view class="loading-content">
				<image src="/static/images/load.gif" mode="aspectFit" style="width: 60px;height: 60px;"></image>
				<text class="loading-text">加载中...</text>
			</view>
		</view>
		<view style="color: #dedede;">{{ urlData }}</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				// 来访类型: 0-外卖访客  1-普通访客
				visitorType: 0,

				// 表单数据
				formData: {
					visitorName: '', // 访客姓名
					idCard: '', // 访客身份证
					phone: '', // 访客手机
					communityId: '', // 小区ID
					communityName: '', // 小区名称
					buildingId: '', // 业主楼栋ID
					buildingName: '', // 业主楼栋名称
					unitId: '', // 业主单元ID
					unitName: '', // 业主单元名称
					roomId: '', // 业主房号ID
					roomName: '', // 业主房号名称
					ownerPhone: '' // 业主手机
				},

				// 错误信息
				idCardError: '',
				phoneError: '',
				ownerPhoneError: '',

				// 楼栋列表
				buildingList: [],
				// 当前选中楼栋索引
				buildingIndex: -1,
				// 单元列表
				unitList: [],
				// 当前选中单元索引
				unitIndex: -1,
				// 房间列表
				roomList: [],
				// 当前选中房间的索引
				roomIndex: -1,

				// 控制状态
				loading: false,
				// 是否有历史记录
				hasHistory: false,
				// 当前时间
				currentTime: '',
				// 小区ID
				villageId: '',
				// openId
				openId: '',
				cache_name: '',
				allowLogin: true,
				urlData: ''
			};
		},

		computed: {
			// 是否可以提交
			canSubmit() {
				const {
					visitorName,
					idCard,
					phone
				} = this.formData;
				const baseValid = visitorName && idCard && phone && !this.idCardError && !this.phoneError;

				// 普通访客还需要校验小区、楼栋、单元、房号、业主电话
				if (this.visitorType == 1) {
					return baseValid &&
						this.formData.communityId &&
						this.formData.buildingId &&
						this.formData.unitId &&
						this.formData.roomId &&
						this.formData.ownerPhone &&
						!this.ownerPhoneError;
				}

				return baseValid;
			}
		},

		onLoad(options) {
			console.log('来访登记页面：', options)
			this.urlData = JSON.stringify(options)
			this.hasHistory = false;
			this.currentTime = this.getCurrTime();
			/**
			 * 普通来访二维码：type=1
			 * 外卖来访二维码：type=0
			 * 在 app.vue 中根据扫码参数用 reLaunch 跳转到此页面
			 * 携带参数如 http://api.com?villageId=123&type=0
			 */
			// 先解析扫码参数，判断来访类型
			this.parseScanParams(options);

			// 再登录获取openID
			this.getOpenId();
		},
		// 页面卸载时（返回或跳转）触发
		onUnload() {
			// 这里需要保证用户扫码进入访客页面，不能去其他页面
			// 只要返回 true 就能阻止页面卸载/跳转
			return true;
		},
		methods: {
			// 解析扫码参数
			parseScanParams(options) {
				// 根据二维码类型设置：路径参数：villageId=123&type=0，外卖码type=0，普通码type=1
				this.visitorType = options.type || 1;
				this.villageId = options.villageId || '';

				// 没有直接参数时解析scene
				if (!this.villageId && options.scene) {
					const sceneParams = this.parseSceneParams(options.scene);
					this.visitorType = sceneParams.type || 1;
					this.villageId = sceneParams.villageId || '';
				}
				console.log("来访类型:", this.visitorType);
			},
			// 解析场景值参数
			parseSceneParams(scene) {
				const params = {};
				try {
					// scene 格式可能是:villageId=123&type=0
					const decodedScene = decodeURIComponent(scene);
					const pairs = decodedScene.split("&");

					pairs.forEach((pair) => {
						const [key, value] = pair.split("=");
						if (key && value !== undefined) {
							params[key] = value;
						}
					});
				} catch (e) {
					console.error("解析场景值失败:", e);
				}
				return params;
			},

			// 获取openId
			async getOpenId() {
				const codeRes = await uni.login();
				const _this = this;
				_this.$api.getUserOpenid({
					code: codeRes[1].code
				}, res => {
					if (res.code === 1 && res.data) {
						_this.openId = res.data.openid
						_this.cache_name = res.data.cache_name
						// 静默登录
						_this.$api.login_by_openid_xcx({
							cache_name: res.data.cache_name
						}, loginRes => {
							if (loginRes.code === 1 && loginRes.data) {
								uni.setStorageSync('loginToken', loginRes.data);
								_this.$store.commit('loginToken', loginRes.data);
								// 请求小区数据
								_this.loadCommunity()
							}
						})
					}
				})
			},

			// 小区信息
			async loadCommunity() {
				if (!this.villageId) {
					uni.showToast({
						title: '未获取到小区ID',
						icon: 'none'
					});
					return
				}
				this.loading = true;
				try {
					// 通过小区ID查询小区信息
					const res = await this.$api.getVillageInfo({
						vid: this.villageId
					});
					this.formData.communityId = this.villageId
					this.formData.communityName = res.data.villagename || '未知'
					// 加载楼栋数据
					this.loadBuildingData()
					// 查询历史到访记录
					const resp = await this.$api.visitorHistoryList({
						visitor_openid: this.openId
					})
					if (resp.code === 1  && resp.data && resp.data.length > 0) {
						const listData = resp.data || []
						const targetData = listData.find((item) => item.owner_vid == this.formData.communityId)
						// 判断之前有没有访问过小区
						if (targetData) {
							this.checkHistory()
						}
					}
				} catch (error) {
					uni.showToast({
						title: '数据异常',
						icon: 'none'
					});
				} finally {
					this.loading = false;
				}
			},
			// 加载楼栋数据
			loadBuildingData() {
				const data = {
					type: 2, // type是查询类型：1小区  2楼栋  3单元  4房号
					// 查询楼栋，id传小区id
					id: this.formData.communityId,
					village_id: this.formData.communityId, // 小区id
					login_token: this.$store.state.login_token // token
				};
				this.$api.getResource(data, res => {
					if (res.code === 1) {
						const list = res.data || []
						this.buildingList = list.map((item) => {
							return {
								...item,
								name: item.block
							}
						})
					}
				});
			},
			// 楼栋选择变化
			buildingChange(e) {
				const index = e.detail.value;
				const building = this.buildingList[index];
				// 清除单元数据
				this.formData.unitId = '';
				this.formData.unitName = '';
				this.unitIndex = -1;
				this.unitList = [];
				// 强出房号数据
				this.formData.roomId = '';
				this.formData.roomName = '';
				this.roomIndex = -1;
				this.roomList = [];
				if (building) {
					this.formData.buildingId = building.id;
					this.formData.buildingName = building.name;
					// 加载该楼栋下的单元数据
					this.loadUnitData(this.formData.buildingId)
				}
			},
			// 查询单元数据
			loadUnitData(buildingId) {
				const params = {
					type: 3, // type是查询类型：1小区  2楼栋  3单元  4房号
					// 查询单元数据，id传楼栋id
					id: buildingId,
					village_id: this.formData.communityId, // 小区id
					login_token: this.$store.state.login_token // token
				};
				this.$api.getResource(params, res => {
					if (res.code === 1) {
						const list = res.data || []
						this.unitList = list.map((item) => {
							return {
								...item,
								name: item.unit
							}
						})
					}
				})
			},
			// 单元选择变化
			unitChange(e) {
				const index = e.detail.value;
				const unit = this.unitList[index];
				// 强出房号数据
				this.formData.roomId = '';
				this.formData.roomName = '';
				this.roomIndex = -1;
				this.roomList = [];
				if (unit) {
					this.formData.unitId = unit.id;
					this.formData.unitName = unit.name;
					// 加载该单元下的房号数据
					this.loadRoomData(this.formData.unitId)
				}
			},
			// 加载房号数据
			loadRoomData(unitId) {
				const params = {
					type: 4, // type是查询类型：1小区  2楼栋  3单元  4房号
					// 查询房号数据，id传单元id
					id: unitId,
					village_id: this.formData.communityId, // 小区id
					login_token: this.$store.state.login_token // token
				};
				this.$api.getResource(params, res => {
					if (res.code === 1) {
						const list = res.data || []
						this.roomList = list.map((item) => {
							return {
								...item,
								name: item.roomnum
							}
						})
					}
				})
			},
			// 房号选择变化
			roomChange(e) {
				const index = e.detail.value;
				const room = this.roomList[index];
				if (room) {
					this.formData.roomId = room.id;
					this.formData.roomName = room.name;
				}
			},

			// 身份证验证
			validateIdCard() {
				const idCard = this.formData.idCard.trim();
				if (!idCard) {
					this.idCardError = '请输入身份证号码';
					return;
				}
				// 简单格式验证
				const reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
				if (!reg.test(idCard)) {
					this.idCardError = '身份证格式不正确';
					return;
				}
				this.idCardError = '';
			},
			// 手机号验证
			validatePhone() {
				const phone = this.formData.phone.trim();
				if (!phone) {
					this.phoneError = '请输入手机号码';
					return;
				}
				const reg = /^1[3-9]\d{9}$/;
				if (!reg.test(phone)) {
					this.phoneError = '手机号格式不正确';
					return;
				}
				this.phoneError = '';
			},
			// 业主手机验证
			validateOwnerPhone() {
				const phone = this.formData.ownerPhone.trim();
				if (!phone) {
					this.ownerPhoneError = '请输入业主手机号';
					return;
				}
				const reg = /^1[3-9]\d{9}$/;
				if (!reg.test(phone)) {
					this.ownerPhoneError = '手机号格式不正确';
					return;
				}
				this.ownerPhoneError = '';
			},
			// 检查历史记录
			checkHistory() {
				// 从本地存储获取访客历史记录
				const history = uni.getStorageSync('visitorHistory');
				// 无历史记录或记录无效
				if (!history || !history.idCard) {
					return false;
				}

				// 有历史记录，自动填充访客信息
				this.formData.visitorName = history.visitorName || '';
				this.formData.idCard = history.idCard || '';
				this.formData.phone = history.phone || '';
				this.currentTime = this.getCurrTime();
				// 有来访记录并且是外卖访客时才能直接展示来访信息，普通访客需要重新选择 楼栋-单元-房号-访客电话等信息
				if (this.visitorType == 0) {
					this.hasHistory = true;
				}
			},
			// 设置当前时间
			getCurrTime() {
				const now = new Date();
				// 补零函数
				const pad = (num) => num.toString().padStart(2, '0');
				const year = now.getFullYear();
				const month = pad(now.getMonth() + 1);
				const day = pad(now.getDate());
				const hours = pad(now.getHours());
				const minutes = pad(now.getMinutes());
				const seconds = pad(now.getSeconds());
				return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
			},
			//获取手机号
			async getphonenumber(e) {
				if (!this.allowLogin) return
				// 确定获取用户信息
				if (e.detail.errMsg === 'getPhoneNumber:ok') {
					this.allowLogin = false;
					const _this = this;
					uni.showLoading({
						title: '正在获取手机号'
					})
					const params = {
						code: e.detail.code,
						cache_name: _this.cache_name
					};
					try {
						_this.$api.login_xcx(params, loginRes => {
							if (loginRes.code == 1) {
								uni.setStorageSync('loginToken', loginRes.data);
								_this.$store.commit('loginToken', loginRes.data);
								_this.formData.phone = loginRes.data.tel
							} else {
								uni.showToast({
									title: '获取号码失败',
									icon: 'none'
								});
							}
						});
					} catch (error) {
					} finally {
						uni.hideLoading();
						_this.allowLogin = true;
					}
				}
			},
			// 提交登记
			async handleSubmit() {
				if (!this.canSubmit) return;
				this.loading = true;
				try {
					// 先进行注册，注册成功后再保存来访信息
					const registerParams = {
						visitor_openid: this.openId,
						visitor_name: this.formData.visitorName,
						visitor_type: Number(this.visitorType), // 0外卖  1普通
						visitor_card_no: this.formData.idCard,
						visitor_tel: this.formData.phone,
					};
					// 注册
					const registerRes = await this.$api.visitorRegister(registerParams);
					if (registerRes.code === 1) {
						// 到访业主信息
						const saveData = {
							visitor_openid: this.openId,
							owner_vid: this.formData.communityId,
							owner_roomid: this.formData.roomId,
							owner_house_no: this.formData.roomName,
							owner_tel: this.formData.ownerPhone,
							visit_time: this.getCurrTime()
						};
						// 保存到访记录
						const saveRes = await this.$api.visitorHistorySave(saveData);
						if (saveRes.code === 1) {
							uni.showToast({
								title: '保存成功',
								icon: 'success'
							});
							// 保存访客信息到本地历史记录
							this.saveVisitorHistory();
						}
					} else {
						uni.showToast({
							title: '保存失败',
							icon: 'none'
						});
					}
				} catch (error) {
					uni.showToast({
						title: '网络异常，请重试',
						icon: 'none'
					});
				} finally {
					this.loading = false;
				}
			},

			// 保存访客历史记录
			saveVisitorHistory() {
				const history = {
					visitorName: this.formData.visitorName,
					idCard: this.formData.idCard,
					phone: this.formData.phone,
					communityId: this.formData.communityId,
					communityName: this.formData.communityName,
					buildingId: this.formData.buildingId,
					buildingName: this.formData.buildingName,
					unitId: this.formData.unitId,
					unitName: this.formData.unitName,
					roomId: this.formData.roomId,
					roomName: this.formData.roomName,
					ownerPhone: this.formData.ownerPhone,
					lastVisitTime: Date.now()
				};
				uni.setStorageSync('visitorHistory', history);
				this.currentTime = this.getCurrTime();
				this.hasHistory = true;
			}
		}
	};
</script>

<style lang="scss" scoped>
	.visitor-register-page {
		min-height: 100vh;
		background-color: #f5f5f5;
	}

	.custom-navbar {
		width: 100%;
		height: 180upx; // 状态栏 + 导航栏
		background: white;
		display: flex;
		align-items: flex-end;
		justify-content: center;

		.title {
			font-size: 36upx;
			color: #333;
			margin-bottom: 20upx;
		}
	}


	.visitor-type-card {
		background-color: #fff;
		color: #333;
		padding: 30upx 60upx 20upx;
		display: flex;
		box-sizing: border-box;
		align-items: center;

		.type-label {
			font-size: 28upx;
		}

		.type-value {
			font-size: 30upx;
		}
	}

	.form-container {
		// height: calc(100vh - 120upx);
		padding: 20upx 30upx 40upx;
		box-sizing: border-box;
	}

	.form-section {
		background: white;
		border-radius: 16upx;
		margin-bottom: 30upx;
		overflow: hidden;
		padding-bottom: 20upx;
	}

	.form-item {
		width: 100%;
		display: flex;
		flex-wrap: nowrap;
		padding: 20upx 30upx;
		border-bottom: 1upx solid #f0f0f0;
		box-sizing: border-box;
		position: relative;

		&:last-child {
			border-bottom: none;
		}

		.item-label {
			font-size: 28upx;
			color: #333;
			display: flex;
			align-items: center;

			.required {
				color: #FF3B30;
				margin-right: 8upx;
			}
		}

		.item-right {
			position: relative;
		}

		.item-input {
			font-size: 28upx;
			height: 55upx;
			line-height: 55upx;
			background: #fff;
			flex: 1;
		}

		.item-picker {
			flex: 1;

			.picker-content {
				font-size: 29upx;
				color: #999;
				width: 100%;
			}
		}

		.error-text {
			color: #FF3B30;
			font-size: 22upx;
			position: absolute;
			bottom: -30upx;
			left: 0;
		}

		.phone-number {
			max-width: 200upx;
			height: 56upx;
			position: absolute;
			right: 20upx;
			display: flex;
			align-items: center;
			background: linear-gradient(to bottom, #f99372, #ffbe84);
		}

		.phone-text {
			font-size: 26upx;
			color: #fff;
		}
	}

	.submit-btn-container {
		padding: 40upx 0;

		.submit-btn {
			color: #fff;
			background: linear-gradient(to bottom, #f99372, #ffbe84);
			font-size: 32upx;
			height: 90upx;
			line-height: 90upx;
			border-radius: 45upx;
			font-weight: 500;

			&.disabled {
				background: #CCCCCC;
				color: #999;
			}
		}
	}

	.register-info {
		padding: 20upx 30upx;
		box-sizing: border-box;

		.visit-date {
			width: 100%;
			height: 220upx;
			background-color: #fff;
			border-radius: 20upx;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			margin-bottom: 40upx;

			.date-text {
				font-size: 44upx;
				font-weight: bold;
				color: #333;
			}
		}

		.visit-user {
			padding: 30upx 30upx;
			box-sizing: border-box;
			background-color: #fff;
			display: flex;
			flex-direction: column;

			.user-text {
				font-size: 28upx;
				color: #333;
				height: 56upx;
				line-height: 56upx;
			}
		}
	}

	.loading-mask {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.5);
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 999;

		.loading-content {
			background: white;
			padding: 40upx 60upx;
			border-radius: 16upx;
			display: flex;
			flex-direction: column;
			align-items: center;

			.loading-text {
				margin-top: 20upx;
				font-size: 28upx;
				color: #666;
			}
		}
	}
</style>