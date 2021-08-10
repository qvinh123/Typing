import React from 'react'

import classes from "./Dropdown.module.css"

export default function Dropdown(props) {
    return (
        <div className="d-flex align-items-center mb-3">
            <div className={classes.home__icon}>
                <i className={props.icon}></i>
            </div>
            <div className={`dropdown ${classes.home__dropdown} ml-3`}>
                <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    {props.valueCurrent}
                </button>
                <div className={`dropdown-menu ${classes['home__dropdown-menu']}`} aria-labelledby="dropdownMenuButton">
                    {props.children}
                </div>
            </div>
        </div>
    )
}
