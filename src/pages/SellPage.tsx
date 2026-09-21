import { useState, useRef, type ChangeEvent, type FormEvent } from 'react';
import {
  Upload,
  X,
  CheckCircle2,
  Phone,
  MessageSquare,
  ShieldCheck,
  TrendingUp,
  Globe2,
  Clock,
  Sparkles,
  AlertCircle,
  Car,
  Truck,
  Cog,
  Wrench,
  Tractor,
} from 'lucide-react';
import { submitSellRequest } from '@/lib/api';
import { useTranslation } from '@/lib/i18n';
import { useRouter } from '@/lib/router';

const PREFERRED_CATEGORIES = [
  'Trucks',
  'Excavators',
  'Tyre Shover',
  'Forklifts',
  'Agriculture Machines',
  'Truck Fixtures',
  'Cars',
  'Other Parts',
];

const COMPANY_PHONE = '+819077144212';
const COMPANY_WHATSAPP = 'https://wa.me/819077144212';

export function SellPage() {
  const { navigate } = useRouter();
  const { t, categoryLabel } = useTranslation();

  const [customerName, setCustomerName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [category, setCategory] = useState('Trucks');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const newFiles = Array.from(e.target.files);
    const combinedFiles = [...images, ...newFiles].slice(0, 5); // Max 5 images
    setImages(combinedFiles);

    const newPreviews = combinedFiles.map((file) => URL.createObjectURL(file));
    setImagePreviews(newPreviews);
  };

  const removeImage = (index: number) => {
    const updatedImages = images.filter((_, i) => i !== index);
    setImages(updatedImages);
    const updatedPreviews = imagePreviews.filter((_, i) => i !== index);
    setImagePreviews(updatedPreviews);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!customerName.trim()) {
      setErrorMessage(t('sell.errName', 'Please enter your name.'));
      return;
    }
    if (!phone.trim()) {
      setErrorMessage(t('sell.errPhone', 'Please enter your phone or WhatsApp number.'));
      return;
    }
    if (!email.trim()) {
      setErrorMessage(t('sell.errEmail', 'Please enter your email address.'));
      return;
    }
    if (!address.trim()) {
      setErrorMessage(t('sell.errAddress', 'Please enter your location or address.'));
      return;
    }
    if (!description.trim()) {
      setErrorMessage(t('sell.errDescription', 'Please describe the vehicle, machine, or parts you wish to sell.'));
      return;
    }

    try {
      setSubmitting(true);
      await submitSellRequest({
        customer_name: customerName,
        email,
        phone,
        address,
        category,
        description,
        images,
      });
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      setErrorMessage(err.message || t('sell.submitError', 'Failed to submit request. Please try again or contact us directly.'));
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setCustomerName('');
    setEmail('');
    setPhone('');
    setAddress('');
    setCategory('Trucks');
    setDescription('');
    setImages([]);
    setImagePreviews([]);
    setSubmitted(false);
    setErrorMessage(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-16 sm:pt-20">
      {/* Hero Header */}
      <div className="relative overflow-hidden bg-[#001030] text-white py-12 sm:py-16">
        {/* Background glow and decorative grid */}
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#D0A030_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-[#D0A030]/10 blur-3xl pointer-events-none" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#D0A030]/30 bg-[#D0A030]/10 px-3.5 py-1 text-xs font-extrabold uppercase tracking-wider text-[#D0A030]">
            <Sparkles className="h-3.5 w-3.5" />
            <span>{t('sell.badge', 'BIKS Machinery & Vehicle Consignment')}</span>
          </div>

          <h1 className="mt-4 font-heading text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl text-white">
            {t('sell.title', 'Sell Your Equipment, Trucks & Cars With BIKS')}
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-slate-300 sm:text-base">
            {t(
              'sell.subtitle',
              'Connect directly with our global export network. Submit your machinery, trucks, cars, or equipment details below — our valuation team will review and contact you promptly with the best market offer.'
            )}
          </p>

          {/* Quick Stats / Trust Points */}
          <div className="mx-auto mt-8 grid max-w-3xl grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="rounded-xl border border-white/10 bg-white/5 p-3.5 backdrop-blur-sm">
              <TrendingUp className="mx-auto h-5 w-5 text-[#D0A030]" />
              <div className="mt-1.5 text-xs font-bold text-white">{t('sell.stat1', 'Best Market Value')}</div>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-3.5 backdrop-blur-sm">
              <Globe2 className="mx-auto h-5 w-5 text-[#D0A030]" />
              <div className="mt-1.5 text-xs font-bold text-white">{t('sell.stat2', 'Global Buyers')}</div>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-3.5 backdrop-blur-sm">
              <Clock className="mx-auto h-5 w-5 text-[#D0A030]" />
              <div className="mt-1.5 text-xs font-bold text-white">{t('sell.stat3', '24h Fast Response')}</div>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-3.5 backdrop-blur-sm">
              <ShieldCheck className="mx-auto h-5 w-5 text-[#D0A030]" />
              <div className="mt-1.5 text-xs font-bold text-white">{t('sell.stat4', 'Zero Hassle Export')}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Step-by-Step Guide */}
        <div className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#001030] text-xs font-extrabold text-[#D0A030]">
              1
            </div>
            <div>
              <h4 className="text-xs font-extrabold uppercase tracking-wide text-[#001030]">
                {t('sell.step1Title', 'Submit Details')}
              </h4>
              <p className="mt-0.5 text-xs text-slate-500">
                {t('sell.step1Desc', 'Fill in your item specs, condition, and contact information.')}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#001030] text-xs font-extrabold text-[#D0A030]">
              2
            </div>
            <div>
              <h4 className="text-xs font-extrabold uppercase tracking-wide text-[#001030]">
                {t('sell.step2Title', 'Fast Valuation')}
              </h4>
              <p className="mt-0.5 text-xs text-slate-500">
                {t('sell.step2Desc', 'Our appraisal team reviews and contacts you via Phone or WhatsApp.')}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#001030] text-xs font-extrabold text-[#D0A030]">
              3
            </div>
            <div>
              <h4 className="text-xs font-extrabold uppercase tracking-wide text-[#001030]">
                {t('sell.step3Title', 'List & Sell Globally')}
              </h4>
              <p className="mt-0.5 text-xs text-slate-500">
                {t('sell.step3Desc', 'Once agreed, we showcase your item to verified international buyers.')}
              </p>
            </div>
          </div>
        </div>

        {/* Success Confirmation Card */}
        {submitted ? (
          <div className="rounded-3xl border border-emerald-200 bg-white p-8 text-center shadow-xl sm:p-12 animate-in fade-in zoom-in-95 duration-300">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
              <CheckCircle2 className="h-10 w-10" />
            </div>

            <h2 className="mt-4 font-heading text-2xl font-black text-[#001030] sm:text-3xl">
              {t('sell.successTitle', 'Request Submitted Successfully!')}
            </h2>

            <p className="mx-auto mt-2 max-w-lg text-sm text-slate-600 sm:text-base">
              {t(
                'sell.successMessage',
                'Thank you for submitting your equipment details. Our Japanese vehicle & machinery valuation team is reviewing your request and will contact you within 24 hours.'
              )}
            </p>

            {/* Direct Contact CTA for Urgent Inquiries */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <a
                href={COMPANY_WHATSAPP}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-[#25D366] px-5 py-3 text-xs font-extrabold uppercase tracking-wider text-white shadow-sm hover:bg-[#20ba5a] transition-all"
              >
                <MessageSquare className="h-4 w-4" />
                <span>{t('sell.chatWhatsApp', 'Chat on WhatsApp')}</span>
              </a>

              <a
                href={`tel:${COMPANY_PHONE}`}
                className="inline-flex items-center gap-2 rounded-xl bg-[#001030] px-5 py-3 text-xs font-extrabold uppercase tracking-wider text-[#D0A030] shadow-sm hover:bg-[#001a45] transition-all"
              >
                <Phone className="h-4 w-4" />
                <span>{t('sell.callDirect', 'Call Us Directly')}</span>
              </a>
            </div>

            <div className="mt-8 border-t border-slate-100 pt-6">
              <button
                type="button"
                onClick={handleReset}
                className="text-xs font-bold text-slate-500 hover:text-[#001030] underline underline-offset-4"
              >
                {t('sell.submitAnother', 'Submit another vehicle or equipment')}
              </button>
            </div>
          </div>
        ) : (
          /* Submission Form Container */
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl sm:p-10">
            <div className="border-b border-slate-100 pb-5">
              <h2 className="font-heading text-xl font-black text-[#001030] sm:text-2xl">
                {t('sell.formTitle', 'Seller Request Form')}
              </h2>
              <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                {t('sell.formSubtitle', 'Please fill out the information below. All fields marked with * are required.')}
              </p>
            </div>

            {errorMessage && (
              <div className="mt-6 flex items-center gap-2.5 rounded-xl border border-rose-200 bg-rose-50 p-4 text-xs font-bold text-rose-700">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-6 space-y-6">
              {/* Row 1: Name and Phone */}
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-[#001030]">
                    {t('sell.nameLabel', 'Customer Name')} <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder={t('sell.namePlaceholder', 'e.g. John Doe / 田中 太郎')}
                    className="mt-1.5 w-full rounded-xl border border-slate-300 bg-slate-50/50 px-4 py-3 text-sm font-medium text-slate-900 transition-colors focus:border-[#D0A030] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#D0A030]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-[#001030]">
                    {t('sell.phoneLabel', 'Phone Number ')} <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder={t('sell.phonePlaceholder', 'e.g. +81 90-1234-5678')}
                    className="mt-1.5 w-full rounded-xl border border-slate-300 bg-slate-50/50 px-4 py-3 text-sm font-medium text-slate-900 transition-colors focus:border-[#D0A030] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#D0A030]"
                  />
                </div>
              </div>

              {/* Row 2: Email and Address */}
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-[#001030]">
                    {t('sell.emailLabel', 'Email Address')} <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t('sell.emailPlaceholder', 'e.g. customer@example.com')}
                    className="mt-1.5 w-full rounded-xl border border-slate-300 bg-slate-50/50 px-4 py-3 text-sm font-medium text-slate-900 transition-colors focus:border-[#D0A030] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#D0A030]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-[#001030]">
                    {t('sell.addressLabel', 'Address / Location')} <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder={t('sell.addressPlaceholder', 'e.g. Ibaraki, Japan / City & Country')}
                    className="mt-1.5 w-full rounded-xl border border-slate-300 bg-slate-50/50 px-4 py-3 text-sm font-medium text-slate-900 transition-colors focus:border-[#D0A030] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#D0A030]"
                  />
                </div>
              </div>

              {/* Row 3: Category */}
              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-[#001030]">
                  {t('sell.categoryLabel', 'Item Category')}
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-slate-300 bg-slate-50/50 px-4 py-3 text-sm font-bold text-slate-900 transition-colors focus:border-[#D0A030] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#D0A030]"
                >
                  {PREFERRED_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {categoryLabel(cat)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Row 4: Description */}
              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-[#001030]">
                  {t('sell.descLabel', 'Description & Vehicle Details')} <span className="text-rose-500">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder={t(
                    'sell.descPlaceholder',
                    'Describe your item in detail: Make, Model, Year, Mileage or Operating Hours, Condition, Engine/Transmission, Asking Price, or any special fixtures.'
                  )}
                  className="mt-1.5 w-full rounded-xl border border-slate-300 bg-slate-50/50 px-4 py-3 text-sm font-medium text-slate-900 transition-colors focus:border-[#D0A030] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#D0A030]"
                />
              </div>

              {/* Row 5: Optional Images Upload */}
              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-[#001030]">
                  {t('sell.photosLabel', 'Photos (Optional, Up to 5)')}
                </label>
                <p className="mt-0.5 text-xs text-slate-500">
                  {t('sell.photosHint', 'Upload photos of the front, interior, machinery plate, or condition.')}
                </p>

                <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-5">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative aspect-video sm:aspect-square overflow-hidden rounded-xl border border-slate-200 bg-slate-100 group">
                      <img src={preview} alt={`Upload ${index + 1}`} className="h-full w-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute right-1.5 top-1.5 rounded-full bg-rose-600 p-1 text-white shadow-md hover:bg-rose-700 transition-transform active:scale-95"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}

                  {images.length < 5 && (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex aspect-video sm:aspect-square flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50/70 p-4 text-center transition-colors hover:border-[#D0A030] hover:bg-[#D0A030]/5"
                    >
                      <Upload className="h-5 w-5 text-slate-400" />
                      <span className="mt-1 text-[11px] font-bold text-slate-600">
                        {t('sell.addPhoto', 'Add Photo')}
                      </span>
                    </button>
                  )}
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#001030] py-4 text-sm font-extrabold uppercase tracking-wider text-[#D0A030] shadow-lg shadow-black/10 transition-all hover:bg-[#001a45] hover:shadow-xl active:scale-[0.99] disabled:opacity-50"
                >
                  {submitting ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#D0A030] border-t-transparent" />
                      <span>{t('sell.submitting', 'Submitting Request...')}</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" />
                      <span>{t('sell.submitBtn', 'Submit Selling Request')}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
