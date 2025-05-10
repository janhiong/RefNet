import React, { useEffect, useState } from 'react'
import UserContainer from './UserContainer'
import "./FriendRequest.css"

const FriendRequest = () => {
  const [connections, setConnections] = useState([])
  const [connectionMap, setConnectionMap] = useState({})

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    try {
      const token = localStorage.getItem('token')

      const [usersRes, connRes] = await Promise.all([
        fetch(`${import.meta.env.VITE_API_URL}/api/users`),
        fetch(`${import.meta.env.VITE_API_URL}/my-connections`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ])

      const users = await usersRes.json()
      const connections = await connRes.json()

      const map = {}

      for (const user of users) {
        if (connections.connected.includes(user.id)) {
          map[user.id] = 'connected'
        } else if (connections.sent.includes(user.id)) {
          map[user.id] = 'sent'
        } else if (connections.pending.includes(user.id)) {
          map[user.id] = 'pending'
        } else {
          map[user.id] = null
        }
      }

      setConnections(users)
      setConnectionMap(map)
    } catch (err) {
      console.error('Error loading users or connections:', err)
    }
  }

  const handleSendRequest = async (targetUserId) => {
    try {
      const token = localStorage.getItem('token')

      await fetch(`${import.meta.env.VITE_API_URL}/api/toggle-connection`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ targetUserId })
      })

      await loadUsers()
    } catch (err) {
      console.log(err)
    }
  }

  const filterUsers = (status) => {
    return connections.filter(user => connectionMap[user.id] === status)
  }

  return (
    <>
      <div className='connections-header-wrapper'>
        <p className='connections-header'>My Connections</p>
      </div>
      <div className='connections-grid-wrapper'>
        <div className="connections-grid">
          {filterUsers('connected').map((user) => (
            <UserContainer
              key={user.id}
              user={user}
              connectionStatus="connected"
              onClick={() => handleSendRequest(user.id)}
            />
          ))}
        </div>
      </div>

      <div className='connections-header-wrapper'>
        <p className='connections-header'>Sent</p>
      </div>
      <div className='connections-grid-wrapper'>
        <div className="connections-grid">
          {filterUsers('sent').map((user) => (
            <UserContainer
              key={user.id}
              user={user}
              connectionStatus="sent"
              onClick={() => handleSendRequest(user.id)}
            />
          ))}
        </div>
      </div>

      <div className='connections-header-wrapper'>
        <p className='connections-header'>Pending</p>
      </div>
      <div className='connections-grid-wrapper'>
        <div className="connections-grid">
          {filterUsers('pending').map((user) => (
            <UserContainer
              key={user.id}
              user={user}
              connectionStatus="pending"
              onClick={() => handleSendRequest(user.id)}
            />
          ))}
        </div>
      </div>
    </>
  )
}

export default FriendRequest
