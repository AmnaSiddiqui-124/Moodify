import { createContext } from "react";
import { useState } from "react";

export const songContext = createContext()


export const SongContextProvider = ({children})=>{
    const [song,setSong] = useState({

  "url": "https://ik.imagekit.io/hvgbzzbx6/cohort-2/moodify/songs/Angaaron__From__Pushpa_2_The_Rule____DownloadMing.WS__Hy98Y8pSW.mp3",
  "posterUrl": "https://ik.imagekit.io/hvgbzzbx6/cohort-2/moodify/posters/Angaaron__From__Pushpa_2_The_Rule____DownloadMing.WS__QSy96qTcH.jpeg",
  "title": "Angaaron (From 'Pushpa 2 The Rule') [DownloadMing.WS]",
  "mood": "Happy"  
})

const [loading , setLoading] = useState(false)

return(
    <songContext.Provider value={{loading,setLoading,song,setSong}}>
        {children}
    </songContext.Provider>
)





}