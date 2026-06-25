from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import requests

app=FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

API_KEY="ee36d5a0bbc1944a8656c055f787be19"

BASE_URL="https://api.themoviedb.org/3"
IMAGE_URL="https://image.tmdb.org/t/p/w500"


@app.get("/recommend/{query}")
def recommend(query:str):

    if len(query.strip())<3:
        return []

    # Search both movies + TV
    search=requests.get(

        f"{BASE_URL}/search/multi",

        params={

            "api_key":API_KEY,
            "query":query
        }

    ).json()

    if not search.get("results"):
        return []

    item=search["results"][0]

    media_type=item["media_type"]

    if media_type=="movie":

        id=item["id"]

        details=requests.get(

        f"{BASE_URL}/movie/{id}",

        params={"api_key":API_KEY}

        ).json()

        recommendations=requests.get(

        f"{BASE_URL}/movie/{id}/recommendations",

        params={"api_key":API_KEY}

        ).json()


    elif media_type=="tv":

        id=item["id"]

        details=requests.get(

        f"{BASE_URL}/tv/{id}",

        params={"api_key":API_KEY}

        ).json()

        recommendations=requests.get(

        f"{BASE_URL}/tv/{id}/recommendations",

        params={"api_key":API_KEY}

        ).json()

    else:
        return []


    output=[]

    output.append({

    "title":
    details.get("title")
    or details.get("name"),

    "poster":
    IMAGE_URL+details["poster_path"]
    if details.get("poster_path")
    else "",

    "rating":
    round(details.get(
    "vote_average",0),1),

    "overview":
    details.get(
    "overview",""),

    "year":
    (
    details.get(
    "release_date","")
    or
    details.get(
    "first_air_date","")
    )[:4],

    "genre":
    ", ".join(
    [g["name"]
    for g in
    details.get(
    "genres",[]
    )]
    ),

    "type":
    "Movie"
    if media_type=="movie"
    else
    "TV Series"

    })


    for m in recommendations.get(
    "results",[]
    )[:12]:

        output.append({

        "title":
        m.get("title")
        or
        m.get("name"),

        "poster":
        IMAGE_URL+m["poster_path"]
        if m.get(
        "poster_path")
        else "",

        "rating":
        round(
        m.get(
        "vote_average",0),1),

        "overview":
        m.get(
        "overview",""),

        "year":
        (
        m.get(
        "release_date","")
        or
        m.get(
        "first_air_date","")
        )[:4],

        "genre":"",

        "type":
        "Movie"
        if media_type=="movie"
        else
        "TV Series"

        })

    return output