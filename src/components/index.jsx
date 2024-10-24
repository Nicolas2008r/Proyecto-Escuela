import React, { useState, useEffect, useRef } from 'react'
import { motion, useScroll, useSpring, useTransform, useAnimation } from 'framer-motion'
import { Menu, X, ChevronDown, Search, ChevronRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom';
import './styles.css'
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


export default function ModernSchoolLanding() {
  const [activeSection, setActiveSection] = useState('home')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 })

  const navigate = useNavigate()

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'about', 'academic', 'enrollment', 'contact']
      const currentSection = sections.find(section => {
        const element = document.getElementById(section)
        if (element) {
          const rect = element.getBoundingClientRect()
          return rect.top <= 100 && rect.bottom >= 100
        }
        return false
      })
      if (currentSection) setActiveSection(currentSection)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    console.log('Searching for:', searchQuery)
  }

  const handleLoginRedirect = () => {
    navigate('/login')
  }

  return (
    <div className="min-h-screen">
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-primary z-50"
        style={{ scaleX }}
      />
      <header>
        <nav className="container">
          <a href="/" className="nav-logo">
            <img src="/img/logo.png" alt="logo" />
          </a>
          <div className="nav-links">
            {navItems.map((item) => (
              <DropdownMenu key={item.href} item={item} activeSection={activeSection} />
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

      <main>
        <HeroSection />
        <AboutSection />
        <AcademicSection />
        <EnrollmentSection />
        <ContactSection />
      </main>

      <footer>
        <div className="container">
          <p className="footer-text">© 2024 Escuela Técnica Nº 21 D.E. 10. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  )
}

function DropdownMenu({ item, activeSection }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="dropdown" onMouseEnter={() => setIsOpen(true)} onMouseLeave={() => setIsOpen(false)}>
      <a href={item.href} className={`nav-link ${activeSection === item.href.substring(1) ? 'active' : ''}`}>
        {item.title} {item.items && <ChevronDown className="inline-block ml-1" />}
      </a>
      {item.items && isOpen && (
        <div className="dropdown-content">
          {item.items.map((subItem) => (
            subItem.items ? (
              <NestedDropdown key={subItem.href} item={subItem} />
            ) : (
              <a key={subItem.href} href={subItem.href} className="dropdown-item">
                {subItem.title}
              </a>
            )
          ))}
        </div>
      )}
    </div>
  )
}

function NestedDropdown({ item }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="nested-dropdown" onMouseEnter={() => setIsOpen(true)} onMouseLeave={() => setIsOpen(false)}>
      <a href={item.href} className="dropdown-item">
        {item.title} <ChevronRight className="inline-block ml-1" />
      </a>
      {isOpen && (
        <div className="nested-dropdown-content">
          {item.items.map((subItem) => (
            <a key={subItem.href} href={subItem.href} className="dropdown-item">
              {subItem.title}
            </a>
          ))}
        </div>
      )}
    </div>
  )
}

function MobileMenu({ items, setMobileMenuOpen }) {
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
      <a href="/login" className="mobile-menu-item" onClick={() => setMobileMenuOpen(false)}>
        Iniciar Sesión
      </a>
    </motion.div>
  )
}

function MobileMenuItem({ item, setMobileMenuOpen }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="mobile-menu-item">
      <div className="flex justify-between items-center" onClick={() => setIsOpen(!isOpen)}>
        <a href={item.href} onClick={() => setMobileMenuOpen(false)}>{item.title}</a>
        {item.items && (isOpen ? <ChevronDown /> : <ChevronRight />)}
      </div>
      {item.items && isOpen && (
        <div className="ml-4">
          {item.items.map((subItem) => (
            subItem.items ? (
              <MobileMenuItem key={subItem.href} item={subItem} setMobileMenuOpen={setMobileMenuOpen} />
            ) : (
              <a key={subItem.href} href={subItem.href} className="block py-2" onClick={() => setMobileMenuOpen(false)}>
                {subItem.title}
              </a>
            )
          ))}
        </div>
      )}
    </div>
  )
}


