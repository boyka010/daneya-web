'use client';

import { useState, useMemo, useCallback, useRef } from 'react';
import { useStore } from '@/store/useStore';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  Package,
  Image as ImageIcon,
  Upload,
  X,
  Check,
  AlertCircle,
  Eye,
  Copy,
  MoreHorizontal,
  Filter,
  Download,
  RefreshCw,
} from 'lucide-react';
import type { Product } from '@/data/products';

const statusConfig: Record<string, { label: string; className: string }> = {
  active: { label: 'Active', className: 'bg-green-100 text-green-800' },
  draft: { label: 'Draft', className: 'bg-gray-100 text-gray-600' },
  out_of_stock: { label: 'Out of Stock', className: 'bg-red-100 text-red-800' },
};

const categories = ['abayas', 'sets', 'capes', 'dresses', 'skirts', 'cardigans', 'scarves'];
const badges = ['', 'New', 'Best Seller', 'Sale', 'Flash Sale', 'Trending', 'Buy 1 Get 1', 'Limited'];

function getProductStatus(stock?: number): string {
  if (stock === undefined) return 'active';
  if (stock <= 0) return 'out_of_stock';
  if (stock <= 5) return 'draft';
  return 'active';
}

interface ProductFormData {
  name: string;
  nameAr: string;
  category: string;
  price: string;
  originalPrice: string;
  image: string;
  images: string[];
  colors: { name: string; hex: string }[];
  sizes: string[];
  badge: string;
  material: string;
  description: string;
  stock: string;
  sku: string;
  tags: string[];
}

const initialFormData: ProductFormData = {
  name: '',
  nameAr: '',
  category: 'abayas',
  price: '',
  originalPrice: '',
  image: '',
  images: [],
  colors: [{ name: 'Black', hex: '#000000' }],
  sizes: ['S/M', 'L/XL', 'Free Size'],
  badge: '',
  material: '',
  description: '',
  stock: '10',
  sku: '',
  tags: [],
};

function generateSKU(name: string, category: string): string {
  const prefix = category.substring(0, 3).toUpperCase();
  const timestamp = Date.now().toString(36).toUpperCase();
  return `DAN-${prefix}-${timestamp}`;
}

