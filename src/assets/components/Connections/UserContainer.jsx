import './UserList.css'

const UserContainer = ({ user }) => {
  // Destructure the profile object
  const { name, role, bio } = user.profile || {}; // Default to empty object if profile is null or undefined

  const displayName = name || 'Anonymous';
  const displayRole = role || 'No role provided';
  const displayBio = bio || 'No bio provided';
  
  const email = user.email || 'No email provided';
  const avatarUrl = user.avatarUrl || '../images/default-avatar.jpg'; // Fallback to placeholder image if no avatar

  return (
    <div className='user-container'>
      <p>{displayName}</p>
      <p>{displayRole}</p>
      <p>{displayBio}</p>
      <p>{email}</p>
      <img className='user-image' src={avatarUrl} alt={`${displayName}'s avatar`} />
    </div>
  );
}

export default UserContainer;
