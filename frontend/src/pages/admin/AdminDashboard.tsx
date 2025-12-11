import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { logout } from '../../store/slices/authSlice';
import { UserRole } from '../../types';
import AdminSidebar from '../../components/admin/AdminSidebar';
import {
  DollarSign,
  ShoppingCart,
  Users,
  TrendingUp,
  Package,
  AlertCircle,
  ArrowUp,
  ArrowDown
} from 'lucide-react';

interface StatCard {
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
  icon: React.ReactNode;
  color: string;
}

const AdminDashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAppSelector(state => state.auth);

  const [stats, setStats] = useState<StatCard[]>([
    {
      title: 'Total Sales',
      value: '$45,231.89',
      change: '+20.1%',
      isPositive: true,
      icon: <DollarSign size={24} />,
      color: '#10b981'
    },
    {
      title: 'Orders',
      value: '1,234',
      change: '+15.3%',
      isPositive: true,
      icon: <ShoppingCart size={24} />,
      color: '#3b82f6'
    },
    {
      title: 'Customers',
      value: '892',
      change: '+8.2%',
      isPositive: true,
      icon: <Users size={24} />,
      color: '#8b5cf6'
    },
    {
      title: 'Net Margin',
      value: '28.5%',
      change: '-2.4%',
      isPositive: false,
      icon: <TrendingUp size={24} />,
      color: '#f59e0b'
    }
  ]);

  const recentOrders = [
    { id: '#ORD-001', customer: 'John Doe', product: 'iPhone 14 Pro', amount: '$999', status: 'Completed' },
    { id: '#ORD-002', customer: 'Jane Smith', product: 'MacBook Air', amount: '$1299', status: 'Processing' },
    { id: '#ORD-003', customer: 'Mike Johnson', product: 'AirPods Pro', amount: '$249', status: 'Shipped' },
    { id: '#ORD-004', customer: 'Sarah Williams', product: 'iPad Air', amount: '$599', status: 'Pending' },
    { id: '#ORD-005', customer: 'Tom Brown', product: 'Apple Watch', amount: '$399', status: 'Completed' },
  ];

  const topProducts = [
    { name: 'iPhone 14 Pro', sales: 234, revenue: '$233,766' },
    { name: 'MacBook Air M2', sales: 187, revenue: '$242,913' },
    { name: 'AirPods Pro 2', sales: 456, revenue: '$113,544' },
    { name: 'iPad Air', sales: 198, revenue: '$118,602' },
    { name: 'Apple Watch Series 8', sales: 312, revenue: '$124,488' },
  ];

  useEffect(() => {
    if (!isAuthenticated || user?.role !== UserRole.ADMIN) {
      navigate('/admin/login');
    }
  }, [isAuthenticated, user, navigate]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/admin/login');
  };

  if (!isAuthenticated || user?.role !== UserRole.ADMIN) {
    return null;
  }

  return (
    <div className="admin-layout">
      <AdminSidebar onLogout={handleLogout} />
      
      <main className="admin-main">
        <div className="admin-header">
          <div>
            <h1>Dashboard</h1>
            <p>Welcome back, {user?.name}</p>
          </div>
          <div className="admin-header-actions">
            <button className="admin-btn-secondary">
              <Package size={20} />
              Export Report
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="admin-stats-grid">
          {stats.map((stat, index) => (
            <div key={index} className="admin-stat-card">
              <div className="admin-stat-header">
                <span className="admin-stat-title">{stat.title}</span>
                <div 
                  className="admin-stat-icon" 
                  style={{ backgroundColor: `${stat.color}15`, color: stat.color }}
                >
                  {stat.icon}
                </div>
              </div>
              <div className="admin-stat-value">{stat.value}</div>
              <div className="admin-stat-change">
                {stat.isPositive ? (
                  <ArrowUp size={16} color="#10b981" />
                ) : (
                  <ArrowDown size={16} color="#ef4444" />
                )}
                <span style={{ color: stat.isPositive ? '#10b981' : '#ef4444' }}>
                  {stat.change}
                </span>
                <span className="admin-stat-period">from last month</span>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Orders and Top Products */}
        <div className="admin-content-grid">
          {/* Recent Orders */}
          <div className="admin-card">
            <div className="admin-card-header">
              <h2>Recent Orders</h2>
              <a href="/admin/orders" className="admin-link">View All</a>
            </div>
            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Product</th>
                    <th>Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => (
                    <tr key={order.id}>
                      <td className="admin-table-id">{order.id}</td>
                      <td>{order.customer}</td>
                      <td>{order.product}</td>
                      <td className="admin-table-amount">{order.amount}</td>
                      <td>
                        <span className={`admin-badge admin-badge-${order.status.toLowerCase()}`}>
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Top Products */}
          <div className="admin-card">
            <div className="admin-card-header">
              <h2>Top Products</h2>
              <a href="/admin/products" className="admin-link">View All</a>
            </div>
            <div className="admin-products-list">
              {topProducts.map((product, index) => (
                <div key={index} className="admin-product-item">
                  <div className="admin-product-info">
                    <div className="admin-product-rank">#{index + 1}</div>
                    <div>
                      <div className="admin-product-name">{product.name}</div>
                      <div className="admin-product-sales">{product.sales} sales</div>
                    </div>
                  </div>
                  <div className="admin-product-revenue">{product.revenue}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sales Chart Placeholder */}
        <div className="admin-card">
          <div className="admin-card-header">
            <h2>Sales Overview</h2>
            <select className="admin-select">
              <option>Last 7 days</option>
              <option>Last 30 days</option>
              <option>Last 3 months</option>
              <option>Last year</option>
            </select>
          </div>
          <div className="admin-chart-placeholder">
            <TrendingUp size={48} />
            <p>Sales chart will be displayed here</p>
            <p className="admin-chart-subtitle">Integrate with Chart.js or Recharts for visualizations</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
