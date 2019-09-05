<template>
    <div>
        <Modal :value="visible" class-name="vertical-center-modal" footer-hide
               :title="this.mode==='add'?'添加亲子部门绩效考核':'编辑亲子部门绩效考核'"
               @on-cancel="cancel">
            <Form :model="form" :label-width="90" :rules="formInline" ref="form" inline   >
                <Row :gutter="10" >
                  <Col :span="12">
                    <FormItem label="地区">
                        <Cascader :data="ChinaArea"  v-model="form.area" placeholder="请选择地区" style="width:8rem"  ></Cascader>
                    </FormItem>
                  </Col>
                  <Col :span="12">
                    <FormItem label="金额" prop="firstearn" >
                        <Input v-model="form.firstearn" placeholder="请填写收款金额" style="width:8rem"  ></Input>
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col :span="12">
                    <FormItem label="收款(复训)" prop="overearn" >
                      <Select v-model="form.overearn" placeholder="请选择收款(复训)" style="width:8rem" >
                        <Option value="初训款" >初训款</Option>
                        <Option value="复训款" >复训款</Option>
                      </Select>
                    </FormItem>
                  </Col>
                  <Col :span="12">
                    <FormItem label="退款">
                         <Input v-model="form.refund" placeholder="请填写退款(复训)" style="width:8rem" ></Input>
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col :span="12">
                    <FormItem label="家长作业">
                        <Input v-model="form.familywork" placeholder="请填写家长作业" style="width:8rem" ></Input>
                    </FormItem>
                  </Col>
                  <Col :span="12">
                    <FormItem label="推下阶课程">
                        <Input v-model="form.nextlesson" placeholder="请填写推下阶课程" style="width:8rem" ></Input>
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col :span="12">
                    <FormItem label="课后作业">
                        <Input v-model="form.afterwork" placeholder="请填写课后作业" style="width:8rem" ></Input>
                    </FormItem>
                  </Col>
                  <Col :span="12">
                    <FormItem label="朋友圈更新">
                        <Input v-model="form.friendsupdate" placeholder="请填写朋友圈更新" style="width:8rem" ></Input>
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col :span="12">
                    <FormItem label="实到天数">
                        <Input v-model="form.signdata" type="number" placeholder="请填写实到天数" style="width:8rem" ></Input>
                    </FormItem>
                  </Col>
                  <Col :span="12">
                    <FormItem label="请假天数">
                        <Input v-model="form.leavedata" type="number" placeholder="请填写请假天数" style="width:8rem" ></Input>
                    </FormItem>
                  </Col>
                </Row>

                <FormItem>
                    <Button type="primary" @click="submit('form')">提交</Button>
                    <Button style="margin-left: 8px" @click="cancel">取消</Button>
                </FormItem>
            </Form>
        </Modal>
    </div>
</template>
<script>
  import { apiRequest } from '@/api/http'
  import { api } from '@/api/api'
  import ChinaArea from '@/libs/China-area'

  export default {
    data () {
      return {
        ChinaArea: ChinaArea,//中国行政区数据
        option: {
          paymentWayList: [],
          paymentOriginList: [],
          cityList: [],
          lessonList: [],
          departmentList:[],
        },
        form: {
          id:"",
          name: "",//
          employ_id:"",
          employ_name:"",
          department_id: '',//部门
          area: '',//地区
          firstearn: '',//初训款
          overearn: '',//复训款
          refund: '',//退款
          familywork: '',//家长作业
          nextlesson: '',//下一阶课程
          afterwork: '',//课后作业
          friendsupdate: '',//朋友圈更新
          signdata: '',//实到天数
          leavedata: '',//请假天数
        },
	    //验证规则
		formInline: {
			firstearn: [
				{ required: true, message: '请填写初训款金额', trigger: 'blur' },
			],
      department:[
        {required:true,message:'请选择部门',trigger:'blur'},
      ]
		  },
     }
    },
    watch: {
      data (val) {
        if (this.mode === 'edit') {
          const data = this.data
          this.form = {
            id: data.id,
            name: data.name,
            employ_id:data.employ_id,
            employ_name:data.employ_name,
            department_id: data.department_id,//部门
            area: data.area,//地区
            firstearn:data.firstearn,//初训款
            overearn: data.overearn,//复训款
            refund: data.refund,//退款
            familywork: data.familywork,//家长作业
            nextlesson: data.nextlesson,//下一阶课程
            afterwork: data.afterwork,//课后作业
            friendsupdate: data.friendsupdate,//朋友圈更新
            signdata: data.signdata,//实到天数
            leavedata: data.leavedata,//请假天数
          }
        }
      }
    },
    mounted () {
      this.getOption()
    },
    props: ['id','customer_name','department_id','employ_id','visible', 'mode', 'data'],
    methods: {
      //获取选项
      getOption () {
        apiRequest(api.Common.getOption, {
          'list': 'payment_way_list,payment_origin_list,city_list,lesson_list,department_list'
        }, ret => {
          this.option = {
            paymentWayList: ret.payment_way_list,
            paymentOriginList: ret.payment_origin_list,
            cityList: ret.city_list,
            lessonList: ret.lesson_list,
            department_list:ret.department_list,
          }
        })
      },
      //隐藏表单
      cancel () {
        this.form = { brand_right: 0 }
        this.$emit('hideForm')
      },
      //提交表单
      submit (name) {
       this.$refs[name].validate((valid) => {
        if (valid) {
            //传递id,name,department
            this.form.department_id=this.department_id
            this.form.employ_name=this.customer_name
            this.form.employ_id=this.employ_id

            this.form.area=this.form.area.toString()

            const params = { ...this.form }
            params.customer_id = this.customer_id
            const apiName = this.mode === 'add' ? api.Performance.add : api.Performance.edit

            apiRequest(apiName, params, ret => {
              this.$emit('success')
              this.$Message.info(ret)
              this.cancel()
              this.$emit('initData')
            })


            this.$Message.success('Success!');
            this.delete_button=false;
          }
        else{
            this.$Message.success('Fail!');
          }
        })

      },
    }
  }

</script>
