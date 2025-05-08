import { useEffect, useState } from 'react'
import './UserList.css'

const UserContainer = ({ user, onClick, connectionStatus }) => {
  const { name, role, bio } = user.profile || {};
  const displayName = name || 'Anonymous';
  const displayRole = role || 'No role provided';
  const displayBio = bio || 'No bio provided';
  
  const email = user.email || 'No email provided';
  const avatarUrl = user.avatarUrl || '../images/default-avatar.jpg';
  const resumeUrl = user.resumeUrl || ''

  const [buttonLabel, setButtonLabel] = useState('Connect')

  useEffect(() => {
    if (connectionStatus === 'sent') {
      setButtonLabel('Cancel Request')
    }
    else if (connectionStatus === 'pending') {
      setButtonLabel('Accept')
    }
    else if (connectionStatus === 'connected') {
      setButtonLabel('Disconnect')
    }
    else {
      setButtonLabel('Connect')
    }
  }, [connectionStatus])

  return (
    <div className='user-container'>
      <p className='user-profile-name'>{displayName}</p>
      <p className='user-profile-email'>{email}</p>
      <hr style={{ width: '100%', border: 'none', height: '1px', backgroundColor: '#ccc' }} />
      <p className='user-profile-role'>{displayRole}</p>
      <p className='user-profile-bio'>{displayBio}</p>
      <img className='user-profile-image' src={avatarUrl} alt={`${displayName}'s avatar`} />
      {resumeUrl && <a href={resumeUrl} width="100%" height="500px" title="Resume Preview" className="connections-resume-link">View Resume</a>}
      {!resumeUrl && <p className='no-resume-text'>This user has no resume uploaded.</p>}
      <button className='connect-button' onClick={onClick}>
        {buttonLabel}
      </button>
    </div>
  );
};

export default UserContainer;