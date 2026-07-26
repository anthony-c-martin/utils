import Container from 'react-bootstrap/Container';
import { Button, Nav, Navbar } from 'react-bootstrap'
import { Github } from 'react-bootstrap-icons'
import { NavLink as RouterNavLink, Outlet, Route, Routes } from 'react-router'
import { Home } from './pages/Home';
import { QrCodePage } from './pages/QrCodePage';
import { QuickSharePage } from './pages/QuickSharePage';
import { TextUtilsPage } from './pages/TextUtilsPage';
import { ConversionsPage } from './pages/ConversionsPage';
import { GenerationPage } from './pages/GenerationPage';
import { MatterPage } from './pages/MatterPage';
import { BakingPage } from './pages/BakingPage';

function App() {
  return (
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="textutils" element={<TextUtilsPage />} />
          <Route path="conversions" element={<ConversionsPage />} />
          <Route path="baking" element={<BakingPage />} />
          <Route path="qrcode" element={<QrCodePage />} />
          <Route path="quickshare" element={<QuickSharePage />} />
          <Route path="generation" element={<GenerationPage />} />
          <Route path="matter" element={<MatterPage />} />
        </Route>
      </Routes>
  );
}

function Layout() {
  return (
    <>
    <Navbar bg="dark" data-bs-theme="dark" expand="lg">
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
              <RouterNavLink to="/baking" className="nav-link">Baking</RouterNavLink>
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
            <Nav.Item>
              <RouterNavLink to="/matter" className="nav-link">Matter</RouterNavLink>
            </Nav.Item>
          </Nav>
          <Button
            variant="outline-light"
            size="sm"
            href="https://github.com/anthony-c-martin/utils"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="d-none d-lg-inline-flex align-items-center ms-auto"
          >
            <Github size={20} />
          </Button>
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
