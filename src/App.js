import { useEffect, useState } from "react"
import StarRating from "./StarRating"

const average = (arr) =>
    arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0)

const KEY = "65306d5d"

export default function App() {
    const [movies, setMovies] = useState([])
    // const [watched, setWatched] = useState([])

    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")
    const [query, setQuery] = useState("")
    const tempQuery = "interstellar"

    const [watched, setWatched] = useState([])

    const [selectedID, setSelectedId] = useState(null)

    function handleAddWatched(movie) {
        setWatched((watched) => [...watched, movie])
    }

    function handleDeleteWatched(id) {
        setWatched((watched) => watched.filter((movie) => movie.imdbID !== id))
    }

    useEffect(
        function () {
            async function fetchMovies() {
                console.log("I am Fired for ", query)
                try {
                    setIsLoading(true)
                    setError("")
                    const res = await fetch(
                        `https://www.omdbapi.com/?apikey=${KEY}&s=${query}`
                    )

                    if (!res.ok) {
                        throw new Error(
                            "Something went wrong with fetching movies"
                        )
                    }

                    const data = await res.json()
                    setMovies(data.Search)
                    console.log(data.Search)
                    setIsLoading(false)
                } catch (err) {
                    console.error(err.message)
                } finally {
                    setIsLoading(false)
                }
            }

            if (!query.length) {
                setMovies([])
                setError("")
                return
            }

            fetchMovies()
        },
        [query]
    )

    function handleSelectedMovie(id) {
        setSelectedId((data) => (id === data ? null : id))
    }

    function handleCloseMovie() {
        setSelectedId(null)
    }

    useEffect(
        function () {
            localStorage.setItem("watched", JSON.stringify(watched))
        },
        [watched]
    )

    return (
        <>
            <NavBar>
                <Logo />
                <Search setQuery={setQuery} query={query} />
                <NumResults movies={movies}></NumResults>
            </NavBar>
            <Main>
                <Box>
                    {isLoading ? (
                        <Loader />
                    ) : (
                        <MovieList
                            movies={movies}
                            onSelectedMovie={handleSelectedMovie}
                        />
                    )}
                    {/* {isLoading && <Loader />}
                    {isLoading && !error && <MovieList movies={movies} />}
                    {error && <ErrorMessage message={error} />} */}
                </Box>
                <Box>
                    {selectedID ? (
                        <MovieDetails
                            selectedID={selectedID}
                            onCloseMovie={handleCloseMovie}
                            onAddWatched={handleAddWatched}
                            watched={watched}
                        />
                    ) : (
                        <div>
                            <WatchedSummary watched={watched} />
                            <WatchedMoviesList
                                watched={watched}
                                onDeleteWatched={handleDeleteWatched}
                            />
                        </div>
                    )}
                </Box>
            </Main>
        </>
    )
}

function MovieDetails({ selectedID, onCloseMovie, onAddWatched, watched }) {
    const [movie, setMovie] = useState({})
    const [isLoading, setIsLoading] = useState(false)
    const [userRating, setUserRating] = useState("")

    const isWatched = watched.map((movie) => movie.imdbID).includes(selectedID)
    console.log(isWatched)

    useEffect(function () {
        function callback(e) {
            if (e.code === "Escape") {
                onCloseMovie()
                console.log("Closing!")
            }
        }
        document.addEventListener("keydown", callback)
        return function () {
            document.removeEventListener("keydown", callback)
        }
    }, [])
    /* eslint-disable*/

    const {
        Title: title,
        Year: year,
        Poster: poster,
        Runtime: runtime,
        imdbRating,
        Plot: plot,
        Released: released,
        Actors: actors,
        Director: director,
        Genres: genres,
    } = movie
    console.log(title, year)
    console.log(year)
    function handleAdd() {
        const newWatchedMovie = {
            imdbID: selectedID,
            title,
            year,
            poster,
            imdbRating: Number(imdbRating),
            runtime: Number(runtime.split("").at(0)),
            userRating,
        }
        onAddWatched(newWatchedMovie)
        onCloseMovie()
    }

    useEffect(
        function () {
            async function getMovieDetails() {
                setIsLoading(true)
                const res = await fetch(
                    `https://www.omdbapi.com/?apikey=${KEY}&i=${selectedID}`
                )
                const data = await res.json()
                setMovie(data)
                console.log(data)
                setIsLoading(false)
            }
            getMovieDetails()
        },
        [selectedID]
    )

    useEffect(
        function () {
            console.log("Hey I was Clicked From Movie Details Page")

            document.title = `Movie | ${title}`

            return function () {
                document.title = "usePopcorn"
                console.log(`Clean up effect for movie ${title}`)
            }
        },
        [title]
    )

    return (
        <div className="details">
            {!isLoading ? (
                <>
                    <header>
                        <button className="btn-back" onClick={onCloseMovie}>
                            &larr;
                        </button>
                        <img src={poster} alt={`Poster of ${movie} movie`} />
                        <div className="details-overview">
                            <h2>{title}</h2>
                            <p>
                                {released} &bull; {runtime}
                            </p>
                            <p>{genres}</p>
                            <p>
                                <span>⭐</span>
                                {imdbRating} IMDb Rating
                            </p>
                        </div>
                    </header>
                    <section>
                        <div className="rating">
                            {
                                <>
                                    <StarRating
                                        maxRating={10}
                                        size={24}
                                        onSetRating={setUserRating}
                                    />
                                    {userRating > 0 && (
                                        <button
                                            className="btn-add"
                                            onClick={handleAdd}
                                        >
                                            Add to List
                                        </button>
                                    )}
                                </>
                            }
                        </div>
                        <p>
                            <em>{plot}</em>
                            <p>Starring {actors}</p>
                            <p>Directed by {director}</p>
                        </p>
                    </section>
                </>
            ) : (
                <Loader />
            )}
            {/* {selectedID} */}
        </div>
    )
}

