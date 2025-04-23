import React, { useEffect, useState } from 'react';
import "./FriendRequest.css";
import placeholder from '../images/placeholderperson.jpg';


const App = () => {
  const [friends, setFriends] = useState([]);

  useEffect(() => {
    fetch('http://localhost:4000/api/emails')
      .then(res => res.json())
      .then(data => {
        const mappedData = data.map((item, index) => ({
          id: index + 1, 
          name: item.email, 
          requestSent: false, 
          image: placeholder, 
        }));
        setFriends(mappedData);
      })
      .catch(err => console.error('Error fetching emails:', err));
  }, []); 

  const handleSendRequest = (index) => {
    const updatedFriends = [...friends];
    updatedFriends[index].requestSent = true; // Mark the friend as having a request sent
    setFriends(updatedFriends);
    console.log(index)
  };

  return (
    <div className="friends-list">
      <h2>Recommended Connections</h2>
      <div className="grid">
        {friends.map((friend, index) => (
          <div key={friend.id} className="friend-box">
            <img src={friend.image} alt={friend.name} className="friend-image" />
            <p>{friend.name}</p>
            {friend.requestSent ? (
              <button disabled>Request Sent</button>
            ) : (
              <button onClick={() => handleSendRequest(index)}>Send Request</button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
