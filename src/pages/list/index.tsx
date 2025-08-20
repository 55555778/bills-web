import { CloseOutlined, DownOutlined, SearchOutlined, UploadOutlined } from '@ant-design/icons';
import {
  Button,
  DatePicker,
  Divider,
  Dropdown,
  Form,
  Input,
  InputNumber,
  Modal,
  Popconfirm,
  Select,
  Space,
  Table,
  Tag,
  Tooltip,
  TreeSelect,
  Upload,
  type FormProps,
  type GetProp,
  type MenuProps,
  type TableProps,
  type UploadFile,
  type UploadProps,
} from 'antd';
import type { TableRowSelection } from 'antd/es/table/interface';
import dayjs from 'dayjs';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import { useCallback, useEffect, useState } from 'react';
import { ListApi } from '../../api/list';
import { SettingApi } from '../../api/setting';
import { useFlowStore } from '../../stores/flowStore';
import { useGroupStore } from '../../stores/groupStore';
import type {
  EditListItem,
  ListCreateParams,
  ListQueryParams,
  ListResult,
  OptionsItem,
} from '../../types';
import { showMessage } from '../../utils/message';
import './index.css';
dayjs.extend(weekOfYear);
type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

const { RangePicker } = DatePicker;

type FieldType = {
  type: string;
  time: Date[];
  category: string;
  account: string;
  money: { min: number; max: number };
};

