export default function Loader({ message = "Loading content..." }) {
  return (
    <div className="flex flex-col items-center justify-center p-12">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-600"></div>
      <p className="text-sm text-gray-500 mt-4 font-medium">{message}</p>
    </div>
  );
}
