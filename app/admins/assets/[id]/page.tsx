// 'use client';

// import { useEffect, useState } from 'react';
// import { useRouter, useParams } from 'next/navigation';
// import { API_BASE_URL } from '../../../config';
// import { toast } from 'react-hot-toast';

// export default function EditAssetPage() {
//   const router = useRouter();
//   const params = useParams();
//   const assetId = params?.id;

//   // Master Data
//   const [products, setProducts] = useState<any[]>([]);
//   const [brands, setBrands] = useState<any[]>([]);
//   const [models, setModels] = useState<any[]>([]);
//   const [types, setTypes] = useState<any[]>([]);
//   const [statuses, setStatuses] = useState<any[]>([]);
//   const [locations, setLocations] = useState<any[]>([]);
//   const [categories, setCategories] = useState<any[]>([]);
//   const [units, setUnits] = useState<any[]>([]);
//   const [employees, setEmployees] = useState<any[]>([]);
//   const [departments, setDepartments] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);

//   interface AssetForm {
//     serial_number: string;
//     product_id: string;
//     brand_id: string;
//     model_id: string;
//     asset_type_id: string;
//     status_id: string;
//     location: string;
//     category_id: string;
//     unit_id: string;
//     purchase_date: string;
//     warranty_expiry: string;
//     description: string;
//     supplier: string;
//     color: string;
//     invoice_ref: string;
//     assigned_to: string;
//     assigned_department: string;
//     assignment_start_date: string;
//   }

//   const [form, setForm] = useState<AssetForm>({
//     serial_number: '',
//     product_id: '',
//     brand_id: '',
//     model_id: '',
//     asset_type_id: '',
//     status_id: '',
//     location: '',
//     category_id: '',
//     unit_id: '',
//     purchase_date: '',
//     warranty_expiry: '',
//     description: '',
//     supplier: '',
//     color: '',
//     invoice_ref: '',
//     assigned_to: '',
//     assigned_department: '',
//     assignment_start_date: ''
//   });

//   const [error, setError] = useState<string | null>(null);
//   const [saving, setSaving] = useState(false);

//   // Fetch all masters and asset data
//   useEffect(() => {
//     async function fetchAll() {
//       setLoading(true);
//       try {
//         const [
//           products,
//           brands,
//           models,
//           types,
//           statuses,
//           locations,
//           categories,
//           units,
//           employees,
//           departments,
//           asset
//         ] = await Promise.all([
//           fetch(`${API_BASE_URL}/api/inventory/products`).then(r => r.json()),
//           fetch(`${API_BASE_URL}/api/inventory/brands`).then(r => r.json()),
//           fetch(`${API_BASE_URL}/api/inventory/models`).then(r => r.json()),
//           fetch(`${API_BASE_URL}/api/inventory/types`).then(r => r.json()),
//           fetch(`${API_BASE_URL}/api/inventory/statuses`).then(r => r.json()),
//           fetch(`${API_BASE_URL}/api/inventory/locations`).then(r => r.json()),
//           fetch(`${API_BASE_URL}/api/inventory/categories`).then(r => r.json()),
//           fetch(`${API_BASE_URL}/api/inventory/units`).then(r => r.json()),
//           fetch(`${API_BASE_URL}/api/admin/employees`).then(r => r.json()).catch(()=>[]),
//           fetch(`${API_BASE_URL}/api/admin/departments`).then(r => r.json()).catch(()=>[]),
//           fetch(`${API_BASE_URL}/api/inventory/assets/${assetId}`).then(r => r.json())
//         ]);
//         setProducts(products);
//         setBrands(brands);
//         setModels(models);
//         setTypes(types);
//         setStatuses(statuses);
//         setLocations(locations);
//         setCategories(categories);
//         setUnits(units);
//         setEmployees(employees);
//         setDepartments(departments);

