<template>
  <div>
    <Modal :value="visible" class-name="vertical-center-modal" footer-hide
           :title="this.mode==='add'?'添加收款记录':'编辑收款记录'"
           @on-cancel="cancel">
        <Form :model="form" :label-width="120" :rules="formInline" ref="form" inline >
        <FormItem label="交费金额" prop="value">
            <Input v-model="form.value" size="small" type="number" placeholder="请填写金额"></Input>
        </FormItem>
        <Row>
          <Col span="12">
            <FormItem label="定金/全款" prop="is_deposit" >
              <RadioGroup v-model="form.is_deposit">
                <Radio label="定金">定金</Radio>
                <Radio label="全款">全款</Radio>
              </RadioGroup>
            </FormItem>
           </Col>
           <Col span="12">
            <FormItem label="缴费方式" prop="way" >
                <Select v-model="form.way" size="small" style="width:7rem;" >
                    <Option value="支付宝">支付宝</Option>
                    <Option value="微信">微信</Option>
                    <Option value="公对公">公对公</Option>
                </Select>
            </FormItem>
           </Col>
          </Row>
          <Row>
            <Col span="12">
              <FormItem label="交费事由" prop="origin">
                  <Select v-model="form.origin" size="small" style="width:7rem;">
                    <Option :value="i" v-for="i in option.paymentOriginList">{{i}}</Option>
                  </Select>
              </FormItem>
            </Col>
            <Col span="12">
              <FormItem label="课程类别" prop="lesson">
                  <Select v-model="form.lesson" size="small" style="width:7rem;" >
                    <Option :value="i" v-for="i in option.lessonList">{{i}}</Option>
                  </Select>
              </FormItem>
            </Col>
         </Row>
         <Row>
            <Col span="12">
              <FormItem label="交费时间" prop="pay_time"  >
                  <DatePicker type="date"   placeholder="Pay time" v-model="form.pay_time" size="small" ></DatePicker>
              </FormItem>
            </Col>
            <Col span="12">
              <FormItem label="参课时间" prop="join_lesson_time"  >
                  <DatePicker type="date"  placeholder="Select date" v-model="form.join_lesson_time" size="small" ></DatePicker>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="12">
              <FormItem label="参课城市" prop="join_lesson_city" >
                  <Select v-model="form.join_lesson_city" size="small" style="width:7rem;" >
                    <Option :value="i" v-for="i in option.cityList">{{i}}</Option>
                  </Select>
              </FormItem>
            </Col>
            <Col span="12">
              <FormItem label="参课状态" prop="is_join">
                  <Select v-model="form.is_join" size="small" style="width:7rem;" >
                    <Option value="0">未参课</Option>
                    <Option value="1">已参课</Option>
                  </Select>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col :span="12">
              <FormItem label="落款地" prop="final_city">
                  <Select v-model="form.final_city" size="small" style="width:7rem;" >
                    <Option :value="i" v-for="i in option.cityList">{{i}}</Option>
                  </Select>
              </FormItem>
            </Col>
            <Col :span="12">
              <FormItem label="是否到账" prop="is_complete_name" >
                  <Select v-model="form.is_complete_name" size="small" style="width:7rem;" >
                    <Option value="1">到账</Option>
                    <Option value="0">未到账</Option>
                  </Select>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col :span="12">
               <FormItem label="发票申请" prop="invoice_status" >
                <Select v-model="form.invoice_status" size="small" placeholder="发票申请" style="width:7rem;" >
                    <Option value="1">申请发票</Option>
                    <Option value="0">无需发票</Option>
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
              <FormItem label="备注说明">
                  <Input type="textarea" v-model="form.desc"></Input>
              </FormItem>
              <FormItem>
                  <Button type="primary" @click="submit('form')">提交</Button>
                  <Button style="margin-left: 8px" @click="cancel">取消</Button>
              </FormItem>
          </Form>
      </Modal>
    </div>
