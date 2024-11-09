import { BrowserRouter, Routes, Route } from "react-router-dom";
import UserList from "./containers/UsersListContainer";
import CreateUser from "./containers/CreateUserContainer";
import TopNav from "./components/TopNav";

const App : React.FC = () => {
  return (
    <BrowserRouter>
      <TopNav />
      <Routes>
        <Route path="/" element={<UserList />} />
        <Route path="/create-user" element={<CreateUser />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
