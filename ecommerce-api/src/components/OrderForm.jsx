import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Form, Button, Alert, Container, Row, Col, Card, ListGroup, Modal } from 'react-bootstrap';

const OrderForm = () => {
    const [products, setProducts] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [selectedCustomer, setSelectedCustomer] = useState('');
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [quantities, setQuantities] = useState({});
    const [orderTotal, setOrderTotal] = useState(0);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchCustomers();
        fetchProducts();
    }, []);

    useEffect(() => {
        calculateTotal();
    }, [calculateTotal]);

    const fetchCustomers = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:5000/customers');
            setCustomers(response.data);
        } catch (error) {
            setError('Error fetching customers: ' + error.message);
        }
    };

    const fetchProducts = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:5000/products');
            setProducts(response.data);
        } catch (error) {
            setError('Error fetching products: ' + error.message);
        }
    };

    const handleCustomerChange = (event) => {
        setSelectedCustomer(event.target.value);
    };

    const handleProductSelect = (productId) => {
        const product = products.find((p) => p.id === parseInt(productId));
        if (product) {
            const updatedProducts = [...selectedProducts];
            if (!updatedProducts.find((p) => p.id === product.id)) {
                updatedProducts.push(product);
                setSelectedProducts(updatedProducts);
                setQuantities({
                    ...quantities,
                    [product.id]: 1
                });
            }
        }
    };

    const handleQuantityChange = (productId, quantity) => {
        setQuantities({
            ...quantities,
            [productId]: parseInt(quantity)
        });
    };

    const removeProduct = (productId) => {
        const updatedProducts = selectedProducts.filter((p) => p.id !== productId);
        const updatedQuantities = { ...quantities };
        delete updatedQuantities[productId];

        setSelectedProducts(updatedProducts);
        setQuantities(updatedQuantities);
    };

    const calculateTotal = useCallback(() => {
        let total = 0;
        selectedProducts.forEach(product => {
            total += product.price * (quantities[product.id] || 0);
        });
        setOrderTotal(total);
    }, [selectedProducts, quantities]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!selectedCustomer) {
            setError('Please select a customer');
            return;
        }

        if (selectedProducts.length === 0) {
            setError('Please select at least one product');
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const orderDetails = selectedProducts.map((product) => ({
                product_id: product.id,
                quantity: quantities[product.id],
                price: product.price
            }));

            const orderData = {
                customerId: parseInt(selectedCustomer),
                orderDate: new Date().toISOString(),
                products: orderDetails,
                totalPrice: orderTotal
            };

            await axios.post('http://127.0.0.1:5000/orders', orderData);
            setShowSuccessModal(true);
        } catch (error) {
            setError('Error placing order: ' + error.message);
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleModalClose = () => {
        setShowSuccessModal(false);
        setSelectedCustomer('');
        setSelectedProducts([]);
        setQuantities({});
        setOrderTotal(0);
        navigate('/');
    };

    return (
        <Container className='mt-4'>
            <h2>Place New Order</h2>
            {error && <Alert variant='danger'>{error}</Alert>}

            <Form onSubmit={handleSubmit}>
                <Row>
                    <Col md={6}>
                        <Form.Group className='mb-3'>
                            <Form.Label>Select Customer</Form.Label>
                            <Form.Select
                                value={selectedCustomer}
                                onChange={handleCustomerChange}
                                required
                            >
                                <option value=''>Select Customer</option>
                                {customers.map((customer) => (
                                    <option key={customer.id} value={customer.id}>
                                        {customer.name}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>

                        <Form.Group className='mb-3'>
                            <Form.Label>Add Products</Form.Label>
                            <Form.Select onChange={(event) => handleProductSelect(event.target.value)}>
                                <option value=''>Select Product</option>
                                {products.map((product) => (
                                    <option key={product.id} value={product.id}>
                                        {product.name} - ${product.price}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                    </Col>

                    <Col md={6}>
                        <Card>
                            <Card.Header>Order Summary</Card.Header>
                            <Card.Body>
                                <ListGroup variant='flush'>
                                    {selectedProducts.map((product) => (
                                        <ListGroup.Item key={product.id} className="d-flex justify-content-between align-items-center">
                                            <div>
                                                <strong>{product.name} - ${product.price}</strong>
                                            </div>
                                            <div className="d-flex align-items-center">
                                                <Form.Control
                                                    type='number'
                                                    value={quantities[product.id] || 1}
                                                    onChange={(event) => handleQuantityChange(product.id, event.target.value)}
                                                    min={1}
                                                    style={{ width: '70px' }}
                                                    className='mx-2'
                                                />
                                                <Button
                                                    variant='outline-danger'
                                                    size='sm'
                                                    onClick={() => removeProduct(product.id)}
                                                >
                                                    Remove
                                                </Button>
                                            </div>
                                        </ListGroup.Item>
                                    ))}
                                </ListGroup>
                                <div className="mt-3 text-end">
                                    <h5>Total: ${orderTotal.toFixed(2)}</h5>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                <Button
                    type='submit'
                    variant='primary'
                    className='mt-3'
                    disabled={isLoading}
                >
                    {isLoading ? 'Placing Order...' : 'Place Order'}
                </Button>
            </Form>

            <Modal show={showSuccessModal} onHide={handleModalClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Order Placed Successfully</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Your order has been placed successfully.</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant='secondary' onClick={handleModalClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default OrderForm;
