import { Button, Form, Input, Select, Switch, type FormProps } from 'antd';

import { useEffect } from 'react';
import { UserApi } from '../../api/user';
import Title from '../../components/common/title';
import { useCommonStore } from '../../stores/comStore';
import { useUserStore } from '../../stores/userStore';
import { showMessage } from '../../utils/message';
type FieldType = {
  name: string;
  email: string;
  isDark: boolean;
  language: string;
};
export default function User() {
  const { _id, name, email } = useUserStore();
  const { isDark, setTheme } = useCommonStore();
  const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
    const res = await UserApi.update({ ...values, _id: _id! });
    if (res.status === 0) {
      showMessage.success('更改成功');
    } else if (res.status === 1) {
      showMessage.error('邮箱已存在');
    }
  };
  const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };
  const [form] = Form.useForm<FieldType>();

  const getDetail = async () => {
    const res = await UserApi.detail({ _id: _id! });

    if (res.status === 0) {
      console.log('👊 ~ getDetail ~ res:', res, res.result);
      form.setFieldsValue({
        name: res.result.name,
        email: res.result.email,
        isDark: res.result.isDark,
        language: res.result.language,
      });
    }
  };
  useEffect(() => {
    getDetail();
  }, []);

  return (
    <>
      <Title>用户信息</Title>

      <Form
        form={form}
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 600 }}
        initialValues={{
          name,
          email,
          isDark, // 主题初始值放这里
          language: 'zh-CN', // 语言初始值放这里
        }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item<FieldType>
          label="名称"
          name="name"
          rules={[{ required: true, message: '请输入名称!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item<FieldType>
          label="邮箱"
          name="email"
          rules={[{ required: true, message: '请输入正确的邮箱!', type: 'email' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item<FieldType>
          label="主题"
          name="isDark"
          valuePropName="checked" // Switch 绑定布尔值要用 checked
        >
          <Switch checkedChildren="浅色" unCheckedChildren="深色" onChange={setTheme} />
        </Form.Item>

        <Form.Item<FieldType> label="语言" name="language">
          <Select
            style={{ width: 120 }}
            options={[
              { value: 'zh-CN', label: '中文' },
              { value: 'en-US', label: '英文' },
            ]}
          />
        </Form.Item>

        <Form.Item label={null}>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </>
  );
}
