import FcstTodayCard from '@/components/fcst/FcstTodayCard';
import FcstTemperatureBar from '@/components/fcst/FcstTemperatureBar';

export default function FcstContent() {
  return (
    <div className="py-16 size-full bg-linear-to-b from-sky-400 to-sky-200">
      <div className="flex flex-col gap-2 px-2 py-4">
        <FcstTodayCard />
        <FcstTemperatureBar />
      </div>
    </div>
  );
}