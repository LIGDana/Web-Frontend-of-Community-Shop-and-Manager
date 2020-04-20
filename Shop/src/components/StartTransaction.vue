<template>
<div id="StartTransaction" align="center">
    <h3>商品列表</h3>
    <el-table :data="tableData.slice((currentPage - 1) * pageSize, currentPage * pageSize)" stripe style="width: 100%">
        <el-table-column prop="goodsName" label="商品名称" align=center></el-table-column>
        <el-table-column prop="sale" :formatter="saleFormatter" label="是否特价" align=center></el-table-column>
        <el-table-column prop="price" label="单价" align=center></el-table-column>
        <el-table-column prop="salePrice" label="折扣单价" align=center></el-table-column>
        <el-table-column label="数量" align=center>
            <template slot-scope="scope">
                <el-input-number v-model="scope.row.quantity" @change="ListChange(scope.row)" :precision="2" :step="1" :min="0" size="mini"></el-input-number>
            </template>
        </el-table-column>
    </el-table>
    <el-pagination :current-page.sync="currentPage" :page-size="pageSize" layout="prev, pager, next, jumper" :total="tableData.length" :hide-on-single-page="true"></el-pagination>

    <br/>
    <el-badge :value="'总价:' + sum + '元'">
        <el-button type="primary" @click="seebaskets" icon="el-icon-shopping-cart-2">购物车及结算</el-button>
    </el-badge>

    <!--购物车-->
    <el-dialog align='center' title="购物车" :visible.sync="basketVisible">
    <div v-if="this.baskets.length > 0">
        <h4>非折扣：{{originsum}}元 折扣：{{salesum}}元 总价：{{sum}}元</h4>
        <el-table :data="baskets" stripe style="width:100%">
            <el-table-column prop="goodsName" label="商品名称" align=center></el-table-column>
            <el-table-column label="数量" align=center>
                <template slot-scope="scope">
                   <el-input-number v-model="scope.row.quantity" @change="BasketsChange(scope.row)" :precision="2" :step="1" size="mini"></el-input-number>
                </template>
            </el-table-column>
            <el-table-column label="价格" align=center>
                <template slot-scope="scope">
                    <span>{{(scope.row.quantity * scope.row.salePrice).toFixed(2)}}</span>
                </template>
            </el-table-column>
        </el-table>
        <br/>

        <div v-if="needKey">
            <h4>交易密钥</h4><el-input placeholder="请填写消费者给您提供的交易密钥" suffix-icon="el-icon-key" v-model="skey"></el-input>
        </div>

        <el-button-group v-if="!needKey">
            <el-button type="success" @click="confirm">确定</el-button>
            <el-button type="danger" @click="emptybaskets">清空</el-button>
        </el-button-group>

        <br/>
        <el-button-group v-if="needKey">
            <el-button type="success" @click="submit">提交</el-button>
            <el-button type="danger" @click="cancel">取消</el-button>
        </el-button-group>

    </div>

    <div v-else>
        <h3>购物车空空如也</h3>
        <el-button type="primary" @click="noseebaskets">确定</el-button>
    </div>
    </el-dialog>

    <!--显示订单信息并确认支付-->
    <el-dialog align='center' title="支付详情" :visible.sync="orderVisible">
        <h2>消费者应支付金额：{{order.total}}元</h2>
        <h2>消费者积分变化量：{{order.delta}}</h2>
        <el-button-group>
            <el-button type="success" @click="completeOrder">支付完成</el-button>
            <el-button type="danger" @click="cancelOrder">取消支付</el-button>
        </el-button-group>
    </el-dialog>

    <!--显示订单详情-->
    <el-dialog align='center' title="订单信息" :visible.sync="finalVisible">
        <h2>订单密文：{{final.skey}}</h2>
        <h2>消费者用户名：{{final.userName}}</h2>
        <h2>商家用户名：{{final.shopName}}</h2>
        <h2>订单开始时间：{{final.startTime}}</h2>
        <h2>订单结束时间：{{final.endTime}}</h2>
        <h2>消费者积分变化量：{{final.delta}}</h2>
        <h2>交易金额：{{final.amount}}元</h2>
        <el-button @click="this.reload">返回</el-button>
    </el-dialog>

</div>
</template>

