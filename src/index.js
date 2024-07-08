import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter } from "react-router-dom";
import ModalProvider from "./Context/ModalContext";
import EditModalProvider from "./Context/EditModalContext";
import InputModalProvider from "./Context/InputModalContext";
import AdvertiserModalProvider from "./Context/AdvertiserModalContext";
import EditAdvertiserProvider from "./Context/EditAdvertiserContext";
import AdvertiserDummyHitProvider from "./Context/AdvertiserDummyHitContext";
import { PrimeReactProvider } from "primereact/api";
import "primereact/resources/primereact.css";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primeicons/primeicons.css";
import "./index.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <AdvertiserDummyHitProvider>
      <InputModalProvider>
        <EditModalProvider>
          <ModalProvider>
            <AdvertiserModalProvider>
              <EditAdvertiserProvider>
                <PrimeReactProvider>
                  <App />
                </PrimeReactProvider>
              </EditAdvertiserProvider>
            </AdvertiserModalProvider>
          </ModalProvider>
        </EditModalProvider>
      </InputModalProvider>
    </AdvertiserDummyHitProvider>
  </BrowserRouter>
);

reportWebVitals();
