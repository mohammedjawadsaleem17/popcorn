import React, { useState } from "react"
import ReactDOM from "react-dom/client"
import StarRating from "./StarRating"
// import PropType from "prop-types"
import "./index.css"
import App from "./App"
import AppDup from "./AppDup"
import Test from "./Test"

function Test1() {
    const [movieRating, setMovieRating] = useState(0)
    return (
        <div>
            <StarRating
                color="blue"
                maxRating={10}
                setMovieRating={setMovieRating}
            />
            <p>This Movie was Rated {movieRating} Stars</p>
        </div>
    )
}

const root = ReactDOM.createRoot(document.getElementById("root"))
root.render(
    <React.StrictMode>
        {/* <App /> */}
        {/* <AppDup /> */}
        <Test />
    </React.StrictMode>
)
