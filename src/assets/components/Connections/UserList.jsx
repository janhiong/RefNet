import React, { useEffect, useState } from 'react'
import UserContainer from './UserContainer'
import "./UserList.css"
import placeholder from "/src/assets/photos/placeholderperson.jpg"


const UserList = () => {
  const [friends, setFriends] = useState([])

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/users');
      const data = await response.json();
      
      setFriends(data);
    } catch (err) {
      console.error('Error fetching users:', err);
    }
  }
  
  const handleSendRequest = (id) => {
    
  }

  return (
    <div className='connections-grid-wrapper'>
      <div className="connections-grid">
        {friends.length > 0 ? (
          friends.map((user) => (
            <UserContainer
              key={user.id}
              user={user}
              onClick={handleSendRequest}
            />
          ))
        ) : (
          <p>No users available.</p>
        )}
      </div>
    </div>
  )
}

export default UserList
