import { Component } from "react";
import { PropTypes } from "prop-types";
import { Link } from "react-router-dom";
import axios from "axios";
import { Button, Alert, Container, ListGroup } from "react-bootstrap";

class CustomerList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            customers: [],
            selectedCustomerId: null,
            error: null
        };
    }

    componentDidMount() {
        this.fetchCustomers();
    }

    fetchCustomers = () => {
        axios.get("http://localhost:5000/customers")
            .then(response => {
                this.setState({ customers: response.data });
            })
            .catch(error => {
                console.error("There was an error!", error);
                this.setState({ error: "There was an error fetching customers" });
            });
    }

    selectCustomer = (id) => {
        this.setState({ selectedCustomerId: id });
        this.props.onCustomerSelect(id);
    }

    deleteCustomer = (customerId) => {
        axios.delete(`http://localhost:5000/customers/${customerId}`)
            .then(() => {
                console.log(`Customer ID ${customerId} deleted`);
                this.fetchCustomers();
            })
            .catch(error => {
                console.error("There was an error!", error);
                this.setState({ error: "There was an error deleting the customer" });
            });
    }

    render() {
        const { customers, error } = this.state;

        return (
            <Container>
                {error && <Alert variant="danger">{error}</Alert>}
                <h2 className="mt-3 mb-3 text-center">Customers</h2>
                <ListGroup>
                    {customers.map(customer => (
                        <ListGroup.Item key={customer.id} className="d-flex justify-content-between align-items-center shadow-sm p-3 mb-3 bg-white rounded">
                            <Link to={`/edit-customer/${customer.id}`} className="text-primary">{customer.name}</Link>
                            <Button
                                variant="danger"
                                size="sm"
                                className="float-right"
                                onClick={() => this.deleteCustomer(customer.id)}
                            >
                                Delete
                            </Button>
                        </ListGroup.Item>
                    ))}
                </ListGroup>
            </Container>
        );
    }
}

CustomerList.propTypes = {
    onCustomerSelect: PropTypes.func
};

export default CustomerList;