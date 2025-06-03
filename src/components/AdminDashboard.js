import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "../css/AdminDashboard.css";

function AdminDashboard() {
    const [users, setUsers] = useState([]);
    const [newUser, setNewUser] = useState({
        username: '',
        password: '',
        full_name: '',
        email: '',
        department: '',
    });
    const [editingUser, setEditingUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [loadingAdd, setLoadingAdd] = useState(false);
    const [loadingEdit, setLoadingEdit] = useState(false);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    const departments = ['Breast', 'Prostate', 'Lung', 'Colorectal', 'Skin'];
    const [roleFilter, setRoleFilter] = React.useState("");
    const [departmentFilter, setDepartmentFilter] = React.useState("");


    const filteredUsers = users.filter(user => {
        const username = user.username?.toLowerCase() || "";
        const fullName = user.full_name?.toLowerCase() || "";
        const search = searchTerm.toLowerCase();

        const matchesSearch = username.includes(search) || fullName.includes(search);

        const userRole = username.startsWith("doctor") ? "doctor"
            : username.startsWith("nurse") ? "nurse"
                : "";

        const matchesRole = roleFilter ? userRole === roleFilter.toLowerCase() : true;
        const matchesDepartment = departmentFilter ? user.department === departmentFilter : true;

        return matchesSearch && matchesRole && matchesDepartment;
    });



    const logActivityType = async (userId, activityType, details) => {
        try {
            await axios.post('http://localhost:8000/admin/activity-log', {
                user_id: userId,
                activity_type: activityType,
                details: details,
            });
        } catch (error) {
            console.error('Activity log failed:', error);
        }
    };

    const handleEditUser = (user) => {
        setEditingUser(user);
    };

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const result = await axios.get('http://localhost:8000/admin/users');
            setUsers(result.data);
            setError('');
        } catch (error) {
            setError('Failed to fetch users');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleAddUser = async () => {
        setLoadingAdd(true);
        try {
            const response = await axios.post('http://localhost:8000/admin/users', newUser);
            if (response.status === 200 || response.status === 201) {
                const createdUser = response.data;
                setNewUser({ username: '', password: '', full_name: '', email: '', department: '' });
                fetchUsers();

                await logActivityType(
                    createdUser.id,
                    'Add User',
                    `Added user ${createdUser.username}`
                );

                alert('User added successfully');
            } else {
                setError('Failed to add user');
            }
        } catch (error) {
            setError('Error adding user. Username might already exist.');
            console.error('Error:', error.response?.data || error.message);
        } finally {
            setLoadingAdd(false);
        }
    };

    const handleDeleteUser = async (userId) => {
        const email = prompt("Please enter the user's email address to confirm deletion:");
        if (!email) {
            alert("Email is required to deactivate the user.");
            return;
        }

        try {
            const response = await fetch("http://localhost:8000/admin/deactivate_user", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ user_id: userId, email }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                alert(`Failed to deactivate user: ${errorData.detail || response.statusText}`);
                return;
            }

            await response.json();
            alert("User deleted. Email has been sent to the user.");
            fetchUsers();
        } catch (error) {
            console.error("Error deactivating user:", error);
            alert("An unexpected error occurred.");
        }
    };

    const handleUpdateUser = async () => {
        setLoadingEdit(true);
        try {
            const response = await axios.put(`http://localhost:8000/admin/users/${editingUser.id}`, editingUser);

            if (response.status === 200) {
                setEditingUser(null);
                fetchUsers();
                await logActivityType(
                    editingUser.id,
                    'Edit User',
                    `Updated user ${editingUser.username}`
                );
            } else {
                setError('Failed to update user');
            }
        } catch (error) {
            console.error('Error:', error);
            if (error.response && error.response.data) {
                setError(error.response.data.message || 'Error occurred');
            } else {
                setError('Unexpected error occurred');
            }
        } finally {
            setLoadingEdit(false);
        }
    };

    const handleLogout = async () => {
        alert("Logging out...");
        await logActivityType('admin', 'Logout', 'Admin logged out');
        window.location.href = "/login";
    };

    return (
        <div className="admin-dashboard-container">
            <div className="logout-button-container">
                <button className="logout-btn" onClick={handleLogout}>Logout</button>
            </div>

            <h2>Admin Dashboard</h2>
            <nav>
                <a href="/admin/activity-logs">Activity Logs</a>
            </nav>
            {error && <p className="error-message">{error}</p>}

            {/* Add New User Form */}
            <div className="form-container">
                <h3>Add New User</h3>
                <div className="input-group">
                    <input
                        type="text"
                        placeholder="Username"
                        value={newUser.username}
                        onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={newUser.password}
                        onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                    />
                    <input
                        type="text"
                        placeholder="Full Name"
                        value={newUser.full_name}
                        onChange={(e) => setNewUser({ ...newUser, full_name: e.target.value })}
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        value={newUser.email}
                        onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    />
                    <select
                        value={newUser.department}
                        onChange={(e) => setNewUser({ ...newUser, department: e.target.value })}
                    >
                        <option value="">Select Department</option>
                        {departments.map((dept, index) => (
                            <option key={index} value={dept}>{dept}</option>
                        ))}
                    </select>
                    <button onClick={handleAddUser} disabled={loadingAdd}>
                        {loadingAdd ? 'Adding...' : 'Add User'}
                    </button>
                </div>
            </div>

            {/* Edit User Form */}
            {editingUser && (
                <div className="form-container">
                    <h3>Edit User</h3>
                    <div className="input-group">
                        <input
                            type="text"
                            placeholder="Username"
                            value={editingUser.username}
                            onChange={(e) => setEditingUser({ ...editingUser, username: e.target.value })}
                        />
                        <input
                            type="password"
                            placeholder="Password (leave blank to keep current)"
                            value={editingUser.password || ''}
                            onChange={(e) => setEditingUser({ ...editingUser, password: e.target.value })}
                        />
                        <input
                            type="text"
                            placeholder="Full Name"
                            value={editingUser.full_name || ''}
                            onChange={(e) => setEditingUser({ ...editingUser, full_name: e.target.value })}
                        />
                        <input
                            type="email"
                            placeholder="Email"
                            value={editingUser.email || ''}
                            onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                        />
                        <select
                            value={editingUser.department || ''}
                            onChange={(e) => setEditingUser({ ...editingUser, department: e.target.value })}
                        >
                            <option value="">Select Department</option>
                            {departments.map((dept, index) => (
                                <option key={index} value={dept}>{dept}</option>
                            ))}
                        </select>
                        <button onClick={handleUpdateUser} disabled={loadingEdit}>
                            {loadingEdit ? 'Updating...' : 'Update User'}
                        </button>
                        <button onClick={() => setEditingUser(null)}>Cancel</button>
                    </div>
                </div>
            )}

            {/* User List */}
            <h3>User List</h3>
            <div className="search-container">
                <input
                    type="text"
                    className="search-input"
                    placeholder="Search username or full name"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                
                {/* Role filter dropdown */}
                <label>Filter by Role:</label>
                <select onChange={(e) => setRoleFilter(e.target.value)}>
                    <option value="">All</option>
                    <option value="doctor">Doctor</option>
                    <option value="nurse">Nurse</option>
                </select>

                {/* Department filter dropdown */}
                <label>Filter by Department:</label>
                <select onChange={(e) => setDepartmentFilter(e.target.value)}>
                    <option value="">All Departments</option>
                    <option value="Breast">Breast</option>
                    <option value="Prostate">Prostate</option>
                    <option value="Lung">Lung</option>
                    <option value="Colorectal">Colorectal</option>
                    <option value="Skin">Skin</option>
                </select>

            </div>

            <div className="table-container">
                {loading && <p>Loading users...</p>}
                <table>
                    <thead>
                        <tr>
                            <th>Username</th>
                            <th>Full Name</th>
                            <th>Email</th>
                            <th>Department</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.map(user => (
                            <tr key={user.id}>
                                <td>{user.username}</td>
                                <td>{user.full_name}</td>
                                <td>{user.email}</td>
                                <td>{user.department}</td>
                                <td>
                                    <button className="edit-btn" onClick={() => handleEditUser(user)}>Edit</button>
                                    <button className="delete-btn" onClick={() => handleDeleteUser(user.id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default AdminDashboard;
