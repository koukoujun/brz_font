<template>
  <div>
    <Modal :value="visible" class-name="vertical-center-modal" footer-hide  :title="this.mode==='add'?'添加退款记录':'编辑退款记录'"
           @on-cancel="cancel">
        <Form :model="form" :label-width="120" :rules="formInline" ref="form" inline >
            <FormItem label="退款金额" prop="value">
                <Input v-model="form.value" placeholder="请填写退款金额" size="small" style="width:15rem;" ></Input>
            </FormItem>
            <Row>
              <Col :span="12">
                  <FormItem label="定金/全款">
                      <Select v-model="form.is_deposit" size="small" style="width:7rem;">
                          <Option value="0">定金</Option>
                          <Option value="1">全款</Option>
                      </Select>
                  </FormItem>
              </Col>
              <Col :span="12">
                  <FormItem label="退款事由" prop="origin" >
                      <Select v-model="form.origin" size="small" style="width:7rem;">
                          <Option :value="i" v-for="i in option.paymentOriginList">{{i}}</Option>
                      </Select>
                  </FormItem>
              </Col>
            </Row>
            <Row>
              <Col :span="12">
                  <FormItem label="退款课程" prop="lesson" >
                      <Select v-model="form.lesson" size="small" style="width:7rem;">
                          <Option :value="i" v-for="i in option.lessonList">{{i}}</Option>
                      </Select>
                  </FormItem>
              </Col>
              <Col :span="12">
                  <FormItem label="退款地点"  >
                      <Select v-model="form.join_lesson_city" size="small" style="width:7rem;">
                          <Option :value="i" v-for="i in option.cityList">{{i}}</Option>
                      </Select>
                  </FormItem>
              </Col>
            </Row>
            <Row>
              <Col :span="12">
                  <FormItem label="家长收款账户" prop="bank_account">
                      <Input type="text" v-model="form.bank_account" size="small" placeholder="家长收款账户" ></Input>
                  </FormItem>
              </Col>
              <Col :span="12">
                  <FormItem label="开户人姓名" prop="bank_customer_name">
                      <Input type="text" v-model="form.bank_customer_name" size="small" placeholder="家长开户行姓名" ></Input>
                  </FormItem>
              </Col>
            </Row>
            <Row>
              <Col :span="12">
                  <FormItem label="家长开户行地址">
                      <Input type="text" v-model="form.bank_address" size="small" placeholder="家长开户行地址" ></Input>
                  </FormItem>
              </Col>
              <Col :span="12">
                 <FormItem label="退款方式" prop="way" >
                    <Select v-model="form.way" size="small" style="width:7rem;">
                      <Option :value="i" v-for="i in option.paymentWayList">{{i}}</Option>
                    </Select>
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col :span="12">
                 <FormItem label="退款申请" prop="ask_refund" >
                    <Select v-model="form.ask_refund" size="small" style="width:7rem;">
                      <Option value="1">申请退款</Option>
                      <Option value='0'>无需申请</Option>
                    </Select>
                </FormItem>
              </Col>
              <Col :span="12">
                 <FormItem label="请选择财务" prop="finance_admin" >
                  <Select v-model="form.finance_admin" size="small" placeholder="请选择财务" style="width:7rem;" >
                      <Option :value="i.id" v-for="i in option.financeAdminList">{{i.name}}</Option>
                  </Select>
                </FormItem>
              </Col>
            </Row>
            <FormItem label="退费明细">
                <Input type="textarea" v-model="form.desc" placeholder="请填写退费明细" ></Input>
            </FormItem>
            <FormItem>
                <Button type="primary" @click="submit('form')">提交</Button>
                <Button style="margin-left: 8px" @click="cancel">取消</Button>
            </FormItem>
            </Form>
        </Modal>
        <!-- 图片预览-->
        <Modal title="图片预览" v-model="imgModalVisible" footer-hide>
          <img :src="previewImg" v-if="imgModalVisible" style="width: 100%" alt="">
        </Modal>
     </div>
