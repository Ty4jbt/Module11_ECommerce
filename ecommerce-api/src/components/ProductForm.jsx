import { useEffect, useState } from 'react';
import axios from 'axios';
import { func, object } from 'prop-types';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Button, Alert, Modal, Spinner, Container } from 'react-bootstrap';

const ProductForm = () => {
    const [product, setProduct] = useState({ name: '', price: 0 });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setSubmitting] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showConfirmationModal, setShowConfirmationModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        if (id) {
            axios.get(`http://127.0.0.1:5000/products/${id}`)
                .then(response => {
                    setProduct(response.data);
                })
                .catch(error => setErrorMessage(error.message));
        }          
    }, [id]);

    const validateForm = () => {
        const errors = {};
        if (!product.name) errors.name = 'Product name is required';
        if (!product.price || product.price <= 0) errors.price = 'Price must be a positive number';
        setErrors(errors);
        return Object.keys(errors).length === 0;
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        if (!validateForm()) return;
        setShowConfirmationModal(true);
    }

    const confirmSubmit = async () => {
        setShowConfirmationModal(false);
        setSubmitting(true);
        try {
            if (id) {
                await axios.put(`http://127.0.0.1:5000/products/${id}`, product);
            } else {
                await axios.post('http://127.0.0.1:5000/products', product);
            }
            setShowSuccessModal(true);
        } catch (error) {
            setErrorMessage(error.message);
        } finally {
            setSubmitting(false);
        }
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setProduct(prevProduct => ({
            ...prevProduct,
            [name]: value
        }));
    }

    const handleClose = () => {
        setShowSuccessModal(false);
        setProduct({ name: '', price: 0 });
        setSubmitting(false);
        navigate('/products');
    }
        
    const cancelSubmit = () => {
        setShowConfirmationModal(false);
    }

    if (isSubmitting) return (
        <Container className='d-flex justify-content-center mt-5'>
            <Spinner animation="border" />
        </Container>
    );
        
    return (
        <Container className='mt-4'>
            <Form onSubmit={handleSubmit}>
                <h2>{id ? 'Edit' : 'Add'} Product</h2>
                {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
                <Form.Group controlId="productName">
                    <Form.Label>Product Name</Form.Label>
                    <Form.Control
                        type="text"
                        name="name"
                        value={product.name}
                        onChange={handleChange}
                        isInvalid={!!errors.name}
                    />
                    <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
                </Form.Group>

                <Form.Group controlId="productPrice">
                    <Form.Label>Product Price</Form.Label>
                    <Form.Control
                        type="decimal"
                        name="price"
                        value={product.price}
                        onChange={handleChange}
                        isInvalid={!!errors.price}
                    />
                    <Form.Control.Feedback type="invalid">{errors.price}</Form.Control.Feedback>
                </Form.Group>

                <Button variant="primary" type="submit" className='mt-3' disabled={isSubmitting}>
                    {isSubmitting ? <Spinner as={'span'} animation="border" size="sm" /> : 'Submit'}
                </Button>
            </Form>

            <Modal show={showConfirmationModal} onHide={cancelSubmit}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to submit the form?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="danger" onClick={cancelSubmit}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={confirmSubmit}>
                        Submit
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal show={showSuccessModal} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Success</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {id ? 'Product updated successfully' : 'Product added successfully'}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

ProductForm.propTypes = {
    selectedProduct: object,
    onProductUpdated: func,
};

export default ProductForm;