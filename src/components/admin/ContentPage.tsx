'use client';

import { useState, useMemo } from 'react';
import { useStore } from '@/store/useStore';
import type { Product } from '@/data/products';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  Package,
  Layers,
  Check,
  AlertTriangle,
} from 'lucide-react';

interface ProductFormData {
  name: string;
  category: string;
  price: string;
  originalPrice: string;
  material: string;
  description: string;
  badge: string;
  stock: string;
  sku: string;
}

const emptyProductForm: ProductFormData = {
  name: '',
  category: 'abayas',
  price: '',
  originalPrice: '',
  material: '',
  description: '',
  badge: '',
  stock: '',
  sku: '',
};

function productToForm(p: Product): ProductFormData {
  return {
    name: p.name,
    category: p.category,
    price: String(p.price),
    originalPrice: p.originalPrice ? String(p.originalPrice) : '',
    material: p.material,
    description: p.description,
    badge: p.badge || '',
    stock: p.stock !== undefined ? String(p.stock) : '',
    sku: p.sku || '',
  };
}

const statusConfig: Record<string, { label: string; className: string }> = {
  active: { label: 'Active', className: 'bg-green-100 text-green-800' },
  draft: { label: 'Draft', className: 'bg-gray-100 text-gray-600' },
  out_of_stock: { label: 'Out of Stock', className: 'bg-red-100 text-red-800' },
};

export default function ContentPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Content</h2>
        <p className="text-sm text-gray-500 mt-0.5">Manage your products and collections. All changes are saved automatically.</p>
      </div>

      <Tabs defaultValue="products" className="space-y-4">
        <TabsList className="bg-white border border-gray-200/60 shadow-sm">
          <TabsTrigger value="products" className="gap-2 text-sm font-medium data-[state=active]:bg-blue-600 data-[state=active]:text-white">
            <Package className="size-3.5" />
            Products
          </TabsTrigger>
          <TabsTrigger value="collections" className="gap-2 text-sm font-medium data-[state=active]:bg-blue-600 data-[state=active]:text-white">
            <Layers className="size-3.5" />
            Collections
          </TabsTrigger>
        </TabsList>

        <TabsContent value="products">
          <ProductsTab />
        </TabsContent>
        <TabsContent value="collections">
          <CollectionsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   PRODUCTS TAB — Full CRUD with save
   ═══════════════════════════════════════════════════════════════ */
