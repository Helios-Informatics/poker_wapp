
import * as firebaseui from "firebaseui";
import { auth } from "./firebase";

// Initialisiere FirebaseUI
const ui = new firebaseui.auth.AuthUI(auth);

export const uiConfig = {
  signInOptions: [
    {
      provider: "password",
      requireDisplayName: true, // Optional: Setze auf false, wenn kein Anzeigename nötig ist
    },
  ],
  callbacks: {
    signInSuccessWithAuthResult: (authResult) => {
      console.log("Erfolgreich angemeldet:", authResult);
      return false; // Keine Weiterleitung, um auf der Seite zu bleiben
    },
  },
};

export default ui;
