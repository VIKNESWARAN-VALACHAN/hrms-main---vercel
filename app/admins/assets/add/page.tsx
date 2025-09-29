'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { API_BASE_URL } from '../../../config';
import { toast } from 'react-hot-toast';

export default function AddAssetPage() {
  const router = useRouter();

  // Master Data
  const [products, setProducts] = useState<any[]>([]);
  const [brands, setBrands] = useState<any[]>([]);
  const [models, setModels] = useState<any[]>([]);
  const [types, setTypes] = useState<any[]>([]);
  const [statuses, setStatuses] = useState<any[]>([]);
  const [locations, setLocations] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [units, setUnits] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

interface AssetForm {
  serial_number: string;
  product_id: string;
  brand_id: string;
  model_id: string;
  asset_type_id: string;
  status_id: string;
  location: string;
  category_id: string;
  unit_id: string;
  purchase_date: string;
  warranty_expiry: string;
  description: string;
  supplier: string;
  color: string;
  invoice_ref: string;
  assigned_to: string;
  assigned_department: string;
  assignment_start_date: string;
}

  // Form
  const [form, setForm] = useState<AssetForm>({
    serial_number: '',
    product_id: '',
    brand_id: '',
    model_id: '',
    asset_type_id: '',
    status_id: '',
    location: '',
    category_id: '',
    unit_id: '',
    purchase_date: '',
    warranty_expiry: '',
    description: '',
    supplier: '',
    color: '',
    invoice_ref: '',
    assigned_to: '',
    assigned_department: '',
    assignment_start_date: ''
  });

  // Error
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Fetch masters
  useEffect(() => {
    async function fetchAll() {
      setLoading(true);
      try {
        // You may need to adjust API endpoints as per your backend
        const [
          products,
          brands,
          models,
          types,
          statuses,
          locations,
          categories,
          units,
          employees,
          departments
        ] = await Promise.all([
          fetch(`${API_BASE_URL}/api/inventory/products`).then(r => r.json()),
          fetch(`${API_BASE_URL}/api/inventory/brands`).then(r => r.json()),
          fetch(`${API_BASE_URL}/api/inventory/models`).then(r => r.json()),
          fetch(`${API_BASE_URL}/api/inventory/types`).then(r => r.json()),
          fetch(`${API_BASE_URL}/api/inventory/statuses`).then(r => r.json()),
          fetch(`${API_BASE_URL}/api/inventory/locations`).then(r => r.json()),
          fetch(`${API_BASE_URL}/api/inventory/categories`).then(r => r.json()),
          fetch(`${API_BASE_URL}/api/inventory/units`).then(r => r.json()),
          fetch(`${API_BASE_URL}/api/admin/employees`).then(r => r.json()).catch(()=>[]),
          fetch(`${API_BASE_URL}/api/admin/departments`).then(r => r.json()).catch(()=>[]),
        ]);
        setProducts(products);
        setBrands(brands);
        setModels(models);
        setTypes(types);
        setStatuses(statuses);
        setLocations(locations);
        setCategories(categories);
        setUnits(units);
        setEmployees(employees);
        setDepartments(departments);
      } catch (e) {
        setError('Failed to load master data.');
      } finally {
        setLoading(false);
      }
    }
    fetchAll();
  }, []);

  // Filtered Models
  const filteredModels = form.brand_id
    ? models.filter((m: any) => String(m.brand_id) === String(form.brand_id))
    : [];

  // Handle change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value,
      ...(name === 'brand_id' ? { model_id: '' } : {})
    }));
  };

  // Handle submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // You may want to add more validation as needed
    if (!form.serial_number || !form.product_id || !form.brand_id || !form.model_id) {
      setError('Please fill all required fields.');
      return;
    }

    setSaving(true);
    try {
      // Prepare payload, convert empty strings to null for optional fields
      const payload = Object.fromEntries(
        Object.entries(form).map(([k, v]) => [k, v === '' ? null : v])
      );

      const res = await fetch(`${API_BASE_URL}/api/inventory/assets`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error || 'Failed to add asset');
      }
      toast.success('Asset added successfully!');
      router.push('/admins/assets');
    } catch (e: any) {
      setError(e.message || 'Failed to add asset');
      toast.error(e.message || 'Failed to add asset');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-lg">Loading...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Add Asset</h1>
      <form className="space-y-4" onSubmit={handleSubmit}>
        {/* Serial Number */}
        <div>
          <label className="block font-semibold">Serial Number *</label>
          <input
            type="text"
            name="serial_number"
            className="input input-bordered w-full"
            value={form.serial_number}
            onChange={handleChange}
            required
          />
        </div>
        {/* Product */}
        <div>
          <label className="block font-semibold">Product *</label>
          <select
            name="product_id"
            className="select select-bordered w-full"
            value={form.product_id}
            onChange={handleChange}
            required
          >
            <option value="">Select Product</option>
            {products.map((p: any) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>
        {/* Brand */}
        <div>
          <label className="block font-semibold">Brand *</label>
          <select
            name="brand_id"
            className="select select-bordered w-full"
            value={form.brand_id}
            onChange={handleChange}
            required
          >
            <option value="">Select Brand</option>
            {brands.map((b: any) => (
              <option key={b.id} value={b.id}>{b.name}</option>
            ))}
          </select>
        </div>
        {/* Model (Filtered) */}
        <div>
          <label className="block font-semibold">Model *</label>
          <select
            name="model_id"
            className="select select-bordered w-full"
            value={form.model_id}
            onChange={handleChange}
            required
            disabled={!form.brand_id}
          >
            <option value="">Select Model</option>
            {filteredModels.map((m: any) => (
              <option key={m.id} value={m.id}>{m.model_name || m.name}</option>
            ))}
          </select>
          {!form.brand_id && (
            <div className="text-xs text-gray-500 mt-1">Select a brand first</div>
          )}
        </div>
        {/* Asset Type */}
        <div>
          <label className="block font-semibold">Type</label>
          <select
            name="asset_type_id"
            className="select select-bordered w-full"
            value={form.asset_type_id}
            onChange={handleChange}
          >
            <option value="">Select Type</option>
            {types.map((t: any) => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>
        </div>
        {/* Status */}
        <div>
          <label className="block font-semibold">Status</label>
          <select
            name="status_id"
            className="select select-bordered w-full"
            value={form.status_id}
            onChange={handleChange}
          >
            <option value="">Select Status</option>
            {statuses.map((s: any) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>
        {/* Location */}
        <div>
          <label className="block font-semibold">Location</label>
          <select
            name="location"
            className="select select-bordered w-full"
            value={form.location}
            onChange={handleChange}
          >
            <option value="">Select Location</option>
            {locations.map((l: any) => (
              <option key={l.id} value={l.id}>{l.name}</option>
            ))}
          </select>
        </div>
        {/* Category */}
        <div>
          <label className="block font-semibold">Category</label>
          <select
            name="category_id"
            className="select select-bordered w-full"
            value={form.category_id}
            onChange={handleChange}
          >
            <option value="">Select Category</option>
            {categories.map((c: any) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
        {/* Unit */}
        <div>
          <label className="block font-semibold">Unit</label>
          <select
            name="unit_id"
            className="select select-bordered w-full"
            value={form.unit_id}
            onChange={handleChange}
          >
            <option value="">Select Unit</option>
            {units.map((u: any) => (
              <option key={u.id} value={u.id}>{u.name}</option>
            ))}
          </select>
        </div>
        {/* Description */}
        <div>
          <label className="block font-semibold">Description</label>
          <textarea
            name="description"
            className="textarea textarea-bordered w-full"
            value={form.description}
            onChange={handleChange}
          />
        </div>
        {/* Supplier */}
        <div>
          <label className="block font-semibold">Supplier</label>
          <input
            type="text"
            name="supplier"
            className="input input-bordered w-full"
            value={form.supplier}
            onChange={handleChange}
          />
        </div>
        {/* Color */}
        <div>
          <label className="block font-semibold">Color</label>
          <input
            type="text"
            name="color"
            className="input input-bordered w-full"
            value={form.color}
            onChange={handleChange}
          />
        </div>
        {/* Invoice Ref */}
        <div>
          <label className="block font-semibold">Invoice Ref</label>
          <input
            type="text"
            name="invoice_ref"
            className="input input-bordered w-full"
            value={form.invoice_ref}
            onChange={handleChange}
          />
        </div>
        {/* Purchase Date */}
        <div>
          <label className="block font-semibold">Purchase Date</label>
          <input
            type="date"
            name="purchase_date"
            className="input input-bordered w-full"
            value={form.purchase_date}
            onChange={handleChange}
          />
        </div>
        {/* Warranty Expiry */}
        <div>
          <label className="block font-semibold">Warranty Expiry</label>
          <input
            type="date"
            name="warranty_expiry"
            className="input input-bordered w-full"
            value={form.warranty_expiry}
            onChange={handleChange}
          />
        </div>
        {/* Assignment */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          {/* Assigned To */}
          <div>
            <label className="block font-semibold">Assigned To</label>
            <select
              name="assigned_to"
              className="select select-bordered w-full"
              value={form.assigned_to}
              onChange={handleChange}
            >
              <option value="">Select Employee</option>
              {employees.map((emp: any) => (
                <option key={emp.id} value={emp.id}>{emp.name}</option>
              ))}
            </select>
          </div>
          {/* Assigned Department */}
          <div>
            <label className="block font-semibold">Assigned Department</label>
            <select
              name="assigned_department"
              className="select select-bordered w-full"
              value={form.assigned_department}
              onChange={handleChange}
            >
              <option value="">Select Department</option>
              {departments.map((d: any) => (
                <option key={d.id} value={d.id}>{d.department_name}</option>
              ))}
            </select>
          </div>
          {/* Assignment Start Date */}
          <div>
            <label className="block font-semibold">Assignment Start Date</label>
            <input
              type="date"
              name="assignment_start_date"
              className="input input-bordered w-full"
              value={form.assignment_start_date}
              onChange={handleChange}
            />
          </div>
        </div>

        {error && (
          <div className="alert alert-error">
            <div>{error}</div>
          </div>
        )}

        <div className="flex gap-2 mt-4">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Add Asset'}
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => router.push('/admins/assets')}
            disabled={saving}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
