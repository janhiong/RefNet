import React, { useEffect, useState } from 'react'
import UserContainer from './UserContainer'
import "./UserList.css"


const UserList = () => {
  const [friends, setFriends] = useState([])
  const [connectionMap, setConnectionMap] = useState({})
  

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    try {
      const token = localStorage.getItem('token')
  
      const [usersRes, connRes] = await Promise.all([
        fetch('http://localhost:4000/api/users'),
        fetch('http://localhost:4000/api/my-connections', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ])
  
      const users = await usersRes.json()
      const connections = await connRes.json()
  
      const map = {}
      for (let user of users) {
        if (connections.connected.includes(user.id)) map[user.id] = 'connected'
        else if (connections.sent.includes(user.id)) map[user.id] = 'sent'
        else if (connections.pending.includes(user.id)) map[user.id] = 'pending'
        else map[user.id] = null
      }
  
      setFriends(users)
      setConnectionMap(map)
    } catch (err) {
      console.error('Error loading users or connections:', err)
    }
  }
  
  
  const handleSendRequest = async (targetUserId) => {
    try {
      const token = localStorage.getItem('token')
  
      const res = await fetch('http://localhost:4000/api/toggle-connection', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ targetUserId })
      })
  
      const data = await res.json()
  
      if (res.ok) {
        console.log(data.message)
        loadUsers()
      } else {
        console.error(data.message)
      }
      await loadUsers()
      
    } catch (err) {
      console.error('Error toggling connection:', err)
    }
  }
  

  return (
    <div className='connections-grid-wrapper'>
      <div className="connections-grid">
        {friends.length > 0 ? (
          friends.map((user) => (
            <UserContainer
              key={user.id}
              user={user}
              connectionStatus={connectionMap[user.id]}
              onClick={() => handleSendRequest(user.id)}
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
