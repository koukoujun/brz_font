<template>
    <div>
        <!--筛选工具-->
        <Row :gutter="24" style="margin-bottom: 10px">
            <Col span="4">
                <Input search enter-button size="small" v-model="keyword" placeholder="输入角色名称" @on-search="query"/>
            </Col>
            <Col span="2">
                <Button type="success" size="small" @click="refresh">
                    <Icon type="ios-refresh"></Icon>
                    刷新
                </Button>
            </Col>
            <Col span="2">
                <Button type="success" size="small" @click="add">
                    <Icon type="ios-add"></Icon>
                    添加
                </Button>
            </Col>
        </Row>
        <!--表格-->
        <Table :data="data.data"  :columns="col"  size="small" highlight-row @on-current-change="row=>curr=row">
            <template slot-scope="{ row, index }" slot="action">
                <Button type="default" size="small" style="margin-right: 5px"   @click="customerActionMenuHandler(name='detail')">查看</Button>
                <Button type="primary" size="small" style="margin-right: 5px"   @click="edit(row)">编辑</Button>
            </template>
        </Table>
        <Page style="margin:10px 0;" :total="data.total" :page-size="data.per_page" size="small" show-total
              show-elevator @on-change="onPage"></Page>
         <!-- 详情-->
        <Drawer title="详情" placement="left" :closable="false" v-model="showDetailDrawer">
            <div v-html="currDetailTable"></div>
        </Drawer>
         <!-- 角色表单-->
        <Modal v-model="formVisible" class-name="vertical-center-modal" :title="formMode==='add'?'添加角色信息':'编辑角色信息'" footer-hide
               @on-cancel="form={brand_right:0}">
            <Form :model="form" :label-width="80" :rules="formInline" ref="form" inline >
                <FormItem label="角色名称" prop="name" >
                    <Input v-model="form.name" size="small" placeholder="请填写角色名称" style="width:9rem" ></Input>
                </FormItem>
                <br>
                <FormItem label="角色权限" ></FormItem>
                <br>
                <!-- 客户管理 -->
                <Row>
                  <FormItem label="客户管理" >
                    <template>
                      <div style="border-bottom: 1px solid #e9e9e9;padding-bottom:6px;margin-bottom:6px;">
                          <Checkbox :indeterminate="indeterminate_a" :value="checkAll_a" @click.prevent.native="handleCheckAll_a">全选</Checkbox>
                      </div>
                      <CheckboxGroup v-model="checkAllGroup_a" @on-change="checkAllGroupChange_a">
                          <Checkbox label="客户列表"></Checkbox>
                          <Checkbox label="添加客户"></Checkbox>
                          <Checkbox label="修改客户"></Checkbox>
                          <Checkbox label="客户详情"></Checkbox>
                      </CheckboxGroup>
                  </template>
                  </FormItem>
                </Row>
                <Row>
                  <FormItem label="跟单管理" >
                    <template>
                      <div style="border-bottom: 1px solid #e9e9e9;padding-bottom:6px;margin-bottom:6px;">
                          <Checkbox :indeterminate="indeterminate_b" :value="checkAll_b" @click.prevent.native="handleCheckAll_b">全选</Checkbox>
                      </div>
                      <CheckboxGroup v-model="checkAllGroup_b" @on-change="checkAllGroupChange_b">
                          <Checkbox label="查看跟单记录"></Checkbox>
                          <Checkbox label="添加跟单记录"></Checkbox>
                          <Checkbox label="编辑跟单记录"></Checkbox>
                      </CheckboxGroup>
                  </template>
                  </FormItem>
                </Row>
                <Row>
                  <FormItem label="收款管理" >
                    <template>
                      <div style="border-bottom: 1px solid #e9e9e9;padding-bottom:6px;margin-bottom:6px;">
                          <Checkbox :indeterminate="indeterminate_c" :value="checkAll_c" @click.prevent.native="handleCheckAll_c">全选</Checkbox>
                      </div>
                      <CheckboxGroup v-model="checkAllGroup_c" @on-change="checkAllGroupChange_c">
                          <Checkbox label="查看收款记录"></Checkbox>
                          <Checkbox label="添加收款记录"></Checkbox>
                          <Checkbox label="修改收款记录"></Checkbox>
                      </CheckboxGroup>
                  </template>
                  </FormItem>
                </Row>
                <Row>
                  <FormItem label="退款管理" >
                    <template>
                      <div style="border-bottom: 1px solid #e9e9e9;padding-bottom:6px;margin-bottom:6px;">
                          <Checkbox :indeterminate="indeterminate_d" :value="checkAll_d" @click.prevent.native="handleCheckAll_d">全选</Checkbox>
                      </div>
                      <CheckboxGroup v-model="checkAllGroup_d" @on-change="checkAllGroupChange_d">
                          <Checkbox label="退款列表"></Checkbox>
                          <Checkbox label="添加退款"></Checkbox>
                          <Checkbox label="修改退款"></Checkbox>
                          <Checkbox label="查看退款详情"></Checkbox>
                          <Checkbox label="撤销退款申请"></Checkbox>
                      </CheckboxGroup>
                  </template>
                  </FormItem>
                </Row>
                <!-- 人事管理 -->
                <Row>
                  <FormItem label="员工管理" >
                    <template>
                      <div style="border-bottom: 1px solid #e9e9e9;padding-bottom:6px;margin-bottom:6px;">
                          <Checkbox :indeterminate="indeterminate_e" :value="checkAll_e" @click.prevent.native="handleCheckAll_e">全选</Checkbox>
                      </div>
                      <CheckboxGroup v-model="checkAllGroup_e" @on-change="checkAllGroupChange_e">
                          <Checkbox label="查看员工"></Checkbox>
                          <Checkbox label="添加员工"></Checkbox>
                          <Checkbox label="修改员工"></Checkbox>
                          <Checkbox label="删除员工"></Checkbox>
                      </CheckboxGroup>
                  </template>
                  </FormItem>
                </Row>
                <Row>
                  <FormItem label="简历管理" >
                    <template>
                      <div style="border-bottom: 1px solid #e9e9e9;padding-bottom:6px;margin-bottom:6px;">
                          <Checkbox :indeterminate="indeterminate_f" :value="checkAll_f" @click.prevent.native="handleCheckAll_f">全选</Checkbox>
                      </div>
                      <CheckboxGroup v-model="checkAllGroup_f" @on-change="checkAllGroupChange_f">
                          <Checkbox label="查看简历"></Checkbox>
                          <Checkbox label="添加简历"></Checkbox>
                          <Checkbox label="修改简历"></Checkbox>
                          <Checkbox label="删除简历"></Checkbox>
                      </CheckboxGroup>
                  </template>
                  </FormItem>
                </Row>
                <Row>
                  <FormItem label="培训管理" >
                    <template>
                      <div style="border-bottom: 1px solid #e9e9e9;padding-bottom:6px;margin-bottom:6px;">
                          <Checkbox :indeterminate="indeterminate_g" :value="checkAll_g" @click.prevent.native="handleCheckAll_g">全选</Checkbox>
                      </div>
                      <CheckboxGroup v-model="checkAllGroup_g" @on-change="checkAllGroupChange_g">
                          <Checkbox label="查看培训"></Checkbox>
                          <Checkbox label="添加培训"></Checkbox>
                          <Checkbox label="修改培训"></Checkbox>
                          <Checkbox label="删除培训"></Checkbox>
                      </CheckboxGroup>
                  </template>
                  </FormItem>
                </Row>
                <Row>
                  <FormItem label="父母补助" >
                    <template>
                      <div style="border-bottom: 1px solid #e9e9e9;padding-bottom:6px;margin-bottom:6px;">
                          <Checkbox :indeterminate="indeterminate_h" :value="checkAll_h" @click.prevent.native="handleCheckAll_h">全选</Checkbox>
                      </div>
                      <CheckboxGroup v-model="checkAllGroup_h" @on-change="checkAllGroupChange_h">
                          <Checkbox label="查看补助"></Checkbox>
                          <Checkbox label="添加补助"></Checkbox>
                          <Checkbox label="修改补助"></Checkbox>
                          <Checkbox label="删除补助"></Checkbox>
                      </CheckboxGroup>
                  </template>
                  </FormItem>
                </Row>
                <!-- 管理员角色管理 -->
                <Row>
                  <FormItem label="角色管理" >
                    <template>
                      <div style="border-bottom: 1px solid #e9e9e9;padding-bottom:6px;margin-bottom:6px;">
                          <Checkbox :indeterminate="indeterminate_i" :value="checkAll_i" @click.prevent.native="handleCheckAll_i">全选</Checkbox>
                      </div>
                      <CheckboxGroup v-model="checkAllGroup_i" @on-change="checkAllGroupChange_i">
                          <Checkbox label="权限列表"></Checkbox>
                          <Checkbox label="角色列表"></Checkbox>
                          <Checkbox label="添加角色"></Checkbox>
                          <Checkbox label="修改角色"></Checkbox>
                      </CheckboxGroup>
                  </template>
                  </FormItem>
                </Row>
                <!-- 管理员管理 -->
                <Row>
                  <FormItem label="角色管理" >
                    <template>
                      <div style="border-bottom: 1px solid #e9e9e9;padding-bottom:6px;margin-bottom:6px;">
                          <Checkbox :indeterminate="indeterminate_j" :value="checkAll_j" @click.prevent.native="handleCheckAll_j">全选</Checkbox>
                      </div>
                      <CheckboxGroup v-model="checkAllGroup_j" @on-change="checkAllGroupChange_j">
                          <Checkbox label="管理员列表"></Checkbox>
                          <Checkbox label="添加管理员"></Checkbox>
                          <Checkbox label="修改管理员"></Checkbox>
                      </CheckboxGroup>
                  </template>
                  </FormItem>
                </Row>
                <!-- 公共权限管理 -->
                <Row>
                  <FormItem label="公共权限" >
                    <template>
                      <div style="border-bottom: 1px solid #e9e9e9;padding-bottom:6px;margin-bottom:6px;">
                          <Checkbox :indeterminate="indeterminate_k" :value="checkAll_k" @click.prevent.native="handleCheckAll_k">全选</Checkbox>
                      </div>
                      <CheckboxGroup v-model="checkAllGroup_k" @on-change="checkAllGroupChange_k">
                          <Checkbox label="Common列表"></Checkbox>
                      </CheckboxGroup>
                  </template>
                  </FormItem>
                </Row>
                  <FormItem>
                      <Button type="primary" @click="submit('form')">提交</Button>
                      <!-- <Button style="margin-left: 8px;" v-show="delete_button" type="error" @click="deletes">删除</Button> -->
                      <Button style="margin-left: 8px" @click="formVisible=false">取消</Button>
                  </FormItem>
           </Form>
       </Modal>
     </div>
