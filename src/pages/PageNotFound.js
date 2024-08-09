import React from "react";
import {Link} from "react-router-dom";

function PageNotFound() {
    return (
        <div>
            <h1>Page Not Found :/</h1>
            <center><h3>
                Go to <Link to="/">Home Page</Link>
            </h3></center>
        </div>
    )
}

export default PageNotFound;