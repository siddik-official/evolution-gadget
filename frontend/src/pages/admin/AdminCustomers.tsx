import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../store/hooks';
import { logout } from '../../store/slices/authSlice';
import AdminSidebar from '../../components/admin/AdminSidebar';
import { Users, Search, Mail, Phone } from 'lucide-react';

const AdminCustomers: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/admin/login');
  };

  const customers = [
    { id: 1, name: 'John Doe', email: 'john@example.com', phone: '+1 234-567-8900', orders: 12, spent: '$4,567' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', phone: '+1 234-567-8901', orders: 8, spent: '$3,234' },
    { id: 3, name: 'Mike Johnson', email: 'mike@example.com', phone: '+1 234-567-8902', orders: 15, spent: '$6,789' },
    { id: 4, name: 'Sarah Williams', email: 'sarah@example.com', phone: '+1 234-567-8903', orders: 5, spent: '$2,123' },
    { id: 5, name: 'Tom Brown', email: 'tom@example.com', phone: '+1 234-567-8904', orders: 20, spent: '$8,456' },
  ];

  return (
    <div className="admin-layout">
      <AdminSidebar onLogout={handleLogout} />
      
      <main className="admin-main">
        <div className="admin-header">
          <div>
            <h1>Customers</h1>
            <p>Manage customer accounts and information</p>
          </div>
        </div>

        <div className="admin-card">
          <div className="admin-card-header">
            <div className="admin-search-bar">
              <Search size={20} />
              <input type="text" placeholder="Search customers..." />
            </div>
          </div>

          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Customer Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Total Orders</th>
                  <th>Total Spent</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((customer) => (
                  <tr key={customer.id}>
                    <td>#{customer.id}</td>
                    <td className="admin-table-customer">{customer.name}</td>
                    <td>
                      <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                        <Mail size={14} />
                        {customer.email}
                      </div>
                    </td>
                    <td>
                      <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                        <Phone size={14} />
                        {customer.phone}
                      </div>
                    </td>
                    <td>{customer.orders}</td>
                    <td className="admin-table-amount">{customer.spent}</td>
                    <td>
                      <button className="admin-btn-text">View Details</button>
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

export default AdminCustomers;
