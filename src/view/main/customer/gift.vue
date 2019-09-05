<template>
    <div>
        <!--筛选工具-->
        <Row :gutter="24" style="margin-bottom: 10px">
            <Col span="4">
                <Input search enter-button size="small" v-model="keyword" placeholder="输入姓名/电话" @on-search="query"/>
            </Col>
            <Col span="2">
                <Button type="success" size="small" @click="refresh">
                    <Icon type="ios-refresh"></Icon>
                    刷新
                </Button>
            </Col>
        </Row>
        <!--表格-->
        <Table :data="data.data"  :columns="col"  size="small" highlight-row @on-current-change="row=>curr=row">
            <template slot-scope="{ row, index }" slot="action">
                <Dropdown trigger="click"   @on-click="customerActionMenuHandler" placement="left" >
                    <Button size="small">
                        操作
                        <Icon type="ios-arrow-down"></Icon>
                    </Button>
                    <DropdownMenu slot="list">
                        <DropdownItem name="detail">查看详情</DropdownItem>
                        <DropdownItem name="edit">编辑修改</DropdownItem>
						<DropdownItem name="refound">添加退款</DropdownItem>
                    </DropdownMenu>
                </Dropdown>
            </template>
        </Table>
        <Page style="margin:10px 0;" :total="data.total" :page-size="data.per_page" size="small" show-total
              show-elevator
              @on-change="onPage"></Page>
         <!-- 详情-->
        <Drawer title="详情" placement="left" :closable="false" v-model="showDetailDrawer">
            <div v-html="currDetailTable"></div>
        </Drawer>
         <!-- 简历表单-->
        <Modal v-model="formVisible" class-name="vertical-center-modal" :title="formMode==='add'?'添加缴费记录':'编辑缴费记录'" footer-hide
               @on-cancel="form={brand_right:0}">
            <Form :model="form" :label-width="120" :rules="formInline" ref="form" inline >
					<FormItem label="交费金额" prop="value">
							<Input v-model="form.value" size="small" type="number" placeholder="请填写金额"></Input>
					</FormItem>
					


					<FormItem label="定金/全款" prop="is_deposit_name" >
						<RadioGroup v-model="form.is_deposit_name">
							<Radio label="定金">定金</Radio>
							<Radio label="全款">全款</Radio>
						</RadioGroup>
					</FormItem>
					<FormItem label="缴费方式" prop="way" >
							<Select v-model="form.way" size="small" >
									<Option value="支付宝">支付宝</Option>
									<Option value="微信">微信</Option>
									<Option value="公对公">公对公</Option>
							</Select>
					</FormItem>
					

					<Row>
						<Col span="12">
							<FormItem label="交费事由">
								  <Select v-model="form.origin" size="small">
									  <Option :value="i" v-for="i in option.paymentOriginList">{{i}}</Option>
								  </Select>
							</FormItem>	
						</Col>
						<Col span="12">
							<FormItem label="课程类别" prop="lesson">
									<Select v-model="form.lesson" size="small" >
										<Option :value="i" v-for="i in option.lessonList">{{i}}</Option>	
									</Select>
							</FormItem>
						</Col>
					</Row>
					 <Row>
						<Col span="12">
							<FormItem label="交费时间" prop="pay_time"  >
									<DatePicker type="date"   placeholder="Pay time" v-model="form.pay_time"></DatePicker>
							</FormItem>
						</Col>
						<Col span="12">
							
							<FormItem label="参课时间" prop="join_lesson_time"  >
									<DatePicker type="date"  placeholder="Select date" v-model="form.join_lesson_time"></DatePicker>
							</FormItem>
						</Col>
					</Row>

					 <Row>
						<Col span="12">
							<FormItem label="参课城市" prop="join_lesson_city" >
									<Select v-model="form.join_lesson_city" size="small">
										<Option :value="i" v-for="i in option.cityList">{{i}}</Option>
									</Select>
							</FormItem>
						</Col>
						<Col span="12">
							<FormItem label="参课状态" prop="is_join_name">
									<Select v-model="form.is_join" size="small">
									  <Option value="0">未参课</Option>
									  <Option value="1">已参课</Option>
									</Select>
							</FormItem>
						</Col>
					</Row>

					<Row>
						<Col :span="12">
							<FormItem label="落款地" prop="area">
								  <Cascader :data="ChinaArea" size="small" v-model="form.area"></Cascader>
							</FormItem>
						</Col>
						<Col :span="12">
							<FormItem label="是否到账" prop="is_complete_name" >
									<Select v-model="form.is_complete_name" size="small">
									  <Option value="到账">到账</Option>
									  <Option value="未到账">未到账</Option>
									</Select>
							</FormItem>
						</Col>
					</Row>
					<Row>
						<Col :span="12">
						   <FormItem label="凭证">
								<Input v-model="form.voucher_img" size="small" placeholder="凭证" ></Input>
							</FormItem>
						</Col>
						<Col :span="12">
						   <FormItem label="发票状态">
								<Select v-model="form.invoice_status" size="small" placeholder="发票状态" >
								    <Option value="0">已开发票</Option>
								    <Option value="1">未开发票</Option>
								</Select>
							</FormItem>
						</Col>
					</Row>
					<Row>
						<Col :span="12">
							<FormItem label="退款状态">
								  <Select v-model="form.refund_status" size="small" placeholder="退款状态" >
								      <Option value="0">已退款</Option>
								      <Option value="1">未退款</Option>
								  </Select>
							</FormItem>
						</Col>
						<Col :span="12">
							<FormItem label="退款信息">
								  <Input v-model="form.refund_status_name" size="small" placeholder="退款信息" ></Input>
							</FormItem>
						</Col>
					</Row>

					<FormItem label="发票信息">
						<Input v-model="form.invoice_status_name" size="small" placeholder="发票信息" ></Input>
					</FormItem>

                <Row>
                    <Col :span="24">
                        <FormItem label="备注">
                            <Input type="textarea" placeholder="缴费备注" :autosize="{minRows: 4,maxRows: 6}"
                                   v-model="form.desc"></Input>
                        </FormItem>
                    </Col>
                </Row>
                <FormItem>
                    <Button type="primary" @click="submit('form')">提交</Button>
                    <Button style="margin-left: 8px" @click="formVisible=false">取消</Button>
                </FormItem>
            </Form>
        </Modal>
		
		       <RefoundForm :visible="docFormVisible" :customer-id="curr.id" mode="add" @hideForm="docFormVisible=false">
				   
			   </RefoundForm>

    </div>
