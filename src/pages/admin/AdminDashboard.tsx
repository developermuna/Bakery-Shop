import React, { useState } from 'react';
import {
  Lock,
  Package,
  ShoppingBag,
  Calendar,
  Clock,
  Plus,
  Search,
  Edit2,
  LogOut,
  AlertCircle,
} from 'lucide-react';
import { MOCK_PRODUCTS } from '../../data/products';
import { formatCurrency, STANDARD_PICKUP_SLOTS } from '../../utils/cartUtils';
import type { Product } from '../../data/products';

interface StaffOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  itemsSummary: string;
  pickupDate: string;
  pickupTime: string;
  total: number;
  status: 'New' | 'Confirmed' | 'Baking' | 'Ready for Pickup' | 'Collected' | 'Cancelled';
  notes?: string;
  createdAt: string;
}

const INITIAL_ORDERS: StaffOrder[] = [
  {
    id: 'ord_1',
    orderNumber: 'MK-849201',
    customerName: 'Sophia Reynolds',
    customerPhone: '(555) 349-2819',
    customerEmail: 'sophia@example.com',
    itemsSummary: '1x Vanilla Bean Cloud Cake (8 inch, Vanilla Raspberry, Msg: "Happy Birthday Sophia!")',
    pickupDate: '2026-08-22',
    pickupTime: '10:00 AM - 11:00 AM',
    total: 92.01,
    status: 'Baking',
    notes: 'Please pack in luxury presentation box.',
    createdAt: '2026-08-20T14:30:00Z',
  },
  {
    id: 'ord_2',
    orderNumber: 'MK-849202',
    customerName: 'Marcus Vance',
    customerPhone: '(555) 782-9012',
    customerEmail: 'marcus@example.com',
    itemsSummary: '1x Dark Chocolate Truffle (6 inch, Gluten-Free)',
    pickupDate: '2026-08-22',
    pickupTime: '11:00 AM - 12:00 PM',
    total: 81.18,
    status: 'Ready for Pickup',
    createdAt: '2026-08-20T15:10:00Z',
  },
  {
    id: 'ord_3',
    orderNumber: 'MK-849203',
    customerName: 'Elena Rostova',
    customerPhone: '(555) 902-1823',
    customerEmail: 'elena@example.com',
    itemsSummary: '2x Pistachio Rose Tart (8 inch Tart)',
    pickupDate: '2026-08-23',
    pickupTime: '02:00 PM - 03:00 PM',
    total: 97.42,
    status: 'New',
    createdAt: '2026-08-20T16:05:00Z',
  },
];

