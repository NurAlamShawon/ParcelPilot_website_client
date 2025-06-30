import React from 'react';
import { useParams } from 'react-router';
import {loadStripe} from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import PaymentForm from './PaymentForm';


const stripePromise = loadStripe(import.meta.env.VITE_publishable_key);

const Payment = () => {
    const {id}=useParams();
    return (
      <Elements stripe={stripePromise}>
        <PaymentForm id={id}></PaymentForm>
      </Elements>
    );
};

export default Payment;