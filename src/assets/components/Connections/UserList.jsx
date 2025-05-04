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
      
      // Assuming the API returns an array of users
      setFriends(data);
    } catch (err) {
      console.error('Error fetching users:', err);
    }
  }
  
  const handleSendRequest = (id) => {
    
  }


  return (
    <div className="user-list">
      {friends.length > 0 ? (
        friends.map((user) => (
          <UserContainer
            key={user.id} // Assuming the user object contains a unique 'id'
            user={user}
          />
        ))
      ) : (
        <p>No users available.</p>
      )}
    </div>
  )
}

export default UserList
