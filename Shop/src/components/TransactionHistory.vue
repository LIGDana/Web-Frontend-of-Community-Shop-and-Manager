<template>
    <div id="TransactionHistory" align="center">
    <el-table stripe :data="tableData" style="width: 100%" max-height="100%">
        <el-table-column prop="skey" label="订单识别码" align='center' fixed></el-table-column>
        <el-table-column prop="startTime" label="开始时间" align='center'></el-table-column>
        <el-table-column prop="endTime" label="结束时间" align='center'></el-table-column>
        <el-table-column prop="userName" label="用户名" align='center'></el-table-column>
        <el-table-column prop="delta" label="积分变化量" align='center'></el-table-column>
        <el-table-column prop="amount" label="交易金额" align='center'></el-table-column>
        <el-table-column prop="deltaReceivables" label="应收账款增加" align='center'></el-table-column>
    </el-table>
    <br/>
    <el-button @click="settlement">结算申请</el-button>
    </div>
</template>

<script>
export default {
    name: 'TransactionHistory',
    data() {
        return {
            tableData: [],
        }
    },

    created() {
        this.axios.post(this.$store.state.baseurl + "/show_orders", {shopId: this.$store.state.info.shopId})
        .then((result) => {
            this.tableData = result.data;
        }).catch((err) => {
            console.log(err);
        });
    },

    methods: {
        settlement() {
            this.$confirm('您将向平台提出结算申请，是否继续？', '提示', {
                confirmButtonText: '继续',
                cancelButtonText: '取消',
                type: 'warning',
                center: true
            }).then(() => {
                //提示框点击确定
                this.axios.post(this.$store.state.baseurl + '/receivables', {shopId: this.$store.state.info.shopId})
                .then((result) => {
                    if(result.data.status === 'exist')
                        this.$message({type: 'error', message: '您之前曾提交过结算申请，且管理员尚未处理。暂时不能再次申请!'});
                    else if(result.data.status === 'submit')
                        this.$message({type: 'success', message: '成功提交申请!'});
                }).catch((err) => {
                    console.log(err);
                    this.$message({type: 'error', message: '操作失败'});    
                });
            }).catch(() => {
                //提示框点击取消
                this.$message({type: 'info', message: '已取消申请!'});
            })
        }
    }
}
</script>