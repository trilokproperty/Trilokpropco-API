import mongoose from "mongoose";


const propertySchema = new mongoose.Schema({
    name: { type: String, required: true },
    metaTitle:{ type: String },
    metaDescription:{ type: String },
    type: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Types',
        default: null
    },
    developer: {type: mongoose.Schema.Types.ObjectId, ref: 'Developer' },
    location: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'city'
  },
    status: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Status',
        default: null
    },
    priceRange: { type: String, required: true },
    category: { type: String, required: true },
    configuration: { type: String, required: true },
    galleryImages: { type: [String], required: true },
    bankImages: { type: [String], required: true },
    projectOverview: {
        possessionStart: { type: String},
        landArea: { type: String},
        configuration: { type: String},
        flatArea: { type: String},
        priceRange: { type: String},
        numberOfBlocks: { type: String},
        elevation: { type: String},
        numberOfUnits: { type: String},
        RegistrationNo: { type: String},
    },
    description: { type: String },
    size: { type: String },
    priceDetails: {
      type: [{
        configuration: { type: String},
        price: { type: String},
        size: { type: String}
      }]
    },
    plans: {
      type: [{
        planType: { type: String},
        image: { type: String},
        size: { type: String},
        price: { type: String}
      }],
    },
    pdfDownload: { type: String},
    amenities: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Amenity'
    }],
    nearbyFacilities: { type: String},
    locationMap: { type: String},
    specifications: { type: String, required: false, default: null },
    video: { type: String, required: true },
    for: { type: String, required: true },
    isFeatured: { type: Boolean, default: false },
    exclusive: { type: Boolean, default: false },
    created_at:{type: Date, default: Date.now}
  });

export const PropertyModel = mongoose.model('Property', propertySchema);
