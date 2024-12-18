import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './TowerGame.css';

const GameScreen = ({ onComplete }) => {
    const navigate = useNavigate();
    const [timer, setTimer] = useState(120); // 2 minutes in seconds
    const [isGameOver, setIsGameOver] = useState(false);

    const goalTower = ['blue', 'green', 'red', 'orange', 'yellow'];
    // Randomize the goal tower
    const [goalTowerKey] = useState(() => {
        const towers = ['A', 'B', 'C'];
        return towers[Math.floor(Math.random() * 3)];
    });

    // Randomize the starting position of the 5 disks
    const [towers, setTowers] = useState(() => {
        return generateRandomTowers();
    });
    // Generate initial random towers setup
    const initialTowersConfig = generateRandomTowers();
    const [initialTowers] = useState(initialTowersConfig);

    const [selectedDisk, setSelectedDisk] = useState(null);
    const [moveHistory, setMoveHistory] = useState([]);
    const [planningTime, setPlanningTime] = useState(null);
    const [totalMoves, setTotalMoves] = useState(0);
    const [gameStartTime, setGameStartTime] = useState(null);


    useEffect(() => {
        setGameStartTime(Date.now());

        // Check if completed
        if (arraysEqual(towers[goalTowerKey], goalTower)) {
            handleCompletion(true);
        }

        if (timer > 0 && !isGameOver) {
            const interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
            return () => clearInterval(interval);
        } else if (timer === 0 && !isGameOver) {
            // Time's up
            handleCompletion(false);
        }

    }, [timer, isGameOver, navigate, goalTowerKey, towers]);

    const handleCompletion = (completed) => {
        setIsGameOver(true);
        const totalTime = 120 - timer;
        localStorage.setItem(
            'towerGame',
            JSON.stringify({
                planningTime,
                totalTime,
                totalMoves: totalMoves + (completed ? 1 : 0), // Include current move if completed on that move
            })
        );
        onComplete && onComplete();
        setTimeout(() => {
            navigate('../end-transition', { state: { completed } });
        }, 2000);
    };

    const handleDiskClick = (towerKey) => {
        if (isGameOver) return;

        const towerDisks = towers[towerKey];
        if (towerDisks.length === 0) return;

        // Start the game timer on the first move
        if (totalMoves === 0 && planningTime === null) {
            setPlanningTime(120 - timer);
        }

        // Select the top disk
        if (!selectedDisk) {
            setSelectedDisk({ disk: towerDisks[towerDisks.length - 1], from: towerKey });
            setMoveHistory((prev) => [
                ...prev,
                { disk: towerDisks[towerDisks.length - 1], from: towerKey, to: towerKey },
            ]);
        }

    };

    const handleTowerClick = (towerKey) => {
        if (isGameOver || !selectedDisk) return;

        // Move the disk
        setTowers((prevTowers) => {
            const newTowers = { ...prevTowers };
            // Remove disk from original tower
            newTowers[selectedDisk.from] = newTowers[selectedDisk.from].slice(0, -1);
            // Add disk to new tower
            newTowers[towerKey] = [...newTowers[towerKey], selectedDisk.disk];
            return newTowers;
        });

        setMoveHistory((prev) => [...prev, { disk: selectedDisk.disk, from: selectedDisk.from, to: towerKey }]);
        setSelectedDisk(null);
        setTotalMoves((prev) => prev + 1);
    };

    useEffect(() => {
        // After every move, check completion
        if (arraysEqual(towers[goalTowerKey], goalTower) && !isGameOver) {
            handleCompletion(true);
        }
    }, [towers, goalTowerKey, goalTower, isGameOver]);

    const handleUndo = () => {
        if (moveHistory.length === 0 || isGameOver) return;
        const lastMove = moveHistory.pop(); // Remove the last move from history
        setMoveHistory(moveHistory); // Update the state
        setTowers((prevTowers) => {
            const newTowers = { ...prevTowers };
            // Remove disk from current tower
            newTowers[lastMove.to] = newTowers[lastMove.to].slice(0, -1);
            // Add disk back to original tower
            newTowers[lastMove.from] = [...newTowers[lastMove.from], lastMove.disk];
            return newTowers;
        });

        // Update selectedDisk based on the undone move
        if (lastMove.from === lastMove.to) {
            // If the undone move was a lift, deselect the disk
            setSelectedDisk(null);
        } else {
            // If the undone move was a tower change, re-select the disk in its lifted position
            setSelectedDisk({ disk: lastMove.disk, from: lastMove.from });
        }
    };

    const handleRestart = () => {
        // Return disks to the starting position of this round
        setTowers(JSON.parse(JSON.stringify(initialTowers)));
        setSelectedDisk(null);
        setPlanningTime(null);
        setGameStartTime(null);
        // Reset other states if necessary
        // setTimer(120);
        // setIsGameOver(false);
        // setTotalMoves(0);
        // setMoveHistory([]);
    };

    const arraysEqual = (a1, a2) => {
        return JSON.stringify(a1) === JSON.stringify(a2);
    };

    const renderTower = (towerKey) => {
        const disks = towers[towerKey];
        return (
            <div
                className="tower"
                onClick={() => handleTowerClick(towerKey)}
            >
                <div className="tower-base"></div>
                {disks.map((disk, index) => (
                    <div
                        key={index}
                        className={`disk ${disk}`}
                        onClick={() => handleDiskClick(towerKey)}
                        style={{
                            top:
                                selectedDisk && selectedDisk.from === towerKey && index === disks.length - 1
                                    ? "-50px" // Lift the selected disk
                                    : `${-27 * (index - 4.5)}px`,
                            transition: "top 0.2s ease",
                        }}
                    ></div>
                ))}
                {/* Placeholder for empty tower */}
                {<div className="disk-placeholder"></div>}
            </div>
        );
    };

    const renderMiniTower = (towerKey) => {
        // This function now shows the final goal arrangement, not the current state
        // If towerKey is goalTowerKey, show goalTower. Otherwise, show empty.
        let finalDisks = towerKey === goalTowerKey ? goalTower : [];
        return (
            <div className="miniTower">
                <div className="miniTower-base"></div>
                {finalDisks.map((disk, index) => (
                    <div
                        key={index}
                        className={`miniDisk ${disk}`}
                        style={{
                            top: `${-9.5 * (index - 1.2)}px`,
                        }}
                    ></div>
                ))}
                <div className="miniDisk-placeholder"></div>
            </div>
        );
    };

    return (
        <div className="tower-game">
            <button className="menu-button" onClick={() => navigate('/')}>
                Menu
            </button>
            <div className="game-box">
                <div className="game-header">
                    <div className="timer">
                        <span role="img" aria-label="timer">⏱️</span>{' '}
                        {Math.floor(timer / 60)}:{('0' + (timer % 60)).slice(-2)}
                    </div>
                    <div className="goal-towers">
                        <div style={{ textAlign: 'center', fontWeight: 'bold', }}>
                            <div className="towers-container">
                                {['A', 'B', 'C'].map((towerKey) => renderMiniTower(towerKey))}
                            </div>
                            Target Towers

                        </div>
                    </div>
                </div>

                <div className='game-text'>

                </div>
                <div className="player-towers">
                    <div className="towers-container">
                        {['A', 'B', 'C'].map((towerKey) => renderTower(towerKey))}
                    </div>
                </div>
                <div className="game-buttons">
                    <button className="dark-blue-button" onClick={handleRestart}>
                        Restart
                    </button>
                    <button className="light-blue-button" onClick={handleUndo}>
                        Undo
                    </button>
                </div>
            </div>
        </div>
    );
};

function generateRandomTowers() {
    const disks = ['blue', 'green', 'red', 'orange', 'yellow'];
    let towers;
    do {
        towers = { A: [], B: [], C: [] };
        for (let disk of disks) {
            const towerKeys = ['A', 'B', 'C'];
            const chosenTower = towerKeys[Math.floor(Math.random() * 3)];
            towers[chosenTower].push(disk);
        }
        // Ensure not all on the same tower
    } while (allOnSameTower(towers));

    return towers;
}

function allOnSameTower(towers) {
    const aCount = towers.A.length;
    const bCount = towers.B.length;
    const cCount = towers.C.length;
    // If all disks ended on one tower, returns true
    return (aCount === 5 || bCount === 5 || cCount === 5);
}

export default GameScreen;
