//router componetns
import { Link, useLocation } from 'react-router-dom';

import './Footer.css';

const Footer = () => {
  const location = useLocation();

  return (
    <footer 
      className={`
      d-flex 
      flex-wrap 
      justify-content-between 
      align-items-center 
      text-secondary 
      py-4
      px-5
      footer
      bg-white
      fixed-bottom
      `}
      style={{
        boxShadow: '0px -4px 8px -2px #bababa',
        maxHeight: '8rem'
      }}>
      <div className='col-md-4 d-flex justify-content-start align-items-center'>
        <span className='text-muted align-middle'>© 2023 Ramsés Mata</span>
      </div>

      <ul className="nav col-md-4 justify-content-end list-unstyled d-flex">
        <li className="ms-3 fs-3"><Link to='https://github.com/RamMaths' className='text-secondary'><i className="bi bi-github"></i></Link></li>
        <li className="ms-3 fs-3"><Link to='https://www.instagram.com/ram_app.rs/' className='text-secondary'><i className="bi bi-instagram"></i></Link></li>
      </ul>
    </footer>
  )
};

export default Footer;