export default function ProductsManagement() {
  const adminProducts = useStore((s) => s.adminProducts);
  const addProduct = useStore((s) => s.addProduct);
  const updateProduct = useStore((s) => s.updateProduct);
  const deleteProduct = useStore((s) => s.deleteProduct);

  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [deleteProductItem, setDeleteProductItem] = useState<Product | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [formData, setFormData] = useState<ProductFormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredProducts = useMemo(() => {
    return adminProducts.filter((p) => {
      const matchesSearch = 
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.sku.toLowerCase().includes(search.toLowerCase()) ||
        p.nameAr?.includes(search);
      const matchesCategory = categoryFilter === 'all' || p.category === categoryFilter;
      
      let matchesStatus = true;
      if (statusFilter === 'in_stock') {
        matchesStatus = (p.stock || 0) > 0;
      } else if (statusFilter === 'out_of_stock') {
        matchesStatus = (p.stock || 0) === 0;
      }
      
      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [adminProducts, search, categoryFilter, statusFilter]);

  const resetForm = useCallback(() => {
    setFormData(initialFormData);
  }, []);

  const handleAddClick = () => {
    resetForm();
    setFormData(prev => ({ ...prev, sku: generateSKU('', 'abayas') }));
    setEditProduct(null);
    setIsAddDialogOpen(true);
  };

  const handleEditClick = (product: Product) => {
    setFormData({
      name: product.name,
      nameAr: product.nameAr || '',
      category: product.category,
      price: product.price.toString(),
      originalPrice: product.originalPrice?.toString() || '',
      image: product.image,
      images: product.images,
      colors: product.colors,
      sizes: product.sizes,
      badge: product.badge,
      material: product.material,
      description: product.description,
      stock: product.stock?.toString() || '0',
      sku: product.sku,
      tags: product.tags,
    });
    setEditProduct(product);
    setIsAddDialogOpen(true);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setFormData(prev => ({
          ...prev,
          images: [...prev.images, result],
          image: prev.image || result,
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setFormData(prev => {
      const newImages = [...prev.images];
      newImages.splice(index, 1);
      return {
        ...prev,
        images: newImages,
        image: newImages[0] || '',
      };
    });
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    const productData: Product = {
      id: editProduct?.id || Math.max(...adminProducts.map(p => p.id), 0) + 1,
      name: formData.name,
      nameAr: formData.nameAr || undefined,
      category: formData.category,
      price: parseFloat(formData.price) || 0,
      originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : undefined,
      image: formData.image || '/images/products/placeholder.png',
      images: formData.images.length > 0 ? formData.images : ['/images/products/placeholder.png'],
      colors: formData.colors,
      sizes: formData.sizes,
      badge: formData.badge,
      rating: editProduct?.rating || 4.5,
      reviews: editProduct?.reviews || 0,
      material: formData.material,
      description: formData.description,
      stock: parseInt(formData.stock) || 0,
      sku: formData.sku || generateSKU(formData.name, formData.category),
      tags: formData.tags,
    };

    try {
      if (editProduct) {
        updateProduct(editProduct.id, productData);
        setSuccessMessage('Product updated successfully!');
      } else {
        addProduct(productData);
        setSuccessMessage('Product added successfully!');
      }
      
      setTimeout(() => {
        setSuccessMessage('');
        setIsAddDialogOpen(false);
        resetForm();
      }, 1500);
    } catch (error) {
      console.error('Error saving product:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = () => {
    if (deleteProductItem) {
      deleteProduct(deleteProductItem.id);
      setDeleteProductItem(null);
    }
  };

  const duplicateProduct = (product: Product) => {
    const newProduct: Product = {
      ...product,
      id: Math.max(...adminProducts.map(p => p.id), 0) + 1,
      sku: generateSKU(product.name, product.category),
    };
    addProduct(newProduct);
    setSuccessMessage('Product duplicated successfully!');
    setTimeout(() => setSuccessMessage(''), 2000);
  };

  const totalProducts = adminProducts.length;
  const inStockProducts = adminProducts.filter(p => (p.stock || 0) > 0).length;
  const outOfStockProducts = adminProducts.filter(p => (p.stock || 0) === 0).length;
  const totalValue = adminProducts.reduce((sum, p) => sum + (p.price * (p.stock || 0)), 0);

  return (
    <div className="space-y-6">
      {/* Success Message */}
      {successMessage && (
        <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2">
          <Check size={16} />
          {successMessage}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-gray-100 shadow-sm">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">Total Products</p>
                <p className="text-2xl font-bold text-gray-900">{totalProducts}</p>
              </div>
              <Package className="size-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-gray-100 shadow-sm">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">In Stock</p>
                <p className="text-2xl font-bold text-green-600">{inStockProducts}</p>
              </div>
              <Check className="size-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-gray-100 shadow-sm">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">Out of Stock</p>
                <p className="text-2xl font-bold text-red-600">{outOfStockProducts}</p>
              </div>
              <AlertCircle className="size-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-gray-100 shadow-sm">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">Inventory Value</p>
                <p className="text-2xl font-bold text-gray-900">EGP {totalValue.toLocaleString()}</p>
              </div>
              <Package className="size-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Products Management</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            {filteredProducts.length} products found
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2 cursor-pointer">
            <Download size={16} />
            Export
          </Button>
          <Button onClick={handleAddClick} className="bg-blue-600 hover:bg-blue-700 text-white gap-2 cursor-pointer">
            <Plus size={16} />
            Add Product
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="border-gray-100 shadow-sm">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
              <Input
                placeholder="Search by name, SKU, or Arabic name..."
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
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Stock Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="in_stock">In Stock</SelectItem>
                <SelectItem value="out_of_stock">Out of Stock</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Products Table */}
      <Card className="border-gray-100 shadow-sm">
        <CardContent className="pt-6 px-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs font-semibold text-gray-500 uppercase w-20">Image</TableHead>
                  <TableHead className="text-xs font-semibold text-gray-500 uppercase">Product</TableHead>
                  <TableHead className="text-xs font-semibold text-gray-500 uppercase">Category</TableHead>
                  <TableHead className="text-xs font-semibold text-gray-500 uppercase">Price</TableHead>
                  <TableHead className="text-xs font-semibold text-gray-500 uppercase">Stock</TableHead>
                  <TableHead className="text-xs font-semibold text-gray-500 uppercase">Status</TableHead>
                  <TableHead className="text-xs font-semibold text-gray-500 uppercase w-24">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-12 text-gray-500">
                      No products found. Try adjusting your filters.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredProducts.map((product) => {
                    const status = getProductStatus(product.stock);
                    const config = statusConfig[status];
                    return (
                      <TableRow key={product.id} className="hover:bg-gray-50">
                        <TableCell>
                          <div className="size-14 rounded-lg bg-gray-100 overflow-hidden relative">
                            {product.image ? (
                              <img 
                                src={product.image} 
                                alt={product.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <ImageIcon className="size-6 text-gray-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium text-gray-900 text-sm">{product.name}</p>
                            {product.nameAr && (
                              <p className="text-xs text-gray-400 mt-0.5" dir="rtl">{product.nameAr}</p>
                            )}
                            <p className="text-xs text-gray-400 mt-0.5">SKU: {product.sku}</p>
                          </div>
                        </TableCell>
                        <TableCell className="text-gray-600 capitalize text-sm">{product.category}</TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium text-gray-900">
                              EGP {product.price.toLocaleString()}
                            </p>
                            {product.originalPrice && (
                              <p className="text-xs text-gray-400 line-through">
                                EGP {product.originalPrice.toLocaleString()}
                              </p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-gray-600">{product.stock ?? 0}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.className}`}>
                              {config.label}
                            </span>
                            {product.badge && (
                              <Badge variant="secondary" className="text-xs">
                                {product.badge}
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="size-8 hover:bg-blue-50 hover:text-blue-600 cursor-pointer"
                              onClick={() => handleEditClick(product)}
                              title="Edit"
                            >
                              <Edit2 className="size-3.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="size-8 hover:bg-gray-100 hover:text-gray-600 cursor-pointer"
                              onClick={() => duplicateProduct(product)}
                              title="Duplicate"
                            >
                              <Copy className="size-3.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="size-8 hover:bg-red-50 hover:text-red-600 cursor-pointer"
                              onClick={() => setDeleteProductItem(product)}
                              title="Delete"
                            >
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

      {/* Add/Edit Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editProduct ? 'Edit Product' : 'Add New Product'}</DialogTitle>
            <DialogDescription>
              {editProduct ? 'Update product information below.' : 'Fill in the product details to add a new product.'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            {/* Image Upload */}
            <div className="space-y-2">
              <Label>Product Images</Label>
              <div className="grid grid-cols-4 gap-2">
                {formData.images.map((img, index) => (
                  <div key={index} className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 border">
                    <img src={img} alt={`Product ${index + 1}`} className="w-full h-full object-cover" />
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute top-1 right-1 size-6"
                      onClick={() => removeImage(index)}
                    >
                      <X className="size-3" />
                    </Button>
                  </div>
                ))}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="aspect-square rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center gap-1 hover:border-blue-500 hover:bg-blue-50 transition-colors"
                >
                  <Upload className="size-6 text-gray-400" />
                  <span className="text-xs text-gray-500">Add Image</span>
                </button>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>

            {/* Basic Info */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Product Name *</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter product name"
                />
              </div>
              <div className="space-y-2">
                <Label>Arabic Name</Label>
                <Input
                  value={formData.nameAr}
                  onChange={(e) => setFormData({ ...formData, nameAr: e.target.value })}
                  placeholder="الاسم بالعربي"
                  dir="rtl"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Category *</Label>
                <Select value={formData.category} onValueChange={(v) => setFormData({ ...formData, category: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(cat => (
                      <SelectItem key={cat} value={cat}>
                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>SKU</Label>
                <Input
                  value={formData.sku}
                  onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                  placeholder="Auto-generated"
                />
              </div>
              <div className="space-y-2">
                <Label>Badge</Label>
                <Select value={formData.badge} onValueChange={(v) => setFormData({ ...formData, badge: v })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select badge" />
                  </SelectTrigger>
                  <SelectContent>
                    {badges.map(badge => (
                      <SelectItem key={badge} value={badge}>
                        {badge || 'None'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Pricing */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Price (EGP) *</Label>
                <Input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="0.00"
                />
              </div>
              <div className="space-y-2">
                <Label>Original Price (EGP)</Label>
                <Input
                  type="number"
                  value={formData.originalPrice}
                  onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                  placeholder="0.00"
                />
              </div>
            </div>

            {/* Stock & Material */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Stock Quantity</Label>
                <Input
                  type="number"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  placeholder="0"
                />
              </div>
              <div className="space-y-2">
                <Label>Material</Label>
                <Input
                  value={formData.material}
                  onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                  placeholder="e.g., Premium Crepe"
                />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter product description..."
                rows={3}
              />
            </div>

            {/* Sizes */}
            <div className="space-y-2">
              <Label>Sizes (comma-separated)</Label>
              <Input
                value={formData.sizes.join(', ')}
                onChange={(e) => setFormData({ ...formData, sizes: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                placeholder="S/M, L/XL, Free Size"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
            <Button 
              onClick={handleSubmit} 
              disabled={!formData.name || !formData.price || isSubmitting}
              className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
            >
              {isSubmitting ? 'Saving...' : editProduct ? 'Update Product' : 'Add Product'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={!!deleteProductItem} onOpenChange={() => setDeleteProductItem(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Product</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{deleteProductItem?.name}&quot;? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteProductItem(null)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete} className="cursor-pointer">Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
