import { useEffect, useState } from "react"

import Slider from '../../components/slider/Slider';
import { SwiperSlide } from 'swiper/react';

import Backdrop from "../../components/backdrop/Backdrop.jsx";
import BtnChange from "../../components/buttons/BtnChange.jsx";
import Loading from "../../components/loading/Loading.jsx";
import CardMovie from "../../components/card/CardMovie.jsx";
import { fetchBackdrop, fetchNow, fetchTop, fetchTrending } from "../../services/api.js";

import "./Home.css"

export default function Home(props) {
    const [nowPlaying, setNowPlaying] = useState([]);
    const [trending, setTreding] = useState({});
    const [top, setTop] = useState({});
    const [backdrop, setBackdrop] = useState({});
    const [loading, setLoading] = useState(true);
    const [type, setType] = useState("movie");

    useEffect(() => {
        async function loadFilmes() {
            setTreding(await fetchTrending(type).then((d)=>{return d.results}));
            setNowPlaying(await fetchNow(type).then((d)=>{return d.results}));
            setTop(await fetchTop(type).then((d)=>{return d.results}));
            setBackdrop(await fetchBackdrop(type,3));
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
        <div>
            <div className="container-fluid">
                <Backdrop title={backdrop.title || backdrop.name} date={backdrop.release_date || backdrop.first_air_date}
                    type={type} genres={backdrop.genres} backdrop_path={backdrop.backdrop_path} id={backdrop.id} />
            </div>
            <div className="Home">
                <BtnChange size="lg" type={type} name1="movie" name2="tv" text1="Filme" text2="TV" onClick={setType} />
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
        </div>
    )
}