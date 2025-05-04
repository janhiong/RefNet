import './UserList.css'

const UserContainer = ({ user, onClick }) => {
  const { name, role, bio } = user.profile || {};

  const displayName = name || 'Anonymous';
  const displayRole = role || 'No role provided';
  const displayBio = bio || 'No bio provided';
  
  const email = user.email || 'No email provided';
  const avatarUrl = user.avatarUrl || '../images/default-avatar.jpg';

  return (
    <div className='user-container'>
      <p className='user-profile-name'>{displayName}</p>
      <p className='user-profile-email'>{email}</p>
      <hr style={{ width: '100%', border: 'none', height: '1px', backgroundColor: '#ccc' }} />
      <p className='user-profile-role'>{displayRole}</p>
      <p className='user-profile-bio'>{displayBio}</p>
      <img className='user-profile-image' src={avatarUrl} alt={`${displayName}'s avatar`} />
      <button className='connect-button' onClick={onClick}> Connect </button>
    </div>
  );
}

export default UserContainer;
