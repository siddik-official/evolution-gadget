import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../store/hooks';
import { logout } from '../../store/slices/authSlice';
import AdminSidebar from '../../components/admin/AdminSidebar';
import { ShoppingCart, Search, Eye } from 'lucide-react';

const AdminOrders: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/admin/login');
  };

  const orders = [
    { id: '#ORD-001', customer: 'John Doe', date: '2024-03-15', items: 3, total: '$1,247', status: 'Completed' },
    { id: '#ORD-002', customer: 'Jane Smith', date: '2024-03-14', items: 1, total: '$1,299', status: 'Processing' },
    { id: '#ORD-003', customer: 'Mike Johnson', date: '2024-03-14', items: 2, total: '$648', status: 'Shipped' },
    { id: '#ORD-004', customer: 'Sarah Williams', date: '2024-03-13', items: 1, total: '$599', status: 'Pending' },
    { id: '#ORD-005', customer: 'Tom Brown', date: '2024-03-13', items: 4, total: '$2,456', status: 'Completed' },
    { id: '#ORD-006', customer: 'Emily Davis', date: '2024-03-12', items: 1, total: '$999', status: 'Shipped' },
    { id: '#ORD-007', customer: 'Chris Wilson', date: '2024-03-12', items: 2, total: '$798', status: 'Processing' },
  ];

  return (
    <div className="admin-layout">
      <AdminSidebar onLogout={handleLogout} />
      
      <main className="admin-main">
        <div className="admin-header">
          <div>
            <h1>Orders Management</h1>
            <p>Track and manage all orders</p>
          </div>
          <div className="admin-header-actions">
            <select className="admin-select">
              <option>All Status</option>
              <option>Pending</option>
              <option>Processing</option>
              <option>Shipped</option>
              <option>Completed</option>
            </select>
          </div>
        </div>

        <div className="admin-card">
          <div className="admin-card-header">
            <div className="admin-search-bar">
              <Search size={20} />
              <input type="text" placeholder="Search orders..." />
            </div>
          </div>

          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Date</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td className="admin-table-id">{order.id}</td>
                    <td>{order.customer}</td>
                    <td>{order.date}</td>
                    <td>{order.items}</td>
                    <td className="admin-table-amount">{order.total}</td>
                    <td>
                      <span className={`admin-badge admin-badge-${order.status.toLowerCase()}`}>
                        {order.status}
                      </span>
                    </td>
                    <td>
                      <button className="admin-icon-btn">
                        <Eye size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminOrders;
