import { NavLink } from 'react-router-dom';
import { Navbar, Nav, Container } from 'react-bootstrap';

function NavBar() {
    return (
        <Navbar bg="light" expand="lg" className="mb-4">
            <Container>
                <Navbar.Brand as={NavLink} href="/">Ecommerce App</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link as={NavLink} to="/" activeclassname="active">
                            Home
                        </Nav.Link>


                        <Nav.Link as={NavLink} to="/add-customer" activeclassname="active">
                            Add Customer
                        </Nav.Link>
                        <Nav.Link as={NavLink} to="/customers" activeclassname="active">
                            Customers
                        </Nav.Link>


                        <Nav.Link as={NavLink} to="/add-product" activeclassname="active">
                            Add Product
                        </Nav.Link>
                        <Nav.Link as={NavLink} to="/products" activeclassname="active">
                            Products
                        </Nav.Link>


                        <Nav.Link as={NavLink} to="/orders" activeclassname="active">
                            Place Order
                        </Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}

export default NavBar;