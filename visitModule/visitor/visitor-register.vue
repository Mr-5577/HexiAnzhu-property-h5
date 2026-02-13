<template>
	<view class="visitor-register-page">
		<!-- 自定义导航栏 无返回按钮 -->
		<view class="custom-navbar">
			<text class="title">来访登记</text>
		</view>
		<!-- 来访类型展示 -->
		<view class="visitor-type-card">
			<view class="type-label">来访类型：</view>
			<view class="type-value">{{ visitorType == 0 ? '外卖人员' : '普通访客' }}</view>
		</view>

		<!-- 到访信息表单 -->
		<scroll-view class="form-container" scroll-y v-if="!hasHistory">
			<!-- 访客信息 -->
			<view class="form-section">
				<!-- 访客昵称 -->
				<view class="form-item">
					<view class="item-label">
						<text class="required">*</text>昵称：
					</view>
					<view class="item-right">
						<input class="item-input" type="nickname" v-model="formData.visitorName" placeholder="昵称" />
					</view>
				</view>
				<!-- 手机号 -->
				<view class="form-item">
					<view class="item-label">
						<text class="required">*</text>访客手机号：
					</view>
					<view class="item-right">
						<input class="item-input" v-model="formData.phone" placeholder="来访人手机号" type="tel"
							maxlength="11" disabled />
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
		<view style="padding: 0 30upx;box-sizing: border-box;width: 100vw;"
			v-show="formData.visitorName === 'hexianzhu.@'">
			<view>options参数：{{ errData.options }}</view>
			<view>wxlogin信息：{{ errData.wxLoginRes }}</view>
			<view>openId信息：{{ errData.openIdRes }}</view>
			<view>小区信息：{{ errData.getVillageInfo }}</view>
			<view>历史到访记录：{{ errData.visitorHistoryList }}</view>
			<view>楼栋数据：{{ errData.loadBuildingData }}</view>
			<view>catch错误信息：{{ errData.catchMessage }}</view>
			<view>phoneNumRes信息：{{ errData.phoneNumRes }}</view>
			<view>phoneLoginErrRes信息：{{ errData.phoneLoginErrRes }}</view>
			<view>cache_open_id信息：{{ errData.cache_open_id }}</view>
		</view>
	</view>
</template>