<script>
export default {
    name: 'StartTransaction',
    inject: ['reload'],
    data() {
        return {
            tableData: [{goodsName:'', sale: false, price: 0, salePrice: 0, quantity: 0}],
            baskets:[],
            originSum: 0,
            saleSum: 0,
            skey:'',
            needKey: false,
            basketVisible: false,
            currentPage: 1,
            pageSize: 7,
            
            orderVisible: false,
            order: {
                total: 0,
                delta: 0,
            },

            finalVisible: false,
            final: {
                skey:'',
                userName:'',
                shopName:'',
                startTime:'',
                endTime:'',
                amount: 0,
                delta: 0,
            }
        }
    },
    created() {
        // 请求后台数据，渲染表格
        this.axios.post(this.$store.state.baseurl + '/show_goods', {shopId: this.$store.state.info.shopId})
        .then((result) => {
            var temptable = result.data
            for(var index in temptable)
                temptable[index].quantity = 0;
            this.tableData = temptable;
        }).catch((err) => {
            console.log(err);
        });
    },
    methods: {
        //映射sale
        saleFormatter(row) {
            return row.sale? '是': '否';
        },
        //商品列表中改变购买的商品数量
        ListChange(row) {
            this.$nextTick(() => {
                //改变baskets
                let basket = {
                    goodsName: row.goodsName,
                    sale: row.sale,
                    price: row.price,
                    salePrice: row.salePrice,
                    quantity: row.quantity
                };
                let result = this.baskets.filter((item) => { return item.goodsName === basket.goodsName; });
                if(result != null && result.length > 0) {
                    if(basket.quantity != 0)
                        result[0].quantity = basket.quantity;
                    else
                        this.baskets.splice(this.baskets.indexOf(result[0]), 1);
                }
                else
                    this.baskets.push(basket);
            })
        },
        //购物车中改变购买商品数量
        BasketsChange(row) {
            this.$nextTick(() => {
                //改变tableData
                let result = this.tableData.filter((item) => { return item.goodsName === row.goodsName; });
                result[0].quantity = row.quantity;
                if(row.quantity == 0)
                    this.baskets.splice(this.baskets.indexOf(row), 1);
            })
        },
        //查看购物车
        seebaskets() {
            this.basketVisible = true;
        },
        //关闭购物车显示
        noseebaskets() {
            this.basketVisible = false;
        },
        //提交订单
        submit() {
            var trade = {};
            trade.skey = this.skey;
            trade.shopId = this.$store.state.info.shopId;
            trade.originSum = this.originSum;
            trade.saleSum = this.saleSum;
            this.axios.post(this.$store.state.tradeurl + '/calculate', trade)
            .then((result) => {
                var temp = result.data;
                if(temp.status === "none") {
                    this.$message({type: 'error', message: '交易密文错误！请检查后重新输入'});
                }
                else {
                    this.basketVisible = false;
                    this.order.total = temp.total;
                    this.order.delta = temp.delta;
                    this.basketVisible = false;
                    this.orderVisible = true;
                }
            }).catch((err) => {
                console.log(err);
            });
        },
        //取消订单提交，返回购物车界面
        cancel() {
            this.needKey = false;
        },
        //商品信息填写完毕
        confirm() {
            this.needKey = true;
        },
        //即将清空购物车
        emptybaskets() {
            this.$confirm('您将清空购物车是否继续？', '提示', {
                confirmButtonText: '继续',
                cancelButtonText: '取消',
                type: 'warning',
                center: true
            }).then(() => {
                //提示框点击确定
                this.baskets = [];
                for(var index in this.tableData)
                    this.tableData[index].quantity = 0;
                this.$message({type: 'info', message: '已清空购物车!'});
            }).catch(() => {
                //提示框点击取消
                this.$message({type: 'info', message: '已取消操作!'});
                this.reload();
            })
        },
        //用户支付完成
        completeOrder() {
            this.axios.post(this.$store.state.tradeurl + '/finish', {skey: this.skey})
            .then((result) => {
                if(result.data) {
                    this.final = result.data;
                    this.finalVisible = true;
                }
                else {
                    this.$message({type: 'error', message: '突然发生了BUG！请重新确认订单信息'});
                    this.orderVisible = false
                    this.basketVisible = true;
                }
            }).catch(() => {
                this.$message({type: 'error', message: '信息传输失败'});
            })
        },
        //用户取消支付
        cancelOrder() {
            this.axios.post(this.$store.state.tradeurl + '/close', {skey: this.skey})
            .then((result) => {
                if(result.data.status === "close") {
                    this.$message({type: 'info', message: '订单未完成，已中止'});
                }
            }).catch(() => {
                this.$message({type: 'error', message: '信息传输失败'});
            })
        }

    },
    computed: {
        //得出非折扣商品总价
        originsum() {
            let totalCost = 0;
            let __this = this;
            for(var index in this.baskets) {
                let single = this.baskets[index];
                if(!single.sale)
                    totalCost += single.price * single.quantity;
            }
            __this.originSum = Number(totalCost.toFixed(2));
            return __this.originSum;
        },
        //得出折扣商品总价
        salesum() {
            let totalCost = 0;
            let __this = this;
            for(var index in this.baskets) {
                let single = this.baskets[index];
                if(single.sale)
                    totalCost += single.salePrice * single.quantity;
            }
            __this.saleSum = Number(totalCost.toFixed(2));
            return __this.saleSum;
        },
        //得到总价
        sum() {
            let __this = this;
            return Number((__this.originSum + __this.saleSum).toFixed(2));
        },
    }
}
</script>