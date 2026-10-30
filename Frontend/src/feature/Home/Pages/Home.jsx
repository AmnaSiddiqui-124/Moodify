import FaceExpression from '../../Expraations/components/FaceExprations'
import Player from '../Components/Player'
import { useSong } from '../Hook/useSong'
import './Home.scss'

const Home = () => {
  const { loading, error, handleGetSong } = useSong()

  return (
    <main className="home-page">
      <header className="home-header">
        <a className="home-brand" href="/" aria-label="Moodify home">
          <span className="home-brand__mark" aria-hidden="true">
            <i />
            <i />
            <i />
            <i />
          </span>
          <span>moodify</span>
        </a>
        <span className="home-header__tag">
          <span className="home-header__sparkle" aria-hidden="true">✦</span>
          YOUR MOOD, YOUR MUSIC
        </span>
      </header>

      <section className="home-content">
        <div className="home-intro">
          <span className="home-intro__eyebrow">
            <span className="home-intro__eyebrow-line" />
            A LITTLE MUSIC MAGIC
          </span>
          <h1>
            Music that
            <br />
            <span>feels like you.</span>
          </h1>
          <p>
            Take a breath, show us how you feel, and we’ll find a sound that
            meets you right there.
          </p>
          <div className="home-intro__note">
            <span className="home-intro__note-icon" aria-hidden="true">♫</span>
            <span>Made for the moment you’re in.</span>
          </div>
        </div>

        <FaceExpression
          onClick={(mood) => handleGetSong({ mood })}
          isLoading={loading}
          error={error}
        />
      </section>

      <p className="home-privacy">
        <span aria-hidden="true">✳</span>
        Your camera helps read your expression and stays on this device.
      </p>

      <Player />
    </main>
  )
}

export default Home
