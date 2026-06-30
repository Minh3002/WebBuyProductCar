import React, { useEffect, useMemo, useState } from 'react';
import { Edit, ImagePlus, Plus, Search, Star, Trash2, X } from 'lucide-react';
import axiosClient from '../../api/axiosClient';
import { CATEGORIES } from '../../data/mockData';
import { resolveMediaUrl } from '../../utils/media';

const emptyProduct = {
  title: '',
  oem_code: '',
  brand: '',
  price: '',
  old_price: '',
  stock_quantity: '',
  category: '',
  description: '',
  origin: '',
  warranty: '',
  condition: '',
  specifications: [{ label: '', value: '' }],
  images: [],
};

const pageSize = 12;

export default function ProductManager({ onProductsChanged }) {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState(emptyProduct);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const data = await axiosClient.get('/products');
      setProducts(Array.isArray(data) ? data : data?.data || []);
    } catch (error) {
      console.error('Fetch products error:', error);
      alert('Không thể tải danh sách sản phẩm.');
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase();
    if (!keyword) return products;

    return products.filter((product) => {
      return [product.title, product.oem_code, product.brand, product.category]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(keyword));
    });
  }, [products, searchTerm]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / pageSize));
  const visibleProducts = filteredProducts.slice((page - 1) * pageSize, page * pageSize);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const openCreateModal = () => {
    setEditingProduct(null);
    setFormData(emptyProduct);
    setIsModalOpen(true);
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setFormData({
      title: product.title || '',
      oem_code: product.oem_code || '',
      brand: product.brand || '',
      price: product.price || '',
      old_price: product.old_price || '',
      stock_quantity: product.stock_quantity || '',
      category: product.category || '',
      description: product.description || '',
      origin: product.origin || '',
      warranty: product.warranty || '',
      condition: product.condition || '',
      specifications:
        product.specifications?.length > 0
          ? product.specifications
          : [{ label: '', value: '' }],
      images: product.images?.length > 0 ? product.images : product.image_url ? [product.image_url] : [],
    });
    setIsModalOpen(true);
  };

  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const updateSpec = (index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      specifications: prev.specifications.map((spec, i) =>
        i === index ? { ...spec, [field]: value } : spec,
      ),
    }));
  };

  const addSpec = () => {
    setFormData((prev) => ({
      ...prev,
      specifications: [...prev.specifications, { label: '', value: '' }],
    }));
  };

  const removeSpec = (index) => {
    setFormData((prev) => ({
      ...prev,
      specifications: prev.specifications.filter((_, i) => i !== index),
    }));
  };

  const uploadImages = async (files) => {
    if (!files?.length) return;

    const payload = new FormData();
    Array.from(files).forEach((file) => payload.append('images', file));

    try {
      const result = await axiosClient.post('/products/upload-images', payload);
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...(result.urls || [])],
      }));
    } catch (error) {
      console.error('Upload images error:', error);
      alert('Upload ảnh thất bại. Vui lòng kiểm tra quyền admin và định dạng ảnh.');
    }
  };

  const addImageUrl = () => {
    const url = window.prompt('Nhập URL ảnh:');
    if (!url?.trim()) return;
    setFormData((prev) => ({ ...prev, images: [...prev.images, url.trim()] }));
  };

  const removeImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const moveImage = (index, direction) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= formData.images.length) return;

    setFormData((prev) => {
      const images = [...prev.images];
      [images[index], images[targetIndex]] = [images[targetIndex], images[index]];
      return { ...prev, images };
    });
  };

  const setPrimaryImage = (index) => {
    setFormData((prev) => {
      const images = [...prev.images];
      const [selected] = images.splice(index, 1);
      return { ...prev, images: [selected, ...images] };
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSaving(true);

    const payload = {
      ...formData,
      price: Number(formData.price || 0),
      old_price: Number(formData.old_price || 0),
      stock_quantity: Number(formData.stock_quantity || 0),
      specifications: formData.specifications.filter((spec) => spec.label || spec.value),
      images: formData.images.filter(Boolean),
    };

    try {
      if (editingProduct?._id) {
        await axiosClient.put(`/products/${editingProduct._id}`, payload);
        alert('Cập nhật sản phẩm thành công.');
      } else {
        await axiosClient.post('/products', payload);
        alert('Thêm sản phẩm thành công.');
      }

      setIsModalOpen(false);
      await fetchProducts();
      onProductsChanged?.();
    } catch (error) {
      console.error('Save product error:', error);
      alert(error.response?.data?.message || 'Không thể lưu sản phẩm.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (product) => {
    if (!window.confirm(`Xóa sản phẩm "${product.title}"?`)) return;

    try {
      await axiosClient.delete(`/products/${product._id}`);
      await fetchProducts();
      onProductsChanged?.();
      alert('Xóa sản phẩm thành công.');
    } catch (error) {
      console.error('Delete product error:', error);
      alert('Không thể xóa sản phẩm.');
    }
  };

  const [selectedIds, setSelectedIds] = useState([]);

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(visibleProducts.map(p => p._id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectRow = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(selectedId => selectedId !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleBulkDelete = async () => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa ${selectedIds.length} sản phẩm đã chọn không?`)) {
      try {
        await axiosClient.post('/products/bulk-delete', { ids: selectedIds });
        setSelectedIds([]);
        await fetchProducts();
        onProductsChanged?.();
      } catch (err) {
        console.error('Failed to bulk delete', err);
      }
    }
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5">
        <div className="flex items-center gap-3 w-full md:w-auto">
          {selectedIds.length > 0 && (
            <button 
              onClick={handleBulkDelete}
              className="px-3 py-2 bg-red-600 text-white font-semibold text-sm rounded-lg hover:bg-red-700 transition flex items-center gap-2 shadow-sm whitespace-nowrap"
            >
              <Trash2 size={16} />
              Xóa ({selectedIds.length})
            </button>
          )}
          <div className="relative flex-1 max-w-md w-full">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={searchTerm}
              onChange={(event) => {
                setSearchTerm(event.target.value);
                setPage(1);
              }}
              className="w-full pl-10 pr-3 py-2 border rounded-lg outline-none focus:border-brand-primary"
              placeholder="Tìm theo tên, OEM..."
            />
          </div>
        </div>

        <button
          onClick={openCreateModal}
          className="bg-brand-primary text-white font-bold px-4 py-2 rounded-lg shadow hover:bg-red-600 transition inline-flex items-center justify-center gap-2 whitespace-nowrap"
        >
          <Plus size={18} /> Thêm sản phẩm
        </button>
      </div>

      <div className="overflow-x-auto border rounded-lg">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="bg-gray-100 text-sm">
              <th className="p-3 border text-center w-10">
                <input 
                  type="checkbox" 
                  className="w-4 h-4 cursor-pointer"
                  checked={visibleProducts.length > 0 && selectedIds.length === visibleProducts.length}
                  onChange={handleSelectAll}
                />
              </th>
              <th className="p-3 border">Ảnh</th>
              <th className="p-3 border">Sản phẩm</th>
              <th className="p-3 border">OEM</th>
              <th className="p-3 border">Kho</th>
              <th className="p-3 border text-right">Giá</th>
              <th className="p-3 border text-center">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan="7" className="p-8 text-center text-gray-500">
                  Đang tải sản phẩm...
                </td>
              </tr>
            ) : visibleProducts.length === 0 ? (
              <tr>
                <td colSpan="7" className="p-8 text-center text-gray-500">
                  Không tìm thấy sản phẩm nào.
                </td>
              </tr>
            ) : (
              visibleProducts.map((product) => (
                <tr key={product._id} className={`border-b hover:bg-gray-50 text-sm ${selectedIds.includes(product._id) ? 'bg-blue-50/50' : ''}`}>
                  <td className="p-3 text-center border">
                    <input 
                      type="checkbox" 
                      className="w-4 h-4 cursor-pointer"
                      checked={selectedIds.includes(product._id)}
                      onChange={() => handleSelectRow(product._id)}
                    />
                  </td>
                  <td className="p-3 border w-24">
                    <img
                      src={resolveMediaUrl(product.images?.[0] || product.image_url)}
                      alt={product.title}
                      className="w-14 h-14 rounded object-cover bg-gray-100"
                    />
                  </td>
                  <td className="p-3 border">
                    <p className="font-bold line-clamp-1">{product.title}</p>
                    <p className="text-xs text-gray-500">{product.brand || 'Chưa có thương hiệu'} · {product.category || 'Chưa phân loại'}</p>
                  </td>
                  <td className="p-3 border font-mono text-xs">{product.oem_code}</td>
                  <td className="p-3 border font-bold">{product.stock_quantity || 0}</td>
                  <td className="p-3 border text-right font-bold text-brand-primary">
                    {Number(product.price || 0).toLocaleString('vi-VN')} đ
                  </td>
                  <td className="p-3 border text-center">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => openEditModal(product)}
                        className="bg-blue-600 text-white px-3 py-1.5 rounded text-xs font-bold hover:bg-blue-700 inline-flex items-center gap-1"
                      >
                        <Edit size={14} /> Sửa
                      </button>
                      <button
                        onClick={() => handleDelete(product)}
                        className="bg-red-600 text-white px-3 py-1.5 rounded text-xs font-bold hover:bg-red-700 inline-flex items-center gap-1"
                      >
                        <Trash2 size={14} /> Xóa
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between mt-4 text-sm">
        <span className="text-gray-500">
          Hiển thị {visibleProducts.length} / {filteredProducts.length} sản phẩm
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPage((prev) => Math.max(1, prev - 1))}
            disabled={page === 1}
            className="px-3 py-1.5 border rounded disabled:opacity-50"
          >
            Trước
          </button>
          <span className="font-bold">{page}/{totalPages}</span>
          <button
            onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
            disabled={page === totalPages}
            className="px-3 py-1.5 border rounded disabled:opacity-50"
          >
            Sau
          </button>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-[99999] flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-5xl w-full max-h-[92vh] overflow-y-auto">
            <div className="bg-brand-dark px-6 py-4 flex justify-between items-center sticky top-0 z-10">
              <h3 className="text-white font-bold text-lg">
                {editingProduct ? 'Sửa sản phẩm' : 'Thêm sản phẩm'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-300 hover:text-white">
                <X size={22} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="Tên sản phẩm *">
                  <input required value={formData.title} onChange={(e) => updateField('title', e.target.value)} className="form-input" />
                </Field>
                <Field label="Mã OEM *">
                  <input required value={formData.oem_code} onChange={(e) => updateField('oem_code', e.target.value.toUpperCase())} className="form-input font-mono uppercase" />
                </Field>
                <Field label="Thương hiệu">
                  <input value={formData.brand} onChange={(e) => updateField('brand', e.target.value)} className="form-input" />
                </Field>
                <Field label="Danh mục">
                  <select value={formData.category} onChange={(e) => updateField('category', e.target.value)} className="form-input">
                    <option value="">Chọn danh mục</option>
                    {CATEGORIES.filter((cat) => cat !== 'Tất cả').map((category) => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </Field>
                <Field label="Giá bán *">
                  <input required type="number" min="0" value={formData.price} onChange={(e) => updateField('price', e.target.value)} className="form-input" />
                </Field>
                <Field label="Giá cũ">
                  <input type="number" min="0" value={formData.old_price} onChange={(e) => updateField('old_price', e.target.value)} className="form-input" />
                </Field>
                <Field label="Số lượng kho *">
                  <input required type="number" min="0" value={formData.stock_quantity} onChange={(e) => updateField('stock_quantity', e.target.value)} className="form-input" />
                </Field>
                <Field label="Xuất xứ">
                  <input value={formData.origin} onChange={(e) => updateField('origin', e.target.value)} className="form-input" />
                </Field>
                <Field label="Bảo hành">
                  <input value={formData.warranty} onChange={(e) => updateField('warranty', e.target.value)} className="form-input" />
                </Field>
                <Field label="Tình trạng">
                  <input value={formData.condition} onChange={(e) => updateField('condition', e.target.value)} className="form-input" placeholder="Mới 100%" />
                </Field>
              </div>

              <Field label="Mô tả">
                <textarea value={formData.description} onChange={(e) => updateField('description', e.target.value)} className="form-input min-h-24" />
              </Field>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-bold text-brand-dark">Ảnh sản phẩm</label>
                  <button type="button" onClick={addImageUrl} className="text-xs font-bold text-brand-primary hover:underline">
                    + Thêm URL ảnh
                  </button>
                </div>
                <label className="border-2 border-dashed border-gray-300 rounded-lg p-5 flex flex-col items-center justify-center text-center cursor-pointer hover:border-brand-primary transition">
                  <ImagePlus size={28} className="text-brand-primary mb-2" />
                  <span className="font-bold text-sm">Upload nhiều ảnh</span>
                  <span className="text-xs text-gray-500 mt-1">Ảnh đầu tiên là ảnh đại diện ngoài Home</span>
                  <input type="file" accept="image/*" multiple className="hidden" onChange={(e) => uploadImages(e.target.files)} />
                </label>

                {formData.images.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
                    {formData.images.map((image, index) => (
                      <div key={`${image}-${index}`} className="border rounded-lg p-2 bg-gray-50">
                        <img src={resolveMediaUrl(image)} alt="" className="w-full aspect-square object-cover rounded bg-gray-100" />
                        <div className="flex flex-wrap gap-1 mt-2">
                          <button type="button" onClick={() => setPrimaryImage(index)} className="px-2 py-1 text-[11px] bg-brand-dark text-white rounded inline-flex items-center gap-1">
                            <Star size={12} /> Chính
                          </button>
                          <button type="button" onClick={() => moveImage(index, -1)} className="px-2 py-1 text-[11px] bg-gray-200 rounded">Lên</button>
                          <button type="button" onClick={() => moveImage(index, 1)} className="px-2 py-1 text-[11px] bg-gray-200 rounded">Xuống</button>
                          <button type="button" onClick={() => removeImage(index)} className="px-2 py-1 text-[11px] bg-red-600 text-white rounded">Xóa</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-bold text-brand-dark">Thông số kỹ thuật</label>
                  <button type="button" onClick={addSpec} className="text-xs font-bold text-brand-primary hover:underline">
                    + Thêm dòng
                  </button>
                </div>
                <div className="space-y-2">
                  {formData.specifications.map((spec, index) => (
                    <div key={index} className="grid grid-cols-[1fr_1fr_auto] gap-2">
                      <input value={spec.label} onChange={(e) => updateSpec(index, 'label', e.target.value)} className="form-input" placeholder="Tên thông số" />
                      <input value={spec.value} onChange={(e) => updateSpec(index, 'value', e.target.value)} className="form-input" placeholder="Giá trị" />
                      <button type="button" onClick={() => removeSpec(index)} className="px-3 bg-gray-200 rounded hover:bg-gray-300">
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2 bg-gray-200 rounded font-bold hover:bg-gray-300">
                  Hủy
                </button>
                <button disabled={isSaving} type="submit" className="px-5 py-2 bg-brand-primary text-white rounded font-bold hover:bg-red-600 disabled:bg-gray-400">
                  {isSaving ? 'Đang lưu...' : 'Lưu sản phẩm'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label className="block text-sm font-bold text-brand-dark mb-1">{label}</label>
      {children}
    </div>
  );
}
