import { useNavigate } from "react-router-dom";
import './index.css'

const NotFound = () => {
    const navigate = useNavigate();
    return (
        <div className="not-found-page">
            <h1>404 - Page Not Found</h1>
            <p>The page you are looking for does not exist.</p>
            <button onClick={() => navigate(-1)} className="not-found-button">Go to Back</button>
        </div>
    )
}

export default NotFound;