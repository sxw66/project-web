// 快捷入口
const entranceList = [
  {
    title: '添加成员',
    iconName: 'addUser',
  },
  {
    title: '邀请成员',
    iconName: 'inviteUser',
  },
  {
    title: '组织权限',
    iconName: 'orgPermisson',
  },
]
// 账号数量
const typeList = [
  {
    title: '账号数量',
    day: '12',
    percentage: 12,
    iconName: 'countNum',
  },
  {
    title: '部门数量',
    day: '20',
    percentage: 20,
    iconName: 'depNum',
  },
  {
    title: '可用产品',
    day: '65',
    percentage: 65,
    iconName: 'product_use',
  },
  {
    title: '剩余天数',
    day: '56',
    percentage: 56,
    iconName: 'remain',
  },
]
const options = {
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      // type: 'cross',
      // crossStyle: {
      //   color: '#999',
      // },
    },
  },
  toolbox: {},
  legend: {
    data: ['活跃成员数', '活跃率'],
    right: 48,
  },
  grid: {
    left: 30,
    right: 40,
    bottom: 0,
    // top: '20%',
    containLabel: true,
  },
  xAxis: [
    {
      type: 'category',
      data: [
        '2023-10-16',
        '2023-10-17',
        '2023-10-18',
        '2023-10-19',
        '2023-10-20',
        '2023-10-21',
        '2023-10-22',
        '2023-10-23',
        '2023-10-24',
        '2023-10-25',
        '2023-10-26',
        '2023-10-27',
        '2023-10-28',
        '2023-10-29',
        '2023-10-30',
      ],
      axisPointer: {
        type: 'shadow',
      },
      axisLabel: {
        formatter: function (value, index) {
          // console.log(value, '=======90====', index)
          if (index === 0 || index === 6 || index === 14) {
            return value
          } else {
            return ''
          }
        },
      },
    },
  ],
  yAxis: [
    {
      type: 'value',
      // name: '活跃成员数',
      min: 0,
      // max: 250,
      // interval: 5,
      axisLabel: {
        formatter: '{value}',
      },
    },
    {
      type: 'value',
      // name: '活跃率',
      min: 0,
      // max: 100,
      // interval: 7,
      axisLabel: {
        formatter: '{value}%',
      },
    },
  ],
  series: [
    {
      name: '活跃成员数',
      type: 'bar',
      barWidth: 30,
      color: '#56abfb',
      tooltip: {
        valueFormatter: function (value) {
          return value
        },
      },
      data: [2, 14, 8, 98, 78, 54, 13, 16, 32, 20, 6, 3, 15, 68, 36],
    },
    {
      name: '活跃率',
      type: 'line',
      color: '#2cccda',
      yAxisIndex: 1,
      tooltip: {
        valueFormatter: function (value) {
          return value + '%'
        },
      },
      data: [2.0, 2.2, 3.3, 4.5, 6.3, 10.2, 20.3, 23.4, 23.0, 16.5, 12.0, 6.2, 5.8, 6.6, 8.8],
    },
  ],
}
export { entranceList, typeList, options }
