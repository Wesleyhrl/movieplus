import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"

import { Col, Row } from "react-bootstrap";

import api from './../../services/api';
import CardMovie from "../../components/CardMovie.jsx";
import Loading from "../../components/Loading.jsx";

import "./Search.css"




export default function Search(props) {
    const { value } = useParams();
    const [streaming, setStreaming] = useState({});
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(1);
    const [loading, setLoading] = useState(true);

    useEffect(()=>{
        setLoading(true);
        setPage(1);
    },[value])


    useEffect(() => {

        async function loadStreaming() {
            const responseSearch = await api.get(`/search/multi`, {
                params: {
                    api_key: process.env.REACT_APP_URL_KEY,
                    language: "pt",
                    query: value,
                    page: page,
                    include_adult: false
                }
            })
            if (loading) {
                setStreaming(responseSearch.data);
                setLoading(false);
            }if(page > 1 ) {
                setStreaming((prev) => {
                    return ({ ...prev, page: page, results: [...prev.results, ...responseSearch.data.results] })
                });
            }
            setTotal(responseSearch.data.total_pages <= 500 ? responseSearch.data.total_pages : 500);
        }
        loadStreaming();
    }, [value, page, streaming.total_pages , loading]);
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

    if (loading) {
        return (
            <div className="Search">
                <Loading />
            </div>

        )
    }
    return (
        <div className="Search">
            <h2>Procurando: <span id="value">{value}</span></h2>
            <Row className="listSearch">
                {streaming && (streaming.results.map((item) => {
                    if (item.media_type === "person") {
                        return (null);
                    } if (!item.poster_path) {
                        return (null);
                    }
                    return (
                        <Col xs={12} sm={6} md={4} lg={3} xl={2} key={item.id} className="p-3">
                            <CardMovie type={item.media_type} id={item.id} title={item.title || item.name} poster={item.poster_path} average={item.vote_average} date={item.release_date || item.first_air_date} />
                        </Col>
                    )
                }))}
                <li id="sentry">{!(page === total) ? <Loading />: null }</li>
            </Row>
            {streaming && (!streaming.results.length &&(<b className="p-4">Não encontramos resultados</b>))}
        </div>
    )
}