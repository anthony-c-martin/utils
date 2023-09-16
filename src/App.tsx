import Container from 'react-bootstrap/Container';
import { Nav, NavDropdown, Navbar } from 'react-bootstrap'

function App() {
  return (
    <Navbar>
      <Container>
        <Navbar.Brand href="#home">Utils</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="#home">Home</Nav.Link>
            <Nav.Link href="#link">Link</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default App;
