import React, { useState } from 'react';
import { CheckCircle } from 'lucide-react';
import emailjs from 'emailjs-com';
import './App.css';

const ProductOrderApp = () => {
  const initialProducts = [
    { id: 1, segment: 'Home UPS', model: 'STPB100', c20Ah: 100, warranty: '36+24*', price: 8142 },
    { id: 2, segment: 'Home UPS', model: 'STPB130', c20Ah: 130, warranty: '36+24*', price: 8754 },
    { id: 3, segment: 'Home UPS', model: 'STPB150', c20Ah: 150, warranty: '36+24*', price: 9491 },
    { id: 4, segment: 'Home UPS', model: 'STPB180', c20Ah: 180, warranty: '36+24*', price: 10188 },
    { id: 5, segment: 'Home UPS', model: 'STPB200', c20Ah: 200, warranty: '36+24*', price: 10899 },
    { id: 6, segment: 'Home UPS', model: 'STPB225', c20Ah: 225, warranty: '36+24*', price: 12552 },
    { id: 7, segment: 'E rickshaw battery', model: 'SMD1200', c20Ah: 100, warranty: '7', price: 5599 },
    { id: 8, segment: 'E rickshaw battery', model: 'SMD1400', c20Ah: 110, warranty: '9', price: 6099 },
    { id: 9, segment: 'E rickshaw battery', model: 'SMD1500', c20Ah: 120, warranty: '12', price: 6599 },
    { id: 10, segment: 'E rickshaw battery', model: 'SMD1800', c20Ah: 100, warranty: '12', price: 7099 },
    { id: 11, segment: 'E rickshaw battery', model: 'SMD1800', c20Ah: 100, warranty: '15', price: 7599 },
  ];

  const [products, setProducts] = useState(
    initialProducts.map(product => ({ ...product, quantity: 0 }))
  );

  const [formData, setFormData] = useState({
    firmName: '',
    mobileNumber: '',
    city: '',
    pinCode: '',
    state: '',
    email: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleQuantityChange = (id, value) => {
    const newValue = value === '' ? '' : Math.max(0, parseInt(value) || 0);
    setProducts(products.map(product => 
      product.id === id ? { ...product, quantity: newValue } : product
    ));
  };

  const total = products.reduce((sum, product) => sum + (product.quantity * product.price), 0);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const orderedProducts = products.filter(product => product.quantity > 0);
    if (orderedProducts.length === 0) {
      alert("Please add at least one product to your order.");
      setIsSubmitting(false);
      return;
    }

    emailjs.send(
      'service_rz7rjr1',
      'template_xhlfgdi',
      {
        to_email: 'yuvraj.pradhan.2004@gmail.com',
        firm_name: formData.firmName,
        mobile_number: formData.mobileNumber,
        city: formData.city,
        pin_code: formData.pinCode,
        state: formData.state,
        from_email: formData.email,
        order_details: orderedProducts.map(p => `${p.model} (${p.c20Ah}Ah) x${p.quantity}`).join(', '),
        total: `₹${total.toFixed(2)}`
      },
      'dufdgKe3mDdmfchTf'
    )
    .then(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      setProducts(initialProducts.map(product => ({ ...product, quantity: 0 })));
      setFormData({ firmName: '', mobileNumber: '', city: '', pinCode: '', state: '', email: '' });

      setTimeout(() => setSubmitted(false), 5000);
    })
    .catch(error => {
      console.error('Email error:', error);
      setIsSubmitting(false);
      alert('Failed to send order. Please try again.');
    });
  };

  return (
    <div className="container">
      <h1>Surya Batteries Order Form</h1>

      {submitted && (
        <div className="success-message">
          <CheckCircle size={20} color="green" />
          <span>Order submitted successfully! Check your email.</span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <label>Firm Name <span style={{ color: 'red' }}>*</span></label>
        <input type="text" name="firmName" placeholder="Firm Name" value={formData.firmName} onChange={handleInputChange} required />
        
        <label>Mobile Number <span style={{ color: 'red' }}>*</span></label>
        <input type="text" name="mobileNumber" placeholder="Mobile Number" value={formData.mobileNumber} onChange={handleInputChange} required pattern="[0-9]{10}" title="Enter a valid 10-digit mobile number"/>
        
        <label>City <span style={{ color: 'red' }}>*</span></label>
        <input type="text" name="city" placeholder="City" value={formData.city} onChange={handleInputChange} required />
        
        <label>Pin Code</label>
        <input type="text" name="pinCode" placeholder="Pin Code" value={formData.pinCode} onChange={handleInputChange} />
        <label>State</label>
        <input type="text" name="state" placeholder="State" value={formData.state} onChange={handleInputChange} />
        <label>Email</label>
        <input type="email" name="email" placeholder="Email ID" value={formData.email} onChange={handleInputChange} />

        <h2>Select Products</h2>
        <div className="product-list">
          {products.map(product => (
            <div className="product-item" key={product.id}>
              <strong>
                <h3>{product.model} ({product.c20Ah}Ah)</h3>
                <p>Segment type: Tubular Inverter battery</p>
                <p>Basic Price (GST 28% Additional) = ₹{product.price.toFixed(2)}</p>
                <p>Warranty: {product.warranty}</p>
              </strong>
              <input type="number" min="0" value={product.quantity} onChange={(e) => handleQuantityChange(product.id, e.target.value)} />
            </div>
          ))}
        </div>

        <div className="total-container">
          Total: ₹{total.toFixed(2)}
        </div>

        <button type="submit" disabled={isSubmitting || total === 0}>
          {isSubmitting ? 'Processing...' : 'Submit Order'}
        </button>
      </form>
    </div>
  );
};

export default ProductOrderApp;
