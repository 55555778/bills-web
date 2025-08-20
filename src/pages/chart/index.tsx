import { DatePicker, Select, Space, type DatePickerProps, type TimePickerProps } from 'antd';
import { useState } from 'react';
type PickerType = 'month' | 'year';
const { Option } = Select;

export default function Chart() {
  const [type, setType] = useState<PickerType>('year');
  const PickerWithType = ({
    type,
    onChange,
  }: {
    type: PickerType;
    onChange: TimePickerProps['onChange'] | DatePickerProps['onChange'];
  }) => {
    return <DatePicker picker={type} onChange={onChange} />;
  };
  return (
    <div>
      <div className="font-medium text-2xl mb-5">报表总汇</div>
      {/* <Tabs defaultActiveKey="1" items={items} onChange={changeTab} /> */}
      <div className="title flex  items-center  justify-between px-5">
        <div className="name">基础统计</div>
        <Space>
          <div className="name">筛选条件</div>
          <Select aria-label="Picker Type" value={type} onChange={setType}>
            <Option value="month">月</Option>
            <Option value="year">年</Option>
          </Select>
          <PickerWithType type={type} onChange={(value) => console.log(value)} />
        </Space>
      </div>
      {/* content */}

      <div className="flow text-[#000] bg-amber-100 w-80 p-4 rounded-2xl">
        <p className="font-medium text-4.5 mb-5">账本流水统计</p>
        <span>结余</span>
        <div className="jy mb-5 ">16,050.07</div>
        <span>总收入xxxxxx</span>｜<span>总支出xxxxxx</span>
        <div>记账里程碑 记账比数xx</div>
      </div>
    </div>
  );
}
