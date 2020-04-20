<template>
<div id="ShopInfo">
    <el-input v-model="searchInfo" placeholder="请输入搜索内容"></el-input>
    <el-table stripe :data="searchTableData" style="width: 100%" max-height="100%">
        <el-table-column prop="shopId" label="ID" align='center' fixed></el-table-column>
        <el-table-column prop="shopName" label="商家名称" align='center'></el-table-column>
        <el-table-column prop="category" label="类别" align='center'></el-table-column>
        <el-table-column prop="ownerName" label="经营人" align='center'></el-table-column>
        <el-table-column prop="phone" label="电话" align='center'></el-table-column>
        <el-table-column prop="address" label="地址" align='center'></el-table-column>
        <el-table-column prop="receivables" label="应收平台账款" align='center'></el-table-column>
        <el-table-column prop="rate" label="积分兑换比例" align='center'></el-table-column>
        <el-table-column fixed="right" label="编辑" align='center'>
            <template slot-scope="scope">
                <el-button @click.native.prevent="deleteRow(scope.$index, tableData)" type="text" size="small">移除</el-button>
            </template>
        </el-table-column>
    </el-table>
</div>
</template>

<script>
    export default {
        name: 'ShopInfo',
        inject: ['reload'],
        data() {
            return {
                tableData: [{shopId:'', shopName:'', password:'', category:'', receivables:'', phone:'', address:'', ownerName:'', rate:''}],
                getSearchTable: [],
                searchInfo: '',
            }
        },
        created() {
            //页面创建即请求后台表格数据
            this.axios.get(this.$store.state.baseurl + '/show_shops')
            .then((result) => {
                console.log(result);
                this.tableData = result.data;
                this.getSearchTable = this.tableData;
            }).catch((err) => {
                console.log(err);
            });
        },
        methods: {
            deleteRow(index, rows) {
                this.$confirm('您将删除该平台的商家账号，是否继续？', '提示', {
                    confirmButtonText: '继续',
                    cancelButtonText: '取消',
                    type: 'warning',
                    center: true
                }).then(() => {
                    //提示框点击确定
                    this.axios.post(this.$store.state.baseurl + '/delete_shop', {shopId: rows[index].shopId})
                    .then((result) => {
                        console.log(result);
                        this.$message({type: 'info', message: '已删除账号！'});
                        this.reload();
                    }).catch((err) => {
                        console.log(err);
                        this.$message({type: 'error', message: '操作失败'});    
                    });
                }).catch(() => {
                    //提示框点击取消
                    this.$message({type: 'info', message: '已取消删除账号!'});
                })
            }
        },
        computed: {
            searchTableData() {
                let searchInfo = this.searchInfo;
                if (searchInfo) {
                    return this.getSearchTable.filter(data => {
                        console.log("success" + data);
                        return Object.keys(data).some(key => {
                        return String(data[key]).toLowerCase().indexOf(searchInfo) > -1
                        })
                    })
                }
                else
                    return this.getSearchTable;
            }
        }
    }
</script>