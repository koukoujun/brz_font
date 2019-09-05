<template>
    <div>
        <Modal :value="visible" class-name="vertical-center-modal" footer-hide
               :title="this.mode==='add'?'添加高端服务中心绩效考核':'编辑高端服务中心绩效考核'"
               @on-cancel="cancel">
            <Form :model="form" :label-width="150" :rules="formInline" ref="form" inline >
                <FormItem label="地区">
                    <Cascader :data="ChinaArea"  v-model="form.area" placeholder="请选择地区" style="width:12rem;"  ></Cascader>
                </FormItem>
                <FormItem label="回访电话" prop="return_phone" >
                    <Input v-model="form.return_phone" placeholder="请填写回访电话" style="width:12rem;" ></Input>
                </FormItem>
                <FormItem label="小型沙龙" prop="salon" >
                     <Input v-model="form.salon" placeholder="请填写沙龙地址" style="width:12rem;" ></Input>
                </FormItem>
                <FormItem label="咨询会">
                     <Input v-model="form.ask_meeting" placeholder="请填写咨询会地址"  style="width:12rem;"></Input>
                </FormItem>
                <FormItem label="户外活动">
                    <Input v-model="form.out_activity" placeholder="请填写户外活动" style="width:12rem;" ></Input>
                </FormItem>
                <FormItem label="一对一咨询">
                    <Input v-model="form.one_to_one_ask" placeholder="请填写一对一咨询" style="width:12rem;" ></Input>
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
          return_phone:'',
          salon:'',
          ask_meeting:'',
          out_activity:'',
          one_to_one_ask:''
        },
	    //验证规则
		formInline: {
      return_phone:[
        {required:true,message:'请填写回访电话',trigger:'blur'},
        { type: 'string', min:11 ,max:11, message: '请填写正确的电话号码', trigger: 'blur' }
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
            employ_id:"",
            employ_name:"",
            department_id: '',//部门
            area: data.area,//地区
            return_phone:data.return_phone,
            salon:data.salon,
            ask_meeting:data.ask_meeting,
            out_activity:data.out_activity,
            one_to_one_ask:data.one_to_one_ask,
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
          const apiName = this.mode === 'add' ? api.Performancehigh.add : api.Performancehigh.edit

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
