export function Loading() {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl flex flex-col items-center">
        <img src="/Logo.png" alt="EVOLX" className="h-16 mb-4 animate-pulse" />
        <div className="w-16 h-16 border-4 border-[#FF6B00] border-t-transparent rounded-full animate-spin"></div>
      </div>
    </div>
  );
}