import { useCommonStore } from '../../stores/comStore';

export default function Title({ children }: { children: React.ReactNode }) {
  const { isDark } = useCommonStore();
  return <div className={`text-xl font-bold ${!isDark ? 'text-[#fff]' : ''}`}>{children}</div>;
}
