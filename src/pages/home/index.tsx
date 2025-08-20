import {
  Button,
  Form,
  InputNumber,
  Modal,
  Progress,
  Space,
  Table,
  Tag,
  Tooltip,
  type FormProps,
  type TableProps,
} from 'antd';
import TextArea from 'antd/es/input/TextArea';
import dayjs from 'dayjs';
import * as echarts from 'echarts';
import { useCallback, useEffect, useRef, useState } from 'react';
import { BudgetApi } from '../../api/budget';
import { ListApi } from '../../api/list';
import { resutlHook } from '../../hooks/resultHook';
import { useGroupStore } from '../../stores/groupStore';
import { useUserStore } from '../../stores/userStore';
import type { ChartResult, ListCreateParams, ListResult } from '../../types';
import type { CreateBudget } from '../../types/budget';
import { showMessage } from '../../utils/message';

export default function Home() {
  // const sumRef = useRef<HTMLDivElement>(null);
  // const budgetRef = useRef<HTMLDivElement>(null);
  // const sumChartRef = useRef<echarts.EChartsType>(null);
  // const budgetChartRef = useRef<echarts.EChartsType>(null);
  const remainingRef = useRef<HTMLDivElement>(null);
  const remainingChartRef = useRef<echarts.EChartsType>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [budget, setBudget] = useState<{
    money: number;
    remark: string;
    curSum: number;
    percent: number;
  }>({
    money: 0,
    curSum: 0,
    remark: '',
    percent: 0,
  });
  const [form] = Form.useForm<CreateBudget>();
  const { curGroup } = useGroupStore();
  const { _id } = useUserStore();
  const [charts, setCharts] = useState<ChartResult>({
    totalExpense: 0,
    totalIncome: 0,
    income: [],
    expense: [],
    line: {
      dates: [],
      spendList: [],
      incomeList: [],
    },
  });
  useEffect(() => {
    // if (sumRef.current) {
    //   sumChartRef.current = echarts.init(sumRef.current);
    //   sumChartRef.current.setOption({
    //     title: {
    //       text: '收入',
    //     },
    //     tooltip: { trigger: 'item' },
    //     legend: { top: 0 },
    //     series: [
    //       {
    //         name: '收入',
    //         type: 'pie',
    //         radius: ['50%', '70%'],

    //         data: charts.income,

    //         emphasis: {
    //           itemStyle: {
    //             shadowBlur: 10,
    //             shadowOffsetX: 0,
    //             shadowColor: 'rgba(0, 0, 0, 0.5)',
    //           },
    //         },
    //         labelLine: {
    //           show: true,
    //         },
    //       },
    //     ],
    //   });
    // }

    // if (budgetRef.current) {
    //   budgetChartRef.current = echarts.init(budgetRef.current);
    //   budgetChartRef.current.setOption({
    //     title: {
    //       text: '支出',
    //     },
    //     tooltip: { trigger: 'item' },

    //     legend: { top: 0 },
    //     series: [
    //       {
    //         name: '支出',
    //         type: 'pie',
    //         radius: ['50%', '70%'],
    //         data: charts.expense,
    //         emphasis: {
    //           itemStyle: {
    //             shadowBlur: 10,
    //             shadowOffsetX: 0,
    //             shadowColor: 'rgba(0, 0, 0, 0.5)',
    //           },
    //         },
    //       },
    //     ],
    //   });
    // }

    if (remainingRef.current) {
      remainingChartRef.current = echarts.init(remainingRef.current);
      remainingChartRef.current.setOption({
        color: ['#80FFA5', '#00DDFF', '#37A2FF', '#FF0087', '#FFBF00'],

        title: {
          text: '每日收支',
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985',
            },
          },
        },
        toolbox: {
          feature: {
            saveAsImage: {},
          },
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true,
        },

        legend: {
          data: ['支出', '收入'],
        },
        yAxis: [
          {
            type: 'value',
          },
        ],
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            data: charts.line.dates,
          },
        ],
        series: [
          {
            value: [charts.totalExpense], // 消耗
            name: '支出',
            type: 'line',
            stack: 'Total',
            smooth: true,
            lineStyle: {
              width: 0,
            },
            showSymbol: false,
            label: {
              show: true,
              position: 'top',
            },
            areaStyle: {
              opacity: 0.8,
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: 'rgb(255, 191, 0)',
                },
                {
                  offset: 1,
                  color: 'rgb(224, 62, 76)',
                },
              ]),
            },
            emphasis: {
              focus: 'series',
            },
            data: charts.line.spendList,
          },
          {
            value: [charts.totalIncome - charts.totalExpense], // 剩余 = 总值 - 消耗
            name: '收入',
            type: 'line',
            stack: 'Total',
            smooth: true,
            lineStyle: {
              width: 0,
            },
            showSymbol: false,
            areaStyle: {
              opacity: 0.8,
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: 'rgb(255, 0, 135)',
                },
                {
                  offset: 1,
                  color: 'rgb(135, 0, 157)',
                },
              ]),
            },
            emphasis: {
              focus: 'series',
            },
            data: charts.line.incomeList,
          },
        ],
      });
    }
    return () => {
      remainingChartRef.current?.dispose();
      // sumChartRef.current?.dispose();
      // budgetChartRef.current?.dispose();
    };
  }, [charts]);

  const [data, setData] = useState<ListResult>({
    total: 0,
    income: 0,
    outcome: 0,
    list: [],
  });

  const edit = (record: ListCreateParams) => {
    console.log('👊 ~ edit ~ record:', record);
    // form.setFieldsValue(record);
  };
  const columns: TableProps<ListCreateParams>['columns'] = [
    {
      title: '分类',
      dataIndex: 'type',
      key: 'type',
      render: (type) => {
        return <Tag color="#2db7f5">{type}</Tag>;
      },
    },
    {
      title: '金额',
      dataIndex: 'money',
      key: 'money',
      render: (value, record) => {
        return (
          <div className={record.type !== '支出' ? 'text-[#ea5234]' : 'text-[#2e8799]'}>
            {value}
          </div>
        );
      },
    },
    {
      title: '账户',
      dataIndex: 'account',
      render: (account) => {
        return <Tag color="#f50">{account?.name}</Tag>;
      },
    },
    {
      title: '商家',
      dataIndex: 'shop',
      render: (value) => {
        return <Tag color="#87d068">{value?.name}</Tag>;
      },
    },
    {
      title: '时间',
      key: 'time',
      dataIndex: 'time',
      render: (value) => {
        return dayjs(value).format('YYYY-MM-DD HH:mm:ss dd');
      },
    },
    {
      title: '备注',
      dataIndex: 'remark',
      key: 'remark',
      render: (remark) => {
        return <Tooltip>{remark ?? '-'}</Tooltip>;
      },
    },
    {
      title: '记账人',
      dataIndex: 'user',
      key: 'user',
      render: (user) => {
        return <Tooltip>{user.name ?? '-'}</Tooltip>;
      },
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => {
        return (
          <Space size="middle">
            <Button color="primary" variant="solid" onClick={() => edit(record)}>
              编辑
            </Button>
            <Button color="danger" variant="solid">
              删除
            </Button>
          </Space>
        );
      },
    },
  ];
  const getBudget = useCallback(async () => {
    const { budget, sum } = resutlHook(await BudgetApi.get({ group: curGroup! }));

    setBudget({
      remark: budget?.remark,
      money: budget?.money,
      curSum: sum,
      percent: Number(((sum / budget?.money) * 100).toFixed(2)),
    });
  }, [curGroup]);

  const getList = useCallback(async () => {
    const res = await ListApi.list({ user: curGroup!, size: 5 });
    if (res.status === 0) {
      setData(res.result);
    }
  }, [curGroup]);

  const getChart = useCallback(async () => {
    const res = await ListApi.chart({ user: curGroup! });
    if (res.status === 0) {
      setCharts(res.result);
    }
  }, [curGroup]);
  useEffect(() => {
    getList();
    getChart();
    getBudget();
  }, [getList, getChart, getBudget]);

  const onFinishFailed = () => {};

  const onFinish: FormProps<CreateBudget>['onFinish'] = async (values) => {
    console.log('👊 ~ onFinish ~ values:', values);
    const res = await BudgetApi.create({
      user: _id!,
      money: values.money,
      group: curGroup!,
      remark: values.remark,
    });
    if (res.status === 0) {
      showMessage.success('创建成功');
      getChart();
      form.resetFields();
      setIsModalOpen(false);
    }
  };
  return (
    <div className="flex w-full flex-col gap-5 h-full">
      <div className="chart h-80 flex">
        {/* <div ref={sumRef} className="sum flex-1" /> */}
        {/* <div ref={budgetRef} className="budget flex-1" /> */}

        <div className=" flex-1 flex-col">
          <p className="text-lg font-medium ">当月预算</p>

          <div className="title f-c-c flex-col">
            <Progress
              percent={budget?.percent}
              type="circle"
              size={200}
              style={{ fontSize: 12! }}
              status="active"
            />
            <div className="options mt-5">
              <Button
                type="dashed"
                onClick={() => setIsModalOpen(true)}
                disabled={budget.money !== null}
              >
                设置
              </Button>
            </div>
          </div>
        </div>

        <div ref={remainingRef} className=" flex-1" />
      </div>
      <div className="list flex-1 ">
        <div className="font-medium text-2xl mb-3">
          账单列表<span className="text-xs text-[#f0f0f0] ml-3">最近五条数据</span>
        </div>
        <Table<ListCreateParams>
          columns={columns}
          dataSource={data.list}
          pagination={false}
          rowKey="_id"
          className=" overflow-hidden"
        />
      </div>

      <Modal
        title="新建预算"
        closable={{ 'aria-label': 'Custom Close Button' }}
        open={isModalOpen}
        onOk={() => form.submit()}
        onCancel={() => {
          form.resetFields();
          setIsModalOpen(false);
        }}
      >
        <Form
          form={form}
          name="basic"
          className="m-5!"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 600 }}
          initialValues={{ money: null }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item<CreateBudget>
            label="本月预算金额"
            name="money"
            rules={[{ required: true, message: '请输入本月预算金额' }]}
          >
            <InputNumber suffix="RMB" style={{ width: '100%' }} placeholder="请输入本月预算金额" />
          </Form.Item>

          <Form.Item<CreateBudget> label="本月预算金额" name="remark">
            <TextArea rows={3} maxLength={20} showCount />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
