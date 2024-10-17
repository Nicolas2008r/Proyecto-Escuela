import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, useScroll, useSpring } from 'framer-motion';
import { Moon, Sun, Menu, X, ChevronDown, Search } from 'lucide-react';
import './info.css';

const navItems = [
  {
    title: 'Institucional',
    href: '#institucional',
    items: [
      { title: 'Autoridades', href: '/autoridades' },
      { title: 'Nuestra Historia', href: '/nuestra-historia' },
      { title: 'Nuestros Objetivos', href: '/objetivos' },
      { title: 'Perfil de Preceptor', href: '/perfil-preceptor' },
      { title: 'Perfil de Egresado', href: '/perfil-egresado' },
      { title: 'Cooperadora', href: '/cooperadora' },
      {
        title: 'Biblioteca',
        items: [
          { title: 'Historia', href: '/biblioteca/historia' },
          { title: 'Reglamento', href: '/biblioteca/reglamento' },
          { title: 'Servicios', href: '/biblioteca/servicios' },
          { title: 'Usuarios', href: '/biblioteca/usuarios' },
        ],
      },
    ],
  },
  {
    title: 'Académico',
    href: '#academico',
    items: [
      { title: 'Turno Noche', href: '/turno-noche' },
      {
        title: 'Plan de Estudios',
        items: [
          { title: 'Ciclo Básico 4145', href: '/plan-estudios/ciclo-basico' },
          { title: 'Taller', href: '/plan-estudios/taller' },
          { title: 'Ciclo Superior Maestro Mayor de Obras 4150', href: '/plan-estudios/mmo' },
          { title: 'Técnico en Computación 4147', href: '/plan-estudios/computacion' },
        ],
      },
    ],
  },
  {
    title: 'Alumnos',
    href: '#alumnos',
    items: [
      { title: 'Atención a Víctimas de Violencia', href: '/atencion-victimas' },
      { title: 'Tutorías', href: '/tutorias' },
      { title: 'Documentación', href: '/documentacion' },
    ],
  },
];

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState('light');
  const [searchQuery, setSearchQuery] = useState('');
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark');
  const navigate = useNavigate();

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  const handleSearch = (e) => {
    e.preventDefault();
    console.log('Searching for:', searchQuery);
  };

  const handleLoginRedirect = () => {
    navigate('/login');
  };

  return (
    <header>
      <motion.div
        className="progress-bar"
        style={{ scaleX }}
      />
      <nav className="container">
        <Link to="/" className="nav-logo">
          <img src="/img/logo.png" alt="logo" />
        </Link>
        <div className="nav-links">
          {navItems.map((item) => (
            <DropdownMenu key={item.href} item={item} />
          ))}
          <button onClick={handleLoginRedirect} className="button-login">
            Iniciar Sesión
          </button>
          <form onSubmit={handleSearch} className="search-form">
            <input
              type="text"
              placeholder="Buscar..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            <button type="submit" className="search-button">
              <Search />
            </button>
          </form>
          <button
            onClick={toggleTheme}
            className="theme-toggle"
          >
            {theme === 'dark' ? <Sun /> : <Moon />}
          </button>
        </div>
        <button
          className="mobile-menu-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </nav>
      {mobileMenuOpen && (
        <MobileMenu items={navItems} setMobileMenuOpen={setMobileMenuOpen} />
      )}
    </header>
  );
};

const DropdownMenu = ({ item }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="dropdown" onMouseEnter={() => setIsOpen(true)} onMouseLeave={() => setIsOpen(false)}>
      <Link to={item.href} className="nav-link">
        {item.title} {item.items && <ChevronDown className="inline-block ml-1" />}
      </Link>
      {item.items && isOpen && (
        <div className="dropdown-content">
          {item.items.map((subItem) => (
            subItem.items ? (
              <NestedDropdown key={subItem.href} item={subItem} />
            ) : (
              <Link key={subItem.href} to={subItem.href} className="dropdown-item">
                {subItem.title}
              </Link>
            )
          ))}
        </div>
      )}
    </div>
  );
};

