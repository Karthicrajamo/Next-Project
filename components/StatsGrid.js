export default function StatsGrid({ stats }) {
  return (
    <div className="flex flex-wrap items-center justify-between text-center mt-8 space-y-4 md:space-y-0">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="w-1/2 md:w-auto flex-grow flex flex-col items-center"
        >
          <span className="text-2xl mono-font font-bold">{stat.value}</span>
          <span className="text-gray-600">{stat.label}</span>
        </div>
      ))}
    </div>
  );
}
