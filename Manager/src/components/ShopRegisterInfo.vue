<template>
    <el-table stripe :data="tableData" style="width: 100%" max-height="100%">
        <el-table-column prop="shopName" label="商家名称" align='center'></el-table-column>
        <el-table-column prop="ownerName" label="经营人" align='center'></el-table-column>
        <el-table-column prop="category" label="类别" align='center'></el-table-column>
        <el-table-column prop="phone" label="电话" align='center'></el-table-column>
        <el-table-column prop="address" label="店铺地址" align='center'></el-table-column>
        <el-table-column fixed="right" label="编辑" width="200" align='center'>
            <template slot-scope="scope">
                <el-button @click.native.prevent="accept(scope.$index, tableData)" type="primary" size="small">同意</el-button>
                <el-button @click.native.prevent="reject(scope.$index, tableData)" type="danger" size="small">拒绝</el-button>
            </template>
        </el-table-column>
    </el-table>
</template>

<script>
    export default {
        name: 'ShopRegisterInfo',
        inject: ['reload'],
        data() {
            return {
                tableData: [{shopName:'', password:'', phone:'', category:'', address:'', ownerName:''}]
            }
        },
        created() {
            //页面创建即请求后台表格数据
            this.axios.get(this.$store.state.baseurl + '/show_registers')
            .then((result) => {
                this.tableData = result.data;
            }).catch((err) => {
                console.log(err);
            });
        },
        methods: {
            //管理员点击同意申请
            accept(index, list) {
                //弹出确认框
                this.$confirm('您将同意该商家在该平台的注册申请，是否继续？', '提示', {
                    confirmButtonText: '继续',
                    cancelButtonText: '取消',
                    type: 'warning',
                    center: true
                }).then(() => {
                    //提示框点击确定
                    this.axios.post(this.$store.state.baseurl + '/accept_register', {shopName: list[index].shopName})
                    .then((result) => {
                        console.log(result);
                        this.$message({type: 'info', message: '已同意该商家的申请!'});
                        //list.splice(index, 1);
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
                this.$confirm('您将拒绝该商家在该平台的注册申请，是否继续？', '注意', {
                    confirmButtonText: '确定并继续',
                    cancelButtonText: '取消',
                    type: 'warning',
                    center: true
                }).then(() => {
                    //提示框点击确定
                    this.axios.post(this.$store.state.baseurl + '/reject_register', {shopName: list[index].shopName})
                    .then((result) => {
                        console.log(result);
                        this.$message({type: 'info', message: '已拒绝该商家的申请!'});
                        //list.splice(index, 1);
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
        },
    }
</script>