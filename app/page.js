'use client'

import { useState } from 'react';

export default function DonatePage() {
    const [loading, setLoading] = useState(false);
    const [amount, setAmount] = useState('');

    const handlePayment = async () => {
        if (!amount || isNaN(amount) || amount <= 0) {
            alert('Please enter a valid donation amount.');
            return;
        }

        setLoading(true);

        try {
            // Step 1: Create an order
            const response = await fetch('/api/create-order', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ amount, currency: 'INR', receipt: 'donation_receipt#1' }),
            });

            const order = await response.json();

            // Step 2: Load Razorpay Checkout script
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.onload = () => {
                // Step 3: Open Razorpay Checkout
                const options = {
                    key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, // Add this to your .env.local file
                    amount: order.amount,
                    currency: order.currency,
                    name: 'Animal Care Donations',
                    description: 'Donation for Animal Welfare',
                    order_id: order.id,
                    handler: function (response) {
                        console.log('Payment successful', response);
                        alert('Thank you for your donation!');
                    },
                    prefill: {
                        name: '',
                        email: '',
                        contact: '',
                    },
                    notes: {
                        purpose: 'Donation for Animal Welfare',
                    },
                    theme: {
                        color: '#228B22', // Green color theme
                    },
                };

                const razorpay = new Razorpay(options);
                razorpay.open();
            };
            script.onerror = () => {
                alert('Failed to load Razorpay SDK. Please try again.');
            };
setAmount('')
            document.body.appendChild(script);
        } catch (error) {
          setAmount('')
            console.error('Payment failed', error);
            alert('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
            <h1>Donate for Animal Welfare</h1>
            <p>Your contribution helps us take care of animals in need.</p>
            <div style={{ margin: '1rem 0' }}>
                <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Enter amount"
                    style={{
                        padding: '0.5rem',
                        fontSize: '1rem',
                        borderRadius: '5px',
                        border: '1px solid #ccc',
                        width: '200px',
                        marginRight: '1rem',
                    }}
                />
                <button
                    onClick={handlePayment}
                    disabled={loading}
                    style={{
                        padding: '0.5rem 1rem',
                        backgroundColor: '#228B22',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        fontSize: '1rem',
                        cursor: 'pointer',
                        opacity: loading ? 0.7 : 1,
                    }}
                >
                    {loading ? 'Processing...' : 'Donate Now'}
                </button>
            </div>
        </div>
    );
}