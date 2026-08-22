import React, { useState } from 'react';
import {
  Package,
  ShoppingBag,
  Calendar,
  Clock,
  Plus,
  Search,
  Edit2,
  LogOut,
  AlertCircle,
  TrendingUp,
  X,
  CheckCircle,
} from 'lucide-react';
import { MOCK_PRODUCTS } from '../../data/products';
import { formatCurrency, STANDARD_PICKUP_SLOTS } from '../../utils/cartUtils';
import type { Product } from '../../data/products';
import { useOrderStore } from '../../store/useOrderStore';
import type { Order } from '../../store/useOrderStore';

export const AdminDashboard: React.FC = () => {
  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Dashboard navigation
  const [activeTab, setActiveTab] = useState<'revenue' | 'orders' | 'products' | 'availability'>('revenue');

  // Orders State
  const orders = useOrderStore((state) => state.orders);
  const updateOrderStatusGlobal = useOrderStore((state) => state.updateOrderStatus);
  
  const [orderFilter, setOrderFilter] = useState<string>('All');

  // Products State
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [productSearch, setProductSearch] = useState('');
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    name: '',
    price: 0,
    shortDescription: '',
    categories: ['cakes'], // default category
    catalog: 'cakes',
    preparationLeadTimeHours: 24,
    active: true,
    inStock: true,
    imageUuids: ['https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=600'],
    sizes: [{ label: 'Standard', price: 0, servings: '8-10' }]
  });

  // Availability State (Marking dates / slots blocked)
  const [blockedSlots, setBlockedSlots] = useState<string[]>(['Saturday_11:00 AM - 12:00 PM']);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'admin' && password === 'admin123') {
      setIsAuthenticated(true);
      setLoginError('');
    } else {
      setLoginError('Invalid username or password.');
    }
  };

  const handleUpdateOrderStatus = (orderId: string, newStatus: Order['status']) => {
    updateOrderStatusGlobal(orderId, newStatus);
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

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.price) return;

    const addedProduct: Product = {
      ...(newProduct as Product),
      id: `prod-${Date.now()}`,
      slug: newProduct.name?.toLowerCase().replace(/\s+/g, '-') || `prod-${Date.now()}`,
      description: newProduct.shortDescription || '',
      allergens: [],
      dietaryTags: [],
      ingredients: [],
      featured: false,
      seasonal: false,
      rating: 5.0,
      reviewsCount: 1,
      storageGuidance: 'Keep refrigerated',
      sizes: [{ label: 'Standard', price: newProduct.price || 0, servings: '8-10' }]
    };

    setProducts(prev => [addedProduct, ...prev]);
    setIsAddingProduct(false);
    setNewProduct({
      name: '', price: 0, shortDescription: '', categories: ['cakes'], catalog: 'cakes', preparationLeadTimeHours: 24, active: true, inStock: true, imageUuids: ['https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=600'], sizes: [{ label: 'Standard', price: 0, servings: '8-10' }]
    });
  };

  const toggleSlotBlock = (key: string) => {
    setBlockedSlots((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  // Staff Login Screen
  if (!isAuthenticated) {
    return (
      <div className="pt-32 pb-24 bg-bento-bg min-h-screen flex items-center justify-center px-4">
        <div className="bg-bento-text/5 rounded-3xl shadow-xl p-8 max-w-md w-full shadow-soft text-center space-y-6">
          <div className="w-20 h-20 bg-white p-1.5 rounded-full flex items-center justify-center mx-auto shadow-md">
            <img src="https://pub-48f5c35bbeac46cebd7922bbf8239e36.r2.dev/Bakery%20Shop/mk-bakery-logo.webp" alt="MK Bakery Logo" className="w-full h-full object-contain rounded-full" />
          </div>

          <div>
            <h2 className="text-2xl font-serif font-bold text-bento-text">Admin Portal</h2>
            <p className="text-xs text-bento-text font-light mt-1">
              Store administration and dashboard.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-semibold text-bento-text mb-1">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                className="w-full bg-bento-bg border border-bento-grey rounded-2xl px-4 py-3 text-sm text-bento-text focus:outline-none focus:border-bento-yellow"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-bento-text mb-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full bg-bento-bg border border-bento-grey rounded-2xl px-4 py-3 text-sm text-bento-text focus:outline-none focus:border-bento-yellow"
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
              className="w-full py-3.5 bg-bento-yellow text-bento-text-inverse rounded-full font-semibold text-xs uppercase tracking-wider hover:bg-bento-yellow/80 transition-colors shadow-soft"
            >
              Sign In to Dashboard
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-28 pb-24 bg-bento-bg min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
        {/* Dashboard Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white p-1 rounded-full shadow-sm shrink-0">
              <img src="https://pub-48f5c35bbeac46cebd7922bbf8239e36.r2.dev/Bakery%20Shop/mk-bakery-logo.webp" alt="MK Bakery Logo" className="w-full h-full object-contain rounded-full" />
            </div>
            <div>
              <span className="text-xs uppercase tracking-widest text-bento-yellow font-bold block">
                MK Bakery • Operations
              </span>
              <h1 className="text-2xl font-serif font-bold text-bento-text">
                Staff Operations Portal
              </h1>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* Navigation Tabs */}
            <div className="flex bg-bento-text/10 p-1 rounded-full shadow-inner text-xs font-semibold overflow-x-auto whitespace-nowrap">
              <button
                onClick={() => setActiveTab('revenue')}
                className={`px-4 py-2 rounded-full transition-all flex items-center space-x-1.5 ${
                  activeTab === 'revenue'
                    ? 'bg-bento-yellow text-bento-text-inverse shadow-xs'
                    : 'text-bento-text hover:text-bento-text'
                }`}
              >
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Revenue Dashboard</span>
              </button>
              <button
                onClick={() => setActiveTab('orders')}
                className={`px-4 py-2 rounded-full transition-all flex items-center space-x-1.5 ${
                  activeTab === 'orders'
                    ? 'bg-bento-yellow text-bento-text-inverse shadow-xs'
                    : 'text-bento-text hover:text-bento-text'
                }`}
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Live Orders ({orders.length})</span>
              </button>
              <button
                onClick={() => setActiveTab('products')}
                className={`px-4 py-2 rounded-full transition-all flex items-center space-x-1.5 ${
                  activeTab === 'products'
                    ? 'bg-bento-yellow text-bento-text-inverse shadow-xs'
                    : 'text-bento-text hover:text-bento-text'
                }`}
              >
                <Package className="w-3.5 h-3.5" />
                <span>Products & Stock</span>
              </button>
              <button
                onClick={() => setActiveTab('availability')}
                className={`px-4 py-2 rounded-full transition-all flex items-center space-x-1.5 ${
                  activeTab === 'availability'
                    ? 'bg-bento-yellow text-bento-text-inverse shadow-xs'
                    : 'text-bento-text hover:text-bento-text'
                }`}
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Capacity Manager</span>
              </button>
            </div>

            <button
              onClick={() => setIsAuthenticated(false)}
              className="p-2.5 rounded-full shadow-md bg-bento-text/5 hover:bg-bento-text/10 text-bento-text hover:text-bento-text transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* REVENUE DASHBOARD TAB */}
        {activeTab === 'revenue' && (() => {
          const validOrders = orders.filter(o => o.status !== 'Cancelled');
          const totalRevenue = validOrders.reduce((sum, o) => sum + (o.totals?.total || 0), 0);
          const totalOrders = validOrders.length;
          const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
          
          return (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="bg-bento-text/5 p-6 rounded-3xl shadow-soft">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-full bg-strawberry/10 text-strawberry flex items-center justify-center">
                      <TrendingUp className="w-5 h-5" />
                    </div>
                    <span className="text-sm font-semibold text-bento-text/80">Total Revenue</span>
                  </div>
                  <h3 className="text-3xl font-serif font-bold text-bento-text">{formatCurrency(totalRevenue)}</h3>
                </div>
                <div className="bg-bento-text/5 p-6 rounded-3xl shadow-soft">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-full bg-bento-yellow/10 text-bento-text flex items-center justify-center">
                      <ShoppingBag className="w-5 h-5" />
                    </div>
                    <span className="text-sm font-semibold text-bento-text/80">Total Orders</span>
                  </div>
                  <h3 className="text-3xl font-serif font-bold text-bento-text">{totalOrders}</h3>
                </div>
                <div className="bg-bento-text/5 p-6 rounded-3xl shadow-soft">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-full bg-blue-500/10 text-blue-600 flex items-center justify-center">
                      <Package className="w-5 h-5" />
                    </div>
                    <span className="text-sm font-semibold text-bento-text/80">Avg. Order Value</span>
                  </div>
                  <h3 className="text-3xl font-serif font-bold text-bento-text">{formatCurrency(avgOrderValue)}</h3>
                </div>
              </div>
              
              <div className="bg-bento-text/5 rounded-3xl shadow-soft p-6">
                <h3 className="text-lg font-serif font-bold text-bento-text mb-4">Recent Transactions</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-bento-grey/60 text-bento-text font-serif font-bold uppercase tracking-wider text-[10px]">
                      <tr>
                        <th className="p-4 rounded-l-xl">Order ID</th>
                        <th className="p-4">Customer</th>
                        <th className="p-4">Date</th>
                        <th className="p-4">Status</th>
                        <th className="p-4 text-right rounded-r-xl">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-beige">
                      {validOrders.slice(0, 5).map(order => (
                        <tr key={order.id} className="hover:bg-bento-bg/40 transition-colors">
                          <td className="p-4 font-mono text-[10px]">{order.id.split('-')[0]}</td>
                          <td className="p-4">{order.customer?.name || 'Unknown'}</td>
                          <td className="p-4">{new Date(order.createdAt).toLocaleDateString()}</td>
                          <td className="p-4">
                            <span className="px-2 py-1 rounded-full bg-green-100 text-green-800 text-[10px] font-bold">
                              {order.status}
                            </span>
                          </td>
                          <td className="p-4 text-right font-bold">{formatCurrency(order.totals?.total || 0)}</td>
                        </tr>
                      ))}
                      {validOrders.length === 0 && (
                        <tr>
                          <td colSpan={5} className="p-8 text-center text-bento-text/50">
                            No transactions yet
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          );
        })()}

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
                        ? 'bg-bento-yellow text-bento-text-inverse'
                        : 'bg-bento-text/10 text-bento-text hover:bg-bento-text/20'
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
                    className="bg-bento-text/5 rounded-3xl shadow-xl p-6 shadow-soft space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 gap-3">
                      <div className="flex items-center space-x-3 flex-wrap">
                        <span className="font-mono font-bold text-bento-text text-base">
                          #{order.orderNumber}
                        </span>
                        <span className="text-xs font-semibold text-bento-text">
                          {order.customer.name}
                        </span>
                        <span className="text-xs text-bento-text font-light">
                          ({order.customer.phone})
                        </span>
                      </div>

                      <div className="flex items-center space-x-3">
                        <span className="text-xs font-serif font-bold text-bento-text">
                          {formatCurrency(order.totals.total)}
                        </span>

                        {/* Status Changer Select */}
                        <select
                          value={order.status}
                          onChange={(e) =>
                            handleUpdateOrderStatus(order.id, e.target.value as any)
                          }
                          className={`text-xs font-bold px-3 py-1.5 rounded-full focus:outline-none ${
                            order.status === 'Baking'
                              ? 'bg-bento-yellow text-bento-text-inverse'
                              : order.status === 'Ready for Pickup'
                              ? 'bg-green-500 text-bento-text'
                              : order.status === 'Collected'
                              ? 'bg-gray-600 text-bento-text'
                              : 'bg-bento-text/10 text-bento-text hover:bg-bento-text/20'
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
                        <span className="text-bento-text block font-medium">Order Items:</span>
                        <ul className="text-bento-text font-light list-disc list-inside space-y-1">
                          {order.items.map((item, idx) => (
                            <li key={idx}>
                              {item.quantity}x {item.name} 
                              {item.size && ` (${item.size})`}
                              {item.flavor && ` - ${item.flavor}`}
                              {item.eggless && ` - Veg`}
                              {item.message && ` - Msg: "${item.message}"`}
                            </li>
                          ))}
                        </ul>
                        {order.notes && (
                          <p className="text-bento-yellow italic pt-1">Notes: “{order.notes}”</p>
                        )}
                      </div>

                      <div className="md:col-span-4 bg-bento-bg-dark/30 p-3 rounded-2xl shadow-inner space-y-1">
                        <div className="flex items-center space-x-1.5 text-bento-text font-semibold">
                          <Calendar className="w-3.5 h-3.5 text-bento-yellow" />
                          <span>Pickup: {order.pickupDate}</span>
                        </div>
                        <div className="flex items-center space-x-1.5 text-bento-text">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{order.pickupTimeSlot}</span>
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
                <Search className="w-4 h-4 text-bento-text/50 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  placeholder="Filter inventory..."
                  className="w-full bg-bento-bg border border-bento-grey rounded-full pl-10 pr-4 py-2.5 text-xs text-bento-text focus:outline-none focus:border-bento-yellow"
                />
              </div>

              <button
                onClick={() => setIsAddingProduct(true)}
                className="px-6 py-2.5 bg-bento-yellow text-bento-text-inverse rounded-full text-xs font-semibold hover:bg-bento-yellow/80 transition-colors flex items-center space-x-1.5 shadow-soft"
              >
                <Plus className="w-4 h-4 text-bento-yellow" />
                <span>Add New Cake Item</span>
              </button>
            </div>

            {/* Products Table */}
            <div className="bg-bento-text/5 rounded-3xl shadow-xl overflow-hidden shadow-soft">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-bento-grey/60 text-bento-text font-serif font-bold uppercase tracking-wider text-[10px] ">
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
                        <tr key={product.id} className="hover:bg-bento-bg/40 transition-colors">
                          <td className="p-4 flex items-center space-x-3">
                            <img
                              src={product.imageUuids[0]}
                              alt={product.name}
                              className="w-10 h-10 object-cover rounded-xl border border-bento-grey flex-shrink-0"
                            />
                            <div>
                              <span className="font-bold text-bento-text block">{product.name}</span>
                              <span className="text-[11px] text-bento-text">{product.sizes.length} sizes configured</span>
                            </div>
                          </td>
                          <td className="p-4 text-bento-text">{product.categories.join(', ')}</td>
                          <td className="p-4 font-bold text-bento-text font-serif">
                            {formatCurrency(product.price)}
                          </td>
                          <td className="p-4 text-bento-text">{product.preparationLeadTimeHours}h notice</td>
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
                                  ? 'bg-bento-yellow/20 text-bento-text'
                                  : 'bg-red-100 text-red-800'
                              }`}
                            >
                              {product.inStock ? 'In Stock' : 'Sold Out'}
                            </button>
                          </td>
                          <td className="p-4 text-right">
                            <div className="flex items-center justify-end space-x-2">
                              <button
                                className="p-1.5 text-bento-text hover:text-bento-text rounded"
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
          <div className="bg-bento-text/5 rounded-3xl shadow-xl p-6 sm:p-8 shadow-soft space-y-6">
            <div>
              <h2 className="text-xl font-serif font-bold text-bento-text">
                Bakery Capacity & Slot Booking Controls
              </h2>
              <p className="text-xs text-bento-text font-light mt-1">
                Toggle unavailable pickup time slots during kitchen rush hours or kitchen maintenance days.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-serif font-bold text-bento-text">
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
                          : 'bg-bento-bg border-bento-grey text-bento-text hover:border-bento-yellow'
                      }`}
                    >
                      <div>
                        <span className="text-xs font-semibold block">{slot}</span>
                        <span className="text-[10px] text-bento-text font-light">
                          {isBlocked ? 'Blocked for Booking' : 'Open for Customer Pickup'}
                        </span>
                      </div>

                      <span
                        className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                          isBlocked ? 'bg-red-200 text-red-900' : 'bg-bento-yellow/20 text-bento-text'
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

      {/* ADD PRODUCT MODAL */}
      {isAddingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-bento-bg/80 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-serif font-bold text-bento-text">Add New Product to Catalog</h2>
              <button 
                onClick={() => setIsAddingProduct(false)}
                className="p-2 bg-bento-bg text-bento-text rounded-full hover:bg-bento-grey transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleAddProduct} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-bento-text mb-1">Product Name *</label>
                  <input
                    required
                    type="text"
                    value={newProduct.name}
                    onChange={e => setNewProduct({...newProduct, name: e.target.value})}
                    placeholder="e.g. Classic Chocolate Cake"
                    className="w-full bg-bento-bg border border-bento-grey rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-bento-yellow"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-bento-text mb-1">Base Price (₹) *</label>
                  <input
                    required
                    type="number"
                    min="0"
                    value={newProduct.price || ''}
                    onChange={e => setNewProduct({...newProduct, price: Number(e.target.value)})}
                    placeholder="e.g. 1200"
                    className="w-full bg-bento-bg border border-bento-grey rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-bento-yellow"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-bento-text mb-1">Display In Catalogs/Pages *</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'home', label: 'Home Page' },
                    { id: 'cakes', label: 'Cakes Page' },
                    { id: 'decorations', label: 'Decorations' },
                    { id: 'bakery', label: 'Bakery' },
                  ].map(cat => (
                    <div 
                      key={cat.id}
                      onClick={() => {
                        const currentCats = newProduct.categories || [];
                        const isSelected = currentCats.includes(cat.id);
                        const nextCats = isSelected 
                          ? currentCats.filter(c => c !== cat.id)
                          : [...currentCats, cat.id];
                        setNewProduct({...newProduct, categories: nextCats, catalog: nextCats[0] || 'cakes'});
                      }}
                      className={`p-3 rounded-2xl border cursor-pointer flex items-center justify-between text-xs font-semibold transition-all ${
                        newProduct.categories?.includes(cat.id) 
                          ? 'bg-strawberry/10 border-strawberry text-strawberry' 
                          : 'bg-bento-bg border-bento-grey text-bento-text'
                      }`}
                    >
                      {cat.label}
                      {newProduct.categories?.includes(cat.id) && <CheckCircle className="w-3.5 h-3.5" />}
                    </div>
                  ))}
                </div>
                <p className="text-[10px] text-bento-text/60 mt-1.5">Select all pages/categories where this item should appear.</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-bento-text mb-1">Short Description</label>
                <textarea
                  value={newProduct.shortDescription}
                  onChange={e => setNewProduct({...newProduct, shortDescription: e.target.value})}
                  rows={2}
                  className="w-full bg-bento-bg border border-bento-grey rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-bento-yellow resize-none"
                  placeholder="A brief appealing description..."
                ></textarea>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-3 bg-bento-yellow text-bento-text-inverse rounded-full font-bold text-xs uppercase tracking-wider hover:bg-bento-yellow/90 transition-colors shadow-soft"
                >
                  Save Product to Catalog
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
