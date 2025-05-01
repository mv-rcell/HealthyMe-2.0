import { useEffect, useState } from 'react';

const TrackingPage = () => {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const token = JSON.parse(localStorage.getItem('user'))?.token;
      const response = await axios.get('https://healthy-me-back-end.vercel.app/api/users/me', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setUserData(response.data);
    };
    fetchUser();
  }, []);

  return (
    <div>
      <h1>Tracking Progress</h1>
      {userData ? (
        <div>
          <p>Weight: {userData.weight} kg</p>
          <p>Email: {userData.email}</p>
        </div>
      ) : (
        <p>Loading user data...</p>
      )}
    </div>
  );
};

export default TrackingPage;
