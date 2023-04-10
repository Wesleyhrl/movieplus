import { faStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";

import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import Slider from '../../components/slider/Slider';
import { SwiperSlide } from 'swiper/react';

import { toast } from "react-toastify";

import Backdrop from "../../components/backdrop/Backdrop.jsx";
import CardPerson from "../../components/card/CardPerson.jsx";
import Loading from '../../components/loading/Loading';
import Btn from "../../components/buttons/Btn.jsx";
import CardMovie from "../../components/card/CardMovie.jsx";
import { fetchCast, fetchDetails, fetchRecommend, fetchSimilar, fetchTrailer } from '../../services/api';

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
    const [showModal, setModalShow] = useState(false);

    const runtime = streaming.episode_run_time || (new Date(0, 0, 0, 0, streaming.runtime, null)).toLocaleTimeString();

    const myList = localStorage.getItem("@movieplus");
    let getStreaming = useMemo(() => { return JSON.parse(myList) || [] }, [myList]);
    const [hasStreaming, setHasStreaming] = useState();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location.pathname]);

    useEffect(() => {
        async function loadFilme() {
            setStreaming(await fetchDetails(type, id).then((data) => { return data }).catch(() => navigate("/", { replace: true })));
            const dataTrailer = await fetchTrailer(type, id);
            setTrailer(dataTrailer.results.length ? dataTrailer : await fetchTrailer(type,id,"en-US"));
            setCast(await fetchCast(type, id).then((d) => d.cast));
            const dataRecommend = await fetchRecommend(type, id);
            const dataSimilar = await fetchSimilar(type, id)
            setSimilar(dataRecommend.results.length ? dataRecommend.results : dataSimilar.results);
            setLoading(false);
        }
        loadFilme();
        setHasStreaming(getStreaming.some((movieSave) => movieSave.id === streaming.id));

        return () => { }
    }, [id, streaming.id, getStreaming, type, navigate]);

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
            <div className="Details">
                <Loading />
            </div>
        )
    }
    return (
        <div className="Details">
            <div className="container-fluid">
                <Backdrop title={streaming.title || streaming.name} date={streaming.release_date || streaming.first_air_date}
                    type={type} genres={streaming.genres} overview={streaming.overview} backdrop_path={streaming.backdrop_path}
                    id={streaming.id} runtime={runtime} video setModalShow={setModalShow} />

                <div>
                    <Row className="mt-4">
                        <Col md="10" className="mb-3">
                            <h5>Elenco</h5>
                            <Slider spaceBetween={20} slidesPerView={4} navigation={true}>
                                {cast.length && (cast.map((cast) => {
                                    if (!cast.profile_path) {
                                        return (null);
                                    }
                                    return (
                                        <SwiperSlide key={cast.id}>
                                            <CardPerson name={cast.name} id={cast.id} profile_path={cast.profile_path}
                                                character={cast.character} />
                                        </SwiperSlide>
                                    )
                                })
                                )}
                            </Slider>
                        </Col>
                        <Col>
                            <Row >
                                <Col md="12">
                                    <h5>Status</h5>
                                    <strong>{streaming.status}</strong>
                                </Col>
                                {type === "tv" && (
                                    <Col xs="12">
                                        <h5>Temporadas</h5>
                                        <strong>{streaming.number_of_seasons} </strong>
                                    </Col>
                                )}
                                {type === "tv" && (
                                    <Col xs="12">
                                        <h5>Episódios</h5>
                                        <strong>{streaming.number_of_episodes}</strong>
                                    </Col>
                                )}
                                {type === "movie" && (
                                    <Col xs="12">
                                        <h5>Orçamento</h5>
                                        <strong>${streaming.budget.toLocaleString('pt-BR')}</strong>
                                    </Col>
                                )}
                                {type === "movie" && (
                                    <Col xs="12">
                                        <h5>Receita</h5>
                                        <strong>${streaming.revenue.toLocaleString('pt-BR')}</strong>
                                    </Col>
                                )}
                                <Col xs="12">
                                    <h5>Avaliação</h5>
                                    <strong>{streaming.vote_average}</strong>
                                </Col>
                            </Row>
                        </Col >
                    </Row>
                    <div className="text-center mt-5">
                        <Btn className={hasStreaming ? "favorite" : ""} onClick={() => favoriteMovie(streaming.id)} size="lg">
                            <FontAwesomeIcon icon={faStar} /> Favorito</Btn>
                    </div>
                </div>
                <Row className="mt-5">
                    <h2>Similares</h2>
                    <Slider spaceBetween={30} slidesPerView={5} navigation={true} loop={true}>
                        {similar.map((item) => {
                            if (!item.poster_path) {
                                return (null)
                            } if (item.adult) {
                                return (null)
                            }
                            return (
                                <SwiperSlide key={item.id}>
                                    <CardMovie type={type} id={item.id} title={item.title || item.name} poster={item.poster_path}
                                        average={item.vote_average} date={item.release_date || item.first_air_date} />
                                </SwiperSlide>
                            )
                        })}
                    </Slider>
                </Row>
            </div>

            <Modal
                size="xl"
                show={showModal}
                onHide={() => setModalShow(false)}
                aria-labelledby="modal"
                className="modal"
            >
                <Modal.Header className="modal-header" closeVariant="white" closeButton>
                    <Modal.Title>Trailer: {streaming.title || streaming.name}</Modal.Title>
                </Modal.Header>
                <Modal.Body className="modal-body ratio ratio-16x9">
                    {trailer.results && (trailer.results.length ?
                        <iframe
                            src={`https://www.youtube.com/embed/${trailer.results.filter((e) =>
                                e.name.toLowerCase().includes("trailer")).map((e) => e.key)[0] || trailer.results[0].key}`}
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