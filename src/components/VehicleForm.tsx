import { useState, useRef, useEffect } from 'react';
import { Upload, X, Plus, Image as ImageIcon, Check } from 'lucide-react';
import { type Vehicle, type VehicleStatus, fetchCategories, createCategory } from '@/lib/api';
import { useAdminTranslation } from '@/lib/i18n';

interface VehicleFormProps {
  vehicle?: Vehicle | null;
  onSubmit: (formData: FormData) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

const bodyTypes = ['SUV', 'Sedan', 'Coupe', 'Van', 'Hatchback', 'Wagon', 'Truck'];
const fuelTypes = ['Petrol', 'Diesel', 'Hybrid', 'Electric'];
const transmissions = ['Automatic', 'Manual'];
const statuses = ['Available', 'Reserved', 'Sold', 'In Transit', 'Delivered'];

export function VehicleForm({ vehicle, onSubmit, onCancel, loading }: VehicleFormProps) {
  const { t, categoryLabel } = useAdminTranslation();
  const [make, setMake] = useState(vehicle?.make || '');
  const [model, setModel] = useState(vehicle?.model || '');
  const [year, setYear] = useState(vehicle?.year?.toString() || '');
  const [category, setCategory] = useState(vehicle?.category || 'Cars');
  const [categories, setCategories] = useState<string[]>([
    'Trucks',
    'Cars',
    'Tyre Shover',
    'Forklifts',
    'Agricultural Machines',
    'Truck Fixtures',
    'Other Parts',
  ]);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [creatingCategory, setCreatingCategory] = useState(false);
  const [bodyType, setBodyType] = useState(vehicle?.body_type || '');
  const [transmission, setTransmission] = useState(vehicle?.transmission || '');
  const [fuelType, setFuelType] = useState(vehicle?.fuel_type || '');
  const [engineCc, setEngineCc] = useState(vehicle?.engine_cc?.toString() || '');
  const [mileageKm, setMileageKm] = useState(vehicle?.mileage_km?.toString() || '');
  const [color, setColor] = useState(vehicle?.color || '');
  const [priceFobJpy, setPriceFobJpy] = useState(vehicle?.price_fob_jpy?.toString() || '');
  const [priceFobUsd, setPriceFobUsd] = useState(vehicle?.price_fob_usd?.toString() || '');
  const [status, setStatus] = useState(vehicle?.status || 'Available');
  const [location, setLocation] = useState(vehicle?.location || '');
  const [featured, setFeatured] = useState(vehicle?.featured || false);
  const [description, setDescription] = useState(vehicle?.description || '');
  const [chassisNo, setChassisNo] = useState(vehicle?.chassis_no || '');
  const [stockId, setStockId] = useState(vehicle?.stock_id || '');
  const [features, setFeatures] = useState<string[]>(vehicle?.features || []);
  const [featureInput, setFeatureInput] = useState('');
  const [existingGallery, setExistingGallery] = useState<string[]>(vehicle?.gallery || []);

  // File uploads
  const [mainImageFile, setMainImageFile] = useState<File | null>(null);
  const [mainImagePreview, setMainImagePreview] = useState<string | null>(vehicle?.image_url || null);
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);

  const mainImageRef = useRef<HTMLInputElement>(null);
  const galleryRef = useRef<HTMLInputElement>(null);

