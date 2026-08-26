const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
  make: { type: String, required: true },
  model: { type: String, required: true },
  year: { type: Number, required: true },
  body_type: { type: String, default: null },
  transmission: { type: String, default: null },
  fuel_type: { type: String, default: null },
  engine_cc: { type: Number, default: null },
  mileage_km: { type: Number, default: null },
  color: { type: String, default: null },
  price_fob_jpy: { type: Number, default: null },
  price_fob_usd: { type: Number, default: null },
  status: { type: String, default: 'Available', enum: ['Available', 'Reserved', 'Sold', 'In Transit', 'Delivered'] },
  location: { type: String, default: null },
  image_url: { type: String, default: null },
  gallery: { type: [String], default: [] },
  features: { type: [String], default: [] },
  featured: { type: Boolean, default: false },
  description: { type: String, default: null },
  chassis_no: { type: String, default: null },
  stock_id: { type: String, default: null },
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  toJSON: {
    virtuals: true,
    transform: function (doc, ret) {
      ret.id = ret._id.toString();
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  }
});

module.exports = mongoose.model('Vehicle', vehicleSchema);
