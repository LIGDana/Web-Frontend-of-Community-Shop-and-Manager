<template>
<div id="ResidentInfo" align="center">
    <el-table stripe :data="tableData" style="width: 100%" max-height="100%">
        <el-table-column prop="id" label="序号" align='center'></el-table-column>
        <el-table-column prop="openid" label="ID" align='center'></el-table-column>
        <el-table-column prop="name" label="用户名" align='center'></el-table-column>
        <el-table-column prop="phone" label="电话号码" align='center'></el-table-column>
        <el-table-column prop="mail" label="邮件地址" align='center'></el-table-column>
        <el-table-column prop="score" label="积分" align='center'></el-table-column>
        <el-table-column prop="level" label="等级" align='center'></el-table-column>
    </el-table>
</div>
</template>

<script>
    export default {
        name: 'ResidentInfo',
        data() {
            return {
                tableData: [{id:'无', openid:'', name:'', phone:'', mail:'', score:'', level:'', session:''}],
            }
        },
        created() {
            //页面创建即请求后台表格数据
            this.axios.get(this.$store.state.baseurl + '/show_users')
            .then((result) => {
                this.tableData = result.data;
            }).catch((err) => {
                console.log(err);
            });
        },
        methods: {
        },
    }
</script>