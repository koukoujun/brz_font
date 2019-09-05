<template>
    <div>
        <!--筛选工具-->
        <Row :gutter="24" style="margin-bottom: 10px">
            <Col span="4">
                <Input search enter-button size="small" v-model="keyword" placeholder="输入培训人" @on-search="query"/>
            </Col>
            <Col span="4">
                 <Row>
                   <Col :span="16">
                     <DatePicker size="small" v-model="time" format="yyyy/MM/dd" type="daterange" placement="bottom-end" placeholder="Select date">
                     </DatePicker>
                   </Col>
                   <Col :span="8">
                     <Button type="primary" size="small" icon="ios-search" style="margin-left:10px;" @click="query()"></Button>
                   </Col>
                 </Row>
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
            <Col span="4">
                <Button type="primary" size="small" @click="modal1=true"><Icon type="ios-download-outline"></Icon>导出数据</Button>
            </Col>
        </Row>
        <!--表格-->
        <Table :data="data.data" ref="table"  :columns="col"  size="small" highlight-row @on-current-change="row=>curr=row">
            <template slot-scope="{ row, index }" slot="action">
              <Button type="default" size="small" style="margin-right: 5px"   @click="customerActionMenuHandler(name='detail')">查看</Button>
              <Button type="primary" size="small" style="margin-right: 5px"   @click="edit(row)">编辑</Button>
            </template>
        </Table>
        <Page style="margin:10px 0;" :total="data.total" :page-size="data.per_page" size="small" show-total show-elevator @on-change="onPage"></Page>
         <!-- 详情-->
        <Drawer title="详情" placement="left" :closable="false" v-model="showDetailDrawer">
            <div v-html="currDetailTable"></div>
        </Drawer>
         <!-- 简历表单-->
        <Modal v-model="formVisible" class-name="vertical-center-modal" :title="formMode==='add'?'添加培训信息':'编辑培训信息'" footer-hide
               @on-cancel="form={brand_right:0}">
            <Form :model="form" :label-width="150" :rules="formInline" ref="form" inline >
                    <FormItem label="培训人" prop="teacher" >
                        <Input v-model="form.teacher" size="default" placeholder="请填写培训人信息" style="width:10rem;" ></Input>
                    </FormItem>
                    <FormItem label="培训主题" prop="theme">
                        <Input v-model="form.theme" size="default" placeholder="请填写培训主题" style="width:10rem;" ></Input>
                    </FormItem>
                    <FormItem label="培训时间" prop="start_time" >
                         <DatePicker type="date" placeholder="Select date" v-model="form.start_time" style="width:10rem;" ></DatePicker>
                    </FormItem>

                    <FormItem label="培训地点" prop="address">
                      <Select v-model="form.address" size="default" style="width:10rem"  >
                          <Option :value="i" v-for="i in option.cityList">{{i}}</Option>
                      </Select>
                     </FormItem>
                    <FormItem label="培训部门" prop="department" >
                      <Select v-model="form.department" size="default" multiple style="width:10rem">
                          <Option v-for="item in departmentList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                      </Select>
                    </FormItem>
                    <FormItem label="缺席人员" prop="absence">
                      <Input v-model="form.absence" size="default" placeholder="缺席人员" style="width:10rem;" ></Input>
                    </FormItem>

                    <FormItem label="备注">
                        <Input type="textarea" placeholder="描述" :autosize="{minRows: 4,maxRows: 6}" v-model="form.desc"></Input>
                    </FormItem>

                <FormItem>
                    <Button type="primary" @click="submit('form')">提交</Button>
                    <Button style="margin-left: 8px" @click="formVisible=false">取消</Button>
                </FormItem>
            </Form>
        </Modal>
        <!-- 导出数据表单 -->
        <template>
            <Modal style="text-align: center;" v-model="modal1" title="请选择导出页数" @on-ok="exportData(4)" @on-cancel="cancel"   >
               <Row >
                 <Col :span="12" >
                   <template>
                       <Icon type="ios-arrow-round-forward" size="35" />
                       <InputNumber :max="pageAll" :min="1" v-model="exportA"  ></InputNumber>
                   </template>
                 </Col>
                 <Col :span="12" >
                   <template>
                       <Icon type="ios-arrow-round-forward" size="35" />
                       <InputNumber :max="pageAll" :min="1" v-model="exportB"  ></InputNumber>
                   </template>
                 </Col>
               </Row>
            </Modal>
        </template>

    </div>
