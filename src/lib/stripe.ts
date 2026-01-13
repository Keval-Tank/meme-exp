import Stripe from 'stripe'

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY
const stripeClient = new Stripe(STRIPE_SECRET_KEY!)

export {stripeClient}