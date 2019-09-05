export const api = {
  Common: {
    getOption: 'Common/getOption',
    upload: 'Common/upload',
  },
  User: {
    login: 'User/getToken',
    logout: 'User/logout',
    getInfo: 'User/getInfo',
  },
  Customer: {
    getList: 'Customer/getList',
    highLessonList:'Customer/highLessonList',
    detail: 'Customer/detail',
    add: 'Customer/add',
    allotPersonAdd:'Customer/allotPersonAdd',
    edit: 'Customer/edit',
    transfer: 'Customer/transfer',
  },
  Documentary: {
    getList: 'Documentary/getList',
    historyIndex:'Documentary/historyIndex',
    highPointIndex:'Documentary/highPointIndex',
    highPointIndexCustomer:'Documentary/highPointIndexCustomer',
    add: 'Documentary/add',
    highPointAdd:'Documentary/highPointAdd',
    edit: 'Documentary/edit',
  },
  Contacts: {
    getList: 'Contacts/getList',
  },
  Admin: {
    getList: 'Admin/getList',
	indexList:'Admin/indexList',
    onlinePerson:'Admin/onlinePerson',
    allotPerson:'Admin/allotPerson',
    add:'Admin/add',
    updates:'Admin/updates',
    password:'Admin/modifyPassword',
    edit:'Admin/edit',
	re_password:'Admin/re_password'
  },
  Cv: {
    getList: 'Cv/getList',
    add: 'Cv/add',
    edit: 'Cv/edit',
    del: 'Cv/del',
  },
  Employee: {
    getList: 'Employee/getList',
    add: 'Employee/add',
    edit: 'Employee/edit',
		del: 'Employee/del'
  },
  Express: {
    getList: 'Express/getList',
    add: 'Express/add',
    edit: 'Express/edit',
  },
  Feedback: {
    getList: 'Feedback/getList',
    edit: 'Feedback/edit',
    add: 'Feedback/add',
    del: 'Feedback/del',
  },
  Notice:{
    getList: 'Notice/getList',
    edit: 'Notice/edit',
    add: 'Notice/add',
    del: 'Notice/del',
  },
  //列表
  Message: {
    getList: 'Message/getList',
    getListReaded:'Message/getListReaded',
    getListRecycle:'Message/getListRecycle',
    updates:'Message/updates',
    answer:'Message/answer',
    detail: 'Message/detail',
    add:'Message/add'
  },
  Allowance: {
    getList: 'Allowance/getList',
    add: 'Allowance/add',
    edit: 'Allowance/edit',
    del: 'Allowance/del'
  },
  Payment: {
    getList: 'Payment/getList',
    add: 'Payment/add',
    edit: 'Payment/edit',
    updates:'Payment/updates',
    RefundUpdate:'Payment/RefundUpdate',
    search:'Payment/search',
    indexCount:'Payment/indexCount',
    del: 'Payment/del',
  },
  Invoice: {
    add: 'Invoice/add',
  },
  Refund: {
    getList:'Refund/getList',
    add: 'Refund/add',
    edit: 'Refund/edit',
    detail: 'Refund/detail',
    updates: 'Refund/updates',
    search:'Refund/search',
    undo: 'Refund/undo',
  },
  Role: {
    getList: 'Role/getList',
    add: 'Role/add',
    edit: 'Role/edit',
  },
  Training: {
    getList: 'Training/getList',
    add: 'Training/add',
    edit: 'Training/edit',
    del: 'Training/del',
  },
  //office
  Report: {
    getList: 'Report/getList',
    add: 'Report/add',
    edit:'Report/edit',
    updates:'Report/updates',
    del:'Report/del'
  },
  Apply: {
    getList: 'Apply/getList',
    add: 'Apply/add',
    edit:'Apply/edit',
    updates:'Apply/updates',
    del:'Apply/del'
  },
  Question: {
    getList: 'Question/getList',
    askList:'Question/askList',
    askAdd:'Question/askAdd',
    add: 'Question/add',
    edit:'Question/edit',
    updates:'Question/updates',
    del:'Question/del'
  },
  Knowledge: {
    getList: 'Knowledge/getList',
    getListtwo:'Knowledge/getListtwo',
    getListthree:'Knowledge/getListthree',
    getListfour:'Knowledge/getListfour',
    add: 'Knowledge/add',
    edit:'Knowledge/edit',
    del:'Knowledge/del'
  },
  Performance: {
    getList: 'Performance/getList',
    add: 'Performance/add',
    edit:'Performance/edit',
    del:'Performance/del'
  },
  Performancehigh: {
    getList: 'Performancehigh/getList',
    add: 'Performancehigh/add',
    edit:'Performancehigh/edit',
    del:'Performancehigh/del'
  },
  Performanceoffline: {
    getList: 'Performanceoffline/getList',
    add: 'Performanceoffline/add',
    edit:'Performanceoffline/edit',
    del:'Performanceoffline/del'
  },
  Consume: {
    getList: 'Consume/getList',
    add: 'Consume/add',
    edit:'Consume/edit',
    del:'Consuem/del',
    getCount:'Consume/getCount'
  },
  Speaker: {
    getList: 'Speaker/getList',
    add: 'Speaker/add',
    edit:'Speaker/edit',
    del:'Speaker/del'
  },
  Test:{
    test:'Test/test'
  }
}
