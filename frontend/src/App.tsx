import { BrowserRouter, Routes, Route } from "react-router-dom";
import UserList from "./containers/UsersListContainer";
import CreateUser from "./containers/CreateUserContainer";
import TopNav from "./components/TopNav";
import { SliderComp } from "./components/Practice/SliderComp";
import { BatchComp } from "./components/Practice/BatchComp";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <TopNav />
      <Routes>
        <Route path="/home" element={<UserList />} />
        <Route path="/create-user" element={<CreateUser />} />
        <Route path="/slider" element={<SliderComp />} />
        <Route path="/batch" element={<BatchComp />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
