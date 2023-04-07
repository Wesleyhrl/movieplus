import { useEffect, useState } from "react";
import { useParams} from "react-router-dom";

import { Col, Row } from "react-bootstrap";

import CardMovie from "../../components/CardMovie.jsx";
import Loading from "../../components/Loading.jsx";
import api from "../../services/api.js";

import "./PersonDetails.css"

export default function PersonDetails() {
    const { id } = useParams();
    const [person, setPerson] = useState({});
    const [streaming, setStreaming] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadStreaming() {
            const responsePerson = await api.get(`/person/${id}`, {
                params: {
                    api_key: process.env.REACT_APP_URL_KEY,
                    language: "pt-BR",
                }
            });
            const responseCredits = await api.get(`person/${id}/combined_credits`, {
                params: {
                    api_key: process.env.REACT_APP_URL_KEY,
                    language: "pt-BR",
                    page: 1,
                }
            });
            setPerson(responsePerson.data);
            setStreaming(responseCredits.data.cast);
            setLoading(false);
            console.log(responseCredits.data.cast);
            console.log(responsePerson.data);
        }
        loadStreaming()
    }, [id]);

    if (loading) {
        return (
            <div className="Movie">
                <Loading />
            </div>
        )
    }

    return (
        <div className="PersonDetails">
            <div className="breadcrumb">
                <h2 className="breadcrumb-item">
                    Pessoas
                </h2>
                <h2 className="breadcrumb-item active">{person.name}</h2>
            </div>
            <div className="d-flex justify-md-content-center flex-column flex-md-row">
                <div className="mb-2 me-md-3 d-flex justify-content-center" >
                    <img className="person-img" src={`https://image.tmdb.org/t/p/original/${person.profile_path}`} alt={person.name} />
                </div>
                <div >
                    <div>
                        <h5>Conhecido(a) por</h5>
                        <span>{person.known_for_department}</span>
                        {person.birthday && (
                            <>
                            <h5>Nascimento</h5>
                            <span>{person.birthday.split('-').reverse().join('/')}</span>
                            </>
                        )}
                        {person.deathday && (
                            <>
                            <h5>Falecimento</h5>
                            <span>{person.deathday.split('-').reverse().join('/')}</span>
                            </>
                        )}
                        <h5>Local de Nascimento</h5>
                        <span>{person.place_of_birth}</span>
                    </div>
                    <h5>Biografia</h5>
                    <p>{person.biography}</p>
                </div>
            </div>

            <Row>
                <h2>Conhecido(a) por</h2>
                {streaming.map((item, i) => {
                    if (item.adult) {
                        return (null);
                    }
                    if (!item.poster_path) {
                        return (null);
                    }
                    return (
                        <Col xs={12} sm={6} md={4} lg={3} xl={3} xxl={2} key={i} className="p-3">
                            <CardMovie type={item.media_type} id={item.id} title={item.title || item.name} poster={item.poster_path} average={item.vote_average} date={item.release_date || item.first_air_date} />
                        </Col>

                    )
                })}
            </Row>

        </div>
    )
}