import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID, // Add this to your .env.local file
    key_secret: process.env.RAZORPAY_KEY_SECRET, // Add this to your .env.local file
});

export async function POST(req) {
    const { amount, currency, receipt } = await req.json();

    try {
        const order = await razorpay.orders.create({
            amount: amount * 100, // Amount in paise (multiply by 100)
            currency: currency,
            receipt: receipt,
        });

        return NextResponse.json(order, { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Unable to create order' }, { status: 500 });
    }
}