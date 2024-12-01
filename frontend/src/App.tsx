import { BrowserRouter, Routes, Route } from "react-router-dom";
import UserList from "./containers/UsersListContainer";
import CreateUser from "./containers/CreateUserContainer";
import TopNav from "./components/TopNav";
import { SliderComp } from "./components/Practice/SliderComp";

const App : React.FC = () => {
  return (
    <BrowserRouter>
      <TopNav />
      <Routes>
        <Route path="/home" element={<UserList />} />
        <Route path="/create-user" element={<CreateUser />} />
        <Route path="/slider" element={<SliderComp />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
