// controllers/complaintController.js

const Complaint = require('../models/complaintModel');
const path = require('path');

// Handle POST request to create a complaint
const createComplaint = async (req, res) => {
    try {
        const complaintData = new Complaint({
            customerName: req.body.customerName,
            email: req.body.email,
            phoneNumber: req.body.phoneNumber,
            complaintCategory: req.body.complaintCategory,
            orderId: req.body.orderId || null,
            complaintDetails: req.body.complaintDetails,
            dateOfIncident: new Date(req.body.dateOfIncident),
            image: req.file ? `http://localhost:${process.env.PORT}/uploads/images/${req.file.filename}` : null
        });

        await complaintData.save();
        res.status(201).send({ id: complaintData.id, ...complaintData.toObject() });
    } catch (error) {
        console.error('Error saving complaint:', error);
        res.status(400).send({ error: 'Failed to submit complaint.' });
    }
};

// Get all complaints
const getAllComplaints = async (req, res) => {
    try {
        const complaints = await Complaint.find();
        res.json(complaints);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching complaints', error });
    }
};

// Edit Complaint
const editComplaint = async (req, res) => {
    try {
        const complaint = await Complaint.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        });
        if (!complaint) {
            return res.status(404).send();
        }
        res.status(200).send(complaint);
    } catch (error) {
        res.status(400).send(error);
    }
};

// Delete Complaint
const deleteComplaint = async (req, res) => {
    try {
        const complaint = await Complaint.findByIdAndDelete(req.params.id);
        if (!complaint) {
            return res.status(404).send({ message: 'Complaint not found' });
        }
        res.status(200).send({ message: 'Complaint deleted successfully' });
    } catch (error) {
        console.error('Error deleting complaint:', error);
        res.status(500).send({ error: 'Failed to delete complaint' });
    }
};

module.exports = {
    createComplaint,
    getAllComplaints,
    editComplaint,
    deleteComplaint,
};
