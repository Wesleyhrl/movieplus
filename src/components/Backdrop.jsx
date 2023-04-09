import { useState } from "react";
import { Link } from "react-router-dom";

import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Badge } from "react-bootstrap";

import { faPlay } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import "./Backdrop.css"
import Loading from './Loading';
import { useEffect } from "react";




export default function Backdrop(props) {
    const [errorImg, setErrorImg] = useState(false);
    const [loading, setLoading] = useState(true);
    useEffect(()=>{
        setErrorImg(false);
        setLoading(true);
    },[props.id])

    return (
        <Row className="backdrop d-flex flex-column-reverse flex-lg-row text-white">
            <Col xs={12} md={12} lg={5} xl={5} xxl={4} className="d-flex flex-column justify-content-center">
                <Link to={`/${props.type}/${props.id}`}><h2 >{props.title}</h2></Link>
                <div className="info-data">
                    <b>{props.date && (props.date.split('-').reverse().join('/'))}</b>
                    <b>{props.runtime && (props.runtime.length ?(<b>{`${props.runtime}`}{props.type === "tv" && "Min"}</b>) : "N/A")}</b>
                </div>
                <div className="d-flex flex-wrap">
                    <div>
                        {props.genres &&(props.genres.map((genres) => {
                            return (
                                <Badge key={genres.id} bg="secondary" className="m-1">
                                    <Link to={`/${props.type}?genre=${genres.name.toLowerCase().replace("&", "e")}&id=${genres.id}`}>
                                        {genres.name}
                                    </Link>
                                </Badge>
                            )
                        }))}
                    </div>
                </div>
                <div>
                    <p className="p-1 mt-3 tex-wrap">{props.overview}</p>
                </div>
            </Col>
            <Col xs={12} md={12} lg={7} xl={7} xxl={8} className="content-img p-0 d-flex justify-content-center align-items-center">
            {loading &&(<Loading/>)}
                {props.backdrop_path &&(!errorImg && <img className={`img-fluid ${loading && "d-none"}`} src={`https://image.tmdb.org/t/p/original/${props.backdrop_path}`}
                    alt={props.title} onLoad={()=> setLoading(false)} onError={() => {setErrorImg(true); setLoading(false);}} />)}
                {!loading &&(props.video &&<button onClick={() => props.setModalShow(true)} ><FontAwesomeIcon icon={faPlay} size="3x" /></button>)}
            </Col>
        </Row>
    )
}