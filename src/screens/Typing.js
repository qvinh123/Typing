import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react'

import classes from "./Typing.module.css"

import Modal from '../components/Modal'

import { dataTying } from "../assets/dataTyping"
import { useHistory } from 'react-router-dom'

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
    const totalIncorrectWords = () => textarea?.split(" ").filter((word, i) => word !== filterFlatData[0][0].quote.split(" ")[i]).length

    // total words current per minutes
    const wcpm = (words, minutes) => Math.round(words / minutes)

    // accuracy
    const accuracy = (wordsError, minutes) => {
        const lengthTexarea = textarea?.length
        const grossWPM = lengthTexarea / minutes
        const needSpeed = (lengthTexarea - wordsError) / minutes
        return Math.round((needSpeed / grossWPM || 0) * 100) + "%"
    }

    // onClick button start
    const onClickHandler = useCallback(() => {
        textBoxRef.current.disabled = false;
        textBoxRef.current.focus()
        setRunTimer(true)
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
            textBoxRef.current.disabled = true
        }
    }, [countDown, runTimer]);

    useEffect(() => {
        if (filterFlatData[0][0].quote.length === textarea?.length) {
            setRunTimer(false);
            setFlag(false)
        }
    }, [textarea, filterFlatData])

    const seconds = String(countDown % 60).padStart(2, 0)
    const minutes = String(Math.floor(countDown / 60)).padStart(2, 0)

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
                        <span className="font-weight-bold">{accuracy(totalIncorrectWords(), lock) || 0}</span>
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
                    textBoxRef.current.disabled = true
                }} className="btn btn-info"><i className="fas fa-undo"></i> Restart</button>
            </div>
        </Modal>
    }

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
                        <textarea value={textarea} disabled={true} ref={textBoxRef} placeholder="Typing..." onChange={onChangeHandler} className="form-control" rows="3"></textarea>
                    </div>
                </div>

                <div className={classes['typing__start-btn']}>
                    <button onClick={() => onClickHandler()} className="btn btn-success btn-lg">
                        Start
                    </button>
                </div>
            </div>
        </div>
    )
}
