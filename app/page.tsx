'use client'
import { useState } from 'react'

const FEES: Record<string, { pct: number; fixed: number; currency: string; tax?: number }> = {
  'US': { pct: 2.9, fixed: 0.30, currency: 'USD' },
  'GB': { pct: 1.5, fixed: 0.20, currency: 'GBP' },
  'EU': { pct: 1.5, fixed: 0.25, currency: 'EUR' },
  'CA': { pct: 2.9, fixed: 0.30, currency: 'CAD' },
  'AU': { pct: 1.75, fixed: 0.30, currency: 'AUD' },
  'IN': { pct: 2.0, fixed: 0.00, currency: 'INR', tax: 18 },
  'BR': { pct: 3.99, fixed: 0.39, currency: 'BRL', tax: 0 },
  'SG': { pct: 3.4, fixed: 0.50, currency: 'SGD' },
  'JP': { pct: 3.6, fixed: 0.00, currency: 'JPY' },
  'MX': { pct: 3.6, fixed: 3.00, currency: 'MXN' },
}

const METHODS = ['Card', 'ACH', 'SEPA', 'iDEAL', 'Klarna']
const METHOD_SURCHARGE: Record<string, number> = { ACH: -1.0, SEPA: -0.5, iDEAL: 0.3, Klarna: 0.8, Card: 0 }

const FAQ = [
  { q: 'How are Stripe fees calculated?', a: 'Stripe charges a percentage of the transaction plus a fixed fee per successful charge. Rates vary by country, payment method, and currency conversion.' },
  { q: 'Does Stripe charge extra for international cards?', a: 'Yes. An additional 1.5% applies for international cards, and another 1% if currency conversion is required.' },
  { q: 'Are taxes included in Stripe fees?', a: 'In some countries like India, GST (18%) is applied on top of Stripe fees. Our calculator includes these where applicable.' },
]

export default function Page() {
  const [amount, setAmount] = useState('100')
  const [country, setCountry] = useState('US')
  const [method, setMethod] = useState('Card')
  const [intl, setIntl] = useState(false)

  const fee = FEES[country]
  const amt = parseFloat(amount) || 0
  const pct = fee.pct + (METHOD_SURCHARGE[method] || 0) + (intl ? 1.5 : 0)
  const stripeFee = (amt * pct) / 100 + fee.fixed
  const taxFee = fee.tax ? stripeFee * fee.tax / 100 : 0
  const total = stripeFee + taxFee
  const net = amt - total

  return (
    <main className="min-h-screen bg-[#0d1117] text-[#c9d1d9] font-sans">
      <section className="max-w-3xl mx-auto px-4 pt-20 pb-12 text-center">
        <span className="text-xs uppercase tracking-widest text-[#58a6ff] font-semibold">Stripe Fee Calculator</span>
        <h1 className="text-4xl font-bold text-white mt-3 mb-4">Calculate Exact Stripe Fees<br />for Global Payments</h1>
        <p className="text-[#8b949e] text-lg max-w-xl mx-auto">Real-time Stripe processing fees by country, payment method, and currency — with tax implications for SaaS founders expanding internationally.</p>
      </section>

      <section className="max-w-2xl mx-auto px-4 pb-16">
        <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-6 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-[#8b949e] mb-1">Amount</label>
              <input type="number" min="0" value={amount} onChange={e => setAmount(e.target.value)}
                className="w-full bg-[#0d1117] border border-[#30363d] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#58a6ff]" />
            </div>
            <div>
              <label className="block text-xs text-[#8b949e] mb-1">Country / Region</label>
              <select value={country} onChange={e => setCountry(e.target.value)}
                className="w-full bg-[#0d1117] border border-[#30363d] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#58a6ff]">
                {Object.keys(FEES).map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs text-[#8b949e] mb-2">Payment Method</label>
            <div className="flex flex-wrap gap-2">
              {METHODS.map(m => (
                <button key={m} onClick={() => setMethod(m)}
                  className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                    method === m ? 'bg-[#58a6ff] border-[#58a6ff] text-[#0d1117] font-semibold' : 'border-[#30363d] text-[#8b949e] hover:border-[#58a6ff]'
                  }`}>{m}</button>
              ))}
            </div>
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={intl} onChange={e => setIntl(e.target.checked)} className="accent-[#58a6ff]" />
            <span className="text-sm text-[#8b949e]">International card (+1.5%)</span>
          </label>
          <div className="bg-[#0d1117] rounded-xl p-4 space-y-2 border border-[#30363d]">
            <div className="flex justify-between text-sm"><span className="text-[#8b949e]">Rate</span><span className="text-white">{pct.toFixed(2)}% + {fee.fixed.toFixed(2)} {fee.currency}</span></div>
            <div className="flex justify-between text-sm"><span className="text-[#8b949e]">Stripe Fee</span><span className="text-[#f85149]">{stripeFee.toFixed(2)} {fee.currency}</span></div>
            {taxFee > 0 && <div className="flex justify-between text-sm"><span className="text-[#8b949e]">Tax ({fee.tax}%)</span><span className="text-[#f85149]">{taxFee.toFixed(2)} {fee.currency}</span></div>}
            <div className="flex justify-between text-sm"><span className="text-[#8b949e]">Total Fees</span><span className="text-[#f85149] font-semibold">{total.toFixed(2)} {fee.currency}</span></div>
            <div className="border-t border-[#30363d] pt-2 flex justify-between font-bold"><span>You Receive</span><span className="text-[#3fb950] text-lg">{net.toFixed(2)} {fee.currency}</span></div>
          </div>
        </div>
      </section>

      <section className="max-w-md mx-auto px-4 pb-20 text-center">
        <div className="bg-[#161b22] border border-[#58a6ff] rounded-2xl p-8">
          <span className="text-xs uppercase tracking-widest text-[#58a6ff] font-semibold">Pro Plan</span>
          <div className="text-4xl font-bold text-white mt-3">$9<span className="text-lg font-normal text-[#8b949e]">/mo</span></div>
          <p className="text-[#8b949e] mt-2 mb-6 text-sm">Bulk calculations, API access, all countries, CSV export</p>
          <ul className="text-left space-y-2 mb-6 text-sm">
            {['All 50+ countries & regions','Bulk fee calculator','REST API access','CSV & PDF export','Priority support'].map(f => (
              <li key={f} className="flex items-center gap-2"><span className="text-[#3fb950]">✓</span>{f}</li>
            ))}
          </ul>
          <a href={process.env.NEXT_PUBLIC_LS_CHECKOUT_URL || '#'}
            className="block w-full bg-[#58a6ff] hover:bg-[#79b8ff] text-[#0d1117] font-bold py-3 rounded-xl transition-colors">
            Get Pro Access
          </a>
        </div>
      </section>

      <section className="max-w-2xl mx-auto px-4 pb-20">
        <h2 className="text-xl font-bold text-white mb-6 text-center">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {FAQ.map(({ q, a }) => (
            <div key={q} className="bg-[#161b22] border border-[#30363d] rounded-xl p-5">
              <div className="font-semibold text-white mb-1">{q}</div>
              <div className="text-[#8b949e] text-sm">{a}</div>
            </div>
          ))}
        </div>
      </section>

      <footer className="text-center text-xs text-[#484f58] pb-8">© {new Date().getFullYear()} Stripe Fee Calculator. Not affiliated with Stripe, Inc.</footer>
    </main>
  )
}
