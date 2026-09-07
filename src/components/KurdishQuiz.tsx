import { useCallback, useEffect, useMemo, useState, type CSSProperties } from 'react'
import {
  ArrowLeft,
  Award,
  Bookmark,
  BookmarkCheck,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Coins,
  Delete,
  Flame,
  Heart,
  Home,
  LibraryBig,
  LockKeyhole,
  Play,
  RotateCcw,
  Sparkles,
  Trash2,
  Trophy,
  UserRound,
  X,
  Zap,
} from 'lucide-react'
import { getCategory, questions, type CategoryId, type QuizQuestion } from '@/data/questions'
import {
  buildEmojiRound,
  buildLetterRound,
  buildMathRound,
  buildNumberRound,
  buildWordRound,
  kurdishAlphabet,
  letterExamples,
  mainAreas,
  mathOperations,
  numberWords,
  wordCategories,
  type LearningTask,
  type MainAreaId,
  type MathOperation,
} from '@/data/learning'
import {
  achievements,
  createPlayer,
  getLevel,
  getNextLevelXp,
  loadPlayer,
  savePlayer,
  unlockAchievements,
  type Achievement,
  type PlayerData,
} from '@/lib/player'

type View = 'welcome' | 'home' | 'area' | 'quiz' | 'result' | 'profile' | 'achievements' | 'saved-words'
type SavedWordsFilter = 'all' | 'open' | 'learned'
type RoundSelection = { area: MainAreaId; id: string; title: string }
type Result = { score: number; correct: number; wrong: number; coins: number; xp: number; newHighscore: boolean; title: string; completed: boolean }
type RoundStats = { score: number; correct: number; wrong: number; earnedCoins: number; earnedXp: number; bestCombo: number; fastestMark: number }

const emptyStats: RoundStats = { score: 0, correct: 0, wrong: 0, earnedCoins: 0, earnedXp: 0, bestCombo: 0, fastestMark: 0 }

function getTasks(selection: RoundSelection, level: number) {
  if (selection.area === 'peyiv') return buildWordRound(selection.id as CategoryId)
  if (selection.area === 'tip') return buildLetterRound(selection.id as (typeof kurdishAlphabet)[number])
  if (selection.area === 'hejmar') return buildNumberRound(Number(selection.id))
  if (selection.area === 'matematik') return buildMathRound(selection.id as MathOperation, level)
  return buildEmojiRound()
}

