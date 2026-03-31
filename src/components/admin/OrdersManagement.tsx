'use client';

import { useState, useMemo } from 'react';
import { useStore, type AdminOrder } from '@/store/useStore';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
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
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Search,
  ChevronRight,
  Package,
  User,
  Mail,
  CreditCard,
  Truck,
} from 'lucide-react';

const statusConfig: Record<AdminOrder['status'], { label: string; className: string }> = {
  pending: { label: 'Pending', className: 'bg-yellow-100 text-yellow-800' },
  processing: { label: 'Processing', className: 'bg-blue-100 text-blue-800' },
  shipped: { label: 'Shipped', className: 'bg-purple-100 text-purple-800' },
  delivered: { label: 'Delivered', className: 'bg-green-100 text-green-800' },
  cancelled: { label: 'Cancelled', className: 'bg-red-100 text-red-800' },
};

const paymentConfig: Record<string, { label: string; className: string }> = {
  card: { label: 'Card', className: 'bg-slate-100 text-slate-700' },
  cod: { label: 'COD', className: 'bg-amber-50 text-amber-700' },
  digital_wallet: { label: 'Digital Wallet', className: 'bg-emerald-50 text-emerald-700' },
};

export default function OrdersManagement() {
  const adminOrders = useStore((s) => s.adminOrders);
  const updateOrderStatus = useStore((s) => s.updateOrderStatus);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);

  const filteredOrders = useMemo(() => {
    return adminOrders.filter((o) => {
      const matchesSearch =
        o.id.toLowerCase().includes(search.toLowerCase()) ||
        o.customer.toLowerCase().includes(search.toLowerCase()) ||
        o.email.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === 'all' || o.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [adminOrders, search, statusFilter]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-gray-900">Orders</h2>
        <p className="text-sm text-gray-500 mt-0.5">
          {adminOrders.length} total orders
        </p>
      </div>

      {/* Filters */}
      <Card className="border-gray-100 shadow-sm">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
              <Input
                placeholder="Search orders..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="shipped">Shipped</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card className="border-gray-100 shadow-sm">
        <CardContent className="pt-6 px-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs font-semibold text-gray-500 uppercase">Order #</TableHead>
                  <TableHead className="text-xs font-semibold text-gray-500 uppercase">Customer</TableHead>
                  <TableHead className="text-xs font-semibold text-gray-500 uppercase">Email</TableHead>
                  <TableHead className="text-xs font-semibold text-gray-500 uppercase">Items</TableHead>
                  <TableHead className="text-xs font-semibold text-gray-500 uppercase">Total</TableHead>
                  <TableHead className="text-xs font-semibold text-gray-500 uppercase">Payment</TableHead>
                  <TableHead className="text-xs font-semibold text-gray-500 uppercase">Status</TableHead>
                  <TableHead className="text-xs font-semibold text-gray-500 uppercase">Date</TableHead>
                  <TableHead className="text-xs font-semibold text-gray-500 uppercase"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => {
                  const status = statusConfig[order.status];
                  const payment = paymentConfig[order.paymentMethod];
                  return (
                    <TableRow
                      key={order.id}
                      className="cursor-pointer"
                      onClick={() => setSelectedOrder(order)}
                    >
                      <TableCell className="font-medium text-gray-900">{order.id}</TableCell>
                      <TableCell className="text-gray-700">{order.customer}</TableCell>
                      <TableCell className="text-gray-500 text-sm">{order.email}</TableCell>
                      <TableCell className="text-gray-600">{order.items}</TableCell>
                      <TableCell className="font-medium text-gray-900">EGP {order.total.toLocaleString()}</TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${payment.className}`}>
                          {payment.label}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${status.className}`}>
                          {status.label}
                        </span>
                      </TableCell>
                      <TableCell className="text-gray-500 text-sm">{order.date}</TableCell>
                      <TableCell>
                        <ChevronRight className="size-4 text-gray-400" />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Order Detail Dialog */}
      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
            <DialogDescription>
              Detailed information for order {selectedOrder?.id}
            </DialogDescription>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-5 py-2">
              {/* Status & Payment */}
              <div className="flex items-center gap-3 flex-wrap">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium capitalize ${statusConfig[selectedOrder.status].className}`}>
                  {statusConfig[selectedOrder.status].label}
                </span>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${paymentConfig[selectedOrder.paymentMethod].className}`}>
                  {paymentConfig[selectedOrder.paymentMethod].label}
                </span>
                <div className="ml-auto flex items-center gap-2">
                  <label className="text-xs text-gray-500">Update Status:</label>
                  <Select
                    value={selectedOrder.status}
                    onValueChange={(v) => {
                      if (selectedOrder) {
                        updateOrderStatus(selectedOrder.id, v as AdminOrder['status']);
                        setSelectedOrder({ ...selectedOrder, status: v as AdminOrder['status'] });
                      }
                    }}
                  >
                    <SelectTrigger className="w-[150px] h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="processing">Processing</SelectItem>
                      <SelectItem value="shipped">Shipped</SelectItem>
                      <SelectItem value="delivered">Delivered</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Customer Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-lg bg-gray-50">
                <div className="flex items-center gap-2 text-sm">
                  <User className="size-4 text-gray-400" />
                  <span className="text-gray-500">Customer:</span>
                  <span className="font-medium text-gray-900">{selectedOrder.customer}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="size-4 text-gray-400" />
                  <span className="text-gray-500">Email:</span>
                  <span className="font-medium text-gray-900">{selectedOrder.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Package className="size-4 text-gray-400" />
                  <span className="text-gray-500">Items:</span>
                  <span className="font-medium text-gray-900">{selectedOrder.items}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CreditCard className="size-4 text-gray-400" />
                  <span className="text-gray-500">Total:</span>
                  <span className="font-bold text-gray-900">EGP {selectedOrder.total.toLocaleString()}</span>
                </div>
              </div>

              {/* Products */}
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-2">Products</h4>
                <div className="space-y-2">
                  {selectedOrder.productNames.map((name, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3 rounded-lg border border-gray-100"
                    >
                      <span className="text-sm text-gray-700">{name}</span>
                      <span className="text-sm font-medium text-gray-900">
                        EGP {Math.round(selectedOrder.total / selectedOrder.productNames.length).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Date */}
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Truck className="size-4 text-gray-400" />
                <span>Order placed on {selectedOrder.date}</span>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
