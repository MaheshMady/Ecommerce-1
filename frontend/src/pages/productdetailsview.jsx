import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Footer from "../components/footer";
import Navbar from "../components/navbar";
import Loading from "../components/Loading";

export default function ProductDetailsView() {
  const location = useLocation();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [products, setProducts] = useState([]);


  const isAuth = localStorage.getItem("token") && localStorage.getItem("role");

  useEffect(() => {
    if (location.state?.product) {
      fetchProduct(location.state.product);
    }
  }, [location.state]);

  useEffect(() => {
    if (product) {
      fetchproducts();
    }
  }, [product]);

  useEffect(() => {
  if (product) {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}, [product]);

  const fetchProduct = async (id) => {
    try {

      const res = await axios.get(
        `${import.meta.env.VITE_APP_API}/employee/${id}`,
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      setProduct(res.data?.data);
    } catch (error) {
      toast.error("Failed to load product details");
    }

  };

  const addToCart = () => {
    if (!isAuth) {
      toast.error("Please Login to Continue!");
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } else {
      let cart = JSON.parse(localStorage.getItem("cart")) || [];
      cart.push({ ...product, quantity: 1 });
      localStorage.setItem("cart", JSON.stringify(cart));
      toast.success("Product added to cart!");
    }
  };

  const fetchproducts = async () => {
    try {
 
      const res = await axios.get(import.meta.env.VITE_APP_API + "/employees", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      const allProducts = res.data.data || [];

      // filter related ones by name similarity (excluding the current product)
      const related = allProducts.filter(
        (item) =>
          item._id !== product._id &&
          item.product
            .toLowerCase()
            .includes(product.product.split(" ")[0].toLowerCase())
      );

      setProducts(related.length ? related : allProducts.slice(0, 3)); // fallback
    } catch (err) {
      toast.error("Failed to fetch Products");
    }

  };

  if (!product) return <>
     <Navbar/>
        <Loading/>
     <Footer/>
    </>


  return (
    <>
      <Navbar />
      <div className="container py-4 mt-5 pt-5 fade-in">
        <div className="row g-5 align-items-center">
          <div className="col-md-5 text-center">
            <div className="product-image-container">
              <img
                src={`${import.meta.env.VITE_APP_API}/${product.image}`}
                alt={product.product}
                className="img-fluid rounded shadow-lg product-image"
              />
            </div>
          </div>

          <div className="col-md-7">
            <h2 className="fw-bold product-title">{product.product}</h2>
            <p className="text-muted fs-6 mb-1">
              Sold by: <strong>{product.sellername}</strong>
            </p>
            <h3 className="text-success fw-bold mb-3 price-tag">
              ₹{product.price}
            </h3>
            <p className="text-secondary">{product.description}</p>
            <button className="btn add-cart-btn mt-3" onClick={addToCart}>
              Add to Cart
            </button>
          </div>
        </div>

        <hr className="my-5" />
        <h4 className="fw-semibold text-center mb-4 related-title">
          Related Products
        </h4>
        <div className="row justify-content-center fade-in-up">
          {products.slice(0, 3).map((val) => {
            return (
              <div className="col-10 col-sm-6 col-md-4 p-3">
                <div class="card related-card shadow-sm border-0">
                  <img
                    src={import.meta.env.VITE_APP_API + "/" + val.image}
                    class="card-img-top related-img"
                    alt="..."
                    height={"200px"}
                  />
                  <div class="card-body text-center">
                    <h5 class="card-title fw-semibold">{val.product}</h5>
                    <p class="card-text text-muted small">
                      {val.description.slice(0, 40)+"..."}
                    </p>
                    <button
                      type="button"
                      class="btn btn-sm view-btn"
                      onClick={() =>
                        navigate("/productdetailview", {
                          state: { product: val._id },
                        })
                      }
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <ToastContainer style={{ top: "100px" }}></ToastContainer>
      <Footer />

<style>
  {`
.fade-in {
  animation: fadeIn 1.2s ease forwards;
}
.fade-in-up {
  animation: fadeInUp 1.4s ease forwards;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(40px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Product Image Styling */
.product-image-container {
  position: relative;
  overflow: hidden;
  border-radius: 20px;
}

.product-image {
  width: 100%;
  height: 400px;
  object-fit: cover;
  border-radius: 20px;
  transition: all 0.5s ease;
}

.product-image:hover {
  transform: scale(1.05);
}

/* Adjust heights for different screen sizes */
@media (max-width: 992px) {
  .product-image {
    height: 320px;
  }
}

@media (max-width: 576px) {
  .product-image {
    height: 240px;
  }
}

.product-title {
  font-size: 2rem;
  background: linear-gradient(90deg, #0d6efd, #6610f2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.price-tag {
  font-size: 1.8rem;
  color: #00c853 !important;
}

.add-cart-btn {
  background: linear-gradient(90deg, #ff6f00, #ff9800);
  color: white;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  padding: 10px 25px;
  transition: all 0.3s ease;
  box-shadow: 0 0 10px rgba(255, 152, 0, 0.4);
}
.add-cart-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 0 18px rgba(255, 152, 0, 0.6);
}

.related-title {
  position: relative;
}
.related-title::after {
  content: "";
  position: absolute;
  width: 60px;
  height: 4px;
  background: linear-gradient(90deg, #0d6efd, #6610f2);
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  border-radius: 2px;
}

.related-card {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 15px;
  transition: all 0.4s ease;
  overflow: hidden;
}
.related-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 10px 25px rgba(13, 110, 253, 0.2);
}

.related-img {
  width: 100%;
  height: 200px;
  border-radius: 15px 15px 0 0;
  object-fit: cover;
  transition: transform 0.5s ease;
}
.related-card:hover .related-img {
  transform: scale(1.05);
}

.view-btn {
  background: linear-gradient(90deg, #0d6efd, #6610f2);
  color: #fff;
  border: none;
  border-radius: 8px;
  transition: all 0.3s ease;
  padding: 6px 16px;
}
.view-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 0 15px rgba(13, 110, 253, 0.4);
}

@media (max-width: 768px) {
  .product-title {
    font-size: 1.6rem;
  }
  .price-tag {
    font-size: 1.5rem;
  }
}
  `}
</style>

    </>
  );
}