export default function KurdishQuiz() {
  const [player, setPlayer] = useState<PlayerData | null>(null)
  const [view, setView] = useState<View>('welcome')
  const [activeArea, setActiveArea] = useState<MainAreaId>('peyiv')
  const [selection, setSelection] = useState<RoundSelection | null>(null)
  const [round, setRound] = useState<LearningTask[]>([])
  const [questionIndex, setQuestionIndex] = useState(0)
  const [seconds, setSeconds] = useState(20)
  const [lives, setLives] = useState(3)
  const [combo, setCombo] = useState(0)
  const [stats, setStats] = useState<RoundStats>(emptyStats)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [answerWasCorrect, setAnswerWasCorrect] = useState<boolean | null>(null)
  const [hiddenAnswers, setHiddenAnswers] = useState<string[]>([])
  const [selectedLetterIndices, setSelectedLetterIndices] = useState<number[]>([])
  const [wrongLetter, setWrongLetter] = useState<{ index: number; attempt: number } | null>(null)
  const [result, setResult] = useState<Result | null>(null)
  const [toast, setToast] = useState('')
  const [achievementPopup, setAchievementPopup] = useState<Achievement[]>([])
  const [showReset, setShowReset] = useState(false)

  useEffect(() => {
    const loaded = loadPlayer()
    savePlayer(loaded)
    setPlayer(loaded)
  }, [])

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }, [view])

  const updatePlayer = useCallback((updater: (current: PlayerData) => PlayerData) => {
    setPlayer((current) => {
      if (!current) return current
      const updated = updater(current)
      savePlayer(updated)
      return updated
    })
  }, [])

  useEffect(() => {
    if (!toast) return
    const timer = window.setTimeout(() => setToast(''), 2200)
    return () => window.clearTimeout(timer)
  }, [toast])

  useEffect(() => {
    if (!wrongLetter) return
    const timer = window.setTimeout(() => setWrongLetter(null), 420)
    return () => window.clearTimeout(timer)
  }, [wrongLetter])

  const finishGame = useCallback((finalLives: number, finalStats: RoundStats) => {
    if (!player || !selection) return
    const completed = questionIndex >= 9 && finalLives > 0
    const completionBonus = completed ? 5 : 0
    const perfectBonus = finalStats.correct === 10 && finalStats.wrong === 0 ? 10 : 0
    const totalCoins = finalStats.earnedCoins + completionBonus + perfectBonus
    const newHighscore = finalStats.score > player.bestScore
    const summary = { score: finalStats.score, correct: finalStats.correct, wrong: finalStats.wrong, bestCombo: finalStats.bestCombo, maxTimeAnswer: finalStats.fastestMark }
    const basePlayer: PlayerData = {
      ...player,
      coins: player.coins + totalCoins,
      xp: player.xp + finalStats.earnedXp,
      bestScore: Math.max(player.bestScore, finalStats.score),
      gamesPlayed: player.gamesPlayed + 1,
      correctAnswers: player.correctAnswers + finalStats.correct,
      wrongAnswers: player.wrongAnswers + finalStats.wrong,
      bestCombo: Math.max(player.bestCombo, finalStats.bestCombo),
    }
    const checked = unlockAchievements(basePlayer, summary)
    savePlayer(checked.player)
    setPlayer(checked.player)
    setAchievementPopup(checked.newlyUnlocked)
    setResult({ score: finalStats.score, correct: finalStats.correct, wrong: finalStats.wrong, coins: totalCoins, xp: finalStats.earnedXp, newHighscore, title: selection.title, completed })
    setView('result')
  }, [player, questionIndex, selection])

  const answerQuestion = useCallback((answer: string | null, retryOnWrong = false) => {
    const question = round[questionIndex]
    if (!question || answerWasCorrect !== null) return
    const isCorrect = answer === question.answer
    setSelectedAnswer(answer)
    setAnswerWasCorrect(isCorrect)

    let nextLives = lives
    let nextStats = { ...stats }
    if (isCorrect) {
      const nextCombo = combo + 1
      const pointGain = 10 + Math.min(nextCombo * 2, 20) + Math.floor(seconds / 4)
      const coinGain = 2 + Math.floor(nextCombo / 2) + (seconds >= 14 ? 1 : 0)
      const xpGain = 15 + Math.min(nextCombo, 10)
      setCombo(nextCombo)
      nextStats = {
        ...nextStats,
        score: nextStats.score + pointGain,
        correct: nextStats.correct + 1,
        earnedCoins: nextStats.earnedCoins + coinGain,
        earnedXp: nextStats.earnedXp + xpGain,
        bestCombo: Math.max(nextStats.bestCombo, nextCombo),
        fastestMark: Math.max(nextStats.fastestMark, seconds),
      }
    } else {
      nextLives -= 1
      setLives(nextLives)
      setCombo(0)
      nextStats = { ...nextStats, wrong: nextStats.wrong + 1 }
    }
    setStats(nextStats)

    window.setTimeout(() => {
      if (nextLives <= 0) {
        finishGame(nextLives, nextStats)
        return
      }
      if (!isCorrect && retryOnWrong) {
        setSelectedAnswer(null)
        setAnswerWasCorrect(null)
        setSelectedLetterIndices([])
        return
      }
      if (questionIndex >= 9) {
        finishGame(nextLives, nextStats)
        return
      }
      setQuestionIndex((value) => value + 1)
      setSeconds(30)
      setSelectedAnswer(null)
      setAnswerWasCorrect(null)
      setHiddenAnswers([])
      setSelectedLetterIndices([])
      setWrongLetter(null)
    }, isCorrect ? 850 : 1050)
  }, [answerWasCorrect, combo, finishGame, lives, questionIndex, round, seconds, stats])

  useEffect(() => {
    if (view !== 'quiz' || answerWasCorrect !== null) return
    if (seconds <= 0) {
      answerQuestion(null)
      return
    }
    const timer = window.setTimeout(() => setSeconds((value) => value - 1), 1000)
    return () => window.clearTimeout(timer)
  }, [answerQuestion, answerWasCorrect, seconds, view])

  const startGame = (nextSelection: RoundSelection) => {
    if (!player) return
    const tasks = getTasks(nextSelection, getLevel(player.xp))
    if (tasks.length === 0) {
      setToast('Di vê beşê de hîn pirs tune.')
      return
    }
    if (nextSelection.area === 'peyiv' && !player.unlockedCategories.includes(nextSelection.id as CategoryId)) {
      const expanded = { ...player, unlockedCategories: [...player.unlockedCategories, nextSelection.id as CategoryId] }
      const checked = unlockAchievements(expanded)
      savePlayer(checked.player)
      setPlayer(checked.player)
      setAchievementPopup(checked.newlyUnlocked)
    }
    setSelection(nextSelection)
    setRound(tasks)
    setQuestionIndex(0)
    setSeconds(30)
    setLives(3)
    setCombo(0)
    setStats(emptyStats)
    setSelectedAnswer(null)
    setAnswerWasCorrect(null)
    setHiddenAnswers([])
    setSelectedLetterIndices([])
    setWrongLetter(null)
    setResult(null)
    setView('quiz')
  }

  const restartGame = () => {
    if (selection) startGame(selection)
  }

  const openArea = (area: MainAreaId) => {
    if (area === 'emoji') {
      startGame({ area: 'emoji', id: 'emoji', title: 'Emojî' })
      return
    }
    setActiveArea(area)
    setView('area')
  }

  const useFiftyFifty = () => {
    if (!player || answerWasCorrect !== null || hiddenAnswers.length > 0) return
    if (player.coins < 10) return setToast('Zêrê te têr nake.')
    const question = round[questionIndex]
    if (question.kind !== 'choice') return
    setHiddenAnswers(question.options.filter((option) => option !== question.answer).slice(0, 2))
    updatePlayer((current) => ({ ...current, coins: current.coins - 10 }))
  }

  const addTime = () => {
    if (!player || answerWasCorrect !== null) return
    if (player.coins < 10) return setToast('Zêrê te têr nake.')
    setSeconds((value) => value + 5)
    updatePlayer((current) => ({ ...current, coins: current.coins - 10 }))
  }

  const selectLetter = (index: number) => {
    const question = round[questionIndex]
    if (!question || question.kind !== 'spelling' || answerWasCorrect !== null) return
    if (question.area !== 'emoji') {
      setSelectedLetterIndices((current) => [...current, index])
      return
    }

    const expectedLetter = question.answer[selectedLetterIndices.length]
    if (question.options[index] !== expectedLetter) {
      setWrongLetter((current) => ({ index, attempt: (current?.attempt ?? 0) + 1 }))
      return
    }

    const nextIndices = [...selectedLetterIndices, index]
    setWrongLetter(null)
    setSelectedLetterIndices(nextIndices)
    if (nextIndices.length === question.answer.length) answerQuestion(question.answer)
  }

  const skipQuestion = () => {
    if (answerWasCorrect !== null) return
    if (questionIndex >= 9) {
      finishGame(lives, stats)
      return
    }
    setQuestionIndex((value) => value + 1)
    setSeconds(30)
    setSelectedAnswer(null)
    setHiddenAnswers([])
    setSelectedLetterIndices([])
    setWrongLetter(null)
  }

  const toggleSavedWord = (questionId: string) => {
    const isSaved = Boolean(player?.savedWords[questionId])
    updatePlayer((current) => {
      const savedWords = { ...current.savedWords }
      if (savedWords[questionId]) delete savedWords[questionId]
      else savedWords[questionId] = { learned: false }
      return { ...current, savedWords }
    })
    setToast(isSaved ? 'Peyv ji lîsteyê hat rakirin.' : 'Peyv hat tomarkirin.')
  }

  const toggleLearnedWord = (questionId: string) => {
    updatePlayer((current) => ({
      ...current,
      savedWords: { ...current.savedWords, [questionId]: { learned: !current.savedWords[questionId]?.learned } },
    }))
  }

  const resetPlayer = () => {
    const freshPlayer = createPlayer()
    savePlayer(freshPlayer)
    setPlayer(freshPlayer)
    setShowReset(false)
    setView('home')
    setToast('Profîla nû amade ye.')
  }

  if (!player) return <LoadingScreen />

  const currentQuestion = round[questionIndex]
  const spelledWord = currentQuestion?.kind === 'spelling'
    ? selectedLetterIndices.map((index) => currentQuestion.options[index]).join('')
    : ''

  return (
    <main className="app-shell">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />
      {view === 'welcome' && <WelcomeView onStart={() => setView('home')} />}
      {view === 'home' && <HomeView player={player} onOpenArea={openArea} onNavigate={setView} />}
      {view === 'area' && <AreaView area={activeArea} onBack={() => setView('home')} onStart={startGame} />}
      {view === 'quiz' && currentQuestion && (
        <QuizView
          player={player}
          question={currentQuestion}
          questionIndex={questionIndex}
          seconds={seconds}
          lives={lives}
          combo={combo}
          score={stats.score}
          selectedAnswer={selectedAnswer}
          answerWasCorrect={answerWasCorrect}
          hiddenAnswers={hiddenAnswers}
          selectedLetterIndices={selectedLetterIndices}
          wrongLetter={wrongLetter}
          spelledWord={spelledWord}
          isSaved={Boolean(currentQuestion.sourceQuestion && player.savedWords[currentQuestion.sourceQuestion.id])}
          onAnswer={(answer) => answerQuestion(answer)}
          onLetter={selectLetter}
          onDeleteLetter={() => setSelectedLetterIndices((current) => current.slice(0, -1))}
          onCheckWord={() => answerQuestion(spelledWord, true)}
          onSkip={skipQuestion}
          onFifty={useFiftyFifty}
          onTime={addTime}
          onToggleSaved={() => currentQuestion.sourceQuestion && toggleSavedWord(currentQuestion.sourceQuestion.id)}
          onExit={() => setView('home')}
        />
      )}
      {view === 'result' && result && <ResultView result={result} onAgain={restartGame} onHome={() => setView('home')} />}
      {view === 'saved-words' && <SavedWordsView player={player} onBack={() => setView('home')} onRemove={toggleSavedWord} onToggleLearned={toggleLearnedWord} />}
      {view === 'profile' && <ProfileView player={player} onBack={() => setView('home')} onReset={() => setShowReset(true)} />}
      {view === 'achievements' && <AchievementsView player={player} onBack={() => setView('home')} />}

      {toast && <div className="toast">{toast}</div>}
      {achievementPopup.length > 0 && (
        <div className="modal-backdrop">
          <div className="achievement-modal">
            <div className="achievement-burst">{achievementPopup[0].icon}</div>
            <p className="overline">Serkeftina nû</p>
            <h2>{achievementPopup[0].title}</h2>
            <p>{achievementPopup[0].description}</p>
            <button className="primary-button" onClick={() => setAchievementPopup([])}>Baş e!</button>
          </div>
        </div>
      )}
      {showReset && (
        <div className="modal-backdrop">
          <div className="achievement-modal">
            <div className="achievement-burst danger"><RotateCcw /></div>
            <p className="overline">Ji nû ve dest pê bike</p>
            <h2>Hemû pêşketin were rakirin?</h2>
            <p>XP, zêr, peyvên tomarkirî û serkeftinên te dê bên rakirin.</p>
            <div className="modal-actions"><button className="secondary-button" onClick={() => setShowReset(false)}>Na, vegere</button><button className="reset-confirm" onClick={resetPlayer}>Erê, rake</button></div>
          </div>
        </div>
      )}
    </main>
  )
}

