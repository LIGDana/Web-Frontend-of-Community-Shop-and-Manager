<template>
<div id="ShopInfo"><el-input v-model="searchInfo" placeholder="请输入搜索内容" style="width:240px"></el-input>
    <el-table stripe :data="searchTableData" style="width: 100%" max-height="100%">
        <el-table-column prop="skey" label="订单识别码" align='center' fixed></el-table-column>
        <el-table-column prop="state" label="订单状态" align='center'></el-table-column>
        <el-table-column prop="startTime" label="开始时间" align='center'></el-table-column>
        <el-table-column prop="endTime" label="结束时间" align='center'></el-table-column>
        <el-table-column prop="userName" label="用户名" align='center'></el-table-column>
        <el-table-column prop="shopName" label="商家名称" align='center'></el-table-column>
        <el-table-column prop="delta" label="积分变化量" align='center'></el-table-column>
        <el-table-column prop="amount" label="交易金额" align='center'></el-table-column>
        <el-table-column prop="deltaReceivables" label="商家应收账款" align='center'></el-table-column>
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
        name: 'OrderInfo',
        data() {
            return {
                tableData: [],
                getSearchTable: [],
                searchInfo: '',
            }
        },
        created() {
            //页面创建即请求后台表格数据
            this.axios.post(this.$store.state.baseurl + '/show_orders', {id: this.$store.state.info.id})
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
                rows.splice(index, 1);
            }
        },
        computed: {
            searchTableData() {
                let searchInfo = this.searchInfo;
                if (searchInfo) {
                    return this.getSearchTable.filter(data => {
                        console.log("success"+data);
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