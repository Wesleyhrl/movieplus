import { useEffect, useState } from "react";
import { useNavigate, useLocation} from "react-router-dom";

import { Col, Row } from "react-bootstrap";

import api from "../../services/api";
import Loading from '../../components/Loading';
import CardMovie from "../../components/CardMovie.jsx";

import "./Streaming.css"

export default function Streaming(props) {
    const navigate = useNavigate();
    const location = useLocation();

    const [streaming, setStreaming] = useState({});
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(1);
    const [loading, setLoading] = useState(true);

    //initial State
    useEffect(()=>{
        setLoading(true);
        setPage(1);
    },[location])
    
    useEffect(() => {
        async function loadStreaming() {
            const responseSearch = await api.get(`${location.pathname}/popular`, {
                params: {
                    api_key: process.env.REACT_APP_URL_KEY,
                    language: "pt-BR",
                    page: page,
                }
            }).catch(() => {
                navigate("/", { replace: true });
            });
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
    }, [page, loading  , navigate, location.pathname ]);
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
    
    if (loading) {
        
        return (
            <div className="Movie">
                <Loading />
            </div>
        )
    }
    return (
        
        <div className="Movie">
            <h2>{location.pathname === "/movie"? "Filmes" : "TV Shows"}</h2>

            <Row>
                {streaming && (streaming.results.map((item, i) => {
                    if (item.adult) {
                        return (null);
                    }
                    if (!item.poster_path) {
                        return (null);
                    }
                    return (
                        <Col key={`${item.id}_[${i}]`} xs={12} sm={6} md={4} lg={3} xl={2} className="p-3">
                            <CardMovie type={location.pathname.replace("/","")} id={item.id} title={item.title || item.name} poster={item.poster_path} average={item.vote_average} date={item.release_date || item.first_air_date} />
                        </Col>
                    )
                }))}
            </Row>
            <li id="sentry">{!(page === total) ? <Loading />: null }</li>
        </div>
    )
}