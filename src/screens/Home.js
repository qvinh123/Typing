import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import classes from "./Home.module.css"

import { dataHome } from "../assets/dataHome"
import Dropdown from '../components/Dropdown'

export default function Home() {
    const [lockState, setLockState] = useState({ name: "1 Minute Test", value: 1 })
    const [textFileState, setTextFileState] = useState({ name: "Easy Text", value: "easy-text" })
    const [viewState, setViewState] = useState({ name: "All Content", value: "all-content" })

    const onClickLockHandler = (value) => {
        setLockState(value)
    }

    const onClickTextFileHandler = (value) => {
        setTextFileState(value)
    }

    const onClickViewHandler = (value) => {
        setViewState(value)
    }


    const renderListLock = () => {
        return dataHome.filter(locks => locks.label === "lock").map(locks => {
            return locks.results.map(lock => {
                return (
                    <a onClick={() => {
                        onClickLockHandler({name: lock.name, value: lock.value })
                        localStorage.setItem("lock", lock.value)
                    }}
                        key={lock.name}
                        className="dropdown-item"
                        href>
                        {lock.name}
                    </a>
                )
            })
        })
    }

    const renderListFileText = () => {
        return dataHome.filter(textFiles => textFiles.label === "textFiles").map(textFiles => {
            return textFiles.results.map(textFile => {
                return (
                    <a onClick={() => {
                        onClickTextFileHandler({ name: textFile.name, value: textFile.value })
                        localStorage.setItem("textFile", textFile.value)
                    }}
                        key={textFile.name}
                        className="dropdown-item"
                        href>
                        {textFile.name}
                    </a>
                )
            })
        })
    }

    const renderListView = () => {
        return dataHome.filter(filesText => filesText.label === "view").map(views => {
            return views.results.map(view => {
                return (
                    <a
                        onClick={() => {
                            onClickViewHandler({name: view.name, value: view.value })
                            localStorage.setItem("view", view.value)
                        }}
                        key={view.name}
                        className="dropdown-item"
                        href>
                        {view.name}
                    </a>
                )
            })
        })
    }

    useEffect(() => {
        localStorage.setItem("lock", lockState.value)
        localStorage.setItem("textFile", textFileState.value)
        localStorage.setItem("view", viewState.value)
    }, [])

    return (
        <div className="container">
            <div className="wrapper">
                <div className="row justify-content-center">
                    <div className="col-12">
                        <div className={classes.home__title}>
                            <h1>
                                Check your typing skills in a minute
                            </h1>
                        </div>
                    </div>

                    <div className="col-12">
                        <div className="row">

                            <div className="col-3 d-flex justify-content-center mt-4">
                                <img src="https://www.typingtest.com/theme/img/lady.svg" alt="img-left" />
                            </div>

                            <div className="col-6 d-flex flex-column align-items-center">
                                <div className={classes.home__select}>
                                    <p>SELECT YOUR TEST</p>

                                    <Dropdown icon="far fa-clock" valueCurrent={lockState.name}>
                                        {renderListLock()}
                                    </Dropdown>

                                    <Dropdown icon="fas fa-file-alt" valueCurrent={textFileState.name}>
                                        {renderListFileText()}
                                    </Dropdown>


                                    <Dropdown icon="fas fa-eye" valueCurrent={viewState.name}>
                                        {renderListView()}
                                    </Dropdown>

                                </div>

                                <Link to="/typing">
                                    <button className="btn btn-success mt-2">
                                        START TEST
                                    </button>
                                </Link>
                            </div>
                            <div className="col-3 d-flex justify-content-center mt-4">
                                <img src="https://www.typingtest.com/theme/img/gentleman.svg" alt="img-right" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
