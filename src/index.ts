
const MY_EMAIL: string = 'm.naser@innopolis.university'
const FIRST_URL: string = 'https://fwd.innopolis.app/api/hw2';
const SECOND_URL: string = 'https://getxkcd.vercel.app/api/comic';


function getHeader(): Headers{
    let headers : Headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Accept', 'application/json');
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Access-Control-Allow-Headers', '*');
    headers.append('Access-Control-Allow-Credentials', 'true');
    headers.append('GET', 'OPTIONS');
    return headers;
}

function getSearchParams(names: string[], values: string[] ): URLSearchParams{
    let urlSearchParam: URLSearchParams = new URLSearchParams();
    for(let i = 0; i < names.length; i++){
        urlSearchParam.append(names[i], values[i]);
    }
    return urlSearchParam;
}


interface Data{
    img: string,
    title: string,
    alt: string

}

function callAPIWithSearchParamsForId(url: string): Promise<string>{
    return fetch(url, {headers: getHeader()})
        .then(response => {
            return response.text()})
        .then(data => data as string)

}

function callAPIWithSearchParamsForImage(url: string): Promise<Data>{
    return fetch(url, {mode:'cors', headers: getHeader()})
        .then(response =>  response.json())
        .then(data => data as Data)
}

function buildURL(url: string, params: string){
    return url + '?' + params;
}


async function fetchXKCD(email: string): Promise<void>{
    let urlParamString = ''
    if(email !== null){
        urlParamString = getSearchParams(['email'], [email]).toString()
    }
    let id: string;
    await callAPIWithSearchParamsForId(buildURL(FIRST_URL, urlParamString)).then(data => {
        id = data;
        let secondUrlParamString = getSearchParams(['num'], [id]).toString();
        callAPIWithSearchParamsForImage(buildURL(SECOND_URL, secondUrlParamString))
            .then(data =>{
                const respimg: HTMLImageElement = document.getElementById('respimg') as HTMLImageElement;
                const title: HTMLElement = document.getElementById('resptitle') as HTMLElement;
                const uploaddate: HTMLElement = document.getElementById('uploaddate') as HTMLElement;
                uploaddate.textContent = new Date().toLocaleDateString()
                title.textContent = data.title
                respimg.src = data.img
                respimg.alt = data.alt
            })
    })
}

fetchXKCD(MY_EMAIL)