function LoadingScreen() {
  return <main className="loading-screen"><div className="loading-mark">KL</div><div className="loading-line" /><p>Lîstik tê amadekirin…</p></main>
}

function WelcomeView({ onStart }: { onStart: () => void }) {
  return (
    <section className="welcome-page">
      <div className="welcome-orbit orbit-one">A</div>
      <div className="welcome-orbit orbit-two">7</div>
      <div className="welcome-orbit orbit-three">🐾</div>
      <div className="welcome-card">
        <div className="welcome-hand">👋</div>
        <p className="overline">Fêr bibe · Bilîze · Bişewite</p>
        <h1>Bi xêr hatî <span>KurdLingo!</span></h1>
        <p>Tu amade yî ku bi lîstikê kurdî fêr bibî?</p>
        <button className="welcome-button" onClick={onStart}>Dest pê bike <Play size={19} fill="currentColor" /></button>
        <div className="welcome-chips"><span>🧩 Peyv</span><span>🔤 Tîp</span><span>🔢 Hejmar</span></div>
      </div>
    </section>
  )
}

function HomeView({ player, onOpenArea, onNavigate }: { player: PlayerData; onOpenArea: (area: MainAreaId) => void; onNavigate: (view: View) => void }) {
  const level = getLevel(player.xp)
  const nextXp = getNextLevelXp(player.xp)
  return (
    <div className="page home-page">
      <header className="topbar">
        <div className="brand-lockup"><span className="brand-mark">KL</span><div><p>Kurmancî bi lîstikê</p><h1>KurdLingo</h1></div></div>
        <button className="profile-pill" onClick={() => onNavigate('profile')}><UserRound size={19} /><span>Asta {level}</span></button>
      </header>

      <section className="hero-card">
        <div className="hero-copy"><p className="overline">Rêwîtiya te</p><h2>Her roj çend peyv,<br />her gav kurdîtir.</h2><p>Beşek hilbijêre û gera xwe ya deh pirsan dest pê bike.</p></div>
        <div className="level-orbit"><small>Asta</small><strong>{level}</strong><span>{player.xp} / {nextXp} XP</span><div><i style={{ width: `${player.xp % 100}%` }} /></div></div>
      </section>

      <section className="quick-stats">
        <div><Flame size={20} /><span>Rojên lîstikê</span><strong>{player.gamesPlayed}</strong></div>
        <div><Coins size={20} /><span>Zêr</span><strong>{player.coins}</strong></div>
        <div><Trophy size={20} /><span>Xala herî bilind</span><strong>{player.bestScore}</strong></div>
        <button onClick={() => onNavigate('achievements')}><Award size={20} /><span>Serkeftin</span><strong>{player.achievements.length}/{achievements.length}</strong></button>
      </section>

      <div className="section-heading"><div><p className="overline">Cîhana fêrbûnê</p><h2>Tu îro dixwazî çi fêr bibî?</h2></div><button onClick={() => onNavigate('saved-words')}><LibraryBig size={18} /> Peyvên min</button></div>
      <section className="main-area-grid">
        {mainAreas.map((area, index) => (
          <button className={`main-area-card ${area.color}`} key={area.id} onClick={() => onOpenArea(area.id)} style={{ '--delay': `${index * 70}ms` } as CSSProperties}>
            <span className="area-number">0{index + 1}</span><span className="area-emoji">{area.emoji}</span><span><strong>{area.name}</strong><small>{area.description}</small></span><ChevronRight size={22} />
          </button>
        ))}
      </section>
      <MobileNav view="home" onNavigate={onNavigate} />
    </div>
  )
}

