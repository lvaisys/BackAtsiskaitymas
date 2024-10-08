import { Routes, Route } from 'react-router-dom';
import Library from './Components/Pages/Library';
import MainOutlet from './Components/Outlets/MainOutlet';
import Home from './Components/Pages/Home';
import SpecificBook from './Components/Pages/SpecificBook';

const App = () => {
  return (
    <Routes>
      <Route path='' element={<MainOutlet />}>
        <Route index element={<Home />} />
        <Route path='/books' element={<Library />} />
        <Route path='/books/:id' target="_blank" element={<SpecificBook />} />
      </Route>
    </Routes>
  );
}

export default App;

