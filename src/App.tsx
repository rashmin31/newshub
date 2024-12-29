// src/App.tsx
import { BrowserRouter as Router } from "react-router-dom";
import Layout from "./components/Layout";
import { Provider } from "react-redux";
import { persistor, store } from "./store";
import { PersistGate } from "redux-persist/integration/react";

const App = () => {
    return (
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <Router>
                    <Layout />
                </Router>
            </PersistGate>
        </Provider>
    );
};

export default App;
