//App.js
import { useState, useMemo, useEffect } from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Select from "react-select";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PaymentModal from "./pages/PaymentModal.js";

const config = require("./Apiconfig");

export default function ShopIndiaBootstrap() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [selectedvarient, setselectedvarient] = useState("");
  const [Item_variant, setItem_variant] = useState("");
  const [variantdrop, setvariantdrop] = useState([]);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedItem, setSelectedItem] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  // const [selectionSaved, setSelectionSaved] = useState(false);
  const [customerProfile, setCustomerProfile] = useState(null);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [categories, setCategories] = useState([]);
  const [profileOpen, setProfileOpen] = useState(false);



  useEffect(() => {
    const storedCustomer = sessionStorage.getItem("customerProfile");
    if (storedCustomer) {
      setCustomerProfile(JSON.parse(storedCustomer));
    }
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          `${config.apiBaseUrl}/getCategoriesMaster`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              company_code: "YJKT",
            }),
          }
        );

        const data = await response.json();

        if (response.ok) {
          const formatted = data.map((cat) => ({
            id: cat.Item_Category_Name,
            name: cat.Item_Category_Name,
            image: cat.Item_Category_Image
              ? bufferToBase64(cat.Item_Category_Image)
              : "https://via.placeholder.com/80",
          }));

          setCategories(formatted);
        }
      } catch (error) {
        console.error("Category fetch error:", error);
      }
    };

    fetchCategories();
  }, []);

  const navItems = [
    { id: 1, label: "Home", icon: "🏠" },
    { id: 2, label: "Categories", icon: "📂" },
    { id: 3, label: "My Orders", icon: "📦" },
    { id: 4, label: "Cart", icon: "🛒" },
    { id: 5, label: "Profile", icon: "👤" },
  ];




  // useEffect(() => {
  //   if (detailsOpen && selectedItem && !selectionSaved) {
  //     saveSelectionOrder();
  //     setSelectionSaved(true);
  //   }
  // }, [detailsOpen, selectedItem]);
  const saveSelectionOrderDetails = async () => {
    try {
      if (!selectedItem) return;

      const url = `${config.apiBaseUrl}/Recenty_ViewedInsert`;

      const Details = {

        Date: new Date().toISOString().split("T")[0],
        Customer_code: customerProfile?.customer_code,
        Item_code: selectedItem.id,
        company_code: "YJKT",
        Created_by: "HK",
      };

      await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Details),
      });
    } catch (error) {
      console.error("Selection detail save error:", error);
    }
  };

  useEffect(() => {
    if (!customerProfile?.customer_code) return;

    const fetchRecentlyViewed = async () => {
      try {
        const response = await fetch(
          `${config.apiBaseUrl}/getCategories`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              Customer_code: customerProfile.customer_code
            }),
          }
        );

        const data = await response.json();

        if (response.ok) {
          setRecentlyViewed(data || []);
        }
      } catch (err) {
        console.error("Recently viewed fetch error:", err);
      }
    };

    fetchRecentlyViewed();
  }, [customerProfile]);





  // INCREASE QTY
  const increaseQty = (id) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, qty: item.qty + 1 } : item
      )
    );
  };

  // DECREASE QTY
  const decreaseQty = (id) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, qty: Math.max(1, item.qty - 1) } : item
      )
    );
  };

  // REMOVE ITEM
  const removeFromCart = (item) => {
    setCart((prev) => prev.filter((i) => i.id !== item.id));
  };

  const subtotal = useMemo(() => {
    return cart.reduce((sum, item) => {
      return sum + item.price * item.qty;
    }, 0);
  }, [cart]);

  const addToCart = (product) => {
    setCart((prev) => {
      const exist = prev.find((item) => item.id === product.id);

      if (exist) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item
        );
      }

      return [
        ...prev,
        {
          ...product,
          qty: 1,
          // discountPer: product.discountPer
        },
      ];
    });
  };

  // Total discount amount
  const discountAmount = useMemo(() => {
    return cart.reduce((sum, item) => {
      const price = Number(item.price) || 0;
      const qty = Number(item.qty) || 0;
      const discount = Number(item.discountPer) || 0;

      const itemTotal = price * qty;
      return sum + (itemTotal * discount) / 100;
    }, 0);
  }, [cart]);

  // Final payable amount
  const total = useMemo(() => {
    return (Number(subtotal) || 0) - (Number(discountAmount) || 0);
  }, [subtotal, discountAmount]);

  const bufferToBase64 = (buffer) => {
    if (!buffer) return null;

    const binary = buffer.data
      .map((byte) => String.fromCharCode(byte))
      .join("");

    return `data:image/jpeg;base64,${window.btoa(binary)}`;
  };

  useEffect(() => {
    if (!sessionStorage.getItem("selectedCompanyCode")) {
      sessionStorage.setItem("selectedCompanyCode", "YJKT");
    }

    const company_code = sessionStorage.getItem("selectedCompanyCode");

    setLoading(true);

    fetch(`${config.apiBaseUrl}/ItemBrandData`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ company_code }),
    })
      .then((res) => res.json())
      .then((data) => {
        const formatted = data.map((item) => ({
          id: item.Item_code,
          name: item.Item_name,
          price: item.MRP_Price,
          descriptionText: item.Item_Description,
          discountPer: Number(item.discount_Percentage) || 0,
          description: `${item.Item_variant} | ${item.Item_sales_tax_type}`,
          image: item.item_images
            ? bufferToBase64(item.item_images)
            : "https://via.placeholder.com/200",
          tag: item.status,
        }));

        setProducts(formatted);
      })
      .catch((err) => console.error(err))
      .finally(() => {
        setLoading(false); // ✅ STOP LOADING
      });
  }, []);

  const handleChangeVariant = (selected) => {
    setselectedvarient(selected);
    setItem_variant(selected?.value || "");

    if (selected.value === "ALL") {
      fetchAllItems(); // ✔ now it exists
    }
  };

  const filteredOptionVariant = [
    { value: "ALL", label: "All" }, // 👈 Add this line
    ...variantdrop.map((option) => ({
      value: option.attributedetails_name,
      label: option.attributedetails_name,
    })),
  ];

  const fetchAllItems = () => {
    const company_code = sessionStorage.getItem("selectedCompanyCode");

    setLoading(true);

    fetch(`${config.apiBaseUrl}/ItemBrandData`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ company_code }),
    })
      .then((res) => res.json())
      .then((data) => {
        const formatted = data.map((item) => ({
          id: item.Item_code,
          name: item.Item_name,
          price: item.MRP_Price,
          discountPer: item.discount_Percentage || 0, // ✅ ADD THIS
          description: `${item.Item_variant} | ${item.Item_sales_tax_type}`,
          image: item.item_images
            ? bufferToBase64(item.item_images)
            : "https://via.placeholder.com/200",
          tag: item.status,
        }));
        setProducts(formatted);
      })
      .catch((err) => console.error("Error fetching all items:", err))
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    if (!sessionStorage.getItem("selectedCompanyCode")) {
      sessionStorage.setItem("selectedCompanyCode", "YJKT");
    }
    const company_code = sessionStorage.getItem("selectedCompanyCode");

    fetch(`${config.apiBaseUrl}/variant`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ company_code }),
    })
      .then((data) => data.json())
      .then((val) => setvariantdrop(val))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const handleSearch = () => {
    const company_code = sessionStorage.getItem("selectedCompanyCode");

    if (!Item_variant) {
      toast.warn("Please select a variant to search!");
      return;
    }

    setLoading(true);

    fetch(`${config.apiBaseUrl}/getItemVariant`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ company_code, Item_variant }),
    })
      .then(async (res) => {
        if (!res.ok) {
          // Handle HTTP errors
          const errMsg = await res.text(); // read the response text from Node
          throw new Error(errMsg || "Unknown error");
        }
        return res.json();
      })
      .then((data) => {
        if (!data || data.length === 0) {
          toast.info("No items found for this variant!");
          setProducts([]); // clear previous products
          return;
        }

        const formatted = data.map((item) => ({
          id: item.Item_code,
          name: item.Item_name,
          price: item.Item_std_sales_price,
          discountPer: Number(item.discount_Percentage) || 0, // ✅ ADD THIS
          description: `${item.Item_variant} | ${item.Item_sales_tax_type}`,
          image: bufferToBase64(item.item_images),
          tag: item.status,
        }));

        setProducts(formatted);
      })
      .catch((err) => {
        console.error("Search Error:", err);
        toast.error(err.message || "Error fetching data!");
      })
      .finally(() => {
        setLoading(false); // ✅ STOP LOADING
      });
  };

  const handlePlaceOrder = () => {
    setPaymentOpen(true);
  };

  const handleSaveButtonClick = async () => {
    if (cart.length === 0) {
      toast.warning("Cart is empty");
      return;
    }

    try {
      const screenType = "Sales"; // hard-coded

      const headerUrl = `${config.apiBaseUrl}/addSalesOrderHdr`;

      const Header = {
        company_code: "YJKT",
        Customer_code: customerProfile?.customer_code,
        customer_name: "Walk-in Customer",
        pay_type: "Cash",
        sales_type: "otherState",
        order_type: "Online",
        bill_date: new Date().toISOString().split("T")[0],
        sale_amt: subtotal,
        tax_amount: 0,
        bill_amt: total,
        roff_amt: 0,
        dely_chlno: "",
        sales_mode: "Counter",
        paid_amount: total,
        return_amount: 0,
        sales_order_no: null,
        created_by: "HK",
      };

      const response = await fetch(headerUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Header),
      });

      if (!response.ok) {
        throw new Error("Header insert failed");
      }

      const [{ transaction_no }] = await response.json();

      await saveInventoryDetails(transaction_no);

      toast.success(`Your Order Number is ${transaction_no}`);

      setCart([]);
      setCartOpen(false);
      setPaymentOpen(false);
    } catch (error) {
      console.error(error);
      toast.error("Error saving order");
    }
  };

  const saveInventoryDetails = async (transaction_no) => {
    try {
      const url = `${config.apiBaseUrl}/addSalesOrderDetail`;

      let serialNo = 1;

      for (const item of cart) {
        const Details = {
          company_code: "YJKT",
          bill_no: transaction_no,
          item_code: item.id,
          item_name: item.name,
          weight: 0,
          warehouse_code: "PON",
          bill_qty: item.qty,
          total_weight: 0,
          item_amt: item.price,
          bill_rate: item.price * item.qty,
          Customer_code: customerProfile?.customer_code,
          customer_name: "Walk-in Customer",
          pay_type: "Cash",
          sales_type: "otherState",
          bill_date: new Date().toISOString().split("T")[0],
          dely_chlno: "",
          ItemSNo: serialNo,
          tax_amt: 0,
          discount: item.discountPer || 0,
          discount_amount:
            (item.price * item.qty * (item.discountPer || 0)) / 100,
          created_by: "HK",
        };

        await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(Details),
        });

        serialNo++;
      }
    } catch (error) {
      console.error(error);
      toast.error("Error saving sales details");
    }
  };
  useEffect(() => {
    console.log(cart);
  }, [cart]);

  const getSkeletonCount = () => {
    if (products.length > 0) return products.length;
    if (window.innerWidth < 480) return 6;
    if (window.innerWidth < 768) return 8;
    if (window.innerWidth < 1024) return 10;
    return 12;
  };

  const skeletonCount = getSkeletonCount();

  return (
    <div className="app-container">
      <ToastContainer position="top-right" autoClose={3000} />
      <header className="shop-header">
        <div className="header-top">
          <div className="header-right">
            <nav className="nav-links">
              <nav className="nav-links">
                <a href="#" className="home-with-customer">
                  {customerProfile?.customer_code && (
                    <span className="customer-badge">
                      {customerProfile.customer_code}
                    </span>
                  )}
                  Home
                </a>
                <span
                  className="profile-icon"
                  title="My Profile"
                  onClick={() => window.location.href = "/profile"}
                >
                  👤
                </span>

                <a href="#">Categories</a>
                <a href="#">My Orders</a>
              </nav>

              <a href="#">Categories</a>
              <a href="#">My Orders</a>
            </nav>

            <button className="cart-btn" onClick={() => setCartOpen(true)}>
              🛒
              {cart.length > 0 && (
                <span className="cart-count">{cart.length}</span>
              )}
            </button>
          </div>
        </div>

        <div className="header-search">
          <Select
            className="variant-select"
            placeholder="Search products or variants"
            value={selectedvarient}
            onChange={handleChangeVariant}
            options={filteredOptionVariant}
          />
          <button className="search-btn" onClick={handleSearch}>
            Search
          </button>
        </div>
      </header>

      <div className="categories-frame">
        <div className="categories-scroll">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className={`category-circle ${activeCategory === cat.id ? "active" : ""
                }`}
              onClick={() => setActiveCategory(cat.id)}
            >
              <img src={cat.image} alt={cat.name} />
              <span>{cat.name}</span>
            </div>
          ))}
        </div>
      </div>

      {recentlyViewed.length > 0 && (
        <div className="recently-viewed-frame">
          <h4 className="section-title">Recently Viewed</h4>

          <div className="products-grid">
            {recentlyViewed.map((item) => {
              const mrp = Number(item.MRP_price) || 0;
              const discount = Number(item.discount_percentage) || 0;

              const finalPrice =
                discount > 0 ? mrp - (mrp * discount) / 100 : mrp;

              return (
                <div className="product-card" key={item.item_code}>
                  <img
                    src={
                      item.item_images
                        ? bufferToBase64(item.item_images)
                        : "https://via.placeholder.com/200"
                    }
                    alt={item.item_name}
                  />

                  <h4>{item.item_name}</h4>

                  {/* ✅ DISCOUNT BADGE */}
                  {discount > 0 && (
                    <span className="discount">{discount}% OFF</span>
                  )}

                  {/* ✅ PRICE SECTION (SAME AS PRODUCT GRID) */}
                  <div className="price">
                    {discount > 0 && <s>₹{mrp}</s>}
                    <strong>₹{finalPrice.toFixed(2)}</strong>
                  </div>

                  <button
                    onClick={() =>
                      addToCart({
                        id: item.item_code,
                        name: item.item_name,
                        price: finalPrice,
                        image: item.item_images
                          ? bufferToBase64(item.item_images)
                          : "https://via.placeholder.com/200",
                        discountPer: discount,
                      })
                    }
                  >
                    Add to Cart
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}



      <div className="products-grid">
        {loading
          ? Array.from({ length: skeletonCount }).map((_, i) => (
            <div className="product-card skeleton" key={i}>
              <div className="skeleton-img"></div>
              <div className="skeleton-text short"></div>
              <div className="skeleton-text"></div>
              <div className="skeleton-price"></div>
              <div className="skeleton-btn"></div>
            </div>
          ))
          : products.map((p) => {
            const finalPrice =
              p.discountPer > 0
                ? p.price - (p.price * p.discountPer) / 100
                : p.price;

            return (
              <div
                className="product-card"
                key={p.id}
                onClick={() => {
                  setSelectedItem(p);
                  setDetailsOpen(true);
                  saveSelectionOrderDetails();
                }}
              >

                <img src={p.image} alt={p.name} />

                <h4>{p.name}</h4>

                {p.discountPer > 0 && (
                  <span className="discount">{p.discountPer}% OFF</span>
                )}

                <div className="price">
                  {p.discountPer > 0 && <s>₹{p.price}</s>}
                  <strong>₹{finalPrice.toFixed(2)}</strong>
                </div>


                <button
                  onClick={(e) => {
                    e.stopPropagation(); // 👈 important
                    addToCart(p);
                  }}
                >
                  Add to Cart
                </button>

              </div>
            );
          })}
      </div>


      {cartOpen && (
        <div className="cart-overlay">
          <div className="cart-box">
            <div className="cart-header">
              <h3>Your Cart</h3>
              <button
                className="cart-close-btn"
                onClick={() => setCartOpen(false)}
              >
                ×
              </button>
            </div>

            {cart.length === 0 ? (
              <div className="empty-cart">
                <p>No items added yet</p>
              </div>
            ) : (
              <>
                <div className="cart-items">
                  {cart.map((item) => {
                    const offerPrice =
                      item.discountPer > 0
                        ? item.price - (item.price * item.discountPer) / 100
                        : item.price;

                    const itemTotal = offerPrice * item.qty;

                    return (
                      <div className="cart-item" key={item.id}>
                        <img
                          src={item.image}
                          alt={item.name}
                          className="cart-item-img"
                        />

                        <div className="cart-item-details">
                          <p className="cart-item-name">{item.name}</p>

                          {item.discountPer > 0 && (
                            <span className="cart-item-mrp">
                              ₹{item.price.toFixed(2)}
                            </span>
                          )}

                          <span className="cart-item-price">
                            ₹{offerPrice.toFixed(2)}
                          </span>

                          <div className="qty-controls">
                            <button onClick={() => decreaseQty(item.id)}>
                              -
                            </button>
                            <span>{item.qty}</span>
                            <button onClick={() => increaseQty(item.id)}>
                              +
                            </button>
                          </div>
                        </div>

                        <div className="cart-item-total">
                          ₹{itemTotal.toFixed(2)}
                        </div>

                        <button
                          className="remove-item-btn"
                          onClick={() => removeFromCart(item)}
                        >
                          ×
                        </button>
                      </div>
                    );
                  })}
                </div>

                <div className="cart-summary">
                  <div className="summary-row">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toFixed(2)}</span>
                  </div>

                  <div className="summary-row">
                    <span>Discount</span>
                    <span>-₹{discountAmount.toFixed(2)}</span>
                  </div>

                  <div className="summary-total">
                    <span>Total</span>
                    <span>₹{total.toFixed(2)}</span>
                  </div>
                </div>

                <button
                  className="place-order-btn"
                  onClick={() => setPaymentOpen(true)}
                >
                  Place Order
                </button>
              </>
            )}
          </div>
        </div>
      )}
      {detailsOpen && selectedItem && (
        <div className="center-modal-overlay">
          <div className="center-modal">
            <div className="center-modal-header">
              <h4>{selectedItem.name}</h4>
              <button
                className="center-modal-close"
                onClick={() => setDetailsOpen(false)}
              >
                ×
              </button>
            </div>

            <div className="center-modal-body">
              <img src={selectedItem.image} alt={selectedItem.name} />

              <p>
                <strong>Variant:</strong> {selectedItem.description}
              </p>

              {selectedItem.descriptionText && (
                <p>
                  <strong>Description:</strong><br />
                  {selectedItem.descriptionText}
                </p>
              )}

              <p>
                <strong>Price:</strong>{" "}
                {selectedItem.discountPer > 0 && (
                  <s>₹{selectedItem.price}</s>
                )}{" "}
                ₹
                {(
                  selectedItem.discountPer > 0
                    ? selectedItem.price -
                    (selectedItem.price * selectedItem.discountPer) / 100
                    : selectedItem.price
                ).toFixed(2)}
              </p>

              <button
                className="place-order-btn w-100 mt-2"
                onClick={() => {
                  addToCart(selectedItem);
                  setDetailsOpen(false);
                }}
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mobile-bottom-nav">
        <div className="nav-content">
          <div
            className="nav-indicator"
            style={{
              width: `${100 / navItems.length}%`,
              transform: `translateX(${activeIndex * 100}%)`,
            }}
          >
            <div className="curve-cutout"></div>
            <button
              className="floating-action-btn"
              onClick={() => {
                if (navItems[activeIndex].label === "Cart") {
                  setCartOpen(true);
                }
              }}
            >
              {navItems[activeIndex].icon}
              {navItems[activeIndex].label === "Cart" && cart.length > 0 && (
                <span className="cart-badge-mini">{cart.length}</span>
              )}
            </button>
          </div>

          {navItems.map((item, index) => (
            <div
              key={item.id}
              className={`nav-item ${activeIndex === index ? "active" : ""}`}
              onClick={() => {
                setActiveIndex(index);
                if (item.label === "Cart") setCartOpen(true);
                if (item.label === "Profile") {
                  window.location.href = "/profile";
                }
              }}
            >

              <span className="icon">{item.icon}</span>
              <span className="label">{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      <PaymentModal
        total={total}
        paymentOpen={paymentOpen}
        setPaymentOpen={setPaymentOpen}
        onConfirmOrder={handleSaveButtonClick}
      />
    </div>
  );
}
