<template>
    <div>
        <div class="handle-box">
            <el-button type="primary" @click="handleClick(undefined, 'modify')">新建应用</el-button>
        </div>
        <el-table
            :data="list"
            border
            stripe
            :header-cell-style="{textAlign: 'center'}"
            style="width: 100%">
            <el-table-column
                prop="appCode"
                label="应用编号"
                width="180">
            </el-table-column>
            <el-table-column
                prop="appName"
                label="应用名称"
                width="180">
            </el-table-column>
            <el-table-column
                prop="appType"
                label="应用类型"
                width="180"
                :formatter="typeFormat">
            </el-table-column>
            <el-table-column
                prop="appKey"
                label="应用Key">
            </el-table-column>
            <el-table-column
                prop="appSecret"
                label="应用Secret">
            </el-table-column>
            <el-table-column
                label="当前状态"
                width="80">
                <template slot-scope="scope">
                    <el-switch
                        v-model="scope.row.status"
                        :active-value="1"
                        :inactive-value="0"
                        disabled>
                    </el-switch>
                </template>
            </el-table-column>
            <el-table-column
                label="操作"
                width="130">
                <template slot-scope="scope">
                    <el-button @click="handleClick(scope.row.id, 'view')" type="text" size="small">查看</el-button>
                    <el-button @click="handleClick(scope.row.id, 'modify')" type="text" size="small">编辑</el-button>
                    <el-button @click="deleteRecord(scope.row.appKey)" type="text" size="small">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage + 1"
            :page-sizes="pageSizes"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="totalCount == -1 ? (totalCount + 1) : totalCount"
            v-if="list && list.length > 0">
        </el-pagination>
        <!-- 查看 弹框 -->
        <el-dialog :title="`查看应用`" :visible.sync="dialogViewVisible" modal width="60%" top="8vh" class="view">
            <el-form :model="form" label-width="170px" :inline="true" disabled readonly data-sign="noborder">
                <el-form-item label="应用编号">
                    <el-input v-model="form.appCode" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="应用名称">
                    <el-input v-model="form.appName" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="所属租户">
                    <el-select v-model="form.tenantId" placeholder="请选择所属租户">
                        <el-option
                        v-for="item in tenantOpts"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="AppKey">
                    <el-input v-model="form.appKey" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="AppSecret">
                    <el-input v-model="form.appSecret" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="PublicKey" prop="publicKey">
                    <el-input v-model="form.publicKey" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="应用标识Token">
                    <el-input v-model="form.appToken" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="应用类型">
                    <el-select v-model="form.appType" placeholder="请选择">
                        <el-option
                            v-for="item in appTypeOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="有效期">
                    <el-date-picker type="date" placeholder="有效期" v-model="form.expireTime"></el-date-picker>
                </el-form-item>
                <el-form-item label="应用链接URL">
                    <el-input v-model="form.linkUrl" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="应用图标">
                    <el-input v-model="form.iconUrl" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="应用版本号">
                    <el-input v-model="form.versionNumber" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="(支付中心)合约截止日期">
                    <el-date-picker type="date" placeholder="(支付中心)合约截止日期" v-model="form.contractMaxDate"></el-date-picker>
                </el-form-item>
                <el-form-item label="当前状态(开启/禁止)">
                    <el-switch v-model="form.status" :active-value="1" :inactive-value="0"></el-switch>
                </el-form-item>
                <el-form-item label="应用回调接口地址">
                  <el-input v-model="form.appApiUrl" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="备注">
                    <el-col :span="24">
                        <el-input type="textarea" v-model="form.description"></el-input>
                    </el-col>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogViewVisible = false">取 消</el-button>
                <el-button type="primary" @click="dialogViewVisible = false">确 定</el-button>
            </div>
        </el-dialog>
        <!-- 修改/新建 弹框 -->
        <el-dialog :title="isCreate ? `新建应用` : `修改应用`" :visible.sync="dialogModifyVisible" modal width="60%" top="8vh" class="modify">
            <el-alert
                title="平台公钥(PublicKey)只显示一次，请牢记！若忘，需重置！"
                type="warning"
                show-icon
                close-text="知道了">
            </el-alert>
            <el-form :model="form" label-width="180px" :inline="true" :rules="rules" ref="applicationForm">
                <el-form-item label="应用编号" prop="appCode">
                    <el-input v-model="form.appCode" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="应用名称" prop="appName">
                    <el-input v-model="form.appName" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="所属租户" prop="tenantId">
                    <el-select v-model="form.tenantId" placeholder="请选择所属租户">
                        <el-option
                        v-for="item in tenantOpts"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="appKey" prop="appKey">
                    <el-input disabled v-model="form.appKey" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="appSecret" prop="appSecret">
                    <el-input disabled v-model="form.appSecret" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="平台publicKey" prop="plantFormPublicKey" label-width="130px">

                    <el-input v-model="form.plantFormPublicKey" auto-complete="off" disabled>
                        <el-button slot="append" @click="genRsa2Key">重置</el-button>
                    </el-input>
                </el-form-item>
                <el-form-item label="publicKey" prop="publicKey">
                    <el-input v-model="form.publicKey" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="应用标识Token" prop="appToken">
                    <el-input v-model="form.appToken" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="应用类型" prop="appType" label-width="150px">
                    <el-select v-model="form.appType" placeholder="请选择">
                        <el-option
                            v-for="item in appTypeOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="有效期" prop="expireTime">
                    <el-date-picker type="date" placeholder="有效期" v-model="form.expireTime"></el-date-picker>
                </el-form-item>
                <el-form-item label="应用链接URL" prop="linkUrl">
                    <el-input v-model="form.linkUrl" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="应用图标" prop="iconUrl">
                    <el-input v-model="form.iconUrl" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="应用版本号" prop="versionNumber">
                    <el-input v-model="form.versionNumber" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="(支付中心)合约截止日期" prop="contractMaxDate">
                    <el-date-picker type="date" placeholder="(支付中心)合约截止日期" v-model="form.contractMaxDate"></el-date-picker>
                </el-form-item>
                <el-form-item label="当前状态(开启/禁止)" prop="status">
                    <el-switch v-model="form.status" :active-value="1" :inactive-value="0"></el-switch>
                </el-form-item>
                <el-form-item label="应用回调接口地址" prop="appApiUrl">
                  <el-input v-model="form.appApiUrl"  auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="备注" prop="description">
                    <el-col :span="24">
                        <el-input type="textarea" v-model="form.description"></el-input>
                    </el-col>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogModifyVisible = false">取 消</el-button>
                <el-button type="primary" @click="formSubmit('applicationForm')">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import {mapState, mapActions, mapMutations} from 'vuex'
    import api from '../../../api/applicationApi'

    export default {
        data() {
            return {
                currentPage: 0,
                // pageSize: 10,
                pageSizes: [10, 20, 50, 100],

                appTypeOptions: [
                    {
                        label: '商城',
                        value: 1
                    },
                    {
                        label: '轻应用',
                        value: 2
                    }
                ],
                tenantOpts: [
                    {
                        label: '来康郡',
                        value: 1
                    },
                    {
                        label: '洛阳',
                        value: 2
                    }
                ],

                dialogViewVisible: false,

                tooltipShow: true,

                dialogModifyVisible: false,
                isCreate: false,
                form: {
                    appCode: '',
                    appName: '',
                    appType: '',
                    appKey: '',
                    appSecret: '',
                    appToken: '',
                    expireTime: '',
                    linkUrl: '',
                    iconUrl: '',
                    versionNumber: '',
                    contractMaxDate: '',
                    status: 1,
                    appApiUrl: '',
                    description: '',
                },
                rules: {
                    appCode: [
                        { required: true, message: '请输入应用编号', trigger: 'blur' }
                    ],
                    appName: [
                        { required: true, message: '请输入应用名称', trigger: 'blur' }
                    ],
                    contractMaxDate: [
                        { required: true, message: '请选择(支付中心)合约截止日', trigger: 'change' }
                    ],
                    publicKey: [
                        { required: true, message: '请输入publicKey', trigger: 'blur' }
                    ],
                    expireTime: [
                        { required: true, message: '请选择有效期', trigger: 'change' }
                    ],
                    tenantId: [
                        { required: true, message: '请选择所属租户', trigger: 'change' }
                    ],
                    appApiUrl: [
                        { required: true, message: '请输入应用回调接口地址', trigger: 'blur' }
                    ]
                }
            };
        },
        computed: {
            ...mapState('application', [
                'list',
                'totalCount',
                'pageSize'
            ])
        },
        methods: {
            handleSizeChange(val) {
                // this.pageSize = val;
                this.setPageSize(val);
                this.getList();
            },
            handleCurrentChange(val) {
                this.currentPage = val - 1;
                this.getList();
            },
            handleClick(id, type) {
                if(type == 'modify'){
                    this.isCreate = id != undefined ? false : true;

                    // 清空表单
                    this.$set(this, 'form', this.$options.data().form);
                    this.$refs['applicationForm'] && this.$refs['applicationForm'].resetFields();  // 重置表单，并清除验证提示

                    if(!this.isCreate){
                        this.getDataHandle(id, type);
                    }else{
                        this.genAppKeySecret();
                        this.genRsa2Key();
                    }
                }else if(type == 'view'){
                    this.getDataHandle(id, type);
                }
                this[`dialog${type.toLowerCase().replace(/( |^)[a-z]/g, L => L.toUpperCase())}Visible`] = true;

            },
            deleteRecord(id){
                this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let loading = this.$loading({
                        lock: true,
                        text: 'Loading',
                        spinner: 'el-icon-loading',
                        background: 'rgba(0, 0, 0, 0.7)'
                    });
                    api.delete(id)
                        .then(res => {
                            loading.close();
                            if(res.data.success && res.data.data.operationResult){
                                this.$message({
                                    type: 'success',
                                    message: '删除成功!'
                                });
                                this.getList();
                            }else{
                                if(res.data.message){
                                    this.$alert(res.data.message, '提示', {
                                        confirmButtonText: '确定'
                                    });
                                }else{
                                    this.$alert('删除失败!', '提示', {
                                        confirmButtonText: '确定'
                                    });
                                }
                            }
                        })
                        .catch(err => {
                            loading.close();
                            console.log(err);
                            this.$alert('删除失败!', '提示', {
                                confirmButtonText: '确定'
                            });
                        });

                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            formSubmit(formname){
                this.$refs[formname].validate((valid) => {
                    if (valid) {
                        this.saveformHandle(this.form);
                    } else {
                        console.log('error submit!');
                        return false;
                    }
                });
            },
            getList(){
                let loading = this.$loading({
                    lock: true,
                    text: 'Loading',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.7)'
                });

                this.getListData({
                    startTime: new Date('1970'),
                    endTime: new Date(),
                    isPager: 1,
                    pageNum: this.currentPage,
                    pageSize: this.pageSize,
                })
                .then(res => {
                    if(res.data.success){
                        loading && loading.close();
                    }else{
                        loading.close();
                        this.$alert(res.data.message, '提示', {
                            confirmButtonText: '确定'
                        });
                    }
                })
                .catch(err => {
                    console.log(err, typeof err);
                    loading && loading.close();
                    this.$alert('网络问题', '提示', {
                        confirmButtonText: '确定'
                    });
                });
            },
            genAppKeySecret(){
                let target = document.querySelector(`.modify .el-dialog`);
                let loading = this.$loading({
                    target,
                    text: 'Loading'
                });
                api.getAppKeySecret({})
                .then((res) => {
                    loading.close();
                    if(res.data.success){
                        this.$set(this.form, 'appKey', res.data.data.data.appKey);
                        this.$set(this.form, 'appSecret', res.data.data.data.appSecret);
                    }else{
                        this.$alert(res.data.message, '提示', {
                            confirmButtonText: '确定'
                        });
                    }
                })
                .catch((err) => {
                    loading.close();
                    console.log(err);
                    this.$alert('网络问题', '提示', {
                        confirmButtonText: '确定'
                    });
                });
            },
            genRsa2Key(){
                let target = document.querySelector(`.modify .el-dialog`);
                let loading = this.$loading({
                    target,
                    text: 'Loading'
                });
                api.getRsa2Key({})
                .then((res) => {
                    loading.close();
                    if(res.data.success){
                        this.$set(this.form, 'plantFormPublicKey', res.data.data.data.publicKey);  //  不进行存储
                        this.$set(this.form, 'privateKey', res.data.data.data.privateKey);
                    }else{
                        this.$alert(res.data.message, '提示', {
                            confirmButtonText: '确定'
                        });
                    }
                })
                .catch((err) => {
                    loading.close();
                    console.log(err);
                    this.$alert('网络问题', '提示', {
                        confirmButtonText: '确定'
                    });
                });
            },
            getDataHandle(id, type){
                let target = document.querySelector(`.${type} .el-dialog`);
                let loading = this.$loading({
                    target,
                    text: 'Loading'
                });

                api.getList({id, pageNum: 0, pageSize: 1, startTime: new Date('1970'), endTime: new Date(),})
                    .then(res => {
                        loading.close();
                        if(res.data.success){
                            this.$set(this, 'form', res.data.data.appInfoList[0]);
                        }else{
                            this.$alert(res.data.message, '提示', {
                                confirmButtonText: '确定'
                            });
                        }
                    })
                    .catch(err => {
                        loading.close();
                        console.log(err);
                        this.$alert('网络问题', '提示', {
                            confirmButtonText: '确定'
                        });
                    });
            },
            saveformHandle(data){
                let target = document.querySelector(`.modify .el-dialog`);
                let loading = this.$loading({
                    target,
                    text: 'Loading'
                });
                if(this.isCreate){
                    api.create(data)
                        .then(res => {
                            loading.close();
                            if(res.data.success){
                                this.$alert('保存成功！', '提示', {
                                    confirmButtonText: '确定'
                                })
                                .then(() => {
                                    this.dialogModifyVisible = false;
                                    this.getList();
                                });
                            }else{
                                this.$alert(res.data.message, '提示', {
                                    confirmButtonText: '确定'
                                });
                            }
                        })
                        .catch(err => {
                            console.log(err);
                            loading.close();
                            this.$alert('网络问题', '提示', {
                                confirmButtonText: '确定'
                            });
                        });
                }else{
                    api.update(data)
                        .then(res => {
                            loading.close();
                            if(res.data.success){
                                this.$alert('保存成功！', '提示', {
                                    confirmButtonText: '确定'
                                })
                                .then(() => {
                                    this.dialogModifyVisible = false;
                                    this.getList();
                                });
                            }else{
                                this.$alert(res.data.message, '提示', {
                                    confirmButtonText: '确定'
                                });
                            }
                        })
                        .catch(err => {
                            console.log(err);
                            loading.close();
                            this.$alert('网络问题', '提示', {
                                confirmButtonText: '确定'
                            });
                        });
                }
            },
            typeFormat(row){
                return row.appType == 1 ? '商城' : row.appType == 2 ? '轻应用' : '--';
            },
            ...mapActions('application', [
                'getListData',
            ]),
            ...mapMutations('application', [
                'setPageSize'
            ])
        },
        mounted(){
            // this.getList();
        }
    };
</script>

<style lang="less" scoped>
    @import "../../../assets/less/elementUiFix.less";

    .el-alert.el-alert--warning{margin-bottom: 20px;}
</style>
