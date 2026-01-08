<template>
    <view>
    </view>
</template>

<script>
    export default {
        data() {
            return {
                webviewStyles: {
                    progress: {
                        color: '#ffcf5a'
                    }
                },
				invoiceUrl:''
            }
        },
		onLoad() {
			let invoiceUrl = this.$Route.query.url;
			var w = plus.webview.create(invoiceUrl);
				plus.webview.show(w); // 显示窗口
		}
    }
</script>

<style>

</style>