export default function List() {
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);
  // const { _id } = useUserStore();
  const { curGroup } = useGroupStore();
  const { isOpen, setOpenSide, setEditData } = useFlowStore();
  const flowType = [
    { label: '全部', value: 'all' },
    { label: '支出', value: '支出' },
    { label: '收入', value: '收入' },
  ];
  const [categoryOptions, setCategoryOptions] = useState<OptionsItem[]>([]);
  const [accountOptions, setAccountOptions] = useState<OptionsItem[]>([]);
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [data, setData] = useState<ListResult>({
    total: 0,
    income: 0,
    outcome: 0,
    list: [],
  });

  const [isUploadShow, setIsUploadShow] = useState(false);
  const onFinish: FormProps<FieldType>['onFinish'] = (values) => {
    const timeRange = values.time;
    const timeTimestamps = timeRange ? [timeRange[0].valueOf(), timeRange[1].valueOf()] : null;

    const submitData = {
      ...values,
      money: [values.money.min, values.money.max],
      time: timeTimestamps,
      user: curGroup!,
    };

    // console.log('提交的数据:', submitData);
    querySearch(submitData);
  };

  const querySearch = async (data: ListQueryParams) => {
    const res = await ListApi.list({ ...data });
    if (res.status === 0) {
      setData(res.result);
    }
  };

  const edit = (record: EditListItem | ListCreateParams) => {
    setEditData(record as EditListItem);
    setOpenSide(true);

    console.log('👊 ~ edit ~ record:', record);
    // form.setFieldsValue(record);
  };
  const columns: TableProps<ListCreateParams>['columns'] = [
    {
      title: '流水类型',
      dataIndex: 'type',
      key: 'type',
      render: (type) => {
        return <Tag color={type === '支出' ? '#90EE90	' : '#FF4500	'}>{type}</Tag>;
      },
    },
    {
      title: '分类',
      dataIndex: 'category',
      render: (category) => {
        return <Tag color="#1E90FF">{category?.name}</Tag>;
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
        return <Tooltip>{user ? user.name : '-'}</Tooltip>;
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

            <Popconfirm
              title="确定要删除吗？"
              description={`确定要删除-${record.type}-金额是-${record.money}-的这条信息吗？`}
              onConfirm={() => deleteItme([record._id!])}
              okText="Yes"
              cancelText="No"
            >
              <Button color="danger" variant="solid">
                删除
              </Button>
            </Popconfirm>
          </Space>
        );
      },
    },
  ];

  const exportList = async () => {
    console.log('👊 ~ exportList ~ selectedRowKeys:', selectedRowKeys);
    const res = await ListApi.export({ user: curGroup!, ids: selectedRowKeys });

    console.log('👊 ~ exportList ~ res:', res);
  };
  const items: MenuProps['items'] = [
    {
      label: (
        <Button
          color="primary"
          type="text"
          disabled={selectedRowKeys.length === 0}
          onClick={() => setIsModalOpen(true)}
        >
          批量删除
        </Button>
      ),
      key: '1',
    },
    {
      label: (
        <Button
          color="primary"
          type="text"
          onClick={() => exportList()}
          disabled={selectedRowKeys.length === 0}
        >
          批量导出
        </Button>
      ),
      key: '2',
    },
  ];
  const onSelectChange: TableRowSelection<ListCreateParams>['onChange'] = (
    selectedRowKeys: React.Key[],
  ) => {
    // console.log('selectedRowKeys changed: ', selectedRowKeys, selectedRows, info);
    setSelectedRowKeys(selectedRowKeys as string[]);
  };
  const rowSelection: TableRowSelection<ListCreateParams> = {
    fixed: true,
    selectedRowKeys,
    onChange: onSelectChange,
  };
  const getList = useCallback(async () => {
    const res = await ListApi.list({ user: curGroup! });
    if (res.status === 0) {
      setData(res.result);
    }
  }, [curGroup]);

  const getCategory = useCallback(async () => {
    const res = await SettingApi.getCategory({ type: 'all', user: curGroup! });
    if (res.status === 0) {
      setCategoryOptions(res.result.categorys);
      setAccountOptions(res.result.accounts);
    }
  }, [curGroup]);

  const deleteItme = async (ids: string[]) => {
    const res = await ListApi.delete({ ids, user: curGroup! });
    if (res.status === 0) {
      showMessage.success('删除成功');
      setIsModalOpen(false);
      getList();
    }
  };
  const onChangeCategory = (value: string[]) => {
    console.log('👊 ~ onChangeCategory ~ value:', value);
  };

  useEffect(() => {
    getList();
    getCategory();
  }, [getList, getCategory]);

  useEffect(() => {
    if (!isOpen) {
      getList();
    }
  }, [isOpen, getList]);

  const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };
  // todo
  const handleUploadOk = async () => {
    if (fileList.length === 0) {
      showMessage.error('请选择文件。');
      return;
    }

    const formData = new FormData();
    fileList.forEach((file) => {
      formData.append('file', file as FileType);
      formData.append('user', curGroup!);
    });

    const res = await ListApi.upload(formData);
    console.log('👊 ~ handleUploadOk ~ res:', res);
    if (res.status === 0) {
      showMessage.success('上传成功。');
      getList();
      setFileList([]);
      setIsUploadShow(false);
    } else {
      showMessage.error('上传失败。');
    }
  };

  const props: UploadProps = {
    onRemove: (file) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
    },
    beforeUpload: (file) => {
      setFileList([...fileList, file]);

      return false;
    },
    fileList,
    accept: '.xlsx,.xls',
    // action: '/list/upload',
    data: { user: curGroup! },
  };

  return (
    <div>
      {/* LIST/分类：全部/支出/收入/预算 */}
      <div className="tools flex items-center mb-5">
        <div className="is_title">流水列表</div>
        <Divider type="vertical" className="mx-5!" />
        <div className="is_week  mr-3">结余</div>
        <div className="is_normal text-xl!">{data.total}</div>
        <Divider type="vertical" className="mx-5!" />
        <div className="is_week mr-3">收入</div>
        <div className="is_normal text-[#ea5234] text-xl!">{data.income}</div>
        <Divider type="vertical" className="mx-5!" />
        <div className="is_week mr-3">支出</div>
        <div className="is_normal text-[#2e8799] text-xl!">{data.outcome}</div>
        <Space className="ml-auto!">
          <Button color="purple" variant="outlined" onClick={() => setIsUploadShow(true)}>
            数据导入
          </Button>
          <Dropdown
            open={open}
            arrow
            placement="bottom"
            onOpenChange={setOpen}
            trigger={['click']}
            popupRender={() => (
              <div className="w-80 h-full p-4 bg-[#fff] rounded-md shadow">
                <div className="title flex justify-between mb-2">
                  <div className="name text-base font-medium cursor-pointer!">筛选</div>
                  <div className="cursor-pointer!" onClick={() => setOpen(false)}>
                    <CloseOutlined />
                  </div>
                </div>
                <Form
                  name="basic"
                  layout="vertical"
                  form={form}
                  onFinish={onFinish}
                  initialValues={{ layout: 'vertical' }}
                  style={{ maxWidth: 600 }}
                  onFinishFailed={onFinishFailed}
                >
                  <Form.Item label="流水类型" name="type">
                    <Select className="w-70!" placeholder="全部" options={flowType} />
                  </Form.Item>
                  <Form.Item label="时间筛选" name="time">
                    <RangePicker className="w-70!" />
                  </Form.Item>
                  <Form.Item label="分类" name="category">
                    <TreeSelect
                      treeData={categoryOptions}
                      onChange={onChangeCategory}
                      multiple
                      treeCheckable
                      maxTagCount={2}
                      placeholder="请选择分类"
                      showCheckedStrategy={TreeSelect.SHOW_CHILD}
                    />
                  </Form.Item>
                  <Form.Item label="账户" name="account">
                    <TreeSelect
                      treeData={accountOptions}
                      multiple
                      treeCheckable
                      maxTagCount={2}
                      placeholder="请选择账户"
                      showCheckedStrategy={TreeSelect.SHOW_CHILD}
                    />
                  </Form.Item>

                  <Form.Item label="金额区间">
                    <Space.Compact>
                      <Form.Item
                        name={['money', 'min']}
                        noStyle
                        rules={[{ type: 'number', min: 0, message: '请输入合法的最小金额' }]}
                      >
                        <InputNumber className="w-34!" placeholder="请输入最小金额" />
                      </Form.Item>
                      <span style={{ padding: '0 8px' }}>-</span>
                      <Form.Item
                        name={['money', 'max']}
                        noStyle
                        rules={[{ type: 'number', min: 0, message: '请输入合法的最大金额' }]}
                      >
                        <InputNumber className="w-34!" placeholder="请输入最大金额" />
                      </Form.Item>
                    </Space.Compact>
                  </Form.Item>
                  <Divider />
                  <div className="flex justify-end">
                    <Form.Item>
                      <Button type="default" className="mr-5" onClick={() => form.resetFields()}>
                        重置
                      </Button>
                      <Button type="primary" htmlType="submit">
                        搜索
                      </Button>
                    </Form.Item>
                  </div>
                </Form>
              </div>
            )}
          >
            <Button>
              <Space>
                筛选
                <DownOutlined />
              </Space>
            </Button>
          </Dropdown>
          <Input className="w-40!" placeholder="搜索" prefix={<SearchOutlined />} />

          <Dropdown menu={{ items }} placement="bottom">
            <Button color="purple" variant="outlined">
              批量选择
            </Button>
          </Dropdown>
        </Space>
      </div>

      {/* 表格 */}
      <Table<ListCreateParams>
        rowSelection={rowSelection}
        columns={columns}
        rowKey={(record) => record._id!}
        dataSource={data.list}
        pagination={false}
      />

      <Modal
        title="删除确认信息"
        closable={{ 'aria-label': 'Custom Close Button' }}
        open={isModalOpen}
        onOk={() => deleteItme(selectedRowKeys)}
      >
        <p>
          确认删除选中的 <span className="text-[#ea5234] mx-4">{selectedRowKeys.length}</span>
          条记录吗？
        </p>
      </Modal>

      <Modal
        title="上传流水"
        okText={'上传'}
        closable={{ 'aria-label': 'Custom Close Button' }}
        open={isUploadShow}
        onOk={handleUploadOk}
        onCancel={() => setIsUploadShow(false)}
      >
        <div className="flex flex-col gap-10 p-5 items-center">
          <Button className="download w-80! h-10!">下载模版</Button>

          <Upload {...props}>
            <Button type="primary" icon={<UploadOutlined />} className="download w-80! h-10!">
              上传文件
            </Button>
          </Upload>
        </div>
      </Modal>
    </div>
  );
}
