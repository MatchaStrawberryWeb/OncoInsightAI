import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "../css/AdminDashboard.css";

function AdminDashboard() {
    const [users, setUsers] = useState([]);
    const [newUser, setNewUser] = useState({ username: '', password: '' });
    const [editingUser, setEditingUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [loadingAdd, setLoadingAdd] = useState(false);
    const [loadingEdit, setLoadingEdit] = useState(false);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    // Define handleEditUser function
    const handleEditUser = (user) => {
        setEditingUser(user);
    };

    // Fetch the list of users
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

    // Handle adding a new user
    const handleAddUser = async () => {
        setLoadingAdd(true);
        try {
            const response = await axios.post('http://localhost:8000/admin/users', {
                username: newUser.username,
                password: newUser.password,
            });

            if (response.status === 200 || response.status === 201) {
                setNewUser({ username: '', password: '' });
                fetchUsers();
                alert('User added successfully');
            } else {
                setError('Failed to add user');
            }
        } catch (error) {
            setError('Error adding user');
            console.error('Error:', error.response?.data || error.message);
        } finally {
            setLoadingAdd(false);
        }
    };

    // Handle deleting a user
    const handleDeleteUser = async (userId) => {
        setLoading(true);
        try {
            const response = await axios.delete(`http://localhost:8000/admin/users/${userId}`);
            if (response.status === 200) {
                setUsers(users.filter(user => user.id !== userId));
                setError('');
                alert('User deleted successfully');
            } else {
                setError('Failed to delete user');
            }
        } catch (error) {
            setError('Error deleting user');
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    // Handle updating user details
    const handleUpdateUser = async () => {
        setLoadingEdit(true);
        try {
            const response = await axios.put(`http://localhost:8000/admin/users/${editingUser.id}`, {
                username: editingUser.username,
                password: editingUser.password,
            });

            if (response.status === 200) {
                setEditingUser(null);
                fetchUsers();
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

    // Filter users based on the search term
    const filteredUsers = searchTerm
        ? users.filter(user =>
            user.username.toLowerCase().includes(searchTerm.toLowerCase())
        )
        : users;

    // Handle logout
    const handleLogout = () => {
        // Perform the logout operation (like clearing session or redirecting)
        alert("Logging out...");
        // You can redirect to the login page or clear session/cookies
        window.location.href = "/login";
    };

    return (
        <div className="admin-dashboard-container">
            {/* Logout Button */}
            <div className="logout-button-container">
                <button className="logout-btn" onClick={handleLogout}>Logout</button>
            </div>

            <h2>Admin Dashboard</h2>
            {/* Navigation */}
            <nav>
                <a href="/admin/activity-logs">Activity Logs</a>
            </nav>
            {error && <p className="error-message">{error}</p>}

            {/* Add User Form */}
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
                    <button onClick={handleAddUser} disabled={loadingAdd}>
                        {loadingAdd ? 'Adding User...' : 'Add User'}
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
                            placeholder="Password (optional)"
                            value={editingUser.password || ''}
                            onChange={(e) => setEditingUser({ ...editingUser, password: e.target.value })}
                        />
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
                    placeholder="Search username..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <div className="table-container">
                {loading && <p>Loading users...</p>}
                <table>
                    <thead>
                        <tr>
                            <th>Username</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.map(user => (
                            <tr key={user.id}>
                                <td>{user.username}</td>
                                <td>
                                    <button className="edit-btn" onClick={() => handleEditUser(user)}>
                                        Edit
                                    </button>
                                    <button className="delete-btn" onClick={() => handleDeleteUser(user.id)}>
                                        Delete
                                    </button>
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