function AreaView({ area, onBack, onStart }: { area: MainAreaId; onBack: () => void; onStart: (selection: RoundSelection) => void }) {
  const areaInfo = mainAreas.find((item) => item.id === area)!
  return (
    <div className="page inner-page area-page">
      <PageHeader title={areaInfo.name} subtitle={areaInfo.description} onBack={onBack} />
      <section className={`area-banner ${areaInfo.color}`}><span>{areaInfo.emoji}</span><div><p className="overline">Beşek hilbijêre</p><h2>{areaInfo.name}</h2><p>Her ger ji deh pirsên cuda pêk tê.</p></div></section>

      {area === 'peyiv' && <div className="subcategory-grid word-subcategories">{wordCategories.map((category, index) => <button key={category.id} onClick={() => onStart({ area, id: category.id, title: category.name })} style={{ '--delay': `${index * 40}ms` } as CSSProperties}><span>{category.emoji}</span><strong>{category.name}</strong><small>{questions.filter((question) => question.category === category.id).length} peyv</small><ChevronRight size={18} /></button>)}</div>}
      {area === 'tip' && <div className="letter-grid">{kurdishAlphabet.map((letter, index) => <button key={letter} onClick={() => onStart({ area, id: letter, title: `Tîpa ${letter}` })} style={{ '--delay': `${index * 22}ms` } as CSSProperties}><strong>{letter}</strong><small>{letterExamples[letter].slice(0, 2).join(' · ')}</small></button>)}</div>}
      {area === 'hejmar' && <div className="number-grid">{numberWords.map((word, number) => <button key={number} onClick={() => onStart({ area, id: String(number), title: `Hejmar ${number}` })}><strong>{number}</strong><span>{word}</span></button>)}</div>}
      {area === 'matematik' && <div className="subcategory-grid math-subcategories">{mathOperations.map((operation, index) => <button key={operation.id} onClick={() => onStart({ area, id: operation.id, title: operation.name })} style={{ '--delay': `${index * 60}ms` } as CSSProperties}><span>{operation.emoji}</span><strong>{operation.name}</strong><small>{operation.description}</small><ChevronRight size={18} /></button>)}</div>}
    </div>
  )
}

