import { useEffect, useState } from 'react';
import { Send, CheckCircle2, Car, FileText, Package } from 'lucide-react';
import { supabase, type Vehicle } from '@/lib/supabase';
import { useRouter } from '@/lib/router';

const inquiryTypes = [
  { value: 'inquiry', label: 'General Inquiry', icon: FileText },
  { value: 'quote', label: 'Request Quote', icon: Car },
  { value: 'reservation', label: 'Reserve Vehicle', icon: Package },
];

export function InquiryPage() {
  const { route, navigate } = useRouter();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const initialType = route.query.get('type') || 'quote';
  const initialVehicle = route.query.get('vehicle') || '';

  const [form, setForm] = useState({
    type: initialType,
    vehicle_id: initialVehicle,
    name: '',
    email: '',
    phone: '',
    country: '',
    destination_port: '',
    message: '',
  });

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from('vehicles').select('*').order('make');
      setVehicles(data || []);
    })();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    // In a real system this would write to an inquiries table.
    // For now we simulate submission.
    await new Promise((r) => setTimeout(r, 800));
    setSubmitting(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center pt-16">
        <div className="mx-auto max-w-md rounded-xl border border-gray-200 bg-white p-8 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-50">
            <CheckCircle2 className="h-8 w-8 text-status-success" />
          </div>
          <h1 className="mt-5 text-xl font-extrabold text-navy">Request Submitted!</h1>
          <p className="mt-2 text-sm text-gray-500">
            Thank you for your interest in BIKS Car Trading. Our team will review
            your request and respond within 24 hours with detailed information.
          </p>
          <button onClick={() => navigate('/')} className="btn-primary mt-6">
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in pt-16">
      <div className="bg-navy-dark py-12">
        <div className="container-page px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Inquiry & Quotation
          </h1>
          <p className="mt-2 text-white/60">
            Tell us what you're looking for and our team will prepare a detailed quote.
          </p>
        </div>
      </div>

      <div className="container-page px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <form onSubmit={handleSubmit} className="rounded-xl border border-gray-200 bg-white p-6">
              {/* Inquiry type */}
              <div>
                <label className="label-field">Request Type</label>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  {inquiryTypes.map((t) => (
                    <button
                      key={t.value}
                      type="button"
                      onClick={() => setForm({ ...form, type: t.value })}
                      className={`flex items-center gap-3 rounded-lg border p-4 text-left transition-all ${
                        form.type === t.value
                          ? 'border-navy bg-navy/5'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <t.icon className={`h-5 w-5 ${form.type === t.value ? 'text-navy' : 'text-gray-400'}`} />
                      <span className={`text-sm font-semibold ${form.type === t.value ? 'text-navy' : 'text-gray-600'}`}>
                        {t.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="label-field">Full Name *</label>
                  <input
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="input-field"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="label-field">Email *</label>
                  <input
                    required
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="input-field"
                    placeholder="john@example.com"
                  />
                </div>
                <div>
                  <label className="label-field">Phone</label>
                  <input
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="input-field"
                    placeholder="+1 234 567 890"
                  />
                </div>
                <div>
                  <label className="label-field">Country</label>
                  <input
                    value={form.country}
                    onChange={(e) => setForm({ ...form, country: e.target.value })}
                    className="input-field"
                    placeholder="Your country"
                  />
                </div>
                <div>
                  <label className="label-field">Destination Port</label>
                  <input
                    value={form.destination_port}
                    onChange={(e) => setForm({ ...form, destination_port: e.target.value })}
                    className="input-field"
                    placeholder="e.g. Mombasa, Dubai"
                  />
                </div>
                <div>
                  <label className="label-field">Vehicle of Interest</label>
                  <select
                    value={form.vehicle_id}
                    onChange={(e) => setForm({ ...form, vehicle_id: e.target.value })}
                    className="input-field"
                  >
                    <option value="">Any / Not specified</option>
                    {vehicles.map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.year} {v.make} {v.model} (#{v.stock_id})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-4">
                <label className="label-field">Message</label>
                <textarea
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  rows={4}
                  className="input-field resize-none"
                  placeholder="Describe what you're looking for, specific requirements, budget, etc."
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="btn-primary mt-6 w-full disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" /> Submit Request
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4">
            <div className="rounded-xl border border-navy/10 bg-navy p-6 text-white">
              <h2 className="text-sm font-bold uppercase tracking-wider text-gold">Why Request a Quote?</h2>
              <ul className="mt-4 space-y-3 text-sm text-white/70">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                  <span>Personalized pricing with full cost breakdown</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                  <span>Access to vehicles not yet listed in our marketplace</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                  <span>Direct sourcing from Japanese auto auctions</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                  <span>Complete shipping and documentation support</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                  <span>Response guaranteed within 24 hours</span>
                </li>
              </ul>
            </div>

            <div className="mt-4 rounded-xl border border-gray-200 bg-white p-6">
              <h2 className="text-sm font-bold uppercase tracking-wider text-navy">Need Help?</h2>
              <p className="mt-2 text-sm text-gray-500">
                Our trading specialists are available to assist you with any questions.
              </p>
              <div className="mt-4 space-y-2 text-sm">
                <p className="text-gray-600">Phone: <span className="font-semibold text-navy">+81 45 000 0000</span></p>
                <p className="text-gray-600">Email: <span className="font-semibold text-navy">info@bikstrading.com</span></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
