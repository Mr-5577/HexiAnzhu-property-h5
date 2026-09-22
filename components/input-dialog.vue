<template>
    <view class="mask" v-if="value" @tap="close">
        <view class="dialog" @tap.stop="noop">
            <view class="dialog-title">{{ title }}</view>
            <view class="dialog-body">
                <input class="dialog-input" v-model="localForm.oid" placeholder="oid" :type="'text'" />
                <input class="dialog-input" v-model="localForm.app_user_id" placeholder="app_user_id" :type="'text'" />
            </view>
            <view class="dialog-footer">
                <view class="dialog-btn cancel" @tap="close">关闭</view>
                <view class="dialog-btn confirm" @tap="confirm">切换用户</view>
            </view>
        </view>
    </view>
</template>

<script>
export default {
    name: "InputDialog",
    props: {
        value: { type: Boolean, default: false },      // v-model 控制显隐
        title: { type: String, default: "请输入" },
    },
    data() {
        return {
            localForm: {
                oid: "",
                app_user_id: "",
            },
        };
    },
    watch: {
        value(val) {
            if (val) {
                // 打开时重置表单
                this.localForm = {
                    oid: "",
                    app_user_id: "",
                };
            }
        },
    },
    methods: {
        // 空方法，配合 .stop 阻止冒泡
        noop() { },

        // 关闭弹窗
        close() {
            // Vue 2 的 v-model 走 input 事件
            this.$emit("input", false);
            // 兼容 Vue 3 写法
            this.$emit("update:value", false);
        },

        // 确定
        confirm() {
            this.$emit("confirm", { ...this.localForm });
            this.close();
        },
    },
};
</script>

<style lang="scss" scoped>
/* 遮罩层 */
.mask {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 999;
    display: flex;
    align-items: center;
    justify-content: center;
}

/* 弹窗主体 */
.dialog {
    width: 600upx;
    background-color: #fff;
    border-radius: 16upx;
    overflow: hidden;

    .dialog-title {
        padding: 32upx;
        font-size: 30upx;
        font-weight: 600;
        text-align: center;
        color: #333;
    }

    .dialog-body {
        padding: 0 32upx 16upx;

        .dialog-input {
            width: 100%;
            height: 80upx;
            padding: 0 24upx;
            box-sizing: border-box;
            background-color: #f5f6f8;
            border-radius: 8upx;
            font-size: 28upx;
            color: #333;
            margin-bottom: 20upx;

            &::placeholder {
                color: #bbb;
            }
        }
    }

    .dialog-footer {
        display: flex;
        border-top: 1upx solid #f0f0f0;

        .dialog-btn {
            flex: 1;
            height: 88upx;
            line-height: 88upx;
            text-align: center;
            font-size: 30upx;

            &:active {
                background-color: #f5f6f8;
            }

            &.cancel {
                color: #999;
                border-right: 1upx solid #f0f0f0;
            }

            &.confirm {
                color: #ffcf5a;
                font-weight: 600;
            }
        }
    }
}
</style>