function QuizView({ player, question, questionIndex, seconds, lives, combo, score, selectedAnswer, answerWasCorrect, hiddenAnswers, selectedLetterIndices, wrongLetter, spelledWord, isSaved, onAnswer, onLetter, onDeleteLetter, onCheckWord, onSkip, onFifty, onTime, onToggleSaved, onExit }: { player: PlayerData; question: LearningTask; questionIndex: number; seconds: number; lives: number; combo: number; score: number; selectedAnswer: string | null; answerWasCorrect: boolean | null; hiddenAnswers: string[]; selectedLetterIndices: number[]; wrongLetter: { index: number; attempt: number } | null; spelledWord: string; isSaved: boolean; onAnswer: (answer: string) => void; onLetter: (index: number) => void; onDeleteLetter: () => void; onCheckWord: () => void; onSkip: () => void; onFifty: () => void; onTime: () => void; onToggleSaved: () => void; onExit: () => void }) {
  const progress = ((questionIndex + 1) / 10) * 100
  return (
    <div className="quiz-page">
      <div className="quiz-hud">
        <header className="quiz-header"><button className="icon-button" onClick={onExit} aria-label="Vegere malê"><X /></button><div className="quiz-progress" role="progressbar" aria-label="Pêşketina pirsan" aria-valuemin={0} aria-valuemax={10} aria-valuenow={questionIndex + 1}><span style={{ width: `${progress}%` }} /></div><div className="quiz-lives" aria-label={`${lives} jiyan mane`}>{Array.from({ length: 3 }, (_, index) => <Heart key={index} size={19} fill={index < lives ? 'currentColor' : 'none'} className={index < lives ? '' : 'lost'} />)}</div></header>
        <div className="quiz-meta"><span className="quiz-question-count">Pirsa {questionIndex + 1} / 10</span><strong className={`quiz-time ${seconds <= 5 ? 'urgent' : ''}`} aria-label={`${seconds} çirke mane`}><Clock3 size={18} /><span>Dem</span><b>{seconds}</b><small>çirke</small></strong><span className="quiz-combo"><Flame size={17} /> {combo} rêz</span><span className="quiz-score">{score} xal</span></div>
      </div>
      <section className={`question-card ${answerWasCorrect === true ? 'correct-flash' : answerWasCorrect === false ? 'wrong-flash' : ''}`}>
        <div className="question-kicker"><span>{question.title}</span>{question.sourceQuestion && <button className={isSaved ? 'saved' : ''} onClick={onToggleSaved} aria-label={isSaved ? 'Peyvê rake' : 'Peyvê tomar bike'}>{isSaved ? <BookmarkCheck /> : <Bookmark />}</button>}</div>
        <p className="question-prompt">{question.prompt}</p>
        {question.area === 'peyiv' && question.sourceQuestion
          ? <QuestionArtwork question={question.sourceQuestion} className="task-artwork" />
          : <div className={`task-display ${question.emoji ? 'emoji-display' : ''}`}>{question.display}</div>}

        {question.kind === 'choice' ? (
          <div className="answer-grid">{question.options.map((option, index) => {
            const hidden = hiddenAnswers.includes(option)
            const state = answerWasCorrect !== null && option === question.answer ? 'correct' : selectedAnswer === option && answerWasCorrect === false ? 'wrong' : ''
            return <button key={`${option}-${index}`} disabled={hidden || answerWasCorrect !== null} className={`answer-button ${state} ${hidden ? 'hidden' : ''}`} onClick={() => onAnswer(option)}><span>{String.fromCharCode(65 + index)}</span>{option}{state === 'correct' && <Check size={19} />}{state === 'wrong' && <X size={19} />}</button>
          })}</div>
        ) : (
          <div className="spelling-game">
            <div className={`spelling-answer ${answerWasCorrect === false ? 'shake' : ''}`}>{question.answer.split('').map((_, index) => <span className={question.area === 'emoji' && index === spelledWord.length && answerWasCorrect === null ? 'next-letter' : ''} key={index}>{spelledWord[index] ?? ''}</span>)}</div>
            <div className="letter-bank">{question.options.map((letter, index) => <button key={`${letter}-${index}-${wrongLetter?.index === index ? wrongLetter.attempt : 0}`} className={wrongLetter?.index === index ? 'wrong-letter' : ''} disabled={selectedLetterIndices.includes(index) || answerWasCorrect !== null} onClick={() => onLetter(index)}>{letter}</button>)}</div>
            {question.area === 'emoji'
              ? <div className="spelling-actions single-action"><button className="secondary-button skip-button" onClick={onSkip} disabled={answerWasCorrect !== null}>Derbas bike <ChevronRight size={18} /></button></div>
              : <div className="spelling-actions"><button className="secondary-button" onClick={onDeleteLetter} disabled={selectedLetterIndices.length === 0 || answerWasCorrect !== null}><Delete size={18} /> Paşde</button><button className="primary-button" onClick={onCheckWord} disabled={spelledWord.length !== question.answer.length || answerWasCorrect !== null}>Kontrol bike <Check size={18} /></button></div>}
          </div>
        )}

        <div className="feedback-line" aria-live="polite">{answerWasCorrect === true && <span className="good"><CheckCircle2 /> Pir baş! Bersiva te rast e.</span>}{answerWasCorrect === false && <span className="bad"><X /> Hîn carekê biceribîne.</span>}</div>
      </section>
      <div className="joker-bar"><button onClick={onFifty} disabled={question.kind !== 'choice' || hiddenAnswers.length > 0 || answerWasCorrect !== null}><Sparkles size={18} /> Nîv-nîv <small>10 zêr</small></button><button onClick={onTime} disabled={answerWasCorrect !== null}><Clock3 size={18} /> +5 çirke <small>10 zêr</small></button><span className="quiz-coins"><Coins size={18} /> {player.coins}</span></div>
    </div>
  )
}

