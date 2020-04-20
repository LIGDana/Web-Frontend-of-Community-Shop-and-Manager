<template>
    <div id="ManagerIndex">
        <el-container>
            <el-header class="el-header-app">
                <el-row>
                    <el-col :span='2' :offset='11'><div class='logo_image'><img src='../assets/logo_white.png'/></div></el-col>
                    <el-col :span='2' :offset='8'>
                        <el-dropdown @command="handleDropdownCommand">
                            <div class='login_register'>
                                <span class='el-button-log-reg'>管理员：{{this.$store.state.info.id}}号</span>
                            </div>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item command='logout' divided><i class="el-icon-caret-right"></i>退出登录</el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </el-col>
                </el-row>
            </el-header>
            <el-container>
                <el-aside class='el-aside-index'>
                    <el-menu class='el-menu-vertical' align='left' router default-active="this.$router.path" @mouseenter.native="collapseOpen" @mouseleave.native="collapseClose" :collapse="isCollapse" active-text-color="#ffd04b" @select="handleSelect">
                        <el-submenu index="1">
                            <template slot="title"><i class="el-icon-menu"></i><span slot="title">用户信息</span></template>
                            <el-menu-item-group title="已注册信息">
                                <el-menu-item index="/index/shop_info">商家列表</el-menu-item>
                                <el-menu-item index="/index/resident_info">居民列表</el-menu-item>
                            </el-menu-item-group>
                            <el-menu-item-group title="申请注册信息">
                                <el-menu-item index="/index/register_shop_info">商家申请</el-menu-item>
                            </el-menu-item-group>
                        </el-submenu>
                        <el-menu-item index="/index/order_info"><i class="el-icon-truck"></i><span slot="title">订单信息</span></el-menu-item>
                        <el-menu-item index="/index/receivables_info"><i class="el-icon-money"></i><span slot="title">商家结算</span></el-menu-item>
                        <el-menu-item index="/index/discount_rule"><i class="el-icon-goods"></i><span slot="title">优惠管理</span></el-menu-item>
                    </el-menu>
                </el-aside>
                <el-main>
                    <router-view/>
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>

<script>
export default {
    name: 'ManagerIndex',
    data() {
        return {
            isCollapse: true,
        }
    },
    methods: {
        collapseOpen() {
            this.isCollapse = false;
        },
        collapseClose() {
            this.isCollapse = true;
        },
        handleSelect(key, keyPath) {
            console.log(key, keyPath);
        },
        handleDropdownCommand(command) {
            switch(command) {
                case 'logout':
                    //sessionStorage.setItem('store', {});
                    this.$store.state.token = '';
                    this.$router.push('login');
                    this.$message({type: 'success', message: '您已退出登录'});
                    break;
                default:
                    break;
            }
        }
    }
}
</script>

<style>
.el-header-app {
  height: 17vh !important;
  background: url(../assets/header_bg1.jpg) center no-repeat;
  background-size: cover;
}

.logo_image {
  margin-top: 5vh; 
}

.login_register {
  margin-top: 5vh;
  color: #fff !important;
  font-size: 3vh !important;
}

.el-button-log-reg {
  color: #fff !important;
  font-size: 3vh !important;
}

.el-menu-vertical{
    width: 10vw;
    min-height: 100vh;
}
.el-aside-index{
    width: 10vw !important;
}
</style>