export const AdminDashboard: React.FC = () => {
  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinCode, setPinCode] = useState('');
  const [loginError, setLoginError] = useState('');

  // Dashboard navigation
  const [activeTab, setActiveTab] = useState<'orders' | 'products' | 'availability'>('orders');

  // Orders State
  const [orders, setOrders] = useState<StaffOrder[]>(INITIAL_ORDERS);
  const [orderFilter, setOrderFilter] = useState<string>('All');

  // Products State
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [productSearch, setProductSearch] = useState('');

  // Availability State (Marking dates / slots blocked)
  const [blockedSlots, setBlockedSlots] = useState<string[]>(['Saturday_11:00 AM - 12:00 PM']);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinCode === 'bakery2026' || pinCode === 'admin') {
      setIsAuthenticated(true);
      setLoginError('');
    } else {
      setLoginError('Invalid staff authorization PIN. (Try "admin" or "bakery2026")');
    }
  };

  const handleUpdateOrderStatus = (orderId: string, newStatus: StaffOrder['status']) => {
    setOrders((prev) =>
      prev.map((ord) => (ord.id === orderId ? { ...ord, status: newStatus } : ord))
    );
  };

  const handleToggleProductStatus = (productId: string) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, active: !p.active } : p))
    );
  };

  const handleToggleProductStock = (productId: string) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, inStock: !p.inStock } : p))
    );
  };

  const toggleSlotBlock = (key: string) => {
    setBlockedSlots((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  // Staff Login Screen
  if (!isAuthenticated) {
    return (
      <div className="pt-32 pb-24 bg-cream min-h-screen flex items-center justify-center px-4">
        <div className="bg-off-white border border-beige rounded-3xl p-8 max-w-md w-full shadow-soft text-center space-y-6">
          <div className="w-16 h-16 bg-espresso text-cream rounded-3xl flex items-center justify-center mx-auto shadow-sm">
            <Lock className="w-8 h-8 text-gold" />
          </div>

          <div>
            <h2 className="text-2xl font-serif font-bold text-espresso">Bakery Staff Portal</h2>
            <p className="text-xs text-brown font-light mt-1">
              Internal operations dashboard for kitchen staff and order fulfillment.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-semibold text-espresso mb-1">
                Enter Staff Access PIN
              </label>
              <input
                type="password"
                value={pinCode}
                onChange={(e) => setPinCode(e.target.value)}
                placeholder="PIN (e.g. admin)"
                className="w-full bg-cream border border-beige rounded-2xl px-4 py-3 text-sm text-espresso focus:outline-none focus:border-gold tracking-widest text-center font-mono"
              />
            </div>

            {loginError && (
              <p className="text-xs text-red-600 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{loginError}</span>
              </p>
            )}

            <button
              type="submit"
              className="w-full py-3.5 bg-espresso text-cream rounded-full font-semibold text-xs uppercase tracking-wider hover:bg-espresso/90 transition-colors shadow-soft"
            >
              Sign In to Staff Dashboard
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-28 pb-24 bg-cream min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
        {/* Dashboard Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-beige gap-4 mb-8">
          <div>
            <span className="text-xs uppercase tracking-widest text-gold font-bold block">
              MK Bakery & Sweets • Operations
            </span>
            <h1 className="text-3xl font-serif font-bold text-espresso">
              Staff Operations Portal
            </h1>
          </div>

          <div className="flex items-center space-x-3">
            {/* Navigation Tabs */}
            <div className="flex bg-off-white p-1 rounded-full border border-beige text-xs font-semibold">
              <button
                onClick={() => setActiveTab('orders')}
                className={`px-4 py-2 rounded-full transition-all flex items-center space-x-1.5 ${
                  activeTab === 'orders'
                    ? 'bg-espresso text-cream shadow-xs'
                    : 'text-brown hover:text-espresso'
                }`}
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Live Orders ({orders.length})</span>
              </button>
              <button
                onClick={() => setActiveTab('products')}
                className={`px-4 py-2 rounded-full transition-all flex items-center space-x-1.5 ${
                  activeTab === 'products'
                    ? 'bg-espresso text-cream shadow-xs'
                    : 'text-brown hover:text-espresso'
                }`}
              >
                <Package className="w-3.5 h-3.5" />
                <span>Products & Stock</span>
              </button>
              <button
                onClick={() => setActiveTab('availability')}
                className={`px-4 py-2 rounded-full transition-all flex items-center space-x-1.5 ${
                  activeTab === 'availability'
                    ? 'bg-espresso text-cream shadow-xs'
                    : 'text-brown hover:text-espresso'
                }`}
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Capacity Manager</span>
              </button>
            </div>

            <button
              onClick={() => setIsAuthenticated(false)}
              className="p-2.5 rounded-full border border-beige hover:bg-beige/40 text-brown hover:text-espresso transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* TAB 1: LIVE ORDERS PIPELINE */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            {/* Filter Status Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              {['All', 'New', 'Confirmed', 'Baking', 'Ready for Pickup', 'Collected', 'Cancelled'].map(
                (status) => (
                  <button
                    key={status}
                    onClick={() => setOrderFilter(status)}
                    className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                      orderFilter === status
                        ? 'bg-espresso text-cream'
                        : 'bg-off-white border border-beige text-brown hover:border-gold/50'
                    }`}
                  >
                    {status}
                  </button>
                )
              )}
            </div>

            {/* Orders Table / Cards */}
            <div className="space-y-4">
              {orders
                .filter((o) => (orderFilter === 'All' ? true : o.status === orderFilter))
                .map((order) => (
                  <div
                    key={order.id}
                    className="bg-off-white border border-beige rounded-3xl p-6 shadow-soft space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-beige gap-3">
                      <div className="flex items-center space-x-3">
                        <span className="font-mono font-bold text-espresso text-base">
                          #{order.orderNumber}
                        </span>
                        <span className="text-xs font-semibold text-espresso">
                          {order.customerName}
                        </span>
                        <span className="text-xs text-brown font-light">
                          ({order.customerPhone})
                        </span>
                      </div>

                      <div className="flex items-center space-x-3">
                        <span className="text-xs font-serif font-bold text-espresso">
                          {formatCurrency(order.total)}
                        </span>

                        {/* Status Changer Select */}
                        <select
                          value={order.status}
                          onChange={(e) =>
                            handleUpdateOrderStatus(order.id, e.target.value as any)
                          }
                          className={`text-xs font-bold px-3 py-1.5 rounded-full border focus:outline-none ${
                            order.status === 'Baking'
                              ? 'bg-gold/20 text-espresso border-gold/40'
                              : order.status === 'Ready for Pickup'
                              ? 'bg-green-100 text-green-800 border-green-300'
                              : order.status === 'Collected'
                              ? 'bg-beige text-brown border-beige'
                              : 'bg-cream text-espresso border-beige'
                          }`}
                        >
                          <option value="New">New Order</option>
                          <option value="Confirmed">Confirmed</option>
                          <option value="Baking">Baking in Kitchen</option>
                          <option value="Ready for Pickup">Ready for Pickup</option>
                          <option value="Collected">Collected by Customer</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 text-xs">
                      <div className="md:col-span-8 space-y-1">
                        <span className="text-brown block font-medium">Order Items:</span>
                        <p className="text-espresso font-light">{order.itemsSummary}</p>
                        {order.notes && (
                          <p className="text-gold italic pt-1">Notes: “{order.notes}”</p>
                        )}
                      </div>

                      <div className="md:col-span-4 bg-cream p-3 rounded-2xl border border-beige space-y-1">
                        <div className="flex items-center space-x-1.5 text-espresso font-semibold">
                          <Calendar className="w-3.5 h-3.5 text-gold" />
                          <span>Pickup: {order.pickupDate}</span>
                        </div>
                        <div className="flex items-center space-x-1.5 text-brown">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{order.pickupTime}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* TAB 2: PRODUCT CATALOG MANAGEMENT */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between gap-4 items-stretch sm:items-center">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-brown/50 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  placeholder="Filter inventory..."
                  className="w-full bg-off-white border border-beige rounded-full pl-10 pr-4 py-2.5 text-xs text-espresso focus:outline-none focus:border-gold"
                />
              </div>

              <button
                onClick={() => alert('New product form modal: Connects to Cloudflare R2 Worker API.')}
                className="px-6 py-2.5 bg-espresso text-cream rounded-full text-xs font-semibold hover:bg-espresso/90 transition-colors flex items-center space-x-1.5 shadow-soft"
              >
                <Plus className="w-4 h-4 text-gold" />
                <span>Add New Cake Item</span>
              </button>
            </div>

            {/* Products Table */}
            <div className="bg-off-white border border-beige rounded-3xl overflow-hidden shadow-soft">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-beige/60 text-espresso font-serif font-bold uppercase tracking-wider text-[10px] border-b border-beige">
                    <tr>
                      <th className="p-4">Cake Item</th>
                      <th className="p-4">Categories</th>
                      <th className="p-4">Base Price</th>
                      <th className="p-4">Lead Time</th>
                      <th className="p-4">Catalog Status</th>
                      <th className="p-4">Kitchen Stock</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-beige">
                    {products
                      .filter((p) =>
                        p.name.toLowerCase().includes(productSearch.toLowerCase())
                      )
                      .map((product) => (
                        <tr key={product.id} className="hover:bg-cream/40 transition-colors">
                          <td className="p-4 flex items-center space-x-3">
                            <img
                              src={product.imageUuids[0]}
                              alt={product.name}
                              className="w-10 h-10 object-cover rounded-xl border border-beige flex-shrink-0"
                            />
                            <div>
                              <span className="font-bold text-espresso block">{product.name}</span>
                              <span className="text-[11px] text-brown">{product.sizes.length} sizes configured</span>
                            </div>
                          </td>
                          <td className="p-4 text-brown">{product.categories.join(', ')}</td>
                          <td className="p-4 font-bold text-espresso font-serif">
                            {formatCurrency(product.price)}
                          </td>
                          <td className="p-4 text-brown">{product.preparationLeadTimeHours}h notice</td>
                          <td className="p-4">
                            <button
                              onClick={() => handleToggleProductStatus(product.id)}
                              className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                product.active
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-red-100 text-red-800'
                              }`}
                            >
                              {product.active ? 'Active' : 'Hidden'}
                            </button>
                          </td>
                          <td className="p-4">
                            <button
                              onClick={() => handleToggleProductStock(product.id)}
                              className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                product.inStock
                                  ? 'bg-gold/20 text-espresso'
                                  : 'bg-red-100 text-red-800'
                              }`}
                            >
                              {product.inStock ? 'In Stock' : 'Sold Out'}
                            </button>
                          </td>
                          <td className="p-4 text-right">
                            <div className="flex items-center justify-end space-x-2">
                              <button
                                className="p-1.5 text-brown hover:text-espresso rounded"
                                title="Edit Product"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: CAPACITY & PICKUP AVAILABILITY */}
        {activeTab === 'availability' && (
          <div className="bg-off-white border border-beige rounded-3xl p-6 sm:p-8 shadow-soft space-y-6">
            <div>
              <h2 className="text-xl font-serif font-bold text-espresso">
                Bakery Capacity & Slot Booking Controls
              </h2>
              <p className="text-xs text-brown font-light mt-1">
                Toggle unavailable pickup time slots during kitchen rush hours or kitchen maintenance days.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-serif font-bold text-espresso">
                Standard Daily Pickup Slots
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {STANDARD_PICKUP_SLOTS.map((slot) => {
                  const isBlocked = blockedSlots.includes(slot);
                  return (
                    <div
                      key={slot}
                      onClick={() => toggleSlotBlock(slot)}
                      className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                        isBlocked
                          ? 'bg-red-50/80 border-red-200 text-red-900'
                          : 'bg-cream border-beige text-espresso hover:border-gold'
                      }`}
                    >
                      <div>
                        <span className="text-xs font-semibold block">{slot}</span>
                        <span className="text-[10px] text-brown font-light">
                          {isBlocked ? 'Blocked for Booking' : 'Open for Customer Pickup'}
                        </span>
                      </div>

                      <span
                        className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                          isBlocked ? 'bg-red-200 text-red-900' : 'bg-gold/20 text-espresso'
                        }`}
                      >
                        {isBlocked ? 'Blocked' : 'Available'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
