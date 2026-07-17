import { useEffect, useRef, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/useAuth'
import { useLanguage } from '../../context/useLanguage'
import './Navebar.css'

const UNREAD_NOTIFICATIONS = 2

// روابط القائمة في النافبار — label بيتحدد بالترجمة الحالية بمكان الاستعمال
const navLinks = [
  { id: 'home', labelKey: 'nav.home', to: '/', isHome: true, end: true },
  { id: 'about', labelKey: 'nav.about', to: '/about' },
  { id: 'services', labelKey: 'nav.services', to: '/services' },
  { id: 'complaints', labelKey: 'nav.complaints', to: '/complaints/water-leakage' },
  { id: 'inquiry', labelKey: 'nav.inquiry', to: '/inquiry' },
  { id: 'media', labelKey: 'nav.media', to: '/media' },
  { id: 'faq', labelKey: 'nav.faq', to: '/faq' },
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

function BellIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M6 10.5a6 6 0 1112 0c0 4 1.5 5.5 1.5 5.5H4.5S6 14.5 6 10.5z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M10.3 19.5a1.8 1.8 0 003.4 0" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
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
function ProfileMenu({ user, onLogout, t }) {
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
            {t('nav.logout')}
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
  const { t, toggleLanguage } = useLanguage()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  // "My Dashboard" بيبين بس لما يكون في مستخدم مسجل دخول
  const links = user
    ? [...navLinks, { id: 'dashboard', labelKey: 'nav.dashboard', to: '/dashboard' }]
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
                  aria-label={t('nav.home')}
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
                  {t(link.labelKey)}
                </NavLink>
              ),
            )}
          </nav>

          {/* أزرار الجهة اليمين: اتصال / لغة / تسجيل دخول */}
          <div className="navbar-actions">
            <a href="tel:" className="icon-button" aria-label={t('nav.callUs')}>
              <PhoneIcon />
            </a>
            {user && (
              <NavLink to="/notifications" className="icon-button notif-bell-btn" aria-label={t('nav.notifications')}>
                <BellIcon />
                {UNREAD_NOTIFICATIONS > 0 && <span className="notif-bell-badge">{UNREAD_NOTIFICATIONS}</span>}
              </NavLink>
            )}
            <span className="navbar-divider" />
            <button type="button" className="lang-switch" aria-label={t('nav.switchLanguage')} onClick={toggleLanguage}>
              <GlobeIcon />
              <span>{t('nav.langCode')}</span>
            </button>
            {user ? (
              <ProfileMenu user={user} onLogout={handleLogout} t={t} />
            ) : (
              <NavLink to="/login" className="login-btn">
                {t('nav.login')}
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
