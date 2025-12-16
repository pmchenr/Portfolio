// backend/models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true, trim: true },
    email: { type: String, unique: true, sparse: true, lowercase: true, trim: true },
    passwordHash: { type: String }, // Optional for OAuth users
    role: { type: String, enum: ['admin', 'subscriber', 'user'], default: 'user' },

    // Subscription fields
    subscriptionStatus: {
      type: String,
      enum: ['none', 'active', 'canceled', 'past_due'],
      default: 'none'
    },
    subscriptionPlan: { type: String }, // e.g., 'monthly', 'yearly'
    subscriptionExpiresAt: { type: Date },
    stripeCustomerId: { type: String },
    stripeSubscriptionId: { type: String },

    // Promo code support
    promoCode: { type: String },
    promoGrantedAt: { type: Date },

    // OAuth fields (for Google login later)
    googleId: { type: String, unique: true, sparse: true },

    // Profile
    name: { type: String },
    avatar: { type: String }
  },
  { timestamps: true }
);

// Virtual to check if user has active subscription
userSchema.virtual('isSubscriber').get(function() {
  if (this.role === 'admin') return true;
  if (this.subscriptionStatus === 'active') return true;
  if (this.promoCode && this.subscriptionStatus !== 'canceled') return true;
  return false;
});

// Ensure virtuals are included in JSON
userSchema.set('toJSON', { virtuals: true });
userSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('User', userSchema);
