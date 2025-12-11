import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../store/hooks';
import { logout } from '../../store/slices/authSlice';
import AdminSidebar from '../../components/admin/AdminSidebar';
import { Package, Plus, Edit, Trash2, Search } from 'lucide-react';

const AdminProducts: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/admin/login');
  };

  const products = [
    { id: 1, name: 'iPhone 14 Pro', category: 'Smartphone', price: '$999', stock: 45, status: 'Active' },
    { id: 2, name: 'MacBook Air M2', category: 'Laptop', price: '$1299', stock: 23, status: 'Active' },
    { id: 3, name: 'AirPods Pro 2', category: 'Headphones', price: '$249', stock: 120, status: 'Active' },
    { id: 4, name: 'iPad Air', category: 'Tablet', price: '$599', stock: 67, status: 'Active' },
    { id: 5, name: 'Apple Watch Series 8', category: 'Smartwatch', price: '$399', stock: 0, status: 'Out of Stock' },
  ];

  return (
    <div className="admin-layout">
      <AdminSidebar onLogout={handleLogout} />
      
      <main className="admin-main">
        <div className="admin-header">
          <div>
            <h1>Products Management</h1>
            <p>Manage your product inventory</p>
          </div>
          <div className="admin-header-actions">
            <button className="admin-btn-primary">
              <Plus size={20} />
              Add Product
            </button>
          </div>
        </div>

        <div className="admin-card">
          <div className="admin-card-header">
            <div className="admin-search-bar">
              <Search size={20} />
              <input type="text" placeholder="Search products..." />
            </div>
            <select className="admin-select">
              <option>All Categories</option>
              <option>Smartphones</option>
              <option>Laptops</option>
              <option>Tablets</option>
              <option>Smartwatches</option>
              <option>Headphones</option>
            </select>
          </div>

          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Product Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id}>
                    <td>#{product.id}</td>
                    <td className="admin-table-product">{product.name}</td>
                    <td>{product.category}</td>
                    <td className="admin-table-amount">{product.price}</td>
                    <td>{product.stock}</td>
                    <td>
                      <span className={`admin-badge admin-badge-${product.status === 'Active' ? 'completed' : 'pending'}`}>
                        {product.status}
                      </span>
                    </td>
                    <td>
                      <div className="admin-table-actions">
                        <button className="admin-icon-btn">
                          <Edit size={16} />
                        </button>
                        <button className="admin-icon-btn admin-icon-btn-danger">
                          <Trash2 size={16} />
                        </button>
                      </div>
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

export default AdminProducts;
