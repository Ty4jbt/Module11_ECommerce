import { useParams, useNavigate } from 'react-router-dom';
import CustomerForm from './CustomerForm';

function CustomerFormWrapper() {
    let params = useParams();
    let navigate = useNavigate();

    return <CustomerForm params={params} navigate={navigate} />;
}

export default CustomerFormWrapper;