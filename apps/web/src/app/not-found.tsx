import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-200 mb-4">404</h1>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Page Not Found</h2>
        <p className="text-gray-600 mb-8">The page you are looking for does not exist.</p>
        <div className="flex gap-4 justify-center">
          <Link href="/" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
            Go Home
          </Link>
          <Link href="/tools" className="border border-gray-300 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors">
            Browse Tools
          </Link>
        </div>
      </div>
    </div>
  );
}
