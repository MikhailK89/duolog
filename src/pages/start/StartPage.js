import React, { useEffect, useState, useRef } from "react";
import TestPage from "../test/TestPage";
import Header from './Header';
import Select from './Select';
import Switch from "../../components/Switch/Switch";

import tests from './tests';
import { downloadFile } from "../../utils/downloadFile";
import "./StartPage.css";

const StartPage = () => {
  const [select, setSelect] = useState(null);
  const [testOn, setTestOn] = useState(false);
  const [buttonOff, setButtonOff] = useState(true);
  const [userTest, setUserTest] = useState("");
  const [withMicro, setWithMicro] = useState(false)

  const recorder = useRef(null)
  const voice = useRef([])

  useEffect(() => {
    if (withMicro && !recorder.current) {
      navigator.mediaDevices.getUserMedia({audio: true})
        .then(stream => {
          recorder.current = new MediaRecorder(stream)
          recorder.current.addEventListener('dataavailable', (e) => {
            voice.current.push(e.data)
          })
          recorder.current.addEventListener('stop', () => {
            const voiceBlob = new Blob(voice.current, {
              type: 'audio/mp3'
            })
            downloadFile(voiceBlob)
          })
        })
    }
  }, [withMicro])

  const startRecorder = () => {
    if (withMicro && recorder.current) {
      recorder.current.start()
    }
  }

  const stopRecorder = () => {
    if (withMicro && recorder.current) {
      recorder.current.stop()
    }
  }

  const displayTest = () => {
    setTestOn(true);
  };

  const handleSelect = (id) => {
    setSelect(id);
  };

  const handleTextarea = (event) => {
    setUserTest(event.target.value);
  };

  const buttonTitle = () => {
    if (select === null) return "Выбирете тест";
    return buttonOff ? "Напишите хотя бы 3 вопроса для своего теста" : null;
  };

  const handleSwitch = () => {
    withMicro ? setWithMicro(false) : setWithMicro(true)
  }

  useEffect(() => {
    if (select !== null) {
      setButtonOff(false);
    }
    tests.UserTest = userTest.split("\n");

    if (select === "UserTest" && tests.UserTest.length < 3) {
      setButtonOff(true);
    }
  }, [select, userTest]);
  return (
    <>
      {!testOn && (
        <div>
          <Header />
          <form>
            <Select
              select={select}
              userTest={userTest}
              handleSelect={handleSelect}
              handleTextarea={handleTextarea}
            />
            <Switch
              handleSwitch={handleSwitch}
            />
            <p>
              <button
                type="submit"
                title={buttonTitle()}
                disabled={buttonOff}
                onClick={() => displayTest()}
              >
                Начать интервью
              </button>
            </p>
          </form>
        </div>
      )}
      {testOn && (
        <TestPage
          initQuestions={tests[select]}
          startRecorder={startRecorder}
          stopRecorder={stopRecorder} />
      )}
    </>
  );
};

export default StartPage;
