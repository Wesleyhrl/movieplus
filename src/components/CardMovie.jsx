import { useState } from 'react';
import { Link } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';

import Card from 'react-bootstrap/Card';
import Placeholder from 'react-bootstrap/Placeholder';

import "./CardMovie.css"

export default function CardMovie(props) {
    const [loading, setLoading] = useState(true);
    const date = new Date(props.date)
    return (
        <div >
            {loading && (
                <Placeholder animation='wave' >
                    <Card className="loadCard bg-secondary me-auto ms-auto bg-opacity-25"></Card>
                </Placeholder>
            )}
            <Link className={loading ? "d-none" : ""} to={`/${props.type}/${props.id}`} >
                <Card className="bg-dark me-auto ms-auto CardMovie">
                    <Card.Img src={`https://image.tmdb.org/t/p/original/${props.poster}`} alt={props.title} onLoad={() => setLoading(false)} />
                    <Card.ImgOverlay className='d-flex flex-column justify-content-between align-items-center'>
                        <Card.Title>{props.title}</Card.Title>
                        <div className="cardText d-flex justify-content-between align-items-center">
                            <span><FontAwesomeIcon icon={faStar} />
                                {props.average.toFixed(1)}</span>
                            <Card.Text>{`${date.getMonth() + 1}/${date.getFullYear()}`}</Card.Text>
                        </div>
                    </Card.ImgOverlay>
                </Card>
            </Link>
        </div>
    )
}