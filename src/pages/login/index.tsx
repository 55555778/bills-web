import type { FormProps } from 'antd';
import { Button, Checkbox, Form, Input, Radio, Tabs } from 'antd';
import clsx from 'clsx';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserApi } from '../../api/user';
import { useCommonStore } from '../../stores/comStore';
import { useGroupStore } from '../../stores/groupStore';
import { useUserStore } from '../../stores/userStore';
import { showMessage } from '../../utils/message';

type FieldType = {
  name: string;
  password: string;
  remember?: boolean;
  permissions?: string;
  email?: string;
};

const LoginFormItems = (
  <>
    <Form.Item<FieldType>
      label="邮箱"
      data-testid="login-email"
      name="email"
      rules={[{ required: true, message: 'Please input your email!', type: 'email' }]}
    >
      <Input />
    </Form.Item>

    <Form.Item<FieldType>
      label="密码"
      name="password"
      data-testid="login-password"
      rules={[{ required: true, message: 'Please input your password!' }]}
    >
      <Input.Password />
    </Form.Item>

    <Form.Item<FieldType> name="remember" valuePropName="checked" wrapperCol={{ offset: 10 }}>
      <Checkbox>Remember me</Checkbox>
    </Form.Item>
  </>
);

const SignupFormItems = (
  <>
    <Form.Item<FieldType>
      label="名称"
      name="name"
      data-testid="signup-name"
      rules={[{ required: true, message: 'Please input your username!' }]}
    >
      <Input />
    </Form.Item>
    <Form.Item<FieldType>
      label="邮箱"
      name="email"
      data-testid="signup-email"
      rules={[{ required: true, message: 'Please input your email!', type: 'email' }]}
    >
      <Input />
    </Form.Item>
    <Form.Item<FieldType>
      label="密码"
      name="password"
      data-testid="signup-password"
      rules={[{ required: true, message: 'Please input your password!' }]}
    >
      <Input.Password />
    </Form.Item>

    <Form.Item<FieldType>
      name="permissions"
      label="权限"
      data-testid="signup-permissions"
      rules={[
        {
          required: true,
          message: 'Please select your permissions!',
        },
      ]}
    >
      <Radio.Group
        options={[
          {
            value: 'admin',
            label: 'Admin',
          },
          {
            value: 'user',
            label: 'User',
          },
        ]}
      />
    </Form.Item>
  </>
);

export default function Login() {
  const { setUser } = useUserStore();
  const { isDark } = useCommonStore();
  const navigate = useNavigate();
  const { curGroup, setGroupData, setCurGroup } = useGroupStore();
  const [curTabs, setTabs] = useState('login');

  const onChangeTabs = (activeKey: string) => {
    // console.log('👊 ~ onChangeTabs ~ activeKey:', activeKey);
    setTabs(activeKey);

    // console.log('👊 ~ cur_tabs:', curTabs);
  };
  const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
    console.log('Success:', values);
    if (curTabs === 'login') {
      const { email, password, remember } = values!;
      const res = await UserApi.login({ email: email!, password, remember: remember! });
      // console.log('👊 ~ res:', res);
      if (res.status === 0) {
        showMessage.success('登录成功');

        setUser({
          name: res.result.user.name,
          _id: res.result.user._id,
          token: res.result.accessToken,
          refreshToken: res.result.refreshToken,
          email: res.result.user.email,
        });

        setGroupData(res.result.group);
        setCurGroup(res.result.group.find((item) => item.main)!);

        console.log('👊 ~ curGroup:', curGroup);

        localStorage.setItem('accessToken', res.result.accessToken);
        localStorage.setItem('refreshToken', res.result.refreshToken);
        // 路由跳转
        navigate('/');
      } else {
        showMessage.error('登录失败');
      }
    } else {
      const { name, password, permissions, email } = values!;

      const res = await UserApi.register({
        name,
        password,
        permissions: permissions!,
        email: email!,
      });
      if (res.status === 0) {
        showMessage.success('注册成功');
      } else {
        showMessage.error('注册失败' + res.msg);
      }
    }
  };

  const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  const items = [
    {
      key: 'login',
      label: `Log in`,
      children: (
        <Form
          name="login"
          labelCol={{ span: 10 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 600 }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          {LoginFormItems}
          <Form.Item wrapperCol={{ offset: 10, span: 16 }}>
            <Button type="primary" data-testid="login-submit" htmlType="submit" className="w-full">
              Submit
            </Button>
          </Form.Item>
        </Form>
      ),
    },
    {
      key: 'signup',
      label: `Sign up`,
      children: (
        <Form
          name="signup"
          labelCol={{ span: 10 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 600 }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          {SignupFormItems}
          <Form.Item wrapperCol={{ offset: 10, span: 16 }}>
            <Button type="primary" data-testid="signup-submit" htmlType="submit" className="w-full">
              Submit
            </Button>
          </Form.Item>
        </Form>
      ),
    },
  ];

  return (
    <div
      className={clsx(
        'min-h-screen flex flex-col justify-center items-center bg-[#f0f2f5]',
        !isDark && 'isDark_bg isMain_text',
      )}
    >
      <div
        className={clsx(
          'w-[450px] pt-10 rounded-2xl bg-white flex flex-col justify-center items-center shadow-c-cycle',
          !isDark && 'isDark_box_bg',
        )}
      >
        <h1 className="mb-2 font-medium text-2xl">Welcome Back</h1>

        <Tabs
          defaultActiveKey="login"
          size="middle"
          centered
          onChange={onChangeTabs}
          items={items}
          className="w-[80%] flex justify-center items-center"
        />
      </div>
    </div>
  );
}