//         // Set form values from asset data
//         setForm({
//           serial_number: asset.serial_number || '',
//           product_id: asset.product_id?.toString() || '',
//           brand_id: asset.brand_id?.toString() || '',
//           model_id: asset.model_id?.toString() || '',
//           asset_type_id: asset.asset_type_id?.toString() || '',
//           status_id: asset.status_id?.toString() || '',
//           location: asset.location?.toString() || '',
//           category_id: asset.category_id?.toString() || '',
//           unit_id: asset.unit_id?.toString() || '',
//           purchase_date: asset.purchase_date ? asset.purchase_date.substring(0, 10) : '',
//           warranty_expiry: asset.warranty_expiry ? asset.warranty_expiry.substring(0, 10) : '',
//           description: asset.description || '',
//           supplier: asset.supplier || '',
//           color: asset.color || '',
//           invoice_ref: asset.invoice_ref || '',
//           assigned_to: asset.assigned_to?.toString() || '',
//           assigned_department: asset.assigned_department?.toString() || '',
//           assignment_start_date: asset.assignment_start_date ? asset.assignment_start_date.substring(0, 10) : ''
//         });

//       } catch (e) {
//         setError('Failed to load data.');
//       } finally {
//         setLoading(false);
//       }
//     }
//     if (assetId) fetchAll();
//   }, [assetId]);

//   // Filtered Models
//   const filteredModels = form.brand_id
//     ? models.filter((m: any) => String(m.brand_id) === String(form.brand_id))
//     : [];

//   // Handle change
//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
//     const { name, value } = e.target;
//     setForm(prev => ({
//       ...prev,
//       [name]: value,
//       ...(name === 'brand_id' ? { model_id: '' } : {})
//     }));
//   };

//   // Handle submit
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError(null);

//     if (!form.serial_number || !form.product_id || !form.brand_id || !form.model_id) {
//       setError('Please fill all required fields.');
//       return;
//     }

//     setSaving(true);
//     try {
//       const payload = Object.fromEntries(
//         Object.entries(form).map(([k, v]) => [k, v === '' ? null : v])
//       );

//       const res = await fetch(`${API_BASE_URL}/api/inventory/assets/${assetId}`, {
//         method: 'PUT',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(payload)
//       });
//       if (!res.ok) {
//         const err = await res.json().catch(() => ({}));
//         throw new Error(err?.error || 'Failed to update asset');
//       }
//       toast.success('Asset updated successfully!');
//       router.push('/admins/assets');
//     } catch (e: any) {
//       setError(e.message || 'Failed to update asset');
//       toast.error(e.message || 'Failed to update asset');
//     } finally {
//       setSaving(false);
//     }
//   };

//   if (loading) {
//     return <div className="p-8 text-center text-lg">Loading...</div>;
//   }

