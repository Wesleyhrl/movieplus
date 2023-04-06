import { faPlay, faStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate, Link, useLocation } from "react-router-dom";

import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Badge from 'react-bootstrap/Badge';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import Slider from '../../components/Slider';
import { SwiperSlide } from 'swiper/react';

import { toast } from "react-toastify";

import erroBackdrop from "../../assets/erro_backdrop.png"

import Image from "../../components/Image.jsx";
import Loading from '../../components/Loading';
import Btn from "../../components/Btn.jsx";
import CardMovie from "../../components/CardMovie.jsx";
import api from '../../services/api';
import "./Details.css"


export default function Details(props) {
    const { type, id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    const [streaming, setStreaming] = useState({});
    const [trailer, setTrailer] = useState({});
    const [cast, setCast] = useState({});
    const [similar, setSimilar] = useState({});
    const [loading, setLoading] = useState(true);
    const [errorImg, setErrorImg] = useState(false);
    const [showModal, setModalShow] = useState(false);


    const runtime = streaming.episode_run_time || (new Date(0, 0, 0, 0, streaming.runtime, null)).toLocaleTimeString();

    const myList = localStorage.getItem("@movieplus");
    let getStreaming = useMemo(() => { return JSON.parse(myList) || [] }, [myList]);
    const [hasStreaming, setHasStreaming] = useState();

    useEffect(() => {
        setErrorImg(false);
        window.scrollTo(0, 0);
    }, [location.pathname]);


    useEffect(() => {

        async function loadFilme() {
            await api.get(`/${type}/${id}`, {
                params: {
                    api_key: process.env.REACT_APP_URL_KEY,
                    language: "pt-BR",
                }
            }).then((response) => {
                setStreaming(response.data);
            }).catch(() => {
                navigate("/", { replace: true });
            });
            const responseTrailer = await api.get(`/${type}/${id}/videos`, {
                params: {
                    api_key: process.env.REACT_APP_URL_KEY,
                    language: "pt-BR",
                }
            });
            const responseCast = await api.get(`/${type}/${id}/credits`, {
                params: {
                    api_key: process.env.REACT_APP_URL_KEY,
                    language: "pt-BR",
                }
            });
            const responseRecommend = await api.get(`/${type}/${id}/recommendations`, {
                params: {
                    api_key: process.env.REACT_APP_URL_KEY,
                    language: "pt-BR",
                    page: 1,
                }
            });
            const responseSimilar = await api.get(`/${type}/${id}/similar`, {
                params: {
                    api_key: process.env.REACT_APP_URL_KEY,
                    language: "pt-BR",
                    page: 1,
                }
            });
            setTrailer(responseTrailer.data);
            setCast(responseCast.data.cast.slice(0, 10));
            setSimilar(responseRecommend.data.results.length ? responseRecommend.data.results : responseSimilar.data.results);
            setLoading(false);
        }
        loadFilme();
        setHasStreaming(getStreaming.some((movieSave) => movieSave.id === streaming.id));

        return () => { }
    }, [id, streaming.id, getStreaming, type, navigate]);

    console.log(trailer);
    console.log(streaming);
    console.log(cast);
    console.log(similar);
    console.log(hasStreaming);

    function favoriteMovie(id) {
        if (hasStreaming) {
            let filter = getStreaming.filter((filme) => {
                return (filme.id !== id)
            })
            localStorage.setItem("@movieplus", JSON.stringify(filter));
            setHasStreaming(false);
            toast.warning("Favorito removido");
            return;
        } else {
            getStreaming.push({ ...streaming, type: type });
            localStorage.setItem("@movieplus", JSON.stringify(getStreaming));
            setHasStreaming(true);
            toast.success("Favorito salvo");
        }
    }

    if (loading) {
        return (
            <Loading />
        )
    }
    return (
        <div className="Details d-flex flex-column ms-auto me-auto ">
            <div className="container info">
                <h2 className="text-center">{streaming.title || streaming.name}</h2>
                <div className="backdrop d-flex justify-content-center align-items-center">
                    {errorImg ?
                        (<div className="ErrorImg">
                            <img src={erroBackdrop} alt="Error" />
                        </div>) :
                        (
                            <Image classLoad="loadImg" classImg="img-fluid" src={`https://image.tmdb.org/t/p/original/${streaming.backdrop_path}`}
                                alt={streaming.title} onError={() => setErrorImg(true)} />
                        )
                    }
                    <button onClick={() => setModalShow(true)} ><FontAwesomeIcon icon={faPlay} size="3x" /></button>
                </div>
                <div>
                    <div className="movie-info d-flex flex-column flex-md-row justify-content-center flex-wrap align-items-center">
                        <b>{new Date(streaming.release_date || streaming.first_air_date).toLocaleDateString()}</b>
                        <div className="text-center">
                            {streaming.genres.map((genres) => {
                                return (
                                    <Badge key={genres.id} bg="secondary" className="m-1">
                                        <Link to={`/${type}?genre=${genres.name.toLowerCase().replace("&", "e")}&id=${genres.id}`}>
                                            {genres.name}
                                        </Link>
                                    </Badge>
                                )
                            })}
                        </div>
                        {runtime.length ? (<b>{`${type === "tv" ? runtime.join("/") : runtime}`}{type === "tv" && "Min"}</b>) : "N/A"}

                    </div>

                    <Row className="mt-4">
                        <Col md="8">
                            <h5>Sinopse</h5>
                            <p className="p-1">{streaming.overview}</p>
                        </Col >
                        <Col md="4">
                            <h5>Elenco</h5>
                            <p>{cast.length && (cast.map((e) => {
                                return (
                                    <Badge key={e.id} pill bg="secondary" className="m-1">
                                        {e.name}
                                    </Badge>
                                )
                            })
                            )}</p>
                        </Col>
                    </Row>
                    <Row className="mt-2 text-center">
                        {type === "tv" && (

                            <Col>
                                <h5>Temporadas</h5>
                                <strong>{streaming.number_of_seasons} </strong>
                            </Col>
                        )}
                        {type === "tv" && (
                            <Col>
                                <h5>Episódios</h5>
                                <strong>{streaming.number_of_episodes}</strong>
                            </Col>
                        )}
                        {type === "movie" && (
                            <Col>
                                <h5>Orçamento</h5>
                                <strong>${streaming.budget.toLocaleString('pt-BR')}</strong>
                            </Col>
                        )}
                        {type === "movie" && (
                            <Col>
                                <h5>Receita</h5>
                                <strong>${streaming.revenue.toLocaleString('pt-BR')}</strong>
                            </Col>
                        )}
                        <Col>
                            <h5>Avaliação</h5>
                            <strong>{streaming.vote_average}</strong>
                        </Col>

                    </Row>

                </div>
                <div className="text-center mt-3">
                    <Btn className={hasStreaming ? "favorite" : ""} onClick={() => favoriteMovie(streaming.id)} size="lg"><FontAwesomeIcon icon={faStar} /> Favorito</Btn>
                </div>
            </div>
            <div className="similar-movie mt-5">
                <h2>Similares</h2>
                <Slider spaceBetween={30} slidesPerView={4} navigation={true} loop={true}>
                    {similar.map((item) => {
                        if (!item.poster_path) {
                            return (null)
                        } if (item.adult) {
                            return (null)
                        }
                        return (
                            <SwiperSlide key={item.id}>
                                <CardMovie type={type} id={item.id} title={item.title || item.name} poster={item.poster_path} average={item.vote_average} date={item.release_date || item.first_air_date} />
                            </SwiperSlide>
                        )
                    })}
                </Slider>
            </div>

            <Modal
                size="xl"
                show={showModal}
                onHide={() => setModalShow(false)}
                aria-labelledby="modal"
                className="modal"

            >
                <Modal.Header className="modal-header" closeVariant="white" closeButton>
                    <Modal.Title>{streaming.title || streaming.name}</Modal.Title>
                </Modal.Header>
                <Modal.Body className="modal-body ratio ratio-16x9">
                    {trailer.results && (trailer.results.length ?
                        <iframe src={`https://www.youtube.com/embed/${trailer.results.filter((e) => e.name.toLowerCase().includes("trailer")).map((e) => e.key)[0] || trailer.results[0].key}`}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            title="Trailer Video" allowFullScreen></iframe>
                        :
                        <div className="d-flex flex-column justify-content-center align-items-center">
                            <h3>Trailer não encontrado</h3>
                            <Button onClick={() => setModalShow(false)} variant="link" size="lg">
                                Voltar para o conteúdo
                            </Button>
                        </div>
                    )}
                </Modal.Body>
            </Modal>
        </div>
    )
}