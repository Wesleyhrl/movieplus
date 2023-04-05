import { useEffect, useState } from "react";
import { useNavigate, useLocation, useSearchParams, Link } from "react-router-dom";

import { Col, Row } from "react-bootstrap";

import api from "../../services/api";
import Loading from "../../components/Loading";
import CardMovie from "../../components/CardMovie.jsx";
import SelectForm from "./../../components/SelectForm";

import "./Streaming.css"


export default function Streaming(props) {
    const navigate = useNavigate();
    const location = useLocation();

    const [searchParams] = useSearchParams();

    const [streaming, setStreaming] = useState({});
    const [listGenres, setListGenres] = useState([]);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(1);
    const [loading, setLoading] = useState(true);
    //initial State
    useEffect(() => {
        setLoading(true);
        setPage(1);

    }, [location, searchParams])

    useEffect(() => {
        async function loadStreaming() {
            const responseGenres = await api.get(`genre${location.pathname}/list`, {
                params: {
                    api_key: process.env.REACT_APP_URL_KEY,
                    language: "pt-BR",
                }
            });
            const responseSearch = await api.get(`discover${location.pathname}`, {
                params: {
                    api_key: process.env.REACT_APP_URL_KEY,
                    language: "pt-BR",
                    sort_by: "popularity.desc",
                    include_adult: false,
                    page: page,
                    with_genres: searchParams.get("id")
                }
            }).catch(() => {
                navigate("/", { replace: true });
            });
            setListGenres(responseGenres.data.genres);
            console.log("Generos:", responseGenres.data)
            if (loading) {
                setStreaming(responseSearch.data);
                setLoading(false);
            } if (page > 1) {
                setStreaming((prev) => {
                    return ({ ...prev, page: page, results: [...prev.results, ...responseSearch.data.results] })
                });
            }
            setTotal(responseSearch.data.total_pages <= 500 ? responseSearch.data.total_pages : 500);


        }
        loadStreaming();
    }, [page, loading, navigate, location, searchParams]);
    console.log(location)
    console.log(streaming);
    useEffect(() => {
        if (!loading) {
            const intersectionObserver = new IntersectionObserver((entries) => {
                if (entries.some((entry) => entry.isIntersecting)) {
                    setPage((pageInsideState) => pageInsideState + 1);
                }
            });
            intersectionObserver.observe(document.querySelector("#sentry"));
            if (page === total) {
                intersectionObserver.disconnect();
            }
            return () => intersectionObserver.disconnect();
        }
    }, [total, loading, page]);

    function handleGenre(genre, id) {
        navigate(`${location.pathname}?genre=${genre.toLowerCase().replace("&","e")}&id=${id}`)
    }


    if (loading) {

        return (
            <div className="Movie">
                <Loading />
            </div>
        )
    }
    return (

        <div className="Movie">
            {searchParams.get("genre") ? (
                <div className="breadcrumb">
                    <h2 className="breadcrumb-item">
                        <Link to={location.pathname}>{location.pathname === "/movie" ? "Filmes" : "TV Shows"}</Link>
                    </h2>
                    <h2 className="breadcrumb-item active">{searchParams.get("genre")}</h2>
                </div>

            ) : (
                <div className="d-md-flex">
                    <h2 className="me-2 text-nowrap">{location.pathname === "/movie" ? "Filmes" : "TV Shows"}</h2>
                    <SelectForm list={listGenres} handle={handleGenre} />
                </div>
            )}

            <Row>
                {streaming && (streaming.results.map((item, i) => {
                    if (item.adult) {
                        return (null);
                    }
                    if (!item.poster_path) {
                        return (null);
                    }
                    return (
                        <Col key={`${item.id}_[${i}]`} xs={12} sm={6} md={4} lg={3} xl={3} xxl={2} className="p-2">
                            <CardMovie type={location.pathname.replace("/", "")} id={item.id} title={item.title || item.name} poster={item.poster_path} average={item.vote_average} date={item.release_date || item.first_air_date} />
                        </Col>
                    )
                }))}
                <Col xs={12} sm={6} md={4} lg={3} xl={3} xxl={2}>
                    <li id="sentry" className="h-100 d-flex flex-column justify-content-center">
                        {!(page === total) ? <Loading /> : null}</li>
                </Col>
            </Row>

        </div>
    )
}