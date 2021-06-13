import {useState, useEffect} from "react";
import './App.css';
import Header from './components/Header';
import Lyrics from './components/Lyrics';

function App() {
  // JSON dictionary object: songs[songTitle] = array of lyrics
  const [songs, setSongs] = useState({}); 
  // title of the current song
  const [song, setSong] = useState("Everyday")
  // index into songs object of current song
  const [songIndex, setSongIndex] = useState(0);
  // list of titles of songs
  const [songTitleList, setSongTitleList] = useState([])
  // current lyric index of current song
  const [lyricIndex, setLyricIndex] = useState(0);
  // boolean to either play lyrics or not
  const [playLyrics, setPlayLyrics] = useState(false);
  const [speedAdjustment, setSpeedAdjustment] = useState(0);

  const getData=()=>{
    fetch('songs.json', {
      headers : { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
        }
    }).then(function(response){
        return response.json();
    }).then(function(myJson) {
        setSongs(myJson);
        const tempSongList = [];
        for(const key in myJson) {
          tempSongList.push(key);
        }
        setSongTitleList(tempSongList);
      });
  }

  useEffect(()=>{
    getData()
  },[]);

  function switchSong(increment){
    setLyricIndex(0);
    setSpeedAdjustment(0);
    setPlayLyrics(false);
    if(songIndex === 0 && increment < 0) {
      setSongIndex(songTitleList.length - 1);
      setSong(songTitleList[songTitleList.length - 1]);
    }
    else if(songIndex === songTitleList.length - 1 && increment > 0) {
      setSongIndex(0);
      setSong(songTitleList[0]);
    }
    else {
      console.log('hello');
      console.log(songTitleList);
      console.log(songs);
      setSong(songTitleList[songIndex + increment]);
      setSongIndex(songIndex => songIndex + increment);
      console.log(song);
      console.log(songIndex);
    }
  }

  useEffect(() => {
    let interval = null;
    if (playLyrics) {
      interval = setInterval(() => {
        if (songs[song] && lyricIndex === songs[song].length - 1) {
          switchSong(1);
        }
        else {
          setLyricIndex(lyricIndex => lyricIndex + 1);
        }
      }, songs[song][lyricIndex].time + speedAdjustment);
    } else if (!playLyrics && lyricIndex !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [playLyrics, lyricIndex]);


  function KeyDown(key, action) {
    useEffect(() => {
        function onKeydown(e) {
            if (e.key === key) action()
        }
        window.addEventListener('keydown', onKeydown);
        return () => window.removeEventListener('keydown', onKeydown);
    }, [lyricIndex, speedAdjustment, playLyrics, songs, song, songTitleList, songIndex]);
  }
  
  KeyDown("p", () => {setPlayLyrics(true)}); // play
  KeyDown("s", () => {setPlayLyrics(false)}); // stop
  KeyDown("b", () => {switchSong(1)});  // back one song
  KeyDown("f", () => {switchSong(-1)}); // forward to next song
  KeyDown("i", () => {setSpeedAdjustment(speedAdjustment => speedAdjustment - 500)}); // increase speed
  KeyDown("d", () => {setSpeedAdjustment(speedAdjustment => speedAdjustment + 500)}); // decrease speed
  KeyDown("r", () => {setSpeedAdjustment(0)}); // reset speed

  let content = null;

  if (songs && songs["Everyday"]) {
    content = (
      <div className="App">
        <Header speedAdjustment={speedAdjustment} changeSpeed={setSpeedAdjustment} song={song} switchSong={switchSong} play={setPlayLyrics} isPlaying={playLyrics}/>
        <Lyrics lyricIndex={lyricIndex} songs={songs} song={song}/>
      </div>
    );
  }

  return content;
}

export default App;