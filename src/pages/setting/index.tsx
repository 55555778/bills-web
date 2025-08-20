import { PlusOutlined } from '@ant-design/icons';
import {
  type TableProps,
  Button,
  Form,
  Input,
  Modal,
  Radio,
  Select,
  Switch,
  Table,
  Tabs,
} from 'antd';
import type { CheckboxGroupProps } from 'antd/es/checkbox';
import { useCallback, useEffect, useState } from 'react';
import { SettingApi } from '../../api/setting';
import { useGroupStore } from '../../stores/groupStore';
import type { SettingForm } from '../../types';
import { showMessage } from '../../utils/message';
interface DataType {
  _id: string;
  type: string; //支出/收入
  category: string; //类别
  name: string; //名称
  isdelete: boolean; //启用/停用
  money: number; //金额;
  children?: DataType[];
}

const items = [
  {
    key: '支出',
    label: '支出',
  },
  {
    key: '收入',
    label: '收入',
  },
  {
    key: '商家',
    label: '商家',
  },
  {
    key: '账户',
    label: '账户',
  },
];

const radioOptions: CheckboxGroupProps<number>['options'] = [
  { label: '一级', value: 1 },
  { label: '二级', value: 0 },
];

export default function Setting() {
  const [curTabs, setCurTabs] = useState('支出');
  const [tableData, setTableData] = useState([]);
  const [open, setOpen] = useState(false); //modal 控制器
  const [confirmLoading, setConfirmLoading] = useState(false);
  const { curGroup } = useGroupStore();
  const [form] = Form.useForm();
  const [options, setOptions] = useState([]);
  const [level, setLevel] = useState(1);
  // const { _id } = useUserStore();

  const initListData = useCallback(async () => {
    const res = await SettingApi.getList({ type: curTabs, _id: curGroup! });
    if (res.status === 0) {
      setTableData(res.result);
    }
  }, [curTabs, curGroup]);
  useEffect(() => {
    initListData();
  }, [initListData]);

  const changeSwitch = async (value: DataType) => {
    console.log('👊 ~ casync hangeSwitch ~ value:', value, curGroup);

    const res = await SettingApi.switch({
      group: curGroup!,
      _id: value._id,
    });
    console.log('👊 ~ changeSwitch ~ res:', res);
    if (res.status === 0) {
      initListData();
      showMessage.success('切换成功');
    } else {
      showMessage.error(res.msg);
    }
  };

  const getOptions = async () => {
    const res = await SettingApi.options({ type: curTabs, _id: curGroup! });
    if (res.status === 0) {
      setOptions(res.result);
    }
  };

  const columns: TableProps<DataType>['columns'] = [
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
    },

    {
      title: '金额',
      key: 'money',
      dataIndex: 'money',
    },
    {
      title: '是否启用',
      key: 'isDisabled',
      render: (_, record) => (
        <Switch defaultChecked={!record.isdelete} onChange={() => changeSwitch(record)} />
      ),
    },
  ];

  const changeTab = (activeKey: string) => {
    console.log('👊 ~ changeTab ~ activeKey:', activeKey);
    setCurTabs(activeKey);
  };
  const showModal = () => {
    setOpen(true);
    getOptions();
  };
  const handleCancel = () => {
    console.log('Clicked cancel button');
    setOpen(false);
  };
  const operations = (
    <Button type="primary" icon={<PlusOutlined />} onClick={showModal}>
      新增类别
    </Button>
  );

  const handleOk = async (value: SettingForm) => {
    setConfirmLoading(true);

    const res = await SettingApi.create({ ...value, type: curTabs, user: curGroup! });
    console.log('👊 ~ handleOk ~ res:', res);
    if (res.status === 0) {
      setOpen(false);
      setConfirmLoading(false);
      initListData();
      showMessage.success(res.msg);
    } else {
      showMessage.error(res.msg);
      setConfirmLoading(false);
    }
  };
  return (
    <div>
      <div className="font-medium text-2xl mb-5">类别列表</div>
      <Tabs
        defaultActiveKey="1"
        items={items}
        onChange={changeTab}
        tabBarExtraContent={operations}
      />
      <Table<DataType>
        columns={columns}
        dataSource={tableData}
        pagination={false}
        rowKey="_id"
        className="max-h-160! overflow-auto!"
      />

      <Modal
        title={
          <span>
            新增类别 - <span className="text-orange-400"> {curTabs}</span>
          </span>
        }
        open={open}
        onOk={() => form.submit()}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
      >
        <Form
          form={form}
          layout="horizontal"
          style={{ maxWidth: 600 }}
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 15 }}
          onFinish={(vlaue) => {
            handleOk(vlaue);
          }}
        >
          <Form.Item
            label="类别等级"
            name="level"
            rules={[{ required: true, message: '请选择要创建的类别等级' }]}
            initialValue={1}
          >
            <Radio.Group
              block
              options={radioOptions}
              defaultValue="1"
              onChange={(e) => setLevel(e.target.value)}
            />
          </Form.Item>
          <Form.Item
            label="分类名称"
            name="category"
            rules={[{ required: true, message: '请输入分类名称' }]}
          >
            <Input placeholder="分类名称" />
          </Form.Item>

          {level === 0 && (
            <Form.Item
              label="所属一级分类"
              name="_id"
              rules={[{ required: true, message: '请选择以及分类' }]}
            >
              <Select placeholder="分类名称" options={options} />
            </Form.Item>
          )}
        </Form>
      </Modal>
    </div>
  );
}
