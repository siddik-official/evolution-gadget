import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchGadgets } from '../store/slices/gadgetsSlice';

const Home: React.FC = () => {
  const dispatch = useAppDispatch();
  const { gadgets, loading, error } = useAppSelector(state => state.gadgets);

  useEffect(() => {
    dispatch(fetchGadgets({ page: 1, limit: 8 }));
  }, [dispatch]);

  if (loading) {
    return <div className="loading">Loading gadgets...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="home">
      {/* Hero Banner */}
      <div className="hero-section">
        <div className="container">
          <div className="hero-content">
            <div className="sale-badge">SALE</div>
            <div className="discount-text">25%</div>
            <div className="offer-text">OFF - TODAY ONLY</div>
            <a href="#products" className="cta-button">SHOP NOW</a>
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <div className="categories-section">
        <div className="container">
          <h2 className="section-title">Shop by Category</h2>
          <div className="categories-grid">
            <div className="category-card electronics">
              <div className="category-content">
                <h3 className="category-title">ELECTRONICS</h3>
                <ul className="category-items">
                  <li>• Computers</li>
                  <li>• Photo & video cameras</li>
                  <li>• Smart phones</li>
                  <li>• Tablets</li>
                  <li>• Accessories</li>
                </ul>
              </div>
            </div>
            
            <div className="category-card home-decor">
              <div className="category-content">
                <h3 className="category-title">HOME DECOR</h3>
                <ul className="category-items">
                  <li>• Living Room</li>
                  <li>• Bed room</li>
                  <li>• Kitchen</li>
                  <li>• Bathroom</li>
                  <li>• Office</li>
                </ul>
              </div>
            </div>
            
            <div className="category-card fashion">
              <div className="category-content">
                <h3 className="category-title">FASHION</h3>
                <ul className="category-items">
                  <li>• Handbags & Clutch</li>
                  <li>• Jackets & Suits</li>
                  <li>• Shoes & Sandals</li>
                  <li>• Shirts & Shoes</li>
                  <li>• Stationery</li>
                </ul>
              </div>
            </div>
            
            <div className="category-card sport">
              <div className="category-content">
                <h3 className="category-title">SPORT</h3>
                <ul className="category-items">
                  <li>• Cycle</li>
                  <li>• Sports</li>
                  <li>• Fitness</li>
                  <li>• Accessories</li>
                  <li>• NFL</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Brand Banner */}
      <div className="brand-banner">
        <div className="container">
          <h2 className="brand-title">COMPUTERS & ACCESSORIES</h2>
          <p className="brand-subtitle">Premium Quality Tech Products</p>
        </div>
      </div>

      {/* Product Showcase */}
      <div className="container">
        <div className="product-showcase">
          <div className="showcase-item">
            <h3 className="showcase-title">SMARTPHONE SERIES</h3>
            <p className="showcase-subtitle">Android Smartphone Series</p>
            <button className="showcase-btn">SHOP NOW</button>
          </div>
          
          <div className="showcase-item">
            <h3 className="showcase-title">ULTRA HD SMART LED TV</h3>
            <p className="showcase-subtitle">A Samsung Smart LCD HDTV
24 inch Aspect 4K</p>
            <button className="showcase-btn">SHOP NOW</button>
          </div>
        </div>
      </div>

      {/* Featured Products */}
      <div className="featured-products" id="products">
        <div className="container">
          <h2 className="section-title">Featured Products</h2>
          <div className="product-grid">
            {gadgets.length > 0 ? gadgets.slice(0, 8).map((gadget: any) => (
              <div key={gadget._id} className="product-card">
                <div className="product-image">
                  {gadget.images && gadget.images[0] ? (
                    <img src={gadget.images[0]} alt={gadget.name} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
                  ) : (
                    'No Image Available'
                  )}
                </div>
                <div className="product-info">
                  <h3>{gadget.name}</h3>
                  <div className="product-price">${gadget.price}</div>
                  <div className="product-brand">{gadget.brand}</div>
                  <div className="product-rating">
                    <span className="rating-stars">★★★★☆</span>
                    <span>{gadget.averageRating}/5 ({gadget.totalReviews} reviews)</span>
                  </div>
                </div>
              </div>
            )) : (
              // Demo products when no data is available
              Array.from({length: 4}).map((_, index) => (
                <div key={index} className="product-card">
                  <div className="product-image">Product Image</div>
                  <div className="product-info">
                    <h3>Sample Gadget {index + 1}</h3>
                    <div className="product-price">${99 + index * 50}</div>
                    <div className="product-brand">Brand Name</div>
                    <div className="product-rating">
                      <span className="rating-stars">★★★★☆</span>
                      <span>4.5/5 (120 reviews)</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