function ResultView({ result, onAgain, onHome }: { result: Result; onAgain: () => void; onHome: () => void }) {
  const perfect = result.correct === 10 && result.wrong === 0
  return (
    <div className="result-page">
      {result.completed && <Confetti heavy={perfect} />}
      <section className="result-card">
        <div className="result-trophy">{perfect ? '🏆' : result.completed ? '🎉' : '🌱'}</div>
        <p className="overline">{result.title}</p><h1>{perfect ? 'Serkeftina bê şaşî!' : result.completed ? 'Serkeftî!' : 'Careke din biceribîne!'}</h1>
        <p>{perfect ? 'Te hemû pirs bi rastî bersivandin.' : result.completed ? 'Te ger bi serkeftin qedand.' : 'Her ceribandin gavek e ber bi fêrbûnê.'}</p>
        <div className="score-circle"><span>Xal</span><strong>{result.score}</strong>{result.newHighscore && <small>Rekorê nû!</small>}</div>
        <div className="result-grid"><div><Check /><span>Rast</span><strong>{result.correct}</strong></div><div><X /><span>Çewt</span><strong>{result.wrong}</strong></div><div><Zap /><span>XP</span><strong>+{result.xp}</strong></div><div><Coins /><span>Zêr</span><strong>+{result.coins}</strong></div></div>
        <div className="result-actions"><button className="secondary-button" onClick={onHome}><Home size={18} /> Vegere malê</button><button className="primary-button" onClick={onAgain}><RotateCcw size={18} /> Dîsa bilîze</button></div>
      </section>
    </div>
  )
}

