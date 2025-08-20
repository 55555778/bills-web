import { HappyProvider } from '@ant-design/happy-work-theme';
import { ConfigProvider, theme } from 'antd';
import zhCN from 'antd/locale/zh_CN'; // 可选中文包

import zh_TW from 'antd/locale/zh_TW';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './router';
import { useCommonStore } from './stores/comStore';

const App: React.FC = () => {
  const { language, isDark } = useCommonStore();

  return (
    <HappyProvider>
      <ConfigProvider
        locale={language === 'zh-CN' ? zhCN : zh_TW}
        theme={{
          algorithm: isDark ? theme.defaultAlgorithm : theme.darkAlgorithm,
        }}
      >
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </ConfigProvider>
    </HappyProvider>
  );
};

export default App;
