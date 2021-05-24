import React, { useEffect, useState } from 'react';
import { BOTTOM, DIMENSIONS_LARGE, DIMENSIONS_MEDIUM, DIMENSIONS_SMALL, DIMENSIONS_X_SMALL, LEFT, LEVELS, RIGHT, TOP } from '../../constants';
import Block from '../../models/Block';
import Maze from '../../models/Maze';
import { generateBoard, getNextBlockCoords, isMoveAllowed, getShortestPath } from '../../util/util';
import SingleBlock from '../SingleBlock/SingleBlock';
import styles from './MainBoard.module.scss';

const MainBoard: React.FC = () => {

  const [theme, setTheme] = useState<string>('Dark');
  const [maze, setMaze] = useState<Maze>({ board: [] });
  const [active, setActive] = useState<number[]>([0, 0]);
  const [path, setPath] = useState<Block[]>([]);
  const [shortestPath, setShortestPath] = useState<Block[]>([]);

  const [timer, setTimer] = useState<number>(0);
  const [level, setLevel] = useState<number>(0);
  const [success, setSuccess] = useState<boolean>(false);

  const activeRef = React.useRef(active);
  const setActiveRef = (data: number[]) => {
    activeRef.current = data;
    setActive(data);
  };

  const timerRef = React.useRef(0);
  const setTimerRef = (data: any) => {
    timerRef.current = data;
  };

  const pathRef = React.useRef(path);
  const setPathRef = (data: Block[]) => {
    pathRef.current = data;
    setPath(data);
  };

  const successRef = React.useRef(success);
  const setSuccessRef = (data: boolean) => {
    successRef.current = data;
    setSuccess(data);
  };


  const generateMaze = () => {
    let genMaze: Maze = { board: [] };
    genMaze.board = generateBoard(LEVELS[level], LEVELS[level]);
    setMaze(genMaze);
    setPathRef([genMaze.board[0][0]]);
    resetAll();
  }

  const resetAll = () => {
    setSuccessRef(false);
    setActiveRef([0, 0]);
    setShortestPath([]);
    setTimer(0);
  }

  if (maze.board.length === 0) {
    generateMaze();
  }


  const nextLevel = () => {
    setLevel(currentLevel => currentLevel + 1);
    generateMaze();
  }
  const tryAgain = () => {
    resetAll();
    setPathRef([maze.board[0][0]]);
  }

  const getSize = () => {
    if (LEVELS[level] < 15) return DIMENSIONS_LARGE;
    if (LEVELS[level] < 21) return DIMENSIONS_MEDIUM;
    if (LEVELS[level] < 30) return DIMENSIONS_SMALL;
    return DIMENSIONS_X_SMALL;
  }



  const renderMaze = () => {
    const size = getSize();
    return maze.board.map((row: Block[], index: number) => {
      return (<div key={index}>{
        row.map((block: Block) => {
          let isActive = path.find((b) => b === block) ? true : false;
          return <SingleBlock active={isActive} size={size} key={block.id} block={block} />
        })
      }</div>)

    })
  }

  const handleKeyPress = (e: any) => {
    if (successRef.current) {
      return;
    }
    if (e.keyCode > 36 && e.keyCode < 41) {
      e.preventDefault()
    } else {
      return;
    }
    let next = [activeRef.current[0], activeRef.current[1]];
    let direction: number = 0;

    if (e.keyCode === 37) {
      direction = LEFT;
    }
    if (e.keyCode === 38) {
      direction = TOP;
    }
    if (e.keyCode === 39) {
      direction = RIGHT;
    }
    if (e.keyCode === 40) {
      direction = BOTTOM;
    }
    next = getNextBlockCoords(next, direction);
    isMoveAllowed(maze.board, activeRef.current, next, direction) && makeMove(next);
  }

  const makeMove = (next: number[]) => {
    const activeBlock = maze.board[next[1]][next[0]];
    setPathRef([activeBlock, ...pathRef.current]);
    setActiveRef(next);
    if (activeBlock.exit > -1) {
      setSuccessRef(true);
    }
  }


  useEffect(() => {
    document.body.classList.add(`Body${theme}`);
    return () => {
      document.body.classList.remove(`Body${theme}`);
    }
  }, [theme]);


  useEffect(() => {
    document.addEventListener("keydown", handleKeyPress);
    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    }
  },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [maze]);

  useEffect(() => {
    setTimerRef(setInterval(() => {
      if (!success) {
        setTimer(currentTimer => currentTimer + 1);
      }
    }, 1000));
    return () => {
      clearInterval(timerRef.current);
    }
  }, [success]);

  useEffect(() => {
    (async () => {
      if (success) {
        const shortestPath = await getShortestPath(maze.board, [], maze.board[0][0]) || [];
        setShortestPath(shortestPath);
      }
      return () => {
      }
    })();

  }, [success, maze.board]);


  const getTimer = () => new Date(timer * 1000).toISOString().substr(14, 5);

  const getResult = () => path.length < shortestPath.length + 4;

  const getThemeClass = () => `MainBoard${theme}`;

  const switchTheme = () => setTheme(currentTheme => currentTheme === 'Light' ? 'Dark' : 'Light');

  return (
    <>
      <div className={`${styles.MainBoard} ${styles[getThemeClass()]}`}>
        <div className={styles.MazeWrapper}>
          <div className={styles.Timer}>
            LEVEL {level + 1}/{LEVELS.length} - {getTimer()} / {path.length - 1} {path.length === 2 ? 'Step' : 'Steps'}
          </div>

          <div className={styles.MazeContainer}>
            {renderMaze()}
            <div className={styles.Tracker} style={{
              bottom: active[1] * (getSize()),
              left: active[0] * (getSize()),
              width: getSize(),
              height: getSize()
            }}></div>
          </div>
          <span onClick={switchTheme} className={styles.DefaultButton}>Switch to {theme === 'Dark' ? 'Light' : 'Dark'} Mode</span>
        </div>
        <div className={styles.ControlsContainer}>
          {success && shortestPath &&
            <>
              <h3 className={styles.Solved}>{getResult() ? 'Awesome!' : 'Good job'}</h3>
              <h4>Solved in {timer} Seconds \ {path.length} Steps</h4>
              Shortest Path is {shortestPath.length + 1} Steps
              {
                level < LEVELS.length - 1 &&
                <>{getResult() &&
                  <div className={styles['next-wrapper']}>
                    <button onClick={nextLevel} className={styles['next-button']}>Next Level!</button>
                  </div>
                }
                  <div className={styles['next-wrapper']}>
                    <button onClick={tryAgain} className={styles['next-button']}>{getResult() ? 'Play' : 'Try'} Again</button>
                  </div>
                </>
              }
              {
                level >= LEVELS.length - 1 &&
                <h3 className={styles.Solved}>You rock!</h3>
              }

            </>
          }
          {
            !success &&
            <div style={{ margin: '20px', maxWidth: '300px' }} className={styles.Description}>
              <p>
                Keep moving to reach the escape square,
                you'll pass to the next level when you find a path not longer than the ideal path by more than 3 steps.
                Goodluck!
            </p>
              <span onClick={tryAgain} style={{ textDecoration: 'underline', cursor: 'pointer' }}>Reset</span>
            </div>
          }

        </div>
      </div>
    </>
  )
};

export default MainBoard;