//   return (
//     <div className="max-w-2xl mx-auto py-10">
//       <h1 className="text-2xl font-bold mb-6">Edit Asset</h1>
//       <form className="space-y-4" onSubmit={handleSubmit}>
//         {/* Serial Number */}
//         <div>
//           <label className="block font-semibold">Serial Number *</label>
//           <input
//             type="text"
//             name="serial_number"
//             className="input input-bordered w-full"
//             value={form.serial_number}
//             onChange={handleChange}
//             required
//           />
//         </div>
//         {/* Product */}
//         <div>
//           <label className="block font-semibold">Product *</label>
//           <select
//             name="product_id"
//             className="select select-bordered w-full"
//             value={form.product_id}
//             onChange={handleChange}
//             required
//           >
//             <option value="">Select Product</option>
//             {products.map((p: any) => (
//               <option key={p.id} value={p.id}>{p.name}</option>
//             ))}
//           </select>
//         </div>
//         {/* Brand */}
//         <div>
//           <label className="block font-semibold">Brand *</label>
//           <select
//             name="brand_id"
//             className="select select-bordered w-full"
//             value={form.brand_id}
//             onChange={handleChange}
//             required
//           >
//             <option value="">Select Brand</option>
//             {brands.map((b: any) => (
//               <option key={b.id} value={b.id}>{b.name}</option>
//             ))}
//           </select>
//         </div>
//         {/* Model (Filtered) */}
//         <div>
//           <label className="block font-semibold">Model *</label>
//           <select
//             name="model_id"
//             className="select select-bordered w-full"
//             value={form.model_id}
//             onChange={handleChange}
//             required
//             disabled={!form.brand_id}
//           >
//             <option value="">Select Model</option>
//             {filteredModels.map((m: any) => (
//               <option key={m.id} value={m.id}>{m.model_name || m.name}</option>
//             ))}
//           </select>
//           {!form.brand_id && (
//             <div className="text-xs text-gray-500 mt-1">Select a brand first</div>
//           )}
//         </div>
//         {/* Asset Type */}
//         <div>
//           <label className="block font-semibold">Type</label>
//           <select
//             name="asset_type_id"
//             className="select select-bordered w-full"
//             value={form.asset_type_id}
//             onChange={handleChange}
//           >
//             <option value="">Select Type</option>
//             {types.map((t: any) => (
//               <option key={t.id} value={t.id}>{t.name}</option>
//             ))}
//           </select>
//         </div>
//         {/* Status */}
//         <div>
//           <label className="block font-semibold">Status</label>
//           <select
//             name="status_id"
//             className="select select-bordered w-full"
//             value={form.status_id}
//             onChange={handleChange}
//           >
//             <option value="">Select Status</option>
//             {statuses.map((s: any) => (
//               <option key={s.id} value={s.id}>{s.name}</option>
//             ))}
//           </select>
//         </div>
//         {/* Location */}
//         <div>
//           <label className="block font-semibold">Location</label>
//           <select
//             name="location"
//             className="select select-bordered w-full"
//             value={form.location}
//             onChange={handleChange}
//           >
//             <option value="">Select Location</option>
//             {locations.map((l: any) => (
//               <option key={l.id} value={l.id}>{l.name}</option>
//             ))}
//           </select>
//         </div>
//         {/* Category */}
//         <div>
//           <label className="block font-semibold">Category</label>
//           <select
//             name="category_id"
//             className="select select-bordered w-full"
//             value={form.category_id}
//             onChange={handleChange}
//           >
//             <option value="">Select Category</option>
//             {categories.map((c: any) => (
//               <option key={c.id} value={c.id}>{c.name}</option>
//             ))}
//           </select>
//         </div>
//         {/* Unit */}
//         <div>
//           <label className="block font-semibold">Unit</label>
//           <select
//             name="unit_id"
//             className="select select-bordered w-full"
//             value={form.unit_id}
//             onChange={handleChange}
//           >
//             <option value="">Select Unit</option>
//             {units.map((u: any) => (
//               <option key={u.id} value={u.id}>{u.name}</option>
//             ))}
//           </select>
//         </div>
//         {/* Description */}
//         <div>
//           <label className="block font-semibold">Description</label>
//           <textarea
//             name="description"
//             className="textarea textarea-bordered w-full"
//             value={form.description}
//             onChange={handleChange}
//           />
//         </div>
//         {/* Supplier */}
//         <div>
//           <label className="block font-semibold">Supplier</label>
//           <input
//             type="text"
//             name="supplier"
//             className="input input-bordered w-full"
//             value={form.supplier}
//             onChange={handleChange}
//           />
//         </div>
//         {/* Color */}
//         <div>
//           <label className="block font-semibold">Color</label>
//           <input
//             type="text"
//             name="color"
//             className="input input-bordered w-full"
//             value={form.color}
//             onChange={handleChange}
//           />
//         </div>
//         {/* Invoice Ref */}
//         <div>
//           <label className="block font-semibold">Invoice Ref</label>
//           <input
//             type="text"
//             name="invoice_ref"
//             className="input input-bordered w-full"
//             value={form.invoice_ref}
//             onChange={handleChange}
//           />
//         </div>
//         {/* Purchase Date */}
//         <div>
//           <label className="block font-semibold">Purchase Date</label>
//           <input
//             type="date"
//             name="purchase_date"
//             className="input input-bordered w-full"
//             value={form.purchase_date}
//             onChange={handleChange}
//           />
//         </div>
//         {/* Warranty Expiry */}
//         <div>
//           <label className="block font-semibold">Warranty Expiry</label>
//           <input
//             type="date"
//             name="warranty_expiry"
//             className="input input-bordered w-full"
//             value={form.warranty_expiry}
//             onChange={handleChange}
//           />
//         </div>
//         {/* Assignment */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
//           {/* Assigned To */}
//           <div>
//             <label className="block font-semibold">Assigned To</label>
//             <select
//               name="assigned_to"
//               className="select select-bordered w-full"
//               value={form.assigned_to}
//               onChange={handleChange}
//             >
//               <option value="">Select Employee</option>
//               {employees.map((emp: any) => (
//                 <option key={emp.id} value={emp.id}>{emp.name}</option>
//               ))}
//             </select>
//           </div>
//           {/* Assigned Department */}
//           <div>
//             <label className="block font-semibold">Assigned Department</label>
//             <select
//               name="assigned_department"
//               className="select select-bordered w-full"
//               value={form.assigned_department}
//               onChange={handleChange}
//             >
//               <option value="">Select Department</option>
//               {departments.map((d: any) => (
//                 <option key={d.id} value={d.id}>{d.department_name}</option>
//               ))}
//             </select>
//           </div>
//           {/* Assignment Start Date */}
//           <div>
//             <label className="block font-semibold">Assignment Start Date</label>
//             <input
//               type="date"
//               name="assignment_start_date"
//               className="input input-bordered w-full"
//               value={form.assignment_start_date}
//               onChange={handleChange}
//             />
//           </div>
//         </div>

