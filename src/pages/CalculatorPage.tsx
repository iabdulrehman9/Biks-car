import { useState, useMemo } from 'react';
import { Calculator, Ship, ShieldCheck, DollarSign, Info, ArrowRight } from 'lucide-react';
import { useRouter } from '@/lib/router';
import { formatUSD } from '@/lib/format';

const destinationPorts = [
  { country: 'Kenya', port: 'Mombasa', freight: 1800, insurance: 0.025 },
  { country: 'UAE', port: 'Dubai', freight: 1400, insurance: 0.02 },
  { country: 'Tanzania', port: 'Dar es Salaam', freight: 1900, insurance: 0.025 },
  { country: 'Bangladesh', port: 'Chittagong', freight: 1600, insurance: 0.025 },
  { country: 'Pakistan', port: 'Karachi', freight: 1500, insurance: 0.022 },
  { country: 'Sri Lanka', port: 'Colombo', freight: 1550, insurance: 0.022 },
  { country: 'Russia', port: 'Vladivostok', freight: 1200, insurance: 0.02 },
  { country: 'UK', port: 'London', freight: 1700, insurance: 0.025 },
  { country: 'Australia', port: 'Sydney', freight: 2000, insurance: 0.03 },
  { country: 'New Zealand', port: 'Auckland', freight: 2200, insurance: 0.03 },
];

export function CalculatorPage() {
  const { navigate } = useRouter();
  const [fobPrice, setFobPrice] = useState(20000);
  const [destIndex, setDestIndex] = useState(0);
  const [inspection, setInspection] = useState(250);
  const [inlandFreight, setInlandFreight] = useState(300);
  const [customDuty, setCustomDuty] = useState(0);

  const dest = destinationPorts[destIndex];

  const calc = useMemo(() => {
    const insurance = fobPrice * dest.insurance;
    const cif = fobPrice + dest.freight + insurance;
    const cnf = fobPrice + dest.freight;
    const total = cif + inspection + inlandFreight + customDuty;
    return {
      insurance: Math.round(insurance),
      freight: dest.freight,
      cif: Math.round(cif),
      cnf: Math.round(cnf),
      total: Math.round(total),
    };
  }, [fobPrice, dest, inspection, inlandFreight, customDuty]);

  const costBreakdown = [
    { label: 'FOB Price (Japan)', value: fobPrice, icon: DollarSign, color: 'text-navy' },
    { label: `Ocean Freight to ${dest.port}`, value: calc.freight, icon: Ship, color: 'text-gray-600' },
    { label: 'Marine Insurance', value: calc.insurance, icon: ShieldCheck, color: 'text-gray-600' },
    { label: 'Inspection Fee', value: inspection, icon: Info, color: 'text-gray-600' },
    { label: 'Inland Transport (Japan)', value: inlandFreight, icon: Ship, color: 'text-gray-600' },
    { label: 'Customs Duty (est.)', value: customDuty, icon: Info, color: 'text-gray-600' },
  ];

  return (
    <div className="animate-fade-in pt-16">
      <div className="bg-navy-dark py-12">
        <div className="container-page px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gold/10 text-gold">
              <Calculator className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                C&F / CIF Calculator
              </h1>
              <p className="mt-1 text-white/60">
                Estimate your total landed cost for importing a Japanese vehicle.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container-page px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Inputs */}
          <div className="lg:col-span-7">
            <div className="rounded-xl border border-gray-200 bg-white p-6">
              <h2 className="mb-6 text-lg font-bold text-navy">Vehicle & Shipping Details</h2>

              <div className="space-y-5">
                <div>
                  <label className="label-field">FOB Price (USD)</label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-medium text-gray-400">$</span>
                    <input
                      type="number"
                      value={fobPrice}
                      onChange={(e) => setFobPrice(Math.max(0, Number(e.target.value)))}
                      className="input-field pl-8"
                      min={0}
                    />
                  </div>
                </div>

                <div>
                  <label className="label-field">Destination Port</label>
                  <select
                    value={destIndex}
                    onChange={(e) => setDestIndex(Number(e.target.value))}
                    className="input-field"
                  >
                    {destinationPorts.map((d, i) => (
                      <option key={i} value={i}>{d.country} — {d.port}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div>
                    <label className="label-field">Inspection (USD)</label>
                    <input
                      type="number"
                      value={inspection}
                      onChange={(e) => setInspection(Math.max(0, Number(e.target.value)))}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="label-field">Inland Freight</label>
                    <input
                      type="number"
                      value={inlandFreight}
                      onChange={(e) => setInlandFreight(Math.max(0, Number(e.target.value)))}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="label-field">Customs Duty</label>
                    <input
                      type="number"
                      value={customDuty}
                      onChange={(e) => setCustomDuty(Math.max(0, Number(e.target.value)))}
                      className="input-field"
                    />
                  </div>
                </div>
              </div>

              {/* Cost breakdown */}
              <div className="mt-8 border-t border-gray-100 pt-6">
                <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-navy">Cost Breakdown</h3>
                <div className="space-y-2">
                  {costBreakdown.map((item, i) => (
                    <div key={i} className="flex items-center justify-between rounded-lg bg-gray-50 px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <item.icon className={`h-4 w-4 ${item.color}`} />
                        <span className="text-sm text-gray-600">{item.label}</span>
                      </div>
                      <span className="text-sm font-semibold text-navy">${formatUSD(item.value)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="lg:col-span-5">
            <div className="sticky top-24 space-y-4">
              <div className="overflow-hidden rounded-xl border border-navy/10 bg-navy text-white">
                <div className="p-6">
                  <h2 className="text-sm font-bold uppercase tracking-wider text-gold">Estimated Totals</h2>

                  <div className="mt-5 space-y-4">
                    <div className="rounded-lg bg-white/5 p-4">
                      <div className="flex items-center gap-2 text-xs text-white/50">
                        <Ship className="h-3.5 w-3.5" /> C&F (Cost & Freight)
                      </div>
                      <p className="mt-1 text-2xl font-extrabold text-white">${formatUSD(calc.cnf)}</p>
                      <p className="mt-1 text-xs text-white/40">FOB + Ocean Freight</p>
                    </div>

                    <div className="rounded-lg bg-white/5 p-4">
                      <div className="flex items-center gap-2 text-xs text-white/50">
                        <ShieldCheck className="h-3.5 w-3.5" /> CIF (Cost, Insurance & Freight)
                      </div>
                      <p className="mt-1 text-2xl font-extrabold text-gold">${formatUSD(calc.cif)}</p>
                      <p className="mt-1 text-xs text-white/40">FOB + Freight + Insurance</p>
                    </div>

                    <div className="rounded-lg border border-gold/30 bg-gold/10 p-4">
                      <div className="flex items-center gap-2 text-xs text-gold-light">
                        <DollarSign className="h-3.5 w-3.5" /> Total Landed Cost
                      </div>
                      <p className="mt-1 text-3xl font-extrabold text-gold">${formatUSD(calc.total)}</p>
                      <p className="mt-1 text-xs text-white/40">CIF + Inspection + Inland + Customs</p>
                    </div>
                  </div>
                </div>

                <div className="border-t border-white/10 bg-navy-dark p-6">
                  <p className="text-xs leading-relaxed text-white/40">
                    This calculator provides estimates only. Actual costs may vary
                    based on exchange rates, port fees, and local regulations.
                    Request a formal quote for exact pricing.
                  </p>
                  <button
                    onClick={() => navigate('/inquiry')}
                    className="btn-premium mt-4 w-full"
                  >
                    Request Formal Quote <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
