'use client';

import { useMemo } from 'react';
import { useStore } from '@/store/useStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  DollarSign,
  ShoppingBag,
  Users,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Package,
  UserPlus,
  CreditCard,
} from 'lucide-react';

const statusColor: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  processing: 'bg-blue-100 text-blue-800',
  shipped: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

const paymentBadge: Record<string, string> = {
  card: 'bg-slate-100 text-slate-700',
  cod: 'bg-amber-50 text-amber-700',
  digital_wallet: 'bg-emerald-50 text-emerald-700',
};

const channelData = [
  { name: 'Online Store', value: 68, color: '#3B82F6' },
  { name: 'Mobile App', value: 32, color: '#8B5CF6' },
];

const activityItems = [
  { id: 1, type: 'order', text: 'New order HAY-1012 from Rania El-Sayed', time: '2 minutes ago', icon: ShoppingBag, color: 'text-blue-600 bg-blue-50' },
  { id: 2, type: 'customer', text: 'New customer signup: Yasmin Qureshi', time: '15 minutes ago', icon: UserPlus, color: 'text-emerald-600 bg-emerald-50' },
  { id: 3, type: 'payment', text: 'Payment received for HAY-1011', time: '1 hour ago', icon: CreditCard, color: 'text-violet-600 bg-violet-50' },
  { id: 4, type: 'order', text: 'Order HAY-1011 shipped to Iman Bakri', time: '2 hours ago', icon: Package, color: 'text-purple-600 bg-purple-50' },
  { id: 5, type: 'order', text: 'New order HAY-1010 from Yasmin Qureshi', time: '3 hours ago', icon: ShoppingBag, color: 'text-blue-600 bg-blue-50' },
  { id: 6, type: 'customer', text: 'Aisha Rahman placed her 5th order', time: '5 hours ago', icon: UserPlus, color: 'text-emerald-600 bg-emerald-50' },
];

