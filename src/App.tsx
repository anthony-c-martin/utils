import Container from 'react-bootstrap/Container';
import { Nav, Navbar } from 'react-bootstrap'
import { Outlet, Route, Routes } from 'react-router'
import { HashRouter as Router } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';
import { Home } from './pages/Home';
import { QrCodePage } from './pages/QrCodePage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="qrcode" element={<QrCodePage />} />
        </Route>
      </Routes>
    </Router>
  );
}

function Layout() {
  return (
    <>
    <Navbar bg="dark" data-bs-theme="dark">
      <Container>
        <Navbar.Brand href="/">Utils</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <LinkContainer to="/qrcode">
              <Nav.Link>QR Code Generator</Nav.Link>
            </LinkContainer>
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
