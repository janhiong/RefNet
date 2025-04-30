import React, { useState, useEffect } from "react";
import "./FriendRequest.css";

const FriendRequest = () => {
  const [users, setUsers] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [receivedRequests, setReceivedRequests] = useState([]);
  const [connections, setConnections] = useState([]);

  useEffect(() => {
    const mockUsers = [
      {
        id: 1,
        name: "Alice Johnson",
        email: "alice@demo.com",
        title: "Software Engineer at Google",
        avatar: "https://ui-avatars.com/api/?name=Alice+Johnson",
      },
      {
        id: 2,
        name: "Bob Smith",
        email: "bob@demo.com",
        title: "Product Manager at Meta",
        avatar: "https://ui-avatars.com/api/?name=Bob+Smith",
      },
      {
        id: 3,
        name: "Charlie Nguyen",
        email: "charlie@demo.com",
        title: "Frontend Developer at Netflix",
        avatar: "https://ui-avatars.com/api/?name=Charlie+Nguyen",
      },
    ];

    setUsers(mockUsers);
  }, []);

  const sendRequest = (user) => {
    if (!sentRequests.includes(user.id)) {
      setSentRequests([...sentRequests, user.id]);
    }
  };

  const unsendRequest = (user) => {
    setSentRequests(sentRequests.filter((id) => id !== user.id));
  };

  const acceptRequest = (user) => {
    setConnections([...connections, user]);
    setReceivedRequests(receivedRequests.filter((id) => id !== user.id));
  };

  const suggestedUsers = users.filter(
    (user) =>
      !sentRequests.includes(user.id) &&
      !connections.some((conn) => conn.id === user.id)
  );

  const pendingRequests = users.filter((user) =>
    receivedRequests.includes(user.id)
  );

  const sentRequestUsers = users.filter((user) =>
    sentRequests.includes(user.id)
  );

  return (
    <div className="friend-request-container">
      <h2>Connect with People</h2>

      <div className="friend-section">
        <h3>Suggested Users</h3>
        {suggestedUsers.length > 0 ? (
          <ul className="friend-list">
            {suggestedUsers.map((user) => (
              <li key={user.id} className="friend-box">
                <img
                  src={user.avatar || "/path/to/placeholder-avatar.png"}
                  alt="avatar"
                  className="friend-avatar"
                />
                <div className="friend-info">
                  <div className="friend-name">{user.name}</div>
                  <div className="friend-title"><small>{user.title || user.email} </small></div>
                </div>
                <button
                  onClick={() => sendRequest(user)}
                  disabled={sentRequests.includes(user.id)}
                >
                  {sentRequests.includes(user.id) ? "Request Sent" : "Connect"}
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No suggestions at the moment.</p>
        )}
      </div>

      <div className="friend-section">
        <h3>Pending Requests</h3>
        {pendingRequests.length > 0 ? (
          <ul>
            {pendingRequests.map((user) => (
              <li key={user.id} className="friend-box">
                <img
                  src={user.avatar || "/path/to/placeholder-avatar.png"}
                  alt="avatar"
                  className="friend-avatar"
                />
                <div className="friend-info">
                  <span className="friend-name">{user.name}</span>
                  <small>{user.title || user.email}</small>
                </div>
                <button onClick={() => acceptRequest(user)}>Accept</button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No pending requests.</p>
        )}
      </div>

      <div className="friend-section">
        <h3>Your Connections</h3>
        {connections.length > 0 ? (
          <ul className="friend-list">
            {connections.map((user) => (
              <li key={user.id} className="friend-box">
                <img
                  src={user.avatar || "/path/to/placeholder-avatar.png"}
                  alt="avatar"
                  className="friend-avatar"
                />
                <div className="friend-info">
                  <span className="friend-name">{user.name}</span>
                  <small>{user.title || user.email}</small>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>No connections yet.</p>
        )}
      </div>

      <div className="friend-section">
        <h3>Sent Requests</h3>
        {sentRequestUsers.length > 0 ? (
          <ul className="friend-list">
            {sentRequestUsers.map((user) => (
              <li key={user.id} className="friend-box">
                <img
                  src={user.avatar || "/path/to/placeholder-avatar.png"}
                  alt="avatar"
                  className="friend-avatar"
                />
                <div className="friend-info">
                  <span className="friend-name">{user.name}</span>
                  <small>{user.title || user.email}</small>
                </div>
                <button onClick={() => unsendRequest(user)}>Unsend</button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No sent requests.</p>
        )}
      </div>
    </div>
  );
};

export default FriendRequest;