export default function DashboardOverview() {
  const adminOrders = useStore((s) => s.adminOrders);
  const adminCustomers = useStore((s) => s.adminCustomers);
  const analytics = useStore((s) => s.analytics);

  const stats = useMemo(() => {
    const totalRevenue = analytics.totalRevenue;
    const totalOrders = analytics.totalOrders;
    const totalCustomers = adminCustomers.filter((c) => c.status === 'active').length;
    const conversionRate = analytics.conversionRate;
    return { totalRevenue, totalOrders, totalCustomers, conversionRate };
  }, [adminOrders, adminCustomers, analytics]);

  const recentOrders = adminOrders.slice(0, 6);

  const topProducts = useMemo(() => {
    const productSales: Record<string, { name: string; sold: number; revenue: number }> = {};
    for (const order of adminOrders) {
      if (order.status === 'cancelled') continue;
      for (const pName of order.productNames) {
        if (!productSales[pName]) {
          productSales[pName] = { name: pName, sold: 0, revenue: 0 };
        }
        productSales[pName].sold += 1;
        productSales[pName].revenue += order.total / order.productNames.length;
      }
    }
    return Object.values(productSales)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);
  }, [adminOrders]);

  const statCards = [
    {
      label: 'Total Sales',
      value: `$${stats.totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
      change: '+12.5%',
      positive: true,
      icon: DollarSign,
      iconBg: 'bg-emerald-50',
      iconColor: 'text-emerald-600',
      period: 'from last week',
    },
    {
      label: 'Total Orders',
      value: stats.totalOrders.toLocaleString(),
      change: '+8.2%',
      positive: true,
      icon: ShoppingBag,
      iconBg: 'bg-blue-50',
      iconColor: 'text-blue-600',
      period: 'from last week',
    },
    {
      label: 'Total Customers',
      value: stats.totalCustomers.toLocaleString(),
      change: '+4.1%',
      positive: true,
      icon: Users,
      iconBg: 'bg-violet-50',
      iconColor: 'text-violet-600',
      period: 'from last week',
    },
    {
      label: 'Conversion Rate',
      value: `${stats.conversionRate}%`,
      change: '-0.3%',
      positive: false,
      icon: TrendingUp,
      iconBg: 'bg-orange-50',
      iconColor: 'text-orange-600',
      period: 'from last week',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <Card key={stat.label} className="border border-gray-200/60 shadow-sm">
            <CardContent className="pt-5 pb-4 px-5">
              <div className="flex items-center justify-between">
                <div className="min-w-0">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1.5 truncate">{stat.value}</p>
                </div>
                <div className={`size-11 rounded-xl ${stat.iconBg} flex items-center justify-center shrink-0`}>
                  <stat.icon className={`size-5 ${stat.iconColor}`} />
                </div>
              </div>
              <div className="flex items-center gap-1 mt-3">
                {stat.positive ? (
                  <ArrowUpRight className="size-3 text-emerald-500" />
                ) : (
                  <ArrowDownRight className="size-3 text-red-500" />
                )}
                <span className={`text-xs font-semibold ${stat.positive ? 'text-emerald-600' : 'text-red-600'}`}>
                  {stat.change}
                </span>
                <span className="text-xs text-gray-400">{stat.period}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Live Visitors Banner */}
      <Card className="border border-emerald-200/60 bg-emerald-50/30 shadow-sm">
        <CardContent className="pt-4 pb-4 px-5 flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
            </span>
            <Activity className="size-4 text-emerald-600" />
          </div>
          <p className="text-sm text-emerald-800 font-medium">
            <span className="font-bold">24 visitors</span> browsing your online store right now
          </p>
        </CardContent>
      </Card>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <Card className="lg:col-span-2 border border-gray-200/60 shadow-sm">
          <CardHeader className="pb-2 pt-5 px-5">
            <CardTitle className="text-base font-semibold text-gray-900">Revenue Overview</CardTitle>
            <p className="text-xs text-gray-500 mt-0.5">Last 14 days performance</p>
          </CardHeader>
          <CardContent className="px-5 pb-5">
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={analytics.revenue.slice(0, 7)}>
                  <defs>
                    <linearGradient id="dashRevenueGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.12} />
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                  <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}`} />
                  <Tooltip
                    contentStyle={{ borderRadius: '10px', border: '1px solid #e5e7eb', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', fontSize: '13px' }}
                    formatter={(value: number) => [`$${value.toLocaleString()}`, 'Revenue']}
                  />
                  <Area type="monotone" dataKey="amount" stroke="#3B82F6" strokeWidth={2.5} fill="url(#dashRevenueGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Sales by Channel */}
        <Card className="border border-gray-200/60 shadow-sm">
          <CardHeader className="pb-2 pt-5 px-5">
            <CardTitle className="text-base font-semibold text-gray-900">Sales by Channel</CardTitle>
            <p className="text-xs text-gray-500 mt-0.5">Online vs Mobile</p>
          </CardHeader>
          <CardContent className="px-5 pb-5 flex flex-col items-center justify-center">
            <div className="h-[180px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={channelData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={4}
                    dataKey="value"
                    strokeWidth={0}
                  >
                    {channelData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', fontSize: '13px' }}
                    formatter={(value: number) => [`${value}%`, 'Share']}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center gap-5 mt-2">
              {channelData.map((ch) => (
                <div key={ch.name} className="flex items-center gap-2">
                  <span className="size-2.5 rounded-full" style={{ backgroundColor: ch.color }} />
                  <div>
                    <p className="text-xs font-medium text-gray-700">{ch.name}</p>
                    <p className="text-sm font-bold text-gray-900">{ch.value}%</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <Card className="xl:col-span-2 border border-gray-200/60 shadow-sm">
          <CardHeader className="pb-2 pt-5 px-5">
            <CardTitle className="text-base font-semibold text-gray-900">Recent Orders</CardTitle>
            <p className="text-xs text-gray-500 mt-0.5">Latest orders from your store</p>
          </CardHeader>
          <CardContent className="px-0 pb-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs font-semibold text-gray-500 uppercase pl-5">Order #</TableHead>
                  <TableHead className="text-xs font-semibold text-gray-500 uppercase">Customer</TableHead>
                  <TableHead className="text-xs font-semibold text-gray-500 uppercase">Date</TableHead>
                  <TableHead className="text-xs font-semibold text-gray-500 uppercase">Total</TableHead>
                  <TableHead className="text-xs font-semibold text-gray-500 uppercase">Status</TableHead>
                  <TableHead className="text-xs font-semibold text-gray-500 uppercase pr-5">Payment</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentOrders.map((order) => (
                  <TableRow key={order.id} className="hover:bg-gray-50/50">
                    <TableCell className="font-medium text-gray-900 text-sm pl-5">{order.id}</TableCell>
                    <TableCell className="text-gray-600 text-sm">{order.customer}</TableCell>
                    <TableCell className="text-gray-500 text-xs">{order.date}</TableCell>
                    <TableCell className="font-medium text-gray-900 text-sm">
                      ${order.total.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${statusColor[order.status]}`}>
                        {order.status}
                      </span>
                    </TableCell>
                    <TableCell className="pr-5">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${paymentBadge[order.paymentMethod]}`}>
                        {order.paymentMethod === 'card' ? 'Card' : order.paymentMethod === 'cod' ? 'COD' : 'Wallet'}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="border border-gray-200/60 shadow-sm">
          <CardHeader className="pb-2 pt-5 px-5">
            <CardTitle className="text-base font-semibold text-gray-900">Recent Activity</CardTitle>
            <p className="text-xs text-gray-500 mt-0.5">Latest events in your store</p>
          </CardHeader>
          <CardContent className="px-5 pb-5">
            <div className="space-y-4 max-h-[360px] overflow-y-auto pr-1">
              {activityItems.map((activity, idx) => (
                <div key={activity.id} className="flex items-start gap-3">
                  <div className={`size-8 rounded-lg ${activity.color} flex items-center justify-center shrink-0 mt-0.5`}>
                    <activity.icon className="size-3.5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-gray-700 leading-snug">{activity.text}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{activity.time}</p>
                  </div>
                  {idx < activityItems.length - 1 && (
                    <div className="absolute left-[15px] top-[38px] w-px h-full bg-gray-200 hidden" />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
