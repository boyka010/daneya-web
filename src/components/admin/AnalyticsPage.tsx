'use client';

import { useState } from 'react';
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
import { Button } from '@/components/ui/button';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  DollarSign,
  ShoppingCart,
  TrendingUp,
  Users,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
} from 'lucide-react';

const TRAFFIC_COLORS = ['#3B82F6', '#E1306C', '#4285F4', '#000000', '#9CA3AF'];

const dateRangeOptions = [
  { label: 'Last 7 days', value: '7d' },
  { label: 'Last 14 days', value: '14d' },
  { label: 'Last 30 days', value: '30d' },
  { label: 'Last 90 days', value: '90d' },
];

export default function AnalyticsPage() {
  const analytics = useStore((s) => s.analytics);
  const [dateRange, setDateRange] = useState('14d');

  const activeRange = dateRangeOptions.find((d) => d.value === dateRange) || dateRangeOptions[1];

  const revenueSlice = analytics.revenue.slice(0, parseInt(dateRange) || 14);
  const ordersSlice = analytics.orders.slice(0, parseInt(dateRange) || 14);
  const visitorsSlice = analytics.visitors.slice(0, parseInt(dateRange) || 14);

  const summaryCards = [
    {
      label: 'Total Revenue',
      value: `$${analytics.totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
      change: '+14.2%',
      positive: true,
      icon: DollarSign,
      iconBg: 'bg-emerald-50',
      iconColor: 'text-emerald-600',
    },
    {
      label: 'Avg Order Value',
      value: `$${analytics.avgOrderValue.toFixed(2)}`,
      change: '+3.1%',
      positive: true,
      icon: ShoppingCart,
      iconBg: 'bg-blue-50',
      iconColor: 'text-blue-600',
    },
    {
      label: 'Conversion Rate',
      value: `${analytics.conversionRate}%`,
      change: '-0.4%',
      positive: false,
      icon: TrendingUp,
      iconBg: 'bg-orange-50',
      iconColor: 'text-orange-600',
    },
    {
      label: 'Total Visitors',
      value: analytics.totalVisitors.toLocaleString(),
      change: '+9.7%',
      positive: true,
      icon: Users,
      iconBg: 'bg-violet-50',
      iconColor: 'text-violet-600',
    },
  ];

  const returningTotal = analytics.returningVsNew.returning + analytics.returningVsNew.new;
  const returningPct = ((analytics.returningVsNew.returning / returningTotal) * 100).toFixed(1);
  const newPct = ((analytics.returningVsNew.new / returningTotal) * 100).toFixed(1);

  const returningData = [
    { name: 'Returning', value: analytics.returningVsNew.returning, color: '#3B82F6' },
    { name: 'New', value: analytics.returningVsNew.new, color: '#E5E7EB' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Analytics</h2>
          <p className="text-sm text-gray-500 mt-0.5">Detailed performance metrics for your store</p>
        </div>
        <div className="flex items-center gap-1.5 bg-white border border-gray-200/60 rounded-lg p-1 shadow-sm">
          {dateRangeOptions.map((opt) => (
            <Button
              key={opt.value}
              variant={dateRange === opt.value ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setDateRange(opt.value)}
              className={`text-xs font-medium cursor-pointer ${
                dateRange === opt.value
                  ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              {opt.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryCards.map((stat) => (
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
                <span className="text-xs text-gray-400">vs previous period</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Revenue Chart */}
      <Card className="border border-gray-200/60 shadow-sm">
        <CardHeader className="pb-2 pt-5 px-5">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base font-semibold text-gray-900">Revenue</CardTitle>
              <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
                <Calendar className="size-3" />
                {activeRange.label}
              </p>
            </div>
            <p className="text-lg font-bold text-gray-900">${analytics.totalRevenue.toLocaleString()}</p>
          </div>
        </CardHeader>
        <CardContent className="px-5 pb-5">
          <div className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueSlice}>
                <defs>
                  <linearGradient id="analyticsRevenueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.15} />
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
                <Area type="monotone" dataKey="amount" stroke="#3B82F6" strokeWidth={2.5} fill="url(#analyticsRevenueGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Orders & Visitors Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Orders Chart */}
        <Card className="border border-gray-200/60 shadow-sm">
          <CardHeader className="pb-2 pt-5 px-5">
            <CardTitle className="text-base font-semibold text-gray-900">Orders</CardTitle>
            <p className="text-xs text-gray-500 mt-0.5">Orders per day</p>
          </CardHeader>
          <CardContent className="px-5 pb-5">
            <div className="h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={ordersSlice}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                  <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ borderRadius: '10px', border: '1px solid #e5e7eb', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', fontSize: '13px' }}
                    formatter={(value: number) => [value, 'Orders']}
                  />
                  <Bar dataKey="count" fill="#8B5CF6" radius={[6, 6, 0, 0]} barSize={28} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Visitors Chart */}
        <Card className="border border-gray-200/60 shadow-sm">
          <CardHeader className="pb-2 pt-5 px-5">
            <CardTitle className="text-base font-semibold text-gray-900">Visitors</CardTitle>
            <p className="text-xs text-gray-500 mt-0.5">Traffic per day</p>
          </CardHeader>
          <CardContent className="px-5 pb-5">
            <div className="h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={visitorsSlice}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                  <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ borderRadius: '10px', border: '1px solid #e5e7eb', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', fontSize: '13px' }}
                    formatter={(value: number) => [value.toLocaleString(), 'Visitors']}
                  />
                  <Line type="monotone" dataKey="count" stroke="#10B981" strokeWidth={2.5} dot={false} activeDot={{ r: 4, strokeWidth: 2, fill: '#10B981' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Products & Charts Row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Top Products */}
        <Card className="xl:col-span-2 border border-gray-200/60 shadow-sm">
          <CardHeader className="pb-2 pt-5 px-5">
            <CardTitle className="text-base font-semibold text-gray-900">Top Products</CardTitle>
            <p className="text-xs text-gray-500 mt-0.5">Best performing products by revenue</p>
          </CardHeader>
          <CardContent className="px-0 pb-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs font-semibold text-gray-500 uppercase pl-5">Product</TableHead>
                  <TableHead className="text-xs font-semibold text-gray-500 uppercase">Units Sold</TableHead>
                  <TableHead className="text-xs font-semibold text-gray-500 uppercase">Revenue</TableHead>
                  <TableHead className="text-xs font-semibold text-gray-500 uppercase pr-5">Conversion</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {analytics.topProducts.map((product, idx) => (
                  <TableRow key={product.name} className="hover:bg-gray-50/50">
                    <TableCell className="pl-5">
                      <div className="flex items-center gap-3">
                        <span className="size-7 rounded-lg bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500 shrink-0">
                          {idx + 1}
                        </span>
                        <span className="font-medium text-gray-900 text-sm">{product.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-600 text-sm">{product.sold}</TableCell>
                    <TableCell className="font-medium text-gray-900 text-sm">
                      ${product.revenue.toLocaleString()}
                    </TableCell>
                    <TableCell className="pr-5">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-blue-500 rounded-full"
                            style={{ width: `${Math.min((product.sold / 100) * 100, 100)}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-500">{(product.sold / analytics.totalVisitors * 100).toFixed(1)}%</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Sales by Location */}
        <Card className="border border-gray-200/60 shadow-sm">
          <CardHeader className="pb-2 pt-5 px-5">
            <CardTitle className="text-base font-semibold text-gray-900">Sales by Location</CardTitle>
            <p className="text-xs text-gray-500 mt-0.5">Top countries by orders</p>
          </CardHeader>
          <CardContent className="px-5 pb-5">
            <div className="space-y-4">
              {analytics.topCountries.map((country) => {
                const maxOrders = analytics.topCountries[0].orders;
                const width = (country.orders / maxOrders) * 100;
                return (
                  <div key={country.name}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm font-medium text-gray-700">{country.name}</span>
                      <span className="text-xs text-gray-500">{country.orders} orders</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500 rounded-full transition-all"
                        style={{ width: `${width}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-400 mt-1">${country.revenue.toLocaleString()}</p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Traffic Sources & Returning vs New */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Traffic Sources */}
        <Card className="border border-gray-200/60 shadow-sm">
          <CardHeader className="pb-2 pt-5 px-5">
            <CardTitle className="text-base font-semibold text-gray-900">Traffic Sources</CardTitle>
            <p className="text-xs text-gray-500 mt-0.5">Where your visitors come from</p>
          </CardHeader>
          <CardContent className="px-5 pb-5">
            <div className="flex items-center gap-6">
              <div className="h-[200px] w-[200px] shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={analytics.trafficSources}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={85}
                      paddingAngle={3}
                      dataKey="visits"
                      strokeWidth={0}
                    >
                      {analytics.trafficSources.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={TRAFFIC_COLORS[index % TRAFFIC_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', fontSize: '13px' }}
                      formatter={(value: number) => [value.toLocaleString(), 'Visits']}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-3 flex-1">
                {analytics.trafficSources.map((source, idx) => (
                  <div key={source.source} className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span
                        className="size-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: TRAFFIC_COLORS[idx % TRAFFIC_COLORS.length] }}
                      />
                      <span className="text-sm text-gray-700">{source.source}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-semibold text-gray-900">{source.percentage}%</span>
                      <span className="text-xs text-gray-400 ml-1.5">({source.visits.toLocaleString()})</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Returning vs New */}
        <Card className="border border-gray-200/60 shadow-sm">
          <CardHeader className="pb-2 pt-5 px-5">
            <CardTitle className="text-base font-semibold text-gray-900">Returning vs New Customers</CardTitle>
            <p className="text-xs text-gray-500 mt-0.5">Customer acquisition overview</p>
          </CardHeader>
          <CardContent className="px-5 pb-5">
            <div className="flex items-center gap-6">
              <div className="h-[200px] w-[200px] shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={returningData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={85}
                      paddingAngle={4}
                      dataKey="value"
                      strokeWidth={0}
                    >
                      {returningData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', fontSize: '13px' }}
                      formatter={(value: number) => [value.toLocaleString(), 'Customers']}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-5 flex-1">
                <div>
                  <p className="text-sm text-gray-500">Returning Customers</p>
                  <p className="text-2xl font-bold text-gray-900">{analytics.returningVsNew.returning.toLocaleString()}</p>
                  <p className="text-sm font-semibold text-blue-600 mt-0.5">{returningPct}%</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">New Customers</p>
                  <p className="text-2xl font-bold text-gray-900">{analytics.returningVsNew.new.toLocaleString()}</p>
                  <p className="text-sm font-semibold text-gray-400 mt-0.5">{newPct}%</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
