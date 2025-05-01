import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  return (
    <section className="services">
      <div onClick={() => navigate('/nutrition')} className="service-box">
        <h3>Nutrition</h3>
        <p>Eat healthy everyday...</p>
      </div>

      <div onClick={() => navigate('/fitness')} className="service-box">
        <h3>Fitness</h3>
        <p>Stay active and fit...</p>
      </div>

      <div onClick={() => navigate('/healthcare')} className="service-box">
        <h3>Health Care</h3>
        <p>Monitor your health closely...</p>
      </div>

      <div onClick={() => navigate('/tracking')} className="service-box">
        <h3>Tracking</h3>
        <p>Track your progress...</p>
      </div>
    </section>
  );
};

export default Home;
