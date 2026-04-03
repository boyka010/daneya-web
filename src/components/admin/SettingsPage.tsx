'use client';

import { useState } from 'react';
import { useStore } from '@/store/useStore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Store,
  Truck,
  CreditCard,
  Bell,
  Save,
  Globe,
  Palette,
  ImageIcon,
  Monitor,
  Package,
  ShoppingBag,
  ExternalLink,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';

export default function SettingsPage() {
  const adminSettings = useStore((s) => s.adminSettings);
  const updateAdminSettings = useStore((s) => s.updateAdminSettings);
  const activeTheme = useStore((s) => s.activeTheme);
  const setAdminSection = useStore((s) => s.setAdminSection);

  const [localSettings, setLocalSettings] = useState({ ...adminSettings });
  const [saved, setSaved] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  const handleSave = () => {
    updateAdminSettings(localSettings);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const testShopifyConnection = async () => {
    if (!localSettings.shopifyStoreDomain || !localSettings.shopifyAccessToken) {
      setTestResult({ success: false, message: 'Please enter your Shopify store domain and access token' });
      return;
    }

    setTesting(true);
    setTestResult(null);

    try {
      const response = await fetch(`/api/shopify/test?domain=${localSettings.shopifyStoreDomain}&token=${localSettings.shopifyAccessToken}`);
      const data = await response.json();
      
      if (data.success) {
        setTestResult({ success: true, message: 'Connection successful! Shopify store is connected.' });
      } else {
        setTestResult({ success: false, message: data.message || 'Failed to connect to Shopify' });
      }
    } catch (error) {
      setTestResult({ success: false, message: 'Error connecting to Shopify' });
    } finally {
      setTesting(false);
    }
  };

  const goToThemes = () => {
    setAdminSection('themes');
    window.location.hash = '#/admin/themes';
  };

  const isShopifyConfigured = localSettings.shopifyStoreDomain && localSettings.shopifyAccessToken;

  return (
    <div className="space-y-6 max-w-3xl">
      {saved && (
        <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2">
          <Save size={16} />
          Settings saved successfully!
        </div>
      )}

      <div>
        <h2 className="text-xl font-bold text-gray-900">Settings</h2>
        <p className="text-sm text-gray-500 mt-0.5">Manage your store configuration</p>
      </div>

      {/* Shopify Integration */}
      <Card className="border border-gray-200/60 shadow-sm">
        <CardHeader>
          <div className="flex items-center gap-2.5">
            <div className="size-9 rounded-lg bg-green-50 flex items-center justify-center">
              <ShoppingBag className="size-4 text-green-600" />
            </div>
            <div>
              <CardTitle className="text-base font-semibold text-gray-900">Shopify Integration</CardTitle>
              <CardDescription className="text-xs text-gray-500">Connect your Shopify store for product syncing</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Shopify Store Domain</Label>
            <Input
              value={localSettings.shopifyStoreDomain}
              onChange={(e) => setLocalSettings({ ...localSettings, shopifyStoreDomain: e.target.value })}
              placeholder="your-store.myshopify.com"
            />
            <p className="text-xs text-gray-400">Enter your Shopify store domain without https://</p>
          </div>
          <div className="space-y-2">
            <Label>Storefront Access Token</Label>
            <Input
              type="password"
              value={localSettings.shopifyAccessToken}
              onChange={(e) => setLocalSettings({ ...localSettings, shopifyAccessToken: e.target.value })}
              placeholder="shpat_xxxxxxxxxxxxxxxxxxxxx"
            />
            <p className="text-xs text-gray-400">
              Get this from your Shopify admin: Apps → Headless → Create storefront access token
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={testShopifyConnection}
              disabled={testing || !isShopifyConfigured}
              className="gap-2"
            >
              {testing ? 'Testing...' : 'Test Connection'}
            </Button>
            {testResult && (
              <div className={`flex items-center gap-2 text-sm ${testResult.success ? 'text-green-600' : 'text-red-600'}`}>
                {testResult.success ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
                {testResult.message}
              </div>
            )}
          </div>
          <div className="pt-2">
            <a 
              href="https://shopify.dev/docs/api/storefront" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-blue-600 hover:underline"
            >
              <ExternalLink size={12} />
              Learn about Shopify Storefront API
            </a>
          </div>
          {isShopifyConfigured && (
            <div className="rounded-lg bg-green-50 border border-green-200 p-3 mt-2">
              <div className="flex items-center gap-2">
                <CheckCircle className="size-4 text-green-600" />
                <span className="text-sm text-green-700">Shopify is connected - Products will sync from Shopify</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Store Settings */}
      <Card className="border border-gray-200/60 shadow-sm">
        <CardHeader>
          <div className="flex items-center gap-2.5">
            <div className="size-9 rounded-lg bg-blue-50 flex items-center justify-center">
              <Store className="size-4 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-base font-semibold text-gray-900">Store Settings</CardTitle>
              <CardDescription className="text-xs text-gray-500">Basic information about your store</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Store Name</Label>
              <Input
                value={localSettings.storeName}
                onChange={(e) => setLocalSettings({ ...localSettings, storeName: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Store Email</Label>
              <Input
                type="email"
                value={localSettings.storeEmail}
                onChange={(e) => setLocalSettings({ ...localSettings, storeEmail: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Phone</Label>
              <Input
                value={localSettings.storePhone}
                onChange={(e) => setLocalSettings({ ...localSettings, storePhone: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Currency</Label>
              <Select
                value={localSettings.currency}
                onValueChange={(val) => setLocalSettings({ ...localSettings, currency: val })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Currency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="EGP">EGP — Egyptian Pound</SelectItem>
                  <SelectItem value="USD">USD — US Dollar</SelectItem>
                  <SelectItem value="EUR">EUR — Euro</SelectItem>
                  <SelectItem value="GBP">GBP — British Pound</SelectItem>
                  <SelectItem value="AED">AED — UAE Dirham</SelectItem>
                  <SelectItem value="SAR">SAR — Saudi Riyal</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Address</Label>
            <Input
              value={localSettings.storeAddress}
              onChange={(e) => setLocalSettings({ ...localSettings, storeAddress: e.target.value })}
            />
          </div>
        </CardContent>
      </Card>

      {/* Language Settings */}
      <Card className="border border-gray-200/60 shadow-sm">
        <CardHeader>
          <div className="flex items-center gap-2.5">
            <div className="size-9 rounded-lg bg-indigo-50 flex items-center justify-center">
              <Globe className="size-4 text-indigo-600" />
            </div>
            <div>
              <CardTitle className="text-base font-semibold text-gray-900">Language</CardTitle>
              <CardDescription className="text-xs text-gray-500">Set your storefront language</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Store Language</Label>
            <Select
              value={localSettings.language}
              onValueChange={(val) => setLocalSettings({ ...localSettings, language: val })}
            >
              <SelectTrigger className="w-full sm:w-[240px]">
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="ar">العربية (Arabic)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Shipping Settings */}
      <Card className="border border-gray-200/60 shadow-sm">
        <CardHeader>
          <div className="flex items-center gap-2.5">
            <div className="size-9 rounded-lg bg-violet-50 flex items-center justify-center">
              <Truck className="size-4 text-violet-600" />
            </div>
            <div>
              <CardTitle className="text-base font-semibold text-gray-900">Shipping Settings</CardTitle>
              <CardDescription className="text-xs text-gray-500">Configure shipping rates and options</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Standard Shipping (EGP)</Label>
              <Input
                type="number"
                value={localSettings.standardShipping}
                onChange={(e) =>
                  setLocalSettings({ ...localSettings, standardShipping: parseFloat(e.target.value) || 0 })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Express Shipping (EGP)</Label>
              <Input
                type="number"
                value={localSettings.expressShipping}
                onChange={(e) =>
                  setLocalSettings({ ...localSettings, expressShipping: parseFloat(e.target.value) || 0 })
                }
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Free Shipping Threshold (EGP)</Label>
            <Input
              type="number"
              value={localSettings.freeShippingThreshold}
              onChange={(e) =>
                setLocalSettings({ ...localSettings, freeShippingThreshold: parseFloat(e.target.value) || 0 })
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Payment Settings */}
      <Card className="border border-gray-200/60 shadow-sm">
        <CardHeader>
          <div className="flex items-center gap-2.5">
            <div className="size-9 rounded-lg bg-emerald-50 flex items-center justify-center">
              <CreditCard className="size-4 text-emerald-600" />
            </div>
            <div>
              <CardTitle className="text-base font-semibold text-gray-900">Payment Methods</CardTitle>
              <CardDescription className="text-xs text-gray-500">Enable or disable payment methods</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">Credit / Debit Card</p>
              <p className="text-xs text-gray-500">Accept Visa, Mastercard, Amex</p>
            </div>
            <Switch
              checked={localSettings.enableCard}
              onCheckedChange={(checked) =>
                setLocalSettings({ ...localSettings, enableCard: checked })
              }
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">Digital Wallet</p>
              <p className="text-xs text-gray-500">Apple Pay, Google Pay, etc.</p>
            </div>
            <Switch
              checked={localSettings.enableDigitalWallet}
              onCheckedChange={(checked) =>
                setLocalSettings({ ...localSettings, enableDigitalWallet: checked })
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card className="border border-gray-200/60 shadow-sm">
        <CardHeader>
          <div className="flex items-center gap-2.5">
            <div className="size-9 rounded-lg bg-amber-50 flex items-center justify-center">
              <Bell className="size-4 text-amber-600" />
            </div>
            <div>
              <CardTitle className="text-base font-semibold text-gray-900">Notification Settings</CardTitle>
              <CardDescription className="text-xs text-gray-500">Manage email notifications</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">Order Notifications</p>
              <p className="text-xs text-gray-500">Get notified when a new order is placed</p>
            </div>
            <Switch
              checked={localSettings.orderNotifications}
              onCheckedChange={(checked) =>
                setLocalSettings({ ...localSettings, orderNotifications: checked })
              }
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">Shipping Updates</p>
              <p className="text-xs text-gray-500">Notify customers about shipping status</p>
            </div>
            <Switch
              checked={localSettings.shippingUpdates}
              onCheckedChange={(checked) =>
                setLocalSettings({ ...localSettings, shippingUpdates: checked })
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Theme Display */}
      <Card className="border border-gray-200/60 shadow-sm">
        <CardHeader>
          <div className="flex items-center gap-2.5">
            <div className="size-9 rounded-lg bg-purple-50 flex items-center justify-center">
              <Palette className="size-4 text-purple-600" />
            </div>
            <div>
              <CardTitle className="text-base font-semibold text-gray-900">Theme</CardTitle>
              <CardDescription className="text-xs text-gray-500">Currently active storefront theme</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex gap-1.5">
                <div className="w-6 h-6 rounded-full border border-gray-200" style={{ backgroundColor: activeTheme.colors.background }} />
                <div className="w-6 h-6 rounded-full border border-gray-200" style={{ backgroundColor: activeTheme.colors.primary }} />
                <div className="w-6 h-6 rounded-full border border-gray-200" style={{ backgroundColor: activeTheme.colors.accent }} />
                <div className="w-6 h-6 rounded-full border border-gray-200" style={{ backgroundColor: activeTheme.colors.cta }} />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">{activeTheme.name}</p>
                <p className="text-xs text-gray-400">{activeTheme.description}</p>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={goToThemes}
              className="gap-2 cursor-pointer"
            >
              <Palette className="size-3.5" />
              Change Theme
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end pb-6">
        <Button
          onClick={handleSave}
          className={`gap-2 min-w-[140px] cursor-pointer ${
            saved
              ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          <Save className="size-4" />
          {saved ? 'Saved!' : 'Save Changes'}
        </Button>
      </div>
    </div>
  );
}
