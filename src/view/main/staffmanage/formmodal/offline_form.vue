<template>
    <div>
        <Modal :value="visible" class-name="vertical-center-modal" footer-hide
               :title="this.mode==='add'?'添加线下推广绩效考核':'编辑线下推广绩效考核'"
               @on-cancel="cancel">
            <Form :model="form" :label-width="120" :rules="formInline" ref="form" inline >
                <FormItem label="地区">
                    <Cascader :data="ChinaArea"  v-model="form.area" placeholder="请选择地区" style="width:10rem;" ></Cascader>
                </FormItem>
                <FormItem label="学校报告会" prop="school_report" >
                    <Input v-model="form.school_report" placeholder="请填写学校报告会" ></Input>
                </FormItem>
                <FormItem label="家长学校" prop="patriarch_school" >
                     <Input v-model="form.patriarch_school" placeholder="请填写家长学校" ></Input>
                </FormItem>
                <FormItem label="线下销售课">
                     <Input v-model="form.offline_lesson" placeholder="请填写线下销售课" ></Input>
                </FormItem>
                <FormItem label="社会推广课">
                    <Input v-model="form.social_lesson" placeholder="请填写社会推广课" ></Input>
                </FormItem>
                <br>
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
        ChinaArea:ChinaArea,
        option: {
          paymentWayList: [],
          paymentOriginList: [],
          cityList: [],
          lessonList: [],
          department_list:[],
        },
        form: {
          id:"",
          name: "",//
          employ_id:"",
          employ_name:"",
          department_id: '',//部门
          area: '',//地区
          school_report:'',
          patriarch_school:'',
          offline_lesson:'',
          social_lesson:''
        },
	    //验证规则
		formInline: {
			school_report: [
				{ required: true, message: '请填写姓名', trigger: 'blur' },
			]
		},
      }
    },
    watch: {
      data () {
        if (this.mode === 'edit') {
          const data = this.data

          this.form = {
            id: data.id,
            name: data.name,
            department: data.department,//部门
            area: data.area,//地区
            school_report:data.school_report,
            patriarch_school:data.patriarch_school,
            offline_lesson:data.offline_lesson,
            social_lesson:data.social_lesson
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
          const apiName = this.mode === 'add' ? api.Performanceoffline.add : api.Performanceoffline.edit

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
