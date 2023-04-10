import { useEffect, useState } from "react";

import { Col, Row } from "react-bootstrap";

import CardPerson from "../../components/CardPerson.jsx";
import Loading from "../../components/Loading.jsx";
import { fetchPerson } from "../../services/api.js";

import "./Person.css"

export default function Person() {
    const [persons, setPersons] = useState({});
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(1);

    useEffect(() => {
        async function loadStreaming() {
            const dataPerson = await fetchPerson(page);
            if (loading) {
                setPersons(dataPerson);
                setLoading(false);
            } if (page > 1) {
                setPersons((prev) => {
                    return ({ ...prev, page: page, results: [...prev.results, ...dataPerson.results] })
                });
            }
            setTotal(dataPerson.total_pages <= 500 ? dataPerson.total_pages : 500);
        }
        loadStreaming();
    }, [loading, page]);
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
            <div className="Person">
                <Loading />
            </div>
        )
    }

    return (
        <div className="Person">
            <h2>Pessoas</h2>
            <Row>
                {persons && (persons.results.map((item, i) => {
                    if (!item.profile_path) {
                        return (null);
                    }
                    return (
                        <Col key={`${item.id}_[${i}]`} xs={12} sm={6} md={4} lg={3} xl={3} xxl={2} className="p-3">
                            <CardPerson name={item.name} id={item.id} profile_path={item.profile_path}
                                character={item.character} />
                        </Col>
                    )
                })
                )}
                <Col xs={12} sm={6} md={4} lg={3} xl={3} xxl={2}>
                    <li id="sentry" className="h-100 d-flex flex-column justify-content-center">
                        {!(page === total) ? <Loading /> : null}</li>
                </Col>
            </Row>
        </div>
    )
}