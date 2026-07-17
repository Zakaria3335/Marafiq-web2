import { useEffect, useRef, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/useAuth'
import './Navebar.css'

// روابط القائمة في النافبار
const navLinks = [
  { id: 'home', label: 'home', to: '/', isHome: true, end: true },
  { id: 'about', label: 'About Us', to: '/about' },
  { id: 'services', label: 'Services', to: '/services' },
  { id: 'complaints', label: 'Complaints', to: '/complaints/water-leakage' },
  { id: 'inquiry', label: 'Inquiry', to: '/inquiry' },
  { id: 'media', label: 'Media Center', to: '/media' },
  { id: 'faq', label: "FAQ's", to: '/faq' },
]

// أيقونات SVG (Home / Phone / Globe)
function HomeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 3.172 2 12h3v8h5v-5h4v5h5v-8h3z" />
    </svg>
  )
}

function PhoneIcon() {
  return <img src="/call1.svg" alt="" width="18" height="18" />;
}

function GlobeIcon() {
  return <img src="/arab.svg" alt="" width="18" height="18" />;
}

function ChevronDownIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
      <path
        d="M6 9l6 6 6-6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

// اللوجو
function Logo({ transparent }) {
  return (
    <NavLink to="/" className="logo" aria-label="Marafiq home">
      <img
        src={transparent ? '/logo.svg' : '/logo1.svg'}
        alt="Marafiq"
        className="logo-img"
      />
    </NavLink>
  )
}

// زر البروفايل اللي بيبين بدل "Login" بعد ما المستخدم يسجل دخول
function ProfileMenu({ user, onLogout }) {
  const [open, setOpen] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => {
    if (!open) return undefined
    const onClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [open])

  return (
    <div className="profile-menu" ref={menuRef}>
      <button
        type="button"
        className="profile-btn"
        aria-haspopup="true"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        <span className="profile-avatar">{user.initials}</span>
        <span className="profile-name">{user.name}</span>
        <ChevronDownIcon />
      </button>

      {open && (
        <div className="profile-dropdown">
          <div className="profile-dropdown-header">
            <span className="profile-avatar">{user.initials}</span>
            <div>
              <p className="profile-dropdown-name">{user.name}</p>
              <p className="profile-dropdown-type">{user.type}</p>
            </div>
          </div>
          <button
            type="button"
            className="profile-dropdown-logout"
            onClick={() => {
              setOpen(false)
              onLogout()
            }}
          >
            Log out
          </button>
        </div>
      )}
    </div>
  )
}

// الكومبوننت الرئيسي للنافبار
export default function Navebar({ variant = 'light' }) {
  const transparent = variant === 'transparent'
  const [menuOpen, setMenuOpen] = useState(false)
  const closeMenu = () => setMenuOpen(false)
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  // "My Dashboard" بيبين بس لما يكون في مستخدم مسجل دخول
  const links = user
    ? [...navLinks, { id: 'dashboard', label: 'My Dashboard', to: '/dashboard' }]
    : navLinks

  return (
    <header className={`navbar${transparent ? ' navbar-transparent' : ''}`}>
      <div className="navbar-inner">
        <Logo transparent={transparent} />

        {/* الكبسولة اللي فيها روابط القائمة + الأزرار */}
        <div className="navbar-pill">
          <nav className={`navbar-links${menuOpen ? ' navbar-links-open' : ''}`}>
            {links.map((link) =>
              link.isHome ? (
                <NavLink
                  key={link.id}
                  to={link.to}
                  end={link.end}
                  className={({ isActive }) => `nav-link nav-link-home${isActive ? ' active' : ''}`}
                  aria-label="Home"
                  onClick={closeMenu}
                >
                  <HomeIcon />
                </NavLink>
              ) : (
                <NavLink
                  key={link.id}
                  to={link.to}
                  className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
                  onClick={closeMenu}
                >
                  {link.label}
                </NavLink>
              ),
            )}
          </nav>

          {/* أزرار الجهة اليمين: اتصال / لغة / تسجيل دخول */}
          <div className="navbar-actions">
            <a href="tel:" className="icon-button" aria-label="Call us">
              <PhoneIcon />
            </a>
            <span className="navbar-divider" />
            <button type="button" className="lang-switch" aria-label="Switch language">
              <GlobeIcon />
              <span>Ar</span>
            </button>
            {user ? (
              <ProfileMenu user={user} onLogout={handleLogout} />
            ) : (
              <NavLink to="/login" className="login-btn">
                Login
              </NavLink>
            )}
            <button
              type="button"
              className={`menu-toggle${menuOpen ? ' active' : ''}`}
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((open) => !open)}
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
