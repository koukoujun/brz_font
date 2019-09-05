//通讯录
export const contactsHeadTable = [
	{
		title: '姓名',
		key: 'name',
	},
  {
    title: '电话',
    key: 'phone',
  },
  {
    title: 'QQ',
    key: 'qq',
  },
  {
    title: '部门',
    key: 'department',
  },
  {
  	title: '操作',
  	slot: 'action',
  	width: '120px',
  	align: 'center'
  }
]
//通讯录详情
export const contactsDetailTable=[
  {
    name: '编号',
    key: 'id',
  },
	{
		name: '姓名',
		key: 'name',
	},
  {
    name: '电话',
    key: 'phone',
  },
  {
    name: 'QQ',
    key: 'qq',
  },
  {
    name: '部门',
    key: 'department',
  },
]
//用户反馈
export const feedbackHeadTable=[
	{
	 title:'编号',
	 key:'id'
	},
	{
	 title:'姓名',
	 key:'name'
	},
	{
	 title:'反馈内容',
	 key:'content',
	},
	{
	  title: '图片',
	  key: 'img',
		width:'150px',
	　　 render: (h) => {
	　　　　　　return h('img', {
	　　　　　　　　attrs: {
	　　　　　　　　　　src: 'img',
	　　　　　　　　},
	　　　　　　　　style: {
	　　　　　　　　　　marginRight: '5px'
	　　　　　　　　},
	　　　　　　　　on: {
	　　　　　　　　　　click: () => {
	　　　　　　　　　　　　this.menu2('/');
	　　　　　　　　　　}
	　　　　　　　　}
	　　　　　　});
	　　　　}
	 },
	{
	 title:'创建时间',
	 key:'create_at'
	},
  {
  	title: '操作',
  	slot: 'action',
  	width: '100px',
  	align: 'center'
  }
]
//用户反馈详情
export const feedbackDetailTable=[
	{
	 name:'编号',
	 key:'id'
	},
	{
	 name:'姓名',
	 key:'name'
	},
	{
	 name:'反馈内容',
	 key:'content',
	},
	{
	  name: '图片',
	  key: 'img',
		width:'150px',
	　　 render: (h) => {
	　　　　　　return h('img', {
	　　　　　　　　attrs: {
	　　　　　　　　　　src: 'img',
	　　　　　　　　},
	　　　　　　　　style: {
	　　　　　　　　　　marginRight: '5px'
	　　　　　　　　},
	　　　　　　　　on: {
	　　　　　　　　　　click: () => {
	　　　　　　　　　　　　this.menu2('/');
	　　　　　　　　　　}
	　　　　　　　　}
	　　　　　　});
	　　　　}
	 },
	{
	 name:'创建时间',
	 key:'create_at'
	},
]
//工作汇报
export const workReportDetailTable=[
	{
	 name:'编号',
	 key:'id'
	},
	{
	 name:'汇报人',
	 key:'to_admin_id'
	},
	{
	 name:'姓名',
	 key:'name',
	},
  {
    name:'标题',
    key:'title'
  },
  {
    name:'汇报类型',
    key:'category'
  },
  {
    name:'汇报内容',
    key:'content'
  },
	{
	 name:'创建时间',
	 key:'create_at'
	},
]
//工作申请
export const workApplyDetailTable=[
	{
	 name:'编号',
	 key:'id'
	},
	{
	 name:'汇报人',
	 key:'to_admin_id'
	},
	{
	 name:'姓名',
	 key:'name',
	},
  {
    name:'标题',
    key:'title'
  },
  {
    name:'汇报类型',
    key:'category'
  },
  {
    name:'汇报内容',
    key:'content'
  },
	{
	 name:'创建时间',
	 key:'create_at'
	},
]
//每日一问
export const questionDetailTable=[
	{
	 name:'编号',
	 key:'id'
	},
	{
	 name:'提问人',
	 key:'to_admin_id'
	},
	{
	 name:'姓名',
	 key:'name',
	},
  {
    name:'标题',
    key:'title'
  },
  {
    name:'汇报类型',
    key:'category'
  },
  {
    name:'汇报内容',
    key:'content'
  },
	{
	 name:'创建时间',
	 key:'create_at'
	},
]
//知识管理
export const knowledgeDetailTable=[
	{
	 name:'编号',
	 key:'id'
	},
	{
	 name:'姓名',
	 key:'name',
	},
  {
    name:'标题',
    key:'title'
  },
  {
    name:'内容',
    key:'content'
  },
	{
	 name:'创建时间',
	 key:'create_at'
	},
]