  const handleMainImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setMainImageFile(file);
      setMainImagePreview(URL.createObjectURL(file));
    }
  };

  const handleGalleryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setGalleryFiles(prev => [...prev, ...files]);
    setGalleryPreviews(prev => [...prev, ...files.map(f => URL.createObjectURL(f))]);
  };

  const removeGalleryFile = (index: number) => {
    setGalleryFiles(prev => prev.filter((_, i) => i !== index));
    setGalleryPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const removeExistingGalleryImage = (index: number) => {
    setExistingGallery(prev => prev.filter((_, i) => i !== index));
  };

  const addFeature = () => {
    const trimmed = featureInput.trim();
    if (trimmed && !features.includes(trimmed)) {
      setFeatures(prev => [...prev, trimmed]);
      setFeatureInput('');
    }
  };

  const removeFeature = (index: number) => {
    setFeatures(prev => prev.filter((_, i) => i !== index));
  };

  useEffect(() => {
    fetchCategories().then(cats => {
      if (cats && cats.length > 0) {
        setCategories(prev => Array.from(new Set([...prev, ...cats.map(c => c.name)])));
      }
    }).catch(err => console.error('Error fetching categories in form:', err));
  }, []);

  const handleCreateCategory = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = newCategoryName.trim();
    if (!trimmed) return;
    setCreatingCategory(true);
    try {
      const created = await createCategory(trimmed);
      setCategories(prev => Array.from(new Set([...prev, created.name])));
      setCategory(created.name);
      setNewCategoryName('');
      setIsAddingCategory(false);
    } catch (err) {
      console.error('Error creating category:', err);
      // Local fallback
      setCategories(prev => Array.from(new Set([...prev, trimmed])));
      setCategory(trimmed);
      setNewCategoryName('');
      setIsAddingCategory(false);
    } finally {
      setCreatingCategory(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('make', make);
    formData.append('model', model);
    formData.append('year', year);
    formData.append('category', category);
    if (bodyType) formData.append('body_type', bodyType);
    if (transmission) formData.append('transmission', transmission);
    if (fuelType) formData.append('fuel_type', fuelType);
    if (engineCc) formData.append('engine_cc', engineCc);
    if (mileageKm) formData.append('mileage_km', mileageKm);
    if (color) formData.append('color', color);
    if (priceFobJpy) formData.append('price_fob_jpy', priceFobJpy);
    if (priceFobUsd) formData.append('price_fob_usd', priceFobUsd);
    formData.append('status', status);
    if (location) formData.append('location', location);
    formData.append('featured', featured.toString());
    if (description) formData.append('description', description);
    if (chassisNo) formData.append('chassis_no', chassisNo);
    if (stockId) formData.append('stock_id', stockId);
    formData.append('features', JSON.stringify(features));
    formData.append('gallery', JSON.stringify(existingGallery));

    // Append main image
    if (mainImageFile) {
      formData.append('main_image', mainImageFile);
    } else if (vehicle?.image_url && !mainImageFile) {
      formData.append('image_url', vehicle.image_url);
    }

    // Append gallery images
    galleryFiles.forEach(file => {
      formData.append('gallery_images', file);
    });

    await onSubmit(formData);
  };

  const inputClass = 'w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 transition-all focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold';
  const labelClass = 'mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500';
  const selectClass = 'w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 transition-all focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold';

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Info */}
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-navy">
          Basic Information
        </h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <label className={labelClass}>Make *</label>
            <input type="text" value={make} onChange={e => setMake(e.target.value)} required placeholder="e.g. Toyota" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Model *</label>
            <input type="text" value={model} onChange={e => setModel(e.target.value)} required placeholder="e.g. Land Cruiser" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Year *</label>
            <input type="number" value={year} onChange={e => setYear(e.target.value)} required min="1980" max="2030" placeholder="e.g. 2022" className={inputClass} />
          </div>

          {/* Category */}
          <div className="sm:col-span-2 lg:col-span-3">
            <div className="mb-1.5 flex items-center justify-between">
              <label className={labelClass}>Category *</label>
              {!isAddingCategory ? (
                <button
                  type="button"
                  onClick={() => setIsAddingCategory(true)}
                  className="inline-flex items-center gap-1 text-xs font-bold text-[#D0A030] hover:underline"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>{t('form.addCategory', 'Add New Category')}</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => { setIsAddingCategory(false); setNewCategoryName(''); }}
                  className="text-xs font-semibold text-gray-500 hover:text-gray-700"
                >
                  Cancel
                </button>
              )}
            </div>

            {isAddingCategory ? (
              <div className="flex items-center gap-2 rounded-lg border border-[#D0A030] bg-amber-50/50 p-2">
                <input
                  type="text"
                  placeholder="Enter new category name (e.g. Excavators)..."
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  className="flex-1 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm focus:border-[#001030] focus:outline-none"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => handleCreateCategory()}
                  disabled={creatingCategory || !newCategoryName.trim()}
                  className="rounded-md bg-[#001030] px-4 py-1.5 text-xs font-bold text-white transition-all hover:bg-slate-800 disabled:opacity-50"
                >
                  {creatingCategory ? 'Saving...' : 'Save & Select'}
                </button>
              </div>
            ) : (
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className={selectClass}
                required
              >
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            )}
          </div>

          <div>
            <label className={labelClass}>Body Type</label>
            <select value={bodyType} onChange={e => setBodyType(e.target.value)} className={selectClass}>
              <option value="">Select...</option>
              {bodyTypes.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className={labelClass}>Transmission</label>
            <select value={transmission} onChange={e => setTransmission(e.target.value)} className={selectClass}>
              <option value="">Select...</option>
              {transmissions.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className={labelClass}>Fuel Type</label>
            <select value={fuelType} onChange={e => setFuelType(e.target.value)} className={selectClass}>
              <option value="">Select...</option>
              {fuelTypes.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className={labelClass}>Engine (cc)</label>
            <input type="number" value={engineCc} onChange={e => setEngineCc(e.target.value)} placeholder="e.g. 2755" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Mileage (km)</label>
            <input type="number" value={mileageKm} onChange={e => setMileageKm(e.target.value)} placeholder="e.g. 45000" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Color</label>
            <input type="text" value={color} onChange={e => setColor(e.target.value)} placeholder="e.g. White" className={inputClass} />
          </div>
        </div>
      </div>

      {/* Pricing & Status */}
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-navy">
          Pricing & Status
        </h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <label className={labelClass}>FOB Price (JPY)</label>
            <input type="number" value={priceFobJpy} onChange={e => setPriceFobJpy(e.target.value)} placeholder="e.g. 4800000" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>FOB Price (USD)</label>
            <input type="number" value={priceFobUsd} onChange={e => setPriceFobUsd(e.target.value)} placeholder="e.g. 32600" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Status</label>
            <select value={status} onChange={e => setStatus(e.target.value as VehicleStatus)} className={selectClass}>
              {statuses.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className={labelClass}>Location</label>
            <input type="text" value={location} onChange={e => setLocation(e.target.value)} placeholder="e.g. Yokohama" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Chassis No.</label>
            <input type="text" value={chassisNo} onChange={e => setChassisNo(e.target.value)} placeholder="e.g. JBA-AXK-001284" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Stock ID</label>
            <input type="text" value={stockId} onChange={e => setStockId(e.target.value)} placeholder="e.g. BIKS-016" className={inputClass} />
          </div>
          <div className="flex items-end">
            <label className="flex cursor-pointer items-center gap-3">
              <input
                type="checkbox"
                checked={featured}
                onChange={e => setFeatured(e.target.checked)}
                className="h-5 w-5 rounded border-gray-300 text-gold accent-gold focus:ring-gold"
              />
              <span className="text-sm font-semibold text-navy">{t('form.featured', 'Featured Vehicle')}</span>
            </label>
          </div>
        </div>
      </div>

      {/* Images */}
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-navy">
          Images
        </h3>

        {/* Main Image */}
        <div className="mb-6">
          <label className={labelClass}>Main Image</label>
          <div className="flex items-start gap-4">
            {mainImagePreview ? (
              <div className="relative h-32 w-48 overflow-hidden rounded-lg border border-gray-200">
                <img src={mainImagePreview} alt="Main" className="h-full w-full object-cover" />
                <button
                  type="button"
                  onClick={() => { setMainImageFile(null); setMainImagePreview(null); }}
                  className="absolute right-1 top-1 rounded-full bg-red-500 p-0.5 text-white hover:bg-red-600"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => mainImageRef.current?.click()}
                className="flex h-32 w-48 flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 text-gray-400 transition-colors hover:border-gold hover:text-gold"
              >
                <Upload className="h-6 w-6" />
                <span className="text-xs font-medium">Upload Image</span>
              </button>
            )}
            <input ref={mainImageRef} type="file" accept="image/*" onChange={handleMainImageChange} className="hidden" />
          </div>
        </div>

        {/* Gallery */}
        <div>
          <label className={labelClass}>Gallery Images</label>
          <div className="flex flex-wrap gap-3">
            {/* Existing gallery images */}
            {existingGallery.map((url, i) => (
              <div key={`existing-${i}`} className="relative h-24 w-32 overflow-hidden rounded-lg border border-gray-200">
                <img src={url} alt="" className="h-full w-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeExistingGalleryImage(i)}
                  className="absolute right-1 top-1 rounded-full bg-red-500 p-0.5 text-white hover:bg-red-600"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}

            {/* New gallery previews */}
            {galleryPreviews.map((url, i) => (
              <div key={`new-${i}`} className="relative h-24 w-32 overflow-hidden rounded-lg border border-gold/40">
                <img src={url} alt="" className="h-full w-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeGalleryFile(i)}
                  className="absolute right-1 top-1 rounded-full bg-red-500 p-0.5 text-white hover:bg-red-600"
                >
                  <X className="h-3 w-3" />
                </button>
                <span className="absolute bottom-1 left-1 rounded bg-gold/80 px-1.5 py-0.5 text-[9px] font-bold text-navy-dark">NEW</span>
              </div>
            ))}

            {/* Add button */}
            <button
              type="button"
              onClick={() => galleryRef.current?.click()}
              className="flex h-24 w-32 flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 text-gray-400 transition-colors hover:border-gold hover:text-gold"
            >
              <ImageIcon className="h-5 w-5" />
              <span className="text-[10px] font-medium">Add More</span>
            </button>
            <input ref={galleryRef} type="file" accept="image/*" multiple onChange={handleGalleryChange} className="hidden" />
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-navy">
          Description & Features
        </h3>
        <div className="space-y-4">
          <div>
            <label className={labelClass}>Description</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={4}
              placeholder="Vehicle description..."
              className={inputClass + ' resize-none'}
            />
          </div>

          {/* Features */}
          <div>
            <label className={labelClass}>Features</label>
            <div className="mb-2 flex gap-2">
              <input
                type="text"
                value={featureInput}
                onChange={e => setFeatureInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addFeature(); } }}
                placeholder="e.g. 4WD, Leather Seats"
                className={inputClass}
              />
              <button
                type="button"
                onClick={addFeature}
                className="flex items-center gap-1 rounded-lg bg-navy px-4 py-2.5 text-xs font-bold text-white transition-colors hover:bg-navy-dark"
              >
                <Plus className="h-3 w-3" />
                Add
              </button>
            </div>
            {features.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {features.map((f, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1.5 rounded-full bg-navy/5 px-3 py-1.5 text-xs font-medium text-navy"
                  >
                    {f}
                    <button
                      type="button"
                      onClick={() => removeFeature(i)}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-gray-200 bg-white px-6 py-2.5 text-sm font-semibold text-gray-600 transition-all hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading || !make || !model || !year}
          className="rounded-lg bg-gold px-8 py-2.5 text-sm font-bold text-navy-dark shadow-sm transition-all hover:-translate-y-0.5 hover:bg-gold/90 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
        >
          {loading ? t('form.updating', 'Saving...') : t('form.save', 'Save Vehicle')}
        </button>
      </div>
    </form>
  );
}
