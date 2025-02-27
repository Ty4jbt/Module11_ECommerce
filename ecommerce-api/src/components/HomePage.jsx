import { Link } from 'react-router-dom';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';

function HomePage() {
  return (
    <Container className="mt-4">
      <Row className='text-center mb-5'>
        <Col>
          <h1>Welcome to Ecommerce App</h1>
          <p className="lead">Manage your customers, products, and orders all in one place.</p>
        </Col>
      </Row>

      <Row>
        <Col md={4} className='mb-4'>
          <Card className='h-100 shadow-sm'>
            <Card.Body>
              <Card.Title>Customer Management</Card.Title>
              <Card.Text>
                Create, view, update, and delete customer information. Keep track of all your customers in one place.
              </Card.Text>
              <div className="d-grid gap-2">
                <Button as={Link} to="/customers" variant="primary">View Customers</Button>
                <Button as={Link} to="/add-customers" variant="outline-primary">Add New Customers</Button>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4} className='mb-4'>
          <Card className='h-100 shadow-sm'>
            <Card.Body>
              <Card.Title>Product Catalog</Card.Title>
              <Card.Text>
                Manage your product inventory. Add new products, update pricing, and keep track of your products.
              </Card.Text>
              <div className="d-grid gap-2">
                <Button as={Link} to="/products" variant="primary">View Products</Button>
                <Button as={Link} to="/add-product" variant="outline-primary">Add New Product</Button>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4} className='mb-4'>
          <Card className='h-100 shadow-sm'>
            <Card.Body>
              <Card.Title>Order Processing</Card.Title>
              <Card.Text>
                Create a new order for your customers. Add products, set quantities, and place orders with ease.
              </Card.Text>
              <div className="d-grid gap-2">
                <Button as={Link} to="/orders" variant="primary">Place Order</Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default HomePage;