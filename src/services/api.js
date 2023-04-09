import axios from "axios";

const api = axios.create({
    baseURL: "https://api.themoviedb.org/3/"
});
const KEY = process.env.REACT_APP_URL_KEY;

export async function fetchTrending(type, page = 1) {
    const response = await api.get(`trending/${type}/day`, {
        params: {
            api_key: KEY,
            language: "pt-BR",
            page: page,
        }
    });
    return response.data;
}
export async function fetchNow(type, page = 1) {
    const response = await api.get(`${type}/${type === "movie" ? "now_playing" : "on_the_air"}`, {
        params: {
            api_key: KEY,
            language: "pt-BR",
            page: page,
        }
    });
    return response.data;
}
export async function fetchTop(type, page = 1) {
    const response = await api.get(`${type}/top_rated`, {
        params: {
            api_key: KEY,
            language: "pt-BR",
            page: page,
        }
    });
    return response.data;
}
export async function fetchBackdrop(type , qtyPage = 1) {
    let trending = await fetchTrending(type);
    for (let i = 2; i <= qtyPage; i++) {
        const response = await fetchTrending(type, i);
        trending = { ...trending, page: i, results: [...trending.results, ...response.results] }
    }
    console.log("trending", trending)
    const random = Math.floor(Math.random() * trending.results.length);
    const response = await api.get(`/${type}/${trending.results[random].id}`, {
        params: {
            api_key: KEY,
            language: "pt-BR",
        }
    })
    return response.data;
}

export default api;