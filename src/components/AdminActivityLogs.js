import React, { useState, useEffect } from 'react';
import axios from 'axios';

function AdminActivityLogs() {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchLogs = async () => {
            setLoading(true);
            try {
                const response = await axios.get('http://localhost:8000/admin/activity_logs');
                setLogs(response.data);
                setError('');
            } catch (error) {
                setError('Failed to fetch activity logs');
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchLogs();
    }, []);

    return (
        <div className="activity-logs-container">
            <h2>Activity Logs</h2>
            {error && <p className="error-message">{error}</p>}
            {loading ? (
                <p>Loading logs...</p>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>User ID</th>
                            <th>Activity Type</th>
                            <th>Details</th>
                            <th>Timestamp</th>
                        </tr>
                    </thead>
                    <tbody>
                        {logs.map((log) => (
                            <tr key={log.id}>
                                <td>{log.user_id}</td>
                                <td>{log.activity_type}</td>
                                <td>{log.details}</td>
                                <td>{new Date(log.timestamp).toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default AdminActivityLogs;
