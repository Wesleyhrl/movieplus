import { Link } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';

import Card from 'react-bootstrap/Card';

import "./CardMovie.css"

export default function CardMovie(props) {
    const date = new Date(props.date)
    return (
        <Link className="" to={`/${props.type}/${props.id}`}>
            <Card className="bg-dark me-auto ms-auto CardMovie">
                <Card.Img src={`https://image.tmdb.org/t/p/original/${props.poster}`} alt={props.title} />
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
    )
}