const NestedDropdown = ({ item }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="nested-dropdown" onMouseEnter={() => setIsOpen(true)} onMouseLeave={() => setIsOpen(false)}>
      <Link to={item.href} className="dropdown-item">
        {item.title} <ChevronDown className="inline-block ml-1" />
      </Link>
      {isOpen && (
        <div className="nested-dropdown-content">
          {item.items.map((subItem) => (
            <Link key={subItem.href} to={subItem.href} className="dropdown-item">
              {subItem.title}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

const MobileMenu = ({ items, setMobileMenuOpen }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="mobile-menu open"
    >
      {items.map((item) => (
        <MobileMenuItem key={item.href} item={item} setMobileMenuOpen={setMobileMenuOpen} />
      ))}
      <Link to="/login" className="mobile-menu-item" onClick={() => setMobileMenuOpen(false)}>
        Iniciar Sesión
      </Link>
    </motion.div>
  );
};

const MobileMenuItem = ({ item, setMobileMenuOpen }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mobile-menu-item">
      <div className="flex justify-between items-center" onClick={() => setIsOpen(!isOpen)}>
        <Link to={item.href} onClick={() => setMobileMenuOpen(false)}>{item.title}</Link>
        {item.items && (isOpen ? <ChevronDown /> : <ChevronDown />)}
      </div>
      {item.items && isOpen && (
        <div className="ml-4">
          {item.items.map((subItem) => (
            subItem.items ? (
              <MobileMenuItem key={subItem.href} item={subItem} setMobileMenuOpen={setMobileMenuOpen} />
            ) : (
              <Link
                key={subItem.href}
                to={subItem.href}
                className="block py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                {subItem.title}
              </Link>
            )
          ))}
        </div>
      )}
    </div>
  );
};

const Footer = () => {
  return (
    <footer>
      <div className="container">
        <p className="footer-text">© 2024 Escuela Técnica Nº 21 D.E. 10. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
};

const Informacion = () => {
  const { section } = useParams();

  const renderContent = () => {
    switch (section) {
      case 'autoridades':
        return (
          <div className="autoridades-organigrama">
              <div className="autoridades-box">
                  <div className="autoridades-item">
                      <strong>RECTOR:</strong> Prof. Ing. Pablo Daniel Folino
                  </div>
                  <div className="autoridades-item">
                      <strong>VICERECTOR:</strong> Prof. Fabián Osuna
                  </div>
              </div>
              <div className="autoridades-box">
                  <div className="autoridades-item">
                      <strong>REGENTE TÉCNICO:</strong> T.M. Prof. María Sainz
                  </div>
                  <div className="autoridades-item">
                      <strong>T.N:</strong> Prof. Martha Rosa
                  </div>
              </div>
              <div className="autoridades-item">
                  <strong>JEFE GENERAL ENSEÑANZA PRÁCTICA:</strong> Prof. César Aldonate
              </div>
              <div className="autoridades-item">
                  <strong>SECRETARIA:</strong> Prof. María Torresin
              </div>
              <div className="autoridades-box">
                  <div className="autoridades-item">
                      <strong>PRO SECRETARIA TT:</strong> Prof. María Torresin
                  </div>
                  <div className="autoridades-item">
                      <strong>PRO SECRETARIA TN:</strong> Prof. Cecilia Martinez
                  </div>
              </div>
              <div className="autoridades-item">
                  <strong>JEFA de PRECEPTORES:</strong> Prof. Alejandra Carusso
              </div>
          </div>
      );
      case 'nuestra-historia':
        return (
          <div className="nuestra-historia">
              <p>
                  La Escuela Municipal de Educación Técnica N°21 (D. E.: 10) "Fragata Escuela Libertad", creada el 12 de abril de 1945, cumple 79 años este año. Inicialmente, se estableció mediante la ley 12921 para ofrecer Cursos de Formación de Capacitación de Operarios.
              </p>
              <p>
                  Desde 1945 hasta 1956, se otorgaron "Certificados de Mayor Capacitación" en diversas especialidades, como Mecánica General, Tornería y Construcciones de Albañilería. En 1956, cambió su nombre a Escuela Nacional de Educación Técnica N°45 y comenzó a ofrecer el "Curso de Construcción de Edificios", que continuó hasta 1966.
              </p>
              <p>
                  En 1967, la escuela se denominó "Escuela Nacional de Educación Técnica N°21 de Capital Federal" y se introdujeron nuevos cursos. A partir de 1991, se autorizó el “Ciclo Básico Diurno” y se creó la especialidad de "Técnico en Computación" en 1994, ampliando las opciones para los estudiantes.
              </p>
              <p>
                  A lo largo de su historia, la escuela ha cambiado de ubicación en varias ocasiones, desde 1945 hasta la actualidad, consolidándose en Núñez 3638. Desde su creación, ha formado a más de 15,000 alumnos y ha contado con un diverso cuerpo docente y administrativo.
              </p>
              <p>
                  La escuela ha contribuido significativamente a la educación técnica en la comunidad y ha forjado una rica herencia, apoyada por la dedicación de sus docentes y el esfuerzo de sus estudiantes. La leyenda del edificio, asociado a antiguos calabozos, ha sido reemplazada por la historia de la expansión de Buenos Aires.
              </p>
              <p>
                  A lo largo de su historia, la escuela ha estado ubicada en varios edificios hasta establecerse definitivamente en 1991 en su sede actual, consolidando así su compromiso con la educación técnica.
              </p>
          </div>
      );
      case 'objetivos':
        return (
            <div>
              <h3>Que la Institución logre:</h3>
                <ul>
                    <li>Ser modelo de escuela creativa, motivadora y abierta al cambio.</li>
                    <li>Afianzar actitudes de respeto mutuo, solidaridad, tolerancia y compromiso para una convivencia armónica.</li>
                    <li>Resaltar los valores nacionales.</li>
                    <li>Avanzar en el desarrollo de los procesos de enseñanza-aprendizaje para mejorar la calidad educativa.</li>
                    <li>Adaptarse a las exigencias del mercado laboral complejo y globalizado.</li>
                    <li>Promover la participación democrática.</li>
                    <li>Capacitar para el ejercicio responsable en la elaboración, construcción y respeto por las normas de la institución.</li>
                    <li>Proveer mecanismos eficaces para el tratamiento de conflictos.</li>
                    <li>Aumentar los contactos con organizaciones empresariales públicas y/o privadas para acercar a los alumnos a la realidad laboral.</li>
                </ul>
                <h3>Que el alumno logre:</h3>
                <ul>
                    <li>Incorporar valores sociales e intelectuales para desarrollar su personalidad con compromiso, solidaridad y responsabilidad.</li>
                    <li>Desarrollar actitudes de respeto, cooperación, tolerancia y compromiso para una convivencia armónica.</li>
                    <li>Concretar avances progresivos en aspectos cognitivos con conceptos y procedimientos más complejos.</li>
                    <li>Valorar la capacitación como medio para una exitosa inserción laboral y/o en estudios superiores.</li>
                    <li>Desarrollar pensamiento crítico, visión analítica y toma de decisiones.</li>
                    <li>Acrecentar el conocimiento del patrimonio cultural y valorar los símbolos patrios para afianzar la identidad nacional.</li>
                    <li>Acrecentar el sentido de pertenencia a la institución educativa, a la comunidad y a la Nación.</li>
                </ul>
            </div>
        );
    
      case 'perfil-preceptor':
        return (
          <div>
          <h2>Que el preceptor sea capaz de:</h2>
              <ul>
                  <li>Promover en los alumnos el sentido de responsabilidad, el compañerismo, solidaridad humana y el respeto por la normativa que rige la vida cotidiana escolar y toda otra acción o actitud que tienda a su mejor formación integral.</li>
                  <li>Manifestar actitudes creativas frente a las situaciones que les sean presentadas dentro de la institución como fuera de ella.</li>
                  <li>Aplicar los conocimientos técnicos específicos de la especialidad realizando una adecuada transferencia de los mismos en el ámbito laboral.</li>
                  <li>Insertarse eficazmente tanto en el ámbito laboral como educativo posterior a su escolarización secundaria, desempeñándose con responsabilidad e idoneidad.</li>
                  <li>Relacionarse adecuadamente para el desarrollo de trabajos en equipo o interdisciplinarios, respetando las opiniones y las decisiones consensuadas.</li>
                  <li>Adaptarse en el medio socio-cultural en el que le corresponda desempeñarse con los valores del buen ciudadano.</li>
              </ul>
          </div>
      );

      case 'perfil-egresado':
          return (
            <div>
            <h2>Que el alumno sea capaz de:</h2>
            <ul>
                <li>Actuar éticamente en la sociedad respetando los principios de participación, responsabilidad y solidaridad incorporados a lo largo de su escolaridad.</li>
                <li>Ser ante el alumno dentro y fuera de la escuela, un ejemplo de buenas maneras morales y de actitud.</li>
                <li>Interesarse por los problemas que tengan los alumnos a su cargo orientándolos debidamente para facilitarles su solución.</li>
                <li>Arbitrar los medios para el mejor aprovechamiento del tiempo libre de los alumnos, en el orden técnico y/o pedagógico.</li>
                <li>Contribuir para el mejor desarrollo de la marcha del establecimiento.</li>
                <li>Procurar que la disciplina y el comportamiento social del alumno surja naturalmente por el interés en el que debe suscitar la enseñanza que recibe y del ascendiente que surge de la responsabilidad afectiva.</li>
            </ul>
        </div>
          );
          
          case 'cooperadora':
            return (
                <div className="container">
                    <h2>Gastos e Ingresos de Cooperadora</h2>
                    <ul>
                        <li>
                            De la primera reunión de la asociación:
                            <ul>
                                <li>
                                    Deberá convocarse con 10 días (hábiles) de anticipación publicándose en la cartelera del establecimiento educativo y notificando a toda la comunidad escolar a través de los cuadernos de comunicaciones de los alumnos.
                                </li>
                                <li>
                                    Las Asociaciones Cooperadoras deberán realizar la Asamblea Anual Ordinaria dentro de los 90 días de iniciado el ciclo lectivo.
                                </li>
                                <li>
                                    La Comisión Directiva en sesión mensual ordinaria, leerá el CUADRO DEMOSTRATIVO 2015, le dará aprobación y FIJARÁ fecha de Asamblea para dentro de un plazo NO MENOR a los 10 días posteriores de dicha reunión. (De la aprobación del CUADRO DEMOSTRATIVO y de la correspondiente fecha de Asamblea se deberá dejar constancia en actas).
                                </li>
                                <li>
                                    10 días previos a la Asamblea, la Asociación Cooperadora deberá publicar en cartelera la siguiente documentación:
                                    <ul>
                                        <li>Cuadro Demostrativo de Recursos y Gastos del período anterior</li>
                                        <li>Memoria Anual del período anterior</li>
                                        <li>Padrón de Socios</li>
                                        <li>Convocatoria a Asamblea Anual Ordinaria del presente período.</li>
                                    </ul>
                                </li>
                                <li>
                                    Una vez estipulada la fecha y hora de la Asamblea, la Comisión Directiva de la Asociación Cooperadora deberá elevar la convocatoria con el Orden del Día, vía Expediente Electrónico a la Subgerencia Operativa de Asesoramiento y Promoción de Cooperadoras-DGSE-.
                                </li>
                                <li>
                                    IMPORTANTE: En el marco de la Asamblea Anual Ordinaria solamente se POSTULARÁN los socios que integrarán la Comisión Directiva, SIN designación de cargos. La designación de los mismos se realizará en la 1° reunión de Comisión Directiva, fecha que se estipulará en Asamblea y a la que asistirán el Asesor Natural y los miembros de comisión directiva.
                                </li>
                            </ul>
                        </li>
                        <li>
                            De la segunda reunión de la asociación (1ra reunión de Comisión Directiva):
                            <ul>
                                <li>Se fijará después de los 10 días de la reunión anterior.</li>
                                <li>Se designarán los cargos.</li>
                                <li>
                                    Luego de realizadas las dos reuniones se deberá elevar a la Subgerencia Operativa de Asesoramiento y Promoción de Cooperadoras, la siguiente documentación:
                                    <ul>
                                        <li>Acta de Asamblea Anual Ordinaria (firmada en original por la Conducción Docente).</li>
                                        <li>Acta de 1° Reunión de Comisión Directiva / Redistribución de cargos (firmada en original por la Conducción Docente).</li>
                                        <li>Planilla de Información Anual (o Nómina de miembros de Comisión Directiva).</li>
                                        <li>Formulario de Traspaso de Documentación.</li>
                                        <li>Registro de Asistencia (a la Asamblea Anual Ordinaria y a Primer Reunión de Distribución de Cargos).</li>
                                    </ul>
                                </li>
                            </ul>
                        </li>
                        <li>
                            Aclaraciones Generales:
                            <ul>
                                <li>La duración de los mandatos de Comisión Directiva es de dos años y se renovarán por mitades en cada asamblea.</li>
                                <li>La distribución de los cargos se llevará a cabo en la 1ª Reunión de Comisión Directiva.</li>
                                <li>No podrán tener relación de parentesco hasta el 2º grado, entre los firmantes de la Comisión Directiva (Presidente, Secretario y Tesorero), ni entre ellos y los miembros de la comisión revisora de cuentas.</li>
                                <li>La Comisión Directiva debe estar conformada por 7 miembros titulares como mínimo y la Comisión Revisora de Cuentas 3 (2 Titulares y 1 Suplente). De todas formas, cada Asociación Cooperadora deberá consultar con su propio estatuto aprobado por el Ministerio de Educación.</li>
                                <li>Deberán quedar estipulados en Asamblea Anual Ordinaria los montos de caja chica de Tesorería y cuota social y su forma de pago (mensual o anual).</li>
                                <li>Cuando se produzcan modificaciones en la conformación de la Comisión Directiva de la Asociación Cooperadora como renuncias, acefalía, u otras situaciones que requieran la intervención y/o asesoramiento, deberán comunicarse con los Asesores Distritales, quienes los orientarán en los pasos a seguir.</li>
                                <li>La cuota social es por socio (adulto) y no por cantidad de hijos.</li>
                                <li>Podrán formar parte de la Comisión Directiva los socios activos mayores de 18 años.</li>
                                <li>Por último recordamos que no debe existir ningún tipo de obligatoriedad, tanto de asociarse a las Cooperadoras Escolares como de realizar pagos de ninguna índole, siendo ambas acciones totalmente voluntarias, debiendo contar la totalidad de los alumnos de las Escuelas, con los mismos derechos, sean ellos o sus padres socios o no de las mencionadas Cooperadoras.</li>
                            </ul>
                        </li>
                    </ul>
                </div>
            );
        
            case 'historia':
              return (
                  <div className="container">
                      <h2>Historia de la Biblioteca</h2>
                      <p>
                          La Biblioteca de nuestra Escuela tiene una historia tan itinerante, como la Institución misma.
                      </p>
                      <p>
                          Nace en los primeros años con el aporte de su personal docente, que dona algunos libros frente a la necesidad de facilitar la consulta bibliográfica de sus alumnos. Esos libros y otros que fueron agregándose, acompañaron a la Institución en sucesivas mudanzas, sin contar durante años con un espacio adecuado para su instalación.
                      </p>
                      <h3>Hitos en la historia de nuestra Biblioteca</h3>
                      <ul>
                          <li>1979.- Se habían reunido un total de 42 volúmenes.</li>
                          <li>1990.- El fondo bibliográfico alcanza los 151 libros, pero no hay espacio ni mobiliario suficientes para su correcto funcionamiento.</li>
                          <li>
                              1992.- Se habilitan muebles para libros y mapas que se instalan en un aula y crece la Colección con nuevas donaciones de profesores, alumnos y editoriales. Se inician tareas de selección, reparación, sellado, etiquetado y ubicación del material bibliográfico.
                          </li>
                          <li>
                              1994.- Año clave. El 18 de mayo, el Club de Leones Sede Núñez, dona una partida de 1.480 libros, las primeras estanterías metálicas y la construcción del Salón donde actualmente funciona la Biblioteca. Ese mismo día, se inaugura oficialmente, con un acto solemne, el Salón Biblioteca de la E.T. N° 21 «Fragata Escuela Libertad».
                          </li>
                          <li>
                              1995.- La donación de dos fuertes estanterías de madera lustrada, permite acondicionar con mayor comodidad más de 1.700 volúmenes.
                          </li>
                          <li>
                              1997.- Se organiza el área administrativa. La Biblioteca cuenta con un Reglamento para su funcionamiento. Se habilita la Biblioteca Circulante y crece el movimiento interno y préstamos de libros a domicilio.
                          </li>
                          <li>
                              1999.- Se incorporan muebles, se agregan mesas y se mejora el equipo de computación; se refacciona el Salón para mayor comodidad de los usuarios. La Hemeroteca, la Mapoteca y la Videoteca, ahora tienen sus espacios de fácil acceso y el material didáctico está más protegido.
                          </li>
                          <li>
                              2004.- Se cumple el 10° Aniversario de la inauguración de la Biblioteca en el Salón que ocupa actualmente. La celebración incluyó:
                              <ul>
                                  <li>Una reseña histórica.</li>
                                  <li>La creación de un Logotipo que nace de un concurso entre los alumnos de la Escuela.</li>
                                  <li>La imposición del nombre: «José Hernández» que surge por votación democrática de todo el Personal.</li>
                              </ul>
                          </li>
                      </ul>
                      <p>
                          Desde entonces y hasta hoy, año 2019, la Biblioteca de esta Escuela no ha dejado de crecer. Cuenta actualmente con más de 50000 volúmenes, que incluyen colecciones literarias de todos los géneros; libros de texto de todas las disciplinas del Ciclo Básico; un sector de Referencia; otro para la Especialidad Construcciones, un tercero para la Especialidad Computación y un espacio especial para la bibliografía didáctica del Docente. Su Vidioteca reúne 120 videos (educativos, cine, documentales, técnicos, etc.) y la Mapoteca ofrece a escolares y docentes, mapas geológicos, históricos, económicos y los clásicos geográficos de todo el mundo. La Hemeroteca es rica en colecciones presentadas en fascículos, revistas educativas y revistas técnicas especializadas, folletos, diarios y revistas de actualidad.
                      </p>
                      <p>
                          En lo administrativo, se aplica:
                      </p>
                      <ul>
                          <li>Sistema de Clasificación Decimal de Dewey (CDD) – Tercer sumario.</li>
                          <li>Reglas de Catalogación Angloamericanas, Segunda Edición (RCA2).</li>
                      </ul>
                      <p>
                          El mayor progreso consiste en:
                      </p>
                      <ul>
                          <li>
                              La incorporación del Sistema «Aguapey» de Gestión de Bibliotecas Escolares, creado por la Biblioteca Nacional de Maestros, el cual ha permitido efectuar hasta ahora, la carga electrónica de 835 volúmenes y el movimiento de préstamos a domicilio.
                          </li>
                          <li>
                              La catalogación del Fondo Bibliográfico que ya está en marcha, para la búsqueda manual por Autor, Título y Materia del material de consulta en Sala.
                          </li>
                      </ul>
                      <p>
                          Hoy podemos decir que la Biblioteca «José Hernández» ocupa un importante espacio en la Escuela Técnica N° 21 D.E. 10 «Fragata Escuela Libertad», donde los alumnos se encuentran, trabajan, investigan, leen, dibujan y socializan sus aprendizajes en un ámbito de respeto y armonía. Los docentes acceden a un servicio que valoran, porque cuando lo necesitan, pueden disponer de los materiales para el desarrollo de su tarea en el aula. Y por último, aquellos alumnos que carecen del libro propio, ven resuelto este problema mediante el régimen de «Préstamos a Domicilio», contribuyendo así, a evitar la deserción por esta causa.
                      </p>
                  </div>
              );

      case 'reglamento':
    return (
        <div className="container">
            <p>
                Para que la Biblioteca Escolar brinde sus servicios de la mejor forma posible, es necesaria la colaboración de los usuarios, a través del conocimiento y cumplimiento de las siguientes normas:
            </p>
            <ol>
                <li>
                    La Biblioteca «José Hernández» de la Escuela Técnica N° 21 DE 10 está a disposición de todos los alumnos, cualquiera sea su condición (regular, libre u oyente), como así también de todo el personal docente y no docente.
                </li>
                <li>
                    El salón de la Biblioteca es un espacio para la lectura, el estudio y la investigación, debiendo guardarse SILENCIO Y RESPETO hacia los usuarios presentes.
                </li>
                <li>
                    El usuario que retire material para su uso dentro del Establecimiento será responsable del mismo y deberá devolverlo a la Biblioteca en las mismas condiciones en que lo retiró, al finalizar la hora de clase y 10 minutos antes de la hora de cierre de la Biblioteca.
                </li>
                <li>
                    Al momento de retirar un libro, el usuario verificará que no esté dañado o escrito; si así fuera, deberá comunicárselo a la Bibliotecaria, pues está terminantemente prohibido dañar, sacar hojas o escribir (incluso con lápiz) las obras prestadas.
                </li>
                <li>
                    La prohibición de fumar dentro del Establecimiento, se hace extensiva al ámbito de la Biblioteca, donde tampoco está permitido al usuario comer y beber, debiendo preservarse siempre las condiciones de higiene y limpieza.
                </li>
                <li>
                    Solamente los socios de la Asociación Cooperadora podrán retirar material en préstamo a domicilio y son requisitos indispensables para solicitar un préstamo a domicilio:
                    <ul>
                        <li>Presentar el Recibo de la Asociación Cooperadora correspondiente al pago de todo el año escolar o a la última cuota mensual actualizada.</li>
                        <li>Registrar en la base de datos de la Biblioteca sus datos personales, curso, turno, etc.</li>
                        <li>Presentar el cuaderno de Comunicados para asentar el préstamo, así como la devolución del material prestado (en el turno noche, solo los alumnos menores de edad).</li>
                    </ul>
                </li>
                <li>
                    Efectuado el préstamo a domicilio, el usuario dispondrá de un libro durante 3 días hábiles y al cuarto deberá devolverlo con la posibilidad de renovarlo, si el mismo no hubiera sido solicitado por otro usuario, en cuyo caso deberá esperar su devolución.
                </li>
                <li>
                    Las obras literarias (cuentos, novelas, poesías, etc.) exigidas en Castellano y Literatura podrán retirarse a préstamo por 15 días, pero no podrán ser renovadas de inmediato.
                </li>
                <li>
                    El usuario deberá cumplir puntualmente con la devolución de los libros retirados en préstamo a domicilio. Si por razones de fuerza mayor no pudiera hacerlo, deberá comunicarse con el Establecimiento para dar aviso a la Biblioteca.
                </li>
                <li>
                    Los préstamos a domicilio finalizan el 15 de Noviembre de cada ciclo lectivo. Por lo tanto, todo alumno que tenga en su poder material de la Biblioteca deberá devolverlo antes de esa fecha.
                </li>
                <li>
                    La Biblioteca se reserva el derecho a no efectuar préstamos a domicilio de las obras o libros de Referencia (Guías, Manuales, Enciclopedias, Diccionarios, Atlas, etc.) y de aquellos de los que solo existe un ejemplar o son de consulta frecuente en el salón.
                </li>
            </ol>
            <h3>Sanciones</h3>
            <p>Por pérdida, destrucción total o parcial, extravío o robo de material:</p>
            <ul>
                <li>
                    El usuario deberá reemplazarlo por otro similar y hasta la reposición del mismo, no podrá hacer uso de la Biblioteca. Se recuerda la vigencia del Art. 184 del Código Penal.
                </li>
            </ul>
            <p>Por demorar en las devoluciones:</p>
            <ul>
                <li>
                    Si excede los 3 días hábiles establecidos, el usuario no podrá hacer uso de la Biblioteca por el término de 15 días a contar desde la fecha en que debió devolver el material prestado. En caso de reiterarse esta falta, la suspensión será de 30 días.
                </li>
            </ul>
            <p>Por retener material en su poder durante los recesos de invierno y verano:</p>
            <ul>
                <li>
                    El usuario perderá todo derecho al uso de los servicios de la Biblioteca durante 30 días.
                </li>
            </ul>
        </div>
    );

    case 'servicios':
      return (
          <div className="container">
              <h2>Servicios de la Biblioteca</h2>
              <p>
                  La Biblioteca escolar «José Hernández» brinda a sus alumnos, exalumnos y personal docente y no docente de la Escuela Técnica N° 21 «Fragata Escuela Libertad», los siguientes servicios:
              </p>
              <h3>1. Atención al Usuario</h3>
              <ul>
                  <li>Préstamos de libros a los alumnos, en forma regular (todas las clases – todos los turnos) para el trabajo en el aula en la modalidad Aula-Taller, en todas las disciplinas.</li>
                  <li>Préstamos de libros al docente, para su trabajo en el aula.</li>
                  <li>Préstamos de material didáctico para el aula.</li>
                  <li>Régimen de préstamos de libros a domicilio.</li>
                  <li>Atención y supervisión en Sala, a grupos de alumnos en tareas de investigación, trabajos prácticos, lecturas, etc.</li>
                  <li>Atención al personal docente y no docente en Sala, para la consulta y lectura del fondo bibliográfico.</li>
                  <li>Asesoramiento en la búsqueda de la información.</li>
              </ul>
  
              <h3>2. Otros Servicios</h3>
              <ul>
                  <li>
                      <strong>Sala de Lectura:</strong> con comodidad y buena iluminación, abierta a la Comunidad Educativa en los tres turnos en que funciona la Escuela. La Biblioteca ofrece interesantes colecciones y obras literarias de todos los géneros a disposición del usuario.
                  </li>
                  <li>
                      <strong>Sector de Referencia:</strong> incluye interesante material para la consulta y búsqueda de información general, en Obras de Referencia (biografías, diccionarios, enciclopedias, guías, manuales, atlas, etc.) con el asesoramiento del personal de Biblioteca.
                  </li>
                  <li>
                      <strong>Sectores de la Especialidad:</strong> el usuario interesado puede acceder a libros y otros materiales específicos de cada Especialidad (Maestro Mayor de Obras y Computación).
                  </li>
                  <li>
                      <strong>La Hemeroteca:</strong> rica en colecciones presentadas en fascículos, revistas educativas y revistas técnicas especializadas, folletos, diarios y revistas de actualidad, están al alcance de alumnos y docentes para su consulta en Sala y trabajos de aula.
                  </li>
                  <li>
                      <strong>La Mapoteca:</strong> ofrece a escolares y docentes, globos terráqueos, mapas geológicos, económicos, históricos y los clásicos geográficos de todo el mundo.
                  </li>
                  <li>
                      <strong>La Videoteca:</strong> reúne 120 videos educativos, cine, documentales, tecnológicos, etc. con aportes para todas las áreas disciplinares de esta Casa de Estudios.
                  </li>
                  <li>
                      <strong>Búsqueda de la Información:</strong> dadas las características de la Biblioteca, pequeña por la cantidad de volúmenes y la modalidad de búsqueda de los tipos de usuarios, no ofrece mayores dificultades la tarea a un personal de Biblioteca ya experimentado. Sin embargo, se ha progresado en el tema al informatizarse la Biblioteca. Hoy puede accederse a la información requerida en forma electrónica, consultando la base de datos que alcanza a 835 volúmenes. Se está trabajando también en la elaboración del Catálogo manual para la búsqueda personalizada del material, por Autor, Título y Materia.
                  </li>
              </ul>
          </div>
      );
  
      case 'usuarios':
    return (
        <div className="container">
            <h2>Usuarios de la Biblioteca</h2>
            <p>
                La Biblioteca «José Hernández», perteneciente a la Escuela Técnica 21 D.E. N° 10, está a disposición de los alumnos, para todo el personal del Establecimiento y también está abierta al resto de la Comunidad Educativa.
            </p>
            <p>Por motivos de organización y control, clasificamos distintos usuarios:</p>

            <h3>Alumnos:</h3>
            <ul>
                <li>
                    <strong>Regulares:</strong> Los alumnos que poseen la condición de regular, dentro del período del ciclo lectivo (de marzo a noviembre), podrán utilizar la Biblioteca para estudio, consulta, retirar material al aula, y también retirar a domicilio. En este último caso, el material a retirar no podrá ser aquel catalogado de referencia ni del cual haya sólo un ejemplar, y se le dará prioridad al alumno que haya abonado cooperadora.
                </li>
                <li>
                    Los demás alumnos, sean libres u oyentes, también en los meses de diciembre y febrero, podrán utilizar la Biblioteca para consulta, estudio y préstamos durante el día, presentando D.N.I.
                </li>
            </ul>

            <h3>Personal:</h3>
            <ul>
                <li>
                    El personal del Establecimiento, sea docente o no docente, que posea la condición de titular podrá utilizar la Biblioteca y retirar material a domicilio.
                </li>
                <li>
                    El personal del Establecimiento, docente o no docente, que no posea esa condición, como ser interino o suplente, podrá utilizar los servicios de la Biblioteca y retirar material durante el día con D.N.I.
                </li>
            </ul>

            <h3>Comunidad Educativa:</h3>
            <ul>
                <li>
                    La comunidad, sean padres, ex-alumnos, ex-docentes, pueden disponer del material para consulta, lectura, como también retirarlos durante el día presentando D.N.I.
                </li>
            </ul>
        </div>
    );

    case 'turno-noche':
      return (
          <div className="container">
              <p>
                  El TURNO NOCHE está destinado para aquellos alumnos que sean mayores de 16 años, sin tope máximo de edad.
              </p>
              <p>
                  Los cursos son presenciales de lunes a viernes de 18:00 a 23:10 hs.
              </p>
              <h3>Inscripción:</h3>
              <p>
                  Para los interesados en cursar la carrera de Maestro Mayor de Obras en el Turno Noche, y que tengan sus estudios secundarios completos, podrán ser inscriptos en 4º año y en tres años obtienen su título de Maestro Mayor de Obra.
              </p>
              <p>
                  Aquellos que estén interesados en la carrera de Técnico en Computación y que tengan sus estudios secundarios completos, podrán inscribirse en 4º año y en tres años obtener su título de Técnico en Computación.
              </p>
          </div>
      );
  
      case 'plan-estudios':
        return <p>Contenido de Plan de Estudios</p>;
      case 'ciclo-basico':
        return (
          <div>
            <table className="ciclo-basico-table">
              <thead>
                <tr>
                  <th>Año</th>
                  <th>Materia</th>
                  <th>Programa</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1er año</td>
                  <td>Lengua y Literatura</td>
                  <td>
                    <a href="https://et21.com.ar/wp-content/uploads/2016/05/res_ssgeycp_4145_12.pdf" target="_blank" rel="noopener noreferrer">Descargar</a>
                  </td>
                </tr>
                <tr>
                  <td>1er año</td>
                  <td>Inglés</td>
                  <td>
                    <a href="https://et21.com.ar/wp-content/uploads/2016/06/4145.1.Inglés.pdf" target="_blank" rel="noopener noreferrer">Descargar</a>
                  </td>
                </tr>
                <tr>
                  <td>1er año</td>
                  <td>Historia</td>
                  <td>
                    <a href="https://et21.com.ar/wp-content/uploads/2016/09/4145.1.Historia.pdf" target="_blank" rel="noopener noreferrer">Descargar</a>
                  </td>
                </tr>
                <tr>
                  <td>1er año</td>
                  <td>Geografía</td>
                  <td>
                    <a href="https://et21.com.ar/wp-content/uploads/2016/09/4145.1.Geografia.pdf" target="_blank" rel="noopener noreferrer">Descargar</a>
                  </td>
                </tr>
                <tr>
                  <td>1er año</td>
                  <td>Educación Ciudadana</td>
                  <td>
                    <a href="https://et21.com.ar/wp-content/uploads/2016/09/4145.1.EducacionCiudadana.pdf" target="_blank" rel="noopener noreferrer">Descargar</a>
                  </td>
                </tr>
                <tr>
                  <td>1er año</td>
                  <td>Educación Física</td>
                  <td>
                    <a href="https://et21.com.ar/wp-content/uploads/2016/08/1.EducacionFisica.pdf" target="_blank" rel="noopener noreferrer">Descargar</a>
                  </td>
                </tr>
                <tr>
                  <td>1er año</td>
                  <td>Biología</td>
                  <td>
                    <a href="https://et21.com.ar/wp-content/uploads/2016/06/4145.1.Biologia.pdf" target="_blank" rel="noopener noreferrer">Descargar</a>
                  </td>
                </tr>
                <tr>
                  <td>1er año</td>
                  <td>Educación Artística</td>
                  <td>
                    <a href="https://et21.com.ar/wp-content/uploads/2016/06/4145.1.Teatro.pdf" target="_blank" rel="noopener noreferrer">Descargar</a>
                  </td>
                </tr>
                <tr>
                  <td>1er año</td>
                  <td>Matemática</td>
                  <td>
                    <a href="https://et21.com.ar/wp-content/uploads/2016/06/4145.1.Matemática.pdf" target="_blank" rel="noopener noreferrer">Descargar</a>
                  </td>
                </tr>
                <tr>
                  <td>1er año</td>
                  <td>Tecnología de la Representación</td>
                  <td>
                    <a href="https://et21.com.ar/wp-content/uploads/2016/08/4145.1.TecnologíaDeLaRepresentación.pdf" target="_blank" rel="noopener noreferrer">Descargar</a>
                  </td>
                </tr>
                <tr>
                  <td>1er año</td>
                  <td>Taller</td>
                  <td>
                    <a href="https://et21.com.ar/wp-content/uploads/2016/08/4145.1.Taller.Informática.pdf" target="_blank" rel="noopener noreferrer">Descargar Rotación Informática</a>
                    <br />
                    <a href="https://et21.com.ar/wp-content/uploads/2016/08/4145.1.Taller.Hojalateria.pdf" target="_blank" rel="noopener noreferrer">Descargar Rotación Hojalatería</a>
                  </td>
                </tr>
                <tr>
                  <td>2do año</td>
                  <td>Lengua y Literatura</td>
                  <td>
                    <a href="https://et21.com.ar/wp-content/uploads/2016/07/4145.2.LenguayLiteratura.pdf" target="_blank" rel="noopener noreferrer">Descargar</a>
                  </td>
                </tr>
                <tr>
                  <td>2do año</td>
                  <td>Inglés</td>
                  <td>
                    <a href="https://et21.com.ar/wp-content/uploads/2016/06/4145.2.Inglés.pdf" target="_blank" rel="noopener noreferrer">Descargar</a>
                  </td>
                </tr>
                <tr>
                  <td>2do año</td>
                  <td>Historia</td>
                  <td>
                    <a href="https://et21.com.ar/wp-content/uploads/2016/09/4145.2.Historia.pdf" target="_blank" rel="noopener noreferrer">Descargar</a>
                  </td>
                </tr>
                <tr>
                  <td>2do año</td>
                  <td>Geografía</td>
                  <td></td>
                </tr>
                <tr>
                  <td>2do año</td>
                  <td>Educación Ciudadana</td>
                  <td>
                    <a href="https://et21.com.ar/wp-content/uploads/2016/09/4145.2.EducacionCiudadana.pdf" target="_blank" rel="noopener noreferrer">Descargar</a>
                  </td>
                </tr>
                <tr>
                  <td>2do año</td>
                  <td>Educación Física</td>
                  <td>
                    <a href="https://et21.com.ar/wp-content/uploads/2016/08/2.EducacionFisica.pdf" target="_blank" rel="noopener noreferrer">Descargar</a>
                  </td>
                </tr>
                <tr>
                  <td>2do año</td>
                  <td>Biología</td>
                  <td>
                    <a href="https://et21.com.ar/wp-content/uploads/2016/06/4145.2.Biologia.pdf" target="_blank" rel="noopener noreferrer">Descargar</a>
                  </td>
                </tr>
                <tr>
                  <td>2do año</td>
                  <td>Matemática</td>
                  <td>
                    <a href="https://et21.com.ar/wp-content/uploads/2016/06/4145.2.Matemática.pdf" target="_blank" rel="noopener noreferrer">Descargar</a>
                  </td>
                </tr>
                <tr>
                  <td>2do año</td>
                  <td>Física</td>
                  <td>
                    <a href="https://et21.com.ar/wp-content/uploads/2016/06/4145.2.Fisica.pdf" target="_blank" rel="noopener noreferrer">Descargar</a>
                  </td>
                </tr>
                <tr>
                  <td>2do año</td>
                  <td>Tecnología de la Representación</td>
                  <td></td>
                </tr>
                <tr>
                  <td>2do año</td>
                  <td>Taller</td>
                  <td>
                    <a href="https://et21.com.ar/wp-content/uploads/2016/08/4145.2.Taller.Informatica.pdf" target="_blank" rel="noopener noreferrer">Descargar Rotación Informática</a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        );
      case 'taller':
        return <p>Contenido de Taller</p>;
      case 'mmo':
        return <p>Contenido de Ciclo Superior Maestro Mayor de Obras 4150</p>;
      case 'computacion':
        return <p>Contenido de Técnico en Computación 4147</p>;
      case 'atencion-victimas':
        return <p>Contenido de Atención a Víctimas de Violencia</p>;
      case 'tutorias':
        return <p>Contenido de Tutorías</p>;

        case 'documentacion':
          return (
              <div className="container">
                  <h2>Documentación Importante para Descargar</h2>
                  <ul>
                      <li><a href="https://et21.com.ar/wp-content/uploads/2013/10/planilla-inscripci%C3%B3n.jpg" target="_blank" rel="noopener noreferrer">Solicitud de Inscripción</a></li>
                      <li><a href="https://et21.com.ar/wp-content/themes/itheme2/docs/fichas-de-antecedentes-de-salud.pdf" target="_blank" rel="noopener noreferrer">Ficha de Antecedentes de Salud</a></li>
                      <li><a href="https://et21.com.ar/wp-content/uploads/2023/02/archivo_2_._formulario_de_solicitud_de_beca_de_refrigerio_-_medio_y_adultos-1.pdf" target="_blank" rel="noopener noreferrer">Ficha Solicitud Beca Refrigerio</a></li>
                      <li><a href="https://et21.com.ar/wp-content/themes/itheme2/docs/re-matriculacion.xps" target="_blank" rel="noopener noreferrer">Matriculación</a></li>
                      <li><a href="https://et21.com.ar/wp-content/themes/itheme2/docs/matriculacion_noche.pdf" target="_blank" rel="noopener noreferrer">Matriculación Turno Noche</a></li>
                      <h2>Programa Becas Ciudad 2013</h2>
                      <li><a href="https://et21.com.ar/wp-content/themes/itheme2/docs/reclamos2013.pdf" target="_blank" rel="noopener noreferrer">Planilla de Reclamos</a></li>
                      <li><a href="https://et21.com.ar/wp-content/themes/itheme2/docs/reconsideracion2013.pdf" target="_blank" rel="noopener noreferrer">Pedido de Reconsideración</a></li>
                      <h2>SISTEMA MARZO-MARZO</h2>
                      <h3>Resoluciones Acerca de su Implementación</h3>
                      <li><a href="https://et21.com.ar/wp-content/themes/itheme2/docs/res11684-11.pdf" target="_blank" rel="noopener noreferrer">Res. Nº 11684/2011</a></li>
                      <li><a href="https://et21.com.ar/wp-content/themes/itheme2/docs/res-megc-11684-11.pdf" target="_blank" rel="noopener noreferrer">Res. Nº 11684-MEGC/11</a></li>
                      <li><a href="https://et21.com.ar/wp-content/themes/itheme2/docs/res-megc-11684-11-anexo.pdf" rel="noopener noreferrer">Res. Nº 11684-MEGC/11 ANEXO</a></li>
                  </ul>
              </div>
          );
      
      default:
        return <p>Contenido no encontrado.</p>;
    }
  };

  return (
    <div className="informacion-page">
      <Header />
      <main className="informacion-content">
        <h1 className="informacion-title">{section && section.replace(/-/g, ' ').charAt(0).toUpperCase() + section.replace(/-/g, ' ').slice(1)}</h1>
        <div className="informacion-body">
          {renderContent()}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Informacion;