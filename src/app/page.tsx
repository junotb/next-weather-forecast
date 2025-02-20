import Fcst from '@/components/fcst/Fcst';

export default function Home() {
  return (
    <main className="size-full">
      <div className="relative flex justify-center items-center mx-auto w-full sm:w-md h-full shadow-2xl">
        <Fcst />
      </div>
    </main>
  );
}