</template>
<script>
  import { getBaseUrl, getToken } from '@/libs/util'
  import { apiRequest } from '@/api/http'
  import { api } from '@/api/api'

  export default {
    data () {
      return {
        option: {
          paymentWayList: [],
          paymentOriginList: [],
          cityList: [],
          lessonList: [],
          financeAdminList:[],
        },
        form: {
          id: "",
          customer_id: "",
          admin_id: "",
          value: "",//金额*
          is_deposit: "",//定金/全款*
          way: "",//交费方式*
          origin: "",//原因*
          lesson: "",//课程类别*
          pay_time: "",//交费时间*
          join_lesson_time: "",//参课时间*
          join_lesson_city: "",//参课城市*
          is_join: "",//参课状态*
          final_city:"",//落款地*
          is_complete_name: "",//是否到账*
          voucher_img: "",//凭证*
          invoice_status: "",//发票申请
          finance_admin:"",//发票申请的财务选择
          refund_status: "",//退款状态
          invoice_status_name: "0",//发票信息
          refund_status_name: "",//退款信息
          desc: "",//备注*
          type:"12"
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
			origin: [
				{ required: true, message: '请选择缴费原因', trigger: 'blur' }
			],
      is_deposit: [
      	{ required: true, message: '请选择', trigger: 'blur' },
      ],
      lesson: [
      	{ required: true, message: '请选择课程类别', trigger: 'blur',pattern:/.+/ },
      ],
      join_lesson_city:[
      	{required:true,message:'请选择参课城市',trigger:'blur'}
      ],
      is_join: [
      	{ required: true, message: '参课状态', trigger: 'blur' }
      ],
      final_city: [
      	{ required: true, message: '请选择落款地', trigger: 'blur' }
      ],
      is_complete_name: [
      	{ required: true, message: '请选择是否到账', trigger: 'blur' }
      ],
      invoice_status: [
      	{ required: true, message: '请选择是否需要发票', trigger: 'blur' }
      ],
      finance_admin: [
      	{ required: true, message: '请选择开发票财务', trigger: 'blur',type:'number' }
      ],
		  },
     }
    },
    watch: {
      data () {
        if (this.mode === 'edit') {
          const data = this.data
          this.form = {
            id: data.id,
            customer_id: data.customer_id,
            value: data.value,
            pay_time: data.pay_time,
            is_deposit: data.is_deposit + '',
            way: data.way,
            origin: data.origin,
            lesson: data.lesson,
            join_lesson_time: data.join_lesson_time,
            join_lesson_city: data.join_lesson_city,
            is_join: data.is_join + '',
            final_city: data.final_city,
            voucher_img: data.voucher_img,
            desc: data.desc,
          }
        }
      }
    },
    mounted () {
      this.getOption()
    },
    props: ['customer_id', 'visible', 'mode', 'data'],
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
      //隐藏表单
      cancel () {
        this.form = {
          id: "",
          customer_id: "",
          admin_id: "",
          value: "",//金额*
          is_deposit: "",//定金/全款*
          way: "",//交费方式*
          origin: "",//原因*
          lesson: "",//课程类别*
          pay_time: "",//交费时间*
          join_lesson_time: "",//参课时间*
          join_lesson_city: "",//参课城市*
          is_join: "",//参课状态*
          final_city:"",//落款地*
          is_complete_name: "",//是否到账*
          voucher_img: "",//凭证*
          invoice_status: "",//发票申请
          finance_admin:"",//发票申请的财务选择
          refund_status: "",//退款状态
          invoice_status_name: "0",//发票信息
          refund_status_name: "",//退款信息
          desc: "",//备注*
          type:"12"
        }
        this.$emit('hideForm')
      },
      //提交表单
      submit (name) {
        //转化中国标准日期格式
        //交费时间
        var d = new Date(this.form.pay_time);
        var datetime=d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
        this.form.pay_time=datetime.toString()
        //意向参课时间
        var d = new Date(this.form.join_lesson_time);
        var datetime=d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
        this.form.join_lesson_time=datetime.toString()
        this.form.customer_id = this.customer_id

        console.log(this.form)

        this.$refs[name].validate((valid) => {
        if (valid) {
          const apiName = this.mode === 'add' ? api.Payment.add : api.Payment.edit
          apiRequest(apiName, this.form, ret => {
            this.$emit('success')
            this.$Message.info(ret)
            this.cancel()
          })
            // this.$Message.success('Success!');
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