function HeroSection() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  })
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"])
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0])

  return (
    <section id="home" ref={ref} className="hero">
      <motion.div
        className="hero-image"
        style={{ y, opacity }}
      >
        <img
          src="/img/banner.jpg?height=1080&width=1920"
          alt="Escuela Técnica Nº 21"
          className="w-full h-full object-cover"
        />
      </motion.div>
      <div className="hero-overlay" />
      <div className="container hero-content">
        <motion.h1
          className="hero-title"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Fragata Escuela Libertad
        </motion.h1>
        <motion.p
          className="hero-subtitle"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          Formando el futuro, un estudiante a la vez
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <a href="#about" className="btn btn-primary">
            Descubre más
          </a>
        </motion.div>
      </div>
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
      >
        <ChevronDown className="h-8 w-8 text-white" />
      </motion.div>
    </section>
  )
}

function AboutSection() {
  const controls = useAnimation()
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  })

  useEffect(() => {
    scrollYProgress.onChange((latest) => {
      if (latest > 0.1) controls.start("visible")
    })
  }, [controls, scrollYProgress])

  const variants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, staggerChildren: 0.2 } }
  }

  return (
    <section id="about" ref={ref} className="py-16 bg-accent">
      <div className="container">
        <motion.div
          variants={variants}
          initial="hidden"
          animate={controls}
          className="grid grid-cols-2 gap-8 items-center"
        >
          <motion.div variants={variants}>
            <h2 className="section-title">Sobre Nosotros</h2>
            <p className="mb-4">
              La ET N° 21 "Fragata Escuela Libertad" es una institución pública de Buenos Aires que ofrece capacitación profesional de excelencia. Nos enfocamos en desarrollar habilidades técnicas y valores éticos para preparar a nuestros estudiantes para los desafíos del mundo laboral y social.
            </p>
            <p>
              Nuestro compromiso es con el crecimiento integral de cada alumno, fomentando no solo su desarrollo académico, sino también su crecimiento personal y moral.
            </p>
          </motion.div>
          <motion.div variants={variants} className="relative h-[400px] rounded-lg overflow-hidden shadow-xl">
            <img
              src="/img/escuela.jpg"
              alt="Estudiantes en el taller"
              className="w-full h-full object-cover"
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

function AcademicSection() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const controls = useAnimation()

  const schoolImages = [
    '/img/instalaciones1.jpg?height=800&width=1000',
    '/img/instalaciones2.jpg?height=800&width=1000',
    '/img/instalaciones3.jpg?height=800&width=1000',
    '/img/instalaciones4.jpg?height=800&width=1000',
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % schoolImages.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [schoolImages.length])

  useEffect(() => {
    controls.start({ opacity: [0, 1], transition: { duration: 0.5 } })
  }, [currentIndex, controls])

  return (
    <section id="academic" className="py-16">
      <div className="container">
        <h2 className="section-title">Programas Académicos</h2>
        <div className="grid grid-cols-2 gap-8">
          <div className="card">
            <div className="card-content">
              <h3 className="card-title">Maestro Mayor de Obras</h3>
              <p className="mb-4">
                Forma profesionales capaces de gestionar y ejecutar proyectos de construcción, con un enfoque en la sostenibilidad y la innovación.
              </p>
              <button className="btn btn-primary">Más información</button>
            </div>
          </div>
          <div className="card">
            <div className="card-content">
              <h3 className="card-title">Técnico en Computación</h3>
              <p className="mb-4">
                Prepara expertos en tecnologías de la información, desarrollo de software y sistemas computacionales para la era digital.
              </p>
              <button className="btn btn-primary">Más información</button>
            </div>
          </div>
        </div>

        <div className="mt-12">
          <h3 className="section-title">Nuestras Instalaciones</h3>
          <div className="relative h-[400px] rounded-lg overflow-hidden shadow-xl">
            <motion.div
              key={currentIndex}
              animate={controls}
              className="absolute inset-0"
            >
              <img
                src={schoolImages[currentIndex]}
                alt={`Instalación ${currentIndex + 1}`}
                style={{
                  width: '100%',
                  height: 'auto',
                  objectFit: 'cover',
                  display: 'block',
                }}
              />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}


function EnrollmentSection() {
  const steps = [
    { title: "Preinscripción Online", content: "Realizar la preinscripción para aspirantes a Nivel Secundario (de 1°a 6° año) a través de la página web del GCBA desde el 2 de diciembre de 2024 al 12 de enero de 2025. Ingresar desde este Link: https://www.buenosaires.gob.ar/educacion/estudiantes/inscripcionescolar El sistema otorga un número de preinscripción al finalizar el trámite." },
    { title: "Envío de Información por Correo", content: "Enviar un correo a la cuenta inscripcionesturnonoche@gmail.com consignando: Apellido y nombres completos, número de documento, carrera a la que se inscribe, N° de prescripción. Recibirá una respuesta con un documento PDF adjunto" },
    { title: "Presentación de Documentación Digital", content: "Reenviar por correo el documento PDF recibido junto foto del documento de identidad y título obtenido, constancia de estudios parciales o pase de otro establecimiento (lo que corresponda) a la cuenta: movilidad.secundaria@bue.edu.ar Recibirá una respuesta con un documento PDF adjunto (Este documento es requisito indispensable para realizar la inscripción.)" },
    { title: "Presentación Física en Secretaría", content: "Al recibir respuesta de MOVILIDAD deberá acercarse a la Secretaria escolar de lunes a viernes en el horario de 19:00 a 21:00 hs con la siguiente documentación original y copia impresa: DNI, -2 FOTOS 4X4, CARPETA DE 3 SOLAPAS, TITULO SECUNDARIO O PASE DE OTRO ESTABLECIMIENTO (según corresponda), PARTIDA DE NACIMIENTO, DICTAMEN DE MOVILIDAD, FACTURA DE SERVICIO CON EL DOMICILIO DONDE VIVE, menores de 18 años deben concurrir acompañados por un adulto responsable." },
  ]

  return (
    <section id="enrollment" className="py-16 bg-accent">
      <div className="container">
        <h2 className="section-title">Proceso de Inscripción</h2>
        <div className="grid grid-cols-2 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="card">
              <div className="card-content">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <h3 className="card-title">Paso {index + 1}: {step.title}</h3>
                  <p>{step.content}</p>
                </motion.div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-8 text-center">
          <button className="btn btn-primary">
            Iniciar Inscripción
          </button>
        </div>
      </div>
    </section>
  )
}

function ContactSection() {
  return (
    <section id="contact" className="py-16">
      <div className="container">
        <h2 className="section-title">Contáctanos</h2>
        <div className="grid grid-cols-2 gap-8">
          <div className="card">
            <div className="card-content">
              <h3 className="card-title">Envíanos un mensaje</h3>
              <form className="form">
                <input
                  type="text"
                  placeholder="Nombre"
                  className="input"
                  required
                />
                <input
                  type="email"
                  placeholder="Email"
                  className="input"
                  required
                />
                <textarea
                  placeholder="Mensaje"
                  rows={4}
                  className="textarea"
                  required
                ></textarea>
                <button
                  type="submit"
                  className="btn btn-primary"
                >
                  Enviar mensaje
                </button>
              </form>
            </div>
          </div>
          <div className="card">
            <div className="card-content">
              <h3 className="card-title">Información de contacto</h3>
              <div className="space-y-2">
                <p>📍 Nuñez 3638, C1430AMF Cdad. Autónoma de Buenos Aires</p>
                <p>✉️ et21web@gmail.com</p>
                <p>📞 011 4546-3878</p>
              </div>
              <div className="mt-4 flex space-x-4">
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}