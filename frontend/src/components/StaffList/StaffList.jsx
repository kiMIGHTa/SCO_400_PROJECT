import React, { useEffect, useState } from "react";
import restaurantApis from "../../apiUtils/restaurant";
import "./StaffList.css";

const StaffList = ({ restaurantId }) => {
  const [staff, setStaff] = useState([]);
  const [error, setError] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [formData, setFormData] = useState({
    email: "",
    role: "cashier",
    is_staff: true
  });

  useEffect(() => {
    fetchStaff();
  }, [restaurantId]);

  const fetchStaff = async () => {
    try {
      const staffData = await restaurantApis.getRestaurantStaff(restaurantId);
      console.log("Fetched staff data:", staffData);
      setStaff(staffData);
    } catch (error) {
      console.error("Error fetching staff:", error);
      setError("Failed to fetch staff.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    console.log("Submitting form data:", formData);

    try {
      if (editingMember) {
        console.log("Updating staff member:", editingMember.id, "with data:", formData);
        await restaurantApis.updateStaffMember(editingMember.id, {
          role: formData.role,
          is_staff: formData.is_staff
        });
      } else {
        console.log("Adding new staff member with data:", formData);
        await restaurantApis.addStaffMember(restaurantId, formData);
      }
      setIsAdding(false);
      setEditingMember(null);
      setFormData({
        email: "",
        role: "cashier",
        is_staff: true
      });
      fetchStaff();
    } catch (error) {
      console.error("Error saving staff member:", error);
      console.error("Error response:", error.response?.data);
      const errorMessage = error.response?.data?.detail ||
        error.response?.data?.message ||
        "Failed to save staff member";
      setError(errorMessage);
    }
  };

  const handleStatusToggle = async (member) => {
    try {
      console.log("Toggling staff status:", member.id, "to:", !member.user.is_staff);
      await restaurantApis.updateStaffStatus(member.id, !member.user.is_staff);
      fetchStaff();
    } catch (error) {
      console.error("Error updating staff status:", error);
      console.error("Error response:", error.response?.data);
      setError("Failed to update staff status.");
    }
  };

  const handleDelete = async (staffId) => {
    if (window.confirm("Are you sure you want to remove this staff member?")) {
      try {
        console.log("Deleting staff member:", staffId);
        await restaurantApis.removeStaffMember(staffId);
        fetchStaff();
      } catch (error) {
        console.error("Error removing staff member:", error);
        console.error("Error response:", error.response?.data);
        setError("Failed to remove staff member.");
      }
    }
  };

  const handleEdit = (member) => {
    console.log("Editing staff member:", member);
    setEditingMember(member);
    setFormData({
      email: member.user.email,
      role: member.role,
      is_staff: member.user.is_staff
    });
    setIsAdding(true);
  };

  useEffect(() => {
    console.log("Staff state updated:", staff);
  }, [staff]);

  return (
    <div className="staff-list">
      <div className="staff-list-header">
        <h3>Staff Members</h3>
        <button
          className="add-button"
          onClick={() => {
            console.log("Adding new staff member");
            setIsAdding(true);
            setEditingMember(null);
            setFormData({
              email: "",
              role: "cashier",
              is_staff: true
            });
          }}
        >
          Add New Staff
        </button>
      </div>

      {error && <p className="error-message">{typeof error === 'string' ? error : JSON.stringify(error)}</p>}

      {(isAdding || editingMember) && (
        <form className="staff-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              disabled={!!editingMember}
            />
          </div>
          <div className="form-group">
            <label htmlFor="role">Role:</label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleInputChange}
              required
            >
              <option value="manager">Manager</option>
              <option value="chef">Chef</option>
              <option value="cashier">Cashier</option>
            </select>
          </div>
          {editingMember && (
            <div className="form-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="is_staff"
                  checked={formData.is_staff}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    is_staff: e.target.checked
                  }))}
                />
                Staff Access
              </label>
            </div>
          )}
          <div className="form-buttons">
            <button type="submit" className="submit-button">
              {editingMember ? "Update" : "Add"}
            </button>
            <button
              type="button"
              className="cancel-button"
              onClick={() => {
                console.log("Canceling form");
                setIsAdding(false);
                setEditingMember(null);
                setFormData({
                  email: "",
                  role: "cashier",
                  is_staff: true
                });
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <ul className="staff-items-list">
        {staff.map((member) => {
          console.log("Rendering staff member:", member);
          return (
            <li key={member.id} className="staff-item">
              <div className="staff-item-content">
                <div className="staff-item-details">
                  <div className="staff-info">
                    <h4 className="staff-name">
                      {member.user.first_name} {member.user.last_name}
                    </h4>
                    <div className="staff-role">
                      <span className="role-badge">{member.role}</span>
                    </div>
                  </div>
                  <div className="staff-contact">
                    <p className="email">
                      <i className="fas fa-envelope"></i> {member.user.email}
                    </p>
                    {member.user.contact && (
                      <p className="contact">
                        <i className="fas fa-phone"></i> {member.user.contact}
                      </p>
                    )}
                  </div>
                  <div className="staff-status">
                    <button
                      className={`status-badge ${member.user.is_staff ? 'active' : 'inactive'}`}
                      onClick={() => handleStatusToggle(member)}
                      title={member.user.is_staff ? "Click to revoke staff access" : "Click to grant staff access"}
                    >
                      {member.user.is_staff ? "Staff Access" : "No Access"}
                    </button>
                  </div>
                </div>
              </div>
              <div className="staff-item-actions">
                <button
                  className="edit-button"
                  onClick={() => handleEdit(member)}
                  title="Edit staff member"
                >
                  <i className="fas fa-edit"></i> Edit
                </button>
                <button
                  className="delete-button"
                  onClick={() => handleDelete(member.id)}
                  title="Remove staff member"
                >
                  <i className="fas fa-trash"></i> Remove
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default StaffList;