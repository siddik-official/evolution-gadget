import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchGadgets } from '../store/slices/gadgetsSlice';
import { Package, Truck, Shield, Headphones, ArrowRight, Star, TrendingUp } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';

const Home: React.FC = () => {
  const dispatch = useAppDispatch();
  const { gadgets, loading, error } = useAppSelector(state => state.gadgets);

  useEffect(() => {
    dispatch(fetchGadgets({ page: 1, limit: 8 }));
  }, [dispatch]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading amazing products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center text-red-600">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-gray-50 via-white to-gray-100 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="container mx-auto px-4 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 animate-fade-in">
              <div className="inline-block">
                <span className="bg-gray-900 text-white px-4 py-2 rounded-full text-sm font-medium tracking-wide">
                  Premium Tech Collection
                </span>
              </div>
              <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 leading-tight">
                Evolution
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-gray-700 to-gray-900">
                  Gadget
                </span>
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed max-w-xl">
                Discover the latest in audio technology. Premium AirPods, wireless earbuds, and accessories crafted for exceptional sound quality.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button asChild size="lg" className="bg-gray-900 hover:bg-gray-800">
                  <Link to="/categories/headphones" className="flex items-center gap-2">
                    Shop Now
                    <ArrowRight size={20} />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-2 border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white">
                  <Link to="#products">
                    View Collection
                  </Link>
                </Button>
              </div>
              <div className="flex gap-8 pt-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900">500+</div>
                  <div className="text-sm text-gray-600">Happy Customers</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900">50+</div>
                  <div className="text-sm text-gray-600">Products</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900">4.9</div>
                  <div className="text-sm text-gray-600 flex items-center gap-1">
                    <Star size={14} fill="currentColor" /> Rating
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl transform hover:scale-105 transition-transform duration-500">
                <img 
                  src="/img/cover.png" 
                  alt="Evolution Gadget Premium Products" 
                  className="w-full h-auto"
                  onError={(e) => {
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=800&q=80';
                  }}
                />
              </div>
              <div className="absolute -bottom-6 -right-6 w-72 h-72 bg-gray-900 rounded-full blur-3xl opacity-10"></div>
              <div className="absolute -top-6 -left-6 w-72 h-72 bg-gray-600 rounded-full blur-3xl opacity-10"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white border-y border-gray-200">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center group hover:transform hover:scale-105 transition-all duration-300">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4 group-hover:bg-gray-900 transition-colors">
                <Truck className="text-gray-900 group-hover:text-white transition-colors" size={28} />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Free Shipping</h3>
              <p className="text-sm text-gray-600">On orders over $49</p>
            </div>
            <div className="text-center group hover:transform hover:scale-105 transition-all duration-300">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4 group-hover:bg-gray-900 transition-colors">
                <Shield className="text-gray-900 group-hover:text-white transition-colors" size={28} />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Secure Payment</h3>
              <p className="text-sm text-gray-600">100% secure transactions</p>
            </div>
            <div className="text-center group hover:transform hover:scale-105 transition-all duration-300">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4 group-hover:bg-gray-900 transition-colors">
                <Package className="text-gray-900 group-hover:text-white transition-colors" size={28} />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Quality Products</h3>
              <p className="text-sm text-gray-600">Authentic & certified</p>
            </div>
            <div className="text-center group hover:transform hover:scale-105 transition-all duration-300">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4 group-hover:bg-gray-900 transition-colors">
                <Headphones className="text-gray-900 group-hover:text-white transition-colors" size={28} />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">24/7 Support</h3>
              <p className="text-sm text-gray-600">Always here to help</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">Shop by Category</h2>
            <p className="text-gray-600 text-lg">Explore our curated collections</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: 'AirPods', img: 'https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=400&q=80', link: '/categories/headphones' },
              { name: 'Wireless Earbuds', img: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&q=80', link: '/categories/headphones' },
              { name: 'Headphones', img: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80', link: '/categories/headphones' },
              { name: 'Accessories', img: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=400&q=80', link: '/categories/headphones' }
            ].map((category, index) => (
              <Link
                key={index}
                to={category.link}
                className="group relative overflow-hidden rounded-2xl aspect-square bg-gray-100 hover:shadow-2xl transition-all duration-500"
              >
                <img 
                  src={category.img} 
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-2xl font-bold text-white mb-2">{category.name}</h3>
                  <div className="flex items-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-sm font-medium">Explore</span>
                    <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-white" id="products">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">Featured Products</h2>
              <p className="text-gray-600 text-lg">Handpicked for you</p>
            </div>
            <Link 
              to="/categories/headphones" 
              className="hidden md:flex items-center gap-2 text-gray-900 font-semibold hover:gap-3 transition-all"
            >
              View All
              <ArrowRight size={20} />
            </Link>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {gadgets.length > 0 ? gadgets.slice(0, 8).map((gadget: any) => (
              <div key={gadget._id} className="group bg-white rounded-2xl overflow-hidden border border-gray-200 hover:shadow-xl transition-all duration-300 hover:border-gray-900">
                <div className="relative aspect-square bg-gray-50 overflow-hidden">
                  {gadget.images && gadget.images[0] ? (
                    <img 
                      src={gadget.images[0]} 
                      alt={gadget.name} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <Package size={48} />
                    </div>
                  )}
                  {gadget.stock < 10 && gadget.stock > 0 && (
                    <Badge variant="destructive" className="absolute top-4 right-4">
                      Only {gadget.stock} left
                    </Badge>
                  )}
                </div>
                <div className="p-6">
                  <div className="text-xs text-gray-500 mb-2 uppercase tracking-wide">{gadget.brand}</div>
                  <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-gray-700 transition-colors line-clamp-2">
                    {gadget.name}
                  </h3>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex text-yellow-500">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          size={14} 
                          fill={i < Math.floor(gadget.averageRating) ? "currentColor" : "none"}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-gray-500">({gadget.totalReviews})</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-gray-900">${gadget.price}</span>
                    <Button size="sm" className="bg-gray-900 hover:bg-gray-800">
                      Add to Cart
                    </Button>
                  </div>
                </div>
              </div>
            )) : (
              // Demo products
              Array.from({length: 4}).map((_, index) => (
                <div key={index} className="group bg-white rounded-2xl overflow-hidden border border-gray-200 hover:shadow-xl transition-all duration-300">
                  <div className="aspect-square bg-gray-100 flex items-center justify-center">
                    <Package size={48} className="text-gray-400" />
                  </div>
                  <div className="p-6">
                    <div className="text-xs text-gray-500 mb-2">BRAND</div>
                    <h3 className="font-semibold text-gray-900 mb-2">Premium Gadget {index + 1}</h3>
                    <div className="flex text-yellow-500 mb-3">
                      <Star size={14} fill="currentColor" />
                      <Star size={14} fill="currentColor" />
                      <Star size={14} fill="currentColor" />
                      <Star size={14} fill="currentColor" />
                      <Star size={14} />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-gray-900">${99 + index * 50}</span>
                      <Button size="sm" className="bg-gray-900 hover:bg-gray-800">
                        Add to Cart
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <TrendingUp size={48} className="mx-auto mb-6 opacity-80" />
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">Ready to Upgrade Your Audio Experience?</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers and discover premium sound quality with Evolution Gadget.
          </p>
          <Button asChild size="lg" variant="secondary" className="bg-white text-gray-900 hover:bg-gray-100">
            <Link to="/categories/headphones" className="flex items-center gap-2">
              Shop Collection
              <ArrowRight size={20} />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Home;
