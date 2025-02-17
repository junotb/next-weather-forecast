import FcstTemperatureBar from '@/component/fcst/FcstTemperatureBar';

export default function Content() {
  return (
    <div className="py-16 size-full bg-violet-200">
      <div className="flex flex-col gap-2 px-2 py-4">
        <h3 className="text-2xl font-bold">오늘의 날씨</h3>
        <FcstTemperatureBar />
      </div>
    </div>
  );
}