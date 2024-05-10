import { useState, useEffect } from "react";
import { db } from "../firebase";
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  deleteDoc,
  getDocs,
} from "firebase/firestore";

const useFirestore = (collectionName) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const collectionRef = collection(db, collectionName);
        const querySnapshot = await getDocs(collectionRef);
        const fetchedData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setData(fetchedData);
      } catch (error) {
        console.error("Error fetching data: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Cleanup function
    return () => {
      // Cleanup tasks if any
    };
  }, [collectionName]);

  const addData = async (newData) => {
    try {
      const docRef = await addDoc(collection(db, collectionName), newData);
      setData((prevData) => [...prevData, { ...newData, id: docRef.id }]);
    } catch (error) {
      console.error("Error adding data: ", error);
    }
  };

  const updateData = async (id, updatedData) => {
    try {
      await updateDoc(doc(db, collectionName, id), updatedData);
      setData((prevData) =>
        prevData.map((item) => (item.id === id ? updatedData : item))
      );
    } catch (error) {
      console.error("Error updating data: ", error);
    }
  };

  const deleteData = async (id) => {
    try {
      await deleteDoc(doc(db, collectionName, id));
      setData((prevData) => prevData.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Error deleting data: ", error);
    }
  };

  return { data, loading, addData, updateData, deleteData };
};

export default useFirestore;
