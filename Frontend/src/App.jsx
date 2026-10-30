import { RouterProvider } from "react-router"
import { router } from "./app.routes"
import "./feature/shared/style/globle.scss"
import { Authprovider } from "./feature/auth/auth.context"
import { SongContextProvider } from "./feature/Home/Song.context"



const App = () => {
  return (
    <Authprovider>
<SongContextProvider>
  <RouterProvider router={router}/>
  
  </SongContextProvider>      

    </Authprovider>
  )
}

export default App