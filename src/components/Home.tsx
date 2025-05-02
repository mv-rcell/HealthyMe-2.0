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

      <div onClick={() => navigate('/physiotherapy')} className="service-box">...</div>
      <div onClick={() => navigate('/nutrition')} className="service-box">...</div>
      <div onClick={() => navigate('/massage-therapy')} className="service-box">...</div>
      <div onClick={() => navigate('/fitness')} className="service-box">...</div>
      <div onClick={() => navigate('/caregiving')} className="service-box">...</div>
      <div onClick={() => navigate('/wellness')} className="service-box">...</div>
      <div onClick={() => navigate('/doctor-reviews')} className="service-box">...</div>
      <div onClick={() => navigate('/health-checkups')} className="service-box">...</div>
      <div onClick={() => navigate('/test-programs')} className="service-box">...</div>

    </section>
  );
};

export default Home;
