import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styles from "./Category.module.css";
import Poster from "../Poster/Poster";
import { Link } from "react-router-dom";

import { Modal, Form } from 'react-bootstrap';
import { useAuth, db } from "../../firebase";

import {
  collection,
  addDoc,
  query,
  where,
  updateDoc,
  doc,
  deleteDoc,
  getDocs,
  orderBy,
} from "firebase/firestore";

import {
  getStorage,
  uploadBytesResumable,
  getDownloadURL,
  ref as storageRef,
  deleteObject,
} from "firebase/storage";

import CustomInput from "../Custom/CustomInput/CustomInput";
import CustomArea from "../Custom/CustomArea/CustomArea";
import CustomButton from "../Custom/CustomButton/CustomButton";
import CustomSelect from "../Custom/CustomSelect/CustomSelect";

const Category = () => {
  const { categoryName } = useParams();
  const [products, setProducts] = useState([]);
  const user = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [priceFilter, setPriceFilter] = useState("");
  const [editedProduct, setEditedProduct] = useState({
    id: null,
    title: "",
    image: "",
    description: "",
    category: "",
    price: "",
  });
  const [newProduct, setNewProduct] = useState({
    title: "",
    image: "",
    description: "",
    category: "",
    price: "",
  });

  const options = [
    { value: "Кольца", label: "Кольца" },
    { value: "Серьги", label: "Серьги" },
    { value: "Цепочки", label: "Цепочки" },
    { value: "Часы", label: "Часы" },
    { value: "Браслеты", label: "Браслеты" },
    { value: "Подвески", label: "Подвески" },
    { value: "Колье", label: "Колье" },
    { value: "Броши", label: "Броши" }
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      if (categoryName) {
        let productsCollection = collection(db, "products");
    
        if (priceFilter === "lowest") {
          productsCollection = query(
            productsCollection,
            where("category", "==", categoryName),
            orderBy("price", "asc")
          );
        } else if (priceFilter === "highest") {
          productsCollection = query(
            productsCollection,
            where("category", "==", categoryName),
            orderBy("price", "desc")
          );
        } else {
          productsCollection = query(
            productsCollection,
            where("category", "==", categoryName)
          );
        }
        
        const querySnapshot = await getDocs(productsCollection);
        const productsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
    
        // Локальная сортировка данных
        const sortedProducts = productsData.sort((a, b) => {
          if (priceFilter === "lowest") {
            return a.price - b.price || a.id.localeCompare(b.id);
          } else if (priceFilter === "highest") {
            return b.price - a.price || a.id.localeCompare(b.id);
          } else {
            return a.id.localeCompare(b.id);
          }
        });
    
        setProducts(sortedProducts);
      }
    };
    
    fetchProducts();
  }, [categoryName, priceFilter]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    const storageReference = storageRef(getStorage(), `images/${file.name}`);
    const uploadTask = uploadBytesResumable(storageReference, file);
  
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Обработка состояния загрузки
      },
      (error) => {
        console.error(error);
      },
      async () => {
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          const updatedNewProduct = { ...newProduct, image: downloadURL };
          setNewProduct(updatedNewProduct);
        } catch (error) {
          console.error("Error getting download URL:", error);
        }
      }
    );
  };

  const formatPrice = (price) => {
    return parseFloat(price).toFixed(2);
  };

  const applyDiscountIfNeeded = (product) => {
    if (product.category === "Колье" || product.category === "Кольца") {
      const originalPrice = parseFloat(product.price);
      const discountPrice = originalPrice * 0.85; // 15% discount
      return { ...product, price: discountPrice.toFixed(2), originalPrice: originalPrice.toFixed(2) };
    }
    return { ...product, originalPrice: product.price }; // Store original price if no discount is applied
  };

  const addProduct = async () => {
    const productWithDiscount = applyDiscountIfNeeded(newProduct);
    const docRef = await addDoc(collection(db, "products"), productWithDiscount);
    processTextToList(newProduct.description);
    const addedProduct = { ...productWithDiscount, id: docRef.id };
    if (addedProduct.category === categoryName) {
      setProducts(prevProducts => [...prevProducts, addedProduct]);
    }
    closeModal();
  };

  const saveProduct = async () => {
    const productWithDiscount = applyDiscountIfNeeded(editedProduct);
    await updateDoc(doc(db, "products", editedProduct.id), productWithDiscount);
    processTextToList(newProduct.description);
    const updatedPosts = products.map((product) =>
      product.id === editedProduct.id ? productWithDiscount : product
    );
    setProducts(updatedPosts);
    closeModal();
  };

  const deleteProduct = async (productId, imagePath) => {
    try {
      await deleteDoc(doc(db, "products", productId));
      
      const storage = getStorage();
      const imageStorageRef = storageRef(storage, imagePath);
      await deleteObject(imageStorageRef);
  
      const updatedProducts = products.filter((post) => post.id !== productId);
      setProducts(updatedProducts);
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const openEditModal = (product) => {
    setIsEditing(true);
    setEditedProduct(product);
    setShowModal(true);
  };

  const openAddModal = () => {
    setIsEditing(false);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditedProduct({ id: null, title: "", image: "", description: "", category: "", price: "" });
    setNewProduct({ title: "", image: "", description: "", category: "", price: "" });
    setIsEditing(false);
  };

  const processTextToList = (text) => {
    const lines = text.split('\n');
    const listItems = lines.map((line) => `<li>${line.trim()}</li>`);
    return `<ul>${listItems.join('')}</ul>`;
  };

  return (
    <>
      <Poster />
      <section className={styles.wrapper}>
        <h2 className={styles.titleCategory}>{categoryName}</h2>
        <div className={styles.filter}>
          <p>Фильтр:</p>
          <CustomSelect
            options={[
              { value: "", label: "Без фильтра" },
              { value: "lowest", label: "От самой низкой цены" },
              { value: "highest", label: "От самой высокой цены" }
            ]}
            placeholder="Выберите"
            value={priceFilter}
            handleChange={(e) => setPriceFilter(e.target.value)}
          />
        </div>

        {user && user.isAdmin && (
          <div className={styles.adminButton}>
            <CustomButton
              width = "110px"
              height="35px"
              fontSize = "18px"
              label="Добавить"
              handleClick={openAddModal}
            />
          </div>
        )}

        <Modal show={showModal} onHide={closeModal}>
          <Modal.Header closeButton>
            <Modal.Title>
              {isEditing ? "Редактирование продукта" : "Добавить продукт"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="pt-2 pb-2" controlId="formTitle">
                <Form.Label>Название:</Form.Label>
                <CustomInput
                  placeholder="Название"
                  type="text"
                  width="100%"
                  height="40px"
                  value={isEditing ? editedProduct.title : newProduct.title}
                  handleChange={(e) =>
                  isEditing
                    ? setEditedProduct({ ...editedProduct, title: e.target.value })
                    : setNewProduct({ ...newProduct, title: e.target.value })
                  }
                />
              </Form.Group>
              <Form.Group className="pt-2 pb-2" controlId="formImage">
                <Form.Label>Изображение:</Form.Label>
                <Form.Control
                  className={styles.imgInput}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </Form.Group>
              <Form.Group className="pt-2 pb-2" controlId="formDescription">
                <Form.Label>Описание:</Form.Label>
                <CustomArea
                  name="description"
                  rows="5"
                  width="100%"
                  placeholder="Введите описание поста"
                  handleChange={(e) =>
                    isEditing
                      ? setEditedProduct({
                          ...editedProduct,
                          description: e.target.value,
                        })
                      : setNewProduct({ ...newProduct, description: e.target.value })
                  }
                  value={
                    isEditing ? editedProduct.description : newProduct.description
                  }
                />
              </Form.Group>
              <Form.Group className="pt-2 pb-2" controlId="formCategory">
                <Form.Label>Категория:</Form.Label>
                <CustomSelect
                  options={options}
                  placeholder="Выбор категории"
                  value={isEditing ? editedProduct.category : newProduct.category}
                  handleChange={(e) =>
                    isEditing
                      ? setEditedProduct({ ...editedProduct, category: e.target.value })
                      : setNewProduct({ ...newProduct, category: e.target.value })
                    }
                />
              </Form.Group>
              <Form.Group className="pt-2 pb-2" controlId="formPrice">
                <Form.Label>Цена:</Form.Label>
                <CustomInput
                  placeholder="Цена"
                  classNames={styles.titleInput}
                  type="number"
                  width="100%"
                  height="40px"
                  value={isEditing ? editedProduct.price : newProduct.price}
                  handleChange={(e) =>
                  isEditing
                    ? setEditedProduct({ ...editedProduct, price: e.target.value })
                    : setNewProduct({ ...newProduct, price: e.target.value })
                  }
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <CustomButton
              color="#949494"
              colorHover="#a9a9a9"
              label="Закрыть"
              fontSize="16px"
              width="110px"
              height="40px"
              handleClick={closeModal}
            />
            <CustomButton
              label={isEditing ? "Изменить" : "Добавить"}
              fontSize="16px"
              width="110px"
              height="40px"
              handleClick={isEditing ? saveProduct : addProduct}
            />
          </Modal.Footer>
        </Modal>

        <div className={styles.list}>
          {products.map((product) => (
            <div key={product.id} className={styles.productBlock}>
            <Link to={`/products/${product.id}`} className={styles.product}>
              <div
                className={styles.image}
                style={{ backgroundImage: `url(${product.image})` }}
              />

              <div className={styles.wrapper2}>
                <h3 className={styles.title}>{product.title}</h3>
                <div className={styles.info}>
                  <div className={styles.prices}>
                    {product.originalPrice !== product.price && (
                      <div className={styles.oldPrice}><del>{product.originalPrice}</del></div>
                    )}
                    <div className={styles.price}>{formatPrice(product.price)} $</div>
                  </div>
                  <div className={styles.purchases}>
                    {Math.floor(Math.random() * 20 + 1)} заказов
                  </div>
                </div>
              </div>
            </Link>

              {user && user.isAdmin && (
              <div className={styles.editButtons}>
                <CustomButton
                  label="Редактировать"
                  width="95%"
                  fontSize="14px"
                  handleClick={() => openEditModal(product)}
                />
                <CustomButton
                  width="95%"
                  fontSize="14px"
                  color="#949494"
                  colorHover="#a9a9a9"
                  label="Удалить"
                  handleClick={() => deleteProduct(product.id, product.image)}
                />
              </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </>
  );
};

export default Category;
