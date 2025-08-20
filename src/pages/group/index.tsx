import {
  CheckOutlined,
  CloseOutlined,
  PlusOutlined,
  UsergroupAddOutlined,
} from '@ant-design/icons';
import { Button, Card, Divider, Form, Input, List, Modal, Popconfirm, Skeleton, Space } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { GroupApi } from '../../api/group';
import { resutlHook } from '../../hooks/resultHook';
import { useGroupStore } from '../../stores/groupStore';
import { useUserStore } from '../../stores/userStore';
import type { GroupItem } from '../../types';
import { showMessage } from '../../utils/message';
import './index.css';

type FieldType = {
  name: string;
};
const text = '确认加入该账本吗?';
const description = '加入账本';

export default function Group() {
  const { _id } = useUserStore();
  const [groupList, setGroupList] = useState<GroupItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const [status, setStatus] = useState<string>('create');
  const { curGroup, setCurGroup } = useGroupStore();
  const [sarchList, setSarchList] = useState<GroupItem[]>([]);

  const handleCancel = () => {
    form.resetFields();
    setSarchList([]);
    setIsModalOpen(false);
  };

  const join = async (value: string) => {
    resutlHook(await GroupApi.join({ user: _id!, group: value }), '加入');
    getList();
  };

  const getList = useCallback(async () => {
    const res = await GroupApi.lsit({ user: _id! });
    if (res.status === 0) {
      setGroupList(res.result);
      console.log('👊 ~ Group ~ res:', res);
    }
  }, [_id]);

  const deleteGroup = async (_id: string) => {
    const res = await GroupApi.delete(_id);
    if (res.status === 0) {
      showMessage.success('删除成功');
      getList();
    }
  };

  const search = async () => {
    setLoading(true);
    setSarchList(resutlHook(await GroupApi.search({ name: form.getFieldValue('name') }), '搜索'));
    console.log('👊 ~ search ~ setSarchList:', sarchList);

    setLoading(false);
  };

  const create = async (values: FieldType) => {
    if (resutlHook(await GroupApi.create({ user: _id!, name: values.name }), '创建')) {
      setIsModalOpen(false);
      form.resetFields();
      getList();
    }
  };
  const onFinish = async (values: FieldType) => {
    if (status === 'create') {
      create(values);
    } else {
      search();
    }
  };
  const onFinishFailed = () => {
    console.log('失败');
  };

  useEffect(() => {
    getList();
  }, [getList]);
  const loadMoreData = () => {
    if (loading) {
      return;
    }
  };
  return (
    <>
      <div className="overflow-auto">
        <div className="font-medium text-2xl mb-5">选择账本</div>
        <Space direction="horizontal" size={61} wrap className="max-h-170">
          <Card
            classNames={{ body: 'my-classname' }}
            styles={{
              body: {
                color: 'flex justify-center',
              },
            }}
            style={{
              width: 300,
              height: 300,
              // display: 'flex',
              // alignItems: 'center',
              // justifyContent: 'center',
            }}
            hoverable
          >
            <div className="flex-col   h-full ">
              <div
                className="f-c-c flex-col  h-25"
                onClick={() => {
                  setIsModalOpen(true);
                  setStatus('create');
                }}
              >
                <PlusOutlined style={{ fontSize: 30 }} />
                <p> 创建新账本</p>
              </div>
              <Divider variant="dashed" />

              <div
                className="f-c-c flex-col  h-40%"
                onClick={() => {
                  setIsModalOpen(true);
                  setStatus('join');
                }}
              >
                <PlusOutlined style={{ fontSize: 30 }} />
                <p> 加入其他账本</p>
              </div>
            </div>
          </Card>
          {groupList.map((item) => (
            <Card
              hoverable
              style={{ width: 300 }}
              cover={
                <img
                  alt="example"
                  src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
                />
              }
              key={item._id}
              actions={[
                <Button
                  type={curGroup === item._id ? 'primary' : 'default'}
                  shape="circle"
                  onClick={() => setCurGroup(item)}
                >
                  <CheckOutlined />
                </Button>,
                <Popconfirm
                  title="删除操作"
                  description="确认删除这个账本吗?"
                  onConfirm={() => deleteGroup(item._id)}
                  okText="Yes"
                  cancelText="No"
                >
                  <Button
                    type="primary"
                    shape="circle"
                    disabled={item.default}
                    danger
                    icon={<CloseOutlined />}
                  ></Button>
                </Popconfirm>,
              ]}
            >
              <p>名称：{item.name}</p>
              <p>管理员：{item.owner.name}</p>
              <p>成员：{item.users.map((user) => user.name).join('、')}</p>
            </Card>
          ))}
        </Space>

        {/* 柱状图  收入/ 支出 一组两个柱状图的*/}
      </div>

      <Modal
        title={status === 'create' ? '新建账本' : '搜索账本'}
        closable={{ 'aria-label': 'Custom Close Button' }}
        open={isModalOpen}
        onOk={() => form.submit()}
        onCancel={handleCancel}
      >
        <Form
          form={form}
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 600, height: 'auto' }}
          initialValues={{ name: null }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item<FieldType>
            label="账单名称"
            name="name"
            rules={[{ required: true, message: '请输入账单名称!' }]}
          >
            <Input placeholder="请输入账单名称" />
          </Form.Item>
        </Form>
        {sarchList.length > 0 && (
          <InfiniteScroll
            dataLength={sarchList.length}
            next={loadMoreData}
            hasMore={sarchList.length < 50}
            loader={loading && <Skeleton avatar paragraph={{ rows: 1 }} active />}
            endMessage={<Divider plain>It is all, nothing more 🤐</Divider>}
            scrollableTarget="scrollableDiv"
          >
            <List
              dataSource={sarchList}
              renderItem={(item) => (
                <List.Item key={item.owner.name}>
                  <List.Item.Meta
                    title={<a href="#">{'账本名称：' + item.name}</a>}
                    description={'成员:' + item.users.map((user) => user.name).join('、')}
                  />
                  <Popconfirm
                    placement="right"
                    title={text}
                    description={description}
                    okText="Yes"
                    cancelText="No"
                    onConfirm={() => join(item._id)}
                  >
                    <UsergroupAddOutlined style={{ fontSize: 20, color: '#006afb' }} />
                  </Popconfirm>
                </List.Item>
              )}
            />
          </InfiniteScroll>
        )}
      </Modal>
    </>
  );
}
