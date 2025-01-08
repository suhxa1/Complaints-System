import React, { useState, useEffect } from 'react';
import './faqComplain.css'; // CSS file for styling
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const ManageFaqComplain = () => {
  const [complaints, setComplaints] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // State to track search input

  // Fetch FAQ/Complain data from the backend
  const fetchInfo = async () => {
    await fetch('http://localhost:5000/api/complaints')
      .then((res) => res.json())
      .then((data) => { setComplaints(data); })
      .catch((error) => console.error('Error fetching complaints:', error));
  };

  useEffect(() => {
    fetchInfo();
  }, []);

  const [editIndex, setEditIndex] = useState(-1);
  const [editFormData, setEditFormData] = useState({});

  // Handle input changes during edit
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({ ...editFormData, [name]: value });
  };

  // Enable edit mode for a specific row
  const handleEditClick = (index) => {
    setEditIndex(index);
    setEditFormData(complaints[index]);
  };

  // Save the edited complaint/FAQ
  const handleSaveClick = async () => {
    const requestId = complaints[editIndex]._id;

    try {
      const response = await fetch(`http://localhost:5000/api/complaints/${requestId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editFormData),
      });

      if (response.ok) {
        const updatedComplaint = await response.json();
        const updatedComplaints = [...complaints];
        updatedComplaints[editIndex] = updatedComplaint;
        setComplaints(updatedComplaints);
        setEditIndex(-1); // Exit edit mode
      } else {
        console.error('Failed to save complaint');
      }
    } catch (error) {
      console.error('Error saving complaint:', error);
    }
  };

  // Handle delete complaint
  const handleDeleteClick = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/complaints/${id}`, { method: 'DELETE' });

      if (response.ok) {
        setComplaints((prevComplaints) => prevComplaints.filter((complaint) => complaint._id !== id));
        console.log('Deleted successfully');
      } else {
        console.error('Failed to delete complaint');
      }
    } catch (error) {
      console.error('Error deleting complaint:', error);
    }
  };

  // Print the complaints/FAQ table
  const handlePrintClick = async () => {
    const element = document.getElementById('printableTable');
    const canvas = await html2canvas(element);
    const imgData = canvas.toDataURL('image/png');

    const pdf = new jsPDF();
    pdf.setFontSize(18);
    pdf.text('Company Complaints/FAQ', 10, 10);
    pdf.setFontSize(12);
    pdf.text('Complaint/FAQ Report - ' + new Date().toLocaleDateString(), 10, 20);
    pdf.addImage(imgData, 'PNG', 10, 30, 190, 0);

    pdf.save('complaints_faqs.pdf');
  };

  // Filter complaints based on search query
  const filteredComplaints = complaints.filter((complaint) =>
    complaint.customerName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="table-container">
      <h2>Manage Complaints & FAQs</h2>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search by customer name"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="search-bar"
      />

      <button onClick={() => handlePrintClick()} className="print-btn">
        Print Report
      </button>

      <div id="printableTable">
        <table className="complaint-table">
          <thead>
            <tr>
              <th>Customer Name</th>
              <th>Category</th>
              <th>Email</th>
              <th>Phone Number</th>
              <th>Complaint Details</th>
              <th>Order ID</th>
              <th>Date of Incident</th>
              <th>Image</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredComplaints.map((complaint, index) => (
              <tr key={complaint._id}>
                {editIndex === index ? (
                  <>
                    <td>
                      <input
                        type="text"
                        name="customerName"
                        value={editFormData.customerName}
                        onChange={handleEditChange}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        name="complaintCategory"
                        value={editFormData.complaintCategory}
                        onChange={handleEditChange}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        name="email"
                        value={editFormData.email}
                        onChange={handleEditChange}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        name="phoneNumber"
                        value={editFormData.phoneNumber}
                        onChange={handleEditChange}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        name="complaintDetails"
                        value={editFormData.complaintDetails}
                        onChange={handleEditChange}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        name="orderId"
                        value={editFormData.orderId}
                        onChange={handleEditChange}
                      />
                    </td>
                    <td>
                      <input
                        type="date"
                        name="dateOfIncident"
                        value={new Date(editFormData.dateOfIncident).toISOString().substring(0, 10)}
                        onChange={handleEditChange}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        name="image"
                        value={editFormData.image}
                        onChange={handleEditChange}
                      />
                    </td>
                    <td>
                      <button onClick={handleSaveClick} className="save-btn">
                        Save
                      </button>
                    </td>
                  </>
                ) : (
                  <>
                    <td>{complaint.customerName}</td>
                    <td>{complaint.complaintCategory}</td>
                    <td>{complaint.email}</td>
                    <td>{complaint.phoneNumber}</td>
                    <td>{complaint.complaintDetails}</td>
                    <td>{complaint.orderId}</td>
                    <td>{new Date(complaint.dateOfIncident).toLocaleDateString()}</td>
                    <td>
                      <img
                        src={complaint.image}
                        alt="Complaint evidence"
                        style={{ width: '100px', height: '100px' }}
                      />
                    </td>
                    <td>
                      <button onClick={() => handleEditClick(index)} className="edit-btn">
                        Edit
                      </button>
                      <button onClick={() => handleDeleteClick(complaint._id)} className="delete-btn">
                        Delete
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageFaqComplain;
