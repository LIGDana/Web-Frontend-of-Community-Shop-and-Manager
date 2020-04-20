<template>
    <div id="ReceivablesInfo" align="center">
    <el-table stripe :data="tableData" style="width: 100%" max-height="100%">
        <el-table-column prop="shopId" label="商家ID" align='center'></el-table-column>
        <el-table-column prop="shopName" label="商家名称" align='center' fixed></el-table-column>
        <el-table-column prop="receivables" label="应还金额" align='center'></el-table-column>
        <el-table-column fixed="right" label="处理" align='center'>
            <template slot-scope="scope">
                <el-button-group>
                <el-button @click.native.prevent="accept(scope.$index, tableData)" type="primary" size="small">同意</el-button>
                <el-button @click.native.prevent="reject(scope.$index, tableData)" type="danger" size="small">拒绝</el-button>
                </el-button-group>
            </template>
        </el-table-column>
    </el-table>
    </div>
</template>

<script>
export default {
    name: 'ReceivablesInfo',
    inject: ['reload'],
    data() {
        return {
            tableData: [],
        }
    },

    created() {
        this.axios.get(this.$store.state.baseurl + "/show_receivables")
        .then((result) => {
            this.tableData = result.data;
        }).catch((err) => {
            console.log(err);
        });
    },

    methods: {
        accept(index, list) {
            //弹出确认框
            this.$confirm('您将同意该商家的结算申请，是否继续？', '提示', {
                confirmButtonText: '继续',
                cancelButtonText: '取消',
                type: 'warning',
                center: true
            }).then(() => {
                //提示框点击确定
                this.axios.post(this.$store.state.baseurl + '/accept_receivables', {shopId: list[index].shopId})
                .then((result) => {
                    console.log(result);
                    this.$message({type: 'info', message: '已同意该商家的结算申请!'});
                    this.reload();
                }).catch((err) => {
                    console.log(err);
                    this.$message({type: 'error', message: '操作失败'});    
                });
            }).catch(() => {
                //提示框点击取消
                this.$message({type: 'info', message: '已取消操作!'});
            })
        },

        //管理员点击拒绝申请
        reject(index, list) {
            //弹出确认框
            this.$confirm('您将拒绝该商家的结算申请，是否继续？', '注意', {
                confirmButtonText: '确定并继续',
                cancelButtonText: '取消',
                type: 'warning',
                center: true
            }).then(() => {
                //提示框点击确定
                this.axios.post(this.$store.state.baseurl + '/reject_receivables', {shopId: list[index].shopId})
                .then((result) => {
                    console.log(result);
                    this.$message({type: 'info', message: '已拒绝该商家的申请!'});
                    this.reload();
                }).catch((err) => {
                    console.log(err);
                    this.$message({type: 'error', message: '操作失败'});
                });
            }).catch(() => {
                //提示框点击取消
                this.$message({type: 'info', message: '已取消操作!'});
            })       
        }
    }
}
</script>