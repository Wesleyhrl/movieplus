import { useCallback, useEffect, useState } from 'react';
import { Navigation, Pagination, A11y } from 'swiper';

import { Swiper } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import "./Slider.css"


export default function Slider(props) {
    const windowSize =
        useCallback(() => {
            if (window.innerWidth >= 1200) {
                return props.slidesPerView;
            } if (window.innerWidth >= 992) {
                return 3;
            } if (window.innerWidth >= 576) {
                return 2;
            } if (window.innerWidth < 576) {
                return 1
            }
        }, [props.slidesPerView]);
    const [slidesPerView, setSlidesPerView] = useState(windowSize);
    useEffect(() => {
        window.addEventListener("resize", () => {
            setSlidesPerView(windowSize);
        });
    }, [windowSize]);
    return (
        <Swiper
            modules={[Navigation, Pagination, A11y]}
            spaceBetween={props.spaceBetween}
            slidesPerView={slidesPerView}
            navigation={props.navigation}
            pagination={props.pagination}
            loop={props.loop}
        >
            {props.children}
        </Swiper>
    )
}