<script>
	/**
	 * 来访登记场景
	 * 用户状态	 注册身份	扫码类型	当前小区记录	处理逻辑
	 * 未注册	 --	         任意	     任意	      显示表单，按扫码类型登记
	 * 已注册	 外卖员	     外卖码	      有	       直接显示历史记录
	 * 已注册	 外卖员	     外卖码	      无	       显示表单
	 * 已注册	 外卖员	     普通码	      有/无	       按扫描的码处理
	 * 已注册	 普通访客	 普通码	      有	       显示表单，自动填充姓名+手机
	 * 已注册	 普通访客	 普通码	      无	       显示表单
	 * 已注册	 普通访客	 外卖码	      有/无	       强制切回普通，按普通访客处理
	 */
	export default {
		data() {
			return {
				// 来访类型: 0-外卖访客  1-普通访客
				visitorType: 0,

				// 表单数据
				formData: {
					visitorName: '', // 昵称
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
				allowLogin: true,

				// 是否注册
				isRegistered: false, // 是否有任意记录
				userType: null, // 注册身份（最早一条记录的visitor_type）
				currentVillageRecord: null, // 当前小区最新记录
				hasVillageRecord: false,  // 当前小区是否有记录

				// 错误信息收集
				errData: {
					cache_open_id: '',
					options: '',
					wxLoginRes: '',
					openIdRes: '',
					getVillageInfo: '',
					visitorHistoryList: '',
					loadBuildingData: '',
					catchMessage: '',
					phoneNumRes: '',
					phoneLoginErrRes: '',
				}
			};
		},

		computed: {
			// 是否可以提交
			canSubmit() {
				const { visitorName, phone } = this.formData;
				const baseValid = visitorName && phone && !this.phoneError;

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

		async onLoad(options) {
			console.log('来访登记页面：', options)
			this.errData.options = JSON.stringify(options)
			this.currentTime = this.getCurrTime();
			this.hasHistory = false;
			
			/**
			 * 普通来访二维码：type=1
			 * 外卖来访二维码：type=0
			 * 携带参数如 http://api.com?villageId=123&type=0
			 */
			// 1.先解析扫码参数，判断来访类型
			this.parseScanParams(options);

			// 2.读取本地缓存openId,没有则获取openId
			this.openId = uni.getStorageSync('open_id') || '';
			// 保存open_id缓存信息
			this.errData.cache_open_id = this.openId
			if (!this.openId) {
				await this.getOpenId();
			}

			// 3.获取用户来访记录
			await this.getUserHistoryList()

			// 4.加载小区数据
			await this.loadCommunity()

			// 5. 最终判断
			this.makeFinalDecision();
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
				this.visitorType = options.type;
				this.villageId = options.villageId || '';

				// 没有直接参数时解析scene
				if (!this.villageId && options.scene) {
					const sceneParams = this.parseSceneParams(options.scene);
					this.visitorType = sceneParams.type;
					this.villageId = sceneParams.villageId || '';
				}
				this.formData.communityId = this.villageId
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
				try {
					const codeRes = await uni.login();
					this.errData.wxLoginRes = JSON.stringify(codeRes)
					const openIdRes = await this.$api.getUserOpenid({
						code: codeRes[1].code
					})
					// 保存返回信息
					this.errData.openIdRes = JSON.stringify(openIdRes)

					if (openIdRes.code == 1 && openIdRes.data) {
						const { openid } = openIdRes.data;
						this.openId = openid
						// 缓存openId
						uni.setStorageSync('open_id', openid)
					} else {
						uni.showToast({
							title: '获取openid失败',
							icon: 'none'
						});
					}
				} catch (error) {
					this.errData.openIdRes = JSON.stringify(error)
					uni.showToast({
						title: '获取openid失败!!',
						icon: 'none'
					});
				}
			},
			// 获取用户来访记录
			async getUserHistoryList() {
				if (!this.openId) return;
				try {
					const res = await this.$api.visitorHistoryList({
						visitor_openid: this.openId
					});
					// 保存返回信息
                    this.errData.visitorHistoryList = JSON.stringify(res)
					if (res.code === 1 && res.data && res.data.length > 0) {
						const allRecords = res.data || [];

						// 1. 有任意记录即视为已注册
						this.isRegistered = true;
						// 2. 按时间正序取最早一条数据，得到第一次的注册身份
						const sortedAsc = [...allRecords].sort((a, b) => 
							new Date(a.visit_time) - new Date(b.visit_time)
						);
						this.userType = Number(sortedAsc[0].visitor_type);
						// 3. 过滤当前小区的来访记录
						const villageRecords = allRecords.filter(
							item => item.owner_vid == this.villageId
						);
						if (villageRecords && villageRecords.length > 0) {
							// 按时间倒序取最新一条
							const sortedDesc = villageRecords.sort((a, b) => 
								new Date(b.visit_time) - new Date(a.visit_time)
							);
							this.currentVillageRecord = sortedDesc[0];
							this.hasVillageRecord = true;
						} else {
							this.currentVillageRecord = null;
							this.hasVillageRecord = false;
						}
					} else {
						// 无任何记录：未注册
						this.isRegistered = false;
						this.userType = null;
						this.currentVillageRecord = null;
						this.hasVillageRecord = false;
					}
				} catch (e) {
					console.error('获取来访信息失败', e);
					this.isRegistered = false;
					this.userType = null;
					this.currentVillageRecord = null;
					this.hasVillageRecord = false;
				}
			},
			// 场景最终判断
			makeFinalDecision() {
				// ---------------- 场景1：未注册用户 ----------------
				if (!this.isRegistered) {
					// 保持扫码类型，显示表单
					this.hasHistory = false;
					return;
				}
				
				// ---------------- 已注册用户，先处理扫码类型的冲突 ----------------
				// 场景2-3：普通访客扫外卖码
				if (this.userType == 1 && this.visitorType == 0) {
					this.visitorType = 1; // 强制切换为普通访客
				}
				// 场景2-4：外卖员扫普通码，就按照普通码登记
				else if (this.userType == 0 && this.visitorType == 1) {
					// this.visitorType = 0; // 强制切换为外卖员
				} else {
					// 无冲突，保持扫码类型
				}
				
				// ---------------- 根据修正后的 visitorType 值来判断显示 ----------------
				if (this.visitorType === 0) {
					// 外卖访客：有记录直接显示，无记录填表
					if (this.hasVillageRecord) {
						this.fillFromRecord();
						this.hasHistory = true;
					} else {
						this.hasHistory = false;
					}
				} else {
					// 普通访客：永远显示表单
					this.hasHistory = false;
					// 如果有当前小区记录，自动填充姓名和手机号,重新选择 楼栋-单元-房号-手机
					if (this.hasVillageRecord) {
						this.formData.visitorName = this.currentVillageRecord.visitor_name || '';
						this.formData.phone = this.currentVillageRecord.visitor_tel || '';
						// 清空业主信息，让用户重新选择
						this.formData.buildingId = '';
						this.formData.buildingName = '';
						this.formData.unitId = '';
						this.formData.unitName = '';
						this.formData.roomId = '';
						this.formData.roomName = '';
						this.formData.ownerPhone = '';
					}
				}
			},
			// 填充记录（仅外卖访客使用）
			fillFromRecord() {
				if (!this.currentVillageRecord) return;
				this.formData.visitorName = this.currentVillageRecord.visitor_name || '';
				this.formData.phone = this.currentVillageRecord.visitor_tel || '';
				this.currentTime = this.getCurrTime(); // 有记录需要显示当前时间
			},
			// 小区信息
			async loadCommunity() {
				if (!this.villageId) {
					uni.showToast({
						title: '小区信息获取失败,请重新扫码！',
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
					// 保存返回信息
					this.errData.getVillageInfo = JSON.stringify(res)
					if (!res || res.Code != 1 || !res.data) {
						uni.showToast({
							title: '小区信息获取失败',
							icon: 'none'
						});
						this.loading = false;
						return;
					}
					this.formData.communityId = this.villageId
					this.formData.communityName = res.data.villagename || '未知'

					// 加载楼栋数据
					this.getLoadBuildingData()
					
				} catch (err) {
					this.errData.catchMessage = JSON.stringify(err)
					uni.showToast({
						title: '数据异常',
						icon: 'none'
					});
				} finally {
					this.loading = false;
				}
			},
			// 加载楼栋数据
			async getLoadBuildingData() {
				const data = {
					type: 2, // type是查询类型：1小区  2楼栋  3单元  4房号
					// 查询楼栋，id传小区id
					id: this.formData.communityId,
					village_id: this.formData.communityId, // 小区id
					login_token: this.$store.state.login_token // token
				};
				try {
					const buildRes = await this.$api.getResource(data)
					// 保存返回信息
					this.errData.loadBuildingData = JSON.stringify(buildRes)
					if (buildRes.code === 1) {
						const list = buildRes.data || []
						this.buildingList = list.map((item) => {
							return {
								...item,
								name: item.block
							}
						})
					}
				} catch (error) {
					console.error('加载楼栋失败', error);
				}
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
			async loadUnitData(buildingId) {
				const params = {
					type: 3, // type是查询类型：1小区  2楼栋  3单元  4房号
					// 查询单元数据，id传楼栋id
					id: buildingId,
					village_id: this.formData.communityId, // 小区id
					login_token: this.$store.state.login_token // token
				};
				this.loading = true;
				try {
					const unitRes = await this.$api.getResource(params)
					if (unitRes.code === 1) {
						const list = unitRes.data || []
						this.unitList = list.map((item) => {
							return {
								...item,
								name: item.unit
							}
						})
					}

				} catch (error) {
					console.error('加载单元数据失败', error);
				} finally {
					this.loading = false;
				}
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
			async loadRoomData(unitId) {
				const params = {
					type: 4, // type是查询类型：1小区  2楼栋  3单元  4房号
					// 查询房号数据，id传单元id
					id: unitId,
					village_id: this.formData.communityId, // 小区id
					login_token: this.$store.state.login_token // token
				};
				this.loading = true;
				try {
					const roomRes = await this.$api.getResource(params)
					if (roomRes.code === 1) {
						const list = roomRes.data || []
						this.roomList = list.map((item) => {
							return {
								...item,
								name: item.roomnum
							}
						})
					}
				} catch (error) {
					console.error('加载房号失败', error);
				} finally {
					this.loading = false;
				}
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
					uni.showLoading({
						title: '正在获取手机号'
					})
					try {
						const phoneRes = await this.$api.getPhoneNum({
							code: e.detail.code
						})
						this.errData.phoneNumRes = JSON.stringify(phoneRes)
						if (phoneRes.code == 1) {
							this.formData.phone = phoneRes.data
						}
					} catch (err) {
						this.errData.phoneLoginErrRes = JSON.stringify(err)
						uni.showToast({
							title: '号码获取异常，请重新获取！',
							icon: 'none'
						});
					} finally {
						uni.hideLoading();
						this.allowLogin = true;
					}
				}
			},
			// 提交登记
			async handleSubmit() {
				// 提交前再次验证关键字段
				if (this.visitorType == 1) {
					this.validateOwnerPhone();
				}
				if (!this.canSubmit) return;
				this.loading = true;
				try {
					// 1. 注册（只有无任何记录时需要注册）
					if (!this.isRegistered) {
						const registerParams = {
							visitor_openid: this.openId,
							visitor_name: this.formData.visitorName,
							visitor_type: Number(this.visitorType), // 注册类型 0外卖  1普通
							visitor_tel: this.formData.phone,
						};
						// 注册
						const registerRes = await this.$api.visitorRegister(registerParams);
						if (registerRes.code === 1) {
							this.isRegistered = true;
							this.userType = Number(this.visitorType)
						} else {
							uni.showToast({
								title: '注册异常，请重新注册！',
								icon: 'none'
							});
							this.loading = false;
							return
						}
					}

					// 2. 保存来访记录（每次扫码都要保存）
					const saveData = {
						visitor_openid: this.openId,
						owner_vid: this.formData.communityId,
						owner_roomid: this.formData.roomId,
						owner_house_no: this.formData.roomName,
						owner_tel: this.formData.ownerPhone,
						visit_type: Number(this.visitorType), // 来访类型 0外卖  1普通
						visit_time: this.getCurrTime()
					};
					// 保存到访记录
					const saveRes = await this.$api.visitorHistorySave(saveData);
					if (saveRes.code === 1) {
						uni.showToast({
							title: '登记成功',
							icon: 'success'
						});

						// 登记成功，更新当前小区的记录状态
						this.hasVillageRecord = true;
						this.currentVillageRecord = {
							visitor_name: this.formData.visitorName,
							visitor_tel: this.formData.phone,
							owner_vid: this.formData.communityId,
							visit_type: Number(this.visitorType),
							visitor_type: Number(this.visitorType)
						};
						// 统一展示来访时间信息
						this.hasHistory = true;
      					this.currentTime = this.getCurrTime();
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
			flex-shrink: 0; // 防止被压缩
    		white-space: nowrap;
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
				color: #808080;
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
			right: 15upx;
			display: flex;
			align-items: center;
			background: linear-gradient(to bottom, #f99372, #ffbe84);
			z-index: 99;
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