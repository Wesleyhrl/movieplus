import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"

import { Col, Row } from "react-bootstrap";
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';

import { fetchSearch } from './../../services/api';
import CardMovie from "../../components/CardMovie.jsx";
import Loading from "../../components/Loading.jsx";
import CardPerson from "../../components/CardPerson.jsx";

import "./Search.css"

export default function Search(props) {
    const { value } = useParams();
    const [streaming, setStreaming] = useState({});
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(1);
    const [loading, setLoading] = useState(true);
    const [isPerson, setIsPerson] = useState(false);

    useEffect(() => {
        setLoading(true);
        setPage(1);
    }, [value, isPerson])

    useEffect(() => {
        async function loadStreaming() {
            const dataSearch = await fetchSearch(value, page);
            if (loading) {
                setStreaming(dataSearch);
                setLoading(false);
            } if (page > 1) {
                setStreaming((prev) => {
                    return ({ ...prev, page: page, results: [...prev.results, ...dataSearch.results] })
                });
            }
            setTotal(dataSearch.total_pages <= 500 ? dataSearch.total_pages : 500);
        }
        loadStreaming();
    }, [value, page, loading]);
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
            <div className="d-flex flex-wrap">
                <h2 className="me-4">Pesquisando:</h2>
                <DropdownButton
                    className="dropType"
                    align="end"
                    title={isPerson ? "Pessoas" : "Filmes e Series"}
                    id="dropdown-menu-align-end"
                >
                    <Dropdown.Item onClick={() => setIsPerson(!isPerson)}>{!isPerson ? "Pessoas" : "Filmes e Series"}</Dropdown.Item>
                </DropdownButton>
            </div>
            <h4 className="pt-4 p-2">Resultado: <i className="text-muted">{value}</i></h4>
            <Row className="listSearch">
                {streaming && (streaming.results.map((item, i) => {
                    if (isPerson) {
                        if (item.media_type === "person") {
                            if (item.profile_path) {
                                return (
                                    <Col xs={12} sm={6} md={4} lg={3} xl={3} xxl={2} key={`${item.id}_[${i}]`} className="p-2">
                                        <CardPerson name={item.name} id={item.id} profile_path={item.profile_path}
                                            character={item.character} />
                                    </Col>
                                )
                            }
                        } else {
                            return null;
                        }
                    }
                    if (!item.poster_path) {
                        return (null);
                    }
                    return (
                        <Col xs={12} sm={6} md={4} lg={3} xl={3} xxl={2} key={`${item.id}_[${i}]`} className="p-2">
                            <CardMovie type={item.media_type} id={item.id} title={item.title || item.name} poster={item.poster_path}
                                average={item.vote_average} date={item.release_date || item.first_air_date} />
                        </Col>
                    )
                }))}
                <Col xs={12} sm={6} md={4} lg={3} xl={3} xxl={2}>
                    <li id="sentry" className="h-100 d-flex flex-column justify-content-center">
                        {!(page === total) ? <Loading /> : null}</li>
                </Col>
            </Row>
            {streaming && (!streaming.results.length && (<b className="p-4">Não encontramos resultados</b>))}
        </div>
    )
}