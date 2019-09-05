<template>
    <div>
        <!--筛选工具-->
        <Row :gutter="24" style="margin-bottom: 10px">
            <Col span="4">
                <Input search enter-button size="small" v-model="keyword" placeholder="输入姓名" @on-search="query"/>
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
            <Col span="4">
                <Button type="primary" size="small" @click="modal1 = true" ><Icon type="ios-download-outline"></Icon>导出数据</Button>
            </Col>
        </Row>
        <!--表格-->
        <Table :data="data.data" ref="table"  :columns="col"  size="small" highlight-row @on-current-change="row=>curr=row">
            <template slot-scope="{ row, index }" slot="action">
              <Button type="default" size="small" style="margin-right: 5px"   @click="customerActionMenuHandler(name='detail')">查看</Button>
			        <Button type="info" size="small" style="margin-right: 5px"   @click="pushLook(row)">顾问跟单</Button>
            </template>
        </Table>
        <Page style="margin:10px 0;" :total="data.total" :page-size="data.per_page" size="small" show-total
              show-elevator
              @on-change="onPage"></Page>
         <!-- 详情-->
        <Drawer title="详情" placement="left" :closable="false" v-model="showDetailDrawer">
            <div v-html="currDetailTable"></div>
        </Drawer>
         <!-- 表单-->
        <Modal v-model="docformVisible" class-name="vertical-center-modal" :title="formMode==='add'?'添加跟单记录':'编辑跟单记录'" footer-hide
               @on-cancel="form={brand_right:0}">
            <Form :model="form" :label-width="120" ref="form" :rules="formInline" inline  >
									<FormItem label="跟单方式" prop="way">
											<Select v-model="form.way" size="default" style="width:7rem;">
													<Option :value="i" v-for="i in option.wayList">{{i}}</Option>
											</Select>
									</FormItem>
									<FormItem label="跟单目的" prop="purpose" >
											<Select v-model="form.purpose" size="default" style="width:7rem;">
												<Option :value="i" v-for="i in option.purposeList">{{i}}</Option>
											</Select>
									</FormItem>
									<FormItem label="截图" >
												<div style="width:600px;">
													<div  class="demo-upload-list" v-for="item in uploadList">
															<template v-if="item.status === 'finished'">
																	<img :src="item.url">
																	<div class="demo-upload-list-cover">
																			<Icon type="ios-eye-outline" @click.native="handleView(item.url)"></Icon>
																			<Icon type="ios-trash-outline" @click.native="handleRemove(item)"></Icon>
																	</div>
															</template>
															<template v-else>
																	<Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
															</template>
													</div>
												<div>
													<Upload
																	ref="upload"
																	:on-success="handleImgSuccess"
																	:format="['jpg','jpeg','png']"
																	:default-file-list="defaultUploadList"
																	:max-size="2048"
																	:show-upload-list="false"
																	:before-upload="handleBeforeUpload"
																	:on-format-error="handleFormatError"
																	:on-exceeded-size="handleMaxSize"
																	multiple
																	type="drag"
																	:action="uploadUrl"
																	style="display: inline-block;width:58px;">
															<div style="width: 58px;height:58px;line-height: 58px;">
																	<Icon type="ios-camera" size="20"></Icon>
															</div>
													</Upload>
												</div>
											</div>
									</FormItem>
									<FormItem label="跟单内容" prop="content" >
										<Input type="textarea" placeholder="请填写跟单内容" :autosize="{minRows: 4,maxRows: 6}" v-model="form.content"></Input>
									</FormItem>
									<FormItem label="下次跟单时间" >
										<DatePicker type="date"  placeholder="下次跟单时间" v-model="form.next_flow_time"></DatePicker>
									</FormItem>
                <FormItem>
                    <Button type="primary" @click="submit('form')">提交</Button>
                    <Button style="margin-left: 8px" @click="docformVisible=false">取消</Button>
                </FormItem>
            </Form>
        </Modal>
		<!-- 图片预览-->
		<Modal title="图片预览" v-model="imgModalVisible" footer-hide>
			<img :src="previewImg" v-if="imgModalVisible" style="width: 100%" alt="">
		</Modal>
		<!--  -->
		<Modal title="查看大图" v-model="visible" footer-hide>
			<img :src="i" v-for="i in imgUrl" v-if="visible" style="width: 100%">
		</Modal>
    <!-- 导出数据表单 -->
    <template>
        <Modal style="text-align: center;" v-model="modal1" title="请选择导出页数" @on-ok="exportData(4)" >
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
  import { dataToTable, objFilter,getBaseUrl, getToken } from '@/libs/util'
  import { documentaryDetailTable, documentaryHeadTable,documentaryHeadTables } from '@/libs/data-customer'
  import ChinaArea from '@/libs/China-area'

  export default {
    data () {
      return {
			cols: documentaryHeadTables,//详细表头
			pageNum: 1,//页码
      modal1:false,//导出modal
      outData:[],//导出数据
      exportA:1,//导出页码
      exportB:1,//导出页码
      pageAll:1,
			data: {},//数据
			curr: {},//当前row
			currDetailTable: '',//详情html
			showDetailDrawer: false,//是否显示详情抽屉
			keyword: '',//搜索关键字
      time:[],//搜索时间关键字
      time_start:"",//开始时间
      time_end:"",//结束时间
			ChinaArea: ChinaArea,//中国行政区数据
		//跟单表头
		col:[
      {
        title:"编号",
        key:'id'
      },
		  {
		    title: '客户姓名',
		    key: 'customer_name'
		  },
		  {
		    title: '详情',
		    key: 'content',
		    width: 180,
		    align: 'center'
		  },
		  {
		    title: '截图',
		    key: 'img_list',
		    width: 80,
		    align: 'center',
        render: (h, params) => {
            return h('div',
             [
                h('img', {
                    attrs: {
		　　　　　　　　　　src:params.row.img_list[0],
						           onerror:'this.src="http://brz-crm.oss-cn-beijing.aliyuncs.com/img/20190710154417_UauI.png"'
                    },
                    style: {
                       width:'40px',
                    },
                    on: {
                        click: (e) => {
                          //this.handleViews(e.srcElement.currentSrc)
                            this.handleViews(params.row.img_list)
                        }
                    }
                }),
            ]);
        },
		  },
		  {
		    title: '顾问姓名',
		    key: 'admin_name'
		  },
		  {
		    title: '跟单方式',
		    key: 'way'
		  },
		  {
		    title: '跟单目的',
		    key: 'purpose'
		  },
		  {
		    title: '下次跟单',
		    key: 'next_follow_time'
		  },
		  {
		    title: '添加时间',
		    key: 'create_at'
		  },
		  {
		    title: '操作',
		    slot: 'action',
		    width: 250,
		    align: 'center'
		  },
		],
        //表单选项
        option: {
          wayList: [],
          purposeList: [],
        },
        //客户表单
        form: {
					customer_id: "",               //客户id*
					way: "",                       //跟单方式*
					next_follow_time: "",          //下次跟单时间
					purpose: "",                   //跟单目的*
					content: "",                   //跟单内容*
					img_list:"",                  //跟单图片列表,多个图片url使用英文,隔开
					customer_name: "",             //客户姓名
					admin_name: ""                 //顾问姓名
        },
		//验证规则
		formInline: {
				customer_id: [
					{ required: true, message: '请填写客户id', trigger: 'blur' }
			],
				content: [
						{ required: true, message: '请填写跟单内容', trigger: 'blur' },
				],
				way:[
					{ required: true, message: '跟单方式', trigger: 'blur' },
				],
				purpose:[
					{required:true,message:'跟单目的',trigger:'blur'}
				]
		},
		uploadUrl: getBaseUrl() + api.Common.upload + '?token=' + getToken(),
		uploadList: [],//图片上传截图列表
		defaultUploadList: [],//默认上传列表
		imgModalVisible: false,
		previewImg: '',
		//图片放大
		visible:false,
		imgUrl:"",
		formMode: 'add',//客户表单模式  add 添加  edit 修改
		docformVisible: false,//客户表单是否显示
    //时间戳
    timestamp: 0,
      }
    },
    mounted () {
      this.initData()
      this.getOption()
			this.uploadList = this.$refs.upload.fileList
    },
    watch: {
      curr (_new) {
        this.currDetailTable = dataToTable(_new, documentaryDetailTable)
      }
    },
    methods: {
      ...mapMutations([
        'closeTag'
      ]),
      //获取选项
      getOption () {
        apiRequest(api.Common.getOption, {
          'list': 'documentary_way_list,documentary_purpose_list'
        }, ret => {
          this.option = {
            fromList: ret.from_list,
            cityList: ret.city_list,
            lessonList: ret.lesson_list,
            wayList: ret.documentary_way_list,
            purposeList: ret.documentary_purpose_list,
          }
        })
      },
      initData () {
        const keyword = this.keyword.trim()
        //搜索关键字-开始时间
        const time_start = parseInt(this.time_start);
        //搜索关键字-结束时间
        const time_end = parseInt(this.time_end);
        const group = this.group

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

        apiRequest(api.Documentary.highPointIndexCustomer,
          params,
          ret => {
            this.data = ret
            this.pageAll = ret.last_page

						let len = this.data.data.length;
						for(let i=0;i<len;i++){
							this.data.data[i].customer_id=this.data.data[i].customer_id+'';
							this.data.data[i].next_follow_time=this.data.data[i].next_follow_time.toString()
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
      //添加员工
      add () {
        this.formMode = 'add'
        this.docformVisible = true
      },
      //编辑
      edit (row) {
        this.formMode = 'edit'
        this.docformVisible = true
        this.form = { ...row }
        this.form.id = row.id
        this.form.area = [row.province, row.city]
      },
      //跳转查看顾问跟单数据
      pushLook(row){
         this.$router.push({path: '/documentary',query:{ id:row.customer_id}});
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
                 apiRequest(api.Documentary.highPointIndexCustomer,params,ret => {
                   let len = ret.data.length;
                   for(let i=0;i<len;i++){

                     testData.push(ret.data[i])
                   }
                   if(params.pageNum==b){
                     // console.log("现在可以下载数据了......................！！！！！！！！！！！！！")
                     // console.log(testData)

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
        }
      },
	  //图片上传开始
	  //图片上传成功
	  handleImgSuccess (response, file, fileList) {
		  file.url = response
			this.form.img_list=file.url;
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
		//提交客户表单
		submit (name) {

      //转化中国标准日期格式
      //意向参课时间
      var d = new Date(this.next_flow_time);
      var datetime=d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
      this.next_flow_time=datetime.toString()

		 this.$refs[name].validate((valid) => {
			if (valid) {
					this.$Message.success('Success!');
					//定义图片数组
					let imgList = []
					for (let i = 0; i < this.uploadList.length; i++) {
					  imgList.push(this.uploadList[i].url)
					}
					//判断是否上传图片
					if (!imgList) {
					  this.form.img_list = ''
					}
					else {
						this.form.img_list = imgList.toString();
					}

					const apiName = this.formMode === 'add' ? api.Documentary.add : api.Documentary.edit
					apiRequest(apiName, objFilter(this.form), ret => {
						//清空form表单
						this.form = { brand_right: 0 }
						this.docformVisible = false
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
