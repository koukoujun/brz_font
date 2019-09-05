<template>
    <div>
        <Modal :value="visible" class-name="vertical-center-modal" footer-hide
               :title="this.mode==='add'?'添加收款记录':'编辑收款记录'"
               @on-cancel="cancel">
            <Form :model="form" :label-width="120">
                <FormItem label="交费金额">
                    <Input v-model="form.value"></Input>
                </FormItem>
                <FormItem label="交费时间">
                    <DatePicker type="date" v-model="form.pay_time" size="small"></DatePicker>
                </FormItem>
                <FormItem label="交定金/交全款">
                    <Select v-model="form.is_deposit" size="small">
                        <Option value="1">定金</Option>
                        <Option value="0">全款</Option>
                    </Select>
                </FormItem>
                <FormItem label="交费方式">
                    <Select v-model="form.way" size="small">
                        <Option :value="i" v-for="i in option.paymentWayList">{{i}}</Option>
                    </Select>
                </FormItem>
                <FormItem label="交费事由">
                    <Select v-model="form.origin" size="small">
                        <Option :value="i" v-for="i in option.paymentOriginList">{{i}}</Option>
                    </Select>
                </FormItem>
                <FormItem label="交费课程类别">
                    <Select v-model="form.lesson" size="small">
                        <Option :value="i" v-for="i in option.lessonList">{{i}}</Option>
                    </Select>
                </FormItem>
                <FormItem label="参加课程时间">
                    <DatePicker type="date" v-model="form.join_lesson_time" size="small"></DatePicker>
                </FormItem>
                <FormItem label="参加课程地点">
                    <Select v-model="form.join_lesson_city" size="small">
                        <Option :value="i" v-for="i in option.cityList">{{i}}</Option>
                    </Select>
                </FormItem>
                <FormItem label="参课状态">
                    <Select v-model="form.is_join" size="small">
                        <Option value="0">未参课</Option>
                        <Option value="1">已参课</Option>
                    </Select>
                </FormItem>
                <FormItem label="落款地">
                    <Select v-model="form.final_city" size="small">
                        <Option :value="i" v-for="i in option.cityList">{{i}}</Option>
                    </Select>
                </FormItem>
                <FormItem label="备注说明">
                    <Input type="textarea" v-model="form.desc"></Input>
                </FormItem>
                <FormItem>
                    <Button type="primary" @click="submit">提交</Button>
                    <Button style="margin-left: 8px" @click="cancel">取消
                    </Button>
                </FormItem>
            </Form>
        </Modal>
    </div>
</template>
<script>
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
        },
        form: {
          customer_id: 0,//
          value: 0,//金额
          pay_time: '',//交费时间
          is_deposit: 1,//定金/全款
          way: '',//交费方式
          origin: '',//事由
          lesson: '',//课程
          join_lesson_time: '',//参课时间
          join_lesson_city: '',//参课地点
          is_join: 0,//未/已 参课
          final_city: '',//落款地
          voucher_img: '',//凭证
          desc: '',//备注说明
        }
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
          'list': 'payment_way_list,payment_origin_list,city_list,lesson_list'
        }, ret => {
          this.option = {
            paymentWayList: ret.payment_way_list,
            paymentOriginList: ret.payment_origin_list,
            cityList: ret.city_list,
            lessonList: ret.lesson_list,
          }
        })
      },
      //隐藏表单
      cancel () {
        this.form = { brand_right: 0 }
        this.$emit('hideForm')
      },
      //提交表单
      submit () {
        const params = { ...this.form }
        params.customer_id = this.customer_id
        const apiName = this.mode === 'add' ? api.Payment.add : api.Payment.edit

        apiRequest(apiName, params, ret => {
          this.$emit('success')
          this.$Message.info(ret)
          this.cancel()
          this.$emit('submit')
        })
      },
    }
  }

</script>
