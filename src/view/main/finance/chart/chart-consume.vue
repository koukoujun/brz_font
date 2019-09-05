<template>
    <div>
        <!--筛选工具-->
        <Row :gutter="24" style="margin-bottom: 10px">
            <Col span="3">
                <Input search enter-button size="small" v-model="keyword" placeholder="输入姓名/联系方式" @on-search="query"/>
            </Col>
            <Col span="2">
               <Button type="success" size="small" @click="refresh">
                   <Icon type="ios-refresh"></Icon>
                   刷新
               </Button>
           </Col>
        </Row>
        <!--表格-->
        <Table :data="data.data"   :columns="col"  size="small" highlight-row @on-current-change="row=>curr=row">
            <template slot-scope="{ row, index }" slot="action">
                <Dropdown trigger="click"  style="margin-left: 20px" @on-click="customerActionMenuHandler" placement="left" >
                    <Button size="small">
                        操作
                        <Icon type="ios-arrow-down"></Icon>
                    </Button>
                    <DropdownMenu slot="list">
                        <DropdownItem name="detail">查看详情</DropdownItem>
                        <DropdownItem name="edit">编辑修改</DropdownItem>
                    </DropdownMenu>
                </Dropdown>
            </template>
        </Table>
        <Page style="margin:10px 0;" :total="data.total" :page-size="data.per_page" size="small" show-total  show-elevator  @on-change="onPage"></Page>
    </div>
</template>
<script>
  import { api } from '@/api/api'
  import { mapMutations } from 'vuex'
  import { apiRequest } from '@/api/http'
  import { dataToTable, objFilter,getBaseUrl, getToken } from '@/libs/util'
  import { cvDetailTable, cvHeadTable} from '@/libs/data-staffmange'
  import ChinaArea from '@/libs/China-area'

  export default {
    data () {
      return {
        pageNum: 1,//简历页码
        data: [],//简历数据
        curr: {},//简历当前row
        currDetailTable: '',//简历详情html
        showDetailDrawer: false,//是否显示简历详情抽屉
        keyword: '',//搜索关键字
        ChinaArea: ChinaArea,//中国行政区数据
		    imgshow:true,
        // 简历表头信息
        col:[
          {
            title:'姓名',
            key:'admin_name',
            className:"demo-table-info-column_06"
          },
          {
            title:'今日消费额',
            key:'today',
            className:"demo-table-info-column_05"
          },
          {
            title:'昨日消费额',
            key:'yesterday',
            className:"demo-table-info-column_04"
          },
          {
            title:'本周消费额',
            key:'week',
            className:"demo-table-info-column_03"
          },
          {
            title:'本月消费额',
            key:'month',
            className: 'demo-table-info-column_02'
          },
          {
            title:'年度消费额',
            key:'year',
            className: 'demo-table-info-column_01'
          }
        ],
        //删除是否显示
        delete_button:false,
        formMode: 'add',//客户表单模式  add 添加  edit 修改
        formVisible: false,//客户表单是否显示
        //时间戳
        timestamp: 0,
      }
    },
    mounted () {
      this.initData()
    },
    watch: {
      curr (_new) {
        this.currDetailTable = dataToTable(_new, cvDetailTable)
      }
    },
    methods: {
      ...mapMutations([
        'closeTag'
      ]),
    rowClassName (row, index) {
          if (index === 1) {
              return 'demo-table-info-row';
          }
          else if (index === 3) {
              return 'demo-table-error-row';
          }
          return '';
      },
      initData () {
        const keyword = this.keyword.trim()//trim去除前后空格 //客户搜索关键词
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
        //请求接口
        apiRequest(api.Consume.getCount,
          params,
          ret => {
            this.data = ret
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

    .ivu-table td.demo-table-info-column_01{
        background-color: #2db7f5;
        color: #fff;
        font-size:1.2rem;
    }
    .ivu-table td.demo-table-info-column_02{
        background-color: #87C4ED;
        color: #fff;
        font-size:1.2rem;
    }
    .ivu-table td.demo-table-info-column_03{
        background-color: #2db7f5;
        color: #fff;
        font-size:1.2rem;
    }
    .ivu-table td.demo-table-info-column_04{
        background-color: #87C4ED;
        color: #fff;
        font-size:1.2rem;
    }
    .ivu-table td.demo-table-info-column_05{
        background-color: #2db7f5;
        color: #fff;
        font-size:1.2rem;
    }
    .ivu-table td.demo-table-info-column_06{
        background-color: #87C4ED;
        color: #fff;
    }

</style>
