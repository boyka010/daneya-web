'use client';

import { useState, useMemo } from 'react';
import { useStore, type AdminCustomer } from '@/store/useStore';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Search } from 'lucide-react';

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

const colors = [
  'bg-blue-500',
  'bg-emerald-500',
  'bg-violet-500',
  'bg-rose-500',
  'bg-amber-500',
  'bg-cyan-500',
  'bg-pink-500',
  'bg-indigo-500',
  'bg-teal-500',
  'bg-orange-500',
];

export default function CustomersManagement() {
  const adminCustomers = useStore((s) => s.adminCustomers);
  const [search, setSearch] = useState('');

  const filteredCustomers = useMemo(() => {
    if (!search) return adminCustomers;
    const q = search.toLowerCase();
    return adminCustomers.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q)
    );
  }, [adminCustomers, search]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-gray-900">Customers</h2>
        <p className="text-sm text-gray-500 mt-0.5">
          {adminCustomers.length} total customers
        </p>
      </div>

      {/* Search */}
      <Card className="border-gray-100 shadow-sm">
        <CardContent className="pt-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
            <Input
              placeholder="Search customers..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
        </CardContent>
      </Card>

      {/* Customers Table */}
      <Card className="border-gray-100 shadow-sm">
        <CardContent className="pt-6 px-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs font-semibold text-gray-500 uppercase">Customer</TableHead>
                  <TableHead className="text-xs font-semibold text-gray-500 uppercase">Email</TableHead>
                  <TableHead className="text-xs font-semibold text-gray-500 uppercase">Orders</TableHead>
                  <TableHead className="text-xs font-semibold text-gray-500 uppercase">Total Spent</TableHead>
                  <TableHead className="text-xs font-semibold text-gray-500 uppercase">Joined</TableHead>
                  <TableHead className="text-xs font-semibold text-gray-500 uppercase">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCustomers.map((customer, idx) => {
                  const isActive = customer.status === 'active';
                  return (
                    <TableRow key={customer.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div
                            className={`size-9 rounded-full ${colors[idx % colors.length]} flex items-center justify-center text-white text-xs font-bold shrink-0`}
                          >
                            {getInitials(customer.name)}
                          </div>
                          <span className="font-medium text-gray-900 text-sm">{customer.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-500 text-sm">{customer.email}</TableCell>
                      <TableCell className="text-gray-700 font-medium">{customer.orders}</TableCell>
                      <TableCell className="font-medium text-gray-900">
                        ${customer.totalSpent.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-gray-500 text-sm">{customer.joined}</TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            isActive
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-500'
                          }`}
                        >
                          {isActive ? 'Active' : 'Inactive'}
                        </span>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
