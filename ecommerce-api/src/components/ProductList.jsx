import { array, func } from 'prop-types';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Container, ListGroup, Modal, Alert } from 'react-bootstrap';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [productToDelete, setProductToDelete] = useState(null);
    const navigate = useNavigate();

    const fetchProducts = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get('http://127.0.0.1:5000/products');
            setProducts(response.data);
            setError(null);
        } catch (error) {
            setError('Error fetching products: ' + error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleEditProduct = (id) => {
        navigate(`/edit-products/${id}`);
    };

    const confirmDelete = (product) => {
        setProductToDelete(product);
        setShowDeleteModal(true);
    };

    const cancelDelete = () => {
        setProductToDelete(null);
        setShowDeleteModal(false);
    };

    const deleteProduct = async () => {
        if (!productToDelete) return;

        try {
            await axios.delete(`http://127.0.0.1:5000/products/${productToDelete.id}`);
            setProductToDelete(null);
            setShowDeleteModal(false);
            fetchProducts();
        } catch (error) {
            setError('Error deleting product: ' + error.message);
            setShowDeleteModal(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    return (
        <Container className='mt-4'>
            <div className="d-flex justify-content between align-items-center mb-4">
                <h2>Products</h2>
                <Button variant='success' className='mx-3' onClick={() => navigate('/add-product')}>
                    Add Product
                </Button>
            </div>

            {error && <Alert variant='danger'>{error}</Alert>}

            {isLoading ? (
                <div className='text-center mt-4'>Loading products..</div>
            ) : products.length === 0 ? (
                <Alert variant='info'>No products found. Add some products to get started.</Alert>
            ) : (
                <ListGroup>
                    {products.map(product => (
                        <ListGroup.Item key={product.id} className='d-flex justify-content-between align-items-center shadow-sm p-3 mb-3 bg-white rounded'>
                            <div>
                                <h5>{product.name}</h5>
                                <div>${parseFloat(product.price).toFixed(2)}</div>
                            </div>
                            <div className='d-flex'>
                                <Button
                                    variant='primary'
                                    className='me-2'
                                    onClick={() => handleEditProduct(product.id)}
                                >
                                    Edit
                                </Button>
                                <Button
                                    variant='danger'
                                    className='me-2'
                                    onClick={() => confirmDelete(product)}
                                >
                                    Delete
                                </Button>
                            </div>
                        </ListGroup.Item>
                    ))}
                </ListGroup>
            )}
            
            <Modal show={showDeleteModal} onHide={cancelDelete}>
                <Modal.Header closeButton>
                    <Modal.Title>Delete Product</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {productToDelete && (
                        <>
                            <p>Are you sure you want to delete the following product?</p>
                            <hr />
                            <p><strong>Name:</strong> {productToDelete.name}</p>
                            <p><strong>Price:</strong> ${parseFloat(productToDelete.price).toFixed(2)}</p>
                            <Alert variant='warning'>This action cannot be undone.</Alert>
                        </>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant='secondary' onClick={cancelDelete}>
                        Cancel
                    </Button>
                    <Button variant='danger' onClick={deleteProduct}>
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

ProductList.propTypes = {
    products: array,
    onEditProduct: func,
    onProductDeleted: func,
};

export default ProductList;