</template>
<script>
  import { api } from '@/api/api'
  import { mapMutations } from 'vuex'
  import { apiRequest } from '@/api/http'
  import { dataToTable, objFilter } from '@/libs/util'
  import { roleDetailTable, roleHeadTable, } from '@/libs/data-admin'
  import ChinaArea from '@/libs/China-area'

  export default {
    data () {
      return {
        col: roleHeadTable,//表头
        pageNum: 1,//页码
        data: {},//数据
        curr: {},//当前row
        currDetailTable: '',//详情html
        showDetailDrawer: false,//是否显示简历抽屉
        keyword: '',//搜索关键字
        delete_button:false,//删除是否显示
        //表单选项
        option: {
          fromList: [],
          cityList: [],
          lessonList: [],
        },
        //验证规则
        formInline:{
          name:[
            {required:true,message:"请填写角色名称",trigger:'blur'},
            ],
        },
        //客户表单
        form: {
          role_id:"",
					name: "",
					action_arr: []
        },

        formMode: 'add',//客户表单模式  add 添加  edit 修改
        formVisible: false,//客户表单是否显示

        //时间戳
        timestamp: 0,
        //多选checkbox
        //客户管理
        indeterminate_a: false,
        checkAll_a: false,
        checkAllGroup_a: [],
        //跟单记录
        indeterminate_b: false,
        checkAll_b: false,
        checkAllGroup_b:[],
        //收款记录
        indeterminate_c: false,
        checkAll_c: false,
        checkAllGroup_c:[],
        //退款记录
        indeterminate_d: false,
        checkAll_d: false,
        checkAllGroup_d:[],
        //员工管理
        indeterminate_e: false,
        checkAll_e: false,
        checkAllGroup_e: [],
        //简历管理
        indeterminate_f: false,
        checkAll_f: false,
        checkAllGroup_f:[],
        //培训管理
        indeterminate_g: false,
        checkAll_g: false,
        checkAllGroup_g:[],
        //父母补助
        indeterminate_h: false,
        checkAll_h: false,
        checkAllGroup_h:[],
        //角色管理
        indeterminate_i: false,
        checkAll_i: false,
        checkAllGroup_i:[],
        //管理员管理
        indeterminate_j: false,
        checkAll_j: false,
        checkAllGroup_j:[],
        //公共权限管理
        indeterminate_k: false,
        checkAll_k: false,
        checkAllGroup_k:[],
      }
    },
    mounted () {
      this.initData()
      this.getOption()
    },
    watch: {
      curr (_new) {
        this.currDetailTable = dataToTable(_new, roleDetailTable)
      }
    },
    methods: {
      ...mapMutations([
        'closeTag'
      ]),
      //checkbox-start
      //客户管理
      handleCheckAll_a () {
            if (this.indeterminate_a) {this.checkAll_a = false;} else {this.checkAll_a = !this.checkAll_a;}
            this.indeterminate_a = false;
            if (this.checkAll_a) {this.checkAllGroup_a = ['客户列表', '添加客户', '修改客户','客户详情'];} else {this.checkAllGroup_a = [];}
        },
      checkAllGroupChange_a (data) {
        if (data.length === 4) {this.indeterminate_a = false;this.checkAll_a = true;}
        else if (data.length > 0) {this.indeterminate_a = true;this.checkAll_a = false;}
        else {this.indeterminate_a = false;this.checkAll_a = false;}
      },
      //跟单管理
      handleCheckAll_b () {
            if (this.indeterminate_b) {this.checkAll_b = false;} else {this.checkAll_b = !this.checkAll_b;}
            this.indeterminate_b = false;
            if (this.checkAll_b) {this.checkAllGroup_b = ['查看跟单记录', '添加跟单记录', '编辑跟单记录'];} else {this.checkAllGroup_b = [];}
        },
      checkAllGroupChange_b (data) {
        if (data.length === 3) {this.indeterminate_b = false;this.checkAll_b = true;}
        else if (data.length > 0) {this.indeterminate_b = true;this.checkAll_b = false;}
        else {this.indeterminate_b = false;this.checkAll_b = false;}
      },
      //收款管理
      handleCheckAll_c () {
            if (this.indeterminate_c) {this.checkAll_c = false;} else {this.checkAll_c = !this.checkAll_c;}
            this.indeterminate_c = false;
            if (this.checkAll_c) {this.checkAllGroup_c = ['查看收款记录', '添加收款记录', '修改收款记录'];} else {this.checkAllGroup_c = [];}
        },
      checkAllGroupChange_c (data) {
        if (data.length === 3) {this.indeterminate_c = false;this.checkAll_c = true;}
        else if (data.length > 0) {this.indeterminate_c = true;this.checkAll_c = false;}
        else {this.indeterminate_c = false;this.checkAll_c = false;}
      },
      //退款管理
      handleCheckAll_d () {
            if (this.indeterminate_d) {this.checkAll_d = false;} else {this.checkAll_d = !this.checkAll_d;}
            this.indeterminate_d = false;
            if (this.checkAll_d) {this.checkAllGroup_d = ['退款列表', '添加退款', '修改退款','查看退款详情','撤销退款申请'];} else {this.checkAllGroup_d = [];}
        },
      checkAllGroupChange_d (data) {
        if (data.length === 5) {this.indeterminate_d = false;this.checkAll_d = true;}
        else if (data.length > 0) {this.indeterminate_d = true;this.checkAll_d = false;}
        else {this.indeterminate_d = false;this.checkAll_d = false;}
      },
      //员工管理
      handleCheckAll_e () {
            if (this.indeterminate_e) {this.checkAll_e = false;} else {this.checkAll_e = !this.checkAll_e;}
            this.indeterminate_e = false;
            if (this.checkAll_e) {this.checkAllGroup_e = ['查看员工', '添加员工', '修改员工','删除员工'];} else {this.checkAllGroup_e = [];}
        },
      checkAllGroupChange_e (data) {
        if (data.length === 4) {this.indeterminate_e = false;this.checkAll_e = true;}
        else if (data.length > 0) {this.indeterminate_e = true;this.checkAll_e = false;}
        else {this.indeterminate_e = false;this.checkAll_e = false;}
      },
      //简历管理
      handleCheckAll_f () {
            if (this.indeterminate_f) {this.checkAll_f = false;} else {this.checkAll_f = !this.checkAll_f;}
            this.indeterminate_f = false;
            if (this.checkAll_f) {this.checkAllGroup_f = ['查看简历', '添加简历', '修改简历','删除简历'];} else {this.checkAllGroup_f = [];}
      },
      checkAllGroupChange_f (data) {
        if (data.length === 4) {this.indeterminate_f = false;this.checkAll_f = true;}
        else if (data.length > 0) {this.indeterminate_f = true;this.checkAll_f = false;}
        else {this.indeterminate_f = false;this.checkAll_f = false;}
      },
      //培训管理
      handleCheckAll_g () {
            if (this.indeterminate_g) {this.checkAll_g = false;} else {this.checkAll_g = !this.checkAll_g;}
            this.indeterminate_g = false;
            if (this.checkAll_g) {this.checkAllGroup_g = ['查看培训', '添加培训', '修改培训','删除培训'];} else {this.checkAllGroup_g = [];}
      },
      checkAllGroupChange_g (data) {
        if (data.length === 4) {this.indeterminate_g = false;this.checkAll_g = true;}
        else if (data.length > 0) {this.indeterminate_g = true;this.checkAll_g = false;}
        else {this.indeterminate_g = false;this.checkAll_g = false;}
      },
      //父母补助管理
      handleCheckAll_h () {
            if (this.indeterminate_h) {this.checkAll_h = false;} else {this.checkAll_h = !this.checkAll_h;}
            this.indeterminate_h = false;
            if (this.checkAll_h) {this.checkAllGroup_h = ['查看补助', '添加补助', '修改补助','删除补助'];} else {this.checkAllGroup_h = [];}
      },
      checkAllGroupChange_h (data) {
        if (data.length === 4) {this.indeterminate_h = false;this.checkAll_h = true;}
        else if (data.length > 0) {this.indeterminate_h = true;this.checkAll_h = false;}
        else {this.indeterminate_h = false;this.checkAll_h = false;}
      },
      //管理员角色管理
      handleCheckAll_i () {
            if (this.indeterminate_i) {this.checkAll_i = false;} else {this.checkAll_i = !this.checkAll_i;}
            this.indeterminate_i = false;
            if (this.checkAll_i) {this.checkAllGroup_i = ['权限列表', '角色列表', '添加角色','修改角色'];} else {this.checkAllGroup_i = [];}
      },
      checkAllGroupChange_i (data) {
        if (data.length === 4) {this.indeterminate_i = false;this.checkAll_i = true;}
        else if (data.length > 0) {this.indeterminate_i = true;this.checkAll_i = false;}
        else {this.indeterminate_i = false;this.checkAll_i = false;}
      },
      //管理员管理
      handleCheckAll_j () {
            if (this.indeterminate_j) {this.checkAll_j = false;} else {this.checkAll_j = !this.checkAll_j;}
            this.indeterminate_j = false;
            if (this.checkAll_j) {this.checkAllGroup_j = ['管理员列表', '添加管理员','修改管理员'];} else {this.checkAllGroup_j = [];}
      },
      checkAllGroupChange_j (data) {
        if (data.length === 3) {this.indeterminate_j = false;this.checkAll_j = true;}
        else if (data.length > 0) {this.indeterminate_j = true;this.checkAll_j = false;}
        else {this.indeterminate_j = false;this.checkAll_j = false;}
      },
      //Common管理
      handleCheckAll_k () {
        if (this.indeterminate_k) {this.checkAll_k = false;} else {this.checkAll_k = !this.checkAll_k;}
        this.indeterminate_k = false;
        if (this.checkAll_k) {this.checkAllGroup_k = ['Common列表'];} else {this.checkAllGroup_k = [];}
      },
      checkAllGroupChange_k (data) {
        if (data.length === 1) {this.indeterminate_k = false;this.checkAll_k = true;}
        else if (data.length > 0) {this.indeterminate_k = true;this.checkAll_k = false;}
        else {this.indeterminate_k = false;this.checkAll_k = false;}
      },
      //checkbox-end
      //获取选项
      getOption () {
        apiRequest(api.Common.getOption, {
          'list': 'from_list,city_list,lesson_list'
        }, ret => {
          this.option = {
            fromList: ret.from_list,
            cityList: ret.city_list,
            lessonList: ret.lesson_list,
          }
        })
      },
      initData () {
        const keyword = this.keyword.trim()
        const group = this.group
        const params = {
          pageNum: this.pageNum,
        }
        //关键字筛选
        if (keyword) {
          params.keyword = keyword
        }
        //分组筛选
        if (group) {
          params.group = group
        }

        apiRequest(api.Role.getList,
          params,
          ret => {
             this.data=ret;
             // console.log("roleList.................")
             // console.log(ret.data)
          })
      },
      //页码点击
      onPage (page) {
        this.pageNum = page
        this.initData()
      },
      //搜索按钮点击
      query () {
        this.pageNum = 1
        this.initData()
      },
      //刷新
      refresh () {
        this.pageNum = 1
        this.keyword = ''
        this.group = null
        this.initData()
      },
      //添加
      add () {
        this.formMode = 'add'
        this.formVisible = true
      },
      //编辑
      edit (row) {
        this.formMode = 'edit'
        this.formVisible = true
        this.form = { ...row }
        this.form.action_arr=[]
        this.form.role_id= row.id
      },
      //操作菜单
      customerActionMenuHandler (name) {
        switch (name) {
          case 'detail':
            this.showDetailDrawer = true
            break
          case 'edit':
            this.edit(this.curr)
            this.delete_button=true
            break
        }
      },
      //提交客户表单
      submit (name) {
        //处理多选数据
        let len_a = this.checkAllGroup_a.length;
        if(len_a!=0){
        for(let i=0;i<=len_a;i++){
          if(this.checkAllGroup_a[i]=="客户列表"){this.checkAllGroup_a[i]="Customer@getList"}
          if(this.checkAllGroup_a[i]=="添加客户"){this.checkAllGroup_a[i]="Customer@add"}
          if(this.checkAllGroup_a[i]=="修改客户"){this.checkAllGroup_a[i]="Customer@edit"}
          if(this.checkAllGroup_a[i]=="客户详情"){this.checkAllGroup_a[i]="Customer@detail"}
          this.form.action_arr.push(this.checkAllGroup_a[i])
        }
        //console.log(this.checkAllGroup_a)
        }

        let len_b = this.checkAllGroup_b.length;
        if(len_b!=0){
        for(let i=0;i<=len_b;i++){
          if(this.checkAllGroup_b[i]=="查看跟单记录"){this.checkAllGroup_b[i]="Documentary@getList"}
          if(this.checkAllGroup_b[i]=="添加跟单记录"){this.checkAllGroup_b[i]="Documentary@add"}
          if(this.checkAllGroup_b[i]=="编辑跟单记录"){this.checkAllGroup_b[i]="Documentary@edit"}
          this.form.action_arr.push(this.checkAllGroup_b[i])
        }
        //console.log(this.checkAllGroup_b)
        }

        let len_c = this.checkAllGroup_c.length;
        if(len_c!=0){
        for(let i=0;i<=len_c;i++){
          if(this.checkAllGroup_c[i]=="查看收款记录"){this.checkAllGroup_c[i]="Payment@getList"}
          if(this.checkAllGroup_c[i]=="添加收款记录"){this.checkAllGroup_c[i]="Payment@add"}
          if(this.checkAllGroup_c[i]=="修改收款记录"){this.checkAllGroup_c[i]="Payment@edit"}
          this.form.action_arr.push(this.checkAllGroup_c[i])
        }
        //console.log(this.checkAllGroup_c)
        }

        let len_d = this.checkAllGroup_d.length;
        if(len_d!=0){
        for(let i=0;i<=len_d;i++){
          if(this.checkAllGroup_d[i]=="退款列表"){this.checkAllGroup_d[i]="Refund@getList"}
          if(this.checkAllGroup_d[i]=="添加退款"){this.checkAllGroup_d[i]="Refund@add"}
          if(this.checkAllGroup_d[i]=="修改退款"){this.checkAllGroup_d[i]="Refund@edit"}
          if(this.checkAllGroup_d[i]=="查看退款详情"){this.checkAllGroup_d[i]="Refund@add"}
          if(this.checkAllGroup_d[i]=="撤销退款申请"){this.checkAllGroup_d[i]="Refund@undo"}
          this.form.action_arr.push(this.checkAllGroup_d[i])
        }
        //console.log(this.checkAllGroup_d)
        }

        let len_e = this.checkAllGroup_e.length;
        if(len_e!=0){
        for(let i=0;i<=len_e;i++){
          if(this.checkAllGroup_e[i]=="查看员工"){this.checkAllGroup_e[i]="Employee@getList"}
          if(this.checkAllGroup_e[i]=="添加员工"){this.checkAllGroup_e[i]="Employee@add"}
          if(this.checkAllGroup_e[i]=="修改员工"){this.checkAllGroup_e[i]="Employee@edit"}
          if(this.checkAllGroup_e[i]=="删除员工"){this.checkAllGroup_e[i]="Employee@del"}
          this.form.action_arr.push(this.checkAllGroup_e[i])
        }
        //console.log(this.checkAllGroup_e)
        }

        let len_f = this.checkAllGroup_f.length;
        if(len_f!=0){
        for(let i=0;i<=len_f;i++){
          if(this.checkAllGroup_f[i]=="查看简历"){this.checkAllGroup_f[i]="Cv@getList"}
          if(this.checkAllGroup_f[i]=="添加简历"){this.checkAllGroup_f[i]="Cv@add"}
          if(this.checkAllGroup_f[i]=="修改简历"){this.checkAllGroup_f[i]="Cv@edit"}
          if(this.checkAllGroup_f[i]=="删除简历"){this.checkAllGroup_f[i]="Cv@del"}
          this.form.action_arr.push(this.checkAllGroup_f[i])
        }
        //console.log(this.checkAllGroup_f)
        }

        let len_g = this.checkAllGroup_g.length;
        if(len_g!=0){
        for(let i=0;i<=len_g;i++){
          if(this.checkAllGroup_g[i]=="查看培训"){this.checkAllGroup_g[i]="Training@getList"}
          if(this.checkAllGroup_g[i]=="添加培训"){this.checkAllGroup_g[i]="Training@add"}
          if(this.checkAllGroup_g[i]=="修改培训"){this.checkAllGroup_g[i]="Training@edit"}
          if(this.checkAllGroup_g[i]=="删除培训"){this.checkAllGroup_g[i]="Training@del"}
          this.form.action_arr.push(this.checkAllGroup_g[i])
        }
        //console.log(this.checkAllGroup_g)
        }

        let len_h = this.checkAllGroup_h.length;
        if(len_h){
        for(let i=0;i<=len_h;i++){
          if(this.checkAllGroup_h[i]=="查看补助"){this.checkAllGroup_h[i]="Allowance@getList"}
          if(this.checkAllGroup_h[i]=="添加补助"){this.checkAllGroup_h[i]="Allowance@add"}
          if(this.checkAllGroup_h[i]=="修改补助"){this.checkAllGroup_h[i]="Alowance@edit"}
          if(this.checkAllGroup_h[i]=="删除补助"){this.checkAllGroup_h[i]="Allowance@del"}
          this.form.action_arr.push(this.checkAllGroup_h[i])
        }
        //console.log(this.checkAllGroup_h)
        }

        let len_i = this.checkAllGroup_i.length;
        if(len_i!=0){
        for(let i=0;i<=len_i;i++){
          if(this.checkAllGroup_i[i]=="权限列表"){this.checkAllGroup_i[i]="Role@getList"}
          if(this.checkAllGroup_i[i]=="角色列表"){this.checkAllGroup_i[i]="Role@add"}
          if(this.checkAllGroup_i[i]=="添加角色"){this.checkAllGroup_i[i]="Role@edit"}
          if(this.checkAllGroup_i[i]=="修改角色"){this.checkAllGroup_i[i]="Role@del"}
          this.form.action_arr.push(this.checkAllGroup_i[i])
        }
        //console.log(this.checkAllGroup_i)
        }

        let len_j = this.checkAllGroup_j.length;
        if(len_j!=0){
        for(let i=0;i<=len_j;i++){
          if(this.checkAllGroup_j[i]=="管理员列表"){this.checkAllGroup_j[i]="Admin@add"}
          if(this.checkAllGroup_j[i]=="添加管理员"){this.checkAllGroup_j[i]="Admin@edit"}
          if(this.checkAllGroup_j[i]=="修改管理员"){this.checkAllGroup_j[i]="Admin@del"}
          this.form.action_arr.push(this.checkAllGroup_j[i])
        }
        //console.log(this.checkAllGroup_j)
        }

        let len_k = this.checkAllGroup_k.length;
        if(len_k!=0){
        for(let i=0;i<=len_k;i++){
          if(this.checkAllGroup_k[i]=="Common列表"){this.checkAllGroup_k[i]="Common@getOption"}
          this.form.action_arr.push(this.checkAllGroup_k[i])
        }
        //console.log(this.checkAllGroup_j)
        }
        //输出form权限表单内容
        //console.log("输出form表单..................")
        //console.log(this.form.action_arr)
				this.$refs[name].validate((valid) => {
					if (valid) {
						const apiName = this.formMode === 'add' ? api.Role.add : api.Role.edit
						apiRequest(apiName, this.form, ret => {
							//清空form表单
							this.form = { brand_right: 0 }
							this.formVisible = false
							this.initData()
						})
            this.$Message.success('Success!');
            this.delete_button=false
					}
					else {
						this.$Message.error('Fail!');
					}
				})
      },
      //删除表单
      deletes(){
      	const apiName = this.formMode = api.Admin.del
      	apiRequest(apiName,objFilter(this.form),ret=>{
      		this.$Message.info(ret)
      		//清空form表单
      		this.from={brand_right:0}
      		this.formVisible=false
      		this.initData()
      		this.delete_button=false
      	})
      },
    }
  }

</script>