</template>
<script>
  import { api } from '@/api/api'
  import { mapMutations } from 'vuex'
  import { apiRequest } from '@/api/http'
  import { dataToTable, objFilter,getBaseUrl, getToken } from '@/libs/util'
  import { documentaryDetailTable, documentaryHeadTable, } from '@/libs/data-customer'
  import ChinaArea from '@/libs/China-area'

  export default {
    data () {
      return {
        option: {
          paymentWayList: [],
          paymentOriginList: [],
          cityList: [],
          lessonList: [],
          financeAdminList:[]
        },
        form: {
          src_id:'',
          customer_id: '',//
          payment_id:'',
          value: '',//金额
          is_deposit: '',//定金/全款
          origin: '',//事由
          lesson: '',//课程
          join_lesson_city: '',//参课地点
          bank_account:'',//家长收款账户
          bank_customer_name:'',//开户行姓名
          bank_address:'',//家长开户行地址
          way: '',//退款方式
          voucher_img:'',//财务退款截图
          desc:'',//退费明细
          feedback:'',//财务反馈
          ask_refund:'',//退款申请
          finance_admin:'',//退款申请财务
          type:13,
        },
	    //验证规则
		formInline: {
			value: [
				{ required: true, message: '请填写金额', trigger: 'blur' },
			],
			way:[
				{required:true,message:'退款方式',trigger:'blur'}
			],
			origin: [
				{ required: true, message: '退款事由', trigger: 'blur' }
			],
      lesson:[
      	{required:true,message:'退款课程',trigger:'blur'}
      ],
      bank_account: [
      	{ required: true, message: '收款账户', trigger: 'blur' }
      ],
      bank_customer_name: [
      	{ required: true, message: '开户人姓名', trigger: 'blur' }
      ],
      ask_refund: [
      	{ required: true, message: '退款申请', trigger: 'blur' }
      ],
      finance_admin: [
      	{ required: true, message: '请选择退款申请财务', trigger: 'blur',type:'number' }
      ],
		},
		uploadUrl: getBaseUrl() + api.Common.upload + '?token=' + getToken(),
		uploadList: [],//图片上传截图列表
		defaultUploadList: [],//默认上传列表
		imgModalVisible: false,
		previewImg: '',
		imgUrl:"",
		formMode: 'add',//客户表单模式  add 添加  edit 修改
		docformVisible: false,//客户表单是否显示
      }
    },
    watch: {
      data () {
        if (this.mode === 'edit') {
          const data = this.data
          this.form = {
            id: data.id,
            customer_id: data.customer_id,
            payment_id:data.payment_id,
            value: data.value,
            is_deposit: data.is_deposit + '',
            way: data.way,
            origin: data.origin,
            lesson: data.lesson,
            join_lesson_city: data.join_lesson_city,
            bank_account:data.bank_account,//家长收款账户
            bank_customer_name:data.bank_customer_name,//开户行姓名
            bank_address:data.bank_address,//家长开户行地址
            way:data.way,//退款方式
            voucher_img:data.voucher_img,//财务退款截图
            desc:data.desc,//退费明细
            feedback:data.feedback,//财务反馈
          }
        }
      }
    },
    mounted () {
      this.getOption()
	    //this.uploadList = this.$refs.upload.fileList
    },
    props: ['id','customer_id', 'payment_id','visible', 'mode', 'data'],
    methods: {
      //获取选项
      getOption () {
        apiRequest(api.Common.getOption, {
          'list': 'payment_way_list,payment_origin_list,city_list,lesson_list,financeAdminList'
        }, ret => {
          this.option = {
            paymentWayList: ret.payment_way_list,
            paymentOriginList: ret.payment_origin_list,
            cityList: ret.city_list,
            lessonList: ret.lesson_list,
            financeAdminList:ret.financeAdminList
          }
        })
      },
	  //图片上传开始
	  //图片上传成功
	  handleImgSuccess (response, file, fileList) {
	    file.url = response
	  	this.form.voucher_img=file.url;
	  },
	  //图片上传预览
	  handleView (img) {
	    this.previewImg = img
	    this.imgModalVisible = true
	  },
	  //表格图片预览
	  handleViews(url) {
	    this.imgUrl = url;
	    this.visible = true;
	  },
	  handleBeforeUpload () {
	    const check = this.uploadList.length < 5
	    if (!check) {
	  	this.$Notice.warning({
	  	  title: '最多上传五张截图'
	  	})
	    }
	    return check
	  },
	  handleFormatError (file) {
	    this.$Notice.warning({
	  	title: '文件格式不正确',
	  	desc: '文件格式 ' + file.name + ' 不正确，请选择jpg或png图片文件'
	    })
	  },
	  handleMaxSize (file) {
	    this.$Notice.warning({
	  	title: '文件太大！',
	  	desc: '文件  ' + file.name + ' 太大了, 请不要超过 2M.'
	    })
	  },
	  //删除已上传的图片
	  handleRemove (file) {
	    const fileList = this.$refs.upload.fileList
	    this.$refs.upload.fileList.splice(fileList.indexOf(file), 1)
	  },
	  //图片上传结束
    //隐藏表单
      cancel () {
        this.form = { brand_right: 0 }
        this.$emit('hideForm')
      },
      //提交表单
      submit (name) {
        	this.$refs[name].validate((valid) => {
        	if (valid) {
            const params = { ...this.form }
            params.customer_id = this.customer_id
            params.payment_id=this.payment_id
            params.src_id=this.id
            params.pay_id=this.payment_id
            const apiName = this.mode === 'add' ? api.Refund.add : api.Refund.edit

            apiRequest(apiName, params, ret => {
              this.$emit('success')
              this.$Message.info(ret)
              this.cancel()
              this.$emit('submit')
            })

            this.$Message.success('Success!');
            this.delete_button=false
            }
            else {
            	this.$Message.error('Fail!');
            }
          })
      },
    }
  }
</script>
<style>
    .demo-upload-list {
        display: inline-block;
        width: 60px;
        height: 60px;
        text-align: center;
        line-height: 60px;
        border: 1px solid transparent;
        border-radius: 4px;
        overflow: hidden;
        background: #fff;
        position: relative;
        box-shadow: 0 1px 1px rgba(0, 0, 0, .2);
        margin-right: 4px;
    }

    .demo-upload-list img {
        width: 100%;
        height: 100%;
    }

    .demo-upload-list-cover {
        display: none;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background: rgba(0, 0, 0, .6);
    }

    .demo-upload-list:hover .demo-upload-list-cover {
        display: block;
    }

    .demo-upload-list-cover i {
        color: #fff;
        font-size: 20px;
        cursor: pointer;
        margin: 0 2px;
    }
</style>
