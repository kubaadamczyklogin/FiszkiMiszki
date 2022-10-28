import { auth } from "./initDb.js";
import { onAuthStateChanged } from "firebase/auth";

export async function checkIfSignIn() {
  let userFromDb;
  onAuthStateChanged(auth, (currentUser) => {
      userFromDb = currentUser;
  });
  
  console.log()
  return userFromDb;  
}
