import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './home.css';

export default function Home() {
  const [activeTab, setActiveTab] = useState('inicio');
  const navigate = useNavigate();

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    navigate('/login');
  };

  const news = [
    { id: 1, title: 'Nuevo sistema de calificaciones implementado', date: '2023-05-15' },
    { id: 2, title: 'Próximo evento de ciencias el 20 de junio', date: '2023-05-20' },
    { id: 3, title: 'Resultados de las olimpiadas de matemáticas', date: '2023-05-25' },
  ];

  const subjects = [
    { id: 1, name: 'Matemáticas', grade: 'A', professor: 'Dr. Smith' },
    { id: 2, name: 'Literatura', grade: 'B+', professor: 'Dra. Johnson' },
    { id: 3, name: 'Física', grade: 'A-', professor: 'Prof. Brown' },
    { id: 4, name: 'Historia', grade: 'B', professor: 'Dra. Davis' },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'inicio':
        return (
          <div className="news-portal">
            <h2>Portal de Noticias</h2>
            {news.map((item) => (
              <div key={item.id} className="news-item">
                <h3>{item.title}</h3>
                <p>Fecha: {item.date}</p>
              </div>
            ))}
          </div>
        );
      case 'materias':
        return (
          <div className="subjects-table">
            <h2>Materias</h2>
            <table>
              <thead>
                <tr>
                  <th>Materia</th>
                  <th>Calificación</th>
                  <th>Profesor</th>
                </tr>
              </thead>
              <tbody>
                {subjects.map((subject) => (
                  <tr key={subject.id}>
                    <td>{subject.name}</td>
                    <td>{subject.grade}</td>
                    <td>{subject.professor}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      case 'buscador':
        return (
          <div className="search-section">
            <h2>Buscador</h2>
            <input type="text" placeholder="Buscar..." className="search-input" />
            <button className="search-button">Buscar</button>
          </div>
        );
      case 'contactar':
        return (
          <div className="contact-form">
            <h2>Contactar</h2>
            <form>
              <input type="text" placeholder="Nombre" required />
              <input type="email" placeholder="Correo electrónico" required />
              <textarea placeholder="Mensaje" required></textarea>
              <button type="submit">Enviar</button>
            </form>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="dashboard">
      <aside className="sidebar">
        <h1>Panel de Control</h1>
        <nav className="sidebar-nav">
          <button onClick={() => setActiveTab('inicio')} className={activeTab === 'inicio' ? 'active' : ''}>Inicio</button>
          <button onClick={() => setActiveTab('materias')} className={activeTab === 'materias' ? 'active' : ''}>Materias</button>
          <button onClick={() => setActiveTab('buscador')} className={activeTab === 'buscador' ? 'active' : ''}>Buscador</button>
          <button onClick={() => setActiveTab('contactar')} className={activeTab === 'contactar' ? 'active' : ''}>Contactar</button>
        </nav>
        <button onClick={handleLogout} className="logout-button">Cerrar Sesión</button>
      </aside>
      <main className="dashboard-content">
        {renderContent()}
      </main>
    </div>
  );
}