import { useState } from 'react';
import { Link } from 'react-router-dom';

import Card from 'react-bootstrap/Card';
import Placeholder from 'react-bootstrap/Placeholder';

import "./CardPerson.css";




export default function CardPerson(props) {
    const [loading, setLoading] = useState(true);
    return (
        <div>
            {loading && (
                <Placeholder animation='wave' >
                    <Card className="CardPerson bg-secondary bg-opacity-25"></Card>
                </Placeholder>
            )}

            <Link  className={loading ? "d-none" : ""} to={`/person?name=${props.name}&id=${props.id}`}>
                <Card className="CardPerson">
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