function Confetti({ heavy }: { heavy: boolean }) {
  const pieces = useMemo(() => Array.from({ length: heavy ? 140 : 76 }, (_, index) => ({
    id: index,
    left: `${(index * 37) % 100}%`,
    delay: `${(index % 18) * 0.07}s`,
    duration: `${2.4 + (index % 9) * 0.12}s`,
    color: ['#e76f51', '#f4bd4f', '#2a9d8f', '#5271c4', '#8d5fb7'][index % 5],
    rotate: `${(index * 47) % 360}deg`,
    drift: `${((index * 29) % 220) - 110}px`,
  })), [heavy])
  return <div className={`confetti ${heavy ? 'heavy' : ''}`} aria-hidden="true">{pieces.map((piece) => <i key={piece.id} style={{ left: piece.left, animationDelay: piece.delay, animationDuration: piece.duration, background: piece.color, '--spin': piece.rotate, '--drift': piece.drift } as CSSProperties} />)}</div>
}

function PageHeader({ title, subtitle, onBack }: { title: string; subtitle: string; onBack: () => void }) {
  return <header className="page-header"><button className="icon-button" onClick={onBack} aria-label="Vegere"><ArrowLeft /></button><div><p>{subtitle}</p><h1>{title}</h1></div></header>
}

function QuestionArtwork({ question, className }: { question: QuizQuestion; className: string }) {
  const [failed, setFailed] = useState(false)
  return <div className={className}>{question.image && !failed ? <img src={question.image} alt="" onError={() => setFailed(true)} /> : <span>{question.emoji}</span>}</div>
}

