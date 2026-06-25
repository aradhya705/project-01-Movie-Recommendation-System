import { useState } from "react";
import "./App.css";

function App() {

  const [movie, setMovie] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);

  const searchMovie = async () => {

    if (!movie.trim()) return;

    try {

      setLoading(true);
      setSearched(false);

      const response = await fetch(
        `http://localhost:8000/recommend/${movie}`
      );

      const data = await response.json();

      setResults(data || []);

    } catch (error) {

      console.log(error);

      setResults([]);

    } finally {

      setLoading(false);
      setSearched(true);

    }

  };

  return (

    <div className="container">

      {/* HERO SECTION */}

      <div className="hero">

        <p className="username">
          @aradhya_codes
        </p>

        <h1>
          ARAGE9
        </h1>

        <p className="subtitle">
          Discover your next favorite movie or series
        </p>

        <div className="searchContainer">

          <input
            value={movie}
            onChange={(e)=>setMovie(e.target.value)}
            placeholder="Search movies or series..."
            onKeyDown={(e)=>{
              if(e.key==="Enter"){
                searchMovie();
              }
            }}
          />

          <button onClick={searchMovie}>
            Search
          </button>

        </div>

      </div>


      {/* LOADING */}

      {loading && (

        <div className="emptyMessage">

          <h2>
            Loading Recommendations...
          </h2>

        </div>

      )}



      {/* RESULTS */}

      {!loading && results.length>0 && (

        <>

          {/* Selected Movie */}

          <h2 className="sectionTitle">

            Selected Content

          </h2>


          <div className="featuredSection">

            <div
              className="featuredCard"
              onClick={()=>setSelectedMovie(results[0])}
            >

              <img
                src={results[0].poster}
                alt={results[0].title}
              />

              <div className="movieInfo">

                <h3>

                  {results[0].title}

                </h3>

                <p>

                  ⭐ {results[0].rating || "N/A"}

                </p>

              </div>

            </div>

          </div>


          {/* Recommendations */}

          <h2 className="sectionTitle">

            Recommended For You

          </h2>


          <div className="movies">

            {results.slice(1).map((m,index)=>(

              <div
                className="movieCard"
                key={index}
                onClick={()=>setSelectedMovie(m)}
              >

                <img
                  src={m.poster}
                  alt={m.title}
                />

                <div className="movieInfo">

                  <h3>

                    {m.title}

                  </h3>

                  <p>

                    ⭐ {m.rating || "N/A"}

                  </p>

                </div>

              </div>

            ))}

          </div>

        </>

      )}



      {/* NO RESULTS */}

      {!loading &&
      searched &&
      results.length===0 && (

        <div className="emptyMessage">

          <h2>

            Oops! No Recommendation Found

          </h2>

          <p>

            Try another movie or series name

          </p>

        </div>

      )}



      {/* MOVIE DETAILS MODAL */}

      {selectedMovie && (

        <div
          className="modalOverlay"
          onClick={()=>setSelectedMovie(null)}
        >

          <div
            className="movieModal"
            onClick={(e)=>e.stopPropagation()}
          >

            <button
              className="backBtn"
              onClick={()=>setSelectedMovie(null)}
            >

              ← Back

            </button>


            <img
              src={selectedMovie.poster}
              alt={selectedMovie.title}
            />


            <h2>

              {selectedMovie.title}

            </h2>


            <p>

              ⭐ Rating:
              {" "}
              {selectedMovie.rating || "N/A"}

            </p>


            <p>

              🎬 Genre:
              {" "}
              {selectedMovie.genre || "Not Available"}

            </p>


            <p>

              📅 Release Year:
              {" "}
              {selectedMovie.year || "Unknown"}

            </p>


            <p>

              📺 Type:
              {" "}
              {selectedMovie.media_type || "Movie"}

            </p>


            <div className="descriptionBox">

              <h3>

                Description

              </h3>

              <div className="overview">

                {selectedMovie.overview ||
                "No description available"}

              </div>

            </div>

          </div>

        </div>

      )}

    </div>

  );

}

export default App;