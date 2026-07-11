export default function Footer() {
  return (
    <footer className="bg-emerald-900 text-emerald-100 py-8 border-t border-emerald-800">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <p className="text-sm">&copy; {new Date().getFullYear()} Farmer Products Shopping Cart. All rights reserved.</p>
        <p className="text-xs text-emerald-400 mt-2">Connecting local growers and consumers with fresh organic harvests.</p>
      </div>
    </footer>
  );
}
