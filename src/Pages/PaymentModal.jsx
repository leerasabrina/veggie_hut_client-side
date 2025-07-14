import Modal from "react-modal";
import Checkout from "./Checkout";


const PaymentModal = ({ isOpen, onClose, product, email, onSuccess }) => {
  return (
    <Modal isOpen={isOpen} onRequestClose={onClose} ariaHideApp={false}>
      <button onClick={onClose}>Close</button>
      <Checkout
        product={product}
        email={email}
        onSuccess={onSuccess} 
      />
    </Modal>
  );
};


export default PaymentModal;
