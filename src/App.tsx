import "./App.css";
import {
  Route,
  BrowserRouter as Router,
  Routes,
  Navigate,
} from "react-router-dom";
import { PersistGate } from "redux-persist/integration/react";
import { persistor, store } from "./store";
import { Provider } from "react-redux";
import { HomePage } from "./pages/home/home";

const routes = [{ path: "/home", element: <HomePage />, exact: true }];

const App = () => {
  return (
    <main className="App">
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <Router>
            <Routes>
              {routes.map((route) => (
                <Route
                  path={route.path}
                  element={route.element}
                  key={route.path}
                />
              ))}
              <Route path="*" element={<Navigate to="/home" replace />} />
            </Routes>
          </Router>
        </PersistGate>
      </Provider>
    </main>
  );
};
export default App;
