// src/ComplainForm.js
import React, { useState } from 'react';
import axios from 'axios';
import './Complainform.css';
import { useNavigate } from 'react-router-dom';
import customerservice from './assets/customer-service.jpg';
import chat from './assets/chat-with-us.png';
const ComplainForm = () => {
    const [formData, setFormData] = useState({
        customerName: '',
        email: '',
        phoneNumber: '',
        complaintCategory: 'service',
        orderId: '',
        complaintDetails: '',
        dateOfIncident: '',
        image: null
    });

    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        setErrors({ ...errors, [name]: '' });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({ ...formData, image: file });
            setErrors({ ...errors, image: '' });
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.customerName) newErrors.customerName = 'Customer name is required.';
        if (!formData.email) {
            newErrors.email = 'Email is required.';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email address is invalid.';
        }
        if (!formData.phoneNumber) {
            newErrors.phoneNumber = 'Phone number is required.';
        } else if (!/^\d+$/.test(formData.phoneNumber)) {
            newErrors.phoneNumber = 'Phone number must contain only numbers.';
        }
        if (!formData.complaintDetails) newErrors.complaintDetails = 'Complaint details are required.';
        if (!formData.dateOfIncident) newErrors.dateOfIncident = 'Date of incident is required.';
        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const formErrors = validateForm();
        if (Object.keys(formErrors).length > 0) {
            setErrors(formErrors);
            return;
        }

        const formDataToSend = new FormData();
        formDataToSend.append('customerName', formData.customerName);
        formDataToSend.append('email', formData.email);
        formDataToSend.append('phoneNumber', formData.phoneNumber);
        formDataToSend.append('complaintCategory', formData.complaintCategory);
        formDataToSend.append('orderId', formData.orderId);
        formDataToSend.append('complaintDetails', formData.complaintDetails);
        formDataToSend.append('dateOfIncident', formData.dateOfIncident);

        if (formData.image) {
            formDataToSend.append('image', formData.image);
        }

        try {
            const response = await axios.post('http://localhost:5000/api/complaints', formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            alert('Complaint submitted successfully!');
            navigate('/');
        } catch (error) {
            console.error("Error submitting complaint:", error);
            if (error.response) {
                setErrors({ api: error.response.data.message || 'Failed to submit the complaint. Please try again later.' });
            } else {
                setErrors({ api: 'Network error. Please check your connection.' });
            }
        }
    };

    return (
        <div>
            <section id="complaint-form-section">
                <h1 className='h1r'>Complaint Form</h1>
                <p>We're here to help! Please fill out this form to report any issues with your order or service.</p>
                <img src={chat} className='chat' alt='chat'/>
            </section>
            <main>
                <section id="complaint-form">
                    <div>
                        <img src={customerservice} className='customerservice' alt="Customer Service" />
                    </div>
                    <center>
                        <h2 className='h2r'>File a Complaint or leave a review</h2>
                        {errors.api && <div className="error">{errors.api}</div>}
                        <form onSubmit={handleSubmit}>
                            <div>
                                <label className='label-complain' htmlFor="customer-name">Customer Name:</label>
                                <input
                                    type="text"
                                    id="customer-name"
                                    name="customerName"
                                    value={formData.customerName}
                                    onChange={handleChange}
                                    required
                                />
                                {errors.customerName && <div className="error">{errors.customerName}</div>}
                            </div>
                            <div>
                                <label className='label-complain' htmlFor="email">Email:</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                                {errors.email && <div className="error">{errors.email}</div>}
                            </div>
                            <div>
                                <label className='label-complain' htmlFor="phone-number">Phone Number:</label>
                                <input
                                    type="tel"
                                    id="phone-number"
                                    name="phoneNumber"
                                    value={formData.phoneNumber}
                                    onChange={handleChange}
                                    required
                                />
                                {errors.phoneNumber && <div className="error">{errors.phoneNumber}</div>}
                            </div>
                            <div>
                                <label className='label-complain' htmlFor="complaint-category">Category:</label>
                                <select
                                    id="complaint-category"
                                    name="complaintCategory"
                                    value={formData.complaintCategory}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="service">Service</option>
                                    <option value="product">Product</option>
                                    <option value="delivery">Delivery</option>
                                </select>
                            </div>
                            <div>
                                <label className='label-complain' htmlFor="order-id">Order ID (if applicable):</label>
                                <input
                                    type="text"
                                    id="order-id"
                                    name="orderId"
                                    value={formData.orderId}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label className='label-complain' htmlFor="date-of-incident">Date of Incident:</label>
                                <input
                                    type="date"
                                    id="date-of-incident"
                                    name="dateOfIncident"
                                    value={formData.dateOfIncident}
                                    onChange={handleChange}
                                    required
                                />
                                {errors.dateOfIncident && <div className="error">{errors.dateOfIncident}</div>}
                            </div>
                            <div>
                                <label className='label-complain' htmlFor="complaint-details">Description/details:</label>
                                <textarea
                                    id="complaint-details"
                                    name="complaintDetails"
                                    value={formData.complaintDetails}
                                    onChange={handleChange}
                                    required
                                />
                                {errors.complaintDetails && <div className="error">{errors.complaintDetails}</div>}
                            </div>
                            <div>
                                <label className='label-complain' htmlFor="image">Upload Image (optional):</label>
                                <input
                                    type="file"
                                    id="image"
                                    name="image"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                />
                                {errors.image && <div className="error">{errors.image}</div>}
                            </div>
                             <div className="button-container">
                            <button type="submit" className="btn-submit">Submit Complaint</button>
                            <button className="btn-return">Return Product</button>
                            </div>
                            
                        </form>
                    </center>
                </section>
                
                <section className='faq-section'>
                    <div className='questions'>
                        <h2>Frequently Asked Questions</h2>
                        <h3>How long do I have to submit a complaint?</h3>
                        <p>You have 30 days from the date of service or delivery to submit a complaint.</p>
                        <h3>Will I be notified once my complaint is resolved?</h3>
                        <p>Yes, you will receive an email once your complaint has been reviewed and resolved.</p>
                        <h3>Can I cancel my complaint?</h3>
                        <p>You can cancel your complaint by contacting customer service before it is processed.</p>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default ComplainForm;