</template>
<script>
  import { api } from '@/api/api'
  import { mapMutations } from 'vuex'
  import { apiRequest } from '@/api/http'
  import { dataToTable, objFilter } from '@/libs/util'
  import { trainDetailTable, trainHeadTable,trainHeadTables, } from '@/libs/data-staffmange'
  import ChinaArea from '@/libs/China-area'

  export default {
    data () {
      return {
        cols: trainHeadTables,//详细表头
        col: trainHeadTable,//表头
        pageNum: 1,//页码
        modal1:false,//导出modal
        outData:[],//导出数据
        exportA:1,//导出页码
        exportB:1,//导出页码
        pageAll:'',
        data: {},//数据
        curr: {},//当前row
        currDetailTable: '',//详情html
        showDetailDrawer: false,//是否显示详情抽屉
        time:[],//搜索时间关键字
        time_start:"",//开始时间
        time_end:"",//结束时间
        keyword: '',//搜索关键字
        ChinaArea: ChinaArea,//中国行政区数据
        //表单选项
        option: {
          fromList: [],
          cityList: [],
          lessonList: [],
        },
        //部门列表
        departmentList: [
            {
                value: '亲子部',
                label: '亲子部'
            },
            {
                value: '网络部',
                label: '网络部'
            },
            {
                value: '高端服务中心',
                label: '高端服务中心'
            },
        ],
        //表单
        form: {
						id: "",
						admin_id: "",
						theme: "",
						start_time: "",
						teacher: "",
						address: "",
						is_live: "",
						department: [],
						absence: "",
						desc: "",
						create_at: "",
						update_at: "",
        },
				//验证规则
				formInline: {
					teacher: [
						{ required: true, message: '请填写姓名', trigger: 'blur' }
					],
					theme: [
						{ required: true, message: '请填写主题', trigger: 'blur' },
					],
					start_time:[
						{required:true,message:'请选择培训时间',trigger:'blur',pattern:/.+/},
					],
					address: [
						{ required: true, message: '请选择培训地点', trigger: 'blur' },
					],
					absence:[
						{ required: true, message: '请填写缺席人员', trigger: 'blur'},
					],
				},
        formMode: 'add',//客户表单模式  add 添加  edit 修改
        formVisible: false,//客户表单是否显示


        //时间戳
        timestamp: 0,
      }
    },
    mounted () {
      this.initData()
      this.getOption()
    },
    watch: {
      curr (_new) {
        this.currDetailTable = dataToTable(_new, trainDetailTable)
      }
    },
    methods: {
      ...mapMutations([
        'closeTag'
      ]),
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
        //搜索关键字-开始时间
        const time_start = parseInt(this.time_start);
        //搜索关键字-结束时间
        const time_end = parseInt(this.time_end);

        const params = {
          pageNum: this.pageNum,
        }
        //关键字筛选
        if (keyword) {
          params.keyword = keyword
        }
        //关键字筛选-开始时间
        if (time_start) {
          params.time_start = time_start
        }
        //关键字筛选-结束时间
        if (time_end) {
          params.time_end = time_end
        }
        //分组筛选
        if (group) {
          params.group = group
        }

        apiRequest(api.Training.getList,
          params,
          ret => {
            this.data = ret
            this.pageAll = ret.last_page
            console.log(this.data)
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
        //搜索时间
        this.time_start =this.time[0]
        this.time_end = this.time[1]
        //转化中国标准日期格式
        //开始时间
        let d = new Date(this.time_start);
        let datetime=d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
        this.time_start=Date.parse(datetime);
        this.time_start = this.time_start/1000;
        //结束时间
        let d01 = new Date(this.time_end);
        let datetime01=d01.getFullYear() + '-' + (d01.getMonth() + 1) + '-' + d01.getDate();
        this.time_end=Date.parse(datetime01);
        this.time_end=this.time_end/1000;
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
        this.form.id = row.id
        this.form.area = [row.province, row.city]
      },
      //导出数据表
      exportData (type) {
          if (type === 1) {
              this.$refs.table.exportCsv({
                  filename: 'The original data'
              });
          }
          else if (type === 2) {
              this.$refs.table.exportCsv({
                  filename: 'Sorting and filtering data',
                  original: false
              });
          }
          else if (type === 3) {
              this.$refs.table.exportCsv({
                  filename: 'Custom data',
                  columns: this.cols.filter((cols, index) => index < 100),
                  data: this.data.data.filter((data, index) => index < 100)
              });
          }
          //导出所有数据
          else if (type === 4) {
              //遍历存储数据
              var testData=[];
              let a=this.exportA;
              let b=this.exportB;
              for(a;a<=b;a++){
                 let params = {pageNum:''}
                 params.pageNum=a
                 console.log(params)
                 const keyword = this.keyword.trim()
                 //搜索关键字-开始时间
                 const time_start = parseInt(this.time_start);
                 //搜索关键字-结束时间
                 const time_end = parseInt(this.time_end);
                 //关键字筛选
                 if (keyword) {
                   params.keyword = keyword
                 }
                 //关键字筛选-开始时间
                 if (time_start) {
                   params.time_start = time_start
                 }
                 //关键字筛选-结束时间
                 if (time_end) {
                   params.time_end = time_end
                 }
                 apiRequest(api.Training.getList,params,ret => {
                   let len = ret.data.length;
                   for(let i=0;i<len;i++){

                     ret.data[i].desc = ret.data[i].desc.replace(/[\r\n]/g,"");
                     ret.data[i].absence = ret.data[i].absence.replace(/[\r\n]/g,"");

                     testData.push(ret.data[i])
                   }
                   if(params.pageNum==b){
                     console.log("现在可以下载数据了......................！！！！！！！！！！！！！")
                     console.log(testData)

                     this.$refs.table.exportCsv({
                         filename: 'Custom data',
                         columns: this.cols.filter((cols, index) => index < 100),
                         data: testData.filter((data, index) => index < 1000)
                     });

                     //初始化页码选择
                     this.exportA=1
                     this.exportB=1

                   }

                })
              }

          }
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
          case 'addDoc':
            this.docFormVisible = true
            break
          case 'addPay':
            this.payFormVisible = true
            break
        }
      },
      //提交客户表单
      submit (name) {

        this.form.department = Array.from(this.form.department);
        this.form.department = this.form.department.toString()

        //转化中国标准日期格式
        //意向参课时间
        var d = new Date(this.form.start_time);
        var datetime=d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
        this.form.start_time=datetime.toString()


				this.$refs[name].validate((valid) => {
					if (valid) {
							this.$Message.success('Success!');
							const apiName = this.formMode === 'add' ? api.Training.add : api.Training.edit
							apiRequest(apiName, objFilter(this.form), ret => {
								//清空form表单
								this.form = { brand_right: 0 }
								this.formVisible = false
								this.initData()
							})
					}
					else {
							this.$Message.error('Fail!');
					}
				})
      },
    }
  }

</script>
