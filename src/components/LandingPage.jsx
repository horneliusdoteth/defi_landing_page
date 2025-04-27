import { useNavigate } from 'react-router-dom'
import { CALENDLY_URL } from '../constants'

export default function LandingPage() {
  const nav = useNavigate()
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 px-4 sm:px-6 lg:px-8 py-8 flex flex-col space-y-12">
      <header className="text-center space-y-4 max-w-2xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-extrabold">Drippy Finance → DeFi made drip-simple</h1>
        <p className="text-gray-300 text-lg">Our proven 4-step formula to grow your crypto safely.</p>
        <button
          onClick={() => nav('/apply')}
          className="mt-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-white text-lg"
        >
          Schedule Initial Consultation
        </button>
      </header>

      <section className="space-y-6 max-w-3xl mx-auto">
        <div className="w-full h-56 sm:h-64 lg:h-80 bg-gray-800 rounded-lg flex items-center justify-center">
          {/* Replace with your <video> or carousel */}
          <span className="text-gray-500">▶️ Video / Carousel here</span>
        </div>
        <button
          onClick={() => nav('/apply')}
          className="w-full md:w-auto block mx-auto px-6 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-white text-lg"
        >
          Schedule Initial Consultation
        </button>
      </section>

      <section className="space-y-12 max-w-3xl mx-auto">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Proof →</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <img src="/proof1.png" alt="Portfolio PnL 1" className="w-full h-auto rounded-lg shadow-lg" />
            <img src="/proof2.png" alt="Portfolio PnL 2" className="w-full h-auto rounded-lg shadow-lg" />
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-2">Q &amp; A</h2>
          <ul className="list-disc list-inside space-y-1 text-gray-300">
            <li>What is DeFi coaching?</li>
            <li>How does your 4-step formula work?</li>
          </ul>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-2">Features We’ll Build</h2>
          <ul className="list-disc list-inside space-y-1 text-gray-300">
            <li>Custom yield-farming dashboards</li>
            <li>Risk-managed LP strategies</li>
            <li>…and more</li>
          </ul>
        </div>
      </section>
    </div>
  )
}
