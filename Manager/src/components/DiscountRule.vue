<template>
    <div id='DiscountRule' align='center'>
        <el-card style='width: 70%'>
        <h2>积分获取及兑换比例</h2>
        <el-form :model="creditRuleForm">
            <el-form-item label="获取比限α">
                <el-input v-model.number="creditRuleForm.alpha" type="number" placeholder="消费1元所得最高积分"></el-input>
                <el-button @click="changeAlpha" type="primary">确认修改</el-button>
            </el-form-item>
            <el-form-item label="兑换比例上限β">
                <el-input v-model.number="creditRuleForm.beta" type="number" placeholder="兑换1积分最高抵消金额"></el-input>
                <el-button @click="changeBeta" type="primary">确认修改</el-button>
            </el-form-item>
        </el-form>
        </el-card>

        <br/>
        <el-card style='width: 70%'>
        <h2>用户等级规则</h2>
        <el-form :model="rankRuleForm" label-position="center">
            <el-row :gutter="20">
                <el-col :span="12">
                    <el-form-item label="等级1所需金额">
                        <el-input placeholder="所需金额" :disabled="true"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="兑换比例α'/α">
                        <el-input v-model.number="rankRuleForm.alpha0" type="number" placeholder="兑换比例（0 ~ 1）"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="12">
                    <el-form-item label="等级2所需金额">
                        <el-input v-model.number="rankRuleForm.money1" type="number" placeholder="所需金额"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="兑换比例α'/α">
                        <el-input v-model.number="rankRuleForm.alpha1" type="number" placeholder="兑换比例（0 ~ 1）"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="12">
                    <el-form-item label="等级3所需金额">
                        <el-input v-model.number="rankRuleForm.money2" type="number" placeholder="所需金额"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="兑换比例α'/α">
                        <el-input v-model.number="rankRuleForm.alpha2" type="number" placeholder="兑换比例（0 ~ 1）"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="12">
                    <el-form-item label="等级4所需金额">
                        <el-input v-model.number="rankRuleForm.money3" type="number" placeholder="所需金额"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="兑换比例α'/α">
                        <el-input v-model.number="rankRuleForm.alpha3" type="number" placeholder="兑换比例（0 ~ 1）"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="12">
                    <el-form-item label="等级5所需">
                        <el-input v-model.number="rankRuleForm.money4" type="number" placeholder="所需金额"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="兑换比例α'/α">
                        <el-input v-model.number="rankRuleForm.alpha4" type="number" placeholder="兑换比例（0 ~ 1）"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-form-item label="消费额有效期">
                <el-input v-model.number="rankRuleForm.effectiveTime" type="number" placeholder="在此天数内消费的金额将决定用户等级"><template slot="append">天</template></el-input>
            </el-form-item>
            <el-button @click="changeRankRule" type="primary">确认修改</el-button>
        </el-form>
        </el-card>
    </div>
</template>

<script>
export default {
    name: 'DiscountRule',
    inject: ['reload'],
    data() {
        return {
            creditRuleForm: {
                alpha: 0,
                beta: 0,
            },
            rankRuleForm: {
                effectiveTime: 365, // days
                money1: 0,
                money2: 0,
                money3: 0,
                money4: 0,
                alpha0: 0,
                alpha1: 0,
                alpha2: 0,
                alpha3: 0,
                alpha4: 0,
            }
        }
    },

    created() {
        this.creditRuleForm.alpha = this.$store.state.info.alpha;
        this.creditRuleForm.beta = this.$store.state.info.beta;
        this.rankRuleForm.effectiveTime = this.$store.state.info.effectiveTime;
        this.rankRuleForm.money1 = this.$store.state.info.money1;
        this.rankRuleForm.money2 = this.$store.state.info.money2;
        this.rankRuleForm.money3 = this.$store.state.info.money3;
        this.rankRuleForm.money4 = this.$store.state.info.money4;
        this.rankRuleForm.alpha0 = this.$store.state.info.alpha0;
        this.rankRuleForm.alpha1 = this.$store.state.info.alpha1;
        this.rankRuleForm.alpha2 = this.$store.state.info.alpha2;
        this.rankRuleForm.alpha3 = this.$store.state.info.alpha3;
        this.rankRuleForm.alpha4 = this.$store.state.info.alpha4;
    },

    methods: {
        changeAlpha() {
            var alphadata = {id: this.$store.state.info.id, alpha: this.creditRuleForm.alpha};
            this.axios.post(this.$store.state.baseurl + '/set_alpha', alphadata)
            .then((result) => {
                if(result.data.status === 'alpha') {
                    alert("成功修改获取积分比例上限α");
                    this.$store.state.info.alpha = this.creditRuleForm.alpha;
                }
            }).catch((err) => {
                console.log(err);
            });
        },
        changeBeta() {
            var betadata = {id: this.$store.state.info.id, beta: this.creditRuleForm.beta};
            this.axios.post(this.$store.state.baseurl + '/set_beta', betadata)
            .then((result) => {
                if(result.data.status === 'beta') {
                    alert("成功修改兑换积分比例上限β");
                    this.$store.state.info.alpha = this.creditRuleForm.alpha;
                }
                else
                    this.$message({type: 'error', message: '修改失败'});
            }).catch((err) => {
                console.log(err);
            });
        },
        changeRankRule() {
            var rankruledata = this.rankRuleForm;
            rankruledata.id = this.$store.state.info.id;
            this.axios.post(this.$store.state.baseurl + '/set_rankrule', rankruledata)
            .then((result) => {
                if(result.data.status === 'rankrule') {
                    alert("成功修改用户等级规则及优惠规则");
                    this.$store.state.info.effectiveTime = this.rankRuleForm.effectiveTime;
                    this.$store.state.info.money1 = this.rankRuleForm.money1;
                    this.$store.state.info.money2 = this.rankRuleForm.money2;
                    this.$store.state.info.money3 = this.rankRuleForm.money3;
                    this.$store.state.info.money4 = this.rankRuleForm.money4;
                    this.$store.state.info.alpha0 = this.rankRuleForm.alpha0;
                    this.$store.state.info.alpha1 = this.rankRuleForm.alpha1;
                    this.$store.state.info.alpha2 = this.rankRuleForm.alpha2;
                    this.$store.state.info.alpha3 = this.rankRuleForm.alpha3;
                    this.$store.state.info.alpha4 = this.rankRuleForm.alpha4;
                }
                else
                    this.$message({type: 'error', message: '修改失败'});
            }).catch((err) => {
                console.log(err);
            })
        }

    }
}
</script>

<style>
.el-form-item__content{
    display: flex;
}
.el-form-item__label{
    text-align: right!important;
    width: 7vw
}

</style>