function Loader() {
    return <div className="loader">Loading.....</div>
}

function ErrorMessage({ message }) {
    return <p className="error">{message}</p>
}

function Box({ children }) {
    const [isOpen, setIsOpen] = useState(true)
    return (
        <div className="box">
            <button
                className="btn-toggle"
                onClick={() => setIsOpen((open) => !open)}
            >
                {isOpen ? "–" : "+"}
            </button>
            {isOpen && children}
        </div>
    )
}

function NavBar({ children }) {
    return <nav className="nav-bar">{children} </nav>
}

function NumResults({ movies }) {
    return (
        <p className="num-results">
            Found <strong>{movies ? movies.length : 0} </strong> results
        </p>
    )
}

function Logo() {
    return (
        <div className="logo">
            <span role="img">🍿</span>
            <h1>usePopcorn</h1>
        </div>
    )
}

function Search({ query, setQuery }) {
    return (
        <input
            className="search"
            type="text"
            placeholder="Search movies..."
            value={query}
            onChange={(e) => {
                setQuery(e.target.value)
            }}
        />
    )
}

function MovieList({ movies, onSelectedMovie }) {
    return (
        <ul className="list list-movies">
            {movies?.map((movie) => (
                <Movie movie={movie} onSelectedMovie={onSelectedMovie} />
            ))}
        </ul>
    )
}

function Movie({ movie, onSelectedMovie }) {
    return (
        <li key={movie.imdbID} onClick={() => onSelectedMovie(movie.imdbID)}>
            <img src={movie.Poster} alt={`${movie.Title} poster`} />
            <h3>{movie.Title}</h3>
            <div>
                <p>
                    <span>🗓</span>
                    <span>{movie.Year}</span>
                </p>
            </div>
        </li>
    )
}

function Main({ children }) {
    return <main className="main">{children}</main>
}

function WatchedSummary({ watched }) {
    const avgImdbRating = average(watched.map((movie) => movie.imdbRating))
    const avgUserRating = average(watched.map((movie) => movie.userRating))
    const avgRuntime = average(watched.map((movie) => movie.runtime))
    return (
        <div className="summary">
            <h2>Movies you watched</h2>
            <div>
                <p>
                    <span>#️⃣</span>
                    <span>{watched.length} movies</span>
                </p>
                <p>
                    <span>⭐️</span>
                    <span>{avgImdbRating}</span>
                </p>
                <p>
                    <span>🌟</span>
                    <span>{avgUserRating}</span>
                </p>
                <p>
                    <span>⏳</span>
                    <span>{avgRuntime} min</span>
                </p>
            </div>
        </div>
    )
}

function WatchedMoviesList({ watched, onDeleteWatched }) {
    return (
        <ul className="list">
            {watched.map((movie) => (
                <WatchedMovie
                    movie={movie}
                    key={movie.imdbID}
                    onDeleteWatched={onDeleteWatched}
                />
            ))}
        </ul>
    )
}

function WatchedMovie({ movie, onDeleteWatched }) {
    return (
        <li key={movie.imdbID}>
            <img src={movie.poster} alt={`${movie.title} poster`} />
            <h3>{movie.title}</h3>
            <div>
                <p>
                    <span>⭐️</span>
                    <span>{movie.imdbRating}</span>
                </p>
                <p>
                    <span>🌟</span>
                    <span>{movie.userRating}</span>
                </p>
                <p>
                    <span>⏳</span>
                    <span>{movie.runtime} min</span>
                </p>
                <button
                    className="btn-delete"
                    onClick={() => onDeleteWatched(movie.imdbID)}
                >
                    X
                </button>
            </div>
        </li>
    )
}
