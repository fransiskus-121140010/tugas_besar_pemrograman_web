// src/components/common/Footer.js
import React from 'react';
import './Footer.css';

function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="footer">
      <p>&copy; {currentYear} Minerva Pro Audio. All Rights Reserved.</p> {/* <<< NAMA TOKO DIGANTI DI SINI */}
      <p>
        Follow us on:
        <a href="#!" style={{ margin: '0 5px' }}>Facebook</a> |
        <a href="#!" style={{ margin: '0 5px' }}>Instagram</a> |
        <a href="#!" style={{ margin: '0 5px' }}>Twitter</a>
      </p>
    </footer>
  );
}

export default Footer;