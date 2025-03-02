import React, { useState } from 'react';
import { Mail } from 'lucide-react';
import emailjs from 'emailjs-com';
import './App.css';

const ProductOrderApp = () => {
  // Sample product data
  const initialProducts = [
    { id: 1, name: 'STPB100', price: 8142, image: '/api/placeholder/200/200' },
    { id: 2, name: 'SSTPB130', price: 8754, image: '/api/placeholder/200/200' },
    { id: 3, name: 'STPB150', price: 9491, image: '/api/placeholder/200/200' },
    { id: 4, name: 'STPB180', price: 10188, image: '/api/placeholder/200/200' },
    { id: 5, name: 'STPB200', price: 10899, image: '/api/placeholder/200/200' },
    { id: 6, name: 'STPB225', price: 12552, image: '/api/placeholder/200/200' }
  ];

  // State for products with quantities
  const [products, setProducts] = useState(
    initialProducts.map(product => ({ ...product, quantity: 0 }))
  );
  
  // State for form details
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  
  // State for submission status
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  
  // Handler for quantity change
  const handleQuantityChange = (id, value) => {
    const newValue = parseInt(value) || 0;
  
    // If the user types "0", clear the input field
    if (newValue === 0) {
      setProducts(products.map(product => 
        product.id === id ? { ...product, quantity: '' } : product
      ));
    } else {
      setProducts(products.map(product => 
        product.id === id ? { ...product, quantity: newValue } : product
      ));
    }
  };
  
  // Calculate total
  const total = products.reduce((sum, product) => sum + (product.quantity * product.price), 0);
  
  // Handler for form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Filter products that have quantities > 0
    const orderedProducts = products.filter(product => product.quantity > 0);
    
    if (orderedProducts.length === 0) {
      alert("Please add at least one product to your order.");
      setIsSubmitting(false);
      return;
    }
    
    // In a real app, you would send this data to your backend
    // which would then send an email
    emailjs.send(
      'service_rz7rjr1',  // Create account on emailjs.com to get these
      'template_xhlfgdi',
      {
        to_email: 'yuvraj.pradhan.2004@gmail.com',
        from_name: name,
        from_email: email,
        order_details: orderedProducts.map(p => `₹{p.name} x₹{p.quantity}`).join(', '),
        total: total.toFixed(2)
      },
      'dufdgKe3mDdmfchTf'
    )
    .then(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      
      // Reset form after submission
      setProducts(initialProducts.map(product => ({ ...product, quantity: 0 })));
      setName('');
      setEmail('');
      
      // Clear success message after a delay
      setTimeout(() => setSubmitted(false), 5000);
    })
    .catch(error => {
      console.error('Email error:', error);
      setIsSubmitting(false);
      alert('Failed to send order. Please try again.');
    });
  };

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <h1 className="text-3xl font-bold mb-6 text-center">Product Order Form</h1>
      
      {submitted && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          <p className="flex items-center font-bold">
            <Mail className="mr-2" size={20} />
            Order successfully submitted! An email has been sent with your order details.
          </p>
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="name">
              Your Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2" htmlFor="email">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        </div>
        
        <h2 className="text-xl font-semibold mb-4">Select Products</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-6">
          {products.map(product => (
            <div key={product.id} className="border rounded-lg overflow-hidden shadow-md">
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-1">{product.name}</h3>
                <p className="text-gray-700 mb-3">₹{product.price.toFixed(2)}</p>
                <div className="flex items-center">
                  <label className="mr-2">Qty:</label>
                  <input
                    type="number"
                    min="0"
                    value={product.quantity}
                    onChange={(e) => handleQuantityChange(product.id, e.target.value)}
                    className="w-16 p-1 border border-gray-300 rounded"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="bg-gray-100 p-4 rounded-lg mb-6">
          <div className="flex justify-between items-center">
            <span className="font-semibold text-lg">Total:</span>
            <span className="font-bold text-xl">₹{total.toFixed(2)}</span>
          </div>
        </div>
        
        <div className="text-center">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Processing...' : 'Submit Order'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductOrderApp;