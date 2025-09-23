import Container from 'react-bootstrap/Container';
import { Nav, Navbar } from 'react-bootstrap'
import { NavLink as RouterNavLink, Outlet, Route, Routes } from 'react-router'
import { Home } from './pages/Home';
import { QrCodePage } from './pages/QrCodePage';
import { QuickSharePage } from './pages/QuickSharePage';
import { TextUtilsPage } from './pages/TextUtilsPage';
import { ConversionsPage } from './pages/ConversionsPage';
import { GenerationPage } from './pages/GenerationPage';

function App() {
  return (
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="textutils" element={<TextUtilsPage />} />
          <Route path="conversions" element={<ConversionsPage />} />
          <Route path="qrcode" element={<QrCodePage />} />
          <Route path="quickshare" element={<QuickSharePage />} />
          <Route path="generation" element={<GenerationPage />} />
        </Route>
      </Routes>
  );
}

function Layout() {
  return (
    <>
    <Navbar bg="dark" data-bs-theme="dark">
      <Container>
        <Nav.Item>
          <RouterNavLink to="/" className="navbar-brand">Ant's Utils</RouterNavLink>
        </Nav.Item>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Item>
              <RouterNavLink to="/textutils" className="nav-link">Text Utils</RouterNavLink>
            </Nav.Item>
            <Nav.Item>
              <RouterNavLink to="/conversions" className="nav-link">Conversions</RouterNavLink>
            </Nav.Item>
            <Nav.Item>
              <RouterNavLink to="/qrcode" className="nav-link">QR Code</RouterNavLink>
            </Nav.Item>
            <Nav.Item>
              <RouterNavLink to="/quickshare" className="nav-link">Quick Share</RouterNavLink>
            </Nav.Item>
            <Nav.Item>
              <RouterNavLink to="/generation" className="nav-link">Generation</RouterNavLink>
            </Nav.Item>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
    <Container className="p-3">
      <Outlet />
    </Container>
    </>
  );
}

export default App;
