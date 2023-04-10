import { useState } from 'react';
import { Link } from 'react-router-dom';

import Card from 'react-bootstrap/Card';
import Placeholder from 'react-bootstrap/Placeholder';

import "./CardPerson.css";




export default function CardPerson(props) {
    const [loading, setLoading] = useState(true);
    return (
        <div className="areaCardPerson">
            {loading && (
                <Placeholder animation='wave' >
                    <Card className="CardPerson me-auto ms-auto bg-secondary bg-opacity-25"></Card>
                </Placeholder>
            )}

            <Link  className={loading ? "d-none" : ""} to={`/person/${props.id}`}>
                <Card className="CardPerson me-auto ms-auto">
                    <Card.Img src={`https://image.tmdb.org/t/p/original/${props.profile_path}`} className="img-fluid" 
                    alt={props.name} onLoad={() => setLoading(false)} />
                    <Card.Body className='card-bod d-flex flex-column'>
                        <b>{props.name}</b>
                        <span className="text-muted">{props.character}</span>
                    </Card.Body>
                </Card>
            </Link>
        </div>
    )
}