function ProductsTab() {
  const adminProducts = useStore((s) => s.adminProducts);
  const updateProduct = useStore((s) => s.updateProduct);
  const addProduct = useStore((s) => s.addProduct);
  const deleteProduct = useStore((s) => s.deleteProduct);

  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [editId, setEditId] = useState<number | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [form, setForm] = useState<ProductFormData>(emptyProductForm);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const categories = useMemo(() => {
    const cats = new Set(adminProducts.map((p) => p.category));
    return ['all', ...Array.from(cats).sort()];
  }, [adminProducts]);

  const filteredProducts = useMemo(() => {
    return adminProducts.filter((p) => {
      const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
        (p.nameAr && p.nameAr.includes(search)) ||
        p.sku.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = categoryFilter === 'all' || p.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [adminProducts, search, categoryFilter]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  const openEdit = (product: Product) => {
    setEditId(product.id);
    setForm(productToForm(product));
  };

  const openAdd = () => {
    setForm(emptyProductForm);
    setIsAdding(true);
  };

  const handleSaveEdit = () => {
    if (!editId || !form.name.trim()) return;
    updateProduct(editId, {
      name: form.name,
      category: form.category,
      price: parseFloat(form.price) || 0,
      originalPrice: form.originalPrice ? parseFloat(form.originalPrice) : undefined,
      material: form.material,
      description: form.description,
      badge: form.badge,
      stock: form.stock ? parseInt(form.stock) : undefined,
      sku: form.sku,
    });
    setEditId(null);
    showToast('Product updated successfully');
  };

  const handleSaveNew = () => {
    if (!form.name.trim()) return;
    const newId = Math.max(...adminProducts.map(p => p.id), 0) + 1;
    addProduct({
      id: newId,
      name: form.name,
      category: form.category,
      price: parseFloat(form.price) || 0,
      originalPrice: form.originalPrice ? parseFloat(form.originalPrice) : undefined,
      image: '/images/products/hijab-modal-ivory.png',
      images: ['/images/products/hijab-modal-ivory.png'],
      colors: [{ name: 'Default', hex: '#C4A882' }],
      sizes: ['One Size'],
      badge: form.badge,
      rating: 0,
      reviews: 0,
      material: form.material,
      description: form.description,
      stock: form.stock ? parseInt(form.stock) : undefined,
      sku: form.sku || `HAY-${newId.toString().padStart(3, '0')}`,
      tags: [],
    });
    setIsAdding(false);
    setForm(emptyProductForm);
    showToast('Product created successfully');
  };

  const handleDelete = () => {
    if (!deleteId) return;
    deleteProduct(deleteId);
    setDeleteId(null);
    showToast('Product deleted');
  };

  const updateField = (field: keyof ProductFormData, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const editingProduct = editId ? adminProducts.find(p => p.id === editId) : null;

  return (
    <div className="space-y-4">
      {/* Toast */}
      {toast && (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-2 bg-gray-900 text-white px-4 py-2.5 rounded-lg shadow-lg text-sm animate-[fadeUp_0.3s_ease]">
          <Check className="size-4 text-green-400" />
          {toast}
        </div>
      )}

      {/* Filters */}
      <Card className="border border-gray-200/60 shadow-sm">
        <CardContent className="pt-5 pb-4 px-5">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
              <Input
                placeholder="Search products by name or SKU..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat === 'all' ? 'All Categories' : cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={openAdd} className="bg-blue-600 hover:bg-blue-700 text-white gap-2 cursor-pointer shrink-0">
              <Plus className="size-4" />
              Add Product
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="flex items-center gap-4 text-sm text-gray-500">
        <span>{filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}</span>
        <span className="text-gray-300">|</span>
        <span>Total value: EGP {adminProducts.reduce((s, p) => s + p.price * (p.stock || 1), 0).toLocaleString()}</span>
      </div>

      {/* Products Table */}
      <Card className="border border-gray-200/60 shadow-sm">
        <CardContent className="pt-5 pb-0 px-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs font-semibold text-gray-500 uppercase pl-5">SKU</TableHead>
                  <TableHead className="text-xs font-semibold text-gray-500 uppercase">Name</TableHead>
                  <TableHead className="text-xs font-semibold text-gray-500 uppercase">Category</TableHead>
                  <TableHead className="text-xs font-semibold text-gray-500 uppercase">Price</TableHead>
                  <TableHead className="text-xs font-semibold text-gray-500 uppercase">Stock</TableHead>
                  <TableHead className="text-xs font-semibold text-gray-500 uppercase">Status</TableHead>
                  <TableHead className="text-xs font-semibold text-gray-500 uppercase pr-5">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-12 text-gray-400">
                      No products found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredProducts.map((product) => {
                    const status = product.stock !== undefined && product.stock <= 0 ? 'out_of_stock' : 'active';
                    const config = statusConfig[status];
                    return (
                      <TableRow key={product.id} className="hover:bg-gray-50/50">
                        <TableCell className="pl-5 text-gray-400 text-xs font-mono">{product.sku}</TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium text-gray-900 text-sm">{product.name}</p>
                            {product.badge && (
                              <span className="inline-block mt-0.5 text-[10px] px-1.5 py-0.5 bg-gray-100 text-gray-500 rounded font-medium">
                                {product.badge}
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-gray-600 capitalize text-sm">{product.category}</TableCell>
                        <TableCell className="font-medium text-gray-900 text-sm">
                          EGP {product.price.toLocaleString()}
                          {product.originalPrice && (
                            <span className="text-gray-400 line-through ml-1.5 text-xs">
                              EGP {product.originalPrice.toLocaleString()}
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="text-gray-600 text-sm">{product.stock ?? '—'}</TableCell>
                        <TableCell>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.className}`}>
                            {config.label}
                          </span>
                        </TableCell>
                        <TableCell className="pr-5">
                          <div className="flex items-center gap-1">
                            <Button variant="ghost" size="icon" className="size-8 hover:bg-blue-50 hover:text-blue-600 cursor-pointer" onClick={() => openEdit(product)}>
                              <Edit2 className="size-3.5" />
                            </Button>
                            <Button variant="ghost" size="icon" className="size-8 hover:bg-red-50 hover:text-red-600 cursor-pointer" onClick={() => setDeleteId(product.id)}>
                              <Trash2 className="size-3.5" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Edit Product Dialog */}
      <Dialog open={editId !== null} onOpenChange={() => setEditId(null)}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Product — {editingProduct?.name}</DialogTitle>
            <DialogDescription>Update product information. Changes are saved to the store immediately.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs text-gray-500">Product Name</Label>
                <Input value={form.name} onChange={(e) => updateField('name', e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-gray-500">SKU</Label>
                <Input value={form.sku} onChange={(e) => updateField('sku', e.target.value)} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs text-gray-500">Price (EGP)</Label>
                <Input type="number" value={form.price} onChange={(e) => updateField('price', e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-gray-500">Original Price (EGP)</Label>
                <Input type="number" value={form.originalPrice} onChange={(e) => updateField('originalPrice', e.target.value)} placeholder="Leave empty if no sale" />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs text-gray-500">Category</Label>
                <Select value={form.category} onValueChange={(v) => updateField('category', v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {['abayas', 'dresses', 'sets', 'capes', 'scarves'].map(c => (
                      <SelectItem key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-gray-500">Stock</Label>
                <Input type="number" value={form.stock} onChange={(e) => updateField('stock', e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-gray-500">Badge</Label>
                <Select value={form.badge} onValueChange={(v) => updateField('badge', v)}>
                  <SelectTrigger><SelectValue placeholder="None" /></SelectTrigger>
                  <SelectContent>
                    {['', 'New', 'Best Seller', 'Sale', 'Trending', 'Limited', 'Buy 1 Get 1', 'Luxe'].map(b => (
                      <SelectItem key={b} value={b}>{b || 'None'}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-gray-500">Material</Label>
              <Input value={form.material} onChange={(e) => updateField('material', e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-gray-500">Description</Label>
              <Textarea value={form.description} onChange={(e) => updateField('description', e.target.value)} rows={3} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditId(null)} className="cursor-pointer">Cancel</Button>
            <Button onClick={handleSaveEdit} className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer gap-1.5">
              <Check className="size-3.5" />
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Product Dialog */}
      <Dialog open={isAdding} onOpenChange={() => setIsAdding(false)}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Product</DialogTitle>
            <DialogDescription>Fill in the product details to create a new listing.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label className="text-xs text-gray-500">Product Name *</Label>
              <Input value={form.name} onChange={(e) => updateField('name', e.target.value)} placeholder="e.g. Sukoon Oversized Abaya" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs text-gray-500">Price (EGP) *</Label>
                <Input type="number" value={form.price} onChange={(e) => updateField('price', e.target.value)} placeholder="2490" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-gray-500">Original Price (EGP)</Label>
                <Input type="number" value={form.originalPrice} onChange={(e) => updateField('originalPrice', e.target.value)} placeholder="Optional" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs text-gray-500">Category</Label>
                <Select value={form.category} onValueChange={(v) => updateField('category', v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {['abayas', 'dresses', 'sets', 'capes', 'scarves'].map(c => (
                      <SelectItem key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-gray-500">Stock</Label>
                <Input type="number" value={form.stock} onChange={(e) => updateField('stock', e.target.value)} placeholder="0" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs text-gray-500">Material</Label>
                <Input value={form.material} onChange={(e) => updateField('material', e.target.value)} placeholder="e.g. Premium Crepe" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-gray-500">Badge</Label>
                <Select value={form.badge} onValueChange={(v) => updateField('badge', v)}>
                  <SelectTrigger><SelectValue placeholder="None" /></SelectTrigger>
                  <SelectContent>
                    {['', 'New', 'Best Seller', 'Sale', 'Trending', 'Limited', 'Buy 1 Get 1'].map(b => (
                      <SelectItem key={b} value={b}>{b || 'None'}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-gray-500">Description</Label>
              <Textarea value={form.description} onChange={(e) => updateField('description', e.target.value)} rows={3} placeholder="Product description..." />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAdding(false)} className="cursor-pointer">Cancel</Button>
            <Button onClick={handleSaveNew} className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer gap-1.5">
              <Plus className="size-3.5" />
              Create Product
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="size-5 text-red-500" />
              Delete Product
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this product? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)} className="cursor-pointer">Cancel</Button>
            <Button variant="destructive" onClick={handleDelete} className="cursor-pointer gap-1.5">
              <Trash2 className="size-3.5" />
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   COLLECTIONS TAB — Full CRUD with save to store
   ═══════════════════════════════════════════════════════════════ */
function CollectionsTab() {
  const adminCollections = useStore((s) => s.adminCollections);
  const addCollection = useStore((s) => s.addCollection);
  const updateCollection = useStore((s) => s.updateCollection);
  const deleteCollection = useStore((s) => s.deleteCollection);

  const [editId, setEditId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  // Form state
  const [formName, setFormName] = useState('');
  const [formSlug, setFormSlug] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formFeatured, setFormFeatured] = useState(false);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  const resetForm = () => {
    setFormName('');
    setFormSlug('');
    setFormDescription('');
    setFormFeatured(false);
  };

  const openEdit = (id: string) => {
    const col = adminCollections.find(c => c.id === id);
    if (!col) return;
    setEditId(id);
    setFormName(col.name);
    setFormSlug(col.slug);
    setFormDescription(col.description);
    setFormFeatured(!!col.featured);
  };

  const handleSaveEdit = () => {
    if (!editId || !formName.trim()) return;
    updateCollection(editId, {
      name: formName,
      slug: formSlug || formName.toLowerCase().replace(/\s+/g, '-'),
      description: formDescription,
      featured: formFeatured,
    });
    setEditId(null);
    showToast('Collection updated successfully');
  };

  const openAdd = () => {
    resetForm();
    setIsAdding(true);
  };

  const handleSaveNew = () => {
    if (!formName.trim()) return;
    addCollection({
      id: `col-${Date.now()}`,
      name: formName,
      slug: formSlug || formName.toLowerCase().replace(/\s+/g, '-'),
      description: formDescription,
      image: '/images/categories/cat-everyday.png',
      productCount: 0,
      featured: formFeatured,
    });
    setIsAdding(false);
    resetForm();
    showToast('Collection created successfully');
  };

  const handleDelete = () => {
    if (!deleteId) return;
    deleteCollection(deleteId);
    setDeleteId(null);
    showToast('Collection deleted');
  };

  const handleToggleFeatured = (id: string) => {
    const col = adminCollections.find(c => c.id === id);
    if (!col) return;
    updateCollection(id, { featured: !col.featured });
  };

  return (
    <div className="space-y-4">
      {/* Toast */}
      {toast && (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-2 bg-gray-900 text-white px-4 py-2.5 rounded-lg shadow-lg text-sm animate-[fadeUp_0.3s_ease]">
          <Check className="size-4 text-green-400" />
          {toast}
        </div>
      )}

      <div className="flex justify-end">
        <Button onClick={openAdd} className="bg-blue-600 hover:bg-blue-700 text-white gap-2 cursor-pointer">
          <Plus className="size-4" />
          Add Collection
        </Button>
      </div>

      <Card className="border border-gray-200/60 shadow-sm">
        <CardContent className="pt-5 pb-0 px-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs font-semibold text-gray-500 uppercase pl-5">Name</TableHead>
                  <TableHead className="text-xs font-semibold text-gray-500 uppercase">Slug</TableHead>
                  <TableHead className="text-xs font-semibold text-gray-500 uppercase">Products</TableHead>
                  <TableHead className="text-xs font-semibold text-gray-500 uppercase">Featured</TableHead>
                  <TableHead className="text-xs font-semibold text-gray-500 uppercase pr-5">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {adminCollections.map((col) => (
                  <TableRow key={col.id} className="hover:bg-gray-50/50">
                    <TableCell className="pl-5">
                      <div className="flex items-center gap-3">
                        <div className="size-9 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                          <Layers className="size-4 text-gray-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 text-sm">{col.name}</p>
                          <p className="text-xs text-gray-400 truncate max-w-[200px]">{col.description}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-500 text-sm font-mono">{col.slug}</TableCell>
                    <TableCell className="text-gray-600 text-sm font-medium">{col.productCount}</TableCell>
                    <TableCell>
                      <Switch checked={!!col.featured} onCheckedChange={() => handleToggleFeatured(col.id)} />
                    </TableCell>
                    <TableCell className="pr-5">
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" className="size-8 hover:bg-blue-50 hover:text-blue-600 cursor-pointer" onClick={() => openEdit(col.id)}>
                          <Edit2 className="size-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="size-8 hover:bg-red-50 hover:text-red-600 cursor-pointer" onClick={() => setDeleteId(col.id)}>
                          <Trash2 className="size-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Edit Collection Dialog */}
      <Dialog open={editId !== null} onOpenChange={() => setEditId(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Collection</DialogTitle>
            <DialogDescription>Update collection details. Changes are saved immediately.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label>Name</Label>
              <Input value={formName} onChange={(e) => setFormName(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>Slug</Label>
              <Input value={formSlug} onChange={(e) => setFormSlug(e.target.value)} placeholder="collection-url-slug" />
            </div>
            <div className="space-y-1.5">
              <Label>Description</Label>
              <Textarea value={formDescription} onChange={(e) => setFormDescription(e.target.value)} rows={3} />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Featured</Label>
                <p className="text-xs text-gray-400">Show in homepage collections</p>
              </div>
              <Switch checked={formFeatured} onCheckedChange={setFormFeatured} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditId(null)} className="cursor-pointer">Cancel</Button>
            <Button onClick={handleSaveEdit} className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer gap-1.5">
              <Check className="size-3.5" />
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* New Collection Dialog */}
      <Dialog open={isAdding} onOpenChange={() => setIsAdding(false)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Collection</DialogTitle>
            <DialogDescription>Create a new product collection.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label>Name *</Label>
              <Input value={formName} onChange={(e) => setFormName(e.target.value)} placeholder="Collection name" />
            </div>
            <div className="space-y-1.5">
              <Label>Slug</Label>
              <Input value={formSlug} onChange={(e) => setFormSlug(e.target.value)} placeholder="auto-generated-from-name" />
            </div>
            <div className="space-y-1.5">
              <Label>Description</Label>
              <Textarea value={formDescription} onChange={(e) => setFormDescription(e.target.value)} rows={3} />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Featured</Label>
                <p className="text-xs text-gray-400">Show in homepage</p>
              </div>
              <Switch checked={formFeatured} onCheckedChange={setFormFeatured} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAdding(false)} className="cursor-pointer">Cancel</Button>
            <Button onClick={handleSaveNew} className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer gap-1.5">
              <Plus className="size-3.5" />
              Create Collection
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="size-5 text-red-500" />
              Delete Collection
            </DialogTitle>
            <DialogDescription>Are you sure? This action cannot be undone.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)} className="cursor-pointer">Cancel</Button>
            <Button variant="destructive" onClick={handleDelete} className="cursor-pointer gap-1.5">
              <Trash2 className="size-3.5" />
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
