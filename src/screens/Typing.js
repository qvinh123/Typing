import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react'

import classes from "./Typing.module.css"

import Modal from '../components/Modal'

import { dataTying } from "../assets/dataTyping"
import { Link, useHistory } from 'react-router-dom'

export default function Typing() {
    const history = useHistory()

    const lock = localStorage.getItem("lock")
    const textFile = localStorage.getItem("textFile")
    const view = localStorage.getItem("view")

    const [textarea, setTextarea] = useState("")
    const [countDown, setCountDown] = useState(60 * lock);
    const [runTimer, setRunTimer] = useState(false);

    const [flag, setFlag] = useState(true)
    const [restart, setRestart] = useState(false)

    const textBoxRef = useRef();
    const myRefs = useRef([]);

    // onChange textarea
    const onChangeHandler = useCallback((e) => {
        setRunTimer(true)
        setTextarea(e.target.value)
    }, [])

    // filter data dropdown
    const filterFlatData = useMemo(() => dataTying.filter(data => data.value === textFile).map(data => {
        const random = Math.floor(Math.random() * data.results.length);
        return data.results.filter(item => item.id === random)
    }), [restart])

    // render chars
    let currentNumberChart = 0
    const renderChars = filterFlatData[0][0]?.quote.split("").map((char, i) => {
        let colorChar = ""
        if (i < textarea?.length) {
            colorChar = char === textarea[i] ? "text-success" : `text-danger ${classes.underline}`
            if (myRefs.current[i + 1]) {
                if (myRefs.current[i + 1].getBoundingClientRect().top !== myRefs.current[i].getBoundingClientRect().top) {
                    currentNumberChart -= 68
                }
            }
        }
        return <span ref={(el) => (myRefs.current[i] = el)} key={i} className={colorChar}>{char}</span>
    })

    // total length words correct
    const totalCorrectWords = () => textarea?.split(" ").filter((word, i) => word === filterFlatData[0][0].quote.split(" ")[i]).length

    // total length words incorrect
    const totalIncorrectWords = () => {
        if (textarea) {
            return textarea.split(" ").filter((word, i) => word !== filterFlatData[0][0].quote.split(" ")[i]).length
        }
        return 0
    }

    // total words current per minutes
    const wcpm = (words, minutes) => Math.round(words / minutes)

    // accuracy
    const accuracy = (wordsError, minutes) => {
        const lengthTexarea = textarea.split(" ").length
        const grossWPM = lengthTexarea / minutes
        const needSpeed = (lengthTexarea - wordsError) / minutes

        return Math.round((needSpeed / grossWPM || 0) * 100) + "%"
    }

    useEffect(() => {
        textBoxRef.current.focus()
    }, [])

    useEffect(() => {
        let timerId;
        if (runTimer) {
            timerId = setInterval(() => {
                setCountDown((countDown) => countDown - 1);
            }, 1000);
        } else {
            clearInterval(timerId);
        }
        return () => clearInterval(timerId);
    }, [runTimer]);

    useEffect(() => {
        if (countDown < 0 && runTimer) {
            setRunTimer(false);
            setCountDown(0);
            setFlag(false)
        }
    }, [countDown, runTimer]);

    useEffect(() => {
        if (filterFlatData[0][0].quote.length === textarea?.length) {
            setRunTimer(false);
            setFlag(false)
        }
    }, [textarea, filterFlatData])

    // show modal result
    let modalShow
    if (!flag) {
        modalShow = <Modal>
            <h3 className={`bg-info ${classes.modal__title}`}>Result</h3>
            <div className={classes.modal__result}>
                <ul>
                    <li>
                        <strong className="text-success">{wcpm(totalCorrectWords(), lock) || 0} WCPM</strong>
                        <small>(words correct per minute)</small>
                    </li>
                    <li>
                        <span>Accuracy: </span>
                        <span className="font-weight-bold">{accuracy(totalIncorrectWords(), lock)}</span>
                    </li>
                </ul>
            </div>
            <div className={classes.modal__button}>
                <button onClick={() => history.push("/")} className="btn btn-success"><i className="fas fa-home"></i> Home</button>
                <button onClick={() => {
                    setFlag(true)
                    setRestart(true)
                    setTextarea("")
                    setCountDown(60 * lock)
                }} className="btn btn-info"><i className="fas fa-undo"></i> Restart</button>
            </div>
        </Modal>
    }

    const seconds = String(countDown % 60).padStart(2, 0)
    const minutes = String(Math.floor(countDown / 60)).padStart(2, 0)

    return (
        <div className="container">
            <div className="wrapper">
                {modalShow}
                <div className={classes.typing__contents}>
                    <button className={`btn btn-info ${classes.coundownTime}`}>{minutes}:{seconds}</button>
                    <div className={`${classes['typing__contents--top']} ${view === "all-content" ? classes.showAll : classes.showNewLine}`}>
                        <div style={{ marginTop: `${view !== "all-content" ? currentNumberChart + "px" : null}` }}>
                            {renderChars}
                        </div>
                    </div>

                    <div className={classes['typing__contents--bottom']}>
                        <textarea value={textarea} ref={textBoxRef} placeholder="Typing..." onChange={onChangeHandler} className="form-control" rows="3"></textarea>
                    </div>
                </div>

                <div className={classes['typing__start-btn']}>
                    <Link to="/" className="btn btn-success btn-lg">
                        Cannel
                    </Link>
                </div>
            </div>
        </div>
    )
}
