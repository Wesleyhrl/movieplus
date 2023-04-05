import { Spinner } from "react-bootstrap";


export default function Loading(props) {
    return (
        <div className="d-flex justify-content-center p-4">
            <Spinner animation="border" variant="light" />
        </div>
    )
}