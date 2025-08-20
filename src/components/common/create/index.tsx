import {
  Button,
  DatePicker,
  Drawer,
  Form,
  Input,
  InputNumber,
  Tabs,
  TreeSelect,
  type FormInstance,
  type FormProps,
  type TabsProps,
} from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { useCallback, useEffect, useState } from 'react';
import { ListApi } from '../../../api/list';
import { SettingApi } from '../../../api/setting';
import { useFlowStore } from '../../../stores/flowStore';
import { useGroupStore } from '../../../stores/groupStore';
import { useUserStore } from '../../../stores/userStore';
import type { OptionsItem } from '../../../types';
import { showMessage } from '../../../utils/message';
import './index.css';

type FieldType = {
  money: number;
  category: string;
  shop: string;
  time: number | Dayjs;
  project: string;
  remark: string;
  account: string;
};

export default function CreateModal({
  drawerOpen,
  onClose,
}: {
  drawerOpen: boolean;
  onClose: () => void;
}) {
  const { _id } = useUserStore();
  const { curGroup } = useGroupStore();
  const { setOpenSide, editData } = useFlowStore();
  const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
    console.log('Success:', values);
    const time = values.time.valueOf();

    if (editData) {
      const res = await ListApi.edit({
        ...values,
        type: curTabs,
        time,
        user: _id!,
        _id: editData._id,
        group: curGroup!,
      });
      if (res.status === 0) {
        showMessage.success('修改成功');
        setOpenSide(false);
        forms[curTabs].resetFields();
      } else {
        showMessage.error(res.msg);
      }
    } else {
      const res = await ListApi.create({
        ...values,
        time,
        type: curTabs,
        user: _id!,
        group: curGroup!,
      });
      if (res.status === 0) {
        showMessage.success('创建成功');
        setOpenSide(false);
        forms[curTabs].resetFields();
      } else {
        showMessage.error(res.msg);
      }
    }
  };
  const [forms] = useState<Record<string, FormInstance<FieldType>>>({
    支出: Form.useForm()[0],
    收入: Form.useForm()[0],
  });

  const onPopupScroll = () => {};
  const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  const [categoryOptions, setCategoryOptions] = useState<Array<OptionsItem>>([]); //分类选项
  const [accountOptions, setAccountOptions] = useState<Array<OptionsItem>>([]); //账户选项
  const [shopOptions, setShopOptions] = useState<Array<OptionsItem>>([]); //账户选项
  const [projectOptions, setProjectOptions] = useState<Array<OptionsItem>>([]); //项目选项

  const [curTabs, setCurTabs] = useState('支出');
  const onChange = (key: string) => {
    setCurTabs(key);
    forms[key].resetFields();
  };
  const onChangeCategory = (key: string) => {
    console.log('👊 ~ onChangeCategory ~ key:', key);
  };

  const getCategoryOptions = useCallback(async () => {
    const res = await SettingApi.getCategory({ type: curTabs, user: curGroup! });
    if (res.status === 0) {
      setCategoryOptions(res.result.categorys);
      setAccountOptions(res.result.accounts);
      setShopOptions(res.result.shops);
      setProjectOptions([]);

      if (editData) {
        forms[editData.type].setFieldsValue({
          money: editData.money,
          category: editData.category?._id,
          account: editData.account?._id,
          shop: editData.shop?._id,
          remark: editData.remark,
          time: dayjs(editData.time),
        });
      } else {
        forms[curTabs].resetFields();
      }
    }
  }, [curTabs, editData, forms, curGroup]);

  useEffect(() => {
    getCategoryOptions();
  }, [getCategoryOptions]);

  const createForm = (formInstance: FormInstance<FieldType>) => {
    return (
      <Form
        form={formInstance}
        className="w-auto!"
        wrapperCol={{ span: 18 }}
        style={{ maxWidth: 800 }}
        onFinish={onFinish}
        layout="vertical"
        clearOnDestroy
        onFinishFailed={onFinishFailed}
        initialValues={{
          time: dayjs(),
        }}
      >
        <Form.Item<FieldType>
          name="money"
          label="金额"
          rules={[{ required: true, message: '请输入金额' }]}
        >
          <InputNumber style={{ width: '100%' }} placeholder="请输入金额" />
        </Form.Item>
        <Form.Item<FieldType>
          name="category"
          label="分类"
          rules={[{ required: true, message: '请选择分类' }]}
        >
          <TreeSelect
            showSearch
            style={{ width: '100%' }}
            styles={{
              popup: { root: { maxHeight: 400, overflow: 'auto' } },
            }}
            placeholder="请选择分类"
            treeLine
            allowClear
            onChange={onChangeCategory}
            treeData={categoryOptions}
            onPopupScroll={onPopupScroll}
            treeCheckable={false} // 关闭多选
            // 禁用所有非叶子节点，防止选择父节点
            treeNodeFilterProp="title"
          />
        </Form.Item>
        <Form.Item<FieldType>
          name="account"
          label="账户"
          rules={[{ required: true, message: '请选择账户' }]}
        >
          <TreeSelect
            showSearch
            style={{ width: '100%' }}
            styles={{
              popup: { root: { maxHeight: 400, overflow: 'auto' } },
            }}
            placeholder="请选择账户"
            allowClear
            treeData={accountOptions}
            onPopupScroll={onPopupScroll}
          />
        </Form.Item>

        <Form.Item<FieldType>
          name="time"
          label="记账时间"
          rules={[{ required: true, message: '请选择时间' }]}
        >
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item<FieldType> name="shop" label="商家">
          <TreeSelect
            showSearch
            style={{ width: '100%' }}
            styles={{
              popup: { root: { maxHeight: 400, overflow: 'auto' } },
            }}
            placeholder="请选择商家"
            allowClear
            treeDefaultExpandAll
            treeData={shopOptions}
            onPopupScroll={onPopupScroll}
          />
        </Form.Item>

        <Form.Item<FieldType> name="project" label="项目">
          <TreeSelect
            showSearch
            style={{ width: '100%' }}
            styles={{
              popup: { root: { maxHeight: 400, overflow: 'auto' } },
            }}
            placeholder="请选择项目"
            allowClear
            treeDefaultExpandAll
            treeData={projectOptions}
            onPopupScroll={onPopupScroll}
          />
        </Form.Item>

        <Form.Item<FieldType> name="remark" label="备注">
          <Input showCount maxLength={50} placeholder="请输入备注" />
        </Form.Item>

        <Form.Item label={null}>
          <div className="flex gap-8">
            <Button type="primary" htmlType="submit">
              保存
            </Button>

            <Button type="primary" onClick={() => formInstance.resetFields()}>
              重置表单
            </Button>
          </div>
        </Form.Item>
      </Form>
    );
  };

  const items: TabsProps['items'] = [
    {
      key: '支出',
      label: '支出',
      children: createForm(forms['支出']),
    },
    {
      key: '收入',
      label: '收入',
      children: createForm(forms['收入']),
    },
  ];
  return (
    <div>
      <Drawer
        title="记一笔"
        closable={{ 'aria-label': 'Close Button' }}
        onClose={onClose}
        open={drawerOpen}
        width={500}
        styles={{ body: { padding: 20 } }}
        className="p0! text-2xl"
      >
        <Tabs defaultActiveKey="支出" items={items} onChange={onChange} className="border-0" />
      </Drawer>
    </div>
  );
}
