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
export async function fetchBackdrop(type, qtyPage = 1) {
    let trending = await fetchTrending(type);
    for (let i = 2; i <= qtyPage; i++) {
        const response = await fetchTrending(type, i);
        trending = { ...trending, page: i, results: [...trending.results, ...response.results] }
    }
    const random = Math.floor(Math.random() * trending.results.length);
    const response = await fetchDetails(type, trending.results[random].id);
    return response;
}
export async function fetchDetails(type, id) {
    const response = await api.get(`/${type}/${id}`, {
        params: {
            api_key: KEY,
            language: "pt-BR",
        }
    });
    return response.data;
}
export async function fetchTrailer(type, id) {
    const response = await api.get(`/${type}/${id}/videos`, {
        params: {
            api_key: KEY,
            language: "pt-BR",
        }
    });
    return response.data;
}
export async function fetchCast(type, id) {
    const response = await api.get(`/${type}/${id}/credits`, {
        params: {
            api_key: KEY,
            language: "pt-BR",
        }
    });
    return response.data;
}
export async function fetchRecommend(type, id, page = 1) {
    const response = await api.get(`/${type}/${id}/recommendations`, {
        params: {
            api_key: KEY,
            language: "pt-BR",
            page: page,
        }
    });
    return response.data;
}
export async function fetchSimilar(type, id, page = 1) {
    const response = await api.get(`/${type}/${id}/similar`, {
        params: {
            api_key: KEY,
            language: "pt-BR",
            page: page,
        }
    });
    return response.data;
}
export async function fetchPerson(page = 1) {
    const response = await api.get(`/person/popular`, {
        params: {
            api_key: KEY,
            language: "pt-BR",
            page: page
        }
    });
    return response.data;
}
export async function fetchPersonDetails(id) {
    const response = await api.get(`/person/${id}`, {
        params: {
            api_key: KEY,
            language: "pt-BR",
        }
    });
    return response.data;
}
export async function fetchPersonCredits(id) {
    const response = await api.get(`person/${id}/combined_credits`, {
        params: {
            api_key: KEY,
            language: "pt-BR",
        }
    });
    return response.data;
}
export async function fetchSearch(value, page) {
    const response = await api.get(`/search/multi`, {
        params: {
            api_key: KEY,
            language: "pt",
            query: value,
            page: page,
            include_adult: false
        }
    });
    return response.data;
}
export async function fetchListGenre(pathname) {
    const response = await api.get(`genre${pathname}/list`, {
        params: {
            api_key: KEY,
            language: "pt-BR",
        }
    });
    return response.data;
}
export async function fetchStreaming(pathname, page, idGenre) {
    const response = await api.get(`discover${pathname}`, {
        params: {
            api_key: KEY,
            language: "pt-BR",
            sort_by: "popularity.desc",
            include_adult: false,
            page: page,
            with_genres: idGenre
        }
    });
    return response.data;
}
export default api;