export default function TestPage() {
  return (
    <div className="min-h-screen bg-red-500 flex items-center justify-center">
      <div className="bg-blue-500 p-8 rounded-lg">
        <h1 className="text-white text-4xl font-bold">Tailwind Test</h1>
        <p className="text-yellow-300 mt-4">If you see colors, Tailwind is working!</p>
        <div className="w-32 h-32 bg-gradient-to-br from-purple-500 to-pink-500 mt-4 rounded-lg"></div>
      </div>
    </div>
  );
}
