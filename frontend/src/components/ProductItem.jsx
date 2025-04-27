import { useContext } from "react";
import PropTypes from "prop-types";
import { ShopContext } from "../context/ShopContext";
import { Link } from "react-router-dom";
import { getImageUrl } from "../../utils/imageHelper";

const ProductItem = ({
  _id,
  imageCover,
  images,
  title,
  price,
  loading = false,
  productType,
}) => {
  const { currency } = useContext(ShopContext);

  const productImage = imageCover || (images && images[0]);

  if (loading) {
    return (
      <div className="text-gray-700">
        <div className="cursor-not-allowed">
          <div className="overflow-hidden max-w-[500px] max-h-[500px] bg-gray-100 rounded-lg">
            <div className="w-[300px] h-[300px] bg-gray-300 animate-pulse" />
          </div>
          <div className="pt-3 pb-1 h-5 w-4/5 bg-gray-300 animate-pulse mt-2"></div>
          <div className="h-5 w-1/4 bg-gray-300 animate-pulse mt-2"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="text-gray-700">
      <Link
        onClick={() => scrollTo(0, 0)}
        to={`/product/${_id}`}
        className="cursor-pointer"
      >
        <div className="overflow-hidden max-w-[500px] max-h-[500px]">
          <img
            className="w-full h-full object-cover"
            src={getImageUrl(productImage)}
            alt={title}
            draggable={false}
          />
        </div>
        <p className="pt-3 pb-1 text-sm">{title}</p>
        <p className="text-sm font-medium">
          {currency}
          {price}
        </p>
      </Link>
    </div>
  );
};

ProductItem.propTypes = {
  _id: PropTypes.string.isRequired,
  imageCover: PropTypes.string,
  images: PropTypes.arrayOf(PropTypes.string),
  title: PropTypes.string.isRequired,
  price: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  loading: PropTypes.bool,
};

export default ProductItem;
