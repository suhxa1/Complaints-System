// models/Complaint.js

const mongoose = require('mongoose');

// Define Complaint Schema
const complaintSchema = new mongoose.Schema({
    customerName: { type: String, required: true },
    email: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    complaintCategory: { type: String, required: true },
    orderId: { type: String },
    complaintDetails: { type: String, required: true },
    dateOfIncident: { type: Date, required: true },
    image: { type: String }
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Create a virtual property 'id' that is a string representation of the _id
complaintSchema.virtual('id').get(function () {
    return this._id.toString();
});

const Complaint = mongoose.model('Complaint', complaintSchema);

module.exports = Complaint;
