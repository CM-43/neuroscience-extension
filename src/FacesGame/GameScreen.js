
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './FacesGame.css';

const GameScreen = ({ onComplete }) => {
  const navigate = useNavigate();
  const totalFaces = 14; // always 14 rounds
  const [currentFaceIndex, setCurrentFaceIndex] = useState(0);
  const [timer, setTimer] = useState(30);
  const [showContent, setShowContent] = useState(true);
  const [userResponses, setUserResponses] = useState([]);
  const [timerInterval, setTimerInterval] = useState(null);
  const [finalFaces, setFinalFaces] = useState(null); // Will store the randomly chosen 14 faces

  const emotions = [
    'Anger',
    'Determination',
    'Disgust',
    'Fear',
    'Happiness',
    'Hope',
    'Pain',
    'Sadness',
    'Surprise',
    'Puzzlement',
  ];

  const allFacesData = [
    // Faces with descriptions
    {
      faceNumber: 1,
      image: 'Face 1.png',
      text: (<> This is the story of a woman who is reading a text message from a friend.
        <br></br><br></br>
        The message brings up a difficult memory from the past, but it also mentions how proud
        her friend is of her moving forward.
        <br></br><br></br>
        What emotion is the woman feeling?
      </>),
      correctAnswer: 'Sadness',
      timeLimit: 30,
    },
    {
      faceNumber: 2,
      image: 'Face 2.png',
      text: (<> This is a story about a who is playing in a chess tournament.
        <br></br><br></br>
        He just made a move he is not completely confident about, and he is now waiting for his
        opponent to respond.<br></br><br></br>
        What emotion is the man feeling?
      </>),
      correctAnswer: 'Fear',
      timeLimit: 30,
    },
    {
      faceNumber: 3,
      image: 'Face 3.png',
      text: (<> This is a story about a young athlete who just heard the announcement that he made
        the team.<br></br><br></br>
        What emotion is the athlete feeling?</>),
      correctAnswer: 'Determination',
      timeLimit: 30,
    },
    {
      faceNumber: 4,
      image: 'Face 4.png',
      text: (<> This is a story of a woman who is at a family gathering.
        <br></br><br></br>
        A distant relative has just shared an old embarrassing story about her, causing everyone
        present to laugh.
        <br></br><br></br>
        What emotion is the woman feeling?
      </>),
      correctAnswer: 'Puzzlement',
      timeLimit: 30,
    },
    {
      faceNumber: 5,
      image: 'Face 5.png',
      text: (<> This is a story of a woman who is looking at a report about her financial situation.
        <br></br><br></br>
        She sees that she has made some progress towards her goals, but she also notices some
        areas that need improvement.
        <br></br><br></br>
        What emotion is the woman feeling?
      </>),
      correctAnswer: 'Hope',
      timeLimit: 30,
    },
    {
      faceNumber: 6,
      image: 'Face 6.png',
      text: (<>This is a story of a man who is sitting in a café, thinking about an argument he had with a
        friend earlier.<br></br><br></br>
        He is replaying the conversation in his head, when suddenly he sees a text from his
        friend who is continuing the argument.<br></br><br></br>
        What emotion is the man feeling?</>),
      correctAnswer: 'Anger',
      timeLimit: 30,
    },
    {
      faceNumber: 7,
      image: 'Face 7.png',
      text: (<> This is a story of a woman who is watching an intense play in the theater.<br></br><br></br>
        One of the actors just delivered a shocking line, and the entire audience is silent, waiting
        for the next moment. <br></br><br></br>
        What emotion is the woman feeling?
      </>),
      correctAnswer: 'Surprise',
      timeLimit: 30,
    },
    // Faces without descriptions
    {
      faceNumber: 8,
      image: 'Face 8.png',
      text: (<>  This is the story of a man who is walking through a forest trail at dusk.
        <br></br><br></br>
        The sounds of birds and rustling leaves surround him. He pauses, sensing something
        unusual, but he is not sure if it is just his imagination. <br></br><br></br>
        What emotion is the man feeling?

      </>),
      correctAnswer: 'Puzzlement',
      timeLimit: 30,
    },
    {
      faceNumber: 9,
      image: 'Face 9.png',
      text: (<>   This is the story of a man who is delivering an important speech.
        <br></br><br></br>
        He stumbles slightly over a word and notices a few people in the audience react. He
        continues speaking, his voice steady. <br></br><br></br>
        What emotion is the man feeling?

      </>),
      correctAnswer: 'Fear',
      timeLimit: 30,
    },
    {
      faceNumber: 10,
      image: 'Face 10.png',
      text: (<>   This is the story of a woman who is hiking up a steep mountain trail.

        <br></br><br></br>
        Her muscles are aching from the effort. As she nears the summit, she looks up and sees
        the peak in sight. <br></br><br></br>
        What emotion is the woman feeling?

      </>),
      correctAnswer: 'Hope',
      timeLimit: 30,
    },
    {
      faceNumber: 11,
      image: 'Face 11.png',
      text: (<>    This is the story of a man who is watching a thriller movie.


        <br></br><br></br>
        The main character opens a door, and eerie music begins to play. The man leans forward
        in his seat. <br></br><br></br>
        What emotion is the man feeling?


      </>),
      correctAnswer: 'Fear',
      timeLimit: 30,
    },
    {
      faceNumber: 12,
      image: 'Face 12.png',
      text: (<>   This is the story of a woman who is sitting in her car.


        <br></br><br></br>
        She is stuck in heavy traffic, and regularly glances at her watch. She taps the steering
        wheel and sighs. <br></br><br></br>
        What emotion is the woman feeling?

      </>),
      correctAnswer: 'Anger',
      timeLimit: 30,
    },
    {
      faceNumber: 13,
      image: 'Face 13.png',
      text: (<>    This is the story of a man who is assembling a piece of furniture.


        <br></br><br></br>
        The instruction manual is very confusing. The man stops and scratches his head, trying to
        figure out the next step. <br></br><br></br>
        What emotion is the man feeling?

      </>),
      correctAnswer: 'Anger',
      timeLimit: 30,
    },
    {
      faceNumber: 14,
      image: 'Face 14.png',
      text: (<>    This is the story of a woman who just received a text at night.


        <br></br><br></br>
        The text reads: “We need to talk.” She stares at the screen for a long time.
        <br></br><br></br>
        What emotion is the woman feeling?

      </>),
      correctAnswer: 'Fear',
      timeLimit: 30,
    },
    {
      faceNumber: 15,
      image: 'Face 15.png',
      text: (<>    This is the story of a woman who is cooking a complicated recipe for the first time.


        <br></br><br></br>
        She takes a bite of the final dish, and her face changes as she processes the taste.
        <br></br><br></br>
        What emotion is the woman feeling?

      </>),
      correctAnswer: 'Disgust',
      timeLimit: 30,
    },
    {
      faceNumber: 16,
      image: 'Face 16.png',
      text: (<>    This is the story of a woman who is running a marathon.


        <br></br><br></br>
        The finish line is just ahead, but every muscle in her body aches.
        <br></br><br></br>
        What emotion is the woman feeling?
      </>),
      correctAnswer: 'Pain',
      timeLimit: 30,
    },
    {
      faceNumber: 17,
      image: 'Face 17.png',
      text: (<>    This is the story of a woman who is in a plane.


        <br></br><br></br>
        She is looking out of the window as it takes off, leaving her hometown behind. She
        continues to stare outside as the city disappears from view.<br></br><br></br>
        What emotion is the woman feeling?

      </>),
      correctAnswer: 'Sadness',
      timeLimit: 30,
    },
    {
      faceNumber: 18,
      image: 'Face 18.png',
      text: (<>    This is the story of a man who is standing on his balcony at night.


        <br></br><br></br>
        Fireworks suddenly light up the night sky, and the man realizes it is now the new year.
        The display is beautiful, making him reflect on the difficult year he has just had. <br></br><br></br>
        What emotion is the man feeling?

      </>),
      correctAnswer: 'Sadness',
      timeLimit: 30,
    },
    {
      faceNumber: 19,
      image: 'Face 19.png',
      text: "What emotion is the man feeling?",
      correctAnswer: 'Pain',
      timeLimit: 7,
    },
    {
      faceNumber: 20,
      image: 'Face 20.png',
      text: "What emotion is the man feeling?",
      correctAnswer: 'Disgust',
      timeLimit: 7,
    },
    {
      faceNumber: 21,
      image: 'Face 21.png',
      text: "What emotion is the woman feeling?",
      correctAnswer: 'Sadness',
      timeLimit: 7,
    },
    {
      faceNumber: 22,
      image: 'Face 22.png',
      text: "What emotion is the woman feeling?",
      correctAnswer: 'Happiness',
      timeLimit: 7,
    },
    {
      faceNumber: 23,
      image: 'Face 23.png',
      text: "What emotion is the man feeling?",
      correctAnswer: 'Surprise',
      timeLimit: 7,
    },
    {
      faceNumber: 24,
      image: 'Face 24.png',
      text: "What emotion is the man feeling?",
      correctAnswer: 'Anger',
      timeLimit: 7,
    },
    {
      faceNumber: 25,
      image: 'Face 25.png',
      text: "What emotion is the woman feeling?",
      correctAnswer: 'Determination',
      timeLimit: 7,
    },
    {
      faceNumber: 26,
      image: 'Face 26.png',
      text: "What emotion is the woman feeling?",
      correctAnswer: 'Surprise',
      timeLimit: 7,
    },
    {
      faceNumber: 27,
      image: 'Face 27.png',
      text: "What emotion is the man feeling?",
      correctAnswer: 'Determination',
      timeLimit: 7,
    },
    {
      faceNumber: 28,
      image: 'Face 28.png',
      text: "What emotion is the man feeling?",
      correctAnswer: 'Pain',
      timeLimit: 7,
    },
    {
      faceNumber: 29,
      image: 'Face 29.png',
      text: "What emotion is the woman feeling?",
      correctAnswer: 'Puzzlement',
      timeLimit: 7,
    },
    {
      faceNumber: 30,
      image: 'Face 30.png',
      text: "What emotion is the woman feeling?",
      correctAnswer: 'Anger',
      timeLimit: 7,
    },
    {
      faceNumber: 31,
      image: 'Face 31.png',
      text: "What emotion is the man feeling?",
      correctAnswer: 'Disgust',
      timeLimit: 7,
    },
    {
      faceNumber: 32,
      image: 'Face 32.png',
      text: "What emotion is the woman feeling?",
      correctAnswer: 'Happiness',
      timeLimit: 7,
    },
    {
      faceNumber: 33,
      image: 'Face 33.png',
      text: "What emotion is the man feeling?",
      correctAnswer: 'Sadness',
      timeLimit: 7,
    },
    {
      faceNumber: 34,
      image: 'Face 34.png',
      text: "What emotion is the woman feeling?",
      correctAnswer: 'Determination',
      timeLimit: 7,
    },
    {
      faceNumber: 35,
      image: 'Face 35.png',
      text: "What emotion is the man feeling?",
      correctAnswer: 'Surprise',
      timeLimit: 7,
    },
    {
      faceNumber: 36,
      image: 'Face 36.png',
      text: "What emotion is the woman feeling?",
      correctAnswer: 'Hope',
      timeLimit: 7,
    },

  ];

  // On mount, select the 14 faces: 7 with text (timeLimit=30), 7 without text (timeLimit=7)
  useEffect(() => {
    const withText = allFacesData.filter(face => face.timeLimit === 30);
    const withoutText = allFacesData.filter(face => face.timeLimit === 7);

    const selectedWithText = pickRandom(withText, 7);
    const selectedWithoutText = pickRandom(withoutText, 7);

    const finalSelection = [...selectedWithText, ...selectedWithoutText];

    // Renumber faceNumber so it reflects the round order (1 to 14)
    finalSelection.forEach((face, i) => {
      face.faceNumber = i + 1;
    });

    setFinalFaces(finalSelection);
  }, []);

  useEffect(() => {
    if (finalFaces !== null) {
      startTimer();
    }
    return () => clearInterval(timerInterval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentFaceIndex, finalFaces]);

  const startTimer = () => {
    if (!finalFaces) return; // If finalFaces not ready, do nothing

    clearInterval(timerInterval);
    const face = finalFaces[currentFaceIndex];
    setTimer(face.timeLimit);
    setShowContent(true);

    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setShowContent(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    setTimerInterval(interval);
  };

  const handleEmotionSelect = (emotion) => {
    const face = finalFaces[currentFaceIndex];
    const isCorrect = emotion === face.correctAnswer;
    setUserResponses((prev) => [
      ...prev,
      { faceNumber: face.faceNumber, isCorrect, category: face.timeLimit === 30 ? 'withText' : 'withoutText' },
    ]);

    if (currentFaceIndex + 1 < totalFaces) {
      setCurrentFaceIndex(currentFaceIndex + 1);

      // disable all of the buttons after the user has selected an emotion for 0.5 seconds
      const buttons = document.querySelectorAll('.emotion-button');
      buttons.forEach((button) => {
        button.disabled = true;
      });
      setTimeout(() => {
        buttons.forEach((button) => {
          button.disabled = false;
        });
      }, 800);

    } else {
      // Last face
      // Save results and navigate to end transition
      const responses = [...userResponses, { faceNumber: face.faceNumber, isCorrect, category: face.timeLimit === 30 ? 'withText' : 'withoutText' }];
      localStorage.setItem('facesGame', JSON.stringify(responses));
      onComplete();
      navigate('../end-transition');
    }
  };

  if (!finalFaces) {
    return <div className="faces-game">Loading...</div>;
  }

  const face = finalFaces[currentFaceIndex];

  return (
    <div className="faces-game">
      <button className="menu-button" onClick={() => navigate('/')}>
        Menu
      </button>
      <div className="game-box">
        <div className="header-row">
          <div className="face-count">
            {face.faceNumber}/{totalFaces}
          </div>
          <div className="timer">
            <span className="timer-icon">⏱️</span> 0:{timer < 10 ? `0${timer}` : timer}
          </div>
        </div>
        {showContent && (
          <div className="content-row-container">
            <div className={face.timeLimit === 30 ? ("content-row") : ("content-column")}>
              <div className="face-image">
                <img src={`./images/G6_Faces/${face.image}`} alt={`Face ${face.faceNumber}`} height="150px" />
              </div>
              {face.timeLimit === 30 ? (
                <div className="face-text">{face.text}</div>
              ) : (
                <div className="face-text-below">
                  <div className="face-text">{face.text}</div>
                </div>
              )}
            </div>
          </div>
        )}
        <div className='buttons-container'>
          <div className="buttons-row">
            {emotions.map((emotion, index) => (
              <button
                key={index}
                className="emotion-button"
                onClick={() => handleEmotionSelect(emotion)}
              >
                {emotion}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Utility functions
function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

function pickRandom(array, count) {
  const shuffled = [...array];
  shuffleArray(shuffled);
  return shuffled.slice(0, count);
}

export default GameScreen;
