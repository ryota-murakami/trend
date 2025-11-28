import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          Report Not Found
        </h2>
        <p className="text-gray-600 mb-8 max-w-md">
          The weekly report you&apos;re looking for doesn&apos;t exist or may have been moved.
        </p>
        <Link 
          href="/"
          className="inline-block rounded-lg bg-blue-600 px-6 py-2 text-white transition-colors hover:bg-blue-700"
        >
          Back to Home
        </Link>
      </div>
    </div>
  )
}