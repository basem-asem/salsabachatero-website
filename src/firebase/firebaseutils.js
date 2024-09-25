import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { db, storage, auth } from "./firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";

// Function to get Users data Based on UserType Query
export function getUsersByType(COLLECTION, USERTYPE) {
  return new Promise((resolve, reject) => {
    try {
      const UsersQuery = query(
        collection(db, COLLECTION),
        where("Role", "==", USERTYPE)
      );
      onSnapshot(UsersQuery, (querySnapshot) => {
        resolve(querySnapshot.docs.map((d) => ({ docid: d.id, ...d.data() })));
      });
    } catch (error) {
      reject(error);
    }
  });
}
// Function to get Users data Based on UserType Query
export function getFilteredData(COLLECTION,FilterField, FilterValue) {
  return new Promise((resolve, reject) => {
    try {
      const UsersQuery = query(
        collection(db, COLLECTION),
        where(FilterField, "==", FilterValue)
      );
      onSnapshot(UsersQuery, (querySnapshot) => {
        resolve(querySnapshot.docs.map((d) => ({ docid: d.id, ...d.data() })));
      });
    } catch (error) {
      reject(error);
    }
  });
}

// Function to get Collection All data
export function getStaticData(COLLECTION) {
  return new Promise((resolve, reject) => {
    try {
      const Query = collection(db, COLLECTION);
      onSnapshot(Query, (querySnapshot) => {
        resolve(querySnapshot.docs.map((d) => ({ docid: d.id, ...d.data() })));
      });
    } catch (error) {
      reject(error);
    }
  });
}
// Function to get the user by ID
export async function getUserData(userId) {
  try {
    const userDoc = await getDoc(doc(db, "users", userId));
    if (userDoc.exists()) {
      return { ...userDoc.data(), docid: userDoc.id };
    } else {
      throw new Error("User not found");
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
  }
}
// Function to get a document by collection and ID
export async function getDocumentData(collectionName, documentId) {
  try {
    const docRef = doc(db, collectionName, documentId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { ...docSnap.data(), docid: docSnap.id };
    } else {
      throw new Error(`${collectionName.slice(0, -1).toUpperCase()} not found`);
    }
  } catch (error) {
    console.error(`Error fetching ${collectionName.slice(0, -1)} data:`, error);
    throw error;
  }
}
// Function to get the user by Ref
export async function getUserDataByRef(userRef) {
    try {
      const userDoc = await getDoc(userRef);
      if (userDoc.exists()) {
        return { ...userDoc.data(), docid: userDoc.id };
      } else {
        throw new Error("User not found");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      throw error;
    }
  }

// Image Uploading
export const imageUploading = (UPLOAD_PATH, FILE) => {
  return new Promise(async (resolve, reject) => {
    try {
      const imageRef = ref(storage, `${UPLOAD_PATH}/${FILE.name}`);
      const uploadTask = uploadBytesResumable(imageRef, FILE);
      uploadTask.on(
        "state_changed",
        (snapshot) => {},
        (err) => {}
      );
      await uploadTask;
      const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
      resolve(downloadURL);
    } catch (error) {
      reject(error);
    }
  });
};

// Function to Create or Update Doc
export function Create_Update_Doc(COLLECTION, DATA, DOC_ID) {
  return new Promise((resolve, reject) => {
    try {
      if (DOC_ID) {
        const updateDocRef = doc(db, COLLECTION, DOC_ID);
        updateDoc(updateDocRef, DATA).then(() => {
          // Update Alert
          resolve("data.update");
        });
      } else {
        const newDocRef = doc(collection(db, COLLECTION));
        setDoc(newDocRef, DATA).then(() => {
          resolve("data.insert");
        });
      }
    } catch (error) {
      reject(error);
    }
  });
}
//create firebase account and its document 
export function createFirebaseAccountAndDocument(userData) {
  return new Promise(async (resolve, reject) => {
    try {
      // Step 1: Create Firebase account
      const { user } = await createUserWithEmailAndPassword(auth, userData.email, userData.password);
  
      // Step 2: Create user document in Firestore
      const usersCollectionRef = collection(db, "users");
      const timestamp = new Date();
  
      const userDoc = {
        ...userData,
        uid: user.uid,
        created_time: timestamp,
      };
      const docRef = doc(usersCollectionRef, user.uid);
      console.log(userDoc);

      await setDoc(docRef, userDoc);
      localStorage.setItem("userId",  user.uid);
      localStorage.setItem(
        "userdata",
        JSON.stringify(userDoc)
      );
      resolve("alert.message.login");
      console.log("Document written with ID: ", docRef.id);
    } catch (error) {
      reject(error);
    }
  });
}
// Function to delete a document from a specified collection by its ID
export const deleteDocument = async (collection, id) => {
  try {
    await deleteDoc(doc(db, collection, id));
    console.log(`Document with ID ${id} deleted successfully`);
  } catch (error) {
    console.error("Error deleting document: ", error);
  }
};

//create or Update subcollection Doc
export async function createOrUpdateSubcollectionDoc(collectionName, docRef, subcollectionName, subcollectionData) {
  if (!collectionName || !docRef || !subcollectionName || !subcollectionData) {
    throw new Error("Invalid input parameters");
  }

  const subcollectionRef = collection(docRef, subcollectionName);
  try {
    await setDoc(doc(subcollectionRef), subcollectionData); // Add the subcollection document
  } catch (error) {
    throw new Error(`Error creating/updating subcollection document: ${error.message}`);
  }
}


// export async function createOrUpdateSubcollectionDoc(COLLECTION, DOC_ID, SUBCOLLECTION, SUBCOLLECTION_DATA) {
//   try {
//     const mainDocRef = doc(db, COLLECTION, DOC_ID);
//     const subcollectionRef = collection(mainDocRef, SUBCOLLECTION);
//     const newDocRef = doc(collection(db, COLLECTION));
//     const subcollectionDocRef = doc(subcollectionRef); // Automatically generates a new document ID
//     await setDoc(newDocRef, SUBCOLLECTION_DATA);
//     return "subcollection.insertOrUpdate";
//   } catch (error) {
//     console.error("Error in createOrUpdateSubcollectionDoc:", error);
//     throw error;
//   }
// }