</template>
<script>
  import { api } from '@/api/api'  //引入api配置
  import { mapMutations } from 'vuex'  //状态数据存储
  import { apiRequest } from '@/api/http' //引入请求文件
  import { dataToTable, objFilter } from '@/libs/util' //引入结构化表格和表单数据过滤
  import { paymentDetailTable, paymentHeadTable, } from '@/libs/data-customer'//引入表头和详情数据文件
  import ChinaArea from '@/libs/China-area'
  import RefoundForm from '@/view/main/customer/formmodal/RefoundForm.vue'

  export default {
	components:{RefoundForm},
    data () {
      return {
        col: paymentHeadTable,//表头数据
        pageNum: 1,//页码
        data: {},//数据
        curr: {},//当前row
        currDetailTable: '',//详情html
        showDetailDrawer: false,//是否显示详情抽屉
        keyword: '',//搜索关键字
        ChinaArea: ChinaArea,//中国行政区数据
        //表单选项
        option: {
          fromList: [], //用户来源数据
          cityList: [], //城市列表数据
          lessonList: [], //课程列表数据
		  paymentOriginList: [],//交费事由列表
        },
        //客户表单
        form: {			
			id: "",
			customer_id: "",
			admin_id: "",
			value: "",
			origin: "",
			is_deposit: "",
			way: "",
			pay_time: "",
			lesson: "",
			join_lesson_city: "",
			join_lesson_time: "",
			final_city: "",
			voucher_img: "",
			desc: "",
			is_complete: "",
			complete_time: "",
			is_join: "",
			create_at: "",
			update_at: "",
			customer_name: "",
			phone: "",
			city: "",
			admin_name: "",
			invoice_id: "",
			invoice_status: "",
		  refund_id: "",
			refund_status: "",
			invoice_status_name: "",
			refund_status_name: "",
			payment_id: "",
			is_deposit_name: "",
			is_join_name: "",
			is_complete_name: ""
        },
		//验证规则
		formInline: {
				value: [
					{ required: true, message: '请填写金额', trigger: 'blur' },
				],
				pay_time: [
					{ required: true, message: '请填写缴费时间', trigger: 'blur',pattern:/.+/ },
				],
				way:[
					{required:true,message:'缴费方式',trigger:'blur'}
				],
				paymentOriginList: [
					{ required: true, message: '请选择缴费原因', trigger: 'blur' }
				]
		},
        formMode: 'add',//客户表单模式  add 添加  edit 修改
        formVisible: false,//客户表单是否显示
		
		//是否显示退款表单
		docFormVisible:false,


        //时间戳
        timestamp: 0,
      }
    },
	//页面渲染完成后调用
    mounted () {
      this.initData()
      this.getOption()
    },
    watch: {
      curr (_new) {
        this.currDetailTable = dataToTable(_new, paymentDetailTable)
      }
    },
    methods: {
      ...mapMutations([
        'closeTag'
      ]),
      //获取选项
      getOption () {
        apiRequest(api.Common.getOption, {
          'list': 'from_list,city_list,lesson_list,payment_origin_list'
        }, ret => {
          this.option = {
            fromList: ret.from_list,
            cityList: ret.city_list,
            lessonList: ret.lesson_list,
			paymentOriginList:ret.payment_origin_list,
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

        apiRequest(api.Payment.getList,
          params,
          ret => {
            this.data = ret
			let len = this.data.data.length;
			for(let i=0;i<len;i++){
				this.data.data[i].pay_time=this.data.data[i].pay_time+'';
				this.data.data[i].join_lesson_time=this.data.data[i].join_lesson_time.toString()
			}
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
      //添加员工
      add () {
        this.formMode = 'add'
        this.formVisible = true
      },
      //编辑
      edit (row) {
        this.formMode = 'edit'
        this.formVisible = true
        this.form = { ...row }
        this.form.id = row.id
        this.form.area = [row.province, row.city]
      },
      //操作菜单
      customerActionMenuHandler (name) {
        switch (name) {
          case 'detail':
            this.showDetailDrawer = true
            break
          case 'edit':
            this.edit(this.curr)
            break
          case 'refound':
            this.docFormVisible = true
            break
          case 'addPay':
            this.payFormVisible = true
            break
        }
      },
      //提交表单
      submit (name) {
		 this.$refs[name].validate((valid) => {
			if (valid) {
					
					const apiName = this.formMode === 'add' ? api.Payment.add : api.Payment.edit
					apiRequest(apiName, objFilter(this.form), ret => {
						//清空form表单
						this.form = { brand_right: 0 }
						this.formVisible = false
						this.initData()
					})	
					this.$Message.success('Success!');
			} 
			else {
					this.$Message.error('Fail!');
			}
		})
      },
    }
  }

</script>
