import React, { useState, useEffect } from "react";
import "./FriendRequest.css";

const FriendRequest = () => {
  const [users, setUsers] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [receivedRequests, setReceivedRequests] = useState([]);
  const [connections, setConnections] = useState([]);

  // Fetch users (simulated API)
  useEffect(() => {
    fetch("http://localhost:4000/api/users")
      .then((response) => response.json())
      .then((data) => setUsers(data));
  }, []);

  // Send Connection Request
  const sendRequest = (user) => {
    if (!sentRequests.includes(user.id)) {
      setSentRequests([...sentRequests, user.id]);
    }
  };

  // Accept Connection Request
  const acceptRequest = (user) => {
    setConnections([...connections, user]);
    setReceivedRequests(receivedRequests.filter((id) => id !== user.id));
  };

  return (
    <div className="friend-request-container">
      <h2>Connect with People</h2>
      
      <h3>Suggested Users</h3>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            {user.name} ({user.email})
            <button
              onClick={() => sendRequest(user)}
              disabled={sentRequests.includes(user.id)}
            >
              {sentRequests.includes(user.id) ? "Request Sent" : "Connect"}
            </button>
          </li>
        ))}
      </ul>
      
      <h3>Pending Requests</h3>
      <ul>
        {users.filter(user => receivedRequests.includes(user.id)).map((user) => (
          <li key={user.id}>
            {user.name} ({user.email})
            <button onClick={() => acceptRequest(user)}>Accept</button>
          </li>
        ))}
      </ul>

      <h3>Your Connections</h3>
      <ul>
        {connections.map((user) => (
          <li key={user.id}>{user.name} ({user.email})</li>
        ))}
      </ul>
    </div>
  );
};

export default FriendRequest;
