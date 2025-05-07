import React, { useEffect, useState, useRef } from "react";
import Slider from "react-slick";
import axios from "axios";
import { Link } from "react-router-dom";
import CountdownTimer from "./CountdownTimer";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./NewItems.css"; // Your custom styles

const NewItems = () => {
  const [items, setItems] = useState([]);
  const sliderRef = useRef(null);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const { data } = await axios.get(
          "https://us-central1-nft-cloud-functions.cloudfunctions.net/newItems"
        );
        setItems(data);
      } catch (err) {
        console.error("Error fetching new items:", err);
      }
    };

    fetchItems();
  }, []);

  // Custom arrow component
  const SampleArrow = ({ className, style, onClick, direction }) => (
    <button
      className={`${className} custom-arrow-button`}
      style={{ ...style }} // Keeps react-slick's positioning
      onClick={onClick}
      aria-label={direction === "next" ? "Next" : "Previous"}
    >
      {direction === "next" ? ">" : "<"}
    </button>
  );

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    nextArrow: <SampleArrow direction="next" />,
    prevArrow: <SampleArrow direction="prev" />,
    responsive: [
      {
        breakpoint: 1200,
        settings: { slidesToShow: 3 },
      },
      {
        breakpoint: 992,
        settings: { slidesToShow: 2 },
      },
      {
        breakpoint: 600,
        settings: { slidesToShow: 1 },
      },
    ],
  };

  return (
    <section id="section-items" className="no-bottom">
      <div className="container">
        <div className="row">
          <div className="col-lg-12 text-center">
            <h2>New Items</h2>
            <div className="small-border bg-color-2"></div>
          </div>
          <div className="col-lg-12">
            {items.length > 0 ? (
              <Slider {...settings} ref={sliderRef}>
                {items.map((item) => (
                  <div className="item" key={item.id}>
                    <div className="nft__item">
                      <div className="author_list_pp">
                        <Link to={`/author/${item.authorId}`}>
                          <img className="lazy" src={item.authorImage} alt="" />
                          <i className="fa fa-check"></i>
                        </Link>
                      </div>

                      <div className="de_countdown-wrapper">
                        <CountdownTimer expiryDate={item.expiryDate} />
                      </div>

                      <div className="nft__item_wrap">
                        <div className="nft__item_extra">
                          <div className="nft__item_buttons">
                            <button>Buy Now</button>
                            <div className="nft__item_share">
                              <h4>Share</h4>
                              <a href={`https://facebook.com/sharer/sharer.php?u=/item/${item.nftId}`} target="_blank" rel="noreferrer">
                                <i className="fa fa-facebook fa-lg"></i>
                              </a>
                              <a href={`https://twitter.com/intent/tweet?url=/item/${item.nftId}`} target="_blank" rel="noreferrer">
                                <i className="fa fa-twitter fa-lg"></i>
                              </a>
                              <a href={`mailto:?subject=Check out this NFT&body=/item/${item.nftId}`}>
                                <i className="fa fa-envelope fa-lg"></i>
                              </a>
                            </div>
                          </div>
                        </div>
                        <Link to={`/item-details/${item.nftId}`}>
                          <img className="lazy nft__item_preview" src={item.nftImage} alt={item.title} />
                        </Link>
                      </div>
                      <div className="nft__item_info">
                        <Link to={`/item-details/${item.nftId}`}>
                          <h4>{item.title}</h4>
                        </Link>
                        <div className="nft__item_price">{item.price} ETH</div>
                        <div className="nft__item_like">
                          <i className="fa fa-heart"></i> <span>{item.likes}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </Slider>
            ) : (
              <p>Loading new items...</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewItems;