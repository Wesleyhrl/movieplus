import { useEffect, useState } from "react"

import Slider from '../../components/Slider';
import { SwiperSlide } from 'swiper/react';

import BtnChange from "../../components/BtnChange.jsx";
import Loading from "../../components/Loading.jsx";
import CardMovie from "../../components/CardMovie.jsx";
import api from "../../services/api.js";

import "./Home.css"


export default function Home(props) {
    const [nowPlaying, setNowPlaying] = useState([]);
    const [trending, setTreding] = useState({});
    const [top, setTop] = useState({});
    const [loading, setLoading] = useState(true);
    const [type, setType] = useState("movie");

    function changetype(type) {
        setType(type);
    }

    useEffect(() => {
        async function loadFilmes() {
            const responseTrending = await api.get(`trending/${type}/day`, {
                params: {
                    api_key: process.env.REACT_APP_URL_KEY,
                    language: "pt-BR",
                    page: 1,
                }
            });
            const responseNow = await api.get(`${type}/${type === "movie" ? "now_playing" : "on_the_air"}`, {
                params: {
                    api_key: process.env.REACT_APP_URL_KEY,
                    language: "pt-BR",
                    page: 1,
                }
            });
            const responseTop = await api.get(`${type}/top_rated`, {
                params: {
                    api_key: process.env.REACT_APP_URL_KEY,
                    language: "pt-BR",
                    page: 1,
                }
            });
            setTreding(responseTrending.data.results);
            setNowPlaying(responseNow.data.results);
            setTop(responseTop.data.results);
            setLoading(false);
        }
        loadFilmes();

    }, [type]);

    if (loading) {
        return (
            <div className="Home">
                <Loading />
            </div>
            
        )
    }
    return (
        <div className="Home">
            <BtnChange size="lg" type={type} name1="movie" name2="tv" text1="Filme" text2="TV" onClick={changetype}/>
            <div className="list-movie">
                <h2>Têndencias</h2>
                <Slider spaceBetween={30} slidesPerView={5} navigation={true} loop={true}>
                    {trending.map((filme) => {
                        return (
                            <SwiperSlide key={filme.id}>
                                <CardMovie type={type} id={filme.id} title={filme.title || filme.name} poster={filme.poster_path} average={filme.vote_average} date={filme.release_date || filme.first_air_date} />
                            </SwiperSlide>
                        )
                    })}
                </Slider>
            </div>
            <div className="list-movie">
                <h2>Lançamentos</h2>
                <Slider spaceBetween={30} slidesPerView={5} navigation={true} loop={true}>
                    {nowPlaying.map((filme) => {
                        return (
                            <SwiperSlide key={filme.id}>
                                <CardMovie type={type} id={filme.id} title={filme.title || filme.name} poster={filme.poster_path} average={filme.vote_average} date={filme.release_date || filme.first_air_date} />
                            </SwiperSlide>
                        )
                    })}
                </Slider>
            </div>
            <div className="list-movie">
                <h2>Mais Votados</h2>
                <Slider spaceBetween={30} slidesPerView={5} navigation={true} loop={true}>
                    {top.map((filme) => {
                        return (
                            <SwiperSlide key={filme.id}>
                                <CardMovie type={type} id={filme.id} title={filme.title || filme.name} poster={filme.poster_path} average={filme.vote_average} date={filme.release_date || filme.first_air_date} />
                            </SwiperSlide>
                        )
                    })}
                </Slider>
            </div>
        </div>
    )
}