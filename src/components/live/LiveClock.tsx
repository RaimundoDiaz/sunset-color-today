export function LiveClock({ time, date }: { time: string; date: string }) {
  return (
    <div className="text-center mb-5">
      <div className="text-[3.2rem] font-light tracking-wider font-mono leading-tight text-black/80 max-sm:text-[2.4rem]">
        {time}
      </div>
      <div className="text-sm font-light text-black/40 mt-1 capitalize">{date}</div>
    </div>
  );
}
