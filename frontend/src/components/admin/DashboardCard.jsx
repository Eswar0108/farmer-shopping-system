export default function DashboardCard({ title, value, icon: Icon, color = "emerald" }) {
  const colorClasses = {
    emerald: "bg-emerald-50 text-emerald-700 border-emerald-100",
    amber: "bg-amber-50 text-amber-700 border-amber-100",
    blue: "bg-blue-50 text-blue-700 border-blue-100",
    rose: "bg-rose-50 text-rose-700 border-rose-100",
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex items-center justify-between">
      <div>
        <span className="text-sm font-semibold text-gray-400 uppercase tracking-wider">{title}</span>
        <h3 className="text-3xl font-extrabold text-gray-800 mt-2 tracking-tight">{value}</h3>
      </div>
      <div className={`p-4 rounded-2xl border ${colorClasses[color] || colorClasses.emerald}`}>
        <Icon size={24} />
      </div>
    </div>
  );
}