//         {error && (
//           <div className="alert alert-error">
//             <div>{error}</div>
//           </div>
//         )}

//         <div className="flex gap-2 mt-4">
//           <button
//             type="submit"
//             className="btn btn-primary"
//             disabled={saving}
//           >
//             {saving ? 'Saving...' : 'Update Asset'}
//           </button>
//           <button
//             type="button"
//             className="btn btn-secondary"
//             onClick={() => router.push('/admins/assets')}
//             disabled={saving}
//           >
//             Cancel
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// }



'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { API_BASE_URL } from '../../../config';
import { toast } from 'react-hot-toast';

export default function EditAssetPage() {
  const router = useRouter();
  const params = useParams();
  const assetId = params.id as string;

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
  const [assetLoading, setAssetLoading] = useState(true);

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
    vpn_id: string;
    deep_freeze_id: string;
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
    assignment_start_date: '',
    vpn_id: '',
    deep_freeze_id: ''
  });

  // Store product details for auto-population
  const [productDetails, setProductDetails] = useState<{[key: string]: any}>({});

  // Error
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Fetch masters and asset data
  useEffect(() => {
    async function fetchAll() {
      setLoading(true);
      setAssetLoading(true);
      try {
        // Fetch all data in parallel
        const [
          products,
          brands,
          models,
          types,
          statuses,
          locations,
          categories,
          units,
          assetData
        ] = await Promise.all([
          fetch(`${API_BASE_URL}/api/inventory/products`).then(r => r.json()),
          fetch(`${API_BASE_URL}/api/inventory/brands`).then(r => r.json()),
          fetch(`${API_BASE_URL}/api/inventory/models`).then(r => r.json()),
          fetch(`${API_BASE_URL}/api/inventory/types`).then(r => r.json()),
          fetch(`${API_BASE_URL}/api/inventory/statuses`).then(r => r.json()),
          fetch(`${API_BASE_URL}/api/inventory/locations`).then(r => r.json()),
          fetch(`${API_BASE_URL}/api/inventory/categories`).then(r => r.json()),
          fetch(`${API_BASE_URL}/api/inventory/units`).then(r => r.json()),
          fetch(`${API_BASE_URL}/api/inventory/assets/${assetId}`).then(r => {
            if (!r.ok) throw new Error('Failed to fetch asset');
            return r.json();
          })
        ]);

        // Fetch employees and departments separately with error handling
        let employees = [];
        let departments = [];
        
        try {
          employees = await fetch(`${API_BASE_URL}/api/admin/employees`).then(r => r.json());
        } catch (e) {
          console.warn('Failed to fetch employees:', e);
          employees = [];
        }
        
        try {
          departments = await fetch(`${API_BASE_URL}/api/admin/departments`).then(r => r.json());
        } catch (e) {
          console.warn('Failed to fetch departments:', e);
          departments = [];
        }

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

        // Create product details map for auto-population
        const productMap: {[key: string]: any} = {};
        products.forEach((product: any) => {
          productMap[product.id] = {
            category_id: product.category_id,
            unit_id: product.unit_id,
            brand_id: product.brand_id
          };
        });
        setProductDetails(productMap);

        // Populate form with asset data
        if (assetData) {
          console.log('Asset data loaded:', assetData);
          
          const formData = {
            serial_number: assetData.serial_number || '',
            product_id: assetData.product_id ? String(assetData.product_id) : '',
            brand_id: assetData.brand_id ? String(assetData.brand_id) : '',
            model_id: assetData.model_id ? String(assetData.model_id) : '',
            asset_type_id: assetData.asset_type_id ? String(assetData.asset_type_id) : '',
            status_id: assetData.status_id ? String(assetData.status_id) : '',
            location: assetData.location ? String(assetData.location) : '',
            category_id: assetData.category_id ? String(assetData.category_id) : '',
            unit_id: assetData.unit_id ? String(assetData.unit_id) : '',
            purchase_date: assetData.purchase_date ? assetData.purchase_date.split('T')[0] : '',
            warranty_expiry: assetData.warranty_expiry ? assetData.warranty_expiry.split('T')[0] : '',
            description: assetData.description || '',
            supplier: assetData.supplier || '',
            color: assetData.color || '',
            invoice_ref: assetData.invoice_ref || '',
            assigned_to: assetData.assigned_to ? String(assetData.assigned_to) : '',
            assigned_department: assetData.assigned_department ? String(assetData.assigned_department) : '',
            assignment_start_date: assetData.assignment_start_date ? assetData.assignment_start_date.split('T')[0] : '',
            vpn_id: assetData.vpn_id || '',
            deep_freeze_id: assetData.deep_freeze_id || ''
          };
          
          console.log('Form data set:', formData);
          setForm(formData);
        }
      } catch (e) {
        console.error('Error loading data:', e);
        setError('Failed to load data.');
        toast.error('Failed to load asset data');
      } finally {
        setLoading(false);
        setAssetLoading(false);
      }
    }
    
    if (assetId) {
      fetchAll();
    }
  }, [assetId]);

  // Handle product change to auto-populate category and unit
  const handleProductChange = (productId: string) => {
    const product = productDetails[productId];
    console.log('Product changed:', productId, product);
    
    if (product) {
      setForm(prev => ({
        ...prev,
        product_id: productId,
        category_id: product.category_id ? String(product.category_id) : '',
        unit_id: product.unit_id ? String(product.unit_id) : '',
        brand_id: product.brand_id ? String(product.brand_id) : prev.brand_id
      }));
    } else {
      setForm(prev => ({
        ...prev,
        product_id: productId,
        category_id: '',
        unit_id: ''
      }));
    }
  };

  // Filtered Models
  const filteredModels = form.brand_id
    ? models.filter((m: any) => String(m.brand_id) === String(form.brand_id))
    : [];

  // Handle change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    console.log('Field changed:', name, value);
    
    if (name === 'product_id') {
      handleProductChange(value);
    } else {
      setForm(prev => ({
        ...prev,
        [name]: value,
        ...(name === 'brand_id' ? { model_id: '' } : {})
      }));
    }
  };

  // Handle submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
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

      console.log('Submitting payload:', payload);

      const res = await fetch(`${API_BASE_URL}/api/inventory/assets/${assetId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error || 'Failed to update asset');
      }
      
      toast.success('Asset updated successfully!');
      router.push('/admins/assets');
    } catch (e: any) {
      console.error('Error updating asset:', e);
      setError(e.message || 'Failed to update asset');
      toast.error(e.message || 'Failed to update asset');
    } finally {
      setSaving(false);
    }
  };

  if (loading || assetLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Edit Asset</h1>
              <p className="mt-2 text-sm text-gray-600">
                Update the details below to modify this asset in the inventory.
              </p>
            </div>
            <button
              type="button"
              onClick={() => router.push('/admins/assets')}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              ← Back to Assets
            </button>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <form onSubmit={handleSubmit} className="p-6 space-y-8">
            {/* Basic Information Section */}
            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                Basic Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Serial Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Serial Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="serial_number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    value={form.serial_number}
                    onChange={handleChange}
                    required
                    placeholder="Enter serial number"
                  />
                </div>

                {/* Product */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="product_id"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Brand <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="brand_id"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
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

                {/* Model */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Model <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="model_id"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-50 disabled:text-gray-500"
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
                    <p className="mt-1 text-xs text-gray-500">Please select a brand first</p>
                  )}
                </div>
              </div>
            </section>

            {/* Security & Software IDs Section */}
            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                Security & Software IDs
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* VPN ID */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">VPN ID</label>
                  <input
                    type="text"
                    name="vpn_id"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    value={form.vpn_id}
                    onChange={handleChange}
                    placeholder="Enter VPN ID"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Enter the VPN account ID associated with this asset
                  </p>
                </div>

                {/* Deep Freeze ID */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Deep Freeze ID</label>
                  <input
                    type="text"
                    name="deep_freeze_id"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    value={form.deep_freeze_id}
                    onChange={handleChange}
                    placeholder="Enter Deep Freeze ID"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Enter the Deep Freeze account ID associated with this asset
                  </p>
                </div>
              </div>
            </section>

            {/* Classification Section */}
            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                Classification
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Asset Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                  <select
                    name="asset_type_id"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    name="status_id"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  <select
                    name="location"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    name="category_id"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    value={form.category_id}
                    onChange={handleChange}
                  >
                    <option value="">Select Category</option>
                    {categories.map((c: any) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                  <p className="mt-1 text-xs text-gray-500">
                    {form.category_id ? `Selected: ${categories.find(c => String(c.id) === form.category_id)?.name}` : 'Auto-populated when product is selected'}
                  </p>
                </div>

                {/* Unit */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Unit</label>
                  <select
                    name="unit_id"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    value={form.unit_id}
                    onChange={handleChange}
                  >
                    <option value="">Select Unit</option>
                    {units.map((u: any) => (
                      <option key={u.id} value={u.id}>{u.name}</option>
                    ))}
                  </select>
                  <p className="mt-1 text-xs text-gray-500">
                    {form.unit_id ? `Selected: ${units.find(u => String(u.id) === form.unit_id)?.name}` : 'Auto-populated when product is selected'}
                  </p>
                </div>
              </div>
            </section>

            {/* Purchase Details Section */}
            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                Purchase Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Supplier */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Supplier</label>
                  <input
                    type="text"
                    name="supplier"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    value={form.supplier}
                    onChange={handleChange}
                    placeholder="Enter supplier name"
                  />
                </div>

                {/* Invoice Reference */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Invoice Reference</label>
                  <input
                    type="text"
                    name="invoice_ref"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    value={form.invoice_ref}
                    onChange={handleChange}
                    placeholder="Enter invoice reference"
                  />
                </div>

                {/* Color */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
                  <input
                    type="text"
                    name="color"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    value={form.color}
                    onChange={handleChange}
                    placeholder="Enter color"
                  />
                </div>

                {/* Purchase Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Purchase Date</label>
                  <input
                    type="date"
                    name="purchase_date"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    value={form.purchase_date}
                    onChange={handleChange}
                  />
                </div>

                {/* Warranty Expiry */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Warranty Expiry</label>
                  <input
                    type="date"
                    name="warranty_expiry"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    value={form.warranty_expiry}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </section>

            {/* Assignment Section */}
            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                Assignment Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Assigned To */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Assigned To</label>
                  <select
                    name="assigned_to"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">Assigned Department</label>
                  <select
                    name="assigned_department"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">Assignment Start Date</label>
                  <input
                    type="date"
                    name="assignment_start_date"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    value={form.assignment_start_date}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </section>

            {/* Description */}
            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                Additional Information
              </h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  name="description"
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Enter any additional details about the asset..."
                />
              </div>
            </section>

            {/* Error Message */}
            {error && (
              <div className="rounded-md bg-red-50 p-4 border border-red-200">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">Error</h3>
                    <div className="mt-1 text-sm text-red-700">{error}</div>
                  </div>
                </div>
              </div>
            )}

{/* Form Actions */}
<div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
  <button
    type="button"
    onClick={() => router.push('/admins/assets')}
    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
    disabled={saving}
  >
    Cancel
  </button>
  <button
    type="submit"
    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
    disabled={saving}
  >
    {saving ? (
      <span className="flex items-center">
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Updating Asset...
      </span>
    ) : (
      'Update Asset'
    )}
  </button>
</div>
          </form>
        </div>
      </div>
    </div>
  );
}
