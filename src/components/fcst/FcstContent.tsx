import FcstTemperatureBar from '@/components/fcst/FcstTemperatureBar';

export default function Content() {
  return (
    <div className="py-16 size-full bg-linear-to-b from-sky-400 to-sky-200">
      <div className="flex flex-col gap-2 px-2 py-4">
        <h3 className="text-white text-2xl font-bold">오늘의 날씨</h3>
        <FcstTemperatureBar />
      </div>
    </div>
  );
}