function SavedWordsView({ player, onBack, onRemove, onToggleLearned }: { player: PlayerData; onBack: () => void; onRemove: (questionId: string) => void; onToggleLearned: (questionId: string) => void }) {
  const [filter, setFilter] = useState<SavedWordsFilter>('all')
  const savedQuestions = questions.filter((question) => player.savedWords[question.id])
  const learnedCount = savedQuestions.filter((question) => player.savedWords[question.id]?.learned).length
  const openCount = savedQuestions.length - learnedCount
  const learnedProgress = savedQuestions.length === 0 ? 0 : (learnedCount / savedQuestions.length) * 100
  const filteredQuestions = savedQuestions.filter((question) => filter === 'all' || (filter === 'learned' ? player.savedWords[question.id]?.learned : !player.savedWords[question.id]?.learned))
  return (
    <div className="page inner-page saved-words-page">
      <PageHeader title="Peyvên min" subtitle="Koleksiyona te" onBack={onBack} />
      <section className="words-progress-card"><div className="words-progress-copy"><div><p className="overline">Pêşketina fêrbûnê</p><h2>{savedQuestions.length} tomarkirî · {learnedCount} hîn bû · {openCount} li bendê</h2></div><span>{Math.round(learnedProgress)}%</span></div><div className="words-progress-track" aria-label={`${Math.round(learnedProgress)} ji sed hîn bû`}><span style={{ width: `${learnedProgress}%` }} /></div></section>
      <div className="word-filters" aria-label="Peyvan parzûn bike">{([['all', 'Hemû'], ['open', 'Li bendê'], ['learned', 'Hîn bû']] as const).map(([value, label]) => <button key={value} className={filter === value ? 'active' : ''} onClick={() => setFilter(value)}>{label}</button>)}</div>
      {filteredQuestions.length > 0 ? <section className="saved-word-grid">{filteredQuestions.map((question, index) => { const category = getCategory(question.category); const learned = player.savedWords[question.id]?.learned ?? false; return <article className={`saved-word-card ${learned ? 'learned' : ''}`} key={question.id} style={{ '--delay': `${index * 45}ms` } as CSSProperties}><QuestionArtwork question={question} className="saved-word-art" /><div className="saved-word-content"><div className="saved-word-category"><span>{category.emoji}</span>{category.name}</div><h2>{question.word}</h2><p>Peyva tomarkirî</p></div><div className="saved-word-actions"><button className={`learned-button ${learned ? 'active' : ''}`} onClick={() => onToggleLearned(question.id)} aria-pressed={learned}><CheckCircle2 size={18} />{learned ? 'Hîn bû' : 'Wekî hîn bû nîşan bike'}</button><button className="remove-word-button" onClick={() => onRemove(question.id)} aria-label={`${question.word} rake`}><Trash2 size={19} /></button></div></article> })}</section> : <section className="saved-words-empty"><div><LibraryBig size={34} /></div><h2>{savedQuestions.length === 0 ? 'Hêj peyv nehatine tomarkirin' : 'Di vê parzûnê de peyv tune'}</h2><p>{savedQuestions.length === 0 ? 'Di lîstika peyvan de nîşana pirtûkê bitikîne da ku peyvan li vir kom bikî.' : 'Parzûnek din hilbijêre da ku peyvên xwe bibînî.'}</p>{savedQuestions.length === 0 && <button className="primary-button" onClick={onBack}><Home size={18} /> Vegere malê</button>}</section>}
    </div>
  )
}

function ProfileView({ player, onBack, onReset }: { player: PlayerData; onBack: () => void; onReset: () => void }) {
  const level = getLevel(player.xp)
  const nextXp = getNextLevelXp(player.xp)
  return <div className="page inner-page"><PageHeader title="Profîl" subtitle="Pêşketina te" onBack={onBack} /><section className="profile-identity"><div className="profile-avatar"><UserRound size={38} /></div><div><p>Nasker</p><h2>{player.id}</h2><span>Asta {level}</span></div></section><section className="xp-card"><div><span>XP</span><strong>{player.xp} / {nextXp}</strong></div><div className="xp-track"><span style={{ width: `${player.xp % 100}%` }} /></div></section><section className="profile-grid"><div><Coins /><span>Zêr</span><strong>{player.coins}</strong></div><div><Trophy /><span>Xala herî bilind</span><strong>{player.bestScore}</strong></div><div><Zap /><span>Lîstik</span><strong>{player.gamesPlayed}</strong></div><div><Check /><span>Bersiva rast</span><strong>{player.correctAnswers}</strong></div><div><X /><span>Bersiva çewt</span><strong>{player.wrongAnswers}</strong></div><div><Flame /><span>Rêza herî baş</span><strong>{player.bestCombo}</strong></div><div className="wide"><Award /><span>Serkeftin</span><strong>{player.achievements.length} / {achievements.length}</strong></div></section><button className="reset-button" onClick={onReset}><RotateCcw size={18} /> Profîlê ji nû ve dest pê bike</button></div>
}

function AchievementsView({ player, onBack }: { player: PlayerData; onBack: () => void }) {
  return <div className="page inner-page"><PageHeader title="Serkeftin" subtitle={`${player.achievements.length} ji ${achievements.length} vekirî`} onBack={onBack} /><div className="achievement-list">{achievements.map((achievement) => { const unlocked = player.achievements.includes(achievement.id); return <article key={achievement.id} className={unlocked ? 'unlocked' : ''}><span className="achievement-icon">{unlocked ? achievement.icon : <LockKeyhole size={25} />}</span><div><h2>{achievement.title}</h2><p>{achievement.description}</p></div><span className="reward"><Coins size={15} />{achievement.reward}</span></article> })}</div></div>
}

function MobileNav({ view, onNavigate }: { view: View; onNavigate: (view: View) => void }) {
  return <nav className="mobile-nav" aria-label="Navîgasyon"><button className={view === 'home' ? 'active' : ''} onClick={() => onNavigate('home')}><Home size={20} /><span>Mal</span></button><button onClick={() => onNavigate('saved-words')}><LibraryBig size={20} /><span>Peyv</span></button><button onClick={() => onNavigate('achievements')}><Award size={20} /><span>Serkeftin</span></button><button onClick={() => onNavigate('profile')}><UserRound size={20} /><span>Profîl</span></button></nav>
}
